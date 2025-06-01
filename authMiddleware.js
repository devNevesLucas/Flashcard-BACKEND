const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

let secret;

function obterSecret() {

    if (secret != undefined) return secret;

    const secretPath = path.join(__dirname, "jwtsecret.json");
    const dados = fs.readFileSync(secretPath);

    secret = JSON.parse(dados).Secret;

    return secret;
}

async function verificarJWT(req, res, next) {

    const header = req.headers.authorization;

    if (!header) 
        return res.status(401).send({ message: 'Token não encontrado' });

    const token = header.split(' ')[1];

    try {

        const decoded = jwt.verify(token, obterSecret());

        req.user = decoded;

        next();
    
    } catch (error) {

        console.error("Erro no middleWare: ", error);
        
        if (error.name == "TokenExpiredError")
            return res.status(401).send({ message: 'Token inválido ou expirado' });
    }
}

function gerarJWT(dados) {
    const tokenGerado = jwt.sign(dados, obterSecret(), { expiresIn: '3d' });
    return tokenGerado;
}

module.exports = {
    verificarJWT,
    gerarJWT
}