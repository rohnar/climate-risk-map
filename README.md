## Purpose
This is a UI prototype for a climate risk map available at: https://rohnar.github.io/climate-risk-map/

## Technical Decisions

### Data Fetching/Filtering
On mounting the component, data is parsed from the csv. Data is sorted by year and coordinates (year sorting gives an easy way to find the limits for the year selector, coordinate sorting comes in handy for clustering - see next section). 

Any filtering updates a seperate state containing the appropriate subset of data which is also accessed by the map. 

#### One improvement here would be to seperate the map filtering and table filtering and fade out markers that are not included in the current filtered subset. For example, the map state would contain all points for the decade 2030 however another state of data would contain data matching an asset search. All markers matching the asset name search would be coloured in, the remaining would be faded.

Ideally for a full stack project, we would paginate the data on the server/database ex: sql offset/limit or spring pageable. Since this is a demo static site I take array slices of the parsed data.

### Map Markers
To speed up rendering I took advantage of the fact that the data was sorted by coordinates. I cluster the points as they are added, in most situations this results in 10 points getting added to the map when it is zoomed out.

@TODO when zoomed in: expand points showing risk color. Zoomed out state should also summarize risk color

## Stack
Nuxt 3 SPA
Data parsing: papaparser, note this is a simple solution for prototyping on a static site, in practice this would make a call and paginate data in the server for best performance.
Styling: mix of traditional CSS and WindiCSS for quick styles

## Resources:
Nuxt 3 docs: https://nuxt.com/
Leaflet docs: https://leafletjs.com/examples/quick-start/
ElementPlus: https://element-plus.org/en-US/
