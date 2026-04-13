---
layout: post
title: "Code is Cheap. Show me the Prompts"
date: 2025-06-26 17:26:00+1000
description: Master AI-assisted development with practical prompting techniques and templates that actually work. Learn when AI shines and how to communicate effectively with coding assistants.
tags: LLM Prompting
categories: AI WebDev
image: /assets/img/posts/Code-is-Cheap.png
og_image: /assets/img/posts/Code-is-Cheap.png
giscus_comments: true
related_posts: true
toc:
  sidebar: right
---

## The New Currency of Development

I spent three hours last week debugging a GitHub Actions workflow that kept failing silently. You know the drill—digging through YAML syntax, checking environment variables, cursing at indentation. Then I tried something different: I pasted the broken workflow into Claude Code and said "This GitHub Action isn't working, fix the deployment script and explain what was wrong." Two minutes later, I had a working solution and learned that my Docker context was misconfigured.

<div class="text-center mt-3">
    {% include figure.liquid loading="eager" path="assets/img/posts/Code-is-Cheap.png" class="img-fluid rounded z-depth-1 w-100" %}
</div>
<div class="caption" style="font-style: italic;">
  <b>Linus Torvalds' famous quote gets an AI makeover:</b> "Code is cheap. Show me the prompts."
</div>

The phrase "code is cheap" has never been more accurate, but there's a twist: the real value now lies in knowing how to communicate with AI. As AI becomes increasingly sophisticated, the bottleneck is no longer writing code—it's crafting the right prompts to get AI to write it for you.

This isn't just about faster development—it's about fundamentally different skills. The developers who are thriving now aren't necessarily the ones who can write the most elegant algorithms or memorize framework APIs. They're the ones who can break down complex problems into clear, specific instructions that AI can understand and execute. It's like being a really good technical writer, except your audience is a machine that can code better than most humans but needs explicit guidance on what to build.

## Core Prompting Skills

Learning to work with AI isn't rocket science, but it does require unlearning some bad habits. Most developers are used to diving straight into implementation details. With AI, you need to step back and think like a project manager first—define the what, why, and how before asking for code.

**Context is everything.** The difference between _"create a login form"_ and _"create a login form for this Next.js TypeScript project using our existing shadcn/ui components, integrate with our Supabase auth, and match the design system in components/ui/"_ is the difference between generic boilerplate and code that actually fits your project. I learned this the hard way after getting beautiful React components that used completely different styling libraries than the rest of my app.

**Specificity saves time.** Vague requests lead to back-and-forth iterations that could have been avoided. Instead of _"make this faster"_, try _"optimize this database query that's taking 3+ seconds on tables with 100k+ rows, focus on indexing and avoiding N+1 queries."_ The AI can't read your mind, but it can work miracles when you're explicit about constraints, performance requirements, and edge cases you're worried about.

**Think in steps, not solutions.** When tackling complex problems, resist the urge to ask for everything at once. Break it down: _"First, analyze this messy legacy code and identify the main architectural issues. Then suggest three refactoring approaches with pros and cons. Finally, implement the safest approach with proper error handling and tests."_ This step-by-step approach not only gets better results but also helps you understand the AI's reasoning process.

**Ask for the plan before the code.** Before diving into implementation, get the AI to think through the architecture first. Try _"Plan out how to add real-time notifications to this app - what components need to change, what new APIs are required, and how should we handle state management?"_ Once you approve the approach, then ask for the actual code. This prevents those moments where you realize the AI built something elegant but completely wrong for your use case.

---

## Prompt Templates That Actually Work

After months of trial and error, I've collected a set of prompt patterns that consistently produce good results. Think of these as your starter templates—modify them for your specific context, but the structure works across different tools and scenarios.

> **Architecture Decisions**
>
> _"Design a [system/component] for [specific use case] that needs to handle [requirements like scale, performance, security]. Current tech stack is [languages/frameworks]. Consider [specific constraints like budget, timeline, team skills]. Provide 2-3 approaches with trade-offs and recommend the best option with reasoning."_

