---
layout: posts
title: Lesson 4 - Data types (points, polygons, rasters, phylogenies)
date: November 20, 2020
type: post
published: true
classes: wide
status: publish
share: true
author: barnabas_daru
excerpt_separator: <!--more-->
categories:
- Updates
header:
  overlay_image: /assets/images/taita-thrush.jpg
  overlay_filter: 0.2
  caption: "Photo credit: [**Niall Perrins**](http://www.niall.co.za/)"
excerpt: ""
tags:
  - link
  - Post Formats
---

## Endemism patterns are scale dependent

The spatial variation of biodiversity patterns has for long fascinated biologists, yet our knowledge of how this phenomenon varies from local, regional and global scales have been predicated on models fitted to species richness, extinction risk or density dependence. As a consequence, little is known about how patterns of endemism vary with scale. Writing in [**_Nature Communications_**](https://doi.org/10.1038/s41467-020-15921-6){:target="_blank"}, we analysed global datasets of ~10,000 bird species and 6000 species of amphibians including their geographic distributions and phylogenetic relationships, to test the extent to which patterns of endemism depend on scale. We find that patterns of weighted and phylogenetic endemism (the two common methods for measuring endemism) are sensitive to differences in spatial resolution, geographical extent and taxonomic treatment. In addition, no matter the scale, hotspots of endemism are poorly covered by the current network of protected areas. These observations have direct implications for our understanding of how scale can influence interpretation of biodiversity patterns and may offer clues on how to prioritize areas for conservation.

<!--more-->

Endemism is the geographical distribution of a species in a restricted area of the world, and it is an important quantity in conservation biogeography. But we still lack answers to fundamental questions about the sensitivity of endemism to its scale of measurement. Are patterns of endemism of different organisms different across scales? At what scale is endemism sensitive to variation in the climate of an area? And how effective are protected areas in safeguarding endemism across scales?

Together with researchers Alexandre Antonelli of Royal Botanic Gardens Kew London, and Harith Farooq and Søren Faurby of University of Gothenburg in Sweden, we got to the root of these questions by using new analytical tools designed for biogeographic investigations tailored for megaphylogenies and macroecological datasets. Rather than defining areas of endemism based on the number of endemic species, which has been the standard approach so far, we analysed weighted endemism and phylogenetic endemism separately for all birds and amphibians across the globe. We then investigated whether patterns of endemism depend on the measurement scale, varying across spatial resolution, geographic extent (global, continental or national) and taxonomic knowledge (i.e., lumping or splitting) based on species’ divergence times from 1, 2, 3 to 5 million years ago.

The first striking result is that hotspots of weighted endemism are sensitive to geographic resolution, decreasing at courser resolutions than finer resolutions and when treated by taxonomic lumping. The extent of the variation is similar for both birds and amphibians. This finding suggests that analysis at courser resolutions can easily miss microendemic species such as the Taita thrush (Fig. 1) confined to tiny forest patch of 300 hectares in Taita Hills of Kenya.

![Taita-thrush](/assets/images/taita-thrush.jpg){:class="img-responsive"}
{:.image-caption}
Figure 1: The Taita Thrush (_Turdus helleri_) is endemic to the Taita Hills in Kenya. Coarse resolution analysis of endemism can easily miss such a species. Photo credit: Niall Perrins.

The second important finding is that patterns of phylogenetic endemism vary with geographic extent and differ at global, continental or local (country level) scales. For instance, at the global extent, popular biodiversity hotspots like the ones in Madagascar, Africa, Mesoamerica, the Andes, Papua New Guinea and South-Central China are evident when measured at finer resolutions. However, these effects disappear at the continental or country extents. Indeed, at the country level, hotspots of phylogenetic endemism became scattered across countries, often clustering around country borders. These suggest that the phylogenetic endemism metric is not influenced by variations in taxonomic opinion but instead reflects the degree to which the phylogeny is restricted to a single area. For example, the Galápagos penguin (_Spheniscus mendiculus_) is the only penguin that naturally occurs outside the Southern Hemisphere found nowhere else but the Galápagos Islands north of the equator. This species is expected to have a higher phylogenetic endemism at a continental scale north of the equator, but lower in a global setting because it has about 20 close relatives restricted to the Southern Hemisphere.

Finally, our analysis shows massive deficits of protection for hotspots of endemism of birds and amphibians. This result is evident regardless of the spatial resolution, geographic extent or taxonomic treatment. Most of the hotspots fall below the critical 10% threshold, a global target advocated for safeguarding biodiversity. The only exceptions are hotspots of amphibian phylogenetic endemism, which marginally meet the minimum 10% protection level. This means that conservation managers have the challenge of expanding protection to these unique quantities of biodiversity across the different scales.

Taken together, our study thus provides an example of how the choice of measurement scale can influence patterns of endemism and consequently the prioritization of conservation efforts. For instance, new developments in the field of systematics often lead to continuous changes in the delimitation of species either through lumping several species into one or splitting single species into several. Such taxonomic changes can be detrimental to conservation efforts if species are delisted from prioritization efforts due to taxonomic lumping or populations are managed as distinct when in fact they belong to one species in the case of taxonomic splitting leading to inbreeding issue. Furthermore, quantifying endemism at coarser resolutions can easily miss hidden patterns at the community level such as conservation areas under increasing threat from human activities.

One outstanding question that remains is how widespread scale-dependency of endemism is. We quantified the effects of scale on endemism patterns of birds and amphibians, but other organisms such as plants, microbes, fishes, with very different evolutionary histories might show different patterns. Such a cross-taxon framework would be of immense importance for postulating hypotheses in historical biogeography and setting conservation targets because endemism patterns capture facets of biodiversity not represented elsewhere. However, integrating analyses of endemism in the real-world might be hindered for reasons ranging from lack of data and budget constraints to social, economic and political factors. These limitations should not detract from the most useful aspect of this paper, that patterns of endemism are scale dependent. The recent development of evidence-based tools that are transparent, reproducible, and more defensible for the decision-making process (e.g., the new R package [`phyloregion`](https://doi.org/10.1111/2041-210X.13478){:target="_blank"}) could remedy these shortcomings. Our results based on analysis of mega phylogenies and macroecological datasets of ever-increasing size and complexity will hopefully establish a paradigm for related approaches in the modern age of biogeography.

[Read the full publication.](https://doi.org/10.1038/s41467-020-15921-6){:target="_blank"}

**Recommended citation:** Daru, B.H., Farooq, H., Antonelli, A. & Faurby, S. (2020) Endemism patterns are scale dependent. **_Nature Communications_** 11: 2115 doi: [10.1038/s41467-020-15921-6](https://doi.org/10.1038/s41467-020-15921-6){:target="_blank"}

**Publication Authors**: Barnabas H. Daru, Harith Farooq, Alexandre Antonelli, Søren Faurby
