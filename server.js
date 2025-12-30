const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ========== DADOS EM MEMÓRIA (simulando banco de dados) ==========

let pacientes = [
    { 
        id: 1, 
        codigo: '001', 
        nome: 'João Silva', 
        telefone: '(11) 99999-9999', 
        email: 'joao@email.com',
        endereco: 'Rua das Flores, 123',
        dataNascimento: '1980-05-15',
        observacoes: 'Paciente regular',
        totalRecebido: 1250.00,
        status: 'ativo',
        dataCadastro: '2024-01-01'
    },
    { 
        id: 2, 
        codigo: '002', 
        nome: 'Maria Santos', 
        telefone: '(11) 88888-8888', 
        email: 'maria@email.com',
        endereco: 'Av. Paulista, 456',
        dataNascimento: '1975-08-20',
        observacoes: 'Realiza exames periódicos',
        totalRecebido: 980.00,
        status: 'ativo',
        dataCadastro: '2024-01-02'
    },
    { 
        id: 3, 
        codigo: '003', 
        nome: 'Carlos Oliveira', 
        telefone: '(11) 77777-7777', 
        email: 'carlos@email.com',
        endereco: 'Rua Augusta, 789',
        dataNascimento: '1990-03-10',
        observacoes: 'Paciente novo',
        totalRecebido: 1520.00,
        status: 'ativo',
        dataCadastro: '2024-01-03'
    },
    { 
        id: 4, 
        codigo: '004', 
        nome: 'Ana Costa', 
        telefone: '(11) 66666-6666', 
        email: 'ana@email.com',
        endereco: 'Rua Consolação, 321',
        dataNascimento: '1985-11-25',
        observacoes: 'Em tratamento',
        totalRecebido: 750.00,
        status: 'ativo',
        dataCadastro: '2024-01-04'
    },
    { 
        id: 5, 
        codigo: '005', 
        nome: 'Pedro Alves', 
        telefone: '(11) 55555-5555', 
        email: 'pedro@email.com',
        endereco: 'Alameda Santos, 654',
        dataNascimento: '1970-12-05',
        observacoes: 'Paciente preferencial',
        totalRecebido: 2100.00,
        status: 'ativo',
        dataCadastro: '2024-01-05'
    }
];

let recebimentos = [
    { 
        id: 1, 
        pacienteId: 1, 
        pacienteNome: 'João Silva',
        valor: 150.00, 
        data: '2024-01-15', 
        mes: 1,
        ano: 2024,
        tipo: 'consulta',
        status: 'pago',
        observacao: 'Consulta de rotina'
    },
    { 
        id: 2, 
        pacienteId: 2, 
        pacienteNome: 'Maria Santos',
        valor: 200.00, 
        data: '2024-01-14', 
        mes: 1,
        ano: 2024,
        tipo: 'exame',
        status: 'pendente',
        observacao: 'Exames laboratoriais'
    },
    { 
        id: 3, 
        pacienteId: 3, 
        pacienteNome: 'Carlos Oliveira',
        valor: 180.00, 
        data: '2024-01-13', 
        mes: 1,
        ano: 2024,
        tipo: 'consulta',
        status: 'pago',
        observacao: 'Retorno'
    },
    { 
        id: 4, 
        pacienteId: 1, 
        pacienteNome: 'João Silva',
        valor: 300.00, 
        data: '2024-01-10', 
        mes: 1,
        ano: 2024,
        tipo: 'cirurgia',
        status: 'pago',
        observacao: 'Cirurgia menor'
    },
    { 
        id: 5, 
        pacienteId: 4, 
        pacienteNome: 'Ana Costa',
        valor: 120.00, 
        data: '2024-01-09', 
        mes: 1,
        ano: 2024,
        tipo: 'consulta',
        status: 'pago',
        observacao: 'Consulta emergencial'
    },
    { 
        id: 6, 
        pacienteId: 5, 
        pacienteNome: 'Pedro Alves',
        valor: 500.00, 
        data: '2024-01-08', 
        mes: 1,
        ano: 2024,
        tipo: 'exame',
        status: 'pendente',
        observacao: 'Exames de imagem'
    },
    { 
        id: 7, 
        pacienteId: 2, 
        pacienteNome: 'Maria Santos',
        valor: 150.00, 
        data: '2023-12-20', 
        mes: 12,
        ano: 2023,
        tipo: 'consulta',
        status: 'pago',
        observacao: 'Consulta final de ano'
    }
];

