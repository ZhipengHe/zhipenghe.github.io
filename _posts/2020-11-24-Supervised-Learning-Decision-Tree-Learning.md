---
title: 'Supervised Learning: Decision Tree Learning'
date: 2020-11-24
permalink: /posts/2020/11/24/Supervised-Learning-Decision-Tree-Learning/
categories: 
  - Research Notes
tags:
  - Data Mining
  - Data Science
  - Supervised Learning
---

Introduce basic approaches of supervised learning in data mining

## Supervised Learning

**Supervised learning** assumes labeled data, i.e., there is a response variable that labels each instance. The other variables are predictor variables and we are interested in explaining the response variable in terms of the predictor variables.

Sometimes the response variable is called the dependent variable and the predictor variables are called independent variables. The goal is to explain the dependent variable in terms of the independent variables.

Techniques for supervised learning can be further subdivided into **classification** and **regression** depending on the type of response variable (categorical or numerical).

### Classification

Classification techniques assume a categorical response variable and the goal is to classify instances based on the predictor variables. In the next section, it will show how to construct a so-called **decision tree** using classification.

Classification requires a categorical response variable. In some cases it makes sense to transform a numerical response variable into a categorical one. For example, one could decide to transform variable age into a categorical response variable by mapping values below 70 onto label “young” and values of 70 and above onto label “old”.

### Regression

Regression techniques assume a numerical response variable. The goal is to find a function that fits the data with the least error. The most frequently used regression technique is *linear regression*. However, these techniques are out of the scope of process mining.

## Decision Tree Learning

**Decision tree learning** is a supervised learning technique aiming at the classification of instances based on predictor variables. There is one categorical response variable labeling the data and the result is arranged in the form of a tree.

### Algorithm

Decision tree learning uses a recursive top-down algorithm that works as follows:

1. Create the root node $r$ and associate all instances to the root node. $X:=\{r\}$ is the set of nodes to be traversed.
2. If $X=\emptyset$, then return the tree with root $r$ and end.
3. Select $x\in X$ and remove it from $X$, i.e., $X:=X\setminus \{x\}$. Determine the “score” $s^{old}(x)$ of node $x$ before splitting, e.g., based on entropy.
4. Determine if splitting is possible/needed. If not, go to step 2, otherwise continue with the next step.
5. For all possible attributes $a\in A$, evaluate the effects of splitting on the attribute. Select the attribute $a$ providing the best improvement, i.e., maximize $s^{new}_a(x) − s^{old}(x)$. The same attribute should not appear multiple times on the same path from the root. Also note that for numerical attributes, so-called “cut values” need to be determined.
6. If the improvement is substantial enough, create a set of child nodes $Y$ , add $Y$ to $X$ (i.e., $X:= X\cup Y$), and connect $x$ to all child nodes in $Y$.
7. Associate each node in $Y$ to its corresponding set of instances and go to step 2.

### Entropy: Encoding Uncentainty

Entropy is an information-theoretic measure for the uncertainly in a multi-set of elements.

#### Formula

$$E=-\sum_{i=1}^k p_i \log_2 p_i$$

#### Apply to decision tree learning

The entropy value for root node of decision tree should be a value close to the maximal value.

Information Gain = old overall entropy - new overall entropy

The goal of decision tree learning is to maximize the *information gain* by selecting a particular attribute to split on. Maximizing the information gain corresponds to minimizing the entropy and heterogeneity in leaf nodes.

Note that splitting nodes will always reduce the overall entropy. In the extreme case all the leaf nodes corresponds to single individuals (or individuals having exactly the same attribute values). The overall entropy is then by definition zero. However, the resulting tree is not very useful and probably has little predictive value. It is vital to realize that the decision tree is learned based on *examples*.

A decision tree is “overfitting” if it depends too much on the particularities of the data used to learn it (see also Sect. 4.6). An overfitting decision tree is overly complex and performs poorly on unseen instances. Therefore, it is important to select the right attributes and to stop splitting when little can be gained.
