import {Router} from 'express';
import * as CategorieController from '../controllers/categoriesControllers.js';

const router = Router();

router.get('/', CategorieController.getAllCategories);
router.get('/:id', CategorieController.getById);
router.get('/name/:name', CategorieController.getByName);
router.post('/', CategorieController.createCategories);
router.put('/:id', CategorieController.updateCategories);
router.delete('/:id', CategorieController.deleteCategories);
// router.post('/login', UsuarioCtrl.login);

export default router;