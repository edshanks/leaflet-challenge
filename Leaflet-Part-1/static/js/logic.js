//let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson';
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson'

let depths = []
// Perform a GET request to the query URL/
d3.json(url).then(result => {
  // Once we get a response, send the data.features object to the createFeatures function.
  console.log(result);
  createFeatures(result.features); //////////////// + depths
  


  // find max and min depths of dataset
  // use values to build circlesColor function
  depths.push(result.features.map(element => element.geometry.coordinates[2])
  );
  console.log("Depth", depths)

  minValue = Infinity;
  maxValue = -Infinity;
  for (element of depths[0]) {
      // Find minimum value
      if (element < minValue)
      minValue = element;
                  
      // Find maximum value
      if (element > maxValue)
      maxValue = element;
  }

  console.log("Min depth", minValue) //-1.14
  console.log("Max depth", maxValue) // 653.608 

  //createLegend(myMap)

  
});

function magCircles(earthquakeData) {
  return (earthquakeData.properties.mag  **2)*4000
};





function circlesColor(earthquakeData) {
  var depth = earthquakeData.geometry.coordinates[2];
  var color = 'white'

  return  depth > 90 ? 'purple' :
          depth > 70 ? 'pink' :
          depth > 50 ? 'orange' :
          depth > 30 ? 'blue' :
          depth > 10 ? 'green':
                       'red';
  
};

// called in createLegend function
function circlesColorLegend(depth) {

  return  depth > 90 ? 'purple' : 
  depth > 70 ? 'pink' : 
  depth > 50 ? 'orange' :
  depth > 30 ? 'blue' :
  depth > 10 ? 'green':
               '#FF0000'; //red
}



/*function createLegend(map) {
  var legend = L.control({position: 'bottomright'});
  var labels = []

  legend.onAdd = function (map) {
    
    var div = L.DomUtil.create('div', 'info legend');  //was comma
   
        depths2 = [0,10,30,50,70,90]; // was comma
        labels = [];

        console.log(div)
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depths2.length ; i++) {
        div.innerHTML +=
            
            '<i style="background:' + `${circlesColorLegend(depths2[i] + 1)}"` + '></i> ' +
            depths2[i] + (depths2[i + 1] ? '&ndash;' + depths2[i + 1] + '<br>' : '+');
    }

    return div;
  
  }
  legend.addTo(map);
};*/

// modified solution
function createLegend(map) {
  const legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

		const div = L.DomUtil.create('div', 'info legend');
		const depths2 = [0,10,30,50,70,90];
    const labels = [];
		let from, to;

		for (let i = 0; i < depths2.length; i++) {
			from = depths2[i];
			to = depths2[i + 1];

			labels.push(`<i style="background:${circlesColorLegend(from + 1)}"></i> ${from}${to ? `&ndash;${to}` : '+'}`);
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};

	legend.addTo(map);

};



function createFeatures(earthquakeData) {
    
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}<p/><p>Depth: ${feature.geometry.coordinates[2]} km<p/>`);
      
      //L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]],{
    }


    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature, 

      pointToLayer: function(feature, latlng) {
        
        var circleMarkers = {
          radius: magCircles(feature),
          fillColor: circlesColor(feature),
          fillOpacity: 0.4,
          color: ''
          
        }

        return L.circle(latlng,circleMarkers);
        
      }
    });
   
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
    
};


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
      zoom: 4.8,
      layers: [street,  earthquakes]
  });

  


     // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  createLegend(myMap);

  
};