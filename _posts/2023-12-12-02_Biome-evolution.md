---
layout: posts
title: Lesson 5 - Biome evolution
date: 2023-12-12
type: post
published: true
author: "Barnabas Daru"
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

## Lecture 5
## Geographic range evolution/biome evolution

Please download the data for this lesson at: [Quercus_datasets](/assets/images/Quercus_datasets.zip)

A central theme of biogeography is to reconstruct ancestral distributions of biotas over evolutionary time scales to understand the processes by which biotas arose and how they may evolve in the future. Understanding how biodiversity evolved can inform modeling of the past, present and future of that biodiversity and can aid in:
+ design of protected areas that take into account diverse evolutionary processes, or 
+ the definition of how climate change may affect the future availability of resources.

### Geographic range evolution
The data most commonly used for reconstructing the ancestral geographical distributions of organisms includes:

+ fossils
+ phylogenetic trees (derived from genomes, transcriptomes and proteomes) 
+ intrinsic morphological traits of species
+ extrinsic geological or environmental features
+ species’ distribution information (range maps)

### Methods to infer biome evolution
+ Ancestral biome evolution
+ Timeslice biome evolution
+ Cross-taxon surrogates

#### 1. Ancestral biome evolution
#### 2. Phylogenetic timeslice biome evolution
Another method for inferring biome evolution is provided by slicing a dated phylogenetic tree at successive time depths. 

Davies and Buckley presented a novel framework that explored the diversity of lineages present at different time slices through the phylogenetic tree to gain insight into the evolutionary past of present-day diversity of mammals. 

We develop a similar framework in the R package phyloregion to explore the origin of contemporary biogeographic regions in southern Africa, but we successively remove phylogenetic structure in the tree linking the woody plant species in the regional flora to identify the evolutionary depth at which biogeographic regions collapse into each other. 

The phylogenetic depth at which biogeographic regions become indistinguishable may indicate the time at which they differentiated historically. 

```r
rm(list = ls())
library(terra)
library(phyloregion)
library(ape)
library(Matrix)

myfishnet <- function(mask, res) {
  s <- rast(res = res, ext(mask))
  crs(s) <- "epsg:4326"
  m <- as.polygons(s, dissolve = FALSE)
  m$grids <- paste0("v", seq_len(nrow(m)))
  m <- m[, "grids"]
  m[mask, ]
}

mylong2sparse <- function(x, grids = "grids", species = "species") {
  x <- as.data.frame(x)
  x <- x[, c(grids, species)]
  names(x) <- c("grids", "species")
  grids <- factor(as.character(x$grids))
  species <- factor(as.character(x$species))
  res <- sparseMatrix(as.integer(grids), as.integer(species), 
                      x = 1, dimnames = list(levels(grids), levels(species)))
  res
}

u <- "/Users/bdaru/Dropbox/Projects/Stanford/Daru_grants/2023/06_NSF-R package/WORKSHOP/Year3_New-Orleans/LectureNotes/Quercus_datasets/"
g <- vect(paste0(u, "USA_vector_polygon/States_shapefile.shp"))
g <- g[!(g$State_Name %in% c("ALASKA", "HAWAII")), ]
tr <- read.tree(paste0(u,"phylogeny/quercus_phylogeny.tre"))

f <- list.files(paste0(u, "geodata/Quercus"), 
                full.names = TRUE) |> lapply(vect)
v <- vect(f)
v$binomial <- gsub(" ", "_", v$binomial)

my_grids <- myfishnet(mask = g, res = 1)

j <- relate(v, my_grids, "intersects", pairs = TRUE)
y <- my_grids$grids[j[, 2]]
spp <- v$binomial[j[, 1]]
r <- data.frame(species = spp, grids = y)

y <- mylong2sparse(r)
tmp <- data.frame(grids = row.names(y), abundance = rowSums(y), 
                  richness = rowSums(y > 0))
z <- merge(my_grids, tmp, by = "grids")

mypolys2comm <- function(dat, res = 0.25, pol.grids = NULL, ...){
  if (!is.null(pol.grids)) {
    m <- pol.grids[, grep("grids", names(pol.grids)), drop = FALSE]
  }
  else {
    m <- myfishnet(mask = ext(dat), res = res)
    crs(m) <- "+proj=longlat +datum=WGS84"
  }
  pj <- "+proj=longlat +datum=WGS84"
  m <- suppressWarnings(invisible(project(m, "epsg:4326")))
  crs(m) <- pj
  j <- relate(dat, m, "intersects", pairs = TRUE)
  y <- m$grids[j[, 2]]
  spp <- dat$binomial[j[, 1]]
  r <- data.frame(species = spp, grids = y)
  y <- mylong2sparse(r)
  tmp <- data.frame(grids = row.names(y), abundance = rowSums(y), 
                    richness = rowSums(y > 0))
  z <- merge(m, tmp, by = "grids")
  return(list(comm_dat = y, map = z))
}

z <- mypolys2comm(dat = v, pol.grids = my_grids)
mydat <- z$comm_dat

index <- intersect(tr$tip.label, colnames(mydat))
tr1 <- keep.tip(tr, index)

pbc <- phylobeta(mydat, tr, index.family = "sorensen")
```
The `phyloregion` package provides functions for analysis of compositional turnover (beta diversity) based on widely used dissimilarity indices such as Simpson, Sorensen and Jaccard. The phyloregion's functions beta_diss and phylobeta compute efficiently the pairwise dissimilarity matrices for large sparse community matrices and phylogenetic trees for taxonomic and phylogenetic
turnover respectively. The results are stored as distance objects for
downstream analyses.'


