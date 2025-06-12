import { useState, useEffect } from 'react';
import { getTarefas, addTarefa } from '../services/db';

function Tarefas() {
    const [tarefas, setTarefas] = useState([]);
    const [titulo, setTitulo] = useState('');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchTarefas = async () => {
            try {
                const tarefas = await getTarefas(userId);
                setTarefas(tarefas);
            } catch (error) {
                console.error('Erro ao carregar tarefas:', error);
            }
        };
        fetchTarefas();
    }, [userId]);

    const handleAddTarefa = async (e) => {
        e.preventDefault();
        try {
            await addTarefa(titulo, userId);
            const tarefas = await getTarefas(userId);
            setTarefas(tarefas);
            setTitulo('');
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
        }
    };

    //função excluir tarefa
    const handleExcluirTarefa = async (id) => {
        //confirmação de exclusão
        if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) {           
        try {
            await excluirTarefa(id, userId);
            // Atualiza a lista de tarefas após exclusão
            console.log('Tarefa excluída com sucesso');
            const tarefas = await getTarefas(userId);
            setTarefas(tarefas);
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
        }
         return;
        }
    };  

    return (
        <div class="container text center">
            <h2>Tarefas</h2>
            <form onSubmit={handleAddTarefa} class="form">
                <input
                    class="form-control"
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Nova tarefa"
                    required
                />
                <button type="submit"  class="btn btn-danger">Adicionar</button>
            </form>
            <ul>
                {tarefas.map((tarefa) => (
                    <li key={tarefa.id}>
                        {tarefa.titulo} 
                        <button onClick={() => handleExcluirTarefa(tarefa.id)} class="btn btn-danger">Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Tarefas;