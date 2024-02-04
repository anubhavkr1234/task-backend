const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const authRoute=require("./routes/auth");
const taskRoute=require("./routes/Task");
require('dotenv').config();

const DB=process.env.MONGODB_URI;

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(DB).then(()=>{
    console.log("Connection successful")
}).catch((err)=>{console.log("Connection error")})

app.use('/',authRoute);
app.use('/',taskRoute);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log("Server listining on http://127.0.0.1:3001");

});