require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer"
], function (Map, MapView, FeatureLayer) {

  const map = new Map({
    basemap: "streets-navigation-vector"
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-98.0, 30.0],
    zoom: 10
  });

  const layerA = new FeatureLayer({
    url: "https://services1.arcgis.com/M68M8H7oABBFs1Pf/arcgis/rest/services/Demographics2010WebMapping_Updated/FeatureServer/0",
    opacity: 0.65,
    outFields: ["GEOID10", "POP2010", "Median_Age_2010", "F__Occupied_Housing", "Median_Income"],

  popupTemplate: {
    title: "2010 Demographics – Tract {GEOID10}",
    content: [{
      type: "fields",
      fieldInfos: [
        { fieldName: "GEOID10", label: "Census Tract" },
        { fieldName: "POP2010", label: "Population (2010)" },
        { fieldName: "Median_Age_2010", label: "Median Age (2010)" },
        { fieldName: "F__Occupied_Housing", label: "% Occupied Housing (2010)" },
        { fieldName: "Median_Income", label: "Median Household Income (2010)" },
      ],
    }]
  }
  });

  map.add(layerA);

});
