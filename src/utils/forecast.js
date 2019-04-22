const request = require("request");

const forecast = (lat, long, callback) => {
  const url = `https://api.darksky.net/forecast/42134367a721a86998d78733c8debfdd/${lat},${long}`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service", undefined);
    } else if (body.error) {
      callback(body.error, undefined);
    } else {
      callback(
        undefined,
        `${body.daily.data[0].summary} It is currently ${
          body.currently.temperature
        } degrees out. There is a ${
          body.currently.precipProbability
        }% chance of rain. There will be a high of ${
          body.daily.data[0].temperatureHigh
        }° F and a low of ${body.daily.data[0].temperatureLow}° F`
      );
    }
  });
};

module.exports = forecast;
