// API Wrapper Reference
// https://github.com/FynniX/acc-node-wrapper

// Importing essential modules
const {BrowserWindow, app, ipcMain} = require('electron');
const ACCNodeWrapper  = require('acc-node-wrapper');
const db = require('./js/database');

// Importing file modules
const convert = require('./js/conversion');
const config = require('./config.json');
const laptime = require('./js/laptime');
const CarModel = require('./enum');

// Create the main race data table
db.createRaceTable();

// Creating the connection the ACC SDK
const wrapper = new ACCNodeWrapper();

// Initialising the connection to ACC SDK
wrapper.initBroadcastSDK(config.DISPLAYNAME, config.IP_ADDRESS, config.PORT, config.PASS, config.COMMAND_PASS, config.INTERVAL);
wrapper.initSharedMemory(config.INTERVAL, config.INTERVAL, config.INTERVAL);

// Changing the maximum listening users to unlimited
wrapper.setMaxListeners(0);

// Arrays that hold essential data
const driverCount = new Array;
const driverData = new Array;

// Array to hold information about the drivers entire lap
const speed = new Array;
const steering = new Array;
const gear = new Array;
const throttle = new Array;
const brake = new Array;

// Get the current track and car information
const information = {

    // Get the current track name
    setTrack(track) {
        this.track = track;
    },
    getTrack() {
        return this.track;
    },

    // Setting and retrieving the car's id
    setID(id) {
        this.id = id;
    },
    getID() {
        return this.id;
    }
};

