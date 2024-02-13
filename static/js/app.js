// Define the URL for the JSON data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and execute the following code
d3.json(url).then((data) => {
    // Extract sample data
    let sample_field = data.samples;

    // Populate dropdown menu with sample IDs
    let dropdown = d3.select("#selDataset");

    // Loop through each sample in the data to populate the dropdown
    sample_field.forEach((sample, index) => {
        dropdown.append("option")
                .attr("value", index) // Set the value of the option to its index
                .text(sample.id); // Set the text of the option to the sample ID
    });

    // Function to update plots and demographic info based on selected sample ID
    function updatePlots(sample_index) {
        // Retrieve the selected sample based on its index
        let sample = sample_field[sample_index];

        // Update bar chart
        let trace_bar = {
            x: sample.sample_values.slice(0, 10).reverse(), // Slice the first 10 sample values and reverse the order
            y: sample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(), // Slice the first 10 OTU IDs, add "OTU ", and reverse the order
            text: sample.otu_labels.slice(0, 10).reverse(), // Slice the first 10 OTU labels and reverse the order
            type: "bar", // Set the chart type to bar
            orientation: "h" // Set the orientation to horizontal
        };

        let layout_bar = {
            height: 600, // Set the height of the chart
            width: 500 // Set the width of the chart
        };

        // Create a new bar chart with the specified trace and layout
        Plotly.newPlot("bar", [trace_bar], layout_bar);

        // Update bubble chart
        let trace_bubble = {
            x: sample.otu_ids, // Set the x values to OTU IDs
            y: sample.sample_values, // Set the y values to sample values
            text: sample.otu_labels, // Set the text to OTU labels
            mode: "markers", // Set the chart mode to markers
            marker: {
                size: sample.sample_values, // Set the marker size to sample values
                color: sample.otu_ids, // Set the marker color to OTU IDs
                colorscale: "Earth" // Set the color scale
            }
        };

        let layout_bubble = {
            height: 600, // Set the height of the chart
            width: 1200 // Set the width of the chart
        };

        // Create a new bubble chart with the specified trace and layout
        Plotly.newPlot("bubble", [trace_bubble], layout_bubble);

        // Update demographic info
        let metadata = data.metadata[sample_index]; // Retrieve metadata for the selected sample
        let metadata_tab = d3.select("#sample-metadata").html(""); // Select the metadata display area and clear its contents

        // Loop through each key-value pair in the metadata and display it
        Object.entries(metadata).forEach(([key, value]) => {
            let paragraph = metadata_tab.append("p"); // Create a new paragraph element
            paragraph.text(`${key}: ${value}`); // Set the text of the paragraph to the key-value pair
        });
    }

    // Initial update with the first sample
    updatePlots(0);

    // Event listener for dropdown change
    dropdown.on("change", function() {
        let selected_sample_index = this.value; // Get the index of the selected sample from the dropdown
        updatePlots(selected_sample_index); // Update plots and demographic info based on the selected sample index
    });
});