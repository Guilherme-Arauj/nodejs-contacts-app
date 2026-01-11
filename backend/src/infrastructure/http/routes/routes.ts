import { Router } from 'express';
import { UserFactory } from '../../factories/UserFactory.js';

const userRouter = Router();
const userController = UserFactory();

//rota de cadastro de usuário
userRouter.post('/cadastro', (req, res) => userController.createUser(req, res));

//rota para login
userRouter.post('/login', (req, res) => userController.login(req, res));

export { userRouter };