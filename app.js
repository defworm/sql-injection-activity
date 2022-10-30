const http = require('http'),
    path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// const router = require('express').Router()

const db = new sqlite3.Database(':memory:');

db.serialize(function () {
    db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
    db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
});

app.get('/', function (req, res) {
    res.sendFile('index.html');
});

app.post('/login', function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let query = "SELECT title FROM user where username = '" + username + "' and password = '" + password + "'";

    console.log("username: " + username);
    console.log("password: " + password);
    console.log("query: " + query);

    db.get(query, function (err, row) {
        if (err) {
            console.log('ERROR', err);
            res.redirect("/index.html#error");
        } else if (!row) {
            res.redirect("/index.html#unauthorized");
        } else {
            res.send('Hello <b>' + row.title + '!</b><br /> This file contains all your secret data: <br /> <br /> SECRETS <br /><br /> MORE SECRETS <br /><br /> <a href="/index.html">Go back to login</a>');
        }
    });
})

app.listen(2000, function () {
    console.log("Express server listening on port 2000");
    });;