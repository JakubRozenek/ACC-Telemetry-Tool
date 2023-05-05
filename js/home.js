// Import essential modules
const {ipcRenderer} = require('electron');

// Listen for data update event from IPCRenderer
ipcRenderer.on('GraphicsData', (event, data) => {

    // Check if we are not connected to the ACC SDK
    if (data.status != 'AC_OFF') {

        // Change the connection the connections to green
        document.getElementById('SDKConnection').setAttribute('fill', '#00FF00');
        document.getElementById('SHMConnection').setAttribute('fill', '#00FF00');
    }
});