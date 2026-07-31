// ============================================================
// USCities Search — client.js
// Author: Arnav Bhalgat
// Talks to the Task 1 microservice (Node/Express + MongoDB on Azure)
// ============================================================

// Base URL of my Task 1 backend, deployed on Azure App Service.
// This is the ONLY place this URL should appear in the frontend.
const BASE_URL = "https://bhalgatarnav-uscities-microservices-drhnczf9c4dga5an.centralus-01.azurewebsites.net";

// DOM elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const responsesElm = document.getElementById('responses');

// --------------------------------------------------------
// Sanitize a single field before putting it into innerHTML.
// Prevents XSS if the DB ever contains a malicious string.
// --------------------------------------------------------
function data_sanitize(v) {
    return DOMPurify.sanitize(typeof v === 'string' ? v : '');
}

// --------------------------------------------------------
// AC5 / AC10: Convert the JSON array response into an HTML table.
// Shows city, state, county, timezone, and zips (split into a list,
// since the API returns zips as one space-separated string, not an array).
// AC10: if there's nothing to show, say so instead of an empty table.
// --------------------------------------------------------
function json2htmltable(data) {
    if (!Array.isArray(data) || data.length === 0) {
        return "No cities found"; // AC10
    }
    const rows = data.map(function (c) {
        const zipsDisplay = (c.zips || '').split(' ').filter(Boolean).join(', ');
        return "<tr><td>" + data_sanitize(c.city) + "</td><td>" +
            data_sanitize(c.state_name) + "</td><td>" +
            data_sanitize(c.county_name) + "</td><td>" +
            data_sanitize(c.timezone) + "</td><td>" +
            data_sanitize(zipsDisplay) + "</td></tr>";
    }).join('');
    return "<table border='1'><tr><th>City</th><th>State</th><th>County</th><th>Timezone</th><th>Zips</th></tr>" + rows + "</table>";
}

function displaySearch(data) {
    responsesElm.innerHTML = json2htmltable(data);
}

// --------------------------------------------------------
// AC4 / AC9: Core search function.
// - AC9: empty/whitespace-only input never triggers a request.
// - AC4: on a bad status or network failure, fail safely with a
//   message instead of crashing or showing a stack trace.
// --------------------------------------------------------

// Tracks the most recently initiated query so stale responses can be dropped.
// AC6 requirement: if a newer search has started, older results must not render.
let latestQuery = '';

async function search() {
    const query = searchInput.value.trim();
    if (!query) return; // AC9

    latestQuery = query; // stamp this as the current in-flight query
    console.log(`Debug>query: ${query}`); // for testing/screenshots

    try {
        const response = await fetch(`${BASE_URL}/uscities-search/${encodeURIComponent(query)}`);

        // AC6: a newer search was started while this one was in flight — discard silently
        if (query !== latestQuery) return;

        if (!response.ok) {
            throw new Error(`Unexpected status ${response.status}`); // AC4
        }
        const rawText = await response.text();
        console.log('Debug>raw response:', rawText); // TEMP: lets us see exact shape
        const data = JSON.parse(rawText);
        console.log('Debug>parsed type:', Array.isArray(data) ? 'array' : typeof data, data);
        if (!Array.isArray(data)) {
            throw new Error('Malformed response'); // AC4/AC10: validate shape before display
        }
        displaySearch(data);
    } catch (err) {
        // AC6: don't show a stale error from an older request either
        if (query !== latestQuery) return;
        console.log(`Debug>search error: ${err.message}`);
        responsesElm.textContent = 'Error: could not load results.'; // AC4
    }
}

// Explicit search: Enter key or Search button
searchInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') search();
});
searchButton.addEventListener('click', search);

// --------------------------------------------------------
// AC5 / AC6 / AC7: Instant/live search.
// AC6: only the latest keystroke's results are shown (debounce timer
// is cleared every keystroke, so old, slower requests get cancelled out).
// AC7: waits 300ms after the last keystroke before firing, and requires
// at least 2 characters, so we don't spam the API on every keypress.
// --------------------------------------------------------
let debounceTimer = null;
searchInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') return; // already handled above

    clearTimeout(debounceTimer); // AC6: cancel any pending stale request
    const query = searchInput.value.trim();
    if (query.length < 2) return; // AC5: need at least 2 characters
    debounceTimer = setTimeout(search, 300); // AC7: debounce ~300ms
});