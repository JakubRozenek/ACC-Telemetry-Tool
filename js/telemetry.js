// Import IPCRenderer from Electron
const {ipcRenderer} = require('electron');

// Conversion Module
const convert = require('../js/conversion');
const CarModel = require('../enum');
const fuelModel = require('../fuel');

// Laptime and cars information
const laptime = {

    // Setting and retrieving cars id's
    setCarID(id) {
        this.id = id;
    },
    getCarID() {
        return this.id;
    },

    // Setting and retrieving the cars fuel tank
    setFuelTank(fuelTank) {
        this.fuelTank = fuelTank;
    },
    getFuelTank() {
        return this.fuelTank;
    },

    // Setting and retrieving predicted laptime
    setPredicted(laptime) {
        this.laptime = laptime;
    },
    getPredicted() {
        return this.laptime;
    },

    // Setting and retrieving track name
    setTrackname(trackname) {
        this.trackname = trackname;
    },
    getTrackname() {
        return this.trackname;
    }
};

// Information about the fastest lap in the session
const bestLap = {

    // Set and retrieve the fastest laptime
    setLaptime(laptime) {
        this.bestLaptime = laptime;
    },
    getLaptime() {
        return this.bestLaptime;
    },

    // Set and retrieve the fastest sector 1
    setSector1(sector) {
        this.bestS1 = sector;
    },
    getSector1() {
        return this.bestS1;
    },

    // Set and retrieve the fastest sector 2
    setSector2(sector) {
        this.bestS2 = sector;
    },
    getSector2() {
        return this.bestS2;
    },

    // Set and retrieve the fastest sector 3
    setSector3(sector) {
        this.bestS3 = sector;
    },
    getSector3() {
        return this.bestS3;
    },
};

// Duration of the Graps
let duration = 18000;

// Speed Chart
const speedChart = new Chart(document.getElementById('speedChart').getContext('2d'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Speed',
            backgroundColor: '#0FCA00',
            borderColor: '#0FCA00',
            data: [],
            pointRadius: 0
        }]
    },
    options: {
        borderJoinStyle: 'round',
        animation: false,
        color: '#FFFF',
        scales: {
            x: {
                type: 'realtime',
                realtime: {
                    duration: 50000
                },
                ticks: {
                    display: false
                },
                grid: {
                    drawOnChartArea: false,
                    borderColor: '#FFFF'
                }
            },
            y: {
                min: 0,
                max: 250,
                ticks: {
                    color: '#FFFF'
                },
                grid: {
                    drawOnChartArea: false,
                    borderColor: '#FFFF'
                }
            },
        },
    },
});

// Steering Chart
const steeringChart = new Chart(document.getElementById('steeringChart').getContext('2d'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Steering',
            backgroundColor: '#0FCA00',
            borderColor: '#0FCA00',
            data: [],
            pointRadius: 0
        }]
    },
    options: {
        borderJoinStyle: 'round',
        animation: false,
        color: '#FFFF',
        scales: {
            x: {
                type: 'realtime',
                realtime: {
                    duration: duration
                },
                ticks: {
                    display: false
                },
                grid: {
                    drawOnChartArea: false,
                    borderColor: '#FFFF'
                }
            },
            y: {
                min: -1,
                max: 1,
                ticks: {
                    color: '#FFFF'
                },
                grid: {
                    drawOnChartArea: false,
                    borderColor: '#FFFF'
                }
            },
        },
    },
});

// Gear Chart
const gearChart = new Chart(document.getElementById('gearChart').getContext('2d'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Gears',
            backgroundColor: '#0FCA00',
            borderColor: '#0FCA00',
            data: [],
            pointRadius: 0
        }]
    },
    options: {
        borderJoinStyle: 'round',
        animation: false,
        color: '#FFFF',
        scales: {
            x: {
                type: 'realtime',
                realtime: {
                    duration: duration
                },
                ticks: {
                    display: false
                },
                grid: {
                    drawOnChartArea: false,
                    borderColor: '#FFFF'
                }
            },
            y: {
                min: -1,
                max: 6,
                ticks: {
                    color: '#FFFF'
                },
                grid: {
                    drawOnChartArea: false,
                    borderColor: '#FFFF'
                }
            },
        },
    },
});

// Throttle/Brake Chart
const inputChart = new Chart(document.getElementById('inputChart').getContext('2d'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Throttle',
            backgroundColor: '#0FCA00',
            borderColor: '#0FCA00',
            data: [],
            pointRadius: 0
        },
        {
            label: 'Brake',
            backgroundColor: '#CA2400',
            borderColor: '#CA2400',
            data: [],
            pointRadius: 0
        }]
    },
    options: {
        color: '#FFFF',
        borderJoinStyle: 'round',
        animation: false,
        scales: {
            x: {
                type: 'realtime',
                realtime: {
                    duration: duration
                },
                ticks: {
                    display: false
                },
                grid: {
                    drawOnChartArea: false,
                    borderColor: '#FFFF'
                }
            },
            y: {
                min: 0,
                max: 1,
                ticks: {
                    color: '#FFFF'
                },
                grid: {
                    drawOnChartArea: false,
                    borderColor: '#FFFF'
                }
            },
        },
    },
});

