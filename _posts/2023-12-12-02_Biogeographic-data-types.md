---
layout: posts
title: Lesson 4 - Biogeographic data types
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

## Lecture 4
## Methods to infer biogeography patterns/processes

### Fossils (e.g., pollen)
+ Paleoenvironments
+ Pollen records
+ Dating 

### DNA/molecular
+ Phylogenetic trees
+ Ancestral area reconstruction
+ Extinction
+ Speciation
+ Dispersal

### Species occurrences
+ GBIF
+ Point records
+ Raster layers
+ Range polygons

## Fossil data
Biogeographers study fossils to learn about past geological events, climates, and evolution.  Fossils are preserved remains or traces of living things. Fossils normally form in sedimentary rock. Hard parts are the only parts of an organism that leaves a fossil.
Examples: Bones, shells, teeth, seeds, and woody stems. 

However, fossils are not available for most taxonomic groups e.g., soft-body organisms, and geographic regions e.g., the tropics.

## DNA sequence data
Perhaps the most important method for inferring phylogenetic relationships of life is that of acquiring DNA sequences. 
DNA sequence data basically refers to the sequence of nucleotides (adenine = A, cytosine = C, guanine = 0, or thymine = T) in a particular region of the DNA of a given taxon.
DNA sequences are aligned and used for phylogenetic reconstruction.

## Other types of data for biogeographic research
Biogeographical data can be linked to a wide range of organismic (e.g., taxonomic, functional, phylogenetic) and environmental (e.g., climate, soil, topography) information. 

## Species occurrence data
Species occurrences can be represented by point records, vegetation plots, checklists, range polygon maps, or raster layers. 

### 1. Point records
Point occurrences indicate points on a map where a species has been recorded. Point records often show localities where museum or herbarium specimens have been collected or observed. They are often prevalent with sampling gaps and biases.

