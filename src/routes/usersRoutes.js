import {Router} from 'express';
import * as UsersController from '../controllers/usersControllers.js';
import autenticar from '../middleware/authentication.js';

import * as roleAuth from '../middleware/roleAuth.js';


const router = Router();

router.get('/', autenticar , roleAuth.isEnterpriseOrAdmin, UsersController.getAllUsers);
router.get('/:id', autenticar , roleAuth.isEnterpriseOrAdmin,  UsersController.getById);
router.get('/cpf/:cpf', autenticar , roleAuth.isEnterpriseOrAdmin,  UsersController.getByCpf);
router.post('/' , autenticar , roleAuth.isEnterpriseOrAdmin, UsersController.createUsers);
router.put('/:id', autenticar , roleAuth.isEnterpriseOrAdmin,  UsersController.updateUsers);
router.delete('/:id', autenticar , roleAuth.isEnterpriseOrAdmin,  UsersController.deleteUsers);
router.post('/login' , UsersController.login);

export default router;