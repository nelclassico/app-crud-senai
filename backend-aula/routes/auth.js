// Importar as bibliotecas necessárias
const express = require('express');
const bcrypt = require('bcryptjs'); //protege as senhas
const criachaves = require('jsonwebtoken'); //cria chaves
const sqlite3 = require('sqlite3').verbose(); //banco sqlite


//conecta ao bd
const db = new sqlite3.Database('./tarefas.db', (err) => 
    {
        if (err) {
            console.error("Erro ao conectar ao Sqlite:", err);
        } else {
            console.error("Conectado ao Sqlite:");
        }
    }
);

const router = express.Router(); //cria o roteador
const JWT_SECRET = 'chave-secreta-super-segura';//cria chave secreta


//rota para cadastro de usuário
router.post('/registro', (res, req) => 
{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: 'Email e senha são obrigatorios'});
    }
    //verifica se o email já existe
    db.get('SELECT * FROM WHERE email = ?', [email], (err, usuario) => {
        if(err){
            return res.status(500).json({message: 'Erro no servidor'});
        }
        if(row){
            return res.status(500).json({message: 'Este email já está cadastrado'});
        }
        //criptografa senha
        const hashedPassword = bcrypt.hashSync(password, 10)
        
        //insere usuário
        db.run('INSERT INTO usuarios (email, senha) VALUES (?, ?)', [email, hashedPassword], function (err){
          if(err){
                return res.status(500).json({message: 'Erro no servidor'});
            } 
          res.status(500).json({message: 'Cadastrado com sucesso'});
        });
    });
});

//ROTA PARA LOGIN
router.post('/login', (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: 'Email e senha são obrigatorios'});
    }
    //verifica se o email já existe
    db.get('SELECT * FROM WHERE email = ?', [email], (err, usuario) => {
        if(err){
            return res.status(500).json({message: 'Erro no servidor'});
        }
        if(!usuario || !bcrypt.compareSync(password, usuarios.password)){
            return res.status(401).json({message: 'Email ou senha incorretos'});
        }
        // cria token
        const token = jwt.sign({userId}, JWT_SECRET, { expiresIn: '1h'});
        res.json({message: 'Login bem sucedido', token, userId: usuarios.id});
    });
});

module.exports = router;