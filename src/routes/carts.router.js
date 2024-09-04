import { Router } from "express";
import { cartManager } from "../app.js";
import { v4 as uuidv4 } from 'uuid';

const cartsRouter = Router();

cartsRouter.post('/', async (req, res) => {
    try {
        const existingCart = await cartManager.getCart(req.body.id);
        if (existingCart) {
            res.status(400).send('Carrito ya existe');
        } else {
            const newCartId = uuidv4();
            const response = await cartManager.newCart(newCartId);
            res.status(201).json({ id: newCartId, ...response });
        }
    } catch (error) {
        res.status(500).send('Error al crear carrito');
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        if (!cid || cid.length === 0) {
            res.status(400).send('Parámetro cid inválido');
        } else {
        const response = await cartManager.getCartProducts(cid);
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).send('Carrito no encontrado');
        }
        }
    } catch (error) {
        res.status(500).send('Error al intentar enviar los productos del carrito');
    }
});

cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const existingProduct = await cartManager.getProductFromCart(cid, pid);
        if (existingProduct) {
        res.status(400).send('Producto ya existe en el carrito');
        } else {
        await cartManager.addProductToCart(cid, pid);
        res.status(200).send('Producto agregado al carrito');
        }
    } catch (error) {
        res.status(404).send('Error al agregar producto al carrito');
    }
});

export { cartsRouter };