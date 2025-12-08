import {Router} from 'express';
import * as ProductController from '../controllers/productsControllers.js';

import autenticar from '../middleware/authentication.js';
import * as roleAuth from '../middleware/roleAuth.js';

const router = Router();

// rotas de leitura → só precisa estar autenticado
router.get('/', autenticar, ProductController.getAllProducts);
router.get('/:id', autenticar, ProductController.getById);
router.get('/name/:name', autenticar, ProductController.getByName);

// rotas de escrita → precisa ser empresa ou admin
router.post('/', autenticar, roleAuth.isEnterpriseOrAdmin, ProductController.createProducts);
router.put('/:id', autenticar, roleAuth.isEnterpriseOrAdmin, ProductController.updateProducts);
router.delete('/:id', autenticar, roleAuth.isEnterpriseOrAdmin, ProductController.deleteProducts);


export default router;