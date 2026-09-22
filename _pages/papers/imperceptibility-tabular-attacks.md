---
layout: paper
permalink: /papers/imperceptibility-tabular-attacks/
paper_key: ISWA2025
description: Seven properties for examining whether adversarial changes to tabular records are plausible, beyond whether they fool a classifier.
---

## What this paper studies

A small numerical change is not necessarily a plausible change to a tabular record. Features have different scales, meanings and relationships: an attack can stay close to the original input while changing an immutable attribute or producing an invalid combination of values.

This paper asks how to characterise imperceptibility for tabular adversarial attacks and how existing attacks behave when assessed through that broader lens.

## The contribution

We organise imperceptibility around seven properties:

| Property                | What it asks                                                   |
| :---------------------- | :------------------------------------------------------------- |
| Proximity               | How far has the record moved from its original values?         |
| Sparsity                | How many features have changed?                                |
| Deviation               | Does the modified record depart from the data distribution?    |
| Sensitivity             | Are changes large relative to a feature's narrow distribution? |
| Immutability            | Have attributes that should remain fixed been altered?         |
| Feasibility             | Do values remain within valid practical ranges?                |
| Feature interdependency | Are relationships between attributes preserved?                |

The empirical study evaluates five attacks, combining quantitative measurement with qualitative analysis of domain-dependent properties. It examines the trade-off between causing misclassification and retaining plausible records.

## How to use this work

Use the properties to make an evaluation's assumptions explicit. Report attack effectiveness alongside the relevant imperceptibility measures, and identify which constraints require domain knowledge. A single distance threshold cannot stand in for all seven properties.

## Scope and limitations

The properties provide an evaluation framework. The experiments do not establish that every domain has the same valid ranges, immutable attributes or dependencies. Those must be specified for the application. The paper also discusses the effects of one-hot encoding, proximity-focused attacks and assumptions about feature importance.

## Place in my research

This study establishes the evaluation questions explored further in [TabAttackBench]({{ '/papers/tabattackbench/' | relative_url }}). My [on-manifold attack work]({{ '/papers/on-manifold-tabular-attacks/' | relative_url }}) then investigates generation methods that better preserve statistical consistency.
