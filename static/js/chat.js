const botao = document.getElementById("btnEnviar");

const input = document.getElementById("inputMensagem");

const mensagens = document.getElementById("messages");

botao.addEventListener("click", enviarMensagem);

input.addEventListener("keypress", function(e){

    if(e.key==="Enter"){

        enviarMensagem();

    }

});

function enviarMensagem(){

    const texto = input.value.trim();

    if(texto==="") return;

    mensagens.innerHTML += `
        <div class="message user">
            ${texto}
        </div>
    `;

    input.value="";

    mensagens.innerHTML += `
        <div class="message bot">
            Resposta simulada.<br><br>
            Quando conectarmos ao Microsoft Foundry,
            a resposta aparecerá aqui.
        </div>
    `;

    mensagens.scrollTop = mensagens.scrollHeight;

}