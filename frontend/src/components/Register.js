// Aula: Criando o componente de registro
// Objetivo: Criar um formulário para registrar usuários via API

// Importa o React e useState para gerenciar estado
import React, { useState } from 'react';
// Importa o axios para fazer requisições HTTP
import axios from 'axios';

// Define o componente Register
const Register = () => {
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
            // Faz uma requisição POST para a rota de registro
            const response = await axios.post('http://localhost:3001/api/auth/registro', { email, password });
            // Define a mensagem de sucesso
            setMessage(`Sucesso: ${response.data.message} (ID: ${response.data.userId})`);
            // Limpa os campos
            setEmail('');
            setPassword('');
        } catch (error) {
            // Define a mensagem de erro
            setMessage(`Erro: ${error.response?.data?.message || 'Falha ao registrar'}`);
        }
    };

    // Renderiza o componente
    return (
        <div className="container mt-4">
            <h2 className="text-center">Registro</h2>
            {/* Exibe a mensagem de resposta */}
            {message && <div className="alert alert-info">{message}</div>}
            {/* Formulário de registro */}
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
                <button type="submit" className="btn btn-primary">Registrar</button>
            </form>
        </div>
    );
};

// Exporta o componente
export default Register;