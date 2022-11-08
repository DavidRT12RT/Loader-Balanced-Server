require('dotenv').config()
//const app = express();
const port = process.env.PORT; //80
const proxy = require('express-http-proxy');
const app = require('express')();
const fs = require("fs");


//Pure functions!!!
const getServersFromJSON = () => {
	//Leer servidores registrados en el .json y iniciar sus clientes en 0
    const rawData = fs.readFileSync("servers.json");
    const servidores = JSON.parse(rawData);
	for(const property in servidores) servidores[property].clientes = 0
	return servidores;
}

const servidores = getServersFromJSON();

function selectWebServer(){
    //Ningun webserver registrado aun!
    if(Object.keys(servidores).length == 0) return reject("Ningun webfarm registrado aun!");

	//Buscar el servidor con menos clientes conectados y devolverse 
	let chosenServer = 0;
	for(let i=0; i<Object.keys(servidores).length; i++){
		if(servidores[i].clientes < servidores[chosenServer].clientes) chosenServer = i;
	}

	servidores[chosenServer].clientes += 1;
	console.log(servidores);
	return `${servidores[chosenServer].ip}:4000`;
}


app.get("/",proxy(selectWebServer,{
	proxyReqPathResolver:function (req,res) {
		return "/"
	}
}));

app.get("/home",proxy(selectWebServer,{
	proxyReqPathResolver:function (req,res) {
		return "/home"
	}
}));

app.get("/about",proxy(selectWebServer,{
	proxyReqPathResolver:function (req,res) {
		return "/about"
	}
}));

app.get("/contact",proxy(selectWebServer,{
	proxyReqPathResolver:function (req,res) {
		return "/contact"
	}
}));




app.listen(port,()=>{
	console.log(`Loader balancer running on port ${port}`);
});