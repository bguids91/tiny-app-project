//Worked with @Archaicghost and @alefiyaV
var express = require("express");
var app = express();
var PORT = 8080;
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

//Listen
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//Database
const urlDatabase = {
 "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
     userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "userRandomID"
}};

//Users
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "ben@example.com",
    password: "ben"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "ben2@example.com",
    password: "ben2"
  }
}

//Random string for urls and user.id
function getRandomString() {
  let emptyKey = '';
  let alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let alphaNumericlength = alphaNumeric.length
  let randomlength = 6
  for (let i = 0; i < randomlength; i++) {
    emptyKey += alphaNumeric.substr(Math.floor((Math.random() * alphaNumericlength) + 1), 1)
  }
  return emptyKey
}

//Function to compare new email in register to emails in database
function getEmail(newUserEmail) {
  for (keys in users) {
    if (users[keys].email === newUserEmail) {
      return true;
    }
    return false;
  }
}

//Login function
function checkUserCredentials(email, pwd) {
  for (var keys in users) {
    if (users[keys].email === email && users[keys].password === pwd) {
      return users[keys];
    }
  }
}

//Find username attached to email
function findUserID(email) {
  for (keys in users) {
    if (users[keys].email === email){
      return users[keys].id
    }
  }
}

//Checks through object to find keys that match with user id
function urlsForUser(id) {
  userURLS = []
  for (keys in urlDatabase) {
    if (urlDatabase[keys].userID = id) {
      userURLS += urlDatabase[keys]
    }
    return userURLS
  }
}

//Login Get
app.get("/login", (req, res) => {
  let templateVars = {
    user: users[userID]
  }
  res.render("urls_login", templateVars);
});

//Login Post
app.post("/login", (req, res) => {
  let password = req.body.password;
  let email = req.body.email;
  let userID = findUserID(email);
  console.log(userID);
  let user = checkUserCredentials(email, password);
    if (user) {
     res.cookie("user_id", userID)
    res.redirect("/urls")
    } else {
    res.send(403);
  }
});

//Register Get
app.get("/register", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
  }
  res.render("urls_register", templateVars);
});

//Register Post
app.post("/register", (req, res) => {
  let password = req.body.password;
  let email = req.body.email;
  let id = getRandomString();
  if (password === '' || email === '' || getEmail(email)) {
    res.send(400)
  } else {
    newUser = {
      id: id,
      email: email,
      password: password
    };
    users[id] = newUser
    res.cookie("user_id", id);
    res.redirect("/urls")
  }
});

//Logout Post
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/login")
})

//Index Get
app.get("/urls", (req, res) => {
  let userID = req.cookies["user_id"]
  let userURLS = urlsForUser(userID)
  let templateVars = {
    user: users[req.cookies["user_id"]],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

//Index Post
app.post("/urls", (req, res) => {
  let userID = req.cookies["user_id"]
  let randomVariable = getRandomString();
  urlDatabase[randomVariable] = {
    longURL: req.body.longURL,
    userID: userID
  }
  console.log(urlDatabase)
  res.redirect('/urls');
});

//New page
app.get("/urls/new", (req, res) => {
  let validUser = req.cookies["user_id"]
  let templateVars = {
    user: users[req.cookies["user_id"]]
  }
  if (validUser) {
  res.render("urls_new", templateVars);
  } else {
    res.redirect('/login')
  }
});

//new post post
app.post("/urls/:id", (req, res) => {
  let shortURL = req.params.id
  let newLongURL = req.body['longURL']
  let userID = req.cookies["user_id"]
  if (shortURL.userID === userID) {
  urlDatabase[shortURL].longURL = newLongURL;
  res.redirect("/urls")
  } else {
    res.redirect("/urls")
    res.send("Sorry!")
  }
});

//New short URL
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//Page with URL ID
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies["user_id"]]
  }
  res.render("urls_show", templateVars);
});


//Delete Post
app.post("/urls/:id/delete", (req, res) => {
  let targetID = req.params.id
  delete urlDatabase[targetID];
  res.redirect("/urls");
});