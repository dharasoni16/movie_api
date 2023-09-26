const mongoose = require("mongoose");
const Models = require("./models.js");
const uuid = require("uuid");
const express = require("express"),
  morgan = require("morgan"),
  // import built in modules fs and path
  fs = require("fs"),
  path = require("path");
const { json } = require("body-parser");
const { check, validationResult } = require("express-validator");

const Movies = Models.Movie;
const Users = Models.User;

// function to connect  to local database
// mongoose.connect("mongodb://127.0.0.1:27017/myFlixDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// function to connect API to MongodbAtlas
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// importing cors module in app for data security
const cors = require("cors");

// code to allow only certain origin request to access the app
let allowedOrigins = ["http://localhost:8080", "http://testsite.com", "http://localhost:1234", "https://myflix-client-bollywood.netlify.app"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn't found on the list of a allowed origins
        let message =
          "The CORS policy for this application doesn't allow access from origin  " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

// including auth.js file here and the app argument ensures that Express is available in auth.js file
let auth = require("./auth.js")(app);

// importing passport module and passport.js file
const passport = require("passport");
require("./passport.js");

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

// Read (Returns list of all movies)
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(401).json({ errors: err.array() });
      });
  }
);

// Read (Returns Movie by title)
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(401).json({ errors: err.array() });
      });
  }
);

// Read (Returns movie genere description by name/title)
app.get(
  "/movies/genres/:Name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ "Genre.Name": req.params.Name })
      .then((movie) => {
        res.json(movie.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(401).json({ errors: err.array() });
      });
  }
);

// Read (Returns data about director by director name)
app.get(
  "/movies/directors/:Name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ "Director.Name": req.params.Name })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(401).json({ errors: err.array() });
      });
  }
);

// Add a user
app.post(
  "/users",
  // Validation logic here for request
  // you can either use a chain of methods lik .not().isEmpty()
  // Which means "opposite of isEmpty" in plain english "is not empty"
  // or use .isLength({min:5}) which means minimum value of 5 characters are only allowed
  [
    check(
      "Username",
      "Enter a Username that is atleast 5 letters long"
    ).isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters- not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  async (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
      // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          // If the user is found, send a response that it already exists
          return res
            .status(400)
            .json({ errors: req.body.Username + " Already exists" });
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthdate: req.body.Birthdate,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(400).json({ errors: error.array() });
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ errors: error.array() });
      });
  }
);

// Get all users
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(401).json({ errors: err.array() });
      });
  }
);

// Get a user by username
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(401).json({ errors: err.array() });
      });
  }
);

// Update user's info, by username
app.put(
  "/users/:Username",
  // Validation logic here for request
  // or use .isLength({min:5}) which means minimum value of 5 characters are only allowed
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters- not allowed."
    ).isAlphanumeric(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    // Condition to check added here
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission denied");
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    // Condition Ends
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthdate: req.body.Birthdate,
        },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ errors: err.array() });
      });
  }
);

// Add a movie to user's list of favorites
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(401).json({ errors: err.array() });
      });
  }
);

// Delete the movie from FavMovie list by user
app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(401).json({ errors: err.array() });
      });
  }
);

// Delete a user by username
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res
            .status(400)
            .json({ error: req.params.Username + " was not found" });
        } else {
          res
            .status(200)
            .json({ message: req.params.Username + " was deleted." });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(401).json({ error: err.array() });
      });
  }
);

app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Broke!");
});

const port = process.env.PORT || 8080;
// listen for requests
app.listen(port, "0.0.0.0", () => {
  console.log("Your app is listening on port" + port);
});
