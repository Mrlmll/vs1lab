// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 * 
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars


/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
router.get('/', (req, res) => {
  const geoTagStore = req.app.locals.geoTagStore;
  res.render('index', {
      taglist: geoTagStore.getGeoTags(),
      set_latitude: "",
      set_longitude: "",
      tagsJSON: geoTagStore.getGeoTagsAsJSON()
  })
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

// TODO: ... your code here ...
router.post('/tagging', (req, res) => {
  const geoTagStore = req.app.locals.geoTagStore;

  const {
    'input-name': name,
    'input-latitude': latitude,
    'input-longitude': longitude,
    'input-hashtag': hashtag
  } = req.body;

  const newGeoTag = new GeoTag(
    name,
    parseFloat(latitude),
    parseFloat(longitude),
    hashtag
  );

  geoTagStore.addGeoTag(newGeoTag);
  res.redirect('/');
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

router.post('/discovery', (req, res) => {
  const geoTagStore = req.app.locals.geoTagStore;

  // Form-Felder extrahieren
  const {
    latitude,
    longitude,
    'input-search': keyword
  } = req.body;

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  const radius = 100; // km

  // Suche: entweder keyword vorhanden oder nicht
  let results = [];
  if (keyword && keyword.trim() !== '') {
    results = geoTagStore.searchNearbyGeoTags(lat, lon, keyword.trim(), radius);
  } else {
    results = geoTagStore.getNearbyGeoTags(lat, lon, radius);
  }

  // Rendern mit allen benötigten Parametern
  res.render('index', {
    taglist: results,
    set_latitude: lat,
    set_longitude: lon,
    tagsJSON: JSON.stringify(results)
  });
});

module.exports = router;
