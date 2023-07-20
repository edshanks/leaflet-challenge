# leaflet-challenge
This webpage displays all earthquakes with a magnitude of 2.5 or higher that have occured in the last 30 days around the world based on real-time data from the USGS (United States Geological Survey). The data itself is pulled directly from the USGS API (https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson). The size of each earthquake marker represents the earthquake's magnitude, while the color represents the depth. The color system is outlined in the legend in the lower-right-hand corner of the map. The inital zoom setting is such that the user only sees the continental United States initally. The user can zoom out to see earthquake data from around the world, or zoom in further to closer inspect any points of interest. Additionally, the earthquake markers can be toggled on and off with the layer control box in the upper right-hand corner of the screen.

To open the webpage, open "index.html" in the main repository. To access the javascript code, navigate to the folder titles "static", then to the folder titled "js", and then open "logic.js". A file named "choropleth.js" can also be found in this directory. This file is for formatting involved in creating the map's legend. To access the CSS code, navigate to the folder titles "static", then to the folder titled "css", and then open "style.css".

While workign on this project, I received help from my instructor, Tom. He helped with the section of code which creates the earthquake markers. I also relied heavily on the Leaflet cloropleth documentation while creating the function which renders the map's legend (https://leafletjs.com/examples/choropleth/).
