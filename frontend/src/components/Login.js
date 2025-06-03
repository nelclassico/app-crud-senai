// Aula: Criando o componente de login
// Objetivo: Criar um formulário para autenticar usuários via API

// Importa o React e useState para gerenciar estado
import React, { useState } from 'react';
// Importa o axios para fazer requisições HTTP
import axios from 'axios';

// Define o componente Login
const Login = () => {
    // Estado para o email
    const [email, setEmail] = useState('');
    // Estado para a senha
    const [password, setPassword] = useState('');
    // Estado para a mensagem de resposta
    const [message, setMessage] = useState('');

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e) => {
        // Impede o comportamento padrão do formulário
        e.preventDefault();
        try {
            // Faz uma requisição POST para a rota de login
            const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });
            // Armazena o token no localStorage
            localStorage.setItem('token', response.data.token);
            // Define a mensagem de sucesso
            setMessage(`Sucesso: ${response.data.message} (ID: ${response.data.userId})`);
            // Limpa os campos
            setEmail('');
            setPassword('');
        } catch (error) {
            // Define a mensagem de erro
            setMessage(`Erro: ${error.response?.data?.message || 'Falha ao logar'}`);
        }
    };

    // Renderiza o componente
    return (
        <div className="container mt-4">
            <h2 className="text-center">Login</h2>
            {/* Exibe a mensagem de resposta */}
            {message && <div className="alert alert-info">{message}</div>}
            {/* Formulário de login */}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Senha</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Logar</button>
            </form>
        </div>
    );
};

// Exporta o componente
export default Login;