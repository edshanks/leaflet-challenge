let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson'

// empty array for mapped depth values below
let depths = []

// Perform a GET request to the query URL/
d3.json(url).then(result => {
  // Once we get a response, send the data.features object to the createFeatures function.
  console.log(result);
  createFeatures(result.features); 
  


  // map depths to a single array
  // use values as arguement for circlesColorLegend function
  depths.push(result.features.map(element => element.geometry.coordinates[2])
  );
  console.log("Depth", depths)  
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// determines size of circles based on earthquake magnitude
function magCircles(earthquakeData) {
  return (earthquakeData.properties.mag  **2)*4000
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// determines color of circles base on earthquake depth
function circlesColor(earthquakeData) {
  var depth = earthquakeData.geometry.coordinates[2];
  var color = 'white'

  return  depth > 90 ? 'DarkRed' :
          depth > 70 ? 'Red' : //was pink
          depth > 50 ? 'OrangeRed' :
          depth > 30 ? 'Orange' :
          depth > 10 ? 'Yellow':
                       'YellowGreen';
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// reads in depth from mapped depth array to determine colors in legend
// called in createLegend function
function circlesColorLegend(depth) {

  return  depth > 90 ? 'DarkRed' :
          depth > 70 ? 'Red' : //was pink
          depth > 50 ? 'OrangeRed' :
          depth > 30 ? 'Orange' :
          depth > 10 ? 'Yellow':
                       'YellowGreen';
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// creates legend
function createLegend(map) {
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
    
    // create div for legend
    var div = L.DomUtil.create('div', 'info legend'), 

        // binned depth values used in circlesColor
        depths2 = [-10,10,30,50,70,90]; 
        
        // add title to legend
        div.innerHTML += "<h4 style='text-align: center'>Depth</h4>"
        // console log newly added div
        console.log(div)

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depths2.length ; i++) {
        div.innerHTML +=

            // build legend HTML
            '<li style="background:' + circlesColorLegend(depths2[i] + 1) + '"></li> ' +
            depths2[i] + (depths2[i + 1] ? '&ndash;' + depths2[i + 1] + '<br>' : '+');
    }

    return div;
  }
  // add legend to myMap
  legend.addTo(map);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createFeatures(earthquakeData) {
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place, coordinates, time, and depth of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><p>Latitude: ${feature.geometry.coordinates[1]}</p><p>Longitude: ${feature.geometry.coordinates[0]}</p>
      <hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}<p/><p>Depth: ${feature.geometry.coordinates[2]} km<p/>`);

    };

    // loop through features and create circle markers for each data point
    // magCircles determines size of circles
    // circlesColor determines color of circles
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature, 

      pointToLayer: function(feature, latlng) {
        
        var circleMarkers = {
          radius: magCircles(feature),
          fillColor: circlesColor(feature),
          fillOpacity: 0.5,
          color: ''
          }

        return L.circle(latlng,circleMarkers);
        
      }
    });
   
  
    // Send our earthquakes layer to the createMap function
    createMap(earthquakes);
    
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// creates map
function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object.
  let baseMaps = {
      "Street Map": street
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
      Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
      center: [
      39, -100
      ],
      zoom: 4.5,
      layers: [street,  earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // create legend
  createLegend(myMap);
};