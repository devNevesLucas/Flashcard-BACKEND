const express = require('express');
const router = express.Router();
const userService = require('./userService.js');

router.get("/obterUser/", (req, res, next) => {

    try {
    
        res.json(userService.obterUsuario(2));
    
    } catch (error) {
    
        console.error(`Erro ao obter usuario: ${error}`);
    
    }
})

module.exports = router;