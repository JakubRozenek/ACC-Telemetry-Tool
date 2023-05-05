// Importing essential modules
const path = require("path");
const fs = require('fs');

// Reading the config file for API settings
var config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config.json'), 'UTF-8'));

// Update the form data
updateConfig();

// Listen if the user presses the connect button
document.getElementById('update').addEventListener('click', event => {

    // Check for all changes in the form inputs
    config.DISPLAYNAME = document.getElementById('DISPLAYNAME').value;

    // Overwrite the old config data with the new one
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2), 'UTF-8');
    
    // Update the form data with the new data
    updateConfig();
});

// Insert all data from config file to form
function updateConfig() {

    // Get each key in the dictionary
    Object.keys(config).forEach(key => {

        // Display all the values in the form
        document.getElementById(key).value = config[key];
    });
}