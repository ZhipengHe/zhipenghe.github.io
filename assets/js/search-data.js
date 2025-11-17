// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-slides",
          title: "slides",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/https:/slides.zhipenghe.me/";
          },
        },{id: "nav-vitae",
          title: "vitae",
          description: "Course of Life",
          section: "Navigation",
          handler: () => {
            window.location.href = "/vitae/";
          },
        },{id: "post-code-is-cheap-show-me-the-prompts",
        
          title: "Code is Cheap. Show me the Prompts",
        
        description: "Master AI-assisted development with practical prompting techniques and templates that actually work. Learn when AI shines and how to communicate effectively with coding assistants.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Code-is-Cheap/";
          
        },
      },{id: "post-bypassing-image-anti-hotlinking-with-nginx-reverse-proxy",
        
          title: "Bypassing Image Anti-Hotlinking with Nginx Reverse Proxy",
        
        description: "A guide on implementing an Nginx reverse proxy to solve image hotlinking issues in RSS feeds. Learn how to bypass anti-hotlinking protection while maintaining ethical usage, including server-side caching, dynamic DNS resolution, and automated URL conversion techniques.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Bypassing-Image-Anti-Hotlinking-with-Nginx/";
          
        },
      },{id: "post-jekyll-livereload-vs-websocket-secure-a-protocol-compatibility-issue",
        
          title: "Jekyll LiveReload vs WebSocket Secure: A Protocol Compatibility Issue",
        
        description: "Jekyll&#39;s LiveReload breaks with HTTPS reverse proxies in OrbStack due to WebSocket limitations. Testing with other tools proves it&#39;s Jekyll&#39;s problem, not the proxy&#39;s.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Jekyll-LiveReload-vs-WebSocket-Secure/";
          
        },
      },{id: "post-docker-api-exposure-via-tailscale-vpn-windows-setup-guide-with-wsl2-backend",
        
          title: "Docker API Exposure via Tailscale VPN - Windows Setup Guide (with WSL2 Backend)...",
        
        description: "This guide shows how to expose Docker&#39;s API (port 2375) to your Tailscale VPN network on Windows with WSL2 backend.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Docker-API-Exposure-Windows/";
          
        },
      },{id: "post-docker-api-exposure-via-tailscale-vpn-linux-setup-guide",
        
          title: "Docker API Exposure via Tailscale VPN - Linux Setup Guide",
        
        description: "This guide shows how to expose Docker&#39;s API (port 2376) to your Tailscale VPN network on Linux systems.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Docker-API-Exposure-Linux/";
          
        },
      },{id: "post-the-ds-store-strikes-back-finder-edition",
        
          title: "The .DS_Store Strikes Back: Finder Edition",
        
        description: "A long time ago, on a remote server far, far away...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/The-DS_Store-Strikes-Back/";
          
        },
      },{id: "post-surviving-without-vs-code-remote-ssh",
        
          title: "Surviving without VS Code Remote SSH",
        
        description: "Or: &quot;They took away my extension, but not my will to code.&quot;",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Surviving-without-VS-Code-Remote-SSH/";
          
        },
      },{id: "news-pass-the-phd-confirmation-seminar-successfully-amp-amp-welcome-to-2nd-year-phd-research",
          title: '🎉 Pass the PhD confirmation seminar successfully &amp;amp;amp; Welcome to 2nd year PhD...',
          description: "",
          section: "News",},{id: "news-our-paper-investigating-imperceptibility-of-adversarial-attacks-on-tabular-data-an-empirical-analysis-has-been-accepted-by-q1-journal-intelligent-systems-with-applications",
          title: '🎉 Our paper “Investigating Imperceptibility of Adversarial Attacks on Tabular Data: An Empirical...',
          description: "",
          section: "News",},{id: "news-receive-an-outstanding-presentation-award-at-the-qut-school-of-information-systems-doctoral-consortium",
          title: '🎉 Receive an Outstanding Presentation award at the QUT School of Information Systems...',
          description: "",
          section: "News",},{id: "news-pass-the-phd-final-seminar-successfully",
          title: '🎉 Pass the PhD final seminar successfully!',
          description: "",
          section: "News",},{id: "news-our-paper-crafting-imperceptible-on-manifold-adversarial-attacks-for-tabular-data-has-been-accepted-by-d1-journal-applied-soft-computing",
          title: '🎉 Our paper “Crafting Imperceptible On-Manifold Adversarial Attacks for Tabular Data” has been...',
          description: "",
          section: "News",},{id: "news-our-paper-tabattackbench-a-benchmark-for-adversarial-attacks-on-tabular-data-has-been-accepted-by-d1-journal-expert-systems-with-applications",
          title: '🎉 Our paper “TabAttackBench: A Benchmark for Adversarial Attacks on Tabular Data” has...',
          description: "",
          section: "News",},{
        id: 'social-dblp',
        title: 'DBLP',
        section: 'Socials',
        handler: () => {
          window.open("https://dblp.org/pid/214/4253-2.html", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/ZhipengHe", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/zhipenghe", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0000-0002-8241-8499", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=oXqD4tMAAAAJ", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
