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
    },
    { 
        id: 4, 
        codigo: 'PAC004', 
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
        codigo: 'PAC005', 
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
    },
    { 
        id: 4, 
        pacienteId: 1, 
        pacienteNome: 'João Silva',
        pacienteCodigo: 'PAC001',
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
        pacienteCodigo: 'PAC004',
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
        pacienteCodigo: 'PAC005',
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
        pacienteCodigo: 'PAC002',
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

function gerarProximoCodigoPaciente() {
    if (pacientes.length === 0) {
        return 'PAC001';
    }
    
    // Extrai todos os números dos códigos existentes
    const codigosNumericos = pacientes
        .map(p => {
            // Remove "PAC" do início e converte para número
            const numeroStr = p.codigo.replace('PAC', '');
            return parseInt(numeroStr, 10);
        })
        .filter(num => !isNaN(num));
    
    // Encontra o maior número
    const maiorNumero = Math.max(...codigosNumericos);
    
    // Gera o próximo código com padding de zeros
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

function formatarDataBR(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

function buscarPacientePorId(id) {
    return pacientes.find(p => p.id === id);
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
    
    const proximoCodigo = gerarProximoCodigoPaciente();
    
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        sistema: 'Consultório Financeiro',
        versao: '2.0.0',
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

// GET: Buscar paciente por código
app.get('/api/pacientes/codigo/:codigo', (req, res) => {
    const paciente = pacientes.find(p => p.codigo === req.params.codigo.toUpperCase());
    if (!paciente) {
        return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    res.json(paciente);
});

// GET: Próximo código disponível
app.get('/api/pacientes/proximo-codigo', (req, res) => {
    const proximoCodigo = gerarProximoCodigoPaciente();
    res.json({ proximoCodigo });
});

// POST: Criar novo paciente
app.post('/api/pacientes', (req, res) => {
    // Gerar código automaticamente
    const proximoCodigo = gerarProximoCodigoPaciente();
    
    const novoPaciente = {
        id: gerarProximoId(pacientes),
        codigo: proximoCodigo,
        ...req.body,
        totalRecebido: 0,
        status: 'ativo',
        dataCadastro: new Date().toISOString().split('T')[0]
    };
    
    // Validar campos obrigatórios
    if (!novoPaciente.nome || !novoPaciente.telefone) {
        return res.status(400).json({ error: 'Nome e telefone são obrigatórios' });
    }
    
    pacientes.push(novoPaciente);
    res.status(201).json({
        ...novoPaciente,
        mensagem: `Paciente cadastrado com código ${proximoCodigo}`
    });
});

// PUT: Atualizar paciente
app.put('/api/pacientes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = pacientes.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    
    // Não permite alterar o código do paciente
    const { codigo, ...dadosAtualizacao } = req.body;
    
    pacientes[index] = { 
        ...pacientes[index], 
        ...dadosAtualizacao,
        id: id, // Garantir que o ID não seja alterado
        codigo: pacientes[index].codigo // Manter o código original
    };
    
    res.json({
        ...pacientes[index],
        mensagem: 'Paciente atualizado com sucesso'
    });
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
    
    const pacienteRemovido = pacientes[index];
    pacientes.splice(index, 1);
    
    res.json({
        mensagem: `Paciente ${pacienteRemovido.codigo} - ${pacienteRemovido.nome} removido com sucesso`,
        paciente: pacienteRemovido
    });
});

// 4. RECEBIMENTOS

// GET: Listar todos os recebimentos
app.get('/api/recebimentos', (req, res) => {
    const { inicio, fim, status, pacienteId, pacienteCodigo } = req.query;
    
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
    
    // Filtrar por paciente ID
    if (pacienteId && pacienteId !== 'todos') {
        recebimentosFiltrados = recebimentosFiltrados.filter(r => r.pacienteId === parseInt(pacienteId));
    }
    
    // Filtrar por paciente código
    if (pacienteCodigo && pacienteCodigo !== 'todos') {
        const paciente = pacientes.find(p => p.codigo === pacienteCodigo.toUpperCase());
        if (paciente) {
            recebimentosFiltrados = recebimentosFiltrados.filter(r => r.pacienteId === paciente.id);
        }
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
        pacienteCodigo: paciente.codigo,
        ...req.body,
        data: req.body.data || new Date().toISOString().split('T')[0],
        mes: req.body.mes || new Date().getMonth() + 1,
        ano: req.body.ano || new Date().getFullYear(),
        tipo: req.body.tipo || 'consulta'
    };
    
    // Validações
    if (!novoRecebimento.valor || novoRecebimento.valor <= 0) {
        return res.status(400).json({ error: 'Valor inválido' });
    }
    
    recebimentos.push(novoRecebimento);
    
    // Atualizar total do paciente se for pago
    if (novoRecebimento.status === 'pago') {
        atualizarTotalPaciente(novoRecebimento.pacienteId, novoRecebimento.valor, 'adicionar');
    }
    
    res.status(201).json({
        ...novoRecebimento,
        mensagem: `Recebimento registrado para ${paciente.codigo} - ${paciente.nome}`
    });
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
    res.json({
        ...novoRecebimento,
        mensagem: 'Recebimento atualizado com sucesso'
    });
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
    res.json({
        ...recebimento,
        mensagem: `Status alterado para ${novoStatus}`
    });
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
    
    res.json({
        mensagem: 'Recebimento excluído com sucesso',
        recebimentoExcluido: recebimento
    });
});

// 5. RELATÓRIOS

app.get('/api/relatorios', (req, res) => {
    const { tipo, mes, ano, pacienteId, pacienteCodigo, inicio, fim } = req.query;
    
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
        periodo = paciente ? `Paciente: ${paciente.nome} (${paciente.codigo})` : '';
    }
    else if (tipo === 'paciente-codigo' && pacienteCodigo) {
        const paciente = pacientes.find(p => p.codigo === pacienteCodigo.toUpperCase());
        if (paciente) {
            recebimentosFiltrados = recebimentosFiltrados.filter(r => r.pacienteId === paciente.id);
            titulo = `Relatório do Paciente - ${paciente.nome}`;
            periodo = `Paciente: ${paciente.nome} (${paciente.codigo})`;
        }
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
        const chave = `${r.pacienteCodigo} - ${r.pacienteNome}`;
        if (!acc[chave]) {
            acc[chave] = { codigo: r.pacienteCodigo, nome: r.pacienteNome, total: 0, quantidade: 0 };
        }
        acc[chave].total += r.valor;
        acc[chave].quantidade += 1;
        return acc;
    }, {});
    
    // Converter para array e ordenar
    const topPacientes = Object.values(porPaciente)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);
    
    res.json({
        titulo,
        periodo,
        estatisticas: {
            totalRecebido,
            totalAberto,
            totalRegistros: recebimentosFiltrados.length,
            quantidadePagos: recebimentosFiltrados.filter(r => r.status === 'pago').length,
            quantidadePendentes: recebimentosFiltrados.filter(r => r.status === 'pendente').length
        },
        detalhes: {
            porTipo,
            porStatus,
            topPacientes
        },
        registros: recebimentosFiltrados
    });
});

// 6. ROTA PARA SERVIDOR ESTÁTICO (FRONTEND)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ========== INICIAR SERVIDOR ==========

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
    console.log(`👥 Total de pacientes: ${pacientes.length}`);
    console.log(`💰 Total de recebimentos: ${recebimentos.length}`);
    console.log(`📝 Próximo código disponível: ${gerarProximoCodigoPaciente()}`);
});
