# 🏥 Consultório Financeiro

Sistema completo para controle financeiro de consultório médico.

## 🚀 Deploy Automático no Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/consultorio?referralCode=your-code)

### Passo a Passo:

1. **Acesse** [Railway.app](https://railway.app)
2. **Clique** em "New Project"
3. **Selecione** "Deploy from GitHub repo"
4. **Escolha** este repositório (`consultorio-medico`)
5. **Clique** em "Deploy"

Em **3-5 minutos** seu sistema estará online!

## 📊 Funcionalidades

### ✅ Dashboard Completo
- Total recebido e em aberto
- Número de pacientes ativos
- Taxa de pagamento
- Gráficos e relatórios

### ✅ Gestão de Pacientes
- Cadastro completo
- Histórico financeiro
- Controle de status

### ✅ Controle de Recebimentos
- Lançamento de valores
- Status (pago/pendente)
- Filtros por período

### ✅ Relatórios
- Por paciente
- Por período
- Exportação para Excel

### ✅ Importação de Dados
- Importe sua planilha Excel
- Processamento automático
- Validação de dados

## 🔧 Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js + Express
- **Banco de Dados:** PostgreSQL (Railway)
- **Hospedagem:** Railway.app
- **API:** RESTful

## 📁 Estrutura do Projeto
consultorio-medico/
├── index.html # Frontend completo
├── server.js # Backend API
├── package.json # Dependências Node.js
├── railway.json # Configuração Railway
├── Procfile # Instruções de inicialização
├── README.md # Documentação
└── .gitignore # Arquivos ignorados


## 🎯 Como Usar

1. **Acesse** a URL fornecida pelo Railway
2. **Login:** admin / admin
3. **Explore** as funcionalidades:
   - Dashboard com métricas
   - Cadastro de pacientes
   - Lançamento de recebimentos
   - Geração de relatórios

## 🔄 Importação de Dados

Para importar sua planilha Excel:

1. Vá para a seção **"Importar Excel"**
2. Clique em **"Selecionar Arquivo"**
3. Escolha sua planilha `Consultório.xlsx`
4. Clique em **"Processar"**
5. Confirme os dados
6. **Pronto!** Seus dados serão importados

## 📞 Suporte

### Problemas comuns:

1. **Aplicação não inicia:**
   - Verifique os logs no Railway Dashboard
   - Confira se todas as dependências estão instaladas

2. **Banco de dados não conecta:**
   - Railway cria automaticamente
   - Verifique as variáveis de ambiente

3. **Importação não funciona:**
   - Verifique o formato da planilha
   - A primeira linha deve conter cabeçalhos

### Precisa de ajuda?
- **Logs:** Railway Dashboard > Logs
- **Banco de dados:** Railway Dashboard > PostgreSQL
- **Variáveis:** Railway Dashboard > Variables

## 📄 Licença

MIT License - Veja o arquivo LICENSE para detalhes.

---

**Desenvolvido com ❤️ para seu consultório médico**
