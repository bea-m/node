const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const csvtojson = require('csvtojson');
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

const urlencodedParser = bodyParser.urlencoded({extended: false});
app.post('/savedata', urlencodedParser, (req, res) => {
    let str = `"${req.body.prichod}","${req.body.odchod}","${req.body.pozice}","${req.body.den}"\n`;
    fs.appendFile(path.join(__dirname, 'data/data.csv'), str, function (err) {
        if (err) {
            console.error(err);
            return res.status(400).json({
                success: false,
                message: "Nastala chyba během ukládání souboru"
            });
        }
    });
    res.redirect(301, '/');
});

app.get("/todolist", (req, res) => {  
    csvtojson({headers:['prichod','odchod','pozice','den']}).fromFile(path.join(__dirname, 'data/data.csv'))
    .then(data => {
        res.render('index', {nadpis: "Směny", smeny: data});
    })
    .catch(err => {
        console.log(err);
        res.render('error', {nadpis: "Chyba v aplikaci", chyba: err});
    });    
});

app.listen(port, () => {
    console.log(`Server naslouchá na portu ${port}`);
});