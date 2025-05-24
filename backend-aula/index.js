// Importar as bibliotecas necessárias
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose(); // banco sqlite


// Criando o servidor
const app = express();

// Configura o servidor
app.use(cors());
app.use(bodyParser.json());

// Conecta ao banco de dados
const db = new sqlite3.Database('./tarefas.db', (err) => {
    if (err) {
        console.error("Erro ao conectar ao SQLite:", err);
    } else {
        console.log("Conectado ao SQLite"); // Corrigido para console.log
    }
});

const authRouter = require('./routes/auth')(db);

// Criando tabelas
db.serialize(() => {
    db.run(
        'CREATE TABLE IF NOT EXISTS usuarios(id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL)',
        (err) => {
            if (err) console.error("Erro ao criar uma tabela"); 
            else console.error("Tabela usuários criada com sucesso");
        } 
    );
    db.run(
        'CREATE TABLE IF NOT EXISTS tarefas (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT NOT NULL, userId INTEGER NOT NULL, FOREIGN KEY (userId) REFERENCES usuarios(id))', 
        (err) => {
            if (err) console.error("Erro ao criar uma tabela"); 
            else console.error("Tabela tarefas criada com sucesso");
        } 
    );
});

// Rota padrão para a raiz
app.get('/', (req, res) => {
    res.json({ message: 'Bem-vindo ao backend do CRUD! Acesse /api/teste ou /api/auth para mais funcionalidades.' });
});

// Rota de teste
app.get('/api/teste', (req, res) => {
    res.json({ message: 'Backend funcionando e conectado' });
});

// Usar as rotas de autenticação
app.use('/api/auth', authRouter); // Corrigido o caminho

// Definir a porta do servidor
const PORT = 3001;

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}. Acesse http://localhost:${PORT}`);
});

// Fechando banco de dados ao encerrar o servidor
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Erro ao fechar o SQLite', err);
        } else {
            console.log('SQLite fechado');
            process.exit(0);
        }
    });
});