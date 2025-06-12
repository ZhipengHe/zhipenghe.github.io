---
layout: post
title: "Jekyll LiveReload vs WebSocket Secure: A Protocol Compatibility Issue"
date: 2025-06-12 02:37:38+1000
description: Jekyll's LiveReload breaks with HTTPS reverse proxies in OrbStack due to WebSocket limitations. Testing with other tools proves it's Jekyll's problem, not the proxy's.
tags: Jekyll, Docker, WebSocket
categories: WebDev
image: /assets/img/posts/OrbStack-Setting-Domain.png
giscus_comments: true
related_posts: true
code_diff: true
toc:
  sidebar: right
---

## The Problem

<div class="text-center mt-3">
    {% include figure.liquid loading="eager" path="assets/img/posts/OrbStack-Setting-Domain.png" class="img-fluid rounded z-depth-1 w-100" %}
</div>
<div class="caption" style="font-style: italic;">
    I have to disable "Allow access to container domains & IPs" in OrbStack to make LiveReload work for Jekyll.
</div>

I recently switched from Docker Desktop to OrbStack because of its better performance and native macOS integration. One of OrbStack's convenient features is automatic domain name assignment for containers. Instead of remembering port numbers, containers get clean URLs like `https://container-name.orb.local` with automatic HTTPS certificates. This makes accessing development services much more elegant than dealing with `localhost:3000`, `localhost:4000`, etc.

However, when I maintain my Jekyll-based website in a container, this convenient feature introduced an unexpected issue with LiveReload that took some detective work to understand.

When I try to use the OrbStack generated domain name `https://jekyll.zhipenghegithubio.orb.local/` to access my Jekyll site, LiveReload crashes immediately with the following error:

```
jekyll-1  | LiveReload experienced an error. Run with --trace for more information.
jekyll-1  | /usr/local/bundle/gems/jekyll-4.4.1/lib/jekyll/commands/serve/websockets.rb:44:in 'HTTP::Parser#<<': Could not parse data entirely (0 != 247) (HTTP::Parser::Error)
jekyll-1  | 	from /usr/local/bundle/gems/jekyll-4.4.1/lib/jekyll/commands/serve/websockets.rb:44:in 'Jekyll::Commands::Serve::HttpAwareConnection#dispatch'
jekyll-1  | 	from /usr/local/bundle/gems/em-websocket-0.5.3/lib/em-websocket/connection.rb:79:in 'EventMachine::WebSocket::Connection#receive_data'
jekyll-1  | 	from /usr/local/bundle/gems/eventmachine-1.2.7/lib/eventmachine.rb:195:in 'EventMachine.run_machine'
jekyll-1  | 	from /usr/local/bundle/gems/eventmachine-1.2.7/lib/eventmachine.rb:195:in 'EventMachine.run'
jekyll-1  | 	from /usr/local/bundle/gems/jekyll-4.4.1/lib/jekyll/commands/serve/live_reload_reactor.rb:42:in 'block in Jekyll::Commands::Serve::LiveReloadReactor#start'
```

If revisiting the page, it will show `502 Bad Gateway` error and `OrbStack proxy error: dial tcp 192.168.97.2:8080: connect: connection refused`.

The WebSocket parsing error doesn't just break LiveReload—it crashes the entire Jekyll server. This means the site becomes completely inaccessible until the container is restarted. Here's what I discovered after systematically testing different configurations.

---

## Testing with Another WebSocket Application

Facing this crash, I needed to understand what was causing it. Was this an issue with OrbStack's reverse proxy, Jekyll's implementation, or something else entirely? To isolate the problem, I decided to test whether other WebSocket applications had the same issue in the identical setup.

```bash
docker run -p 8080:8080 jmalloc/echo-server
```

I then tested both access methods:

- Direct access: `http://localhost:8080/.ws`
- OrbStack domain: `https://condescending_solomon.orb.local/.ws` (The container name `condescending_solomon` is automatically generated)

**Result:** Both worked perfectly! The WebSocket echo server had no problems connecting and echoing messages through either direct access or OrbStack's domain routing.

Looking at the browser's network tab revealed the difference in WebSocket connection types:

- Direct: `ws://localhost:8080/` (plain WebSocket)
- OrbStack: `wss://condescending_solomon.orb.local/` (WebSocket Secure)

Both WebSocket connections established successfully and functioned normally. The echo server handled both WS and WSS connections gracefully. **This proved that OrbStack's reverse proxy handles WebSockets correctly** - the issue was specific to Jekyll, not OrbStack.

---

## The Real Issue: Jekyll's WebSocket Limitation

