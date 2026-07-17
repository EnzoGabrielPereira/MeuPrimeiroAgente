// Dom elements
const botao = document.getElementById("btnEnviar");
const input = document.getElementById("inputMensagem");
const mensagens = document.getElementById("messages");

// Setup event listeners
botao.addEventListener("click", enviarMensagem);

input.addEventListener("keydown", (e) => {
    // Enter sends message, Shift + Enter creates newline
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        enviarMensagem();
    }
});

// Auto-expand textarea
input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
});

// Global typing indicator tracking
let typingIndicator = null;

// Initialize chat with greeting message
window.addEventListener("DOMContentLoaded", () => {
    // Add default initial message
    adicionarMensagem("bot", "Olá! Como posso ajudar?", obterHoraAtual());
    input.focus();
});

/**
 * Obtains current time in HH:MM format
 */
function obterHoraAtual() {
    const agora = new Date();
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
}

/**
 * Auto-scroll to bottom of chat smoothly
 */
function scrollToBottom() {
    mensagens.scrollTo({
        top: mensagens.scrollHeight,
        behavior: "smooth"
    });
}

/**
 * Toggle UI state loading/normal
 */
function setCarregando(carregando) {
    botao.disabled = carregando;
    input.disabled = carregando;
    if (carregando) {
        exibirIndicadorDigitando();
    } else {
        removerIndicadorDigitando();
        // Reset textarea height to default
        input.style.height = "auto";
        input.focus();
    }
}

/**
 * Displays "Mister está digitando..." indicator
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
 * Removes typing indicator
 */
function removerIndicadorDigitando() {
    if (typingIndicator) {
        typingIndicator.remove();
        typingIndicator = null;
    }
}

/**
 * Parses URLs out of response, replaces them with superscript citation notes,
 * and compiles the list of sources.
 */
function processarRespostaLinks(textoOriginal) {
    const links = [];
    const linkMap = new Map();
    let index = 1;
    let textoProcessado = textoOriginal;

    // 1. Match Markdown Links [Title](URL)
    const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    textoProcessado = textoProcessado.replace(markdownLinkRegex, (match, text, url) => {
        if (!linkMap.has(url)) {
            linkMap.set(url, { index: index++, text: text });
            links.push({ url: url, text: text });
        }
        const idx = linkMap.get(url).index;
        return `${text}<sup>[${idx}]</sup>`;
    });

    // 2. Match Raw URLs (excluding ones inside parentheses already handled)
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
 * Creates and appends a message element in the chat
 */
function adicionarMensagem(remetente, texto, hora, fontes = []) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper");
    wrapper.classList.add(remetente === "user" ? "user-message" : "bot-message");

    // Meta section
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

    // Bubble section
    const bubble = document.createElement("div");
    bubble.classList.add("message-bubble");

    if (remetente === "user") {
        bubble.textContent = texto;
    } else {
        // Safe markdown parsing using marked
        bubble.innerHTML = marked.parse(texto);

        // Append Sources if present
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
 * Handles sending messages to the API and updating UI
 */
async function enviarMensagem() {
    const texto = input.value.trim();
    if (texto === "") return;

    const horaEnvio = obterHoraAtual();

    // 1. Immediately append user's message
    adicionarMensagem("user", texto, horaEnvio);
    input.value = "";

    // 2. Set loading state (disables input and triggers typing indicator)
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

        // Process response for links and markdown
        const processed = processarRespostaLinks(respostaBot);
        
        // Turn off loading (removes typing indicator)
        setCarregando(false);

        // 3. Append bot response
        adicionarMensagem("bot", processed.textoLimpo, obterHoraAtual(), processed.fontes);

    } catch (erro) {
        console.error("Erro ao enviar mensagem:", erro);
        setCarregando(false);

        adicionarMensagem("bot", "❌ Desculpe, ocorreu um erro ao tentar processar sua mensagem. Por favor, tente novamente.", obterHoraAtual());
    }
}