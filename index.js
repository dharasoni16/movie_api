const express = require("express"),
  morgan = require("morgan"),
  // import built in modules fs and path
  fs = require("fs"),
  path = require("path");

const app = express();
const bodyParser = require("body-parser"),
  uuid = require("uuid");

app.use(bodyParser.json());

let users = [
  {
    id: 1,
    name: "Dhara",
    favoriteMovies: [],
  },
  {
    id: 2,
    name: "Sanket",
    favoriteMovies: ["Dangal"],
  },
];

let movies = [
  {
    Title: "Kabhi Khushi Kabhie Gham....",
    Description:
      "‘It’s all about loving your parents,’ screamed the trailer for ‘Kabhi Khushi Kabhie Gham…’, a film that piled on the mush in true Karan Johar (‘My Name is Khan’) style. Here, Johar brought together a dream cast to play a fractured family. Billionaire Yashvardhan (Bachchan) is an authoritarian who banishes his adopted son Rahul (Khan) for marrying a woman against his wishes. Years later, Raj’s brother Rohan (Roshan) strives to bring the family together. Boasting opulent production design, lavish musical set pieces and an orgy of superstars, ‘K3G’ (as the film came to be known) is guilty-pleasure Bollywood at its best.",
    Genre: {
      Name: "melodrama, romance, musical",
      Description:
        "Rahul and Rohan reunite after several years. Sat on a park bench, Rahul asks Rohan questions about things they had talked about when Rohan was just a kid.",
    },
    Director: {
      Name: "Karan Johar",
      Bio: "Karan Johar, often informally referred to as KJo, is an Indian filmmaker and television personality, who primarily works in Hindi cinema. He has launched the careers of several successful actors under his own Dharma Productions. ",
      Birth: "May 25, 1972",
    },
    ImageUrl:
      "https://en.wikipedia.org/wiki/Kabhi_Khushi_Kabhie_Gham...#/media/File:Kabhi_Khushi_Kabhie_Gham..._poster.jpg",
    Featured: true,
  },
  {
    Title: "Chak De! India",
    Description:
      "Between clever gangster movie ‘Ab Tak Chhappan’ (2004) and the grossly underrated ‘Rocket Singh: Salesman of the Year’ (2009), director Shimit Amin teamed up with writer Jaideep Sahni to give us this quintessential sports drama. The film narrates the story of a tainted ex-India hockey player (Khan) who coaches the women’s team to World Cup glory. While sticking to the underdog-overcomes-obstacles template, Amin and Sahni deftly weave in themes of cultural diversity, religious difference and feminism.",
    Genre: {
      Name: "sports, drama, musical",
      Description:
        "The girls’ team goes up against the boys’ national team, winning the respect of the opposing team and the selectors.",
    },
    Director: {
      Name: "Shimit Amin",
      Bio: "Shimit Amin is an Indian American film director and editor. He is best known for the award-winning film Chak De! India starring Shah Rukh Khan.",
      Birth: "January 1, 1900",
    },
    ImageUrl:
      "https://en.wikipedia.org/wiki/Chak_De!_India#/media/File:Chak_De!_India.jpg",
    Featured: true,
  },
  {
    Title: "Zindagi Na Milegi Dobara",
    Description:
      "Translated as ‘You only live once’, this buddy-meets-mid-life-crisis movie sees three friends take a road trip in Spain: Arjun (Roshan) is a workaholic; Imraan (Farhan Akhtar) wants to track down his biological father; and Kabir (Deol) is unsure about his upcoming wedding. ‘Zindagi Na Milegi Dobara’ had a message for middle-class Indians living the new liberal dream with well-paid jobs: it’s okay not to conform or to have a happily-ever-after romance.",
    Genre: {
      Name: "comedy, adventure, drama, road movie",
      Description:
        "As the friends do Pamplona’s bull run – in slow motion – there’s a voiceover of Akhtar’s character, Imraan, reciting a poem about being free. The poem is written by Akhtar’s screenwriter father, Javed (‘Sholay’, ‘Deewar’). How meta is that?",
    },
    Director: {
      Name: "Zoya Akhtar",
      Bio: "Zoya Akhtar is an Indian film director and screenwriter who works in Hindi cinema. After completing a diploma in filmmaking from NYU, she assisted directors such as Mira Nair, Tony Gerber and Dev Benegal, before becoming a writer and director herself. ",
      Birth: "October 14, 1972",
    },
    ImageUrl:
      "https://en.wikipedia.org/wiki/Zindagi_Na_Milegi_Dobara#/media/File:Zindagi_Na_Milegi_Dobara.jpg",
    Featured: true,
  },
];

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
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

// Read (Returns Movie by title)
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  //find movie by title and return it as json object if found else send error message
  const movie = movies.find((movie) => movie.Title === title);
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).json({ message: "Movie not Found" });
  }
});

// Read (Returns movie genere description by name/title)
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;
  if (genre) {
    return res.status(200).json(genre);
  } else {
    res.status(400).send("No such genre");
  }
});

// Read (Returns data about movie director by name)
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.Director.Name === directorName
  ).Director;
  if (director) {
    return res.status(200).json(director);
  } else {
    res.status(400).send("No such director");
  }
});

// Add a user
app.post("/users", (req, res) => {
  const newUser = req.body;
  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).json("Please enter the name of user");
  }
});

// Update user with userName
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updateUser = req.body;
  let user = users.find((user) => user.id == id);
  if (user) {
    user.name = updateUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("No such user");
  }
});

// Add a movie by user
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);
  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user id ${id}`);
  } else {
    res.status(400).send("No such user");
  }
});

// Delete the movie from FavMovie list by user
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);
  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (title) => title !== movieTitle
    );
    res.status(200).send(`${movieTitle} has been removed from user id ${id}`);
  } else {
    res.status(400).send("No such user");
  }
});

// Delete user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);
  if (user) {
    user = users.filter((user) => user.id != id);
    res.status(200).send(`userid ${id} has been removed`);
  } else {
    res.status(400).send("No such user");
  }
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
