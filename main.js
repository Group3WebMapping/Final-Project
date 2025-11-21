require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer"
], function(Map, MapView, FeatureLayer) {

  const map = new Map({
    basemap: "streets-navigation-vector"
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-98.0, 30.0],
    zoom: 10
  });

  const popLayer = new FeatureLayer({
    url: "https://services1.arcgis.com/M68M8H7oABBFs1Pf/arcgis/rest/services/PopulationChange20102020Fixed/FeatureServer/0",
    outFields: ["TRACTCE", "POP2010","POP2020" "POPCHANGE"],

  popupTemplate: {
    title: "Census Tract {TRACTCE}",
    content: [{
      type: "fields",
      fieldInfos: [
        { fieldName: "TRACTCE", label: "Census Tract" },
        { fieldName: "POP2010", label: "Population (2010)" },
        { fieldName: "POP2020", label: "Population (2020)" },
        { fieldName: "POPCHANGE", label: "Population Change (2010–2020)" }
      ]
    }]
  }
  });

  map.add(popLayer);
});
