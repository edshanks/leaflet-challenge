let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson';

// Perform a GET request to the query URL/
d3.json(url).then(result => {
  // Once we get a response, send the data.features object to the createFeatures function.
  console.log(result);
});
