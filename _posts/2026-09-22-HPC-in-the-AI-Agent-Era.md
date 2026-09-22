---
layout: post
title: "HPC in the AI Agent Era"
date: 2026-09-22 14:00:00+1000
description: Slides from my QUT School of Information Systems HDR workshop on HPC fundamentals, research workflows on Aqua, and working with AI agents through clear context, permissions and checks.
tags: HPC QUT Research AI
categories: HPC AI
image: /assets/img/posts/hpc-in-the-ai-agent-era.jpg
og_image: /assets/img/posts/hpc-in-the-ai-agent-era.jpg
giscus_comments: true
related_posts: true
---

On 22 September 2026, I presented **HPC in the AI Agent Era** at a QUT School of Information Systems HDR workshop. The workshop brings together two parts of my research workflow: using high-performance computing (HPC) and working with AI agents. I am sharing the slides here for anyone who attended, or who wants to explore how these tools could fit into their own research.

The starting point is a research task. Perhaps your analysis keeps running out of memory, you have dozens of experiments to finish, or you need your laptop back while a long computation runs elsewhere. Those are the kinds of situations the workshop uses to introduce HPC, before following a research example on QUT's Aqua cluster.

## From a research task to an HPC workflow

Getting a job to run is one part of the process. You also need to decide what resources to request, prepare the software and inputs, understand what happens while the job waits, and inspect what comes back.

The first part of the workshop follows an IMDb movie-review classification example through that process. Along the way, the slides cover interactive and batch work, PBS job scripts, resource use, queueing and job arrays. Interactive explanations of queue scores and backfilling help make the scheduling ideas easier to explore.

The question to keep in mind is: **what would you need to know before running your own research task this way?** The examples are a starting point for making those decisions, with linked guides for the detailed procedures.

## Working with an agent takes supervision

The second part returns to the research workflow with an AI agent involved. An agent can help investigate a project, prepare changes and interpret outputs. That makes the context you provide, the actions you allow and the evidence you review central to the work.

The slides walk through giving the agent a useful starting point, reviewing a proposed job before it runs, and checking the result beyond its exit code. They also cover practical supervision settings and reusable project guidance, so the next session can build on what you learned.

One idea I want readers to take away is simple: **be clear about the task, agree on the boundaries, and check the work.** This applies whether you are preparing one experiment or asking an agent to help with a larger research workflow.

## Explore the slides

The full presentation is embedded below, including the interactive explanations and appendix. Click inside the deck and use the arrow keys to navigate. For more room, [open the slides in a separate tab](https://slides.zhipenghe.me/2026-HPC-Workshop/slides.html){:target="\_blank" rel="noopener"}.

<iframe
  src="https://slides.zhipenghe.me/2026-HPC-Workshop/slides.html"
  title="HPC in the AI Agent Era: QUT School of Information Systems HDR workshop slides"
  width="1280"
  height="720"
  style="display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; margin: 1.5rem 0; border: 0;"
  loading="lazy"
  allowfullscreen
></iframe>

## Try it with your own research

Choose one task you already understand. What limits it today: memory, runtime, the number of experiments, or keeping the environment consistent? Use that task as you explore the slides, then identify one step you could investigate or improve.

For further reading, [Walltime Chronicles](https://zhipenghe.me/Walltime-Chronicles/) collects practical HPC guidance, and [QUT eResearch's getting-started guide](https://docs.eres.qut.edu.au/hpc-getting-started-with-high-performance-computing) covers getting started with HPC at QUT.

If you attended the workshop, thank you for joining. I hope the slides are useful when you return to your own research.
