---
layout: page
permalink: /research/tabular-adversarial-ml/
title: Adversarial Machine Learning for Tabular Data
description: My main research foundation, connecting imperceptibility, attack benchmarking and on-manifold adversarial generation for tabular data.
---

Adversarial machine learning for tabular data is the main foundation of my research. I study how to generate realistic adversarial examples and evaluate what they reveal about model robustness.

Tabular records have meanings that a distance measure alone cannot capture. An imperceptible perturbation must account for feature types, distributions, valid values and relationships. My PhD research examined how these constraints change the way we define, evaluate and generate adversarial examples.

<figure>
  <img src="{{ '/assets/img/research/tabular-adversarial-research-design.png' | relative_url }}" alt="Thesis research design: imperceptibility properties inform benchmarking and new attack design; generated adversarial examples support adversarial training and comparison with original models." style="display: block; width: 100%; height: auto;" loading="lazy">
  <figcaption>Research design from my PhD thesis, connecting imperceptibility, attack benchmarking and on-manifold attack design with adversarial training.</figcaption>
</figure>

## Three connected questions

| Research question                                      | Paper                                              | Contribution                                                           |
| :----------------------------------------------------- | :------------------------------------------------- | :--------------------------------------------------------------------- |
| What makes a change imperceptible?                     | [Investigating Imperceptibility][imperceptibility] | Seven properties for evaluating tabular perturbations                  |
| How do existing attacks compare?                       | [TabAttackBench][benchmark]                        | Effectiveness and imperceptibility across attacks, models and datasets |
| Can we generate more statistically consistent attacks? | [On-Manifold Adversarial Attacks][manifold]        | Mixed-input VAE latent-space attacks and distribution-aware evaluation |

[imperceptibility]: {{ '/papers/imperceptibility-tabular-attacks/' | relative_url }}
[benchmark]: {{ '/papers/tabattackbench/' | relative_url }}
[manifold]: {{ '/papers/on-manifold-tabular-attacks/' | relative_url }}

## Why effectiveness alone is not enough

An attack can reveal that a classifier is sensitive to input changes, yet still produce a record that would be rejected as invalid or obviously unusual. Assessing that distinction is central to interpreting what an attack demonstrates about a model's vulnerability.

The work therefore examines attack success alongside properties such as proximity, sparsity and deviation from the data distribution. Domain-specific constraints, including immutable attributes and valid feature relationships, remain important when applying those ideas to a particular system.

## Where to start

- **Designing an evaluation:** start with the imperceptibility paper and identify which properties matter for your application.
- **Comparing attack behaviour:** use TabAttackBench to understand the evaluated methods, settings and trade-offs.
- **Exploring generation methods:** read the VAE paper, including its reconstruction and sparsity limitations.

Each paper page links to the published version, open preprint, code and citation information.

## PhD thesis and future directions

These studies form the core of my PhD thesis, [Building Adversarially Robust Predictive Systems for Tabular Data](https://doi.org/10.5204/thesis.eprints.264638), completed at QUT in 2026 under the supervision of [A/Prof. Chun Ouyang](https://www.qut.edu.au/about/our-people/academic-profiles/c.ouyang), [Prof. Alistair Barros](https://www.qut.edu.au/about/our-people/academic-profiles/alistair.barros) and [A/Prof. Catarina Moreira](https://profiles.uts.edu.au/Catarina.PintoMoreira).

The thesis points toward extending adversarial robustness research to more complex data and realistic attack settings. A central challenge is how to generate effective yet imperceptible perturbations that respect domain knowledge and relationships across features and modalities, including when access to the predictive model is limited.

[Back to research]({{ '/research/' | relative_url }}).
