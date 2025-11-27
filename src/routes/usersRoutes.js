import {Router} from 'express';
import * as UsersController from '../controllers/usersControllers.js';

const router = Router();

router.get('/', UsersController.getAllUsers);
router.get('/:id', UsersController.getById);
router.get('/email/:email', UsersController.getByEmail);
router.post('/', UsersController.createUsers);
router.put('/:id', UsersController.updateUsers);
router.delete('/:id', UsersController.deleteUsers);
// router.post('/login', UsuarioCtrl.login);

export default router;