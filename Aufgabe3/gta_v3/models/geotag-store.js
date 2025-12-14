// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */


class InMemoryGeoTagStore {
  #geoTags;

  constructor() {
    this.#geoTags = [];

    GeoTagExamples.tagList.forEach((tagArray) => {
      const geoTag = new GeoTag(
        tagArray[1],
        tagArray[2],
        tagArray[0],
        tagArray[3]
      );
      this.addGeoTag(geoTag);
    });
  }

  addGeoTag(geoTag) {
    this.#geoTags.push(geoTag);
  }

  removeGeoTag(name) {
    this.#geoTags = this.#geoTags.filter(
      (geoTagElem) => geoTagElem.name !== name
    );
  }

  getNearbyGeoTags(geoTag, distance) {
    const nearbyTags = [];
    this.#geoTags.forEach((geoTagElem) => {
      const distBetween = calculateDistInKM(geoTagElem, geoTag);
      if (distBetween <= distance) {
        nearbyTags.push(geoTagElem);
      }
    });
    return nearbyTags;
  }

  searchNearbyGeoTags(keyword, referenceGeoTag, distance) {
    return this.#geoTags.filter(
      (tag) =>
        (tag.name.includes(keyword) || tag.hashtag.includes(keyword)) &&
        calculateDistInKM(tag, referenceGeoTag) <= distance
    );
  }
}

function calculateDistInKM(geoTag1, geoTag2){
    const lat1 = geoTag1.latitude;
    const long1 = geoTag1.longitude;
    const lat2 = geoTag2.latitude;
    const long2 = geoTag2.longitude;

    const distLat = lat2 - lat1;
    const distLong = long2 - long1;

    const dist = Math.sqrt(distLat * distLat + distLong * distLong);

    const distKM = dist * 111;
    return distKM;
}

module.exports = InMemoryGeoTagStore
