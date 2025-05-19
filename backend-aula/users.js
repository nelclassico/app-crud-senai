// Importar as bibliotecas necessárias
const express = require('express');
const router = express.Router(); // criar um mini servidor
const senha = require('bcryptjs');

let usuariosFakes = [];


// simulação de banco de dados
let tarefas = [];
let idAtualTarefa = 1; //gera id unico para tarefas