// ========== FUNÇÕES AUXILIARES ==========

function gerarProximoId(lista) {
    return lista.length > 0 ? Math.max(...lista.map(item => item.id)) + 1 : 1;
}

function atualizarTotalPaciente(pacienteId, valor, operacao = 'adicionar') {
    const paciente = pacientes.find(p => p.id === pacienteId);
    if (paciente) {
        if (operacao === 'adicionar') {
            paciente.totalRecebido += valor;
        } else if (operacao === 'subtrair') {
            paciente.totalRecebido = Math.max(0, paciente.totalRecebido - valor);
        }
    }
}

// ========== ROTAS DA API ==========

// 1. HEALTH CHECK
app.get('/api/health', (req, res) => {
    const totalRecebido = recebimentos
        .filter(r => r.status === 'pago')
        .reduce((sum, r) => sum + r.valor, 0);
    
    const totalAberto = recebimentos
        .filter(r => r.status === 'pendente')
        .reduce((sum, r) => sum + r.valor, 0);
    
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        sistema: 'Consultório Financeiro',
        versao: '2.0.0',
        estatisticas: {
            totalPacientes: pacientes.length,
            totalRecebimentos: recebimentos.length,
            totalRecebido: totalRecebido,
            totalAberto: totalAberto,
            taxaPagamento: recebimentos.length > 0 
                ? ((recebimentos.filter(r => r.status === 'pago').length / recebimentos.length) * 100).toFixed(1)
                : 0
        }
    });
});

// 2. DASHBOARD
app.get('/api/dashboard', (req, res) => {
    const totalRecebido = recebimentos
        .filter(r => r.status === 'pago')
        .reduce((sum, r) => sum + r.valor, 0);
    
    const totalAberto = recebimentos
        .filter(r => r.status === 'pendente')
        .reduce((sum, r) => sum + r.valor, 0);
    
    // Últimos 5 recebimentos
    const ultimosRecebimentos = [...recebimentos]
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 5);
    
    // Pacientes com maior gasto
    const pacientesTop = [...pacientes]
        .sort((a, b) => b.totalRecebido - a.totalRecebido)
        .slice(0, 5);
    
    res.json({
        metricas: {
            totalRecebido: totalRecebido,
            totalAberto: totalAberto,
            totalPacientes: pacientes.length,
            taxaPagamento: recebimentos.length > 0 
                ? ((recebimentos.filter(r => r.status === 'pago').length / recebimentos.length) * 100).toFixed(1)
                : 0
        },
        ultimosRecebimentos: ultimosRecebimentos,
        pacientesTop: pacientesTop
    });
});

// 3. PACIENTES

// GET: Listar todos os pacientes
app.get('/api/pacientes', (req, res) => {
    res.json(pacientes);
});

// GET: Buscar paciente por ID
app.get('/api/pacientes/:id', (req, res) => {
    const paciente = pacientes.find(p => p.id === parseInt(req.params.id));
    if (!paciente) {
        return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    res.json(paciente);
});

// POST: Criar novo paciente
app.post('/api/pacientes', (req, res) => {
    const novoPaciente = {
        id: gerarProximoId(pacientes),
        codigo: `00${pacientes.length + 1}`,
        ...req.body,
        totalRecebido: 0,
        status: 'ativo',
        dataCadastro: new Date().toISOString().split('T')[0]
    };
    
    pacientes.push(novoPaciente);
    res.status(201).json(novoPaciente);
});

// PUT: Atualizar paciente
app.put('/api/pacientes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = pacientes.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    
    pacientes[index] = { 
        ...pacientes[index], 
        ...req.body,
        id: id // Garantir que o ID não seja alterado
    };
    
    res.json(pacientes[index]);
});

// DELETE: Excluir paciente
app.delete('/api/pacientes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = pacientes.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    
    // Verificar se o paciente tem recebimentos
    const recebimentosPaciente = recebimentos.filter(r => r.pacienteId === id);
    if (recebimentosPaciente.length > 0) {
        return res.status(400).json({ 
            error: 'Não é possível excluir paciente com recebimentos vinculados' 
        });
    }
    
    pacientes.splice(index, 1);
    res.status(204).send();
});

// 4. RECEBIMENTOS

