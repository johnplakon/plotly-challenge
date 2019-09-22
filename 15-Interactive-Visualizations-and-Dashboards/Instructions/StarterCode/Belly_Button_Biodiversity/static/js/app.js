function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    var url = "/metadata/"+sample;

    var output = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    output.html("")

    d3.json(url).then(data => {
    // Use `Object.entries` to add each key and value pair to the panel
      Object.entries(data).forEach(([key, value]) => {
        var li = output.append("div").text(`${key}: ${value}`);
      });
    })

    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  
      var url = "/samples/"+sample;
      
        d3.json(url).then(data => {
            let layout = {
            }
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
            
            trace = {
              labels : data["otu_ids"].slice(0,10),
              values: data["sample_values"].slice(0,10),
              type: "pie"
          }

            Plotly.newPlot('pie', [trace], layout)
          
             var trace1 = {
              x: data["otu_ids"],
              y: data["sample_values"],
              mode: 'markers',
              text: data["otu_labels"] ,
              
              marker: {
                size: data["sample_values"],
                color: data["otu_ids"], colorscale: 'Rainbow'
                
              }
            };
            
            var data1 = [trace1];
            
            var layout1 = {
              showlegend: false,
                height: 600,
                width: 1200
            };
  // @TODO: Build a Bubble Chart using the sample data
            Plotly.newPlot('bubble', data1, layout1)

        })
  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
    var url1 = "/metadata/"+sample;
      
        d3.json(url1).then(metadata => {
        var data = [
          {
           domain: {
             x: [0, 1], y: [0, 1]}, 
          value: metadata["WFREQ"], title: {text: "Scrubs Per Week"},
          type: "indicator", mode: "gauge+number", 
          gauge: 
            {   axis:
                {range: [0, 10]}, 
                bar:{color:"Indigo"}, 
                steps: [
                      {range: [0, 1],color: "LightSlateGrey"}, 
                      {range: [1, 2], color: "LightSlateGrey"}, 
                      {range: [2, 3], color: "LightSlateGrey"}, 
                      {range: [3, 4], color: "LightSlateGrey"}, 
                      {range: [4, 5], color: "LightSlateGrey"}, 
                      {range: [5, 6], color: "OrangeRed"}, 
                      {range: [6, 7], color: "OrangeRed"}, 
                      {range: [7, 8], color: "OrangeRed"}, 
                      {range: [8, 9], color: "OrangeRed"}, 
                      {range: [9, 10], color: "OrangeRed"},
                    ], 
            }
          }
          
          ];
        
        var layout = { title: 'Belly Button Washing Frequency',

          };

          Plotly.newPlot('gauge',data,layout);         

        })
  }

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
