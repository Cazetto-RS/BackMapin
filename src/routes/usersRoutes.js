import {Router} from 'express';
import * as UsersController from '../controllers/usersControllers.js';
import autenticar from '../middleware/authentication.js';

const router = Router();

router.get('/', autenticar ,UsersController.getAllUsers);
router.get('/:id', autenticar , UsersController.getById);
router.get('/cpf/:cpf', autenticar , UsersController.getByCpf);
router.post('/' , UsersController.createUsers);
router.put('/:id', autenticar , UsersController.updateUsers);
router.delete('/:id', autenticar , UsersController.deleteUsers);
router.post('/login' , UsersController.login);

export default router;