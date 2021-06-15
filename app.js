const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]//The above key names are preserved and are the parameters of the list.

  };
  //Here, we have created an array called members that will store each member details in the form of elements, since it's an dynamic way so we have only defined single element of this array which has further keys within it.
  //To convert the member array into json, we first stored in an object called data.
  const jsonData = JSON.stringify(data);//converting object data into json.
  const url = "https://us6.api.mailchimp.com/3.0/lists/5209af06ca";//url which consist end-point of mailchimp server and further path with unique list id.
  const options = {
    method: "Post",//This key called method states that post request has been made to the external server.
    auth: "deep1:ddabddca05f485c0a9348ea4e7186f12-us6"//auth is a key used for authentication purpose.
  };
  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);//Sendind user i/p data to mailchimp list.
  request.end();//To stop the ongoing process.
});
app.post("/failure", function(req, res) {
  res.redirect("/");//Redirects the user to the home page of the website.
});

//'https://${dc}.api.mailchimp.com/3.0/lists/{list_id}?skip_merge_validation=<SOME_BOOLEAN_VALUE>&skip_duplicate_check=<SOME_BOOLEAN_VALUE>' \
//ddabddca05f485c0a9348ea4e7186f12-us6 (API key)

app.listen(process.env.PORT || 3000, function() {
  console.log("Server has started at port 3000. ");//Will set the dynamic port provided by Heroku.
});
//5209af06ca (Unique list ID)
