const express = require('express');
const router = express.Router();
const authMiddleware = require('../../authMiddleware.js');
const perguntaService = require('./perguntaService.js');

router.use(authMiddleware.verificarJWT);

router.post('/atualizar', async (req, res, next) => {

    try {
        
        return res.json( await perguntaService.atualizarPerguntas(req.user, req.body) );
    
    } catch (error) {

        console.error("Erro ao atualizar perguntas: ", error);

    }

});

module.exports = router;