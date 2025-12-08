import {Router} from 'express';
import * as CategorieController from '../controllers/categoriesControllers.js';

import autenticar from '../middleware/authentication.js';
import * as roleAuth from '../middleware/roleAuth.js';

const router = Router();

// rotas de leitura → só precisa estar autenticado
router.get('/', autenticar, CategorieController.getAllCategories);
router.get('/:id', autenticar, CategorieController.getById);
router.get('/name/:name', autenticar, CategorieController.getByName);

// rotas de escrita → precisa ser empresa ou admin
router.post('/', autenticar, roleAuth.isEnterpriseOrAdmin, CategorieController.createCategories);
router.put('/:id', autenticar, roleAuth.isEnterpriseOrAdmin, CategorieController.updateCategories);
router.delete('/:id', autenticar, roleAuth.isEnterpriseOrAdmin, CategorieController.deleteCategories);


export default router;