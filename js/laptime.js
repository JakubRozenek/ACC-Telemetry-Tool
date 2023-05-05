// Relays all the essential information about the drivers input
const laptime = {

    // Get the current track name
    setTrack(track) {
        this.track = track;
    },
    getTrack() {
        return this.track;
    },

    // Setting and retrieving the number of laps completed
    setLaps(laps) {
        this.laps = laps;
    },
    getLaps() {
        return this.laps;
    },

    // Setting and retrieving the session types
    setSession(session) {
        this.session = session;
    },
    getSession() {
        return this.session;
    },

    // Setting and retrieving the drivers speed
    setSpeed(speed) {
        this.speed = speed;
    },
    getSpeed() {
        return this.speed;
    },

    // Setting and retrieving the drivers steering angle
    setSteering(steering) {
        this.steering = steering;
    },
    getSteering() {
        return this.steering;
    },

    // Setting and retrieving the drivers gears
    setGear(gear) {
        this.gear = gear;
    },
    getGear() {
        return this.gear;
    },

    // Setting and retrieving the drivers throttle
    setThrottle(throttle) {
        this.throttle = throttle;
    },
    getThrottle() {
        return this.throttle;
    },

    // Setting and retrieving the drivers brakes
    setBrake(brake) {
        this.brake = brake;
    },
    getBrake() {
        return this.brake;
    }
};

module.exports = laptime;