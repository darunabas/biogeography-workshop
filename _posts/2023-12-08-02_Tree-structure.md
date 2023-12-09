---
layout: posts
title: Lesson 2 - Tree structure
date: 2023-12-08
type: post
published: true
author: "Klaus Schliep, April Wright"
status: publish
classes: wide
excerpt_separator: <!--more-->
share: true
header:
  overlay_image: /assets/images/tulane.jpg
  overlay_filter: 0.2
excerpt: ""
categories:
- Updates
image: /assets/images/tulane.jpg
tags:
  - link
  - Post Formats
---

## Lecture 2

```r
knitr::opts_chunk$set(echo = TRUE)
knitr::opts_chunk$set(class.source='fold-show')
knitr::opts_chunk$set(collapse = TRUE)
library(phangorn)
nr_desc <-  function(x){
    x <- reorder(x, "postorder")
    res <- numeric(max(x$edge))
    res[1:Ntip(x)] = 1L
    for(i in 1:nrow(x$edge)){
        tmp = x$edge[i,1]
        res[tmp] =  res[tmp] + res[x$edge[i,2] ]
    }
    res
}

root_to_tip <-  function(x){
    x <- reorder(x)
    res <- numeric(max(x$edge))
    for(i in 1:nrow(x$edge)){
        pa <- x$edge[i,1]
        ch <- x$edge[i,2]        
        res[ch] =  res[pa] + x$edge.length[i]
    }
    res
}
```

## Concepts today

+ How is a phylogenetic tree stored in R? 
+ How can we traverse a tree to see and manipulate nodes and branches? 
+ What are some major packages and key functions in the R computing environment? 
+ Beyond the tree: What are some important packages that implement comparative methods, biogeography, and visualization? 


## A brief history of phylogenetics in R

1993: first release of R

1996: Ihaka & Gentleman, J. Comput. Graph. Statist., 5: 299–314

2000: R 1.0.0

2001: start the development of ape 

2002: first release of ape

2008: first release of phangorn

2019: 260 packages depending on ape on CRAN, 16 on BioConductor (and 100’s elsewhere: R-Forge, GitHub, . . .)


## Getting help

So many functions, but how to find/remember them?

* write scripts (and maintain them!)
* help.start()
* ?... (or help("..."))
* apropos("...")
* use TAB-completion (or a "cool" editor)

Operators are also functions:
```r
`+` # or get("+")
`+`(1, 2)
```

Find generic functions for a class

