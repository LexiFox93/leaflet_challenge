// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

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





// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  });

   // Define a baseMaps object to hold our base layers
   var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  }
  darkmap.addTo(myMap);
  streetmap.addTo(myMap);

  function createFeatures(data) {
    

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time and magnitude of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.title + 
      "</h3><hr><p>" + 'Magnitude:'+(feature.properties.mag) + "</p>"
       + new Date(feature.properties.time) + "</p>");
  
         // Loop through the earthquakes and create one marker for range of magnitude
        for (var i = 0; i < feature.properties.mag; i++) {
  
          // Conditionals for countries points
          var color = "";
          if (feature.properties.mag[i] > 5) {
            color = "yellow";
          }
          else if (feature.properties.mag[i] > 3) {
            color = "blue";
          }
          else if (feature.properties.mag[i] > 1) {
            color = "green";
          }
          else {
            color = "red";
          }
  
    // Add circles to map
    L.circle(feature.properties.place[i], {
      fillOpacity: 0.75,
      color: "white",
      fillColor: color,
      // Adjust radius
      radius: 1500
    }).bindPopup("<h1>" + feature.properties.place[i] + "</h1> <hr> <h3>Magnitude: " + feature.properties.mag[i] + "</h3>").addTo(myMap);
    }
    }
    
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

 

// Sending our earthquakes layer to the createMap function
createMap(earthquakes,baseMaps);

function createMap(earthquakes,baseMaps) {

 

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps,earthquakes, {
    collapsed: false
  }).addTo(myMap);

}


}