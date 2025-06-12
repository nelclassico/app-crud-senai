import { useState } from 'react';
import { cadastrar } from '../services/db';

function Cadastro() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [message, setMessage] = useState('');

    const handleCadastro = async (e) => {
        e.preventDefault();
        console.log('Tentando cadastro com:', { email, senha });
        try {
            await cadastrar(email, senha);
            setMessage('Sucesso: Usuário cadastrado');
        } catch (error) {
            console.error('Erro no cadastro:', error);
            setMessage(`Erro: ${error.message || 'Falha ao registrar'}`);
        }
    };

    return (
        <div class="container">
            <h2>Cadastro</h2>
            <form onSubmit={handleCadastro} class="form">
                <input
                    class="form-group"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    class="form-group"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Senha"
                    required
                />
                <button type="submit" class="btn btn-success">Cadastrar</button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default Cadastro;