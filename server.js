const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ========== DADOS EM MEMÓRIA (simulando banco de dados) ==========

let pacientes = [
    { 
        id: 1, 
        codigo: 'PAC001', 
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
        codigo: 'PAC002', 
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
        codigo: 'PAC003', 
        nome: 'Carlos Oliveira', 
        telefone: '(11) 77777-7777', 
        email: 'carlos@email.com',
        endereco: 'Rua Augusta, 789',
        dataNascimento: '1990-03-10',
        observacoes: 'Paciente novo',
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
        pacienteCodigo: 'PAC001',
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
        pacienteCodigo: 'PAC002',
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
        pacienteCodigo: 'PAC003',
        valor: 180.00, 
        data: '2024-01-13', 
        mes: 1,
        ano: 2024,
        tipo: 'consulta',
        status: 'pago',
        observacao: 'Retorno'
    }
];

// ========== FUNÇÕES AUXILIARES ==========

function gerarProximoId(lista) {
    return lista.length > 0 ? Math.max(...lista.map(item => item.id)) + 1 : 1;
}

function gerarProximoCodigoPaciente() {
    if (pacientes.length === 0) {
        return 'PAC001';
    }
    
    const codigosNumericos = pacientes
        .map(p => {
            const numeroStr = p.codigo.replace('PAC', '');
            return parseInt(numeroStr, 10);
        })
        .filter(num => !isNaN(num));
    
    const maiorNumero = Math.max(...codigosNumericos);
    const proximoNumero = maiorNumero + 1;
    const proximoCodigo = 'PAC' + proximoNumero.toString().padStart(3, '0');
    
    return proximoCodigo;
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

// ========== NOVAS ROTAS PARA BACKUP ==========

// GET: Obter dados completos para backup
app.get('/api/backup/exportar', (req, res) => {
    const backupData = {
        pacientes: pacientes,
        recebimentos: recebimentos,
        timestamp: new Date().toISOString(),
        versao: '2.0.0',
        totalPacientes: pacientes.length,
        totalRecebimentos: recebimentos.length,
        estatisticas: {
            totalRecebido: recebimentos
                .filter(r => r.status === 'pago')
                .reduce((sum, r) => sum + r.valor, 0),
            totalAberto: recebimentos
                .filter(r => r.status === 'pendente')
                .reduce((sum, r) => sum + r.valor, 0),
            taxaPagamento: recebimentos.length > 0 
                ? ((recebimentos.filter(r => r.status === 'pago').length / recebimentos.length) * 100).toFixed(1)
                : 0
        }
    };
    
    res.json(backupData);
});

// POST: Restaurar dados de backup
app.post('/api/backup/restaurar', (req, res) => {
    const { pacientes: novosPacientes, recebimentos: novosRecebimentos } = req.body;
    
    if (!novosPacientes || !Array.isArray(novosPacientes) || 
        !novosRecebimentos || !Array.isArray(novosRecebimentos)) {
        return res.status(400).json({ error: 'Dados de backup inválidos' });
    }
    
    try {
        // Criar backup dos dados atuais antes de restaurar
        const backupAntes = {
            pacientes: [...pacientes],
            recebimentos: [...recebimentos],
            timestamp: new Date().toISOString()
        };
        
        // Salvar backup anterior (opcional - em produção, salvaria em arquivo)
        console.log('Backup anterior salvo:', backupAntes.timestamp);
        
        // Restaurar novos dados
        pacientes = novosPacientes;
        recebimentos = novosRecebimentos;
        
        // Ajustar IDs para evitar conflitos
        pacientes.forEach((p, index) => { p.id = index + 1; });
        recebimentos.forEach((r, index) => { r.id = index + 1; });
        
        res.json({
            mensagem: 'Dados restaurados com sucesso',
            estatisticas: {
                pacientes: pacientes.length,
                recebimentos: recebimentos.length
            }
        });
        
    } catch (error) {
        console.error('Erro ao restaurar backup:', error);
        res.status(500).json({ error: 'Erro interno ao restaurar backup' });
    }
});

// POST: Criar backup manual
app.post('/api/backup/criar', (req, res) => {
    const backupId = 'backup_' + Date.now();
    const backupData = {
        id: backupId,
        pacientes: pacientes,
        recebimentos: recebimentos,
        timestamp: new Date().toISOString(),
        versao: '2.0.0'
    };
    
    // Em produção, salvaria em arquivo ou banco de dados
    // Aqui apenas retornamos os dados
    res.json({
        ...backupData,
        mensagem: 'Backup criado com sucesso',
        downloadUrl: `/api/backup/download/${backupId}`
    });
});

// GET: Download de backup específico
app.get('/api/backup/download/:id', (req, res) => {
    const backupData = {
        pacientes: pacientes,
        recebimentos: recebimentos,
        timestamp: new Date().toISOString(),
        versao: '2.0.0'
    };
    
    // Configurar headers para download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=backup_${req.params.id}.json`);
    
    res.send(JSON.stringify(backupData, null, 2));
});

// ========== ROTAS ORIGINAIS DA API ==========

// Health Check atualizado
app.get('/api/health', (req, res) => {
    const totalRecebido = recebimentos
        .filter(r => r.status === 'pago')
        .reduce((sum, r) => sum + r.valor, 0);
    
    const totalAberto = recebimentos
        .filter(r => r.status === 'pendente')
        .reduce((sum, r) => sum + r.valor, 0);
    
    const proximoCodigo = gerarProximoCodigoPaciente();
    
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        sistema: 'Consultório Financeiro v2.0',
        versao: '2.0.0',
        recursoBackup: true,
        proximoCodigoDisponivel: proximoCodigo,
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

// Dashboard
app.get('/api/dashboard', (req, res) => {
    const totalRecebido = recebimentos
        .filter(r => r.status === 'pago')
        .reduce((sum, r) => sum + r.valor, 0);
    
    const totalAberto = recebimentos
        .filter(r => r.status === 'pendente')
        .reduce((sum, r) => sum + r.valor, 0);
    
    const ultimosRecebimentos = [...recebimentos]
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 5);
    
    const pacientesTop = [...pacientes]
        .sort((a, b) => b.totalRecebido - a.totalRecebido)
        .slice(0, 5);
    
    const proximoCodigo = gerarProximoCodigoPaciente();
    
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
        proximoCodigoDisponivel: proximoCodigo
    });
});

