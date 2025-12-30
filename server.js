const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Dados iniciais (simulando um banco de dados)
let pacientes = [
    { 
        id: 1, 
        codigo: '001', 
        nome: 'João Silva', 
        telefone: '(11) 99999-9999', 
        email: 'joao@email.com',
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
        totalRecebido: 1520.00,
        status: 'ativo',
        dataCadastro: '2024-01-03'
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
        status: 'pago',
        observacao: 'Cirurgia menor'
    }
];

// ========== ROTAS DA API ==========

// Health check
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
        versao: '1.0.0',
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
        id: pacientes.length > 0 ? Math.max(...pacientes.map(p => p.id)) + 1 : 1,
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
    const index = pacientes.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    
    pacientes[index] = { ...pacientes[index], ...req.body };
    res.json(pacientes[index]);
});

// GET: Listar todos os recebimentos
app.get('/api/recebimentos', (req, res) => {
    res.json(recebimentos);
});

// POST: Criar novo recebimento
app.post('/api/recebimentos', (req, res) => {
    const paciente = pacientes.find(p => p.id === req.body.pacienteId);
    if (!paciente) {
        return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    
    const novoRecebimento = {
        id: recebimentos.length > 0 ? Math.max(...recebimentos.map(r => r.id)) + 1 : 1,
        pacienteNome: paciente.nome,
        ...req.body,
        data: req.body.data || new Date().toISOString().split('T')[0],
        mes: req.body.mes || new Date().getMonth() + 1,
        ano: req.body.ano || new Date().getFullYear()
    };
    
    recebimentos.push(novoRecebimento);
    
    // Atualizar total do paciente
    if (novoRecebimento.status === 'pago') {
        paciente.totalRecebido += novoRecebimento.valor;
    }
    
    res.status(201).json(novoRecebimento);
});

// GET: Relatório por período
app.get('/api/relatorios', (req, res) => {
    const { inicio, fim, status } = req.query;
    
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
    
    // Calcular totais
    const totalRecebido = recebimentosFiltrados
        .filter(r => r.status === 'pago')
        .reduce((sum, r) => sum + r.valor, 0);
    
    const totalAberto = recebimentosFiltrados
        .filter(r => r.status === 'pendente')
        .reduce((sum, r) => sum + r.valor, 0);
    
    res.json({
        periodo: { inicio, fim },
        filtroStatus: status,
        totalRecebimentos: recebimentosFiltrados.length,
        recebimentos: recebimentosFiltrados,
        totais: {
            recebido: totalRecebido,
            emAberto: totalAberto,
            geral: totalRecebido + totalAberto
        }
    });
});

// GET: Dashboard data
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
    
    // Recebimentos por mês (últimos 6 meses)
    const hoje = new Date();
    const meses = [];
    for (let i = 5; i >= 0; i--) {
        const mes = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const mesKey = `${mes.getFullYear()}-${String(mes.getMonth() + 1).padStart(2, '0')}`;
        const recebidosMes = recebimentos
            .filter(r => r.status === 'pago' && 
                  `${r.ano}-${String(r.mes).padStart(2, '0')}` === mesKey)
            .reduce((sum, r) => sum + r.valor, 0);
        
        meses.push({
            mes: mes.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
            valor: recebidosMes
        });
    }
    
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
        pacientesTop: pacientesTop,
        evolucaoMensal: meses
    });
});

// Servir o frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('🚀 ========================================');
    console.log('🏥  SISTEMA CONSULTÓRIO FINANCEIRO');
    console.log('🚀 ========================================');
    console.log(`📡 Servidor rodando na porta: ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
    console.log(`📈 Dashboard API: http://localhost:${PORT}/api/dashboard`);
    console.log('👥 Pacientes API: http://localhost:${PORT}/api/pacientes');
    console.log('💰 Recebimentos API: http://localhost:${PORT}/api/recebimentos');
    console.log('========================================');
});
