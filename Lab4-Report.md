# Lab 4 — Task 2: Front-End Development for City Search Microservices

**Course:** EECE/CS 3093C Software Engineering

**Student:** Arnav Bhalgat

**Live App URL:** [https://bhalgatarnav.github.io/uscities-search/](https://bhalgatarnav.github.io/uscities-search/)

**Task 1 Backend URL:** https://bhalgatarnav-uscities-microservices-drhnczf9c4dga5an.centralus-01.azurewebsites.net

---

## 1. Introduction

This report documents Task 2 of Lab 4: a static front end that searches US cities by ZIP code or city name, built on top of the Task 1 microservice (Node.js/Express + MongoDB, deployed on Azure App Service). The front end is deployed to GitHub Pages via GitHub Actions.

---

## 2. Analysis

### Use Case
As a visitor, I can search US cities by ZIP code or city name.

> Use Case Link: [https://github.com/bhalgatarnav/uscities-search/issues/1](https://github.com/bhalgatarnav/uscities-search/issues/1)

**GitHub Issue in `uscities-search-frontend` repo showing the use case**

<img width="979" height="998" alt="Screenshot 2026-07-30 at 10 46 14 PM" src="https://github.com/user-attachments/assets/8df264ee-5591-4de4-bf58-53f3fb48e94b" />


---

## 4. Implementation & Testing

### 4.1 Repository Setup — GitHub Pages with Actions
GitHub Pages configured with GitHub Actions as the source; `static.yml` workflow deploys on every push to `main`.

**Actions tab, showing the workflow run with a green checkmark

<img width="1371" height="884" alt="Screenshot 2026-07-30 at 11 30 45 PM" src="https://github.com/user-attachments/assets/637ac47f-8cc6-419f-9f02-2d8f1a04fe44" />

### 4.2 Microservices Integration and Testing
`search()` in `client.js` sends the fetch request, checks `response.ok`, validates the JSON shape, and fails safely with an error message on any problem (AC4/AC9). Tested against the live Azure URL.

**Successful ZIP search (e.g. `45221`), showing the results table and live Azure URL**

<img width="1372" height="688" alt="Screenshot 2026-07-30 at 11 21 43 PM" src="https://github.com/user-attachments/assets/da238306-1dc4-43d2-aab8-594a72552bf3" />


### 4.3 Handling JSON Data
`json2htmltable()` sanitizes every field with DOMPurify and renders city, state, county, timezone, and zips (split from the space-separated string) as an HTML table. Shows "No cities found" when there are no matches (AC5/AC10).

**Successful city name search (e.g. `Cincinnati`), showing multiple matching cities/states in the table**

<img width="1376" height="783" alt="Screenshot 2026-07-30 at 11 22 35 PM" src="https://github.com/user-attachments/assets/57e3373f-f12a-4942-b2b9-40a4972da953" />

**A query with no matches (e.g. `zzzzz`), showing "No cities found"**

<img width="904" height="320" alt="Screenshot 2026-07-30 at 11 32 24 PM" src="https://github.com/user-attachments/assets/b89a4bb9-5a2e-456e-a2f6-fae3d95ba7ce" />


### 4.4 Handling Live/Instant Requests
A `keyup` listener requires at least 2 characters, debounces requests by 300ms, and discards stale/out-of-order responses using a `latestQuery` guard (AC5/AC6/AC7).

<img width="1279" height="553" alt="Screenshot 2026-07-30 at 11 33 58 PM" src="https://github.com/user-attachments/assets/24b0dbe9-9ba2-47d8-935b-ba8030346a38" />

---

## 5. DevOps / CI-CD

- **Task 1 (backend):** Docker image built and deployed to Azure App Service via CI/CD on every push.
- **Task 2 (frontend):** GitHub Actions workflow (`static.yml`) builds and deploys the static site to GitHub Pages on every push to `main`.


---

## 6. Conclusion

Task 2 is complete: the front end integrates with the Task 1 microservice, handles JSON responses safely, supports both explicit and live/instant search, and is deployed and live on GitHub Pages.

**Live App URL:** [https://bhalgatarnav.github.io/uscities-search/](https://bhalgatarnav.github.io/uscities-search/)
