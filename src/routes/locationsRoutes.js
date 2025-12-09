import {Router} from 'express';
import * as LocationsController from '../controllers/locationsControllers.js';

import autenticar from '../middleware/authentication.js';
import * as roleAuth from '../middleware/roleAuth.js';

const router = Router();

// rotas de leitura → só precisa estar autenticado
router.get('/', autenticar, LocationsController.getAllLocations);
router.get('/:id', autenticar, LocationsController.getById);
router.get('/name/:name', autenticar, LocationsController.getByFilter);

// rotas de escrita → precisa ser empresa ou admin
router.post('/', autenticar, roleAuth.isEnterpriseOrAdmin, LocationsController.createLocations);
router.put('/:id', autenticar, roleAuth.isEnterpriseOrAdmin, LocationsController.updateLocations);
router.delete('/:id', autenticar, roleAuth.isEnterpriseOrAdmin, LocationsController.deleteLocations);


export default router;