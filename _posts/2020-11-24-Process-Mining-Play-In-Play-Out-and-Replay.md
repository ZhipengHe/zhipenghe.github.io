---
title:  "Process Mining: Play-In, Play-Out, and Replay"
date: 2020-11-23
permalink: /posts/2020/11/24/Process-Mining-Play-In-Play-Out-and-Replay/
categories: 
  - Research Notes
tags:
  - Process Mining
  - Data Mining
  - Process Model
---

Three relationships between process models and event data: Play-In, Play-Out, and Replay.

## Overview

![Play-In, Play-Out, and Replay](/images/posts/play-in-play-out-replay.png)

## Play-Out

**Play-Out** refers to the classical use of process models. Play-Out can be used both for the analysis and the enactment of business processes.

## Play-In

**Play-In** is the opposite of Play-Out, i.e., example behavior is taken as input and the goal is to construct a model. Play-In is often referred to as *inference*. The α-algorithm and other process discovery approaches are examples of Play-In techniques. 

Most data mining techniques use Play-In, i.e., a model is learned on the basis of examples. Typical examples of models are decision trees and association rules.

## Replay

**Replay** uses an event log and a process model as input. The event log is “replayed” on top of the process model. An event log may be replayed for different purposes:

- **Conformance checking**: discrepancies between the log and the model can be detected and quantified by replaying the log. (**dianostics**)
- **Extending the model with frequencies and temporal information**: By replaying the log one can see which parts of the model are visited frequently. Replay can also be used to detect bottlenecks. (**extended model showing times and frequencies**)
- **Constructing predictive models**: By replaying event logs one can build predictive models, i.e., for the different states of the model particular predictions can be made. (**predictions**)
- **Operational support**: Replay is not limited to historic event data. One can also replay partial traces of cases still running. This can be used for detecting deviations at run-time. Such predictions can also be used to recommend suitable next steps to progress the case. (**recommendations**)

## Process Mining and Relationships

There are three types of process mining using event log:

- Discovery (Play-In)
- Conformance (Replay)
- Enhancement (Replay)

![three types of process mining](/images/posts/process-mining-and-relationship.png)

## References

1. van der Aalst, W. (2016). *Process Mining Data Science in Action* (2nd ed.). Springer Berlin Heidelberg. [https://doi.org/10.1007/978-3-662-49851-4](https://doi.org/10.1007/978-3-662-49851-4)

2. van der Aalst, W. (n.d.). *Process Mining: Data science in Action* [MOOC]. Coursera. [https://www.coursera.org/learn/process-mining](https://www.coursera.org/learn/process-mining)
