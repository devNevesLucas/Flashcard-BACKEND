const conexaoBanco = require('../../conexao');

const ordenarCards = (linhas) => {
    
    if (linhas.length == 0) return [];

    const cardsMapeados = new Map();

    linhas.forEach(linha => {

        if(!cardsMapeados.has(linha.codigo_pergunta)) {
            cardsMapeados.set(linha.codigo_pergunta, {
                codigo_pergunta: linha.codigo_pergunta,
                enunciado_pergunta: linha.enunciado_pergunta,
                alternativas: []
            })
        }

        cardsMapeados.get(linha.codigo_pergunta).alternativas.push({
            codigo_alternativa: linha.codigo_alternativa,
            enunciado_alternativa: linha.enunciado_alternativa,
            correta: linha.is_correta_alternativa[0] == 1
        })
    });

    const cards = Array.from(cardsMapeados.values());

    return cards;
}

async function atualizarPerguntas(perguntasObj) {

    let queryPergunta = `
        UPDATE Pergunta 
        SET 
            enunciado_pergunta = ?
        WHERE 
            codigo_pergunta = ?
    `;

    let queryAlternativa = `
        UPDATE Alternativa
        SET
            enunciado_alternativa = ?,
            is_correta_alternativa = ?
        WHERE
            codigo_alternativa = ?
        `;

    const conexao = await conexaoBanco.iniciarConexao();

    try {

        for (const pergunta of perguntasObj) {

            await conexao.execute(queryPergunta, [pergunta.enunciado_pergunta, pergunta.codigo_pergunta]);

            if (pergunta.alternativas.length > 0) {
                for (const alternativa of pergunta.alternativas) {
                    await conexao.execute(queryAlternativa, [
                        alternativa.enunciado_alternativa,
                        alternativa.correta ? 1 : 0,
                        alternativa.codigo_alternativa
                    ])
                }
            }
        }

    } catch (error) {

        console.log(error);

    } finally {
        conexao.end();
    }

    return { message: "Perguntas e alternativas atualizadas com sucesso!" };

}

async function excluirPerguntas(codigosPerguntas) {

    if (codigosPerguntas.length == 0) return false;

    let queryRemocao = `
        DELETE FROM Pergunta WHERE codigo_pergunta IN (
    ` + '?, '.repeat(codigosPerguntas.length - 1) + '?)'

    const conexao = await conexaoBanco.iniciarConexao();

    const [resultado, fields] = await conexao.execute(queryRemocao, codigosPerguntas);

    await conexao.end();

    if (resultado.affectedRows) return true;
}


async function inserirPerguntas(perguntasObj) {

    const queryPergunta = "INSERT INTO Pergunta (enunciado_pergunta) VALUES (?)";
    const queryPerguntaDeck = "INSERT INTO Pergunta_Deck (codigo_deck, codigo_pergunta) VALUES (?, ?)"
    const queryAlternativa = `
        INSERT INTO Alternativa (
                enunciado_alternativa,
                is_correta_alternativa,
                codigo_pergunta
            )
            VALUES (?, ?, ?)`
        
    const conexao = await conexaoBanco.iniciarConexao();

    try {
        for (const pergunta of perguntasObj) {

            const [resultPergunta, fields] = await conexao.execute(queryPergunta, [pergunta.enunciado_pergunta]);

            const [resultPerguntaDeck] = await conexao.execute(
                                        queryPerguntaDeck, 
                                        [
                                            pergunta.codigo_deck,
                                            resultPergunta.insertId
                                        ]
                                    );
        
            if (pergunta.alternativas.length > 0) {    
                for (const alternativa of pergunta.alternativas) {
                    const [resultAlternativa] = await conexao.execute(queryAlternativa, 
                        [
                            alternativa.enunciado_alternativa,
                            alternativa.correta ? 1 : 0,
                            resultPergunta.insertId
                        ]);
                    }
            } 
        }
    } catch (error) {
    
        console.log(error);
        
    } finally {
        await conexao.end();
    }

    return { message: "Perguntas e alternativas inseridas com sucesso!" };
}

async function listarPerguntas(codigoDeck) {

    const query = `
        SELECT
            Al.codigo_pergunta,
            Pe.enunciado_pergunta,
            Al.codigo_alternativa,
            Al.enunciado_alternativa,
            Al.is_correta_alternativa
        FROM Flashcard.Alternativa AS Al
        INNER JOIN Pergunta AS Pe
            ON Al.codigo_pergunta = Pe.codigo_pergunta
        INNER JOIN Pergunta_Deck AS PeDe
            ON Pe.codigo_pergunta = PeDe.codigo_pergunta
        WHERE PeDe.codigo_deck = ?
        ORDER BY Al.codigo_pergunta
    `;

    const conexao = await conexaoBanco.iniciarConexao();

    const [linhas, fields] = await conexao.execute(query, [codigoDeck]);

    await conexao.end();

    const retornoOrdenado = ordenarCards(linhas);

    return retornoOrdenado;
}

module.exports = {
    atualizarPerguntas,
    excluirPerguntas,
    inserirPerguntas,
    listarPerguntas
}