// Importar as bibliotecas necessárias
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Corrigido o nome do módulo

const router = express.Router();
const JWT_SECRET = 'chave-secreta-super-segura'; // Chave secreta 

// Função para configurar o roteador com a conexão do banco de dados
module.exports = (db) => {
    // Rota para cadastro de usuário
    router.post('/registro', (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        }

        // Verifica se o email já existe
        db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, usuario) => {
            if (err) {
                return res.status(500).json({ message: 'Erro no servidor' });
            }
            if (usuario) {
                return res.status(400).json({ message: 'Este email já está cadastrado' });
            }

            // Criptografa a senha
            const hashedPassword = bcrypt.hashSync(password, 10);

            // Insere o usuário
            db.run('INSERT INTO usuarios (email, password) VALUES (?, ?)', [email, hashedPassword], function (err) {
                if (err) {
                    return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
                }
                res.status(201).json({ message: 'Cadastrado com sucesso', userId: this.lastID });
            });
        });
    });

    // Rota para login
    router.post('/login', (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        }

        // Verifica se o email existe
        db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, usuario) => {
            if (err) {
                return res.status(500).json({ message: 'Erro no servidor' });
            }
            if (!usuario) {
                return res.status(401).json({ message: 'Email ou senha incorretos' });
            }

            // Verifica a senha
            if (!bcrypt.compareSync(password, usuario.password)) {
                return res.status(401).json({ message: 'Email ou senha incorretos' });
            }

            // Cria o token JWT
            const token = jwt.sign({ userId: usuario.id }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'Login bem-sucedido', token, userId: usuario.id });
        });
    });

    return router;
};