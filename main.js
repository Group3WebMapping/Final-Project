require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer"
], function(Map, MapView, FeatureLayer) {

  // Create the map
  const map = new Map({
    basemap: "streets-navigation-vector"
  });

  // Create the view
  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-98.0, 30.0],   // Hays County area
    zoom: 11
  });

  // Add the hosted feature layer
  const popLayer = new FeatureLayer({
    url: "https://services1.arcgis.com/M68M8H7oABBFs1Pf/arcgis/rest/services/PopulationChange20102020Fixed/FeatureServer/0"
  });

  map.add(popLayer);
});
