const conexaoBanco = require('../../conexao');

const definirMetaDiaria = (qtdCartas) => {

    if (qtdCartas == 0) return 0;

    let meta = Math.floor(qtdCartas / 2);

    if (meta > 1) {
        let adicional = Math.floor(Math.random() * (meta - 1));
            meta += adicional;
    }

    return meta;
}

async function inserirDeck(body, user) {

    let queryDeck = `
        INSERT INTO Deck (
            nome_deck, 
            cor_deck, 
            data_criacao_deck
        )
        VALUES (?, ?, CURDATE());
    `

    let dadosDeck = [
        body.nome_deck, 
        body.cor_deck
    ]

    if (!body.nome_deck || !body.cor_deck) return false;

    let queryDeckUsuario = `
        INSERT INTO Usuario_Deck (
            codigo_usuario,
            codigo_deck
        ) 
        VALUES (?, ?);
    `

    const conexao = await conexaoBanco.iniciarConexao();

    const resultadoDeck = await conexao.execute(queryDeck, dadosDeck);

    let dadosDeckUsuario = [
        user.codigo_usuario,
        resultadoDeck[0].insertId
    ];

    await conexao.execute(queryDeckUsuario, dadosDeckUsuario);

    await conexao.end();

    return true;
}

async function obterDeck(codigoDeck) {

    const queryDeck = `
        WITH UltimoLog AS (
            SELECT codigo_usuario_deck_log 
            FROM Flashcard.Usuario_Deck_Log
            WHERE codigo_usuario_deck IN (
                SELECT codigo_usuario_deck 
                FROM Usuario_Deck 
                WHERE codigo_deck = ?
        )
        ORDER BY data_conclusao
        LIMIT 1
        )
        SELECT 
            De.codigo_deck, 
            De.nome_deck, 
            De.cor_deck,
            DATE_FORMAT(De.data_criacao_deck, '%d/%m/%y') AS data_criacao_deck,
            (
                SELECT COUNT(*)
                FROM Pergunta_Deck AS PeDe
                WHERE PeDe.codigo_deck = De.codigo_deck
            ) AS perguntas,
            CASE 
            WHEN UsDeLo.data_conclusao IS NOT NULL
                THEN DATE_FORMAT(UsDeLo.data_conclusao, '%d/%m/%y')
            ELSE UsDeLo.data_conclusao 
            END AS conclusao_recente,
            IFNULL(UsDeLo.qtd_acertos, 0) AS 'qtd_acertos'
        FROM Flashcard.Deck AS De
        INNER JOIN Flashcard.Usuario_Deck AS UsDe
            ON De.codigo_deck = UsDe.codigo_deck
        LEFT JOIN Usuario_Deck_Log AS UsDeLo
            ON UsDeLo.codigo_usuario_deck_log = (SELECT codigo_usuario_deck_log FROM UltimoLog)
        WHERE De.codigo_deck = ?
        LIMIT 1
    `;

    const conexao = await conexaoBanco.iniciarConexao();

    const [resultado, fields] = await conexao.execute(queryDeck, [codigoDeck, codigoDeck]);

    const resultadoTratado = resultado.map((linha) => ({
        codigo_deck: linha.codigo_deck,
        nome_deck: linha.nome_deck,
        cor_deck: linha.cor_deck,
        qtd_deck: linha.perguntas,
        meta_deck: definirMetaDiaria(linha.perguntas),
        criacao_deck: linha.data_criacao_deck,
        ultimo_estudo_deck: linha.conclusao_recente,
        qtd_acertos_deck: linha.qtd_acertos
    }));

    await conexao.end();

    return resultadoTratado;
}

async function obterDecks(user) {

    let queryDecks = `
        SELECT 
            De.codigo_deck, 
            De.nome_deck, 
            De.cor_deck, 
            COUNT(PeDe.codigo_pergunta_deck) AS perguntas 
        FROM Flashcard.Deck AS De
        INNER JOIN Flashcard.Usuario_Deck AS UsDe
            ON De.codigo_deck = UsDe.codigo_deck
        LEFT JOIN Pergunta_Deck AS PeDe
            ON De.codigo_deck = PeDe.codigo_deck
        LEFT JOIN Usuario_Deck_Log AS UsDeLo
            ON UsDe.codigo_usuario_deck = UsDeLo.codigo_usuario_deck
        WHERE UsDe.codigo_usuario = ?
        GROUP BY De.codigo_deck, De.nome_deck, De.cor_deck
        LIMIT 100
    `;

    const conexao = await conexaoBanco.iniciarConexao();

    const [resultadoBruto, fields] = await conexao.execute(queryDecks, [user.codigo_usuario]);

    const resultadoTratado = resultadoBruto.map((linha) => ({
        codigo_deck: linha.codigo_deck,
        nome_deck: linha.nome_deck,
        cor_deck: linha.cor_deck,
        qtd_deck: linha.perguntas,
        meta_deck: definirMetaDiaria(linha.perguntas)
    }))

    return resultadoTratado;
}

async function removerDeck(codigoDeck) {

    const query = "DELETE FROM Deck WHERE codigo_deck = ?";

    const conexao = await conexaoBanco.iniciarConexao();

    const [resultadoRemocao, fields] = await conexao.execute(query, [codigoDeck]);

    await conexao.end();

    return true;
}

module.exports = {
    inserirDeck,
    obterDeck,
    obterDecks,
    removerDeck
}