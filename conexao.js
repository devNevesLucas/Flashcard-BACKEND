const fs = require('fs');
const path = require('path')
const mysql = require('mysql2/promise');

let configuracoes;

function carregarDadosConexao() {

    if (configuracoes != undefined) return configuracoes;

    const jsonPath = path.join(__dirname, "mysql.json");
    const dados = fs.readFileSync(jsonPath);

    configuracoes = JSON.parse(dados);

    return configuracoes

}

async function iniciarConexao() {

    let dados = carregarDadosConexao();

    let conexao = await mysql.createConnection({
        host: dados.Server,
        port: dados.Port,
        user: dados.Uid,
        password: dados.PwD,
        database: dados.Database
    })

    return conexao;
}

async function iniciarPool() {
    
    let dados = carregarDadosConexao();

    let pool = await mysql.createPool({
        host: dados.Server,
        port: dados.Port,
        user: dados.Uid,
        password: dados.PwD,
        database: dados.Database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    })

    return pool;
}

module.exports = {
    iniciarConexao,
    iniciarPool
}