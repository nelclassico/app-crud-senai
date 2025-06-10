// Aula: Configurando o servidor Express com SQLite
// Objetivo: Criar o servidor, conectar ao banco e montar rotas

// Importa o módulo Express para criar o servidor web
const express = require('express');
// Importa o módulo CORS para permitir requisições de outros domínios (ex.: frontend)
const cors = require('cors');
// Importa o body-parser para processar corpos de requisições JSON
const bodyParser = require('body-parser');
// Importa o módulo sqlite3 para interagir com o banco SQLite
const sqlite3 = require('sqlite3').verbose();

// Cria uma instância do servidor Express
const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'capacitor://localhost', 'http://localhost'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configura o middleware CORS para permitir requisições do frontend (localhost:3000)
app.use(cors());
// Configura o middleware para processar requisições com corpo JSON
app.use(bodyParser.json());

// Conecta ao banco SQLite (arquivo 'tarefas.db')
const db = new sqlite3.Database('./tarefas.db', (err) => {
    // Verifica se houve erro na conexão
    if (err) {
        // Loga o erro no console
        console.error('Erro ao conectar ao SQLite:', err);
    } else {
        // Loga sucesso no console
        console.log('Conectado ao SQLite');
    }
});

// Importa os roteadores, passando a conexão do banco
const authRouter = require('./routes/auth')(db);
const tarefasRouter = require('./routes/tarefas')(db); // Adicionado para tarefas

// Executa comandos SQL em sequência para criar tabelas
db.serialize(() => {
    // Cria a tabela 'usuarios' se não existir
    db.run(
        'CREATE TABLE IF NOT EXISTS usuarios(id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL)',
        // id: chave primária auto-incrementada
        // email: texto único e obrigatório
        // password: texto obrigatório
        (err) => {
            // Verifica se houve erro
            if (err) {
                // Loga erro específico
                console.error('Erro ao criar tabela usuarios:', err);
            } else {
                // Loga sucesso
                console.log('Tabela usuarios criada ou já existe');
            }
        }
    );
    // Cria a tabela 'tarefas' se não existir
    db.run(
        'CREATE TABLE IF NOT EXISTS tarefas(id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT NOT NULL, userId INTEGER NOT NULL, FOREIGN KEY(userId) REFERENCES usuarios(id))',
        // id: chave primária auto-incrementada
        // titulo: texto obrigatório
        // userId: chave estrangeira referenciando usuarios
        (err) => {
            // Verifica se houve erro
            if (err) {
                // Loga erro específico
                console.error('Erro ao criar tabela tarefas:', err);
            } else {
                // Loga sucesso
                console.log('Tabela tarefas criada ou já existe');
            }
        }
    );
});

// Rota GET para a raiz do servidor
app.get('/', (req, res) => {
    // Retorna uma mensagem JSON de boas-vindas
    res.json({ message: 'Bem-vindo ao backend do CRUD! Acesse /api/teste, /api/auth ou /api/tarefas.' });
});

// Rota GET para teste do servidor
app.get('/api/teste', (req, res) => {
    // Retorna uma mensagem JSON confirmando que o backend está ativo
    res.json({ message: 'Backend funcionando e conectado' });
});

// Monta os roteadores nas respectivas rotas
app.use('/api/auth', authRouter);
app.use('/api/tarefas', tarefasRouter);

// Define a porta do servidor
const PORT = 3001;

// Inicia o servidor na porta especificada
const port = process.env.PORT || 3001;
app.listen(PORT, () => {
    // Loga mensagem de inicialização
    console.log(`Servidor rodando na porta ${PORT}. Acesse http://localhost:${PORT}`);
});

// Lida com o encerramento do servidor (ex.: Ctrl+C)
process.on('SIGINT', () => {
    // Fecha a conexão com o banco
    db.close((err) => {
        // Verifica se houve erro ao fechar
        if (err) {
            // Loga o erro
            console.error('Erro ao fechar o SQLite:', err);
        } else {
            // Loga sucesso e encerra o processo
            console.log('SQLite fechado');
            process.exit(0);
        }
    });
});