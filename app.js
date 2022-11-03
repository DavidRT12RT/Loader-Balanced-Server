const express = require("express");
require('dotenv').config()
//const app = express();
const port = process.env.PORT; //80
const proxy = require('express-http-proxy');
const app = require('express')();



app.get("/home",proxy("192.168.100.20:4000/home",{
    forwardPath: function (req, res) {
      console.log("Llego peticion!");
      console.log("Redirigendo!");
      return '/home' 
    }
}));


app.get("/about",proxy("www.google.com",{
    forwardPath: function (req, res) {
      return '/' 
    }
}));

app.get("/contact",proxy("www.google.com",{
    forwardPath: function (req, res) {
      return '/' 
    }
}));


app.listen(port,()=>{
    console.log(`Loader balancer running on port ${port}`);
});