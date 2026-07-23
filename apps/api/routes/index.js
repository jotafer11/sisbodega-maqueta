const { Router } = require('express');
const router = Router();

const { getGrupos, createGrupo, getGrupoById, deleteGrupo, updateGrupo } = require('../controllers/index.controller')

router.get('/grupos', getGrupos);
router.get('/grupos/:id', getGrupoById);
router.post('/grupos', createGrupo);
router.delete('/grupos/:id', deleteGrupo);
router.put('/grupos/:id', updateGrupo);

module.exports = router;