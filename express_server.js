
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080

app.set("view engine", "ejs")

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

app.get("/urls", (req, res) => {
  let templateUrl = { urls: urlDatabase };
  res.render("urls_index", templateUrl);
});

app.get("/urls/:id", (req, res) => {
  let templateShort = { shortURL: req.params.id };
  res.render("urls_show", templateShort);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});