// Listen for data update event from IPCRenderer
ipcRenderer.on('RealtimeUpdate', (event, realtime) => {

    // Setting the fastest session laptime
    bestLap.setLaptime(realtime.BestSessionLap.LaptimeMS);

    // Setting the fastest session sectors
    bestLap.setSector1(realtime.BestSessionLap.Splits[0]);
    bestLap.setSector2(realtime.BestSessionLap.Splits[1]);
    bestLap.setSector3(realtime.BestSessionLap.Splits[2]);
});

// Listen for data update event from IPCRenderer
ipcRenderer.on('Trackname', (event, track) => {

    // Set the current track name
    laptime.setTrackname(track);
});

// Listen for data update event from IPCRenderer
ipcRenderer.on('DriverData', (event, driver) => {

    // Calculate the maximum fuel tank for the user's car
    let fuelTank = fuelModel[Object.keys(CarModel).find(key => CarModel[key] === driver[laptime.getCarID()].Car)]

    // Set the cars maximum fuel tank
    laptime.setFuelTank(fuelTank);

    // Make sure its not the default value
    if (laptime.getPredicted() != 2147483647) {

        // Calculate how far back the driver is from achieving the fastest lap
        let delta2Fastest = parseInt(laptime.getPredicted()) - bestLap.getLaptime();
        
        // Check if the estimated delta is positive
        if (delta2Fastest > 0) {

            // Text to show the gap in realtime
            document.getElementsByClassName('delta2Fastest')[0].innerHTML = `Delta to fastest lap: +${convert(delta2Fastest, 'TO-LAP').slice(2, -1)}`;    

            // Change the text to red
            document.getElementsByClassName('delta2Fastest')[0].style.color = '#FF0000';
        }

        // Check if the estimated delta is negative
        else if (delta2Fastest < 0) {
        
            // Text to show the gap in realtime
            document.getElementsByClassName('delta2Fastest')[0].innerHTML = `Delta to fastest lap: -${convert(Math.abs(delta2Fastest), 'TO-LAP').slice(2, -1)}`;    
            
            // Change the text to green
            document.getElementsByClassName('delta2Fastest')[0].style.color = '#00FF00';
        }
    }

    // Find the players car
    let playerCar = driver.find(obj => obj.CarIndex === laptime.getCarID());

    // Calculate the difference between last lap and fastest lap
    let laptimeDiff = convert(playerCar.LastLap.Laptime, 'TO-MS') - bestLap.getLaptime();

    // Display the last laptime
    if (laptimeDiff > 0) {

        // Display the difference
        document.getElementsByClassName('lastLaptime')[0].innerHTML = `Last Lap: ${playerCar.LastLap.Laptime} +(${convert(laptimeDiff, 'TO-LAP').slice(2, -1)})`;
        document.getElementsByClassName('lastLaptime')[0].style.color = '#FF0000';
    } else {
        document.getElementsByClassName('lastLaptime')[0].innerHTML = `Last Lap: ${playerCar.LastLap.Laptime} (-${convert(laptimeDiff, 'TO-LAP').slice(2, -1)})`;
        document.getElementsByClassName('lastLaptime')[0].style.color = '#00FF00';
    }

    // Calculate the difference between last sectors and the fastest sectors
    let sector1Diff = convert(playerCar.LastLap.Sector1, 'TO-MS') - bestLap.getSector1();
    let sector2Diff = convert(playerCar.LastLap.Sector2, 'TO-MS') - bestLap.getSector2();
    let sector3Diff = convert(playerCar.LastLap.Sector3, 'TO-MS') - bestLap.getSector3();

    // Check if the sector 1 delta is positive
    if (sector1Diff > 0) {

        // Display the difference
        document.getElementsByClassName('lastSector1')[0].innerHTML = `Sector 1: ${playerCar.LastLap.Sector1} +(${convert(sector1Diff, 'TO-LAP').slice(2, -1)})`;
        document.getElementsByClassName('lastSector1')[0].style.color = '#FF0000';
    } else {
        document.getElementsByClassName('lastSector1')[0].innerHTML = `Sector 1: ${playerCar.LastLap.Sector1} -(${convert(Math.abs(sector1Diff), 'TO-LAP').slice(2, -1)})`;
        document.getElementsByClassName('lastSector1')[0].style.color = '#00FF00';
    }
    
    // Check if the sector 2 delta is positive
    if (sector2Diff > 0) {

        // Display the difference
        document.getElementsByClassName('lastSector2')[0].innerHTML = `Sector 2: ${playerCar.LastLap.Sector2} +(${convert(sector2Diff, 'TO-LAP').slice(2, -1)})`;
        document.getElementsByClassName('lastSector2')[0].style.color = '#FF0000';
    } else {
        document.getElementsByClassName('lastSector2')[0].innerHTML = `Sector 2: ${playerCar.LastLap.Sector2} -(${convert(Math.abs(sector2Diff), 'TO-LAP').slice(2, -1)})`;
        document.getElementsByClassName('lastSector2')[0].style.color = '#00FF00';
    }
    
    // Check if the sector 3 delta is positive
    if (sector3Diff > 0) {

        // Display the difference
        document.getElementsByClassName('lastSector3')[0].innerHTML = `Sector 3: ${playerCar.LastLap.Sector3} +(${convert(sector3Diff, 'TO-LAP').slice(2, -1)})`;
        document.getElementsByClassName('lastSector3')[0].style.color = '#FF0000';
    } else {
        document.getElementsByClassName('lastSector3')[0].innerHTML = `Sector 3: ${playerCar.LastLap.Sector3} -(${convert(Math.abs(sector3Diff), 'TO-LAP').slice(2, -1)})`;
        document.getElementsByClassName('lastSector3')[0].style.color = '#00FF00';
    }
});

