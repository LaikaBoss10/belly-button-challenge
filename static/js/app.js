// Set the url variable to the link to the json data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data
d3.json(url).then(function(data) {
        console.log(data);
        // makes Ids a array variable containing the various Ids
        const Ids = data.names;
        // Select drop down menu
        let drop_down = d3.select("#selDataset")

        // Makes a variable that selects the options within the drop down and binds the Ids to the selection
        let options = drop_down.selectAll("option").data(Ids)
        // .enter handles the data to be added. .append appends each option element.
        // .attr sets the value attribute of each <option> as the data item
        // .text set the texts content of each <option> as the data item
        options.enter().append("option").attr("value", d => d).text(d => d)
        
        let defaultId = Ids[0];
        fill_plots(defaultId)
});

function fill_plots(ID) {

  // Use D3 to retrieve all of the data
  d3.json(url).then((data) => {

      // Retrieve all metadata
      let metadata = data.metadata;
      // retrieve all sample data
      let samples = data.samples;
      // Filter for metadata based on the ID
      let metadataID = metadata.filter(result => result.id == ID);
      // Filter sample data based on the ID
      let sampleID = samples.filter(result => result.id == ID);

      // Fill in demographic info:
      // Set all of the demographic metadata equal to an empty string therby reseting it.
      d3.select("#sample-metadata").html("");
      // Use Object.entries to add each key/value pair to the panel
      Object.entries(metadataID[0]).forEach(([key,value]) => {
        // append as h5 the key and value text for all the meta data for that ID.
          d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
      });

      // make bar chart using top 10 values for otu's
      // Define variables for top 10 ids, labels, and values.
      let otu_ids = sampleID[0].otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
      let otu_labels = sampleID[0].otu_labels.slice(0,10).reverse();
      let sample_values = sampleID[0].sample_values.slice(0,10).reverse();
        // Set up the trace for the bar chart
      let barTrace = {
            x: sample_values,
            y: otu_ids,
            text: otu_labels,
            type: "bar",
            orientation: "h"
      };
      // plot the chart with plotly
      Plotly.newPlot("bar", [barTrace])

      // make bubble chart 
      // assign variables to include in the bubble chart
      let bub_otu_ids = sampleID[0].otu_ids;
      let bub_otu_labels = sampleID[0].otu_labels;
      let bub_sample_values = sampleID[0].sample_values;

      // set up trace for bubble chart.
      let bubbleTrace = {
        x: bub_otu_ids,
        y: bub_sample_values,
        text: bub_otu_labels,
        mode: "markers",
        marker: {
            size: bub_sample_values,
            color: bub_otu_ids,
        }
      }
      // create layout, assign axis title and define dimensions.
      let layout = {
        width: 1000,
        height: 600,
        xaxis: {title: "OTU ID"},
      };

      // Call Plotly to plot the bubble chart
      Plotly.newPlot("bubble", [bubbleTrace], layout)
    });
};


function optionChanged(newId) {
  fill_plots(newId);
}