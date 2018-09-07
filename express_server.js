//Worked with @Archaicghost and @alefiyaV
var express = require("express");
var app = express();
var PORT = 8080;
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Listen
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//Database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Users
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
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
function checkUserCredentials(email, pwd){
  for(var key in users){
    if(users[key].email === email && users[key].password){
      return users[key];
    }
  }
}

//Login Get
app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
  }
  res.render("urls_login", templateVars);
});

//Login Post
app.post("/login", (req, res) => {
  let password = req.body.password;
  let userID = req.body.userID

  let user = checkUserCredentials(userID, password);
  if(user){
    res.cookie('user_id', user.id);
    res.redirect("/urls")
  } else{
    res.send("Sorry! Username or password does not match");
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
    res.cookie('user_id', id);
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
  let templateVars = {
    user: users[req.cookies["user_id"]],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

//Index Post
app.post("/urls", (req, res) => {
  let randomVariable = getRandomString();
  urlDatabase[randomVariable] = req.body.longURL;
  console.log("test");
  console.log(urlDatabase);
  res.redirect('/urls');
});

//New page
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
  }
  res.render("urls_new", templateVars);
});

//new post post
app.post("/urls/:id", (req, res) => {
  let targetID = req.params.id
  urlDatabase[targetID] = req.body.longURL;
  res.redirect("/urls")
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
  let targetID = req.params.id;
  delete urlDatabase[targetID];
  res.redirect("/urls");
});