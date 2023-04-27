## Purpose
This is a simple UI prototype for a climate risk map

## Technical Decisions
### Data Fetching/Filtering
Data is parsed from the csv and sorted by year, this gives me an easy way to filter years and understand the time boundaries (first and last row)

Ideally for a full stack project, we would paginate the data on the server/database ex: sql offset/limit. Since this is a static site I take array slices of the parsed data.

### Map Markers
@TODO: To speed up rendering, it's possible to place markers depending on the boundaries of the current map
If there are too many points, group the markers in clusters...

## Stack
Nuxt 3 SPA
Data parsing: papaparser, note this is a simple solution for prototyping on a static site, in practice this would make a call and paginate data in the server for best performance.
Styling: mix of traditional CSS and WindiCSS for quick styles

## Resources:
Nuxt docs: https://nuxt.com/
Leaflet docs: https://leafletjs.com/examples/quick-start/
