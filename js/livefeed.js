// Import essential modules
const {ipcRenderer} = require('electron');

// Conversion Module
const convert = require('../js/conversion');

// Hold all the best laps of each driver
var gap = new Number;

// Get the current session value
const session = {

    // Set the session value
    setSession(session) {
        this.session = session;
    },

    // Get the session value
    getSession() {
        return this.session;
    }
};

// Listen the data coming from main
ipcRenderer.on('GraphicsData', (event, data) => {

    // Set the current session value
    session.setSession(data.session);
    
    // Session we are currently in
    document.getElementsByClassName('sessionType')[0].innerHTML = data.session.split('_')[1];

    // Session time left
    document.getElementsByClassName('sessionTime')[0].innerHTML = convert(data.sessionTimeLeft, 'TO-TIME')
});

// Listen the data coming from main
ipcRenderer.on('DriverData', (event, data) => {

    // Get the table document
    var table = document.getElementById('table');

    // Sort the array using drivers position
    data.sort((a, b) => a.Position - b.Position);

    // Clear all rows from the table except the header
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    // Loop through each driver's information from an array of drivers
    for (let i = 0; i < data.length; i++) {

        // Check if the current session is not a race
        if (session.getSession() != 'AC_RACE') {

            // Catch any unrelated errors
            try {

                // Variable to hold the gaps of each driver infront
                gap = convert(data[0].BestLap.Laptime, 'TO-MS') - convert(data[i].BestLap.Laptime, 'TO-MS');

                // If the gap is negative
                if (gap < 0) {
                    gap = `(+${Math.abs(gap / 1000).toFixed(3)})`
                }

                // If the gap is positive
                else if (gap > 0) {
                    gap = `(-${(gap / 1000).toFixed(3)})`;
                }

                // The player who has the fastest lap will show nothing
                else if (gap == 0) {
                    gap = '';
                }
            } catch {console.log()}
        }
        
        // Create a new row and insert it at the end of the table
        let newRow = table.insertRow(table.rows.length);

        // Inserting data onto each cell
        var cell0 = newRow.insertCell(0);
        var cell1 = newRow.insertCell(1);
        var cell2 = newRow.insertCell(2);
        var cell3 = newRow.insertCell(3);
        var cell4 = newRow.insertCell(4);

        cell0.textContent = data[i].Position;
        cell1.textContent = data[i].TeamNumber;
        cell2.textContent = data[i].TeamName;
        cell3.textContent = data[i].Car;
        cell4.textContent = `${data[i].CurrentDriver.Firstname[0]}. ${data[i].CurrentDriver.Lastname}`;

        // Inserting data for drivers current laptime
        var cell5 = newRow.insertCell(5);
        cell5.textContent = data[i].CurrentLap.Laptime;
        
        // Inserting data for drivers best lap
        var cell6 = newRow.insertCell(6);
        var cell7 = newRow.insertCell(7);
        var cell8 = newRow.insertCell(8);
        var cell9 = newRow.insertCell(9);

        // Check if the current session does not equal to race
        if (session.getSession() != 'AC_RACE') {

            // Changes the format to allow gap to best lap
            cell6.textContent = data[i].BestLap.Laptime + '\n' + gap;
        } else {

            // Removing the gap option
            cell6.textContent = data[i].BestLap.Laptime;
        }
        
        cell7.textContent = data[i].BestLap.Sector1;
        cell8.textContent = data[i].BestLap.Sector2;
        cell9.textContent = data[i].BestLap.Sector3;

        // Inserting data for drivers last lap
        var cell10 = newRow.insertCell(10);
        var cell11 = newRow.insertCell(11);
        var cell12 = newRow.insertCell(12);
        var cell13 = newRow.insertCell(13);

        cell10.textContent = data[i].LastLap.Laptime;
        cell11.textContent = data[i].LastLap.Sector1;
        cell12.textContent = data[i].LastLap.Sector2;
        cell13.textContent = data[i].LastLap.Sector3;

        // Inserting data for drivers laps done
        var cell14 = newRow.insertCell(14);
        cell14.textContent = data[i].Laps;
    };

    // Catch and unrelated errors
    try {

        // Count how many rows there are in the table
        for (let i = 0; table.getElementsByTagName('tr').length; i++) {

            // Add a listener to see which row the user has clicked
            table.getElementsByTagName('tr')[i].addEventListener('click', () => {

                // Loop through the recieved data
                data.forEach(driver => {

                    // Check if the row number is the same as the drivers position
                    if (driver.Position == i) {

                        // Send out a request to change focus to the driver
                        ipcRenderer.send('CarFocus', driver.CarIndex);
                    }
                });
            });
        }
    } catch {console.log();}

    // Fastest Session Laptime + Sector Times
    fastestTime(6);
    fastestTime(7);
    fastestTime(8);
    fastestTime(9);

    // Compare each drivers laptime to their own
    laptimeChecker();
});

// Compare laptime for each driver to their own and see if they have improved
function laptimeChecker() {

    // Checking BESTLAP - S1 - S2 - S3 | LASTLAP - S1 - S2 - S3
    for (let k = 10; k <= 13; k++) {

        // Loop through all the rows in the table
        for (let i = 1; i < table.rows.length; i++) {

            // Make sure it doesn't count any values that are equal to 0
            if (convert(table.rows[i].cells[k].textContent, 'TO-MS') != 0) {

                // Check if the sector is faster their fastest sector
                if (convert(table.rows[i].cells[k].textContent, 'TO-MS') <= convert(table.rows[i].cells[k - 4].textContent, 'TO-MS') && convert(table.rows[i].cells[k].textContent, 'TO-MS') !== 000) {
                    
                    // Change the color of text to green
                    table.rows[i].cells[k].style.color = '#0AE739';
                }

                // Check if the sector is slower than their fastest sector
                else if (convert(table.rows[i].cells[k].textContent, 'TO-MS') > convert(table.rows[i].cells[k - 4].textContent, 'TO-MS')){

                    // Change the color of text to yellow
                    table.rows[i].cells[k].style.color = "#FFDF01";
                }
            }
        }
    }
}

// Find the fastest Laptime or Sector Times
function fastestTime(cell) {

    // Array to hold laptimes temporary
    let time = new Array;

    // Loop through the entire cell
    for (let i = 1; i < table.rows.length; i++) {

        // Add the times to the array
        time.push(convert(table.rows[i].cells[cell].textContent, 'TO-MS'));

        // Check if all the laptimes are inside the array and there is no NaN value
        if (time.length == table.rows.length - 1 && !time.some(isNaN)) {

            // Sort the array from the lowest to highest value
            time.sort(function(a, b) {
                return a - b;
            });

            // Loop through the array and check if there any zero values
            time.forEach(val => {

                // Check if the array contains 0
                if (val == 0) {

                    // Remove it from the array
                    time.splice(time.indexOf(val), 1);
                }
            });

            // Loop through the table again to find the matching fastest time
            for (let j = 0; j < table.rows.length; j++) {

                // Check if the fastest time matches the time in the cell we are in
                if (time[0] == convert(table.rows[j].cells[cell].textContent, 'TO-MS')) {
                    
                    // Check if the cell doesnt equal to 0
                    if (convert(table.rows[j].cells[cell].textContent, 'TO-MS') != 0) {

                        // Change the color of text to purple indicating its the fastest time
                        table.rows[j].cells[cell].style.color = '#D701D1';
                    }
                }
            }
        }
    }
}