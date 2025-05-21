// Importar as bibliotecas necessárias
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require(sqlite3).verbose(); //banco sqlite


//criando o servidor
const app = express(); 


//configura o servidor
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./tarefas.db', (err) => 
    {
        if (err) {
            console.error("Erro ao conectar ao Sqlite:", err);
        } else {
            console.error("Conectado ao Sqlite:");
        }
    }
);

//criando tabelas
db.serialize(() => {
    db.run(
        'CREATE TABLE IF NOT EXISTS usuarios(id INTEGER PRIMART KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL)'
    );
    db.run(
        'CREATE TABLE IF NOT EXISTS tarefas (id INTERGER PRIMARY KEY AUTOINCREMENT, titulo TEXT NOT NULL, userId INTERGER NOT NULL, FOREIGN KEY (userId) REFERENCES usuarios(id))'
    );    
});


//definir uma rota pra teste
app.get('/api/teste', (req, res) => {
    res.json({ message: 'Backend funcionando e conectado'})
});

//Definir a porta ao servidor
const PORT = 3001;

//INICIAR O SERVIDOR
app.listen(PORT, () => {
    console.log('Servidor rodando na porta 3001. Acesse localhost://3001')
});


//fechando banco de dados ao encerrar o servidor
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Erro ao fechar o SQlite', err);
        } else {
            console.log('SQlite fechado');
            process.exit(0);
        }
    });
});

