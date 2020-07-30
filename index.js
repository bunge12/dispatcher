const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

require("dotenv").config();

const app = express();
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.use(bodyParser.urlencoded({ extended: true }));
app.post("/maps", (req, res) => {
  let search = req.body.query;
  axios
    .get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${search}&types=(cities)&key=${process.env.MAPS_API}`
    )
    .then(function (response) {
      const data = response.data.predictions;
      let predictions = [];
      data.forEach((element) => {
        predictions.push(element.description);
      });
      res.send(predictions);
    })
    .catch((e) => {
      sendStatus(404);
      console.log(e);
    });
});

app.use(express.static("public"));
app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Dispatcher App listening at port ${port}`));
