require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/renderers/HeatmapRenderer"
], function(Map, MapView, FeatureLayer, HeatmapRenderer) {

  const map = new Map({
    basemap: "streets-navigation-vector"
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-98.0, 30.0],
    zoom: 10
  });

    const heatmapLayer = new FeatureLayer({
    visible: false,
    url: "https://services1.arcgis.com/M68M8H7oABBFs1Pf/arcgis/rest/services/PopChange_WPoints/FeatureServer/0",
    renderer: {
      type: "heatmap",
      colorStops: [
        { ratio: 0, color: "rgba(0, 0, 255, 0)" },
        { ratio: 0.4, color: "rgba(0, 120, 255, 0.7)" },
        { ratio: 0.7, color: "rgba(255, 255, 0, 0.8)" },
        { ratio: 1.0, color: "rgba(255, 0, 0, 1)" }
      ],
      maxPixelIntensity: 5000,
      minPixelIntensity: 0,
      field: "POPCHANGE"
    },
    opacity: 0.4
  });

  const popLayer = new FeatureLayer({
    url: "https://services1.arcgis.com/M68M8H7oABBFs1Pf/arcgis/rest/services/PopulationChange20102020Fixed/FeatureServer/0",
    outFields: ["TRACTCE", "POP2010","POP2020", "POPCHANGE"],

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

  map.addMany([popLayer, heatmapLayer]);

  var toggleButton = document.getElementById("toggleHeat");

  toggleButton.onclick = function () {
      if (heatmapLayer.visible === true) {heatmapLayer.visible = false; } else {heatmapLayer.visible = true;
      }
  };

});
