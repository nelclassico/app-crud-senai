// Importando o React e os hooks necessários para gerenciar estado e efeitos
import React, { useState, useEffect } from 'react';
// Importando axios para fazer requisições HTTP ao backend
import axios from 'axios';
// Importando useNavigate para redirecionar o usuário
import { useNavigate } from 'react-router-dom';

// Definindo o componente funcional Tarefas
const Tarefas = () => {
    // Estado para armazenar a lista de tarefas
    const [tarefas, setTarefas] = useState([]);
    // Estado para o título da nova tarefa
    const [titulo, setTitulo] = useState('');
    // Estado para mensagens de feedback (sucesso ou erro)
    const [message, setMessage] = useState('');
    //Estado para o ID da tarefa sendo editada
    const [editando, setEditando] = useState('');
    // Estado para o título já editado
    const [tituloEditado, setTituloEditado] = useState('');
    // Hook de navegação para redirecionar
    const navigate = useNavigate();

    // Função para buscar as tarefas do usuário autenticado
    const fetchTarefas = async () => {
        try {
            // Obtendo o token do localStorage
            const token = localStorage.getItem('token');
            // Verificando se o token existe
            if (!token) {
                // Se não houver token, exibir mensagem e redirecionar para login
                setMessage('Erro: Você precisa estar logado para ver as tarefas');
                navigate('/login');
                return;
            }
            // Fazendo requisição GET para listar tarefas, incluindo o token no header
            const response = await axios.get('http://localhost:3001/api/tarefas', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Atualizando o estado com as tarefas retornadas
            setTarefas(response.data.tarefas);
        } catch (error) { // Corrigindo: garantindo que 'error' é o parâmetro
            // Capturando erros e exibindo mensagem
            setMessage(`Erro: ${error.response?.data?.message || 'Falha ao listar tarefas'}`);
            // Se o erro for de autenticação, redirecionar para login
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/login');
            }
        }
    };

    // Executando fetchTarefas quando o componente é montado
    useEffect(() => {
        fetchTarefas();
    }, []); // Array vazio garante que só executa uma vez

    // Função para criar uma nova tarefa
    const handleCreate = async (e) => {
        // Prevenindo o comportamento padrão do formulário
        e.preventDefault();
        try {
            // Obtendo o token
            const token = localStorage.getItem('token');
            // Verificando se o token existe
            if (!token) {
                setMessage('Erro: Você precisa estar logado');
                navigate('/login');
                return;
            }
            // Fazendo requisição POST para criar tarefa
            const response = await axios.post(
                'http://localhost:3001/api/tarefas',
                { titulo }, // Enviando o título da tarefa
                { headers: { Authorization: `Bearer ${token}` } } // Incluindo o token
            );
            // Exibindo mensagem de sucesso
            setMessage(`Sucesso: ${response.data.message} (ID: ${response.data.tarefaId})`);
            // Limpando o campo de título
            setTitulo('');
            // Atualizando a lista de tarefas
            fetchTarefas();
        } catch (error) { // Garantindo que 'error' está definido
            // Exibindo mensagem de erro
            setMessage(`Erro: ${error.response?.data?.message || 'Falha ao criar tarefa'}`);
        }
    };

    // Função para excluir uma tarefa
    const handleDelete = async (id) => {
        try {
            // Obtendo o token
            const token = localStorage.getItem('token');
            // Verificando se o token existe
            if (!token) {
                setMessage('Erro: Você precisa estar logado');
                navigate('/login');
                return;
            }
            // Fazendo requisição DELETE para excluir a tarefa
            const response = await axios.delete(`http://localhost:3001/api/tarefas/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Exibindo mensagem de sucesso
            setMessage(`Sucesso: ${response.data.message}`);
            // Atualizando a lista de tarefas
            fetchTarefas();
        } catch (error) { // Garantindo que 'error' está definido
            // Exibindo mensagem de erro
            setMessage(`Erro: ${error.response?.data?.message || 'Falha ao excluir tarefa'}`);
        }
    };

    //função para iniciar a edição de uma tarefa

    const handleEdit = (tarefa) => {
        //definindo o id da tarefa sendo editada
        setEditando(tarefa.id);
        //Preenchendo o título a ser editado
        setTituloEditado(tarefa.titulo);
    };

    const handleSaveEdit = async (id) => {
         try {
            // Obtendo o token
            const token = localStorage.getItem('token');
            // Verificando se o token existe
            if (!token) {
                setMessage('Erro: Você precisa estar logado');
                navigate('/login');
                return;
            }
            // Fazendo requisição PUT para editar a tarefa
            const response = await axios.put(`http://localhost:3001/api/tarefas/${id}`, {titulo: tituloEditado}, { headers: { Authorization: `Bearer ${token}` }
            });
            // Exibindo mensagem de sucesso
            setMessage(`Sucesso: ${response.data.message}`);
            //encerrando o módulo de editar
             setEditando(null);
             // limpando o título editado
             setTituloEditado('');
            // Atualizando a lista de tarefas
            fetchTarefas();
        } catch (error) { // Garantindo que 'error' está definido
            // Exibindo mensagem de erro
            setMessage(`Erro: ${error.response?.data?.message || 'Falha ao editar a tarefa'}`);
        }
    };

    //função para cancelar a edição
    const handleCancelEdit = () => {
        //encerrando o módulo de editar
        setEditando(null);
        // limpando o título editado
        setTituloEditado('');
    };


    // Renderizando o componente
    return (
        // Container principal com margem superior
        <div className="container mt-4">
            {/* Título da página */}
            <h2 className="text-center">Minhas Tarefas</h2>
            {/* Exibindo mensagem de feedback, se existir */}
            {message && <div className="alert alert-info">{message}</div>}
            {/* Formulário para criar nova tarefa */}
            <form onSubmit={handleCreate} className="mb-4">
                <div className="mb-3">
                    {/* Label para o campo de título */}
                    <label htmlFor="titulo" className="form-label">Título da Tarefa</label>
                    {/* Campo de entrada para o título */}
                    <input
                        type="text"
                        className="form-control"
                        id="titulo"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)} // Atualizando o estado
                        required // Campo obrigatório
                    />
                </div>
                {/* Botão para enviar o formulário */}
                <button type="submit" className="btn btn-primary">Criar Tarefa</button>
            </form>
            {/* Lista de tarefas */}
            <ul className="list-group">                
                {Array.isArray(tarefas) && tarefas.length > 0 ? (
                tarefas.map((tarefa) => tarefa.id ?(
                    // Item da lista com layout flexível
                    <li key={tarefa.id} className={"list-group-item d-flex justify-content-between align-items-center ${editando === tarefa.id ? 'editando' : ''}"}>
                        {editando === tarefa.id ? (
                            <div className='w-100'>
                                <input type='text' className='form-control mb-2' value={tituloEditado} onChange={(e) => setTituloEditado(e.target.value)} required/>
                                <button className='btn btn-success' onClick={() => handleSaveEdit(tarefa.id)}>Salvar</button>
                                <button className='btn btn-danger' onClick={() => handleCancelEdit(tarefa.id)}>Cancelar</button>
                            </div>                            
                        ) : (
                            <>
                            {tarefa.titulo || 'Título não disponível'}
                            <div>
                                <button className='btn btn-success' onClick={() => handleEdit(tarefa)}>Editar</button>
                                <button className="btn btn-danger btn-sm"  onClick={() => handleDelete(tarefa.id)} // Chamando handleDelete
                            > Excluir</button>
                            </div> 
                            </>                    
                         )} 
                    </li> 
                ) : null )) : (
                    <li className='list-group text-center'>Nenhuma tarefa disponível</li>
                )}  
            </ul>
        </div>
    );     

};

// Exportando o componente
export default Tarefas;