const conexaoBanco = require('../../conexao')
const bcrypt = require('bcrypt');
const authMidleware = require('../../authMiddleware.js');

async function obterUsuario(idUser)  {

    const conexao = await conexaoBanco.iniciarConexao();

    const query = `
        SELECT 
            codigo_usuario, 
            nome_usuario,
            email_usuario,
            permissoes_usuario,
            pontuacao_usuario,
            nivel_usuario
        FROM Usuario
        WHERE codigo_usuario = ?
    `;

    const [rows, fields] = await conexao.execute(query, [idUser]);
    
    conexao.end();

    return await rows;
}

async function verificarLogin(dadosUser) {

    const conexao = await conexaoBanco.iniciarConexao();

    const query = `
        SELECT 
            Us.codigo_usuario, 
            nome_usuario,
            email_usuario,
            senha_usuario,
            permissoes_usuario,
            pontuacao_usuario,
            nivel_usuario,
            UsLo.contagem_dias_log,
            UsLo.ultimo_login
        FROM Usuario AS Us
        INNER JOIN Usuario_Log AS UsLo
            ON Us.codigo_usuario =  UsLo.codigo_usuario
        WHERE email_usuario = ?
    `

    const [rows, fields] = await conexao.execute(query, [dadosUser.email]);

    if (rows.length == 0)
        throw("email ou senha invalidos");

    if (!(await bcrypt.compare(dadosUser.senha, rows[0].senha_usuario)))
        throw("email ou senha invalidos");

    conexao.end();

    const retorno = {
        usuario: {
            nome_usuario: rows[0].nome_usuario,
            pontuacao_usuario: rows[0].pontuacao_usuario,
            nivel_usuario: rows[0].nivel_usuario,
            contagem_dias_log: rows[0].contagem_dias_log,
            ultimo_login: rows[0].ultimo_login
        },
        token: authMidleware.gerarJWT({
            email_usuario: rows[0].email_usuario,
            codigo_usuario: rows[0].codigo_usuario,
            permissoes_usuario: rows[0].permissoes_usuario
        })
    };

    return retorno;
}

async function inserirUsuario(dadosUsuario) {

    if (dadosUsuario == undefined) return false;

    const senhaHash = await bcrypt.hash(dadosUsuario.senha, 10);

    let query = `
        INSERT INTO Usuario (
            nome_usuario, 
            email_usuario,
            senha_usuario,
            permissoes_usuario,
            pontuacao_usuario,
            nivel_usuario
        )
        VALUES
        (
            ?, ?, ?, ?, ?, ?
        )
    `;

    let dadosInsercao = 
    [
        dadosUsuario.nome,
        dadosUsuario.email,
        senhaHash,
        0,
        0,
        1
    ]

    let queryLog = `
        INSERT INTO Usuario_Log 
            (codigo_usuario, contagem_dias_log, ultimo_login)
        VALUES 
            (?, 0, CURDATE())
    `;

    const conexao = await conexaoBanco.iniciarConexao();

    const resultado = await conexao.execute(query, dadosInsercao);

    await conexao.execute(queryLog, [resultado[0].insertId]);

    await conexao.end();

    let dataAtual = new Date();

    const retorno = {
        usuario: {
            nome_usuario: dadosUsuario.nome,
            pontuacao_usuario: 0,
            codigo_usuario: resultado[0].insertId,
            nivel_usuario: 1,
            contagem_dias_log: 0,
            ultimo_login: new Date(dataAtual.getFullYear, dataAtual.getMonth, dataAtual.getDay)
        },
        token: authMidleware.gerarJWT({
            email_usuario: dadosUsuario.email,
            codigo_usuario: resultado[0].insertId,
            permissoes_usuario: 0
        })
    };

    return retorno;
}

module.exports = {
    obterUsuario,
    inserirUsuario,
    verificarLogin
}

