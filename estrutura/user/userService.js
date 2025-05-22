const conexaoBanco = require('../../conexao')
const mysql = require ('mysql2')

function obterUsuario(idUser) {

    let conexao = conexaoBanco.iniciarConexao();
    let dados;

    conexao.connect();

    conexao.query('SELECT 1', (error, result) => {

        console.log("Resultado: ", result)
        
        dados = result;
    })
    
    conexao.end();
}

module.exports = {
    obterUsuario
}