// Listen for data update event from IPCRenderer
ipcRenderer.on('GraphicsData', (event, graphics) => {

    // Get the current player's car id
    laptime.setCarID(graphics.playerCarID);

    // Make estimated laptime an gloabl value
    laptime.setPredicted(graphics.iEstimatedLapTime);

    // Get the current average fuel and how many laps are left in the fuel tank
    document.getElementsByClassName('fuelStats')[0].innerHTML = `Fuel Tank: ${(graphics.fuelEstimatedLaps * graphics.fuelXLap).toFixed(2)} / ${laptime.getFuelTank()}L<br>Avg Fuel: ${graphics.fuelXLap.toFixed(3)} per lap<br>Fuel Left: ${graphics.fuelEstimatedLaps.toFixed(3)} laps`;

    // Get the hours and minutes from the race input field
    let race_hours = parseInt(document.getElementById('race_hours').value) * 3600;
    let race_minutes = parseInt(document.getElementById('race_minutes').value) * 60;
    
    // Get the minutes, seconds and miliseconds from the laps inputs field
    let lap_minutes = parseInt(document.getElementById('lap_minutes').value) * 60;
    let lap_seconds = parseInt(document.getElementById('lap_seconds').value);
    let lap_milliseconds = parseInt(document.getElementById('lap_milliseconds').value) / 1000;

    // Total racing laps
    let race_laps = (race_hours + race_minutes) / (lap_minutes + lap_seconds + lap_milliseconds);

    // Calculate the race fuel
    let race_fuel = race_laps * graphics.fuelXLap;
    
    // Output the final result
    document.getElementById('fuelNeeded').innerHTML = `${Math.floor(race_laps)} Laps - ${Math.floor(race_fuel)} litres`;

    // If the driver completes a lap reset their telemetry
    if (graphics.normalizedCarPosition.toFixed(3) > 0.000 && graphics.normalizedCarPosition.toFixed(3) < 0.01) {

        // Speed Chart Data
        speedChart.data.labels = new Array;
        speedChart.data.datasets[0].data = new Array;
        speedChart.update();

        // Steering Chart Data
        steeringChart.data.labels = new Array;
        steeringChart.data.datasets[0].data = new Array;
        steeringChart.update();

        // Gear Chart Data
        gearChart.data.labels = new Array;
        gearChart.data.datasets[0].data = new Array;
        gearChart.update();

        // Input Chart Data
        inputChart.data.labels = new Array;
        inputChart.data.datasets[0].data = new Array;
        inputChart.data.datasets[1].data = new Array;
        inputChart.update();
    }
});

