function getRandomString(){
let emptyKey = '';
let alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
let alphaNumericlength = alphaNumeric.length
let randomlength = 6

for (let i = 0; i < randomlength; i++ ) {
  emptyKey += alphaNumeric.substr(Math.floor((Math.random() * alphaNumericlength) + 1), 1)
}

return emptyKey

}
  console.log(getRandomString())