This template works because it forces you to define the problem scope, constraints, and decision criteria upfront. I used this recently for designing a caching layer and got three solid approaches I hadn't considered, complete with implementation complexity analysis.

> **Code Review**
>
> _"Review this [language] code for [specific concerns like security vulnerabilities, performance bottlenecks, maintainability issues]. Focus on [areas of concern]. For each issue found, provide the problematic code snippet, explain why it's problematic, and show the improved version with explanation."_

The key here is being specific about what you're worried about. Generic _"review this code"_ gets generic feedback. But asking for security review of authentication logic gets you detailed analysis of timing attacks, input validation, and session management issues you might miss.

> **Refactoring**
>
> _"Modernize this [legacy technology/old pattern] code to use [new framework/modern patterns]. Maintain the same functionality and API contracts. Improve [specific aspects like type safety, error handling, performance]. Show the transformation step-by-step and explain each change."_

I am using this template to migrate my Jekyll blog components to Next.js, converting Liquid templates to JSX components while preserving the same styling and functionality. The _"step-by-step"_ part is crucial—it helps you understand the changes and makes the refactoring easier to review and test.

> **Test Generation**
>
> _"Generate comprehensive tests for this [component/function/API] covering happy path, edge cases, and error conditions. Use [testing framework like Jest, pytest, RSpec]. Include setup/teardown code, mock external dependencies, and test for [specific scenarios like race conditions, invalid inputs, network failures]. Aim for [coverage percentage] code coverage."_

This template has saved me countless hours of thinking through test scenarios. I recently used it for testing a payment processing function and got tests for edge cases I'd never considered—like what happens when the payment gateway returns a success response but the database write fails.

> **Debugging/Troubleshooting**
>
> _"This [language/framework] code is throwing [specific error]. Here's the error message: [paste error]. Here's the relevant code: [paste code]. Help me identify the root cause and provide a fix with explanation of why this happened."_

The magic is in providing both the error message and the actual code. I've wasted too many hours getting generic debugging advice because I only shared the error message. When you include the problematic code, AI can spot issues like variable scope problems or async/await misuse that the error message doesn't make obvious.

> **Performance Optimization**
>
> _"This [function/query/component] is performing slowly under [specific conditions]. Current performance is [metrics]. Analyze the bottlenecks and suggest optimizations. Focus on [specific areas like database queries, memory usage, rendering]."_

Including actual performance metrics makes all the difference. Instead of getting generic advice like "use indexes," you get targeted solutions. When I mentioned my ML model inference was taking 800ms per request, I got specific suggestions about batch processing and model quantization that cut the response time to under 200ms.

> **Documentation Generation**
>
> _"Generate comprehensive documentation for this [codebase/module/API]. Include overview, installation steps, usage examples, API reference, and common troubleshooting. Target audience is [developers/end-users]. Follow [documentation style like JSDoc, Sphinx]."_

This template works because it defines the scope and audience upfront. Documentation for end-users is completely different from developer docs. I've used this to generate API documentation that was actually usable, not just a wall of technical jargon.

> **API Integration**
>
> _"Help me integrate with [API name] to [specific goal]. I need to [specific actions like authenticate, fetch data, handle webhooks]. Handle rate limiting, error responses, and provide proper TypeScript types. Use [HTTP library]."_

The key is being explicit about error handling and types. Generic API integration examples rarely handle real-world issues like rate limiting or webhook verification. This template gets you production-ready code that won't break when the API returns unexpected responses.

---

## The Shift is Real

Code is getting cheaper to produce, but knowing how to communicate with AI is becoming more valuable. Master the prompting skills, try the templates, and see what works for your workflow. The tools will keep evolving, but the fundamentals of clear communication with AI will remain.

Start small, be specific, and remember: the best prompt is the one that gets you exactly what you need.
