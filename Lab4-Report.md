# Lab 4 — Task 2: Front-End Development for City Search Microservices

**Course:** EECE/CS 3093C Software Engineering
**Student:** Arnav Bhalgat
**Live App URL:** https://bhalgatarnav.github.io/uscities-search-frontend/
**Task 1 Backend URL:** https://bhalgatarnav-uscities-microservices-drhnczf9c4dga5an.centralus-01.azurewebsites.net

---

## 1. Introduction

This report documents Task 2 of Lab 4: a static front end that searches US cities by ZIP code or city name, built on top of the Task 1 microservice (Node.js/Express + MongoDB, deployed on Azure App Service). The front end is deployed to GitHub Pages via GitHub Actions.

---

## 2. Analysis

### Use Case
As a visitor, I can search US cities by ZIP code or city name.

Use Case Link:

**[Screenshot opportunity: GitHub Issue in `uscities-search-frontend` repo showing the use case, user stories, ACs, and sequence diagram]**


---

## 4. Implementation & Testing

### 4.1 Repository Setup — GitHub Pages with Actions
GitHub Pages configured with GitHub Actions as the source; `static.yml` workflow deploys on every push to `main`.

**[Screenshot: Repo → Settings → Pages, showing Source = GitHub Actions]**

**[Screenshot: Actions tab, showing the workflow run with a green checkmark]**

### 4.2 Microservices Integration and Testing
`search()` in `client.js` sends the fetch request, checks `response.ok`, validates the JSON shape, and fails safely with an error message on any problem (AC4/AC9). Tested against the live Azure URL.

**[Screenshot: successful ZIP search (e.g. `45221`), showing the results table]**


### 4.3 Handling JSON Data
`json2htmltable()` sanitizes every field with DOMPurify and renders city, state, county, timezone, and zips (split from the space-separated string) as an HTML table. Shows "No cities found" when there are no matches (AC5/AC10).

**[Screenshot: successful city name search (e.g. `Cincinnati`), showing multiple matching cities/states in the table]**

**[Screenshot: a query with no matches (e.g. `zzzzz`), showing "No cities found"]**

### 4.4 Handling Live/Instant Requests
A `keyup` listener requires at least 2 characters, debounces requests by 300ms, and discards stale/out-of-order responses using a `latestQuery` guard (AC5/AC6/AC7).

---

## 5. DevOps / CI-CD

- **Task 1 (backend):** Docker image built and deployed to Azure App Service via CI/CD on every push.
- **Task 2 (frontend):** GitHub Actions workflow (`static.yml`) builds and deploys the static site to GitHub Pages on every push to `main`.

**[Screenshot: Actions tab history showing multiple successful deployments over time]**

---

## 6. Conclusion

Task 2 is complete: the front end integrates with the Task 1 microservice, handles JSON responses safely, supports both explicit and live/instant search, and is deployed and live on GitHub Pages.

**Live App URL:** https://bhalgatarnav.github.io/uscities-search-frontend/