// Pacientes
app.get('/api/pacientes', (req, res) => {
    res.json(pacientes);
});

app.get('/api/pacientes/proximo-codigo', (req, res) => {
    const proximoCodigo = gerarProximoCodigoPaciente();
    res.json({ proximoCodigo });
});

app.post('/api/pacientes', (req, res) => {
    const proximoCodigo = gerarProximoCodigoPaciente();
    
    const novoPaciente = {
        id: gerarProximoId(pacientes),
        codigo: proximoCodigo,
        ...req.body,
        totalRecebido: 0,
        status: 'ativo',
        dataCadastro: new Date().toISOString().split('T')[0]
    };
    
    if (!novoPaciente.nome || !novoPaciente.telefone) {
        return res.status(400).json({ error: 'Nome e telefone são obrigatórios' });
    }
    
    pacientes.push(novoPaciente);
    res.status(201).json({
        ...novoPaciente,
        mensagem: `Paciente cadastrado com código ${proximoCodigo}`
    });
});

app.put('/api/pacientes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = pacientes.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    
    const { codigo, ...dadosAtualizacao } = req.body;
    
    pacientes[index] = { 
        ...pacientes[index], 
        ...dadosAtualizacao,
        id: id,
        codigo: pacientes[index].codigo
    };
    
    res.json({
        ...pacientes[index],
        mensagem: 'Paciente atualizado com sucesso'
    });
});

app.delete('/api/pacientes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = pacientes.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    
    const recebimentosPaciente = recebimentos.filter(r => r.pacienteId === id);
    if (recebimentosPaciente.length > 0) {
        return res.status(400).json({ 
            error: 'Não é possível excluir paciente com recebimentos vinculados' 
        });
    }
    
    const pacienteRemovido = pacientes[index];
    pacientes.splice(index, 1);
    
    res.json({
        mensagem: `Paciente ${pacienteRemovido.codigo} - ${pacienteRemovido.nome} removido com sucesso`,
        paciente: pacienteRemovido
    });
});

