---
layout: paper
permalink: /papers/tabattackbench/
paper_key: ESWA2026
description: A benchmark examining attack effectiveness and imperceptibility across five white-box attacks, four predictive models and eleven tabular datasets.
---

## What this paper studies

An attack that frequently fools a model does not necessarily produce imperceptible perturbations. TabAttackBench examines both sides of that trade-off, comparing attacks across datasets and predictive architectures under a common evaluation framework.

## What the benchmark covers

| Component         | Evaluated scope                                                              |
| :---------------- | :--------------------------------------------------------------------------- |
| Attacks           | FGSM, BIM, PGD, DeepFool and Carlini & Wagner                                |
| Predictive models | Logistic regression, MLP, TabTransformer and FT-Transformer                  |
| Data              | Eleven tabular datasets, including mixed-feature and numerical-only datasets |
| Imperceptibility  | Proximity, sparsity, deviation and sensitivity                               |

The benchmark connects attack success to four quantitative dimensions of imperceptibility. These dimensions build on the broader framework in our [imperceptibility study]({{ '/papers/imperceptibility-tabular-attacks/' | relative_url }}).

## What we found

The evaluated attacks exhibit a trade-off between effectiveness and imperceptibility. In the study, $$\ell_{\infty}$$-based attacks generally achieve higher attack success with less subtle perturbations, while $$\ell_2$$-based attacks offer more realistic perturbations. Dataset characteristics, predictive models and attack settings matter when interpreting these patterns.

This makes the benchmark useful for examining more than an attack-success ranking: it shows what kind of input changes accompany that success.

## Using the benchmark

The linked repository provides the implementation, data processing scripts and experimental pipelines. Start with its setup instructions and record the dataset, model, attack configuration and evaluation measures when comparing results.

## Scope and limitations

The results concern the five white-box attacks and four predictive architectures evaluated in the paper. They are not a claim to cover every constrained, black-box or model-specific attack. The four quantitative measures also do not replace domain checks for immutability, feasibility and feature dependencies.

## Place in my research

TabAttackBench connects the definition of imperceptibility to systematic empirical evaluation. The next question is whether generation methods can better preserve the data distribution, explored in our [on-manifold attack paper]({{ '/papers/on-manifold-tabular-attacks/' | relative_url }}).
