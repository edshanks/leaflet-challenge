let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson';

d3.json(url).then(result => {
    // Once we get a response, send the data.features object to the createFeatures function.
    console.log(result);
    createMap(result.features)
  });

function markerSize(magnitude) {
    return magnitude**0.5
};


function createMap(earthquakeData) {
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create a baseMaps object.
    let baseMaps = {
        "Street Map": street,
    };

    let myMap = L.map("map", {
        center: [
        37.09, -95.71
        ],
        zoom: 5,
        layers: [street]
    });

    for (let i=0; i < earthquakeData.length; i++) {
                                    // lat                                      // lon
        L.circle(earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0], {
            fillOpacity: 0.75,
            color: 'green',
            fillColor: 'purple',
            radius: markerSize(earthquakeData[i].properties.mag)
        }).bindPopup(`<h3>${earthquakeData[i].properties.place}</h3><hr><p>${new Date(earthquakeData[i].properties.time)}</p>`).addTo(myMap);
    };
};


//.bindPopup(`<h3>${earthquakeData[i].properties.place}</h3><hr><p>${new Date(earthquakeData[i].properties.time)}</p>`)