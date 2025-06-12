import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/db';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Tentando login com:', { email, senha });
        try {
            const user = await login(email, senha);
            console.log('Usuário logado:', user);
            localStorage.setItem('token', user.token);
            localStorage.setItem('userId', user.id);
            navigate('/tarefas');
            setMessage('Sucesso: Login bem-sucedido');
        } catch (error) {
            console.error('Erro no login:', error);
            setMessage(`Erro: ${error.message || 'Falha ao logar'}`);
        }
    };

    return (
        <div class="container">
            <h2>Login</h2>
            <form onSubmit={handleLogin} class="form">
                <input
                    class="form-control"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    class="form-control"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Senha"
                    required
                />
                <button type="submit" class="btn btn-success">Entrar</button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default Login;