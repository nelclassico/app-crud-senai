// Importar as bibliotecas necessárias
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();

app.use(cors());
app.use(bodyParser.json());


//definir uma rota pra teste
app.get('/api/teste', (req, res) => {
    res.json({ message: 'Backend funcionando e conectado'})
});

//Definir a porta ao servidor
const PORT = 3001;

//INICIAR O SERVIDOR
app.listen(PORT, () => {
    console.log('Servidor rodando na porta 3001. Acesse localhost://3001')
})

