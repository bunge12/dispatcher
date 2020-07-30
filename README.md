# Dispatcher

Dispatcher is a full-stack web application built with jQuery, Node and Express, that allows for a dispatcher to keep track of their drivers. jQuery was chosen over a front-end framework for the sake of learning and practice.

This project was created as a part of Rose Rocket coding challenge.

## Final Product

- A dispatcher can view a 52-week schedule for three drivers.
- The dispatcher can add, modify, and delete entries for each driver.
- Tasks can't extend over multiple days.
- App informs dispatcher if there is a conflict between tasks.
- The dispatcher can download a report for each driver with a specified division of time.

## Extra features

- Please see [FEATURES.md](FEATURES.md) to see extra features.

## Installation

1. Fork/clone this repository.
2. Install dependencies by running `npm install`.
3. **Optional:** Update Google Place API key (see notes below).
4. Run the server `npm start`.
5. Open your browser and go to http://localhost:8000.

> **NOTE 1:** The app will work with or without the API key (autocomplete feature will not work). If you don't want to set up an API key, move to step 4. If you want to set up an API key on your machine, see API Instructions below.

> **NOTE 2:** To see a working version of the autocomplete feature, please go to the [hosted version](https://dispatcher-jq.herokuapp.com/) of the app.

> **API Instructions:** The location autocomplete feature uses [Google Place API](https://developers.google.com/places/web-service/autocomplete), and thus requires an API key. If you have a key, place it in a `.env` file in the root folder (as shown in `.env.example` file). If you don't have a key, you can obtain one [here](https://developers.google.com/places/web-service/get-api-key).
