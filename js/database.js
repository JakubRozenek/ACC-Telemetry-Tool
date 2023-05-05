// Import essential modules
const sqlite = require('sqlite3').verbose();

// Controlling the database
class Database {

    // Creating the database file
    static database = new sqlite.Database('racedata.db');

    // Create the race table
    static createRaceTable() {

        // Create the table for the database
        this.database.run(`
            CREATE TABLE IF NOT EXISTS RaceData (
                id          INTEGER PRIMARY KEY,
                TRACK		VARCHAR(50),
                SESSION		VARCHAR(50),
                LAPTIME		VARCHAR(50),
                LAP			INT,
                SPEED		FLOAT[],
                STEERING	FLOAT[],
                GEAR		FLOAT[],
                THROTTLE	FLOAT[],
                BRAKE		FLOAT[]
            );
        `);
    }

    // Function to close the database
    static Disconnect() {
        
        // Disconnect the database
        this.database.close();
    }
}

// Export the class so you can use it other files
module.exports = Database;