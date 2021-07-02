require("dotenv").config();
const inquirer = require("inquirer");
const request = require("request");
const keys = require("./keys.js");
const moment = require("moment");
const Spotify = require("node-spotify-api");
const fs = require("fs");
const spotify = new Spotify(keys.spotify);
const app = function () {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What can NAS help you with?",
        choices: [
          "Search concerts",
          "Search songs",
          "Search a movie",
          "Surprise me",
          "Quit",
        ],
        name: "api",
      },
    ])
    .then(function (res) {
      if (res.api == "Search concerts") {
        inquirer
          .prompt([
            {
              type: "input",
              message: "Enter a band or artist name.",
              name: "bandname",
            },
          ])
          .then(function (res) {
            request(
              "https://rest.bandsintown.com/artists/" +
                res.bandname +
                "/events?app_id=bootcamp",
              function (err, res, body) {
                if (err) {
                  return console.log(err);
                } else {
                  JSON.parse(body).forEach((element) => {
                    console.log(element.venue.name);
                    console.log(
                      moment(element.datetime).format("MM-DD-YYYY hh:mm")
                    );
                    console.log(element.venue.location);
                    console.log("\n");
                    console.log("---------------------");
                    console.log("\n");
                  });
                  app();
                }
              }
            );
          });
      } else if (res.api == "Search songs") {
        inquirer
          .prompt([
            {
              type: "input",
              message: "Enter a song",
              name: "song",
            },
          ])
          .then(function (res) {
            spotify.search(
              { type: "track", query: res.song },
              function (err, data) {
                if (err) {
                  return console.log(err);
                } else {
                  console.log("\n");
                  console.log("---------------------");
                  console.log("\n");
                  console.log(data.tracks.items[0].name);
                  console.log("By: " + data.tracks.items[0].artists[0].name);
                  console.log("Preview: " + data.tracks.items[0].preview_url);
                  console.log("\n");
                  console.log("---------------------");
                  console.log("\n");
                  app();
                }
              }
            );
          });
      } else if (res.api == "Search a movie") {
        inquirer
          .prompt([
            {
              type: "input",
              message: "Enter a movie name",
              name: "movie",
            },
          ])
          .then(function (res) {
            request(
              "https://omdbapi.com/?apikey=89c82b2&t=" +
                res.movie +
                "&plot=short",
              function (err, res, body) {
                if (err) {
                  return console.log(err);
                } else {
                  console.log("\n");
                  console.log("---------------------");
                  console.log("\n");
                  console.log(
                    JSON.parse(body).Title + "(" + JSON.parse(body).Year + ")"
                  );
                  console.log("Plot: " + JSON.parse(body).Plot);
                  console.log(
                    "IMDB rating: " + JSON.parse(body).Ratings[0].Value
                  );
                  console.log(
                    "Rotten Tomatoes rating: " +
                      JSON.parse(body).Ratings[1].Value
                  );
                  console.log("Actors: " + JSON.parse(body).Actors);
                  console.log("\n");
                  console.log("---------------------");
                  console.log("\n");
                  app();
                }
              }
            );
          });
      } else if (res.api == "Surprise me") {
        fs.readFile("./random.txt", function (err, res) {
          if (err) {
            return console.log(err);
          } else {
            let index = Math.floor(Math.random() * JSON.parse(res).length);
            let command = JSON.parse(res)[index].command;
            // console.log(command);
            if (command == "movie") {
              request(
                "https://omdbapi.com/?apikey=89c82b2&t=" +
                  JSON.parse(res)[index].search +
                  "&plot=short",
                function (err, res, body) {
                  if (err) {
                    return console.log(err);
                  } else {
                    console.log("\n");
                    console.log("---------------------");
                    console.log("\n");
                    console.log(
                      JSON.parse(body).Title + "(" + JSON.parse(body).Year + ")"
                    );
                    console.log("Plot: " + JSON.parse(body).Plot);
                    console.log(
                      "IMDB rating: " + JSON.parse(body).Ratings[0].Value
                    );
                    console.log(
                      "Rotten Tomatoes rating: " +
                        JSON.parse(body).Ratings[1].Value
                    );
                    console.log("Actors: " + JSON.parse(body).Actors);
                    console.log("\n");
                    console.log("---------------------");
                    console.log("\n");
                    app();
                  }
                }
              );
            } else if (command == "song") {
              spotify.search(
                { type: "track", query: JSON.parse(res)[index].search },
                function (err, data) {
                  if (err) {
                    return console.log(err);
                  } else {
                    console.log("\n");
                    console.log("---------------------");
                    console.log("\n");
                    console.log(data.tracks.items[0].name);
                    console.log("By: " + data.tracks.items[0].artists[0].name);
                    console.log("Preview: " + data.tracks.items[0].preview_url);
                    console.log("\n");
                    console.log("---------------------");
                    console.log("\n");
                    app();
                  }
                }
              );
            } else if (command == "concert") {
              request(
                "https://rest.bandsintown.com/artists/" +
                  JSON.parse(res)[index].search +
                  "/events?app_id=bootcamp",
                function (err, res, body) {
                  if (err) {
                    return console.log(err);
                  } else {
                    JSON.parse(body).forEach((element) => {
                      console.log(element.venue.name);
                      console.log(
                        moment(element.datetime).format("MM-DD-YYYY hh:mm")
                      );
                      console.log(element.venue.location);
                      console.log("\n");
                      console.log("---------------------");
                      console.log("\n");
                    });
                    app();
                  }
                }
              );
            }
          }
        });
      } else {
        console.log("Bye!");
        return;
      }
    });
};
app();
