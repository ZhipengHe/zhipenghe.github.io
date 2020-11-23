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

Data Mining is data-centric, not process-centric.

### Data Set and Variables

**Data set** (sample or table) consists of **instances** (individuals, entities, cases, objects, or records).

**Variables** are often referred to as attributes, features, or data elements. There are two types:

- categorical variables:
  - ordinal (high-med-low, cum laude-passed-failed) or
  - nominal (true-false, red-pink-green)
- numerical variables (ordered, cannot be enumerated easily)

### Supervised Learning

**Supervised Learning** assume **labeled data**, i.e., there is a response variable that labels each instance.

Goal: explain response variable (dependent variable) in terms of predictor variables (independent variables).

Main techniques:

- **Classification techniques** (e.g., decision tree learning) assume a categorical response variable and the goal is to classify instances based on the predictor variables.
- **Regression techniques** assume a numerical response variable. The goal is to find a function that fits the data with the least error.

### Unsupervised Learning

**Unsupervised learning** assumes **unlabeled data**, i.e., the variables are not split into response and predictor variables.

Main techniques:

- **clustering** (e.g., k-means clustering and agglomerative hierarchical clustering)
- **pattern discovery** (association rules)

## Process Mining

![data science and process science](/images/posts/data-science-and-process-science.png)

Process Mining is a bridge between data science and process science.

### Process-Aware Information Systems

Process-Aware Information Systems (PAISs) include all software systems that support processes and not just isolated activities. For example, ERP (Enterprise Resource Planning) systems, BPM (Business Process Management) systems, WFM (WorkflowManagement) systems and CRM (Customer RelationshipManagement) systems.

### Event Log

Event Log refers to the data from PAISs. We assume that it is possible for event log to sequentially record events such that each **event** refers to an **activity** and is related to a particular **case**. Also, event log has extra information such as the **resource** (i.e., person or device) executing or initiating the activity, the **timestamp** of the event, or **data elements** recorded with the event (e.g., the size of an order).

Event log can be used in three types of process mining, including *discovery*, *conformance* and *enhancement*.

### Process Mining VS Data Mining

- Both start from data.
- Data mining techniques are typically not process-centric.
- Topics such as process discovery, conformance checking, and bottleneck analysis are not addressed by traditional data mining techniques.
- **End-to-end** process models and concurrency are essential for process mining.
- Process mining assumes event logs where events have timestamps and refer to cases (process instances).
- Process mining and data mining need to be combined for more advanced questions.

## References

1. van der Aalst, W. (2016). *Process Mining Data Science in Action* (2nd ed.). Springer Berlin Heidelberg. [https://doi.org/10.1007/978-3-662-49851-4](https://doi.org/10.1007/978-3-662-49851-4)

2. van der Aalst, W. (n.d.). *Process Mining: Data science in Action* [MOOC]. Coursera. [https://www.coursera.org/learn/process-mining](https://www.coursera.org/learn/process-mining)