// Recebimentos
app.get('/api/recebimentos', (req, res) => {
    const { inicio, fim, status, pacienteId } = req.query;
    
    let recebimentosFiltrados = [...recebimentos];
    
    if (inicio && fim) {
        recebimentosFiltrados = recebimentosFiltrados.filter(r => {
            const dataRecebimento = new Date(r.data);
            const dataInicio = new Date(inicio);
            const dataFim = new Date(fim);
            return dataRecebimento >= dataInicio && dataRecebimento <= dataFim;
        });
    }
    
    if (status && status !== 'todos') {
        recebimentosFiltrados = recebimentosFiltrados.filter(r => r.status === status);
    }
    
    if (pacienteId && pacienteId !== 'todos') {
        recebimentosFiltrados = recebimentosFiltrados.filter(r => r.pacienteId === parseInt(pacienteId));
    }
    
    recebimentosFiltrados.sort((a, b) => new Date(b.data) - new Date(a.data));
    
    res.json(recebimentosFiltrados);
});

app.post('/api/recebimentos', (req, res) => {
    const paciente = pacientes.find(p => p.id === req.body.pacienteId);
    if (!paciente) {
        return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    
    const novoRecebimento = {
        id: gerarProximoId(recebimentos),
        pacienteNome: paciente.nome,
        pacienteCodigo: paciente.codigo,
        ...req.body,
        data: req.body.data || new Date().toISOString().split('T')[0],
        mes: req.body.mes || new Date().getMonth() + 1,
        ano: req.body.ano || new Date().getFullYear(),
        tipo: req.body.tipo || 'consulta'
    };
    
    if (!novoRecebimento.valor || novoRecebimento.valor <= 0) {
        return res.status(400).json({ error: 'Valor inválido' });
    }
    
    recebimentos.push(novoRecebimento);
    
    if (novoRecebimento.status === 'pago') {
        atualizarTotalPaciente(novoRecebimento.pacienteId, novoRecebimento.valor, 'adicionar');
    }
    
    res.status(201).json({
        ...novoRecebimento,
        mensagem: `Recebimento registrado para ${paciente.codigo} - ${paciente.nome}`
    });
});

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
    
    if (recebimentoAntigo.status !== novoRecebimento.status) {
        if (recebimentoAntigo.status === 'pago' && novoRecebimento.status === 'pendente') {
            atualizarTotalPaciente(recebimentoAntigo.pacienteId, recebimentoAntigo.valor, 'subtrair');
        } else if (recebimentoAntigo.status === 'pendente' && novoRecebimento.status === 'pago') {
            atualizarTotalPaciente(recebimentoAntigo.pacienteId, recebimentoAntigo.valor, 'adicionar');
        }
    } else if (recebimentoAntigo.status === 'pago' && novoRecebimento.status === 'pago' && 
               recebimentoAntigo.valor !== novoRecebimento.valor) {
        const diferenca = novoRecebimento.valor - recebimentoAntigo.valor;
        atualizarTotalPaciente(recebimentoAntigo.pacienteId, Math.abs(diferenca), diferenca > 0 ? 'adicionar' : 'subtrair');
    }
    
    recebimentos[index] = novoRecebimento;
    res.json({
        ...novoRecebimento,
        mensagem: 'Recebimento atualizado com sucesso'
    });
});

app.delete('/api/recebimentos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = recebimentos.findIndex(r => r.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Recebimento não encontrado' });
    }
    
    const recebimento = recebimentos[index];
    
    if (recebimento.status === 'pago') {
        atualizarTotalPaciente(recebimento.pacienteId, recebimento.valor, 'subtrair');
    }
    
    recebimentos.splice(index, 1);
    
    res.json({
        mensagem: 'Recebimento excluído com sucesso',
        recebimentoExcluido: recebimento
    });
});

// Rota padrão para frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ========== INICIAR SERVIDOR ==========

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor v2.0 rodando na porta ${PORT}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`📊 Sistema de Backup: ATIVADO`);
    console.log(`👥 Total de pacientes: ${pacientes.length}`);
    console.log(`💰 Total de recebimentos: ${recebimentos.length}`);
    console.log(`🔐 Próximo código disponível: ${gerarProximoCodigoPaciente()}`);
});
