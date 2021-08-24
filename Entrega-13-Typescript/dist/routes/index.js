"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const path_1 = __importDefault(require("path"));
const { Products, arrayProducts } = require('../utils/classProducts');
const product = new Products();
const multer_1 = __importDefault(require("multer"));
const destinationFolder = 'public/uploads';
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = multer_1.default({ storage: storage });
router.get('/productos/vista', (req, res) => {
    const productsArray = product.getProducts(arrayProducts);
    res.render('main', { productsArray });
});
router.get('/productos/listar', (req, res) => {
    const products = product.getProducts(arrayProducts);
    if (products.length == 0) {
        res.status(404).json({
            error: 'No hay productos cargados.'
        });
    }
    else
        res.status(200).json({ data: products });
});
router.get('/productos/listar/:id', (req, res) => {
    const findProduct = product.getProduct(req.params.id, arrayProducts);
    if (!findProduct) {
        res.status(404).json({
            error: 'Producto no encontrado'
        });
    }
    else
        res.status(200).json({ msg: findProduct });
});
//Para que el metodo post funcione bien y no llegue el req.body vacio hay que colocar en los headers de postman la siguiente key and value: Content-Type: application/json
router.post('/productos/guardar', upload.single('thumbnail'), (req, res) => {
    if (!req.body.title || !req.body.price || !req.file || typeof req.body.title != 'string' || typeof parseInt(req.body.price) != 'number') {
        res.status(400).json({
            error: 'La informacion ingresada es incorrecta intenta nuevamente'
        });
    }
    else {
        let newProduct = product.saveProduct(req.body.title, req.body.price, req.file.filename, arrayProducts);
        //res.redirect('/')
        res.status(200).json({
            msg: 'Producto creado con exito'
        });
    }
});
router.put('/productos/actualizar/:id', (req, res) => {
    let productId = Number(req.params.id);
    const positionProduct = arrayProducts.map((aProduct) => aProduct.id).indexOf(productId);
    if (positionProduct == -1) {
        res.status(400).json({
            error: 'El producto que estas intentado actualizar no existe'
        });
    }
    else {
        const updatedResult = product.updateProduct(positionProduct, req.body);
        res.status(201).json({
            data: updatedResult
        });
    }
});
router.delete('/productos/borrar/:id', (req, res) => {
    if (req.params.id > arrayProducts.length) {
        res.status(400).json({
            error: 'El producto que estas intentando eliminar no existe'
        });
    }
    else {
        const productDelete = product.deleteProduct(req.params.id);
        res.json({
            msg: 'El producto fue eliminado con exito',
            data: productDelete
        });
    }
});
exports.default = router;
