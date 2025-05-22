const fs = require('fs');
const path = require('path')
const mysql = require('mysql2');

let configuracoes;

function carregarDadosConexao() {

    if (configuracoes != undefined) return configuracoes;

    const jsonPath = path.join(__dirname, "mysql.json");
    const dados = fs.readFileSync(jsonPath);

    configuracoes = JSON.parse(dados);

    return configuracoes

}

function iniciarConexao() {

    let dados = carregarDadosConexao();

    let conexao = mysql.createConnection({
        host: dados.Server,
        port: dados.Port,
        user: dados.Uid,
        password: dados.PwD,
        database: dados.Database
    })

    return conexao;
}

module.exports = {
    iniciarConexao
}