// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");
let latitude;
let longitude;
let searchTerm;
let mapManager;


function updateLocation() {
    try {
        const fieldLat = document.getElementById("inputLatitude");
        const fieldLon = document.getElementById("inputLongitude");
        const fieldDisLat = document.getElementById("discoveryLatitude");
        const fieldDisLon = document.getElementById("discoveryLongitude");

        if (fieldLat && fieldLat.value && fieldLon && fieldLon.value) {
            latitude = parseFloat(fieldLat.value);
            longitude = parseFloat(fieldLon.value);
            updateMap(latitude, longitude);
        } else {
            LocationHelper.findLocation((locationHelper) => {
                latitude = locationHelper.latitude;
                longitude = locationHelper.longitude;

            
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



document.addEventListener('DOMContentLoaded', ()=> {
    mapManager = new MapManager();
    updateLocation();


    const taggingForm = document.getElementById('tag-form');
    if(taggingForm){
        taggingForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Verhindert Standardverhalten
            await submitTaggingForm();
        });
    }


    const discoveryForm = document.getElementById('discoveryFilterForm');
    if(discoveryForm){
        discoveryForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            await submitDiscoveryForm()
        });
    }
});


async function submitTaggingForm() {
    const formData = new FormData(document.getElementById('tag-form'));
    const geoTag = {
        name: formData.get('input-name'),
        latitude: parseFloat(formData.get('input-latitude')),
        longitude: parseFloat(formData.get('input-longitude')),
        hashtag: formData.get('input-hashtag')
    };
    

    try {
        const response = await fetch('/api/geotags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(geoTag),
        });
        

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('GeoTag added:', data);

        // GeoTag an Liste Hinzufügen
        const resultsListElement = document.getElementById("discoveryResults");
        const listItem = document.createElement("div");
        listItem.classList.add("fieldset-2"); // Style-Klasse hinzufügen
        listItem.innerHTML = `
                <h3 class="tag-name">${data.name}</h3>
                <p class="tag-location">Latitude: ${data.latitude}, Longitude: ${data.longitude}</p>
                ${data.hashtag ? `<p class="tag-hashtag">${data.hashtag}</p>` : ""}
            `;
        resultsListElement.appendChild(listItem);

        

    } catch (error) {
        console.error('Error during tagging:', error);
    }
}


async function submitDiscoveryForm() {

    const searchterm = document.getElementById('inputSearch').value.trim();
    const latitude = document.getElementById('inputLatitude').value;
    const longitude = document.getElementById('inputLongitude').value;

    if (!latitude || !longitude) {
        console.error('Latitude and Longitude are required.');
        return;
    }

    // Query-Parameter erstellen
    const queryParams = new URLSearchParams({ latitude, longitude });
    if (searchterm) {
        queryParams.append('searchTerm', searchterm);
    }
    

    const url = `/api/geotags?${queryParams.toString()}`;

    try {
        const response = await fetch(url, { method: 'GET' });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        renderList(data)

    } catch (error) {
        console.error('Error during discovery:', error);
    }
}

function renderList(data) {
            // Liste der GeoTags aktualisieren
        const tagList = data.results || data; // Ergebnisse oder alle GeoTags verwenden
        const resultsListElement = document.getElementById("discoveryResults");
        
        

        // Entferne nur die alten Inhalte, aber bewahre die Styles
        while (resultsListElement.firstChild) {
            resultsListElement.removeChild(resultsListElement.firstChild);
        }

        for (const tag of tagList) {
            // Erstelle neue Listenelemente für jedes Tag
            const listItem = document.createElement("div");
            listItem.classList.add("fieldset-2"); // Style-Klasse hinzufügen
            listItem.innerHTML = `
                <h3 class="tag-name">${tag.name}</h3>
                <p class="tag-location">Latitude: ${tag.latitude}, Longitude: ${tag.longitude}</p>
                ${tag.hashtag ? `<p class="tag-hashtag">${tag.hashtag}</p>` : ""}
            `;
            resultsListElement.appendChild(listItem);
        }

        const searchtermInput = document.getElementById('inputSearch');
        if (searchtermInput) {
            searchtermInput.value = ""; // Suchfeld leeren
        }
        // Karte aktualisieren
        if (mapManager) {
            mapManager.updateMarkers(latitude, longitude, tagList);
        } else {
            console.error('MapManager is not defined.');
        }
}