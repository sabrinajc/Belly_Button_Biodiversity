function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var ids = data.samples[0].otu_ids;
    console.log(ids);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleValues = data.samples[0].sample_values.slice(0,10).reverse();
    //  5. Create a variable that holds the first sample in the array.
    var labels = data.samples[0].otu_labels.slice(0,10);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var OTU_top = (data.samples[0].otu_ids.slice(0,10)).reverse();
    var OTU_id = OTU_top.map(d => "OTU" + d);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = labels;
    
    var trace = {
      x: sampleValues,
      y: OTU_id,
      text: labels,
      marker: {
        color: 'blue'},
      type: "bar",
      orientation: "h",
    }

    // 8. Create the trace for the bar chart. 
    var barData = [trace
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {l: 80, r: 80, t: 80, b: 80}
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  

// Bubble Chart 
// 1. Create the trace for the bubble chart.
    var trace1 = {
      x: data.samples[0].otu_ids,
      y: data.samples[0].sample_values,
      mode: 'markers',
      marker: {
        size: data.samples[0].sample_values,
        color: data.samples[0].otu_ids
      },
      text: data.samples[0].otu_labels
    };

    var bubbleData = [trace1
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


// Gauge Chart
// 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata
    // Create a variable that holds the first sample in the array.
    var sampleArray = metadata.filter(sampleObject => sampleObject.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var result = sampleArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var metaVariables = d3.select("sample-metadata");

    // 3. Create a variable that holds the washing frequency.
    metaVariables.html("")
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: {x: [0, 1], y: [0, 1]},
        value: result.wfreq,
        title: {text: "Belly Washing Frequency <br> Scrubs per Week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [0, 10]},
          bar: {color: "black"},
          steps: [
            {range: [0, 2], color: "red"},
            {range: [2, 4], color: "orange"},
            {range: [4, 6], color: "yellow"},
            {range: [6, 8], color: "yellowgreen"},
            {range: [8, 10], color: "green"}]}
      }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 500,
      height: 450,
      margin: {t: 25, b: 25},
      line: {
        color: "500000"
      },
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

