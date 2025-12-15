// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
  * A class to help using the HTML5 Geolocation API.
  */


/**
 * A class to help using the Leaflet map service.
 */


/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...
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
    if(inputLatitude.value == null || inputLongitude.value == null){
        updateLocation();
    }
});