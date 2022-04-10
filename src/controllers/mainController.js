const { header } = require('express/lib/request');
const fs = require('fs'); //Leer y parsear el JSON
const path = require('path'); //Traer el JSON

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		const visited = products.filter(product => product.category == "visited"); // .filter, crea un nuevo array con los objetos que cumplan la condición.
		const inSale= products.filter(product => product.category == "in-sale");
		res.render('index',{visited, inSale, toThousand}); //muestro pagina inicial, y envío las constantes con los arrays filtrados y la función toThousand para mostrar precios con decimales.
	},
	search: (req, res) => {
		// Do the magic
	},
};

module.exports = controller;
