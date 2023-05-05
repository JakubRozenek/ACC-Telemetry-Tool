// Import essential modules
const db = require('../js/database');

// Hold all labels data
const labels = new Array;

// Select all the data that is in the database
db.database.all('SELECT * FROM RaceData', [], (error, rows) => {
    
    // Catch any errors trying to connect to the database
    if (error) throw error;

    // Container for both telemetries
    const telemetry = document.getElementById('telemetry');

    // Selection tag for both telemetry 1 and 2
    const telemetry1 = document.getElementById('telemetry1');
    const telemetry2 = document.getElementById('telemetry2');

    // Values for the selected telemetries
    let newOption1 = 0;
    let newOption2 = 0;

    // loop through the database rows and give each row a option tag
    rows.forEach(lap => {

        // Telemetry 1 Options
        const option1 = document.createElement('option');
        option1.text = `${lap.TRACK} - ${lap.LAPTIME} L${lap.LAP}`;
        option1.value = lap.LAPTIME;
        telemetry1.appendChild(option1);

        // Telemetry 2 Options
        const option2 = document.createElement('option');
        option2.text = `${lap.TRACK} - ${lap.LAPTIME} L${lap.LAP}`;
        option2.value = lap.LAPTIME;
        telemetry2.appendChild(option2);
    });

    // Fill up the label with the length of the speed so all the telemetry can fit
    for (let i = 0; i < rows[1]['SPEED'].split(',').length; i++) {
        labels.push(i);
    }

    // Create the graph with the selected telemetry
    var telemetryChart = new Chart(document.getElementById('telemetryChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Brake1',
                    data: [],
                    borderColor: '#3196DD',
                    backgroundColor: '#3196DD',
                    pointRadius: 0
                },
                {
                    label: 'Brake2',
                    data: [],
                    borderColor: '#FA4857',
                    backgroundColor: '#FA4857',
                    pointRadius: 0
                },
                {
                    label: 'Throttle1',
                    data: [],
                    borderColor: '#3196DD',
                    backgroundColor: '#3196DD',
                    yAxisID: 'y2',
                    pointRadius: 0
                },
                {
                    label: 'Throttle2',
                    data: [],
                    borderColor: '#FA4857',
                    backgroundColor: '#FA4857',
                    yAxisID: 'y2',
                    pointRadius: 0
                },
                {
                    label: 'Speed1',
                    data: [],
                    borderColor: '#3196DD',
                    backgroundColor: '#3196DD',
                    yAxisID: 'y3',
                    pointRadius: 0
                },
                {
                    label: 'Speed2',
                    data: [],
                    borderColor: '#FA4857',
                    backgroundColor: '#FA4857',
                    yAxisID: 'y3',
                    pointRadius: 0
                },
                {
                    label: 'Gear1',
                    data: [],
                    borderColor: '#3196DD',
                    backgroundColor: '#3196DD',
                    yAxisID: 'y4',
                    stepped: true,
                    pointRadius: 0
                },
                {
                    label: 'Gear2',
                    data: [],
                    borderColor: '#FA4857',
                    backgroundColor: '#FA4857',
                    yAxisID: 'y4',
                    stepped: true,
                    pointRadius: 0
                },
                {
                    label: 'Steering1',
                    data: [],
                    borderColor: '#3196DD',
                    backgroundColor: '#3196DD',
                    yAxisID: 'y5',
                    pointRadius: 0
                },
                {
                    label: 'Steering2',
                    data: [],
                    borderColor: '#FA4857',
                    backgroundColor: '#FA4857',
                    yAxisID: 'y5',
                    pointRadius: 0
                },
            ]
        },
        
        options: {
            borderJoinStyle: 'round',
            responsive: false,
            animations: false,
            interaction: {
                intersect: false,
                mode: 'x'
            },
            scales: {
                x: {
                    ticks: {
                        display: false
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                },
                y: {
                    min: 0,
                    max: 1,
                    offset: true,
                    type: 'linear',
                    position: 'left',
                    stack: 'demo',
                    stackWeight: 1,
                    border: {
                        color: '#FFFF'
                    },
                    ticks: {
                        autoSkipPadding: true,
                        color: '#FFFF',
                        display: false,
                    },
                    title: {
                        display: true,
                        color: '#FFFF',
                        text: 'Brake'
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                },
                y2: {
                    min: 0,
                    max: 1,
                    offset: true,
                    type: 'linear',
                    position: 'left',
                    stack: 'demo',
                    stackWeight: 1,
                    border: {
                        color: '#FFFF'
                    },
                    ticks: {
                        autoSkipPadding: true,
                        color: '#FFFF',
                        display: false,
                    },
                    title: {
                        display: true,
                        color: '#FFFF',
                        text: 'Throttle'
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                },
                y3: {
                    min: 0,
                    max: 300,
                    offset: true,
                    type: 'linear',
                    position: 'left',
                    stack: 'demo',
                    stackWeight: 2,
                    border: {
                        color: '#FFFF'
                    },
                    ticks: {
                        autoSkipPadding: true,
                        color: '#FFFF',
                        display: false,
                    },
                    title: {
                        display: true,
                        color: '#FFFF',
                        text: 'Speed'
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                },
                y4: {
                    max: 6,
                    min: -1,
                    offset: true,
                    type: 'linear',
                    position: 'left',
                    stack: 'demo',
                    stackWeight: 1,
                    border: {
                        color: '#FFFF'
                    },
                    ticks: {
                        autoSkipPadding: true,
                        color: '#FFFF',
                        display: false,
                    },
                    title: {
                        display: true,
                        color: '#FFFF',
                        text: 'Gear'
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                },
                y5: {
                    min: -1,
                    max: 1,
                    offset: true,
                    type: 'linear',
                    position: 'left',
                    stack: 'demo',
                    stackWeight: 1,
                    border: {
                        color: '#FFFF'
                    },
                    ticks: {
                        autoSkipPadding: true,
                        color: '#FFFF',
                        display: false,
                    },
                    title: {
                        display: true,
                        color: '#FFFF',
                        text: 'Steering'
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Listen for both selection changes
    telemetry.addEventListener('change', (event) => {

        // Check if telemetry 1 value has changed
        if (event.target === telemetry1) {

            // Check what row the user has selected
            newOption1 = rows.findIndex(row => row.LAPTIME === telemetry1.value);

            // Check if the user has selected the default value
            if (newOption1 == -1) {

                // Change all the values on the chart with new selected option
                telemetryChart.data.datasets[0].data = new Array;
                telemetryChart.data.datasets[2].data = new Array;
                telemetryChart.data.datasets[4].data = new Array;
                telemetryChart.data.datasets[6].data = new Array;
                telemetryChart.data.datasets[8].data = new Array;
            } else {  

                // Change all the values on the chart with new selected option
                telemetryChart.data.datasets[0].data = rows[newOption1]['BRAKE'].split(',');
                telemetryChart.data.datasets[2].data = rows[newOption1]['THROTTLE'].split(',');
                telemetryChart.data.datasets[4].data = rows[newOption1]['SPEED'].split(',');
                telemetryChart.data.datasets[6].data = rows[newOption1]['GEAR'].split(',').map(num => parseInt(num)).filter((num, index) => num !== 0 || rows[newOption1]['GEAR'].split(',').map(num => parseInt(num))[index - 1] <= 0);
                telemetryChart.data.datasets[8].data = rows[newOption1]['STEERING'].split(',');
            }

            // Update the chart
            telemetryChart.update();
        }

        // Check if telemetry 2 value has changed
        if (event.target === telemetry2) {

            // Check what row the user has selected
            newOption2 = rows.findIndex(row => row.LAPTIME === telemetry2.value);

            // Check if the user has selected the default value
            if (newOption2 == -1) {
                
                // Clear all the datasets from telemetry 2
                telemetryChart.data.datasets[1].data = new Array;
                telemetryChart.data.datasets[3].data = new Array;
                telemetryChart.data.datasets[5].data = new Array;
                telemetryChart.data.datasets[7].data = new Array;
                telemetryChart.data.datasets[9].data = new Array;
            } else {

                // Change all the values on the chart with new selected option
                telemetryChart.data.datasets[1].data = rows[newOption2]['BRAKE'].split(',');
                telemetryChart.data.datasets[3].data = rows[newOption2]['THROTTLE'].split(',');
                telemetryChart.data.datasets[5].data = rows[newOption2]['SPEED'].split(',');
                telemetryChart.data.datasets[7].data = rows[newOption2]['GEAR'].split(',').map(num => parseInt(num)).filter((num, index) => num !== 0 || rows[newOption2]['GEAR'].split(',').map(num => parseInt(num))[index - 1] <= 0);
                telemetryChart.data.datasets[9].data = rows[newOption2]['STEERING'].split(',');
            }

            // Update the chart
            telemetryChart.update();
        }
    });
});