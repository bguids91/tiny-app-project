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


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


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
  urlDatabase[randomVariable] = req.body.longURL;
  console.log("test");
  console.log(urlDatabase);
  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//goes to new page with the shortURL and longURL
app.get("/urls/:id", (req, res) => {
  var username;
  if (req.cookies) {
    username = req.cookies.username;
  } else {
    username = undefined;
  }
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: username
  }
  res.render("urls_show", templateVars);
});

app.post("/login", (req, res) => {
  let username = req.body.username;
  res.cookie('username', username);
  res.redirect("/urls")
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls")
})

app.post("/urls/:id", (req, res) => {
  let targetID = req.params.id
  urlDatabase[targetID] = req.body.longURL;
  res.redirect("/urls")
});

app.post("/urls/:id/delete", (req, res) => {
  let targetID = req.params.id;
  delete urlDatabase[targetID];
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  var username;
    if (req.cookies) {
      username = req.cookies.username;
    } else {
      username = undefined;
    }
    let templateVars = {
      username: username
    }
    res.render("urls_register", templateVars);
  });

app.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  // console.log(req.body)
  // console.log(username)
  // console.log(password)
  let id = getRandomString();
  if (password === '' || username === '') {
    console.log('ERROR')
    res.redirect("/register")
  }
  if (username === users[id]) {
    console.log('same username')
    res.redirect("/register")
  }
  else {
  newUser = {id: id, email: username, password: password};
  users[id] = newUser
  res.cookie('user_id', id);
  res.redirect("/urls")
  }
});

app.get("/urls", (req, res) => {

  let templateVars = {
    username: users[res.cookie.id],
    urls: urlDatabase
  };
  // console.log(templateVars)
  res.render("urls_index", templateVars);
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


// app.get("/urls/:id/edit", (req, res) => {
//   let username = req.params.id;
//   if (req.cookies) {
//     username = req.cookies.username;
//   } else {
//     username = undefined;
//   }
//   let templateVars = {
//     username: username,
//     shortURL: req.params.id,
//     longURL: urlDatabase[targetID]
//   }
//   res.render("urls_show", templateVars)
// });

