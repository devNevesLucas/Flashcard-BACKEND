const express = require('express');
const router = express.Router();
const authMiddleware = require('../../authMiddleware.js');
const deckService = require('./deckService.js');


router.use(authMiddleware.verificarJWT);

router.post('/inserir', async (req, res, next) => {
    
    try {

        return res.json(  await deckService.inserirDeck(req.body, req.user) );
        
    } catch (error) {
            
        console.error(`Erro ao inserir deck de usuário: ${error}`);
            
    }
});
            
            
router.get('/obterDeck/:codigo', async (req, res, next) => {
    
    try {

        return res.json ( await deckService.obterDeck(req.params.codigo) );

    } catch (error) {

        console.error(`Erro ao obter deck de usuário: ${error}`);
    }
    
})

router.get('/listarDecks', async (req, res, next) => {

    try {

        return res.json( await deckService.obterDecks(req.user) );

    } catch (error) {

        console.error(`Erro ao listar decks: ${error}`);

    }
    
})

module.exports = router;