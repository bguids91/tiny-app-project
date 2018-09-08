//Worked with @Archaicghost and @alefiyaV
var express = require("express");
var app = express();
var PORT = 8080;
var cookieSession = require('cookie-session')
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

app.use(cookieSession({
        name: 'session',
        keys: ['abcdef'],
        maxAge: 24 * 60 * 60 * 1000
}))
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
  let userURLS = {}
  for (key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      userURLS[key] = urlDatabase[key]
    }
  }
  return userURLS
}

//Login Get
app.get("/login", (req, res) => {
  res.render("urls_login");
});

//Login Post
app.post("/login", (req, res) => {
  let password = req.body.password;
  let email = req.body.email;
  let userID = findUserID(email);
  let hashedPassword = users[userID].password
    if (bcrypt.compareSync(password, hashedPassword)) {
     req.session.user_id = userID
     res.redirect("/urls")
    } else {
    res.send(403);
  }
});

//Register Get
app.get("/register", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  }
  res.render("urls_register", templateVars);
});

//Register Post
app.post("/register", (req, res) => {
  let password = req.body.password;
  let email = req.body.email;
  let hashedPassword = bcrypt.hashSync(password, 10);
  let id = getRandomString();
  if (password === '' || email === '' || getEmail(email)) {
    res.send(400)
  } else {
    newUser = {
      id: id,
      email: email,
      password: hashedPassword
    };
    users[id] = newUser;
    req.session.user_id = id;
    res.redirect("/urls")
  }
});

//Logout Post
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login")
})

//Index Get
app.get("/urls", (req, res) => {
  let userID = req.session.user_id;
  if (!userID) {
    res.redirect('/login');
  } else {
  let sortedData = urlsForUser(userID);
  console.log(sortedData);
  let templateVars = {
    user: users[userID],
    urls: sortedData
  };
  res.render("urls_index", templateVars);
}
});

//Index Post
app.post("/urls", (req, res) => {
  let userID = req.session.user_id;
  let randomVariable = getRandomString();
  urlDatabase[randomVariable] = {
    longURL: req.body.longURL,
    userID: userID
  }
  res.redirect('/urls');
});

//New page
app.get("/urls/new", (req, res) => {
  let validUser = req.session.user_id;
  let templateVars = {
    user: users[req.session.user_id]
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
  let newLongURL = req.body.longURL
  let userID = req.session.user_id
  if (urlDatabase[shortURL].userID === userID) {
  urlDatabase[shortURL].longURL = newLongURL;
  res.redirect("/urls")
  } else {
    res.redirect("/urls")
  }
});

//New short URL
app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL].longURL
  res.redirect(longURL);
});

//Page with URL ID
app.get("/urls/:id", (req, res) => {
  shortURL = req.params.id
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[shortURL],
    user: users[req.session.user_id]
  }
  res.render("urls_show", templateVars);
});


//Delete Post
app.post("/urls/:id/delete", (req, res) => {
  let shortURL = req.params.id;
  let userID = req.session.user_id;
  if (userID === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    res.redirect("/urls")
  } else {
    res.redirect("/urls")
  }
});