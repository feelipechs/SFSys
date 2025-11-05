import express from 'express';
import db from '../database/index.js';
import UserController from '../controllers/UserController.js';
import UserService from '../services/UserService.js';

const router = express.Router();

const { User } = db;

const userServiceInstance = new UserService(User);

const userControllerInstance = new UserController(userServiceInstance);

router.post('/', userControllerInstance.create);
router.get('/', userControllerInstance.findAll);
router.get('/:id', userControllerInstance.findById);
router.put('/:id', userControllerInstance.update);
router.delete('/:id', userControllerInstance.destroy);

export default router;
