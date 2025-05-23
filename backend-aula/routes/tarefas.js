9const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = 'chave-secreta-super-segura'; // Chave secreta 

//Middleware para verificação de token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //Formato: Bearer

    if (!token){
        return res.status(401).json({ message: 'Acesso negado, Token não fornecido'});
    }

    try {
        // verificar e decodificar o token
        const decoded = jwt.verify(token, JWT_SECRET);
        //adici9ona o id decodificado
        req.user = decoded;
        // chama o proximo cabecalho
        next();
    } catch (err) {
        //retornar o erro caso o token fo r inválido
        return res.status(403).json({ message: 'Token Inválido ou expirado'});
    }
};

module.exports = (db) => {
    // Definir rota pra criar nova tarefa
    router.post('/', authenticateToken, (req, res) => {
        // Extraindo o título do corpo da requisição
        const { titulo } = req.body;
        //extrair o userid
        const userId = req.user.userId;

        //verifica se o título foi fornecido
        if (!titulo) {
            return res.status(400).json({ message: 'O título da tarefa é obrigatório'});
        }

        // Insere o usuário
        db.run('INSERT INTO tarefas (titulo, userId) VALUES (?, ?)', [titulo, userId], function (err) {
            if (err) {
                return res.status(500).json({ message: 'Erro ao inserir a tarefa' });
            }
            res.status(201).json({ message: 'Tarefa inserida com sucesso com sucesso', tarefaId: this.lastID });
        });
    });

    // rota para listar todas as tarefas
    router.get('/', authenticateToken, (req, res) => {
        //extrair o userid
        const userId = req.user.userId;

        db.all('SELECT * FROM tarefas WHERE userId = ?', [userId], (err, row) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao listar as tarefas' });
            }

            //retornar a lista de tarefas
            res.json({tarefas: row});
        });
    });

    router.put('/', authenticateToken, (req, res) => {
        //Extrair o id da tarefa dos paremetros
        const {id} = req.params;

        // Extraindo o título do corpo da requisição
        const { titulo } = req.body;

        //extrair o userid
        const userId = req.user.userId;

         //verifica se o título foi fornecido
        if (!titulo) {
            return res.status(400).json({ message: 'O título da tarefa é obrigatório'});
        }

        // Insere o usuário
        db.run('UPDATE tarefas SET titulo = ? WHERE id = ?', [titulo, id, userId], function (err) {
            //verifica se houve algum erro
            if (err) {
                return res.status(500).json({ message: 'Erro ao editar a tarefa' });
            }
            // verificar se a tarefa foi atualizada
            if (this.change === 0) {
                return res.status(404).json({ message: 'Tarefa não encontrada' });
            }
            res.json({ message: 'Tarefa atualziada com sucesso'});                   
        });
    });

    //DEFINE A ROTA PARA EXCLUIR TAREFAS
     router.delete('/', authenticateToken, (req, res) => {
        //Extrair o id da tarefa dos paremetros
        const {id} = req.params;

        //extrair o userid
        const userId = req.user.userId;

         // Insere o usuário
        db.run('DELETE FROM tarefas WHERE id = ? AND userId = ?', [id, userId], function (err) {
            //verifica se houve algum erro
            if (err) {
                return res.status(500).json({ message: 'Erro ao editar a tarefa' });
            }
            // verificar se a tarefa foi atualizada
            if (this.change === 0) {
                return res.status(404).json({ message: 'Tarefa não encontrada' });
            }
            res.json({ message: 'Tarefa deletada com sucesso'});                   
        });


     });
}