// ************ Require's ************

const express = require('express');
const router = express.Router();
const multer = require('multer'); // requerimos multer, un middleware de Express, para manipular archivos que suben los usuarios.
const path = require('path');


// ************ Controller Require ************

const productsController = require('../controllers/productsController');

// ************ Multer Configure ************

const storage = multer.diskStorage({ //.diskStorage opción de multer para almacenar archivos en el disco
  destination: function (req, file, cb) {
    const folder = path.resolve(__dirname, '../../public/images/products') //ruta de destino de la carpeta de las imágenes.
    cb(null, folder)
  },
  filename: function (req, file, cb) {
    const imageName = Date.now() + path.extname (file.originalname); // codificación del nombre del archivo
    cb(null, imageName)
  }
})

const upload = multer({ storage: storage })



/*** GET ALL PRODUCTS ***/ 
router.get('/', productsController.index); //muestro formulario para crear producto, prefijo /productos se encuentra en el entry point.


/*** CREATE ONE PRODUCT ***/ 
router.get('/create', productsController.create); //muestra el formulario de creación de producto.
router.post('/', upload.single('image'), productsController.store); //recibe info de formulario de creación de producto y va a hacer algo con estos datos (guarda en base de datos).
// up.load.single es variable de ejecución de storage, config pedir UN ARCHIVO .single / "image" es el name del input del form.

/*** GET ONE PRODUCT ***/ 
router.get('/:id/', productsController.detail); //Muestra vista de detalle de producto
// router.put('/:id', productController.detail); // Modifica el producto detalle de producto


/*** EDIT ONE PRODUCT ***/ 
router.get('/edit/:id/', productsController.edit); 
router.put('/:id', upload.single('image'), productsController.update); //usamos put porque estamos modificando un dato.


/*** DELETE ONE PRODUCT***/ 
router.delete('/:id', upload.single('image'), productsController.destroy); 


module.exports = router;