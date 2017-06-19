const express = require("express");
const hbs = require("hbs");

const fs = require("fs");

const port = process.env.PORT || 1000;

var app = express();

hbs.registerPartials(__dirname+"/views/partials");
app.set("view engine", "hbs");

//express.static takes the ABSOLUTE PATH
//but we can use __dirname for it to get the path
//from the root of the hard drive to the current folder
//just concatenate the folder next to __dirname to comeplete it

//express.static can display the contents of the folder
//--in the browser when the server is up
// NOTE: maintenance page will not work if express static is placed here
// instead, it should be called after the maintenance use code block
// app.use(express.static(__dirname + "/public"));

//next is here to tell express when middleware function is done 
app.use((request, response, next) => {
    var timeNow = new Date().toString();
    var log = `${timeNow}: ${request.method}, ${request.url}`
    console.log(log);
    fs.appendFile("server.log", log + "\n", (err) => {
        if(err){
            console.log("Unable to append to server.log");
        }
    });
    next();
});

// app.use((request, response, next) => {
//     response.render("maintenance.hbs");
// })

// it works now!!!
app.use(express.static(__dirname + "/public"));

hbs.registerHelper("currentYear", () => {
    return new Date().getFullYear();
});

hbs.registerHelper("capitalizeText", (text) => {
    return text.toUpperCase();
});

//request = headers and stuff
//response = explore what to return

//the "/" directory is the homepage/index
app.get("/", (request, response) =>{
    // when you check the dev tools
    // go to network tab, click on the server.js
    // you will see the response.type
    // this will set the response.type to text/html

    //response.send("<h1>Hello Express!<h1>");

    // this is a sample JSON file
    // this will set the response.type to application/JSON

    // response.send({
    //     name: "Mica",
    //     age: 19,
    //     items: ["knife", "potion"]
    // });

    // response.send("<h1>Index Page</h1>");

    //!!!!CHALLENGE!!!!
    response.render("index.hbs", {
        pageTitle: "Homepage",
        authorName: "Mica",
        welcomeMessage: "Welcome, USER!!"
    })
});


// //calling another app.get creates a new webpage for you to visit manually
// app.get("/about", (request, response) => {
//     response.send("<h2>About Page</h2>");
// });

// I COMMENTED OUT THE CODE ABOVE BECAUSE WE ARE GOING TO USE HBS NOW
// use the response.render to render HBS files
// render has two arguments
// the first argument is the hbs file to be rendered
// the second argument is an object to be passed for it to be used in the first argument
app.get("/about", (request, response) => {
    //response.render("about.hbs");
    response.render("about.hbs", {
        authorName: "Mica",
        pageTitle: "About Page"
    })
});

app.get("/projects", (request, response) => {
    //response.render("about.hbs");
    response.render("projects.hbs", {
        authorName: "Mica",
        pageTitle: "Projects Page"
    })
});

//challenge
//create another app.get with a JSON file with an error message
app.get("/bad", (request, response) => {
    response.send({
        statusCode: 500,
        errorMessage: "Unable to fetch webpage"
    });
});

//listen arguments
//listen (port number, a function)
app.listen(port, () =>{
    console.log(`Server is up and running on port ${port}`);
});