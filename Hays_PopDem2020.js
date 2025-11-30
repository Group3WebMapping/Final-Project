require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/tasks/support/Query",
  "esri/Graphic"
], function (Map, MapView, FeatureLayer, Query, Graphic) {

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
    url: "https://services1.arcgis.com/M68M8H7oABBFs1Pf/arcgis/rest/services/Demographics2020WebMapping_Updated1_ExportFeatures/FeatureServer/0",
    opacity: 0.65,
    outFields: ["TRACTCE", "POP2020", "Median_Age2020", "PercentOccupiedHousing2020", "Median_Household_Income2020"],

    popupTemplate: {
      title: "2020 Demographics – Tract {TRACTCE}",
      content: [{
        type: "fields",
        fieldInfos: [
          { fieldName: "TRACTCE", label: "Census Tract" },
          { fieldName: "POP2020", label: "Population (2020)" },
          { fieldName: "Median_Age2020", label: "Median Age (2020)" },
          { fieldName: "PercentOccupiedHousing2020", label: "% Occupied Housing (2020)" },
          { fieldName: "Median_Household_Income2020", label: "Median Household Income (2020)" },
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
    const occupiedHousingInput = document.getElementById("occupiedHousing").value;

    // Initialize the where clause
    let whereClause = "1=1";  // Always true, to start with no filtering

    // Dynamically build the where clause based on input values
    if (populationInput) {
      whereClause += ` AND POP2020 >= ${parseFloat(populationInput)}`;
    }
    if (incomeInput) {
      whereClause += ` AND Median_Household_Income2020 >= ${parseFloat(incomeInput)}`;
    }
    if (medianAgeInput) {
      whereClause += ` AND Median_Age2020 <= ${parseFloat(medianAgeInput)}`;
    }
    if (occupiedHousingInput) {
      whereClause += ` AND PercentOccupiedHousing2020 >= ${parseFloat(occupiedHousingInput)}`;
    }

    console.log("Generated where clause:", whereClause);  // Debugging output

    // Create a new query
    const query = new Query();
    query.where = whereClause;  // Set the dynamic where clause
    query.outFields = ["TRACTCE", "POP2020", "Median_Age2020", "PercentOccupiedHousing2020", "Median_Household_Income2020"];
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
              title: "2020 Demographics – Tract {TRACTCE}",
              content: [{
                type: "fields",
                fieldInfos: [
                  { fieldName: "TRACTCE", label: "Census Tract" },
                  { fieldName: "POP2020", label: "Population (2020)" },
                  { fieldName: "Median_Age2020", label: "Median Age (2020)" },
                  { fieldName: "PercentOccupiedHousing2020", label: "% Occupied Housing (2020)" },
                  { fieldName: "Median_Household_Income2020", label: "Median Household Income (2020)" },
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
