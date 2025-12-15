// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 * 
Latitude:
Longitude
Name:
Hashtag:
 */

class GeoTag {
    constructor(name, latitude, longitude, hashtag) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = name;
        this.hashtag = hashtag
    }

    toString() {
    return `${this.name} (${this.latitude}, ${this.longitude}) ${this.hashtag}`
   };
}

module.exports = GeoTag;
