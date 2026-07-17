// Elementos do DOM
const botao = document.getElementById("btnEnviar");
const input = document.getElementById("inputMensagem");
const mensagens = document.getElementById("messages");

// Configura os ouvintes de eventos
botao.addEventListener("click", enviarMensagem);

input.addEventListener("keydown", (e) => {
    // Enter envia a mensagem, Shift + Enter insere uma quebra de linha
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        enviarMensagem();
    }
});

// Auto-expandir a área de texto
input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
});

// Controle global do indicador de digitando
let typingIndicator = null;

// Inicializa o chat com a mensagem de boas-vindas
window.addEventListener("DOMContentLoaded", () => {
    // Adiciona a mensagem padrão inicial
    adicionarMensagem("bot", "Olá! Como posso ajudar?", obterHoraAtual());
    input.focus();
});

/**
 * Obtém a hora atual formatada em HH:MM
 */
function obterHoraAtual() {
    const agora = new Date();
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
}

/**
 * Rola a tela para o final do chat suavemente
 */
function scrollToBottom() {
    mensagens.scrollTo({
        top: mensagens.scrollHeight,
        behavior: "smooth"
    });
}

/**
 * Alterna o estado da interface entre carregamento e normal
 */
function setCarregando(carregando) {
    botao.disabled = carregando;
    input.disabled = carregando;
    if (carregando) {
        exibirIndicadorDigitando();
    } else {
        removerIndicadorDigitando();
        // Redefine a altura do campo de texto para o padrão
        input.style.height = "auto";
        input.focus();
    }
}

/**
 * Exibe o indicador visual de que o "Mister está digitando..."
 */
function exibirIndicadorDigitando() {
    if (typingIndicator) return;

    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper", "bot-message");
    wrapper.id = "typing-indicator";

    const meta = document.createElement("div");
    meta.classList.add("message-meta");

    const avatar = document.createElement("div");
    avatar.classList.add("avatar-circle", "bot-avatar");
    avatar.textContent = "M";

    const nome = document.createElement("span");
    nome.classList.add("message-name");
    nome.textContent = "Mister";

    meta.appendChild(avatar);
    meta.appendChild(nome);

    const bubble = document.createElement("div");
    bubble.classList.add("message-bubble", "typing-bubble");

    const textoSpan = document.createElement("span");
    textoSpan.textContent = "Mister está digitando";

    const dotsSpan = document.createElement("span");
    dotsSpan.classList.add("typing-dots");
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        dot.textContent = ".";
        dotsSpan.appendChild(dot);
    }

    bubble.appendChild(textoSpan);
    bubble.appendChild(dotsSpan);
    wrapper.appendChild(meta);
    wrapper.appendChild(bubble);

    mensagens.appendChild(wrapper);
    typingIndicator = wrapper;
    scrollToBottom();
}

/**
 * Remove o indicador de digitando
 */
function removerIndicadorDigitando() {
    if (typingIndicator) {
        typingIndicator.remove();
        typingIndicator = null;
    }
}

/**
 * Extrai URLs da resposta, substitui por índices numéricos (sobrescritos) 
 * e compila a lista de fontes utilizadas.
 */
function processarRespostaLinks(textoOriginal) {
    const links = [];
    const linkMap = new Map();
    let index = 1;
    let textoProcessado = textoOriginal;

    // 1. Mapeia Links em Markdown [Título](URL)
    const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    textoProcessado = textoProcessado.replace(markdownLinkRegex, (match, text, url) => {
        if (!linkMap.has(url)) {
            linkMap.set(url, { index: index++, text: text });
            links.push({ url: url, text: text });
        }
        const idx = linkMap.get(url).index;
        return `${text}<sup>[${idx}]</sup>`;
    });

    // 2. Mapeia URLs simples/puras (desconsiderando as que já estão no formato acima)
    const rawUrlRegex = /(?<!\()https?:\/\/[^\s)]+/g;
    textoProcessado = textoProcessado.replace(rawUrlRegex, (url) => {
        if (!linkMap.has(url)) {
            let cleanHost = "Fonte";
            try {
                cleanHost = new URL(url).hostname.replace("www.", "");
            } catch (e) {}
            linkMap.set(url, { index: index++, text: cleanHost });
            links.push({ url: url, text: cleanHost });
        }
        const idx = linkMap.get(url).index;
        return `<sup>[${idx}]</sup>`;
    });

    return {
        textoLimpo: textoProcessado,
        fontes: links
    };
}

