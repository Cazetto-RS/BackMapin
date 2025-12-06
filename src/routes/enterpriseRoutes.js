import {Router} from 'express';
import * as EnterpriseController from '../controllers/enterpriseControllers.js';
import autenticar from '../middleware/authentication.js';

const router = Router();

router.get('/',autenticar, EnterpriseController.getAllEnterprise);
router.get('/:id',autenticar, EnterpriseController.getById);
router.get('/cnpj/:cnpj',autenticar, EnterpriseController.getByCnpj);
router.post('/', EnterpriseController.createUsers);
router.delete('/:id',autenticar, EnterpriseController.deleteEnterprise);
router.post('/login', EnterpriseController.login);

export default router;