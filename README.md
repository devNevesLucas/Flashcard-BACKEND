
# Flashcard - Back-end
#### API do Projeto Flashcard

Projeto montado em node JS, com o framework Express JS, conexão ao banco de dados em MySql e autenticação de usuários com JWT, como trabalho final da matéria de programação para dispositivos móveis


## Ideia do projeto

A ideia do aplicativo gira em torno de ser uma forma de estudo dinâmica para seus usuários. Para alcançar tal objetivo, foi criado essa API para que os dados possam ser consultados, tratados e armazenados.

Um script de criação das tabelas esta contido entre os arquivos do projeto, porém nem todas as suas tabelas são utilizadas devido a cortes de conteúdo necessários.

## O que foi implementado

- Criação e login de usuário
- Criação e exclusão de decks
- Criação, edição e remoção de cards (perguntas e alternativas)
- Estudo utilizando cards criados
- Autenticação e usuários com JWT

## Rodando o Projeto

O projeto foi montado com o intuito de ser uma API a ser consultada e que se conecta a um banco de dados externo em MySql e que possa fazer tal autenticação de usuários

Para a conexão com o banco, é necessária a existência de um arquivo chamado ```mysql.json``` na raiz do projeto, contendo os dados de conexão com o banco de dados.

E, além disso, é necessário, também na raiz do projeto, um arquivo chamado ```jwtsecret.json``` para que a chave secreta do JWT seja obtida. Sendo um item fundamental para a autenticação de usuários.

### Passos para iniciar aplicativo
```
npm install
```
e em seguida (já com os arquivos ```mysql.json``` e ```jwtsecret.json```)
```
npm nodemon index.js
```