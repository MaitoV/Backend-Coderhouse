const express = require('express');
const router = express.Router();
const path = require('path');
const {Products, arrayProducts }= require('../utils/classProducts');
const multer = require('multer');
const productsController = require('../controllers/products');
const productsOperations = require('../db/productsOperations');


const destinationFolder = 'public/uploads';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, destinationFolder)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({storage: storage})

//router.get('/productos/vista', productsController.getAll)

router.get('/productos/listar', productsController.getAll);

router.get('/productos/listar/:id', productsController.getByID);

//Para que el metodo post funcione bien y no llegue el req.body vacio hay que colocar en los headers de postman la siguiente key and value: Content-Type: application/json
router.post('/productos/guardar', upload.single('thumbnail'), productsController.saveNewProduct);

router.put('/productos/actualizar/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const updateResult = await productsOperations.updateProduct(parseInt(id), req.body);

        res.status(201).json({
            msg: 'Producto actualizado correctamente'
        })
    } catch (error){
        res.status(404).json({
            error: error
        })
    }
})

router.delete('/productos/borrar/:id', async (req, res) => {
   try {
    const {id} = req.params; 

    const productDelete = await productsOperations.delete(id);
     return res.json({
        msg: 'El producto fue eliminado con exito',
        data: productDelete
        }) 

    } catch (error) {
        res.status(404).json({
            error: error
        })
    }

})


module.exports = router;

