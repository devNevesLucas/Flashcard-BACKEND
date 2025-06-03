const express = require('express');
const router = express.Router();
const authMiddleware = require('../../authMiddleware.js');
const perguntaService = require('./perguntaService.js');

router.use(authMiddleware.verificarJWT);

router.put('/atualizar', async (req, res, next) => {
    try {
        
        return res.json( await perguntaService.atualizarPerguntas(req.body) );
    
    } catch (error) {

        console.error("Erro ao atualizar perguntas: ", error);

        return res.status(500).json({error: "Erro ao atualizar perguntas"});
    }
});

router.delete('/remover', async (req, res, next) => {

    try {

        return res.json( await perguntaService.excluirPerguntas(req.body) );

    } catch (error) {

        console.error("Erro ao remover perguntas: ", error);
    
        return res.status(500).json({error: "Erro ao remover perguntas"});
    }
})

router.post('/inserir', async (req, res, next) => {

    try {

        return res.json( await perguntaService.inserirPerguntas(req.body) );

    } catch (error) {

        console.error("Erro ao inserir perguntas: ", error);

        return res.status(500).json({error: "Erro ao inserir perguntas"});
    }
});

router.get('/listarTodas/:codigoDeck', async (req, res, next) => {

    try {

        return res.json ( await perguntaService.listarPerguntas(req.params.codigoDeck) );

    } catch (error) {

        console.error("Erro ao listar cards: ", error);

        return res.status(500).json({error: "Erro ao listar cards"});
    }

})

router.get('/listar/:codigoDeck/quantidade/:quantidadeCards', async (req, res, next) => {

    try {

        return res.json( await perguntaService.listarPerguntasQuestionario(req.params.codigoDeck, req.params.quantidadeCards) );

    } catch (error) {

        console.error("Erro ao listar cards do deck: ", error);

        return res.status(500).json({error: "Erro ao listar cards do deck"});
    }

})


module.exports = router;