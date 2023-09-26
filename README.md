# movie_api

Movie-api name myFlix is the server-side component of a “movies” web application.Its an REST API build using Node.js,Express.js and MongoDB. The web application will provide users with access to information about different movies, directors, and genres. Users will be able to sign up, update their personal information, create a list of their favorite movies, remove the movie from their favorite movies list and can also deregister themselves.The App is deployed on render at https://movie-api-0fqq.onrender.com/. All the endpoints details are available at documentation.html file at https://movie-api-0fqq.onrender.com/documentation.html.

## Key-Features

- Return a list of ALL movies to the user

* Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user

- Return data about a genre (description) by name/title (e.g., “Thriller”)

* Return data about a director (bio, birth year, death year) by name

- Allow new users to register

* Allow users to update their user info (username, password, email, date of birth)

- Allow users to add a movie to their list of favorites

* Allow users to remove a movie from their list of favorites

- Allow existing users to deregister

## Technology Stack

- Node.js

* Express.js

- MongoDB

* Rest & API Endpoints

- Mongoose(Business Logic Layer)

* JWT(token-based) authentication

- CORS in Express

* Hashing using bcrypt

- Supporting Packages are installed (See package.json file for detail)

* Postman(To test endpoints)

- Code Linters used are :
  - HTMLHINT
  - ESLint
  - Prettier

## Installation

To install these project simply clone these repository on your local machine.You can refer the below link for the reference on how to clone the repository from github.

```bash
https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository
```

## Usage

You can open these project in Visual Studio or any text editor of your choice.To run API on localhost(on your computer) enter npm run index.js or npm run dev in the terminal. You can test the API endpoints using Postman.

Visual Studio text editor is recommended as these project was build using Visual Studio editor.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## Acknowledgment

Want to thanks different public resources which I used as a reference to make these project

#### https://docs.npmjs.com/

#### https://mongoosejs.com/docs/queries.html

#### https://www.mongodb.com/docs/manual/reference/method/

#### https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose

## License

This project is licensed under the [MIT] License.Click here to see the details(https://choosealicense.com/licenses/mit/)
