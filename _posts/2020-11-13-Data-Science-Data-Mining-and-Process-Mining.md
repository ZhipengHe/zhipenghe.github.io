---
title:  "Data Science, Data Mining and Process Mining"
date: 2020-11-23
permalink: /posts/2020/11/23/Data-Science-Data-Mining-and-Process-Mining/
categories: 
  - Research Notes
tags:
  - Data Science
  - Process Mining
  - Data Mining
---

Some notes when studying *Process Mining: Data science in Action* on [Coursera](https://www.coursera.org/learn/process-mining)

## Data Science

### The four V’s of Big Data

- **Volume** refers to the incredible scale of somedata sources. (Amount)
- **Velocity** refers to the frequency of incoming data that need to be processed. (Speed)
- **Variety** refers to the different types of data coming from multiple sources. (Type)
- **Veracity** refers to the trustworthiness of the data. (Accuracy)

## Data Mining

## Process Mining

A bridge between data science and process science.

![data science and process science](/images/posts/data-science-and-process-science.png)

### Process-Aware Information Systems

Process-Aware Information Systems (PAISs) include all software systems that support processes and not just isolated activities. For example, ERP (Enterprise Resource Planning) systems, BPM (Business Process Management) systems, WFM (WorkflowManagement) systems and CRM (Customer RelationshipManagement) systems.

### Event Log

Event Log refers to the data from PAISs. We assume that it is possible for event log to sequentially record events such that each **event** refers to an **activity** and is related to a particular **case**. Also, event log has extra information such as the **resource** (i.e., person or device) executing or initiating the activity, the **timestamp** of the event, or **data elements** recorded with the event (e.g., the size of an order).

Event log can be used in three types of process mining, including *discovery*, *conformance* and *enhancement*.
