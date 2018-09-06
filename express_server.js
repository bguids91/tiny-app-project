//Worked with @Archaicghost and @alefiyaV


var express = require("express");
var app = express();
var PORT = 8080;
var cookie = require('cookie');
var cookieParser = require('cookie-parser');

app.use(cookieParser());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls", (req, res) => {
  var username;
  if (req.cookies) {
    username = req.cookies.username;
  } else {
    username = undefined;
  }
  let templateVars = {
    username: username,
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

//updating the urlDatabase
app.get("/urls/new", (req, res) => {
  var username;
  if (req.cookies) {
    username = req.cookies.username;
  } else {
    username = undefined;
  }
  let templateVars = {
    username: username
  }
  res.render("urls_new", templateVars);
});

//newly made alphanumeric shirtURL to post to our urls page
app.post("/urls", (req, res) => {
  let randomVariable = getRandomString();
  urlDatabase[randomVariable] = req.body['longURL'];
  res.redirect("/urls/" + randomVariable);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//goes to new page with the shortURL and longURL
app.get("/urls/:id", (req, res) => {
  var username;
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: username
  };
  if (req.cookies) {
    username = req.cookies.username;
  } else {
    username = undefined;
  }
  res.render("urls_show", templateVars);
});

app.post("/login", (req, res) => {
  let username = req.body['username'];
  res.cookie('username', username);
  res.redirect("/urls")
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls")
})

app.post("/urls/:id", (req, res) => {
  let targetID = req.params.id
  urlDatabase[targetID] = req.body['longURL'];
  res.redirect("/urls")
});

app.post("/urls/:id/delete", (req, res) => {
  let targetID = req.params.id;
  delete urlDatabase[targetID];
  res.redirect("/urls");
});


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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// app.get("/urls/:id/delete", (req, res) => {
//   delete urlDatabase[req.params.id];
//   let templateVars = { urls: urlDatabase};
//   res.render("urls_index", templateVars)
// });




//allows the longURL to be edited
// app.get("/urls/:id/edit", (req, res) => {
//    if (req.cookies) {
//      username = req.cookies.username;
//    } else {
//      username = undefined;
//    }
//   let targetID = req.params.id;
//   let templateVars = {
//     username: req.cookies["username"],
//     shortURL: req.params.id,
//     longURL: urlDatabase[targetID]
//   }
//   res.render("urls_show", templateVars)
// });
//takes the new longURL and updates in object
