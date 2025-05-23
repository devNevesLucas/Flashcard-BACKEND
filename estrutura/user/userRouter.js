const express = require('express');
const router = express.Router();
const userService = require('./userService.js');

router.get("/obterUser/:id", async (req, res, next) => {

    try {
            
        return res.json( await userService.obterUsuario(req.params.id) );
    
    } catch (error) {
    
        console.error(`Erro ao obter usuario: ${error}`);
    
    }
})

router.post("/inserir", async (req, res, next) => {

    try {
        
        return res.json (await userService.inserirUsuario(req.body) );

    } catch (error) {

        console.error(`Erro ao inserir usuario: ${error}`);

    }

})

module.exports = router;