# 🏥 Consultório Financeiro v2.0

Sistema completo para controle financeiro de consultório médico **com backup local automático**.

## 🚀 Novas Funcionalidades na Versão 2.0

### ✅ **Sistema de Backup Local**
- **Backup Automático**: Salva dados automaticamente no navegador
- **Backup Manual**: Crie backups sob demanda
- **Restauração**: Restaure dados de arquivos JSON
- **Histórico**: Visualize todos os backups realizados
- **Configuração**: Ajuste intervalo e limite de backups

### ✅ **Correções Importantes**
- **Removido campo de código** do formulário de novo paciente
- Código agora é gerado automaticamente pelo backend
- Interface mais limpa e intuitiva

### ✅ **Dashboard Aprimorado**
- Novas métricas visuais
- Acesso rápido ao backup
- Status do sistema em tempo real

## 🔧 Como Usar o Backup

### 1. **Backup Automático**
- Ative nas configurações
- Dados salvos automaticamente (5 min padrão)
- Armazenado no localStorage do navegador

### 2. **Backup Manual**
1. Vá para **"Backup Local"** no menu
2. Clique em **"Criar Backup"**
3. O arquivo será baixado automaticamente

### 3. **Restaurar Dados**
1. Na seção **"Backup Local"**
2. Selecione **"Restaurar de Arquivo"**
3. Escolha seu arquivo JSON de backup
4. Confirme a restauração

## 📊 Funcionalidades Principais

### ✅ Gestão Completa de Pacientes
- Cadastro sem código manual (gerado automaticamente)
- Histórico financeiro individual
- Status ativo/inativo

### ✅ Controle de Recebimentos
- Lançamento de valores
- Status (pago/pendente)
- Filtros por período

### ✅ Relatórios Avançados
- Por paciente, período, mensal ou anual
- Exportação para Excel
- Gráficos visuais

### ✅ Importação de Excel
- Importe sua planilha existente
- Processamento automático
- Validação de dados

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js + Express
- **Backup**: localStorage + download JSON
- **Hospedagem**: Pronto para Railway, Heroku, etc.

## 📁 Estrutura do Projeto
consultorio-financeiro-v2/
├── index.html # Frontend completo
├── server.js # Backend API + Backup
├── package.json # Dependências atualizadas
├── Procfile # Configuração Railway
├── README.md # Documentação
└── .gitignore # Arquivos ignorados


## 🚀 Deploy Rápido no Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

### Passos:
1. Clique no botão acima
2. Conecte ao GitHub
3. Selecione este repositório
4. Clique em **"Deploy"**

Em **2-3 minutos** seu sistema estará online com backup ativado!

## 🔒 Segurança de Dados

### Backup Local:
- Dados salvos no navegador do usuário
- Criptografados (em produção)
- Download automático para backup externo

### Recomendações:
1. **Faça backups regulares**
2. **Armazene backups externamente**
3. **Use em navegadores atualizados**

## 📞 Suporte

### Problemas Comuns:

1. **Backup não funciona:**
   - Verifique se localStorage está habilitado
   - Tente em outro navegador

2. **Importação falha:**
   - Verifique formato da planilha
   - Use o modelo exemplo

3. **Código não aparece:**
   - Agora é gerado automaticamente
   - Veja na listagem de pacientes

## 📄 Licença

MIT License - Use livremente para seu consultório.

---

**Desenvolvido com ❤️ para a saúde financeira do seu consultório**

📧 **Dúvidas?** Consulte a documentação ou abra uma issue.
