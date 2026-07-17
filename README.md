# ⚽ MisterIA — Assistente Inteligente da Copa do Mundo 2026

O **MisterIA** é uma aplicação web interativa que funciona como um assistente virtual inteligente dedicado a responder dúvidas, estatísticas e curiosidades sobre a Copa do Mundo FIFA de 2026. 

O projeto combina uma interface de chat moderna e responsiva com um backend robusto integrado diretamente à plataforma de IA da Microsoft.

---

## ✨ Recursos Principais

- **Interface de Chat Moderna**: Redesenhada com foco em experiência do usuário, contendo animações fluidas, modo escuro (Dark Mode) nativo e design responsivo.
- **Renderização de Markdown**: Suporte completo a tabelas, listas ordenadas/desordenadas, negrito, itálico e blocos de código com destaque visual.
- **Cards de Fontes Oficiais**: Integração visual com links e referências oficiais citados pelo agente inteligente para validação das informações.
- **Indicador Dinâmico de Carregamento**: Feedback visual em tempo real (typing indicator) enquanto a IA processa a resposta.
- **Modal Informativo**: Um painel sobre o projeto na tela inicial com detalhes do desenvolvimento em Microsoft AI Foundry.

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes tecnologias:

- **Python & Flask**: Framework utilizado para estruturar o servidor backend, gerenciar rotas e intermediar requisições de API.
- **Microsoft AI Foundry / Azure OpenAI**: Plataforma de inteligência artificial utilizada para orquestrar e processar as respostas do agente inteligente.
- **JavaScript (Vanilla)**: Responsável por toda a interatividade do chat, requisições assíncronas (Fetch API), manipulação dinâmica do DOM e controle de modais.
- **Marked.js**: Biblioteca utilizada no frontend para renderizar com segurança e fidelidade os textos em Markdown (tabelas, listas, negritos) retornados pela IA.
- **HTML5 & CSS3**: Estruturação semântica e estilização customizada com suporte a modo escuro (Dark Mode), animações fluidas e total responsividade para dispositivos móveis.
- **Vercel**: Plataforma utilizada para a hospedagem e deploy contínuo (Serverless) da aplicação.

---

## 🛠️ Arquitetura do Projeto

O projeto segue uma estrutura de diretórios simples e organizada:

```text
├── api/ ou raiz/
│   ├── app.py           # Servidor Flask e definição de rotas/APIs
│   ├── foundry.py       # Integração e tratamento de dados com a API do Microsoft AI Foundry
├── static/
│   ├── css/
│   │   ├── style.css    # Estilos da página de boas-vindas e do modal
│   │   └── chat.css     # Estilos da interface do chat, balões e cards de fontes
│   └── js/
│       ├── script.js    # Controle do modal da página inicial
│       └── chat.js      # Envio, recepção, estado de carregamento e formatação de Markdown
├── templates/
│   ├── index.html       # Página inicial (Landing Page)
│   └── chat.html        # Página da interface da conversa
├── .env.example         # Exemplo de variáveis de ambiente
├── requirements.txt     # Dependências de bibliotecas do Python
└── vercel.json          # Arquivo de configuração para deploy Serverless na Vercel
```

---

## 💻 Configuração e Execução Local

Siga os passos abaixo para rodar o projeto localmente:

### 1. Clonar o Repositório
```bash
git clone https://github.com/SeuUsuario/MeuPrimeiroAgente.git
cd MeuPrimeiroAgente
```

### 2. Configurar o Ambiente Virtual (venv)
É altamente recomendável utilizar um ambiente virtual para isolar as dependências do Python:

**No Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**No macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar as Dependências
Com o ambiente virtual ativo, instale as bibliotecas necessárias:
```bash
pip install -r requirements.txt
```

### 4. Configurar as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto contendo as credenciais da API da Microsoft AI Foundry. Utilize o arquivo `.env.example` como base:

```env
API_KEY=sua_chave_de_api_aqui
ENDPOINT=seu_endpoint_do_agent_aqui
AGENT_NAME=nome_do_seu_agente
```

### 5. Executar o Servidor Flask
Para iniciar a aplicação localmente:
```bash
python app.py
```
Acesse no seu navegador através de: [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## ☁️ Deploy na Vercel

O projeto está configurado para deploy instantâneo na Vercel por meio do arquivo `vercel.json` que define a execução serverless do backend em Python.

Para implantar via CLI da Vercel:
1. Instale o Vercel CLI (`npm install -g vercel`).
2. Rode o comando `vercel` na raiz do projeto e siga as instruções.
3. Configure as variáveis de ambiente (`API_KEY`, `ENDPOINT`, `AGENT_NAME`) no painel de configurações do seu projeto na Vercel.