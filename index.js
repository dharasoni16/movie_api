const express = require("express"),
  morgan = require("morgan"),
  // import built in modules fs and path
  fs = require("fs"),
  path = require("path");

const app = express();
const bodyParser = require("body-parser"),
  methodOverride = require("method-override");

let topTenMovies = [
  {
    movieName: "Dangal",
  },
  {
    movieName: "Baahubali2",
  },
  {
    movieName: "RRR",
  },
  {
    movieName: "KGF2",
  },
  {
    movieName: "Pathaan",
  },
  {
    movieName: "Bajrangi Bhaijaan",
  },
  {
    movieName: "Secret Superstar",
  },
  {
    movieName: "PK",
  },
  {
    movieName: "2.0",
  },
  {
    movieName: "Sanju",
  },
];

app.use(bodyParser.json());
app.use(methodOverride());
// create a write  stream (in append mode)
// a 'log.txt' file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

//setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

// Get requests
app.get("/", (req, res) => {
  res.send("Welcome to myFLix movie app!");
});

app.get("/movies", (req, res) => {
  res.json(topTenMovies);
});
app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Broke!");
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
