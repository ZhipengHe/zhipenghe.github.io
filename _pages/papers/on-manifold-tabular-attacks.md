---
layout: paper
permalink: /papers/on-manifold-tabular-attacks/
paper_key: ASOC2026
description: Mixed-input VAE latent-space attacks for tabular data, evaluating attack success alongside distributional alignment and reconstruction quality.
---

## What this paper studies

Tabular records combine numerical and categorical features with dependencies that input-space perturbations can disrupt. This paper investigates generating adversarial examples through a learned latent representation, with the aim of preserving statistical consistency while changing a model's prediction.

## How the approach works

1. A mixed-input variational autoencoder combines categorical embeddings and numerical features in a latent representation.
2. Attack optimisation perturbs that representation and decodes it back into a tabular record.
3. Evaluation considers both attack effectiveness and alignment with the data distribution, including In-Distribution Success Rate (IDSR).

The evaluation spans six public datasets and three predictive model architectures, with comparisons against input-space attacks and other VAE-based methods.

## What the results show

The study reports lower outlier rates and strong IDSR performance under the evaluated conditions. It also examines hyperparameter sensitivity, sparsity control and generative architecture, rather than treating successful misclassification alone as sufficient evidence of a useful attack.

## Where the method needs care

Reconstruction quality and sufficient training data are important to the method's effectiveness. A learned latent representation is an approximation to the data structure, and distributional alignment should be interpreted within the evaluation used in the paper.

Sparsity remains a challenge: a small latent change can alter several reconstructed features. The paper investigates sparsity penalties and feature selection, but does not establish a general solution for changing only a few attributes. These limits matter when deciding whether the method fits an application's attack model.

## Place in my research

The [imperceptibility study]({{ '/papers/imperceptibility-tabular-attacks/' | relative_url }}) defines the evaluation concerns; [TabAttackBench]({{ '/papers/tabattackbench/' | relative_url }}) examines existing attacks against quantitative measures. This work moves from evaluation toward attack generation that better respects statistical structure.
