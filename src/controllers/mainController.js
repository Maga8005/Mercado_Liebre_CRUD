const { header } = require('express/lib/request');
const fs = require('fs'); //Leer y parsear el JSON
const path = require('path'); //Traer el JSON

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');

function readDB(){ //Se hace una función que lea primero la base de datos, y se actualice antes de llamarla a los callbacks.
	let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8')); //trae el JSON stringificado, luego lo lee (fs), y lo parsea a objeto literal para poder trabajarlo
	return products = products.filter(product => product.show); //product.show por default YA ES TRUE
}

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		let products = readDB();
		const visited = products.filter(product => product.category == "visited"); // .filter, crea un nuevo array con los objetos que cumplan la condición.
		const inSale= products.filter(product => product.category == "in-sale");
		res.render('index',{visited, inSale, toThousand}); //muestro pagina inicial, y envío las constantes con los arrays filtrados y la función toThousand para mostrar precios con decimales.
	},
	search: (req, res) => {
		// Do the magic
	},
};

module.exports = controller;
