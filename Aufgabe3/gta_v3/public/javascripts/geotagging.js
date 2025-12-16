// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");


/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...
/*
const inputLatitude = document.getElementById("inputLatitude");
const inputLongitude = document.getElementById("inputLongitude");
const mapView = document.getElementById("mapView");
const spanEle = document.getElementById("span-ele");

function updateLocation() {
    LocationHelper.findLocation((location) => {
        console.log(`Your location: Latitude ${location.latitude}, Longitude ${location.longitude}`);
        inputLatitude.value = location.latitude;
        inputLongitude.value = location.longitude;

        const mapManager = new MapManager();
        mapManager.initMap(location.latitude, location.longitude);
        mapManager.updateMarkers(location.latitude, location.longitude);
        mapView.remove();
        spanEle.remove();
}, (error) => {
        alert(error.message)
    });
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    if(inputLatitude.value === null || inputLongitude.value === null) {
        updateLocation();
    }
});

*/


function updateLocation() {
    try {
        const fieldLat = document.getElementById("inputLatitude");
        const fieldLon = document.getElementById("inputLongitude");
        const fieldDisLat = document.getElementById("discoveryLatitude");
        const fieldDisLon = document.getElementById("discoveryLongitude");

        if (fieldLat && fieldLat.value && fieldLon && fieldLon.value) {
            const latitude = parseFloat(fieldLat.value);
            const longitude = parseFloat(fieldLon.value);
            updateMap(latitude, longitude);
        } else {
            LocationHelper.findLocation((locationHelper) => {
                const latitude = locationHelper.latitude;
                const longitude = locationHelper.longitude;

            
                if (fieldLat) fieldLat.value = latitude;
                if (fieldLon) fieldLon.value = longitude;

                if (fieldDisLat) fieldDisLat.value = latitude;
                if (fieldDisLon) fieldDisLon.value = longitude;

                updateMap(latitude, longitude);
            });
        }
    } catch (error) {
        console.error("Error fetching location:", error.message);
    }
}

function updateMap(latitude, longitude) {
    const map = document.getElementById("map");
    if (!map) return;

    map.innerHTML = "";

    const mapManager = new MapManager();
    mapManager.initMap(latitude, longitude);

    const rawTags = map.getAttribute("data-tags");

    if (!rawTags) {
        return;
    }

    let tags = [];
    try {
        tags = JSON.parse(rawTags);
    } catch (e) {
        console.error("Invalid JSON in data-tags:", rawTags);
        return;
    }

    mapManager.updateMarkers(latitude, longitude, tags);
}

// Wartet, bis das DOM vollständig geladen ist, bevor die Funktion aufgerufen wird
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});