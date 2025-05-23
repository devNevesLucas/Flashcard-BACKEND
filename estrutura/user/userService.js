const conexaoBanco = require('../../conexao')

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


async function inserirUsuario(dadosUsuario) {

    if (dadosUsuario == undefined) return false;

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
        dadosUsuario.senha,
        0,
        0,
        1
    ]

    const conexao = await conexaoBanco.iniciarConexao();

    await conexao.execute(query, dadosInsercao);
    
    await conexao.end();

    return true;
}

module.exports = {
    obterUsuario,
    inserirUsuario
}

