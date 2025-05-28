// Aula: Configurando rotas de autenticação com SQLite e JWT
// Objetivo: Criar rotas para registro e login de usuários

// Importa o módulo Express para criar roteadores
const express = require('express');
// Importa o bcryptjs para criptografar senhas
const bcrypt = require('bcryptjs');
// Importa o jsonwebtoken para criar tokens JWT
const jwt = require('jsonwebtoken');

// Cria uma instância do roteador Express
const router = express.Router();
// Define a chave secreta para assinar tokens JWT (mude em produção!)
const JWT_SECRET = 'chave-secreta-super-segura';

// Exporta uma função que recebe a conexão do banco
module.exports = (db) => {
    // Rota para api/auth
    router.get('/', (req, res) =>{
         // Retorna mensagem orientando usar POST
        res.status(405).json({ message: 'Método não permitido. Use POST para /api/auth/login com JSON contendo email e password.' });
    });

    // Rota GET para /api/auth/login (para evitar erro no navegador)
    router.get('/login', (req, res) => {
        // Retorna mensagem orientando usar POST
        res.status(405).json({ message: 'Método não permitido. Use POST para /api/auth/login com JSON contendo email e password.' });
    });

    // Rota POST para registro de usuários
    router.post('/registro', (req, res) => {
        // Extrai email e senha do corpo da requisição
        const { email, password } = req.body;
        // Loga a tentativa de registro
        console.log(`Tentativa de registro com email: ${email}`);
        // Verifica se email e senha foram fornecidos
        if (!email || !password) {
            // Loga erro de validação
            console.log('Erro: Email ou senha não fornecidos');
            // Retorna erro 400
            return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        }

        // Verifica se o email já existe no banco
        db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, usuario) => {
            // Verifica se houve erro na consulta
            if (err) {
                // Loga o erro
                console.error('Erro ao consultar usuário:', err);
                // Retorna erro 500
                return res.status(500).json({ message: 'Erro no servidor' });
            }
            // Verifica se o email já está cadastrado
            if (usuario) {
                // Loga que o email existe
                console.log(`Email ${email} já cadastrado`);
                // Retorna erro 400
                return res.status(400).json({ message: 'Este email já está cadastrado' });
            }

            // Criptografa a senha com bcrypt (10 rodadas)
            const hashedPassword = bcrypt.hashSync(password, 10);
            // Loga sucesso na criptografia
            console.log('Senha criptografada com sucesso');

            // Insere o usuário no banco
            db.run('INSERT INTO usuarios (email, password) VALUES (?, ?)', [email, hashedPassword], function (err) {
                // Verifica se houve erro
                if (err) {
                    // Loga o erro
                    console.error('Erro ao inserir usuário:', err);
                    // Retorna erro 500
                    return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
                }
                // Loga sucesso
                console.log(`Usuário ${email} cadastrado com ID: ${this.lastID}`);
                // Retorna sucesso com ID do usuário
                res.status(201).json({ message: 'Cadastrado com sucesso', userId: this.lastID });
            });
        });
    });

    // Rota POST para login de usuários
    router.post('/login', (req, res) => {
        // Extrai email e senha do corpo da requisição
        const { email, password } = req.body;
        // Loga a tentativa de login
        console.log(`Tentativa de login com email: ${email}`);
        // Verifica se email e senha foram fornecidos
        if (!email || !password) {
            // Loga erro de validação
            console.log('Erro: Email ou senha não fornecidos');
            // Retorna erro 400
            return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        }

        // Verifica se o email existe no banco
        db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, usuario) => {
            // Verifica se houve erro na consulta
            if (err) {
                // Loga o erro
                console.error('Erro ao consultar usuário:', err);
                // Retorna erro 500
                return res.status(500).json({ message: 'Erro no servidor' });
            }
            // Verifica se o usuário não foi encontrado
            if (!usuario) {
                // Loga que o usuário não existe
                console.log(`Usuário com email ${email} não encontrado`);
                // Retorna erro 401
                return res.status(401).json({ message: 'Email ou senha incorretos' });
            }

            // Verifica se a senha está correta
            if (!bcrypt.compareSync(password, usuario.password)) {
                // Loga que a senha está errada
                console.log('Senha incorreta');
                // Retorna erro 401
                return res.status(401).json({ message: 'Email ou senha incorretos' });
            }

            // Cria um token JWT com o ID do usuário
            const token = jwt.sign({ userId: usuario.id }, JWT_SECRET, { expiresIn: '1h' });
            // Loga sucesso no login
            console.log(`Login bem-sucedido para ${email}, token gerado`);
            // Retorna sucesso com token e ID
            res.json({ message: 'Login bem-sucedido', token, userId: usuario.id });
        });
    });

    // Retorna o roteador configurado
    return router;
};