/**
 * Cria e insere um elemento de mensagem no container do chat
 */
function adicionarMensagem(remetente, texto, hora, fontes = []) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper");
    wrapper.classList.add(remetente === "user" ? "user-message" : "bot-message");

    // Seção de metadados (avatar, nome e horário)
    const meta = document.createElement("div");
    meta.classList.add("message-meta");

    const avatar = document.createElement("div");
    avatar.classList.add("avatar-circle");
    avatar.classList.add(remetente === "user" ? "user-avatar" : "bot-avatar");
    avatar.textContent = remetente === "user" ? "U" : "M";

    const nome = document.createElement("span");
    nome.classList.add("message-name");
    nome.textContent = remetente === "user" ? "Você" : "Mister";

    const tempo = document.createElement("span");
    tempo.classList.add("message-time");
    tempo.textContent = hora;

    meta.appendChild(avatar);
    meta.appendChild(nome);
    meta.appendChild(tempo);

    // Balão de texto da mensagem
    const bubble = document.createElement("div");
    bubble.classList.add("message-bubble");

    if (remetente === "user") {
        bubble.textContent = texto;
    } else {
        // Conversão segura de markdown para HTML usando a biblioteca marked
        bubble.innerHTML = marked.parse(texto);

        // Insere as fontes de referência se existirem
        if (fontes.length > 0) {
            const sourcesContainer = document.createElement("div");
            sourcesContainer.classList.add("sources-container");

            const sourcesTitle = document.createElement("div");
            sourcesTitle.classList.add("sources-title");
            sourcesTitle.innerHTML = "📚 Fontes";
            sourcesContainer.appendChild(sourcesTitle);

            const sourcesGrid = document.createElement("div");
            sourcesGrid.classList.add("sources-grid");

            fontes.forEach(fonte => {
                const card = document.createElement("a");
                card.href = fonte.url;
                card.target = "_blank";
                card.classList.add("source-card");

                const icon = document.createElement("span");
                icon.classList.add("source-icon");
                icon.textContent = "🌐";

                const textSpan = document.createElement("span");
                textSpan.classList.add("source-text");
                textSpan.textContent = `Abrir fonte oficial ${fonte.text}`;

                card.appendChild(icon);
                card.appendChild(textSpan);
                sourcesGrid.appendChild(card);
            });

            sourcesContainer.appendChild(sourcesGrid);
            bubble.appendChild(sourcesContainer);
        }
    }

    wrapper.appendChild(meta);
    wrapper.appendChild(bubble);
    mensagens.appendChild(wrapper);
    
    scrollToBottom();
}

/**
 * Gerencia o envio de mensagens para a API e atualizações na interface
 */
async function enviarMensagem() {
    const texto = input.value.trim();
    if (texto === "") return;

    const horaEnvio = obterHoraAtual();

    // 1. Insere imediatamente a mensagem do usuário na tela
    adicionarMensagem("user", texto, horaEnvio);
    input.value = "";

    // 2. Define o estado de carregamento (desabilita inputs e mostra indicador "digitando")
    setCarregando(true);

    try {
        const resposta = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mensagem: texto
            })
        });

        if (!resposta.ok) {
            throw new Error(`HTTP error! status: ${resposta.status}`);
        }

        const dados = await resposta.json();
        const respostaBot = dados.resposta || "";

        // Processa as URLs e referências no texto da resposta
        const processed = processarRespostaLinks(respostaBot);
        
        // Finaliza o estado de carregamento (remove indicador "digitando")
        setCarregando(false);

        // 3. Insere a resposta final da IA na tela
        adicionarMensagem("bot", processed.textoLimpo, obterHoraAtual(), processed.fontes);

    } catch (erro) {
        console.error("Erro ao enviar mensagem:", erro);
        setCarregando(false);

        adicionarMensagem("bot", "❌ Desculpe, ocorreu um erro ao tentar processar sua mensagem. Por favor, tente novamente.", obterHoraAtual());
    }
}