// GET: Listar todos os recebimentos
app.get('/api/recebimentos', (req, res) => {
    const { inicio, fim, status, pacienteId } = req.query;
    
    let recebimentosFiltrados = [...recebimentos];
    
    // Filtrar por data
    if (inicio && fim) {
        recebimentosFiltrados = recebimentosFiltrados.filter(r => {
            const dataRecebimento = new Date(r.data);
            const dataInicio = new Date(inicio);
            const dataFim = new Date(fim);
            return dataRecebimento >= dataInicio && dataRecebimento <= dataFim;
        });
    }
    
    // Filtrar por status
    if (status && status !== 'todos') {
        recebimentosFiltrados = recebimentosFiltrados.filter(r => r.status === status);
    }
    
    // Filtrar por paciente
    if (pacienteId && pacienteId !== 'todos') {
        recebimentosFiltrados = recebimentosFiltrados.filter(r => r.pacienteId === parseInt(pacienteId));
    }
    
    // Ordenar por data (mais recente primeiro)
    recebimentosFiltrados.sort((a, b) => new Date(b.data) - new Date(a.data));
    
    res.json(recebimentosFiltrados);
});

// GET: Buscar recebimento por ID
app.get('/api/recebimentos/:id', (req, res) => {
    const recebimento = recebimentos.find(r => r.id === parseInt(req.params.id));
    if (!recebimento) {
        return res.status(404).json({ error: 'Recebimento não encontrado' });
    }
    res.json(recebimento);
});

// POST: Criar novo recebimento
app.post('/api/recebimentos', (req, res) => {
    const paciente = pacientes.find(p => p.id === req.body.pacienteId);
    if (!paciente) {
        return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    
    const novoRecebimento = {
        id: gerarProximoId(recebimentos),
        pacienteNome: paciente.nome,
        ...req.body,
        data: req.body.data || new Date().toISOString().split('T')[0],
        mes: req.body.mes || new Date().getMonth() + 1,
        ano: req.body.ano || new Date().getFullYear(),
        tipo: req.body.tipo || 'consulta'
    };
    
    recebimentos.push(novoRecebimento);
    
    // Atualizar total do paciente se for pago
    if (novoRecebimento.status === 'pago') {
        atualizarTotalPaciente(novoRecebimento.pacienteId, novoRecebimento.valor, 'adicionar');
    }
    
    res.status(201).json(novoRecebimento);
});

// PUT: Atualizar recebimento
app.put('/api/recebimentos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = recebimentos.findIndex(r => r.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Recebimento não encontrado' });
    }
    
    const recebimentoAntigo = recebimentos[index];
    const novoRecebimento = { 
        ...recebimentos[index], 
        ...req.body,
        id: id
    };
    
    // Se o status mudou, atualizar o total do paciente
    if (recebimentoAntigo.status !== novoRecebimento.status) {
        if (recebimentoAntigo.status === 'pago' && novoRecebimento.status === 'pendente') {
            // Deixou de ser pago, subtrair do total
            atualizarTotalPaciente(recebimentoAntigo.pacienteId, recebimentoAntigo.valor, 'subtrair');
        } else if (recebimentoAntigo.status === 'pendente' && novoRecebimento.status === 'pago') {
            // Passou a ser pago, adicionar ao total
            atualizarTotalPaciente(recebimentoAntigo.pacienteId, recebimentoAntigo.valor, 'adicionar');
        }
    } else if (recebimentoAntigo.status === 'pago' && novoRecebimento.status === 'pago' && 
               recebimentoAntigo.valor !== novoRecebimento.valor) {
        // Valor mudou para um recebimento pago, ajustar total
        const diferenca = novoRecebimento.valor - recebimentoAntigo.valor;
        atualizarTotalPaciente(recebimentoAntigo.pacienteId, Math.abs(diferenca), diferenca > 0 ? 'adicionar' : 'subtrair');
    }
    
    recebimentos[index] = novoRecebimento;
    res.json(novoRecebimento);
});

