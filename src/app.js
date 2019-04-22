const express = require("express");
const path = require("path");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

/** define paths for express config. */
const publicDirectoryPath = path.join(__dirname, "../public/");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

/** Setup handbebars directory and views to serve */
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

/** Setup static directory to serve */
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Akan"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Akan"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help Page",
    name: "Akan",
    helpText: "This is the help message"
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "No address provided"
    });
  }

  geocode(req.query.address, (error, { lat, long, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(lat, long, (error, forecastData) => {
      if (error) {
        return req.send({ error });
      }

      res.send({
        location,
        forecast: forecastData,
        address: req.query.address
      });
    });
  });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term"
    });
  }

  console.log(req.query);
  res.send({
    products: []
  });
});

/**Catch all for other routes after help. */
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "Help 404",
    name: "Akan",
    errorMessage: "Help article not found"
  });
});

/**  Catch all for all other routes */
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Akan",
    errorMessage: "404 page"
  });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000.");
});
