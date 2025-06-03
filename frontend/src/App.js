// Aula: Configurando o componente principal com navegação
// Objetivo: Criar a estrutura do app com rotas para registro e login

// Importa o React para criar componentes
import React from 'react';
// Importa componentes de navegação
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// Importa os componentes
import Register from './components/Register';
import Login from './components/Login';
import Tarefas from './components/Tarefas';
// Importa os estilos
import './App.css';

// Define o componente App
function App() {
    // Renderiza o componente
    return (
        <Router>
            <div className="App">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container">
                        <Link className="navbar-brand" to="/">CRUD App</Link>
                        <div className="navbar-nav">
                            <Link className="nav-link" to="/register">Registrar</Link>
                            <Link className="nav-link" to="/login">Login</Link>
                            <Link className="nav-link" to="/tarefas">Tarefas</Link>
                        </div>
                    </div>
                </nav>
                <div className="container mt-4">
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/tarefas" element={<Tarefas />} />
                        <Route path="/" element={<h2>Bem-vindo ao CRUD!</h2>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

// Exporta o componente
export default App;