// PUT: Alterar status do recebimento
app.put('/api/recebimentos/:id/status', (req, res) => {
    const id = parseInt(req.params.id);
    const index = recebimentos.findIndex(r => r.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Recebimento não encontrado' });
    }
    
    const novoStatus = req.body.status;
    const recebimento = recebimentos[index];
    
    // Atualizar total do paciente
    if (recebimento.status !== novoStatus) {
        if (recebimento.status === 'pago' && novoStatus === 'pendente') {
            atualizarTotalPaciente(recebimento.pacienteId, recebimento.valor, 'subtrair');
        } else if (recebimento.status === 'pendente' && novoStatus === 'pago') {
            atualizarTotalPaciente(recebimento.pacienteId, recebimento.valor, 'adicionar');
        }
    }
    
    recebimento.status = novoStatus;
    res.json(recebimento);
});

// DELETE: Excluir recebimento
app.delete('/api/recebimentos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = recebimentos.findIndex(r => r.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Recebimento não encontrado' });
    }
    
    const recebimento = recebimentos[index];
    
    // Se era pago, subtrair do total do paciente
    if (recebimento.status === 'pago') {
        atualizarTotalPaciente(recebimento.pacienteId, recebimento.valor, 'subtrair');
    }
    
    recebimentos.splice(index, 1);
    res.status(204).send();
});

// 5. RELATÓRIOS

app.get('/api/relatorios', (req, res) => {
    const { tipo, mes, ano, pacienteId, inicio, fim } = req.query;
    
    let recebimentosFiltrados = [...recebimentos];
    let titulo = 'Relatório';
    let periodo = '';
    
    // Filtrar conforme os parâmetros
    if (tipo === 'mensal' && mes && ano) {
        recebimentosFiltrados = recebimentosFiltrados.filter(r => 
            r.mes === parseInt(mes) && r.ano === parseInt(ano)
        );
        const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        titulo = `Relatório Mensal - ${meses[parseInt(mes) - 1]}/${ano}`;
        periodo = `Período: ${meses[parseInt(mes) - 1]}/${ano}`;
    }
    else if (tipo === 'anual' && ano) {
        recebimentosFiltrados = recebimentosFiltrados.filter(r => r.ano === parseInt(ano));
        titulo = `Relatório Anual - ${ano}`;
        periodo = `Período: Ano ${ano}`;
    }
    else if (tipo === 'paciente' && pacienteId) {
        recebimentosFiltrados = recebimentosFiltrados.filter(r => r.pacienteId === parseInt(pacienteId));
        const paciente = pacientes.find(p => p.id === parseInt(pacienteId));
        titulo = `Relatório do Paciente - ${paciente ? paciente.nome : 'N/A'}`;
        periodo = paciente ? `Paciente: ${paciente.nome}` : '';
    }
    else if (tipo === 'periodo' && inicio && fim) {
        recebimentosFiltrados = recebimentosFiltrados.filter(r => {
            const dataRecebimento = new Date(r.data);
            const dataInicio = new Date(inicio);
            const dataFim = new Date(fim);
            return dataRecebimento >= dataInicio && dataRecebimento <= dataFim;
        });
        titulo = 'Relatório por Período';
        periodo = `Período: ${formatarDataBR(inicio)} a ${formatarDataBR(fim)}`;
    }
    
    // Calcular estatísticas
    const totalRecebido = recebimentosFiltrados
        .filter(r => r.status === 'pago')
        .reduce((sum, r) => sum + r.valor, 0);
    
    const totalAberto = recebimentosFiltrados
        .filter(r => r.status === 'pendente')
        .reduce((sum, r) => sum + r.valor, 0);
    
    // Agrupar por tipo
    const porTipo = recebimentosFiltrados.reduce((acc, r) => {
        if (!acc[r.tipo]) {
            acc[r.tipo] = { total: 0, quantidade: 0, media: 0 };
        }
        acc[r.tipo].total += r.valor;
        acc[r.tipo].quantidade += 1;
        return acc;
    }, {});
    
    // Calcular média por tipo
    Object.keys(porTipo).forEach(tipo => {
        porTipo[tipo].media = porTipo[tipo].total / porTipo[tipo].quantidade;
    });
    
    // Agrupar por status
    const porStatus = recebimentosFiltrados.reduce((acc, r) => {
        if (!acc[r.status]) {
            acc[r.status] = { total: 0, quantidade: 0 };
        }
        acc[r.status].total += r.valor;
        acc[r.status].quantidade += 1;
        return acc;
    }, {});
    
    // Agrupar por paciente (top 5)
    const porPaciente = recebimentosFiltrados.reduce((acc, r) => {
        if (!acc[r.pacienteNome]) {
            acc[r.pacienteNome] = { total: 0, quantidade: 
