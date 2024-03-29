// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.title + 
    "</h3><hr><p>" + 'Magnitude:'+(feature.properties.mag) + "</p>"
     + new Date(feature.properties.time) + "</p>");
  }
  // var geoJson;

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature 

    //   geoJson = L.geoJson(data, {
    //     // Style for each feature (in this case a neighborhood)
    //     style: function(earthquakeData) {
    //       return {
    //         color: "white",
    //         // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
    //         fillColor: chooseColor(feature.properties.mag),
    //         fillOpacity: 0.5,
    //         weight: 1.5
    //       };
    //     },
    //     // Called on each feature
    //     onEachFeature: function(feature, layer) {
    //       // Setting various mouse events to change style when different events occur
    //       layer.on({
    //         // On mouse over, make the feature (neighborhood) more visible
    //         mouseover: function(event) {
    //           layer = event.target;
    //           layer.setStyle({
    //             fillOpacity: 0.9
    //           });
    //         },
    //         // Set the features style back to the way it was
    //         mouseout: function(event) {
    //           geoJson.resetStyle(event.target);
    //         },
    //         // When a feature (neighborhood) is clicked, fit that feature to the screen
    //         click: function(event) {
    //           map.fitBounds(event.target.getBounds());
    //         }
    //       });
    //       // Giving each feature a pop-up with information about that specific feature
    //       layer.bindPopup("<h1>" + feature.properties.neighborhood + "</h1> <hr> <h2>" + feature.properties.borough + "</h2>");
    //     }
    //   }).addTo(map);
    // });
    
       
  });
  

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

    

  
}
