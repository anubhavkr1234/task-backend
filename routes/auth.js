const router = require("express").Router();
const UserModel = require ('../models/User');
const bcrypt = require("bcrypt");
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());

router.post('/register', (req, res) => {
    const { email, password } = req.body;

    // Check if the email is already registered
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                res.json("Email already registered");
            } else {
                // Hash the password before saving it
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({ error: err });
                    } else {
                        // Replace plain password with hashed password
                        req.body.password = hash;
                        // Create user with hashed password
                        UserModel.create(req.body)
                            .then(log_reg_form => res.json(log_reg_form))
                            .catch(err => res.status(500).json({ error: err }));
                    }
                });
            }
        });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log({email,password})
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                console.log(user)
                // Compare hashed password with input password
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        res.status(500).json({ error: err });
                    } else if (result) {
                        const secretKey = process.env.SECRET_KEY;
                        const token = jwt.sign({ email }, secretKey);
                            res.json({ token });
                            console.log(token);
                    } else {
                        res.json("Wrong password");
                    }
                });
            } else {
                res.json("No records found!");
            }
        });
});

module.exports = router;