With OrbStack ruled out as the culprit, I investigated Jekyll-specific WebSocket issues and found this isn't an isolated problem. [Jekyll GitHub issue #9495](https://github.com/jekyll/jekyll/issues/9495) documents the exact same error occurring when Jekyll runs behind reverse proxies like Caddy.

The issue report contains a crucial finding from direct testing of Jekyll's WebSocket behavior:

- **Plain WebSocket (`ws://`) connections work fine**
- **Secure WebSocket (`wss://`) connections crash Jekyll**

The report explains: _"The Jekyll LiveReload barfs when it receives the encrypted data, because it can't parse it."_ Most importantly, the investigation proved this was caused by a specific Jekyll change: _"I can confirm that [reverting PR #8718] fixes this issue; LiveReload works as expected even over reverse-proxied HTTPS URLs."_ This definitively links the problem to Jekyll 4.3.2's protocol detection change.

### Understanding Jekyll's Change in PR #8718

The issue stems from a change in Jekyll 4.3.2 ([PR #8718](https://github.com/jekyll/jekyll/pull/8718)) that modified how LiveReload script injection works.

**Before Jekyll 4.3.2:**

- Jekyll always used hardcoded `http://` for LiveReload connections
- Even HTTPS pages made plain WebSocket (`ws://`) connections to LiveReload
- This worked fine with reverse proxies

**After Jekyll 4.3.2:**

- Jekyll switched to using `location.protocol` to dynamically detect the page protocol
- HTTPS pages now attempt WebSocket Secure (`wss://`) connections to LiveReload
- This breaks Jekyll's WebSocket server

Here is the diff of the change in the [PR #8718](https://github.com/jekyll/jekyll/pull/8718):

```diff2html

diff --git a/lib/jekyll/commands/serve/servlet.rb b/lib/jekyll/commands/serve/servlet.rb
index 2544616adf3..cee9c663a8a 100644
--- a/lib/jekyll/commands/serve/servlet.rb
+++ b/lib/jekyll/commands/serve/servlet.rb
@@ -101,7 +101,7 @@ def template
           @template ||= ERB.new(<<~TEMPLATE)
             <script>
               document.write(
-                '<script src="http://' +
+                '<script src="' + location.protocol + '//' +
                 (location.host || 'localhost').split(':')[0] +
                 ':<%=@options["livereload_port"] %>/livereload.js?snipver=1<%= livereload_args %>"' +
                 '></' +
```

While this seemed like a logical improvement for HTTPS sites, it revealed that Jekyll's WebSocket implementation has a fundamental limitation: it cannot handle WSS connections.

Other WebSocket implementations (like the echo server) handle both WS and WSS connections gracefully, but Jekyll's LiveReload server is limited to plain WebSocket connections only.

---

## The Architecture Problem

The incompatibility creates a fundamental mismatch in modern HTTPS development environments:

```
Browser (HTTPS page) → wants WSS connection
     ↓
Jekyll LiveReload → only supports WS connection
     ↓
= Protocol incompatibility → Crash
```

When accessing Jekyll through any HTTPS reverse proxy:

1. **Browser sees HTTPS page** → uses `location.protocol` to determine WebSocket protocol
2. **Browser attempts WSS connection** to match the secure page protocol
3. **Jekyll's EventMachine parser receives encrypted data** but can only handle plain text
4. **Parser crashes** trying to interpret encrypted frames as plain WebSocket data

### Impact on Development Environments

This limitation affects Jekyll's compatibility with modern development setups:

- **Any HTTPS reverse proxy** (OrbStack, Caddy, nginx, Traefik)
- **Container orchestration** (Docker Compose with HTTPS, Kubernetes ingress)
- **Development tools** that provide automatic HTTPS (like OrbStack's domains)
- **Production-like environments** where HTTPS is standard

Jekyll 4.3.2+ is fundamentally incompatible with HTTPS development environments that use LiveReload. The previous hardcoded `http://` approach accidentally worked around this limitation by forcing plain WebSocket connections even from HTTPS pages.

## Time to Move On from Jekyll?

Jekyll's popularity has been steadily declining as modern static site generators like Astro, Next.js, and Nuxt offer better developer experiences and more robust tooling. This WebSocket limitation is just another nail in the coffin—when your development server can't handle basic HTTPS environments that have been standard for years, it's a pretty clear sign the project is falling behind.

The choice between useful development features (like OrbStack's convenient .orb.local domains) and Jekyll compatibility shouldn't even be a question. Modern tools should adapt to modern workflows, not force developers to work around decade-old limitations.

At some point, you have to ask: is it worth sticking with a static site generator that breaks when you try to use it with contemporary development practices? Jekyll had its moment, but that moment was 2014. Maybe it's time to migrate my website to something that actually works with today's containerized, HTTPS-first development environments.
