---
layout: post
title: "Bypassing Image Anti-Hotlinking with Nginx Reverse Proxy"
date: 2025-06-15 16:04:00+1000
description: A guide on implementing an Nginx reverse proxy to solve image hotlinking issues in RSS feeds. Learn how to bypass anti-hotlinking protection while maintaining ethical usage, including server-side caching, dynamic DNS resolution, and automated URL conversion techniques.
tags: Linux, Nginx, Glance, Proxy
categories: WebDev, Self-hosted
image: /assets/img/posts/june-15-pm0404.png
giscus_comments: true
related_posts: true
toc:
  sidebar: right
---

<div class="text-center mt-3">
    {% include figure.liquid loading="eager" path="assets/img/posts/june-15-pm0404.png" class="img-fluid rounded z-depth-1 w-100" %}
</div>
<div class="caption" style="font-style: italic;">
  <b>15 JUNE PM 04:04</b>
</div>

<!-- prettier-ignore -->
> ##### ⚠️ Usage Warning
>
> This technique should only be used for legitimate aggregation of publicly available RSS content. Do not use it for bypassing paywalls, accessing private content, or commercial redistribution.
{: .block-danger }

When setting up my [Glance](https://github.com/glanceapp/glance) dashboard to display feeds from various content platforms, I ran into a frustrating problem: images weren't loading. Instead of the expected thumbnails and cover images that make a dashboard visually engaging, I was seeing broken image placeholders scattered throughout my feeds.

---

## The Problem

Opening the browser's developer console revealed the culprit immediately. Error messages like this were appearing repeatedly:

```
GET https://cdn.example.com/images/photo.jpg 403 (Forbidden)
Failed to load resource: the server responded with a status of 403 (Forbidden)
```

These `403 Forbidden` errors were blocking external images from RSS feeds, yet the same URLs worked when opened directly in the browser. The image servers' referrer policy of `strict-origin-when-cross-origin` was causing them to reject requests coming from my domain, triggering anti-hotlinking protection.

### Understanding the Root Cause

The problem stemmed from how content platforms protect their images from unauthorized use. Most platforms implement anti-hotlinking protection by checking the `Referer` header in image requests. Here's what was happening:

1. **Referrer checking:** When my dashboard requested an image, the CDN server would examine the `Referer` header.
2. **Domain mismatch:** Since requests came from my dashboard's domain rather than the platform's own website, the server treated them as unauthorized.
3. **Inconsistent blocking:** Different CDN subdomains had varying levels of protection, explaining why some images loaded while others didn't.

This was particularly maddening because the same images would load perfectly when I opened them directly in a new browser tab, but they'd fail when embedded in my dashboard. The RSS feeds themselves parsed correctly with all the text content intact, but without the visual elements, my dashboard looked broken.

---

## Cloudflare Workers: From Perfect Solution to Dead End

My first instinct was to reach for Cloudflare Workers—it used to be the perfect solution for this kind of proxy problem. I could write a simple function to intercept image requests, fetch them with the proper headers, and return them with CORS headers enabled. The edge computing model would even provide great performance with global distribution.

However, when I checked Cloudflare's current [Terms of Service](https://www.cloudflare.com/en-au/terms/) (last updated December 3, 2024), I discovered a clause in section 2.2.1 that stopped me in my tracks:

> "(j) use the Services to provide a virtual private network or other similar proxy services."

This restriction effectively rules out using Workers for image proxying, as it would fall under "similar proxy services." While this clause may have existed before, Cloudflare has been increasingly strict about enforcing it.

The risk simply wasn't worth it. Getting my account suspended would affect not just this dashboard project, but potentially other services I was running on the Cloudflare. I needed a solution that was both effective and compliant with current service terms.

---

## Self-Hosted Nginx Reverse Proxy: The Solution

Since I was already running Glance on my own VPS, I decided to implement a reverse proxy using Nginx on the same server. This approach would give me complete control while avoiding any third-party terms of service violations. The beauty of this solution is that it uses my existing infrastructure without requiring additional hosting costs.

### Setting Up Server-Side Caching

I added a server-side cache to the Nginx configuration to improve performance and reduce load on the external CDNs. This cache stores images for 14 days (336 hours), ensuring that frequently viewed images load instantly on subsequent visits.

```nginx
# /etc/nginx/nginx.conf
http {
    ##
    # Cache Settings
    ##
    proxy_cache_path /var/cache/nginx/images
                     levels=1:2
                     keys_zone=images:10m
                     max_size=1g
                     inactive=336h
                     use_temp_path=off;

    # ... rest of http config
    include /etc/nginx/sites-enabled/*;
}
```

### Configuring the Image Proxy

Then I configured the image proxy in my site configuration. The key insight was using dynamic DNS resolution to handle multiple CDN providers through a single proxy path. Here's the configuration I added to my existing server block:

```nginx
# /etc/nginx/sites-available/dashboard.example.com
server {
    server_name dashboard.example.com;

    # DNS resolver for dynamic proxy
    resolver 127.0.0.53 valid=300s;
    resolver_timeout 5s;

    # Existing Glance application
    location / {
        proxy_pass http://localhost:8080;
        # ... existing headers
    }

    # Image proxy for external CDNs
    location ~ ^/img-proxy/([^/]+)/(.*)$ {
        set $backend_host $1;
        set $backend_path $2;

        # Enable proxy caching
        proxy_cache images;
        proxy_cache_valid 200 336h;
        proxy_cache_key "$backend_host$backend_path";
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;

        # Proxy to external CDN
        proxy_pass https://$backend_host/$backend_path;

        # Essential headers for bypassing anti-hotlinking
        proxy_set_header Referer "https://$backend_host/";
        proxy_set_header User-Agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
        proxy_set_header Host $backend_host;

        # SSL configuration
        proxy_ssl_verify off;
        proxy_ssl_server_name on;

        # Add CORS and cache headers
        add_header Access-Control-Allow-Origin "*" always;
        add_header Cache-Control "public, max-age=1209600" always;
        add_header X-Cache-Status $upstream_cache_status always;

        # Basic protection against abuse
        valid_referers none blocked dashboard.example.com;
        if ($invalid_referer) {
            return 403;
        }
    }

    # ... existing SSL configuration
}
```

The magic happens in the regex location block. By capturing the hostname and path in separate variables, I could support any external CDN domain through my proxy. The URL transformation is clean:

```
Original:  https://cdn.platform.com/images/photo.jpg
Proxied:   https://dashboard.example.com/img-proxy/cdn.platform.com/images/photo.jpg
```

After setting up the configuration, I created the cache directory:

```bash
sudo mkdir -p /var/cache/nginx/images
sudo chown -R www-data:www-data /var/cache/nginx/images
sudo chmod -R 755 /var/cache/nginx/images
sudo nginx -t && sudo systemctl reload nginx
```

### Automating Image URL Conversion

With the Nginx proxy in place, I needed a way to automatically convert external image URLs in my Glance dashboard. Rather than manually updating every RSS feed configuration, I wrote a client-side script that would handle the conversion transparently.

I added this JavaScript to my Glance configuration as a custom `.js` file:

```javascript
(function () {
  // CDN domains that commonly implement anti-hotlinking
  const BLOCKED_DOMAINS = ["cdn.example.com", "images.platform.com", "static.service.net"];

  function convertExternalImages() {
    const selector = BLOCKED_DOMAINS.map((domain) => `img[src*="${domain}"]:not([data-converted])`).join(",");

    document.querySelectorAll(selector).forEach((img) => {
      try {
        const originalSrc = img.src;
        const proxySrc = originalSrc.replace(/https?:\/\/([^/]+)\//g, "/img-proxy/$1/");

        img.src = proxySrc;
        img.setAttribute("data-converted", "true");
        console.log("Converting:", originalSrc, "→", proxySrc);
      } catch (error) {
        console.error("Failed to convert image:", error);
      }
    });
  }

  if (document.readyState !== "loading") {
    convertExternalImages();
  } else {
    document.addEventListener("DOMContentLoaded", convertExternalImages);
  }

  // Check for new images every 3 seconds
  setInterval(convertExternalImages, 3000);
})();
```

The script maintains a list of problematic CDN domains and only processes images from those sources. When it detects a blocked image, it uses regex to rebuild the URL to route through my proxy. This focused approach avoids wasting resources on images that already load fine.

### Results and Testing

After implementing both components, I tested the setup:

```javascript
// Test in browser console
fetch("/img-proxy/cdn.platform.com/images/test.jpg")
  .then((response) => console.log("Status:", response.status, response.statusText))
  .catch((error) => console.error("Error:", error));
```

The test returned `Status: 200 OK`, confirming the proxy was working correctly with proper CORS headers.

With the proxy confirmed working, the dashboard transformation was impressive. Images that had been broken placeholders now loaded correctly throughout my feeds. RSS content became visually rich with thumbnails and cover images that made the dashboard much more engaging.

The JavaScript automatically converts problematic image URLs as new RSS content loads. When fresh content appears, any images from blocked domains are quickly converted to use the proxy route. The 14-day cache configuration means once an image loads through the proxy, subsequent views are instant.

### Verifying Cache Performance

To verify that the caching was working as intended, I checked the Nginx cache directory:

```bash
# Count cached files
sudo find /var/cache/nginx/images -type f | wc -l

# Check cache size
sudo du -sh /var/cache/nginx/images
```

The cache was working as intended, with files being created and deleted as expected.

---

## Responsible Usage

This solution requires thoughtful implementation to respect both technical constraints and content platforms. The 14-day caching configuration significantly reduces load on source CDNs—an image that might be viewed dozens of times only generates a single upstream request.

The referrer validation prevents unauthorized access. The `valid_referers` directive restricts proxy usage to requests originating from my dashboard domain, ensuring it can't be exploited as an open relay by external users.

When implementing similar solutions, consider the scope and purpose of your usage to maintain ethical standards and avoid potential service violations.
