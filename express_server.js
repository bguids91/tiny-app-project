//Worked with @Archaicghost and @alefiyaV


var express = require("express");
var app = express();
var PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs")

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

//newly made alphanumeric shirtURL to post to our urls page
app.post("/urls", (req, res) => {
  let randomVariable = getRandomString();
  urlDatabase[randomVariable] = req.body['longURL'];
  res.redirect("/urls/" + randomVariable);
});

//updating the urlDatabase
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.post("/urls/:id/delete", (req, res) =>{
  let deletedURL = req.params.id
  console.log(deletedURL);
  console.log(urlDatabase);
  res.redirect("/urls")
})

//connects the longURL with the short url when put into url bar
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

//goes to new page with the shortURL and longURL
app.get("/urls/:id", (req, res) => {
  let templateVars = {shortURL: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});

//adds short and long urls to the index page
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
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