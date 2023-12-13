var store = [{
        "title": "Lesson 1 - Packaging R Code",
        "excerpt":"Lesson 1 - Packaging R Code (Wright) Objectives: Be able to explain why put code in an R package. Understand the parts of an R package. Why Put Code In a Package? We’re all busy, stressed-out people. Why should we put in the effort to package code, when we could...","categories": ["Updates"],
        "tags": ["link","Post Formats"],
        "url": "/updates/01_Packaging-R-Code-Wright/",
        "teaser": null
      },{
        "title": "Lesson 2 - Tree structure",
        "excerpt":"Lecture 2 knitr::opts_chunk$set(echo = TRUE) knitr::opts_chunk$set(class.source='fold-show') knitr::opts_chunk$set(collapse = TRUE) library(phangorn) nr_desc &lt;- function(x){ x &lt;- reorder(x, \"postorder\") res &lt;- numeric(max(x$edge)) res[1:Ntip(x)] = 1L for(i in 1:nrow(x$edge)){ tmp = x$edge[i,1] res[tmp] = res[tmp] + res[x$edge[i,2] ] } res } root_to_tip &lt;- function(x){ x &lt;- reorder(x) res &lt;- numeric(max(x$edge)) for(i in 1:nrow(x$edge)){...","categories": ["Updates"],
        "tags": ["link","Post Formats"],
        "url": "/updates/02_Tree-structure/",
        "teaser": null
      },{
        "title": "Lesson 4 - Biogeographic data types",
        "excerpt":"Lecture 4 Methods to infer biogeography patterns/processes Fossils (e.g., pollen) Paleoenvironments Pollen records Dating DNA/molecular Phylogenetic trees Ancestral area reconstruction Extinction Speciation Dispersal Species occurrences GBIF Point records Raster layers Range polygons Fossil data Biogeographers study fossils to learn about past geological events, climates, and evolution. Fossils are preserved remains...","categories": ["Updates"],
        "tags": ["link","Post Formats"],
        "url": "/updates/02_Biogeographic-data-types/",
        "teaser": null
      }]
