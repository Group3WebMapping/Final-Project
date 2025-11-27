require([
  "esri/renderers/HeatmapRenderer",
  "esri/Map",
  "esri/views/MapView",
  "esri/grometry/Point",
], function(HeatmapRenderer, Map, MapView, Point) {

  const heatmapRenderer = new Heatmap {
  type: "heatmap", // autocasts as new HeatmapRenderer()
  // The attribute field used to determine the weight of each point (optional)
  field: "crime_count",
  colorStops: [
    { ratio: 0, color: "rgba(255, 255, 255, 0)" }, // Transparent at the lowest density
    { ratio: 0.2, color: "rgba(255, 255, 255, 1)" },
    { ratio: 0.5, color: "rgba(255, 140, 0, 1)" }, // Orange in the middle
    { ratio: 0.8, color: "rgba(255, 140, 0, 1)" },
    { ratio: 1, color: "rgba(255, 0, 0, 1)" } // Red at the highest density
  ],
  minDensity: 500,
  maxDensity: 1000,
  radius: 10, // in points
  // Optional: keeps the heatmap consistent across all scales
  // referenceScale: 13000
};


  const map = new Map({
    basemap: "streets-navigation-vector"
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-98.0, 30.0],
    zoom: 10
  });

  const geometry = new Point({

  })
