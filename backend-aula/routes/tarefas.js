// Aula: Configurando rotas para CRUD de tarefas com autenticação JWT
// Objetivo: Criar, listar, atualizar e excluir tarefas no banco SQLite

// Importa o módulo Express para criar roteadores
const express = require('express');
// Importa o jsonwebtoken para verificar tokens JWT
const jwt = require('jsonwebtoken');

// Cria uma instância do roteador Express
const router = express.Router();
// Define a chave secreta para verificar tokens JWT
const JWT_SECRET = 'chave-secreta-super-segura';

// Middleware para verificar o token JWT
const authenticateToken = (req, res, next) => {
    // Extrai o cabeçalho Authorization
    const authHeader = req.headers['authorization'];
    // Extrai o token (formato: Bearer <token>)
    const token = authHeader && authHeader.split(' ')[1];
    // Verifica se o token foi fornecido
    if (!token) {
        // Retorna erro 401 se token ausente
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }
    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, JWT_SECRET);
        // Adiciona o userId ao objeto req
        req.user = decoded;
        // Chama o próximo middleware
        next();
    } catch (err) {
        // Retorna erro 403 se token inválido
        return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }
};

// Exporta uma função que recebe a conexão do banco
module.exports = (db) => {
    // Rota POST para criar uma tarefa
    router.post('/', authenticateToken, (req, res) => {
        // Extrai o título do corpo da requisição
        const { titulo } = req.body;
        // Extrai o userId do token
        const userId = req.user.userId;
        // Verifica se o título foi fornecido
        if (!titulo) {
            // Retorna erro 400
            return res.status(400).json({ message: 'O título da tarefa é obrigatório' });
        }
        // Insere a tarefa no banco
        db.run('INSERT INTO tarefas (titulo, userId) VALUES (?, ?)', [titulo, userId], function (err) {
            // Verifica se houve erro
            if (err) {
                // Loga o erro
                console.error('Erro ao inserir tarefa:', err);
                // Retorna erro 500
                return res.status(500).json({ message: 'Erro ao inserir tarefa' });
            }
            // Retorna sucesso com ID da tarefa
            res.status(201).json({ message: 'Tarefa inserida com sucesso', tarefaId: this.lastID });
        });
    });

    // Rota GET para listar tarefas do usuário
    router.get('/', authenticateToken, (req, res) => {
        // Extrai o userId do token
        const userId = req.user.userId;
        // Consulta todas as tarefas do usuário
        db.all('SELECT * FROM tarefas WHERE userId = ?', [userId], (err, rows) => {
            // Verifica se houve erro
            if (err) {
                // Loga o erro
                console.error('Erro ao listar tarefas:', err);
                // Retorna erro 500
                return res.status(500).json({ message: 'Erro ao listar tarefas' });
            }
            // Retorna a lista de tarefas
            res.json({ tarefas: rows });
        });
    });

    // Rota PUT para atualizar uma tarefa
    router.put('/:id', authenticateToken, (req, res) => {
        // Extrai o ID da tarefa dos parâmetros
        const { id } = req.params;
        // Extrai o título do corpo da requisição
        const { titulo } = req.body;
        // Extrai o userId do token
        const userId = req.user.userId;
        // Verifica se o título foi fornecido
        if (!titulo) {
            // Retorna erro 400
            return res.status(400).json({ message: 'O título da tarefa é obrigatório' });
        }
        // Atualiza a tarefa no banco
        db.run('UPDATE tarefas SET titulo = ? WHERE id = ? AND userId = ?', [titulo, id, userId], function (err) {
            // Verifica se houve erro
            if (err) {
                // Loga o erro
                console.error('Erro ao atualizar tarefa:', err);
                // Retorna erro 500
                return res.status(500).json({ message: 'Erro ao atualizar tarefa' });
            }
            // Verifica se alguma tarefa foi atualizada
            if (this.changes === 0) {
                // Retorna erro 404
                return res.status(404).json({ message: 'Tarefa não encontrada ou não pertence ao usuário' });
            }
            // Retorna sucesso
            res.json({ message: 'Tarefa atualizada com sucesso' });
        });
    });

    // Rota DELETE para excluir uma tarefa
    router.delete('/:id', authenticateToken, (req, res) => {
        // Extrai o ID da tarefa dos parâmetros
        const { id } = req.params;
        // Extrai o userId do token
        const userId = req.user.userId;
        // Exclui a tarefa do banco
        db.run('DELETE FROM tarefas WHERE id = ? AND userId = ?', [id, userId], function (err) {
            // Verifica se houve erro
            if (err) {
                // Loga o erro
                console.error('Erro ao excluir tarefa:', err);
                // Retorna erro 500
                return res.status(500).json({ message: 'Erro ao excluir tarefa' });
            }
            // Verifica se alguma tarefa foi excluída
            if (this.changes === 0) {
                // Retorna erro 404
                return res.status(404).json({ message: 'Tarefa não encontrada ou não pertence ao usuário' });
            }
            // Retorna sucesso
            res.json({ message: 'Tarefa excluída com sucesso' });
        });
    });

    // Retorna o roteador configurado
    return router;
};