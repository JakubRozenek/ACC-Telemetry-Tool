// Handle the conversion of MS to MM:SS:MS
function convert(duration, settings) {

    // Check what settings option is inputed
    switch(settings) {

        // Convert MS to HH:MM:SS
        case 'TO-TIME':

            // Making sure the duration is integer
            duration = parseInt(duration);

            // Different format of time
            if (new Date(duration).toISOString().slice(11, 13) == 00) {
                return new Date(duration).toISOString().slice(14, 19);
            }

            // Calculate the time and return it
            return new Date(duration).toISOString().slice(11, -1);

        // Convert MS to MM:SS:MS
        case 'TO-LAP':

            // Making sure the duration is integer
            duration = parseInt(duration);

            // Calculate the date and return it
            return new Date(duration).toISOString().slice(15, -1);
        
        // Convert MM:SS:MS to MS
        case 'TO-MS':
            
            // Calculating all the essential values that make up time
            let minutesMS = Math.floor(duration.substring(0, 1) * 60000);
            let secondsMS = Math.floor(duration.substring(2, 4) * 1000);
            let millisecondsMS = parseInt(duration.substring(5));

            // Output Minutes, Seconds and Milliseconds
            return `${minutesMS + secondsMS + millisecondsMS}`;
        
        case 'TO-MSV2':

            // Calculating all the essential values that make up time
            let minutesMSV2 = Math.floor(duration.substring(0, 2) * 60000);
            let secondsMSV2 = Math.floor(duration.substring(3, 5) * 1000);
            let millisecondsMSV2 = parseInt(duration.substring(6));

            // Output Minutes, Seconds and Milliseconds
            return `${minutesMSV2 + secondsMSV2 + millisecondsMSV2}`;
    }
}

// Export the subroutine to be accessible from anywhere
module.exports = convert;