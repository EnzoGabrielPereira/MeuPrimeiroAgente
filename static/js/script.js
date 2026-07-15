const botaoSobre = document.getElementById("sobre");
const botaoComecar = document.getElementsByClassName("btn-primary");

botaoComecar.addEventListener("click", () => {
   window.location.href = "chat.html";
})


botaoSobre.addEventListener("click", () => {

    alert(
`CopaIA

Projeto desenvolvido utilizando Microsoft Foundry.

Este agente responde perguntas relacionadas à Copa do Mundo de 2026.`
    );

});