// Listen for data update event from IPCRenderer
ipcRenderer.on('PhysicsData', (event, physics) => {

    // Array that holds each part of the car damage
    physics.carDamage.forEach(damage => {

        // Check if the damage value is above 0
        if (damage > 0) {

            // Total time of all the damages
            document.getElementById('total-damage').innerText = `${convert((physics.carDamage[4] / 3.5419) * 1000, 'TO-LAP')}`;

            // Check what part of the car the damage is located at
            switch(physics.carDamage.indexOf(damage)) {

                // Check for front damage
                case 0:
                    document.getElementsByClassName('carBox')[0].style.borderTop = '5px solid red';
                    document.getElementsByClassName('front-damage')[0].innerText = convert((physics.carDamage[0] / 3.5419) * 1000, 'TO-LAP');
                    break;
                
                // Check for rear damage
                case 1:
                    document.getElementsByClassName('carBox')[0].style.borderBottom = '5px solid red';
                    document.getElementsByClassName('rear-damage')[0].innerText = convert((physics.carDamage[1] / 3.5419) * 1000, 'TO-LAP');
                    break;

                // Check for left damage
                case 2:
                    document.getElementsByClassName('carBox')[0].style.borderLeft = '5px solid red';
                    document.getElementsByClassName('left-damage')[0].innerText = convert((physics.carDamage[2] / 3.5419) * 1000, 'TO-LAP');
                    break;

                // Check for right damage
                case 3:
                    document.getElementsByClassName('carBox')[0].style.borderRight = '5px solid red';
                    document.getElementsByClassName('right-damage')[0].innerText = convert((physics.carDamage[3] / 3.5419) * 1000, 'TO-LAP');
                    break;
            }
        }

        // Check if the damage has been repaired
        else if (damage === 0) {

            // Total time of all the damages
            document.getElementById('total-damage').innerText = `${convert((physics.carDamage[4] / 3.5419) * 1000, 'TO-LAP')}`;

            // Check what part of the car the damage is located at
            if (physics.carDamage.indexOf(damage) === 0) {
                
                // Check if front damage has been repaired
                document.getElementsByClassName('carBox')[0].style.borderTop = '0px solid red';
                document.getElementsByClassName('front-damage')[0].innerText = '';
                
                // Check if rear damage has been repaired
                document.getElementsByClassName('carBox')[0].style.borderBottom = '0px solid red';
                document.getElementsByClassName('rear-damage')[0].innerText = '';

                // Check if left damage has been repaired
                document.getElementsByClassName('carBox')[0].style.borderLeft = '0px solid red';
                document.getElementsByClassName('left-damage')[0].innerText = '';

                // Check if right damage has been repaired
                document.getElementsByClassName('carBox')[0].style.borderRight = '0px solid red';
                document.getElementsByClassName('right-damage')[0].innerText = '';
            }
        }
    });

    // Create a box for the tyre temperature
    for (let i = 0; i < physics.TyreCoreTemp.length; i++) {

        // Add the temperature degrees of the tyre
        document.getElementById(i).innerHTML = `${physics.TyreCoreTemp[i].toFixed(0)} °C`;
    }

    // Loop through all the tyres temperature
    physics.TyreCoreTemp.forEach(temp => {

        // Make sure that there is data
        if (temp != 0) {

            // Adding temperatures and pressures to all tyres
            physics.wheelPressure.forEach(psi => {
                document.getElementById(physics.wheelPressure.indexOf(psi)).innerHTML = `${physics.wheelPressure[physics.wheelPressure.indexOf(psi)].toFixed(2)} PSI <br> ${physics.TyreCoreTemp[physics.TyreCoreTemp.indexOf(temp)].toFixed(0)} °C`;
            });
            
            // Change the color to blue
            if (temp < 65) {
                document.getElementById(physics.TyreCoreTemp.indexOf(temp)).style.backgroundColor = '#00DFED';
            }

            // Change the color to green
            if (temp >= 65) {
                document.getElementById(physics.TyreCoreTemp.indexOf(temp)).style.backgroundColor = '#00DE11';
            }

            // Change the color to yellow
            if (temp >= 105) {
                document.getElementById(physics.TyreCoreTemp.indexOf(temp)).style.backgroundColor = '#E3E31C';
            }
            
            // Change the color to orange
            if (temp >= 120) {
                document.getElementById(physics.TyreCoreTemp.indexOf(temp)).style.backgroundColor = '#FF9700';
            }

            // Change the color to red
            if (temp >= 130) {
                document.getElementById(physics.TyreCoreTemp.indexOf(temp)).style.backgroundColor = '#E10000';
            }
        }
    });

    // Only show telemetry if the ACC is live
    if (physics.packetId != 0) {

        // Speed Chart Data
        if (physics.speedKmh > 0) {
            speedChart.data.labels.push(new Date());
            speedChart.data.datasets[0].data.push(physics.speedKmh);
            speedChart.update();
        }
        
        // Steering Chart Data
        steeringChart.data.labels.push(new Date());
        steeringChart.data.datasets[0].data.push(physics.steerAngle);
        steeringChart.update();

        // Gear Chart Data
        gearChart.data.labels.push(new Date());

        // Prevent the gear from going 0 when changing gears
        if (physics.gear != 0) {
            gearChart.data.datasets[0].data.push(physics.gear);
        }
        gearChart.update();

        // Input Chart Data
        inputChart.data.labels.push(new Date());
        inputChart.data.datasets[0].data.push(physics.gas);
        inputChart.data.datasets[1].data.push(physics.brake);
        inputChart.update();
    }
});