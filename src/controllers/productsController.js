const { redirect } = require('express/lib/response');
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json'); //Guarda la ruta donde se encuentra el JSON como string.

function readDB(){ //Se hace una función que lea primero la base de datos, y se actualice antes de llamarla a los callbacks.
	let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8')); //trae el JSON stringificado, luego lo lee (fs), y lo parsea a objeto literal para poder trabajarlo
	return products.filter(product => product.show); //product.show por default YA ES TRUE
}

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); //Función para separar miles, retorna una string y no un número.

const controller = {
	// Root - Show all products
	index: (req, res) => {
			let products = readDB(); //trae array actualizado
			return res.render('products', {products, toThousand}) //renderizo vista products con productos del array
	},

	// Create - Form to create
	create: (req, res) => {
		return res.render('product-create-form')
	},

	
	// Create -  Method to store
	store: (req, res) => {
		let products = readDB();
		let productoNuevo = {
			id: products.length > 0 ? products[products.length-1].id + 1 : 1,
			//products[products.lenght-1] (último elemento del array) + 1
			name: req.body.name,
			price: req.body.price,
			discount: req.body.discount,
			category: req.body.category,
			description: req.body.description,
			image: req.file.filename // req.file atrapa el archivo y filename le da el nombre
		};
		
		products.push(productoNuevo); //adicionar al array de productos el producto nuevo
		
		let productosJSON = JSON.stringify(products, null, 2); // null.2 ordena el JSON
		fs.writeFileSync(productsFilePath, productosJSON);
		/* o sino :
		fs.writeFileSync(productsFilePath, JSON.stringify(products));
		*/
		return res.redirect('/products'); 	// Recibir datos de producto y cargarlos en el JSON
	
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let products = readDB();
		const id =req.params.id; //Recibo y guardo el parámetro ID desde la URL
		const product = products.find(product => product.id == id)   // Busco UN id en el array de objetos, por eso utilizo el método find y lo comparo id URL. Por usar => el retorno ya viene implícito.
		return res.render('detail',{product, toThousand}) // retorno objeto producto y la función toThousand para convertir el precio en enteros, pero AL FINAL CUANDO HAGA TODAS LAS OPERACIONES. Se podría retornar el precio... {product, toThousand, precio....}
	},
	
	// Update - Form to edit
	edit: (req, res) => {
		let products = readDB();
		//estamos mostrando el producto con la ID solicitada por el usuario
		const id = req.params.id;
		const product = products.find(product => product.id == id);
		return res.render('product-edit-form',{product}) // {products}, tengo que enviar la información del producto con la ID que solicitan para poder modificarla.
	},

	// Update - Method to update
	update: (req, res) => {
		let products = readDB();
		// Do the magic. Modificar un producto.
		products = products.map(product=> { // método que modifica el array de products mientras lo recorre.
			if(product.id==req.params.id){ // condición para verificar id
				product.name = req.body.name,
				product.price = req.body.price,
				product.discount = req.body.discount,
				product.category = req.body.category,
				product.description = req.body.description,
				product.image = req.file?.filename ?? "default-image.png" // 1er ? valida DOS condiciones (req.file (existe en array) y filename (si llego imagen)) si La condición se cumple en este caso si req.file tiene un filename. 2do ?? sino, "defaul.image".
			}
			return product // .map necesita un return para modificarse si cumple la condición o dejarlo igual.
		})
		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2)); //reescribo json
		return res.redirect('/products'); 
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
	// Do the magic
	const id = req.params.id;
	let products = readDB();
	//products = products.filter(product => product.id != id);//.filter crea un array que cumplan con todos los elementos de la condición, en este caso que tengan diferente id de la enviada desde la URL. DE BORRA DEL ARRAY
	products = products.map(product => {
		if (product.id == id){
			product.show = "false"
		}
		return product;
	});
	
	fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
	return res.redirect('/products');
	}
};

module.exports = controller;