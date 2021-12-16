// Create express app
const express = require("express");
const app = express();
const sqlite3 = require('sqlite3').verbose();
const md5 = require('md5');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Server port
var HTTP_PORT = 8000;
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/health", (req, res, next) => {

    res.status(200).json({"status":"ok"});

});

app.post('/user/register', function(req, res) {

    if(typeof req.body.email === 'undefined' || typeof req.body.password === 'undefined' || typeof req.body.repeatPassword === 'undefined'){
        res.status(500).send("Missing required data.");
    }

    if(req.body.password !== req.body.repeatPassword){
        res.status(500).send("Passwords don't match.");
    }

    const email = req.body.email;
    const password = md5(req.body.password);
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;

    let db = new sqlite3.Database('database.db');
    let sql = "INSERT INTO users(FIRST_NAME,LAST_NAME,EMAIL,PASSWORD) VALUES(?,?,?,?)";
    db.run(sql, [first_name,last_name,email,password], function(err) {
        if (err) {
            res.status(500).send("Database insert failed.");
        }
        res.send(`A row has been inserted with rowid ${this.lastID}`);
    });

    db.close();

});

app.post('/user/login', function(req, res) {

    if(typeof req.body.email === 'undefined' || typeof req.body.password === 'undefined'){
        res.status(500).send("Missing required data.");
    }

    const email = req.body.email;
    const password = md5(req.body.password);


    let db = new sqlite3.Database('database.db');

    var sql = "select * from users WHERE EMAIL = ? AND PASSWORD = ?";
    var params = [email, password];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        if(rows.length > 0){
            let token = jwt.sign({email:rows[0].EMAIL, admin: rows[0].IS_ADMIN.toString()}, 'mediately',{ expiresIn: '2 days' });
            res.json({
                "token":token
            })
        }else{
            res.status(500).send("User doesn't exist.");
        }

    });

    db.close();

});

app.post('/user/update', function(req, res) {
    let bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== "undefined"){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        try {
            let decoded = jwt.verify(bearerToken, 'mediately');
            if(decoded.admin !== "1" && decoded.email !== req.body.email){
                res.status(500).send("Cannot update user");
            }else{
                let db = new sqlite3.Database('database.db');
                const email = req.body.email;
                const password = md5(req.body.password);
                const first_name = req.body.first_name;
                const last_name = req.body.last_name;
                let sql = "UPDATE users SET FIRST_NAME = COALESCE(?, FIRST_NAME), LAST_NAME = COALESCE(?, LAST_NAME), PASSWORD = COALESCE(?, PASSWORD) WHERE EMAIL = ?";
                db.run(sql, [first_name,last_name,password,email], function(err) {
                    if (err) {
                        res.status(500).send("Database update failed.");
                    }
                    res.send(`Update successful`);
                });

                db.close();
            }
        } catch(err) {
            res.status(500).send("Token invalid");
        }
    }else
    {
        res.sendStatus(403);
    }

});

app.post('/user/delete', function(req, res) {
    let bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== "undefined"){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        try {
            let decoded = jwt.verify(bearerToken, 'mediately');
            if(decoded.admin !== "1" && decoded.email !== req.body.email){
                res.status(500).send("Cannot delete user");
            }else{
                let db = new sqlite3.Database('database.db');
                const email = req.body.email;
                let sql = "DELETE FROM users WHERE EMAIL = ?";
                db.run(sql, [email], function(err) {
                    if (err) {
                        res.status(500).send("Database delete failed.");
                    }
                    res.send(`Delete successful`);
                });

                db.close();
            }
        } catch(err) {
            res.status(500).send("Token invalid");
        }

    }else
    {
        res.sendStatus(403);
    }


});

app.get("/drugs", (req, res, next) => {
    let bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== "undefined"){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        try {
            let decoded = jwt.verify(bearerToken, 'mediately');
            let sql = "SELECT * FROM drugs WHERE PUBLISHED=1 AND CONFIRMED=1";
            if(decoded.admin === "1"){
                sql = "SELECT * FROM drugs";
            }
            let db = new sqlite3.Database('database.db');
            db.all(sql, (err, rows) => {
                if (err) {
                    res.status(400).json({"error":err.message});
                    return;
                }
                if(rows.length > 0){
                    res.json({
                        "message":"success",
                        "data":rows
                    })
                }else{
                    res.status(500).send("User doesn't exist.");
                }
            });

            db.close();
        } catch(err) {
            res.status(500).send("Token invalid");
        }
    }else
    {
        res.sendStatus(403);
    }

});

app.get("/drugs/:drugID", (req, res, next) => {
    let bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== "undefined"){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        try {
            let decoded = jwt.verify(bearerToken, 'mediately');
            let drugId = req.params.drugID;
            let sql = "SELECT * FROM drugs WHERE ID = ? PUBLISHED = 1 AND CONFIRMED = 1";
            if(decoded.admin === "1"){
                sql = "SELECT * FROM drugs WHERE ID = ?";
            }
            let db = new sqlite3.Database('database.db');
            db.all(sql, [drugId], (err, rows) => {
                if (err) {
                    res.status(400).json({"error":err.message});
                    return;
                }
                if(rows.length > 0){
                    res.json({
                        rows
                    })
                }else{
                    res.status(500).send("Drug not available.");
                }
            });

            db.close();
        } catch(err) {
            res.status(500).send("Token invalid");
        }
    }else
    {
        res.sendStatus(403);
    }

});

app.post('/tools/:toolID', function(req, res) {
    let bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== "undefined"){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        try {
            let decoded = jwt.verify(bearerToken, 'mediately');
            if(req.params.toolID !== "BMI"){
                res.status(500).send("Tool not found.");
            }else{
                let height = req.body.height;
                let weight = req.body.weight;
                let BMI = weight/Math.pow(height, 2);
                res.status(200).send(BMI.toFixed(1).toString());
            }
        } catch(err) {
            res.status(500).send("Token invalid");
        }
    }else
    {
        res.sendStatus(403);
    }

});

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
