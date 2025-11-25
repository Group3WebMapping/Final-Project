require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/tasks/support/Query",
  "esri/Graphic"
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
  const queryForm = document.getElementById("queryFormElement");

queryForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get the input values
  const populationInput = document.getElementById("population").value;
  const incomeInput = document.getElementById("income").value;
  const medianAgeInput = document.getElementById("medianAge").value;

  // Initialize the where clause
  let whereClause = "1=1";  // Always true, to start with no filtering

  // Dynamically build the where clause based on input values
  if (populationInput) {
    whereClause += ` AND POP2010 >= ${parseInt(populationInput, 10)}`;
  }
  if (incomeInput) {
    whereClause += ` AND Median_Income >= ${parseInt(incomeInput, 10)}`;
  }
  if (medianAgeInput) {
    whereClause += ` AND Median_Age_2010 <= ${parseInt(medianAgeInput, 10)}`;
  }

  console.log("Generated where clause:", whereClause);  // Debugging output

  // Create a new query
  const query = new Query();
  query.where = whereClause;  // Set the dynamic where clause
  query.outFields = ["GEOID10", "POP2010", "Median_Age_2010", "F__Occupied_Housing", "Median_Income"];
  query.returnGeometry = true;

  // Execute the query
  layerA.queryFeatures(query).then(function (results) {
    // Clear any previous graphics
    view.graphics.removeAll();

    // Check if there are any results
    const features = results.features;
    if (features.length === 0) {
      alert("No records found for the given criteria.");
    } else {
      // Add the results as graphics to the map
      features.forEach(function (feature) {
        const graphic = new Graphic({
          geometry: feature.geometry,
          symbol: {
            type: "simple-fill",
            color: [0, 0, 255, 0.3],  // Blue with some transparency
            outline: {
              color: [0, 0, 255],
              width: 2
            }
          },
          attributes: feature.attributes,
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

        view.graphics.add(graphic);
      });
    }
  }).catch(function (error) {
    console.error("Query failed: ", error);
  });
});
});
