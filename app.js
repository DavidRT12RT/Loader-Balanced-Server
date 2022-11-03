require('dotenv').config()
//const app = express();
const port = process.env.PORT; //80
const proxy = require('express-http-proxy');
const app = require('express')();
const fs = require("fs");


//Pure functions!!!


const getRandomNumber = (max) => {
    return Math.floor(Math.random() * max);
}


function selectHost(){
    const rawData = fs.readFileSync("servers.json");
    const servidores = JSON.parse(rawData);
    const serversLength = Object.keys(servidores).length;
    //Ningun webserver registrado aun!
    if( serversLength == 0) return reject("Ningun webfarm registrado aun!");
    const serverChoice = getRandomNumber(serversLength);
    const servidor = servidores[serverChoice];
	console.log(servidor.ip);
	return `${servidor.ip}:4000`;
}


app.get("/",proxy(selectHost,{
	proxyReqPathResolver:function (req,res) {
		return "/"
	}
}));

app.get("/home",proxy(selectHost,{
	proxyReqPathResolver:function (req,res) {
		return "/home"
	}
}));

app.get("/about",proxy(selectHost,{
	proxyReqPathResolver:function (req,res) {
		return "/about"
	}
}));

app.get("/contact",proxy(selectHost,{
	proxyReqPathResolver:function (req,res) {
		return "/contact"
	}
}));




app.listen(port,()=>{
	console.log(`Loader balancer running on port ${port}`);
});