For this lesson, we will download some geographic data from the Global Biodiversity Information Facility (GBIF, [https://www.gbif.org/](https://www.gbif.org/)). You can optionally use the `geodata` R package to download geographic data. The `geodata` package has functions for downloading different types of geographic data including climate, crops, elevation, land use, soil, species occurrence, accessibility, administrative boundaries and other data. This means that internet access is required to download the datasets. 

Here, we will directly download occurrence records from GBIF for all the oak species in the genus *Quercus* (Plantae >> Tracheophyta >> Magnoliopsida >> Fagales >> Fagaceae >> Quercus, n = 5,465,327 records) [https://doi.org/10.15468/dl.3b7amt](https://doi.org/10.15468/dl.3b7amt). Note, the compressed data size is: 465.7 MB and the actual data size is 3.5GB. So be sure to have some space on your computer to download it. Next, we will process this dataset in several steps:

#### Step 1: Data cleaning
We will use the R package `CoordinateCleaner` to clean the records to remove duplicates and records with erroneous localizations. Depending on the goals of your study, there are many ways of cleaning the dataset. For example, you may want to remove records with questionable scientific names by querying against currently accepted taxonomies for the taxonomic group of interest.

Since the genus *Quercus* is widely distributed in the Northern Hemisphere, we will clean it by removing all records south of the equator, i.e., latitude < 0

```r
u <- "/Users/datasets/"
d <- data.table::fread(paste0(u, "0026030-231120084113126.csv"))
head(d)
```

Inspecting the data, you will notice several fields, but since we're interested in geography, we'll only keep the species and geographic coordinates (longitude and latitude fields). Note: most geographic analyses in R requires the coordinates arranged as longitude before latitude.

```r
q <- d[, c("species", "decimalLongitude", "decimalLatitude")] 
names(q)[c(2,3)] <- c("lon", "lat")
q <- q[!(q$species %in% ""),] |> unique() |> na.omit()
length(unique(q$species)) # count the number of species = 699
r <- q[q$lat>0,]
```

We can plot the distribution for one of the species, White Oak (*Quercus alba*). Note: don't attempt to plot the entire dataset as it can freeze your computer.'

```r
ex <- r[r$species %in% "Quercus alba", ]
plot(ex$lon, ex$lat)
```
Depending on the data source, an ultimate goal is to convert the distribution data to a community data frame across different sites and geographic extents for downstream analyses.

Thus, it is important to define the study extent. For illustration purposes, we will download vector polygons for the lower 48 Contiguous United States (not including AK, HI and PR) from
[https://hub.arcgis.com/datasets/1b02c87f62d24508970dc1a6df80c98e/explore](https://hub.arcgis.com/datasets/1b02c87f62d24508970dc1a6df80c98e/explore). Simply download and store the folder on your computer locally. You can also use the function `world` in the package `geodata` to get the borders for all the countries in the world. 

First, we will use the R package `terra` for most of our geographical manipulations.

```r
library(terra)
v <- vect(paste0(u, "States_shapefile-shp/States_shapefile.shp"))
v <- v[!(v$State_Name %in% c("ALASKA", "HAWAII")), ]
```
Let's assume that we want to define equal size quadrats or grid cells or fishnet of 1 degree resolution across the entire landscape of conterminous USA.

```r
s <- rast(res = 1, ext(v))
crs(s) <- "epsg:4326"
m <- as.polygons(s, dissolve = FALSE)
m$grids <- paste0("v", seq_len(nrow(m)))
m <- m[, "grids"]
z <- m[v, ]
```
We can write a function to automate this process as follows:

```r
myfishnet <- function(mask, res) {
  s <- rast(res = res, ext(mask))
  crs(s) <- "epsg:4326"
  m <- as.polygons(s, dissolve = FALSE)
  m$grids <- paste0("v", seq_len(nrow(m)))
  m <- m[, "grids"]
  m[mask, ]
}

my_grids <- myfishnet(mask = v, res = 1)
```

#### Step 2: Convert raw input distribution data to community
Here, we will convert the raw point occurrence data to a community composition data frame across the quadrats we generated for mainland USA.

```r
b <- vect(pt)
j <- relate(b, my_grids, "intersects", pairs = TRUE)
y <- my_grids$grids[j[, 2]]
spp <- b$species[j[, 1]]
r <- data.frame(species = spp, grids = y)
```
We can easily convert this long-form dataset to a community composition matrix of 1s and 0s, with species as columns and rows as spatial cells or communities. However, such data storage can be computationally challenging and expensive. To overcome this challenge, we will use a sparse matrix approach using the R package `Matrix`. Because a sparse matrix is comprised mostly of 0s, it only stores the non-zero entries, from which several measures of biodiversity can be calculated. 

```r
library(Matrix)
x <- as.data.frame(r)
x <- x[, c("grids", "species")]
names(x) <- c("grids", "species")
grids <- factor(as.character(x$grids))
species <- factor(as.character(x$species))
res <- sparseMatrix(as.integer(grids), as.integer(species), 
                    x = 1, dimnames = list(levels(grids), levels(species)))
```

This can also be written up as a function and we can call it `mylong2sparse`

```r
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

test1 <- mylong2sparse(r)
```

We can wrap this and the previous chunks of code into a function called `mypoints2comm`

```r
mypoints2comm <- function(dat, res = 0.25, pol.grids = NULL, ...) {
  dat <- na.omit(dat)
  if (!is.null(pol.grids)) {
    m <- pol.grids[, grep("grids", names(pol.grids)), drop = FALSE]
  }
  else {
    m <- fishnet(mask = ext(vect(dat)), res = res)
    crs(m) <- "+proj=longlat +datum=WGS84"
  }
  pj <- "+proj=longlat +datum=WGS84"
  m <- suppressWarnings(invisible(project(m, "epsg:4326")))
  crs(m) <- pj
  b <- vect(dat)
  j <- relate(b, m, "intersects", pairs = TRUE)
  y <- m$grids[j[, 2]]
  spp <- b$species[j[, 1]]
  r <- data.frame(species = spp, grids = y)
  y <- mylong2sparse(r)
  tmp <- data.frame(grids = row.names(y), abundance = Matrix::rowSums(y), 
                    richness = Matrix::rowSums(y > 0))
  z <- merge(m, tmp, by = "grids")
  return(list(comm_dat = y, map = z))
}

z <- mypoints2comm(dat = pt, pol.grids = my_grids)
names(z)
```
The output is a list of two objects: `comm_dat`: (sparse) community matrix and `map`: vector or raster of grid cells with the values per cell for mapping.

```r
mp <- z$map
head(mp)

par(mfrow=c(2,1))
plot(mp, "richness", type="continuous")
plot(mp, "abundance", type="continuous")
```

### 2. Range polygons
Range polygons or range maps show a range as an area, typically shaded, within a boundary.  The boundary line defines the limits of the known distribution of the species. Often much guesswork involved.
Polygons can be derived from the International Union for the Conservation of Nature's spatial database (https://www.iucnredlist.org/resources/spatial-data-download), published monographs or field guides that have been validated by taxonomic experts.

Next, we will convert the point occurrences to range polygons using the R package `rangeBuilder`. This will allow us to generate alpha hulls. We will then crop the alpha hulls to terrestrial areas by removing areas falling in the ocean.

```r
library(rangeBuilder)
length(unique(pt$species))
```
Because our point occurrence data has 698 species, we should split the data into a manageable size.

```r
f <- split(pt, pt$species)
```
Next, we will use the `getDynamicAlphaHull` function in the R package `rangeBuilder` to generate the alpha hulls. However, the process of generating alphahulls is quite complicated and requires some tweaking of the parameters especially because species occurrence records vary in terms of their sampling -- some species are more or less sampled than others. For species that are oversampled, it's important to thin them to speed up computational time. By contrast, species with very few records should be 'helped' by buffering and random sampling around such points. For the spatial thinning, we will first use the `geodata` package to download a elevation raster layer for the thinning. Any raster layer would work. We then use the `gridSample` function from `dismo` for the thinning.

```r
ras <- geodata::elevation_global(res=10, path="/Users/bdaru/Downloads")

l <- lapply(f[1:20], function(x) {
  sp <- unique(x$species)
  if(nrow(x) < 5) {
    y <- buffer(vect(x, crs = "+proj=longlat"), width = 50000)
    y <- spatSample(y, size = 100)
    q <- geom(y, df = TRUE)[, c("x", "y")]
    names(q) <- c("lon", "lat")
    q$species <- sp
    y <- q[, c("species", "lon", "lat")]
  } else if(nrow(x) > 2000) {
    y <- dismo::gridSample(x[, c("lon", "lat")], r = ras)
    y <- data.frame(species = sp, y)
  } else {
    y <- x
  }
  p <- tryCatch(getDynamicAlphaHull(y, coordHeaders = c("lon", "lat"),
                                    clipToCoast = 'no', initialAlpha = 2),
                error = function(e) NULL)
  if (!is.null(p)) {
    q <- vect(p[[1]])
    z <- crop(q, v) |> terra::aggregate(dissolve = TRUE)
    if(geomtype(z)=="polygons") {
      z$binomial <- sp
      return(z)
    }
  } 
})
out <- Filter(Negate(is.null), l)

v2 <- vect(out)
```
Just like we did for point records, we can convert the polygon range maps to a community matrix by overlaying them onto quadrats to extract presences and absences within the quadrats. This can be achieved using the `relate` function in `terra`.

```r
j <- relate(v2, my_grids, "intersects", pairs = TRUE)
y <- my_grids$grids[j[, 2]]
spp <- v2$binomial[j[, 1]]
r <- data.frame(species = spp, grids = y)

y <- mylong2sparse(r)
tmp <- data.frame(grids = row.names(y), abundance = rowSums(y), 
                  richness = rowSums(y > 0))
z <- merge(m, tmp, by = "grids")
```

We can write it up as a function as follows:
```r
mypolys2comm <- function(dat, res = 0.25, pol.grids = NULL, ...){
  if (!is.null(pol.grids)) {
    m <- pol.grids[, grep("grids", names(pol.grids)), drop = FALSE]
  }
  else {
    m <- fishnet(mask = ext(dat), res = res)
    crs(m) <- "+proj=longlat +datum=WGS84"
  }
  pj <- "+proj=longlat +datum=WGS84"
  m <- suppressWarnings(invisible(project(m, "epsg:4326")))
  crs(m) <- pj
  j <- relate(dat, m, "intersects", pairs = TRUE)
  y <- m$grids[j[, 2]]
  spp <- dat$binomial[j[, 1]]
  r <- data.frame(species = spp, grids = y)
  y <- long2sparse(r)
  tmp <- data.frame(grids = row.names(y), abundance = rowSums(y), 
                    richness = rowSums(y > 0))
  z <- merge(m, tmp, by = "grids")
  return(list(comm_dat = y, map = z))
}

test3 <- mypolys2comm(dat = v2, pol.grids = my_grids)
```  

Similar to `mypoints2comm`, the output from `mypolys2comm` is also a list of two objects: `comm_dat`: (sparse) community matrix and `map`: vector or raster of grid cells with the values per cell for mapping.

```r
mp2 <- test3$map
head(mp2)

par(mfrow=c(2,1))
plot(mp2, "richness", type="continuous")
plot(mp2, "abundance", type="continuous")
```
#### EXERCISE
Based on all the tools you have learned so far, download occurrence records for the Eucalyptus species of Australia from GBIF. Read them in, clean, and map species richness and abundances based on point records for the first 100 species across equal area grid cells of 0.5 degrees. Generate range polygons for the first 100 species and use that to generate species richness and abundance of the species. Compare your richness maps from point records against that of polygons using a simple linear regression.

#### CHALLENGE
Write a function to match the species list from point records versus that of polygons.

### 3. Raster layers
Raster layers maps are generally derived from species distribution modelling. This is an entirely broad subject and will be covered separately as its own topic.

