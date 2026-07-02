const botao = document.getElementById("btnEnviar");
const input = document.getElementById("inputMensagem");
const mensagens = document.getElementById("messages");

botao.addEventListener("click", enviarMensagem);

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        enviarMensagem();
    }
});

async function enviarMensagem() {

    const texto = input.value.trim();

    if (texto === "") return;

    mensagens.innerHTML += `
        <div class="message user">
            ${texto}
        </div>
    `;

    input.value = "";

    mensagens.scrollTop = mensagens.scrollHeight;

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

        const dados = await resposta.json();

        mensagens.innerHTML += `
            <div class="message bot">
                ${dados.resposta}
            </div>
        `;

        mensagens.scrollTop = mensagens.scrollHeight;

    } catch (erro) {

        mensagens.innerHTML += `
            <div class="message bot">
                ❌ Erro ao conversar com o agente.
            </div>
        `;

        console.error(erro);
    }

}