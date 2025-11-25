import express from 'express';
import db from '../database/index.js';
import ProductController from '../controllers/ProductController.js';
import ProductService from '../services/ProductService.js';
import { authenticate, authorize } from '../middlewares/AuthMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gerenciamento de produtos
 *
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - unitOfMeasurement
 *         - category
 *       properties:
 *         id:
 *           type: integer
 *           description: ID gerado automaticamente.
 *           example: 1
 *         name:
 *           type: string
 *           description: Nome do produto.
 *           example: "Arroz"
 *         unitOfMeasurement:
 *           type: string
 *           description: Unidade de medida (kg, unidade, litro, etc.).
 *           example: "kg"
 *         currentStock:
 *           type: number
 *           format: float
 *           description: Estoque atual do produto.
 *           example: 12.5
 *         category:
 *           type: string
 *           enum: [food, clothing, hygiene, others]
 *           description: Categoria do produto.
 *           example: "food"
 *
 *     ProductCreateInput:
 *       type: object
 *       required:
 *         - name
 *         - unitOfMeasurement
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           example: "Feijão"
 *         unitOfMeasurement:
 *           type: string
 *           example: "kg"
 *         currentStock:
 *           type: number
 *           example: 0
 *         category:
 *           type: string
 *           enum: [food, clothing, hygiene, others]
 *           example: "food"
 *
 *     ProductUpdateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         unitOfMeasurement:
 *           type: string
 *         currentStock:
 *           type: number
 *         category:
 *           type: string
 *           enum: [food, clothing, hygiene, others]
 */

const router = express.Router();

const productServiceInstance = new ProductService(db);
const productControllerInstance = new ProductController(productServiceInstance);

router.use(authenticate);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo Produto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreateInput'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autorizado.
 *       403:
 *         description: Acesso negado. Requer papel de admin ou manager.
 */
router.post(
  '/',
  authorize(['admin', 'manager']),
  productControllerInstance.create,
);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos os Produtos
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtra produtos por nome.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [food, clothing, hygiene, others]
 *         description: Filtra produtos por categoria.
 *     responses:
 *       200:
 *         description: Lista de produtos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Não autorizado.
 */
router.get('/', productControllerInstance.findAll);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retorna um Produto pelo ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do produto.
 *     responses:
 *       200:
 *         description: Detalhes do produto.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado.
 *       401:
 *         description: Não autorizado.
 */
router.get('/:id', productControllerInstance.findById);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza um Produto existente
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do produto a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdateInput'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Produto não encontrado.
 *       403:
 *         description: Acesso negado. Requer papel de admin ou manager.
 */
router.put(
  '/:id',
  authorize(['admin', 'manager']),
  productControllerInstance.update,
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove um Produto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do produto a ser removido.
 *     responses:
 *       204:
 *         description: Produto removido com sucesso.
 *       404:
 *         description: Produto não encontrado.
 *       403:
 *         description: Acesso negado. Requer papel de admin ou manager.
 */
router.delete(
  '/:id',
  authorize(['admin', 'manager']),
  productControllerInstance.delete,
);

export default router;
