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
  const queryForm = document.getElementById("queryFormElement");

    queryForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const populationInput = document.getElementById("population").value;

      // Check if the input is valid
      if (populationInput && !isNaN(populationInput)) {
        const minPopulation = parseInt(populationInput, 10);

        // Create a new query
        const query = new Query();
        query.where = `POP2010 >= ${minPopulation}`; // Filtering by population
        query.outFields = ["GEOID10", "POP2010", "Median_Age_2010", "F__Occupied_Housing", "Median_Income"];
        query.returnGeometry = true;

        // Execute the query
        layerA.queryFeatures(query).then(function (results) {
          // Clear any previous graphics
          view.graphics.removeAll();

          // Add the results as graphics
          const features = results.features;
          features.forEach(function (feature) {
            const graphic = feature.clone();
            view.graphics.add(graphic);

            // Optionally, show results in a pop-up
            feature.popupTemplate = {
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
            };
          });

          // If no results, alert the user
          if (features.length === 0) {
            alert("No records found for the given criteria.");
          }
        }).catch(function (error) {
          console.error("Query failed: ", error);
        });
      } else {
        alert("Please enter a valid population number.");
      }
    });
  });
