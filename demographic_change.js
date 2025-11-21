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
    url: "https://services1.arcgis.com/M68M8H7oABBFs1Pf/arcgis/rest/services/Demographics2020WebMapping_Updated/FeatureServer/0",
    opacity: 0.65
    outFields: ["TRACTCE", "POP2020", "Median_Age2020", "PercentOccupiedHousing2020", "Median_Household_Income2020"],

  popupTemplate: {
    title: "2020 Demographics – Tract {TRACTCE}",
    content: [{
      type: "fields",
      fieldInfos: [
        { fieldName: "TRACTCE", label: "Census Tract" },
        { fieldName: "POP2020", label: "Population (2020)" },
        { fieldName: "Median_Age2020", label: "Median Age (2020)" }
        { fieldName: "PercentOccupiedHousing2020", label: "% Occupied Housing (2020)" },
        { fieldName: "Median_Household_Income2020", label: "Median Household Income (2020)" },
      ]
    }]
  }
  });

  const layerB = new FeatureLayer({
    url: "https://services1.arcgis.com/M68M8H7oABBFs1Pf/arcgis/rest/services/Demographics2010WebMapping_Updated/FeatureServer/0",
    opacity: 0.65
  });

  map.addMany([layerA, layerB]);

});