// Handle creation of the electron window
const createWindow = () => {

    // Create the main window
    let window = new BrowserWindow({
        width: 1366,
        height: 768,

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            autoHideMenuBar: true
        }
    });

    // Catch any unrelated errors
    try {

        // Assigning each car with its own CarID
        wrapper.once('ENTRY_LIST', data => {

            // Get each drivers unique CarIndex
            data._entryListCars.forEach(driver => {
                driverCount.push(driver.CarIndex);
            });

            // Loop through all the drivers and create their own object
            for (let i = 0; i < driverCount.length; i++) {

                // Creating a object for each driver
                driverData.push({
                    "CarIndex": driverCount[i],
                    "Position": null,
                    "Gap": null,
                    "Laps": null,
                    "TeamName": null,
                    "TeamNumber": null,
                    "Car": null,
                    "SplinePosition": null,
                    "CurrentDriver": {
                        "Firstname": null,
                        "Lastname": null
                    },
                    "CurrentLap": {
                        "Laptime": null,
                    },
                    "LastLap": {
                        "Laptime": null,
                        "Sector1": null,
                        "Sector2": null,
                        "Sector3": null
                    },
                    "BestLap": {
                        "Laptime": null,
                        "Sector1": null,
                        "Sector2": null,
                        "Sector3": null
                    }
                });
            }
        });

        // Assigning essential information to the new object
        wrapper.on('ENTRY_LIST_CAR', data => {

            // Wait untill all the drivers information has been processed
            if (data._entryListCars[driverCount.length - 1].TeamName != '') {

                // Loop through each driver information
                for (let i = 0; i < driverCount.length; i++) {

                    // Inserting the model of the car by using enum
                    driverData[i]['Car'] = CarModel[data._entryListCars[i].CarModelType];

                    // Inserting essential driver's team information
                    driverData[i]['TeamName'] = data._entryListCars[i].TeamName;
                    driverData[i]['TeamNumber'] = data._entryListCars[i].RaceNumber;
                    
                    // Inserting information about current driver
                    driverData[i]['CurrentDriver']['Firstname'] = data._entryListCars[i].Drivers[data._entryListCars[i].CurrentDriverIndex].FirstName;
                    driverData[i]['CurrentDriver']['Lastname'] = data._entryListCars[i].Drivers[data._entryListCars[i].CurrentDriverIndex].LastName;
                }
            }
        });

        // Handling all the most important information about each driver
        wrapper.on('REALTIME_CAR_UPDATE', (data) => {
        
            // Loop through each driver information
            for (let i = 0; i < driverCount.length; i++) {

                // Check if the CarIndex matches with CarID we have in the object
                if (data.CarIndex == driverCount[i]) {
        
                    // Check if Laptime matches the max int value
                    if (data.LastLap.LaptimeMS == 2147483647) {

                        // Set the current laptimes to 0
                        data.LastLap.LaptimeMS = 0;
                        data.LastLap.Splits.fill(0);
                    }
                    
                    // Check if Laptime matches the max int value
                    if (data.BestSessionLap.LaptimeMS == 2147483647) {

                        // Set the current laptimes to 0
                        data.BestSessionLap.LaptimeMS = 0;
                        data.BestSessionLap.Splits.fill(0);
                    }

                    // Check if the Sector times values are null
                    if (data.CurrentLap.Splits.includes(null)) {

                        // Set all the sectors times to 0
                        data.CurrentLap.Splits.fill(0);
                    }

                    // Essential information about the driver
                    driverData[i]['Position'] = data.Position;
                    driverData[i]['Laps'] = data.Laps;

                    // The position the car is currently at
                    driverData[i]['SplinePosition'] = data.SplinePosition;

                    // Information about driver's last lap
                    driverData[i]['LastLap']['Laptime'] = convert(data.LastLap.LaptimeMS, 'TO-LAP');
                    driverData[i]['LastLap']['Sector1'] = convert(data.LastLap.Splits[0], 'TO-LAP');
                    driverData[i]['LastLap']['Sector2'] = convert(data.LastLap.Splits[1], 'TO-LAP');
                    driverData[i]['LastLap']['Sector3'] = convert(data.LastLap.Splits[2], 'TO-LAP');

                    // Information about driver's current lap
                    driverData[i]['CurrentLap']['Laptime'] = convert(data.CurrentLap.LaptimeMS, 'TO-LAP');

                    // Information about driver's best lap
                    driverData[i]['BestLap']['Laptime'] = convert(data.BestSessionLap.LaptimeMS, 'TO-LAP');
                    driverData[i]['BestLap']['Sector1'] = convert(data.BestSessionLap.Splits[0], 'TO-LAP');
                    driverData[i]['BestLap']['Sector2'] = convert(data.BestSessionLap.Splits[1], 'TO-LAP');
                    driverData[i]['BestLap']['Sector3'] = convert(data.BestSessionLap.Splits[2], 'TO-LAP');
                }

                // Catch any unrelated errors
                try {

                    // Send out the driver data to the renderer
                    window.webContents.send('DriverData', driverData);

                    // Send the id's of every car on track
                    window.webContents.send('DriverCount', driverCount);
                } catch {console.log();}
            }
        });

        // Listen for incoming data
        ipcMain.on('CarFocus', (event, data) => {

            // Change the camera focus to the selected car
            wrapper.SetFocus(data) ;
        });

        // Recieving information about the track
        wrapper.on('TRACK_DATA', data => {

            // Set the current track to the constructor
            information.setTrack(data.TrackName);
        });
        
        // Send out graphics information
        wrapper.on('M_GRAPHICS_RESULT', data => {

            // Get the drivers cars id
            information.setID(data.playerCarID);

            // Get the current session type
            laptime.setSession(data.session);

            // Get the current lap number
            laptime.setLaps(data.completedLaps);

            // Make sure it only saves the speed and not other unrelated content
            if (laptime.getSpeed() != null || laptime.getSpeed() != undefined) {
                speed.push(laptime.getSpeed());
            }
            
            // Push all the basic telemetry to the array
            steering.push(laptime.getSteering());
            gear.push(laptime.getGear());
            throttle.push(laptime.getThrottle());
            brake.push(laptime.getBrake());

            // Send out if we are connected to the shared memory
            window.webContents.send('GraphicsData', data);
        });

        // Listen for data update event from IPCRenderer
        wrapper.on('BROADCASTING_EVENT', data => {

            // Check if you have finished a lap
            if (data.CarId == information.getID() && data.Type == 'LapCompleted') {

                // Save all the data to the database
                db.database.run(`
                    INSERT INTO RaceData (TRACK, SESSION, LAP, LAPTIME, SPEED, STEERING, GEAR, THROTTLE, BRAKE)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, information.getTrack(), laptime.getSession().split('_')[1], laptime.getLaps(), data.Msg, JSON.stringify(speed).slice(1, -1), JSON.stringify(steering).slice(1, -1), JSON.stringify(gear).slice(1, -1), JSON.stringify(throttle).slice(1, -1), JSON.stringify(brake).slice(1, -1));

                // Clear all the arrays to record the next lap
                speed.splice(0);
                steering.splice(0);
                gear.splice(0);
                throttle.splice(0);
                brake.splice(0);
            }
        });

        // Send out physics information
        wrapper.on('M_PHYSICS_RESULT', data => {

            // Check if the driver is moving then record the speed
            if (data.speedKmh > 1) {

                // Recording the drivers speed in km/h
                laptime.setSpeed(data.speedKmh);
            }

            // Recording the drivers steering angle
            laptime.setSteering(data.steerAngle);

            // Recording the drivers gears
            laptime.setGear(data.gear);

            // Recording the drivers throttle
            laptime.setThrottle(data.gas);
            
            // Recording the drivers brake
            laptime.setBrake(data.brake);

            // Send out if we are connected to the shared memory
            window.webContents.send('PhysicsData', data);

            // Send out the track name to ipcrenderer
            window.webContents.send('Trackname', information.getTrack());
        });

        // Send out realtime update information
        wrapper.on('REALTIME_UPDATE', data => {

            // Send out the realtime to ipcrenderer
            window.webContents.send('RealtimeUpdate', data);
        });

        // Hide the menu bar from the user
        window.setMenuBarVisibility(false)

        // Make the window not resizeable
        window.setResizable(false);

        // Load the index.html of the app
        window.loadFile('pages/home.html');
        
    } catch {console.log();}
};

// Create app when everying is ready
app.whenReady().then(() => {
    
    // Execute the main window
    createWindow();
});

// Disconnet ACC SDK when the application is closed
app.on('window-all-closed', () => {
    
    // Disconnect the ACC API's
    wrapper.disconnectSharedMemory();
    wrapper.Disconnect();

    // Close the database connection
    db.Disconnect();

    // Exit the application
    app.exit();
});