Common generic functions are print, plot, c, summary, anova, [, ...
```r
library(ape)
methods(class="phylo")
```
Run all examples of the help files!
```r
example(plot.phylo)
```
However examples in (CRAN) R packages are not allowed to run longer than 5 seconds. So for inference this results frequently in toy examples. You need to change to higher number of bootstrap iterations, change stop criterion for optimisation et cetera.  


Many packages on CRAN and all on Bioconductor come with vignettes.
```r
vignette()
vignette(package="phangorn")
vignette("Trees", package="phangorn")
```


And there is google and stackoverflow. 


## The `phylo` class

The `phylo` class is a tree structure in `ape` are the standard for storing phylogenetic in R. It is also used in more than 260 packages on CRAN.  

This class represents phylogenetic trees and networks; (internal) nodes are of
degree ≥ 2; the tips (terminal nodes) are of degree 1. The tip labels may be
replicated (or can even missing). Idem for the node labels (which are optional).


## Structure of phylo objects

An object of class `phylo` is a list containing at least the following objects:

1. An *integer* matrix named edge with two columns and as many rows as there are edges in the tree.
2. A *character* vector named `tip.label`, can be "".  
3. An *integer* `Nnode` with the number of internal nodes.
4. A class attribute `phylo`. 

```r
library(ape)
tree <- read.tree(text = "(,(,));")
plot(tree)
nodelabels()
tiplabels()
str(tree)
```
The storage mode is important. Saving a vector of integers saves memory in comparison to vector of doubles. 
Also objects of class `phylo` often in C-Code so you need to take care of this. 

Also comparing doubles is dangerous:  
```r
x <- 3
y <- sqrt(3)^2
x==y
```

In the edge matrix each edge (branch) is coded by the nodes it connects. 
```r
tree$edge
```
Tips (terminal nodes, leaves, labels, ...) are numbered from 1 to `n`, where `n` is the number of tips. The root is numbered `n+1`. The ancestral node (closer to the root) is always on the lefthand column.    

Some important properties and observations:
* the first column only contains values greater than `n`.
* all nodes, but the root, appear exactly once in the second column. 
* in a strictly bifurcating tree, all nodes greater then `n` appear twice and the root node `n+1`, in case of 'twice' for rooted and `trice` for unrooted trees. 

So we can start and construct a minimal tree ourselves:

```r
library(ape)
simple_tree <- structure(list(edge = matrix(c(3L, 3L, 1L, 2L), 2, 2), 
                        tip.label = c("t1", "t2"), Nnode = 1L), class = "phylo")
plot(simple_tree)
```

A `phylo` object always contains an `edge`, `tip.label` and `Nnode`. Often a phylo object contains some of the following elements:

1. a *numeric* vector `edge.length`. The length of the vector is number of rows of the `edge` matrix and the order corresponds to the rows in `edge`. 
2. a *character* vector `node.labels` of length `Nnode`. The node labels are labeled from `n+1` to `n+Nnode`
3. A single *numeric* root.edge providing the edge length at the root.  

Additionally most `phylo` objects have an attribute `order`, which can be either "cladewise", "postorder" or "pruningwise". 


## Tree traversal

Tree traversal in ape is implemented iterative in contrast to the recursive implementation in most other phylogenetic programs. 

### Preorder tree traversal
*Preorder tree traversal* is travelling through the tree from the root to the tips visiting always the all nodes the right subtree before visiting the right subtree.  

```r
tree <- rtree(5)
plot(tree, show.tip.label = FALSE)
nodelabels()
tiplabels()
```

```r
reorder(tree, "cladewise")$edge
```

### Postorder tree traversal 
*Postorder tree traversal* travels through the tree from the tips through the root. All the descendent nodes need to be visited before the ancestral node. 

```r
reorder(tree, "postorder")$edge
```

Defining the order of the traversal of the tree this way allows to iterate just through the tree. Reorder not only changes the order of the `edge` matrix, but also of the `edge.length` if it exists. 


###Excercise 1:
Write a function which counts how many descendants each node has. 
The output should look like: 
```r
set.seed(42)
tree <- rtree(5)

plot(tree, show.tip.label = FALSE)
nodelabels()
tiplabels()
nr_desc(tree)
```


My solutions
```r
library(phangorn)
nr_desc_cheat <- function(x){
  lengths(Descendants(x, 1:max(x$edge)))
} 


nr_desc <-  function(x){
    x <- reorder(x, "postorder")
    res <- numeric(max(x$edge))
    res[1:Ntip(x)] = 1L
    for(i in 1:nrow(x$edge)){
        tmp = x$edge[i,1]
        res[tmp] =  res[tmp] + res[x$edge[i,2] ]
    }
    res
}
```


###Excercise 2:
Write a function which computes the distance from each node to the root.

```r
tree$edge.length[] <- 1
root_to_tip(tree)
```

My solution:
```{r class.source = NULL}
root_to_tip <-  function(x){
    x <- reorder(x)
    res <- numeric(max(x$edge))
    for(i in 1:nrow(x$edge)){
        pa <- x$edge[i,1]
        ch <- x$edge[i,2]        
        res[ch] =  res[pa] + x$edge.length[i]
    }
    res
}
```


## The 'multiPhylo' class

An object of class 'multiPhylo' is a list of of several trees each of class 
'phylo'. If all trees share the same tip labels, as in bootstrap samples or from
MCMC analyses, trees can be saved in a memory efficient way storing the labels
only once in an attribute *TipLabel*. 
 
```r
trees <- rmtree(1000, 100)
trees
attr(trees, "TipLabel")
```

```r
trees_compact <- .compressTipLabel(trees)
attr(trees_compact, "TipLabel")

object.size(trees) / object.size(trees_compact)
```

Switching between the two representations can be done via '.compressTipLabel' and '.uncompressTipLabel'. 

## Importing and exporting trees and networks

Package `ape` and `phangorn` contains functions to import trees and splits
networks: 

* `read.tree` Newick files 
* `read.nexus` NEXUS files (only trees)
* `read.evonet` networks in extended Newick format

and 

* `write.tree` Newick (one or several trees)
* `write.nexus` NEXUS (one or several trees with or without translate block)
* `write.evonet` extended Newick (.nhx)
* `read.networx` phylogenetic splits networks in nexus format (e.g. Splitstree)

### Example: 

```r
write.tree(tree, "example_tree.nex") 
tree_read <- read.tree(file = "example_tree.nex")
plot(tree_read)
```



Any R object(s) can be saved on disk: this is much better if these data are used
only in R. (*Faster to read/write, smaller files, and no loss of numerical accuracy.)
Several objects:

* `save(X, a, y, file = "X.rda")` several objects with their names
* `load("X.rda")` $\rightarrow$ restores object names (i.e., possibly deletes previous
X, a, y in the workspace)
A single object:

* `saveRDS(X, file = "X.rds")`
* `Y <- readRDS("X.rds")` $\rightarrow$ the name of the object can be changed


## Functions for `phylo` objects

Before you write a function look what's already out there. 

### Some convenience functions
There are several convenience functions to achieve common tasks:

| Operation      | High level       | Low level      |
|--------------- | -----------------|----------------|  
| How many tips? | Ntip(tr) | length(tr\$tip.label) |
| How many node? | Nnode(tr)  | tr\$Nnode |
| How many edges? | Nedge(tr) | nrow(tr\$edge) |
| What are the ancestor of x | Ancestors(tr, x, "parent") | tr\$edge[tr\$edge[,2]==x , 1] |
| What are the descendants of x | Descendants(tr, x, "children") | tr\$edge[tr\$edge[,1]==x , 2] |


Ntip, Nnode, Nedge are generic and work on `phylo` and `multiPhylo` objects. `Ancestors` and `Descendants` are vectorized , i.e. argument node can be a vector. 


## Some useful functions to modify trees
`root(phy, outgroup, ...)`, 
`unroot(phy)`, 
`midpoint(tree)`,
`drop.tip(phy, tip, ...)`, 
`keep.tip(phy, tip)`, 
`extract.clade(phy, node, ...)`, 
`bind.tree(x, y, ...)`,
`c(...)`, 
`multi2di(phy, random = TRUE)`, 
`di2multi(phy, tol = 1e-8)`, 
`rotate(phy, node)`, 
`rotateConstr(phy, X)`, 
`reorder(phy, order = "cladewise")`

Some of the above functions have the option interactive (FALSE by default) and many are generic.

And some functions to explore the Baumraum (tree space)
`nni`, `rNNI`, `rSPR`, `allTrees`. 



## Comparative Methods and Biogeography

We usually don't simply stop when we have the tree. We often want to do some downstream analsyses using that phylogeny. This, in fact, is the whole point of the workshop. Broadly, phylogenetic comparative methods typically cluster into discrete and continuous trait methods. Continuous trait methods are for traits that can't be broken into discrete units. This often includes weights, measurements, and ratios. Discrete traits are, as the name implies, able to be broken down into discrete units. Biogeography often falls into this classification.

Both continuous and discrete trait methods (including biogeography) will typically use a model of evolution to trace a character from the tips of a tree to the root. As an example, let's a take a quick look at an ancestral state estimation. 

```r
library(geiger)
q <- list(rbind(c(-.5, .5), c(.5, -.5)))

trait <- geiger::sim.char(tree, par = q, model = "discrete", n=1)
fit <- ace(trait, tree, type = "discrete", model = "ER")
fit
```
Let's walk through this output: 

*Log-likelihood* is the likelihood of the data given the Equal-Rates model. The equal rates model can be seen right below - this model says that you are equally likely to go from a state 1 to a state 2 as vice versa - some of you may know this as the Mk model of Lewis (2001) or the Jukes-Cantor model (1969). 
*Scaled likelihoods at the root* is the likelihood of a state 1 or 2 at the root. We see these are nearly equivalent. Look at the tree - why should this be? 

Before we visualize this, we're going to install one more R Package that we didn't install prior to the workshop. Many, if not most, R packages are available via CRAN, which is a central packaging repository. However, others are available on GitHub. There are also alternative R package repositories, such as BioConductor. This is where ggtree lives. We will now install it:

```r
if (!require("BiocManager", quietly = TRUE))
    install.packages("BiocManager")

BiocManager::install("ggtree")
```

With ggtree installed, let's make some pretty graphics.


```r
library(ggtree)

plot <- ace(trait, tree, type = "discrete", model = "ER")

plot(tree, cex = 0.5, adj = c(0.2), type = "fan", 
     no.margin = TRUE, show.tip.label = FALSE)
tiplabels(pch = 16, col = c( "lightblue",
               "chocolate"))
nodelabels(pie = fit$lik.anc, cex = 0.5)
legend("bottomleft", pch = 15, bty = "n",
       legend = c("0", "1"), 
       col = c( "lightblue",
               "chocolate"))
               

```

Some of the earliest ways of mapping biogeography to trees were based on parsimony. In the time since, it became common to use methods like the above, while treating a landmas as a discrete state, finally, newer models, such as DEC, became more common to use for biogeography. Let's grab a dataset and take a ramble through some of these methods. 

First, we'll simulate a tree:

```r

big_tree <- rtree(45)
big_tree

```
`rtree` as a function simulates a random tree. Now let's add some data to it. This time, we will simulate a tree using a method called "All Rates Different." Unlike the Mk model or the Jukes-Cantor, this implies that the transition rates are all different between possible character states. 

```r
library(geiger)

geo <- rTraitDisc(big_tree, "ARD", rate = c(0.1, 0.2))
fit <- ace(geo, big_tree, type = "discrete", model = "ER")
fit
```

### Exercise: 

 + Try and plot the data from above to a tree.
 + What did we do wrong when we fit the trait model above? 
    + Can you fix it? 
    + How do you know that you've done something better by fixing it? What in this output suggests this? 
 + When you plot an ARD tree, how does it differ from the ER tree?
 
 ## Explicitly biogeographic models 
 
 The above is useful. However, we may want models with parameters that actually carry biogeographic meaning. The most common and well-used of these is the DEC model, standing for Dispersal-Extirpation-Cladogenesis. The idea of this is that a lineage could be dispersing, being removed from an area, or speciating. Described by Ree in 2005, this has gone on to be one of the more popular approaches to understanding phylogeography in deep time. R methods for doing this have fallen apart in the past few years. If there is interest, I'm happy to run this in RevBayes later this week. 
 
 
    

# References

Jukes T.H., Cantor C.R. 1969. Evolution of Protein Molecules. Mammalian Protein Metabolism. 3:21–132. 10.1016/B978-1-4832-3211-9.50009-7
Lewis P.O. 2001. A Likelihood Approach to Estimating Phylogeny from Discrete Morphological Character Data. Systematic Biology. 50:913–925. 10.1080/106351501753462876 

Paradis E. (2012) Definition of Formats for Coding Phylogenetic Trees in R [url](http://ape-package.ird.fr/misc/FormatTreeR_24Oct2012.pdf)

Paradis E. (2012) Analysis of Phylogenetics and Evolution with R, 2nd ed., Springer, New York 

Paradis E. & Schliep K. (2019) ape 5.0: an environment for modern phylogenetics and evolutionary analyses in R, Bioinformatics 35 (3), 526-528
 
Ree R.H., Moore B.R., Webb C.O., Donoghue M.J., Crandall K. 2005. A likelihood framework for inferring the evolution of geographic range on phylogenetic trees. Evolution. 59:2299–2311. 10.1111/j.0014-3820.2005.tb00940.x 

Schliep K.P. 2011. phangorn: phylogenetic analysis in R. Bioinformatics, 27(4) 592-593

