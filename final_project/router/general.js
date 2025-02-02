const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  try {
    const books = await getBooks(); // Replace getBooks with your actual async function
    return res.send(JSON.stringify(books));
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = Object.values(books).find((b) => b.isbn === isbn);
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
    .then((book) => {
      return res.json(book);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author.replace(/-/g, " ");
  new Promise((resolve, reject) => {
    const book = Object.values(books).find((b) => b.author === author);
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
    .then((book) => {
      return res.json(book);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title.replace(/-/g, " ");
  new Promise((resolve, reject) => {
    const book = Object.values(books).filter((b) => b.title === title);
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
    .then((book) => {
      return res.json(book);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = Object.values(books).find((b) => b.isbn === isbn);
  const reviews = book.reviews;
  return res.send(reviews);
});

module.exports.general = public_users;
