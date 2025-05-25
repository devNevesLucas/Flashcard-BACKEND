CREATE DATABASE Flashcard;

USE Flashcard;

CREATE TABLE Permissao (
	codigo_permissao INT NOT NULL,
    descricao_permissao VARCHAR(100) NOT NULL
);

CREATE TABLE Usuario (
	codigo_usuario INT NOT NULL AUTO_INCREMENT,
	nome_usuario VARCHAR(200) NOT NULL,
	email_usuario VARCHAR(200) NOT NULL,
	senha_usuario VARCHAR(200) NOT NULL,
	permissoes_usuario INT NOT NULL,
	pontuacao_usuario INT NOT NULL,
	nivel_usuario INT NOT NULL,
	PRIMARY KEY (codigo_usuario)
);

CREATE TABLE Usuario_Log (
	codigo_usuario INT NOT NULL,
	contagem_dias_log INT NOT NULL,
	ultimo_login DATE NOT NULL,
	FOREIGN KEY (codigo_usuario) REFERENCES Usuario (codigo_usuario)
);

CREATE TABLE Materia (
	codigo_materia INT NOT NULL AUTO_INCREMENT,
	nome_materia VARCHAR(200) NOT NULL,
	PRIMARY KEY (codigo_materia)	
);

CREATE TABLE Grupo (
	codigo_grupo INT NOT NULL AUTO_INCREMENT,
	nome_grupo VARCHAR(200) NOT NULL,
	codigo_entrada VARCHAR(200),
	data_criacao_grupo DATETIME NOT NULL,
	PRIMARY KEY (codigo_grupo)
);

CREATE TABLE Deck (
	codigo_deck INT NOT NULL AUTO_INCREMENT,
	nome_deck VARCHAR(200) NOT NULL,
	data_criacao_deck DATETIME NOT NULL,
	PRIMARY KEY (codigo_deck)
);

CREATE TABLE Usuario_Deck (
	codigo_usuario_deck INT NOT NULL AUTO_INCREMENT,
	codigo_usuario INT NOT NULL,
	codigo_deck INT NOT NULL,
	PRIMARY KEY (codigo_usuario_deck),	
	FOREIGN KEY (codigo_usuario) REFERENCES Usuario (codigo_usuario),
	FOREIGN KEY (codigo_deck) REFERENCES Deck (codigo_deck)
);

CREATE TABLE Grupo_Deck (
	codigo_grupo_deck INT NOT NULL AUTO_INCREMENT,
	codigo_grupo INT NOT NULL,
	codigo_deck INT NOT NULL,
	PRIMARY KEY (codigo_grupo_deck),
	FOREIGN KEY (codigo_grupo) REFERENCES Grupo (codigo_grupo),
	FOREIGN KEY (codigo_deck) REFERENCES Deck (codigo_deck)
);

CREATE TABLE Materia_Deck (
	codigo_materia_deck INT NOT NULL AUTO_INCREMENT,
	codigo_materia INT NOT NULL,
	codigo_deck INT NOT NULL,
	PRIMARY KEY (codigo_materia_deck),
	FOREIGN KEY (codigo_materia) REFERENCES Materia (codigo_materia), 
	FOREIGN KEY (codigo_deck) REFERENCES Deck (codigo_deck)
);

CREATE TABLE Usuario_Grupo (
	codigo_usuario_grupo INT NOT NULL AUTO_INCREMENT,
	codigo_usuario INT NOT NULL,
	codigo_grupo INT NOT NULL,
	pontuacao_usuario INT NOT NULL,
	PRIMARY KEY (codigo_usuario_grupo),
	FOREIGN KEY (codigo_usuario) REFERENCES Usuario (codigo_usuario),
	FOREIGN KEY (codigo_grupo) REFERENCES Grupo (codigo_grupo)
);

CREATE TABLE Pergunta (
	codigo_pergunta INT NOT NULL AUTO_INCREMENT,
	enunciado_pergunta VARCHAR(200) NOT NULL,
	PRIMARY KEY (codigo_pergunta)
);

CREATE TABLE Pergunta_Deck (
	codigo_pergunta_deck INT NOT NULL AUTO_INCREMENT,
	codigo_pergunta INT NOT NULL,
	codigo_deck INT NOT NULL,
	PRIMARY KEY (codigo_pergunta_deck),
	FOREIGN KEY (codigo_pergunta) REFERENCES Pergunta (codigo_pergunta),
	FOREIGN KEY (codigo_deck) REFERENCES Deck (codigo_deck)
);

CREATE TABLE Alternativa (
	codigo_alternativa INT NOT NULL AUTO_INCREMENT,
	enunciado_alternativa VARCHAR(200) NOT NULL,
	is_correta_alternativa BIT NOT NULL,
	PRIMARY KEY (codigo_alternativa)
);

CREATE TABLE Pergunta_Alternativa (
	codigo_pergunta_alternativa INT NOT NULL AUTO_INCREMENT,
	codigo_pergunta INT NOT NULL,
	codigo_alternativa INT NOT NULL,
	PRIMARY KEY (codigo_pergunta_alternativa),
	FOREIGN KEY (codigo_pergunta) REFERENCES Pergunta (codigo_pergunta),
	FOREIGN KEY (codigo_alternativa) REFERENCES Alternativa (codigo_alternativa)
);


