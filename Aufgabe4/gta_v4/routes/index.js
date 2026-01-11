// File origin: VS1LAB A3, A4

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
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
    const geoTagStore = req.app.locals.geoTagStore;
    res.render('index', {
        taglist: geoTagStore.getGeoTags(),
        set_latitude: "",
        set_longitude: "",
        tagsJSON: geoTagStore.getGeoTagsAsJSON()
    })
});

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

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...
router.get('/api/geotags', (req, res) => {
    const geoTagStore = req.app.locals.geoTagStore;
    console.log(req.query);

    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    const keyword = req.query.searchTerm;
    
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const radius = 100; // km
    
    // Suche: entweder keyword vorhanden oder nicht
    let results = [];
    if (!latitude && !longitude && !keyword) {
        results = geoTagStore.getGeoTags();
    } else {
        if (keyword && keyword.trim() !== '') {
            results = geoTagStore.searchNearbyGeoTags(lat, lon, keyword.trim(), radius);
        } else {
            results = geoTagStore.getNearbyGeoTags(lat, lon, radius);
        }
    }

    res.json(results)
})

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.post('/api/geotags', (req, res) => {
    const geoTagStore = req.app.locals.geoTagStore;
    console.log(req.body);
    

    const name = req.body.name;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const hashtag = req.body.hashtag;

    const newGeoTag = new GeoTag(
        name,
        parseFloat(latitude),
        parseFloat(longitude),
        hashtag
    );

    geoTagStore.addGeoTag(newGeoTag);
    
    const id = geoTagStore.getGeoTags().length - 1;


    res.json(geoTagStore.getGeoTagById(id))
})


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.get('/api/geotags/:id', (req, res) => {
    const geoTagStore = req.app.locals.geoTagStore;
    const geoTag = geoTagStore.getGeoTagById(Number(req.params.id));

    if (!geoTag) {
        return res.status(404).send("GeoTag not found.");
    }

    res.json(geoTag);
});


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...
router.put('/api/geotags/:id', (req, res) => {
    const geoTagStore = req.app.locals.geoTagStore;
    const { name, latitude, longitude, hashtag } = req.body;
    const geoTagId = Number(req.params.id);

    console.log(req.body);
    const geoTag = geoTagStore.getGeoTagById(geoTagId);

    if (!geoTag) {
        return res.status(404).send("GeoTag not found.");
    }

    geoTag.name = name;
    geoTag.latitude = latitude;
    geoTag.longitude = longitude;
    geoTag.hashtag = hashtag;

    geoTagStore.updateGeoTag(geoTag)

    res.json(geoTag);
});

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.delete('/api/geotags/:id', (req, res) => {
    const geoTagStore = req.app.locals.geoTagStore;
    const geoTag = geoTagStore.getGeoTagById(Number(req.params.id));

    if (!geoTag) {
        return res.status(404).send("GeoTag not found.");
    }

    geoTagStore.removeGeoTagById(geoTag.id);
    res.status(204).send();
});

module.exports = router;
