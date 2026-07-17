const botaoSobre = document.getElementById("sobre");
const modal = document.getElementById("modalSobre");
const closeBtn = document.getElementById("closeModal");
const fecharBtn = document.getElementById("btnFecharModal");

// Abrir o Modal
botaoSobre.addEventListener("click", () => {
    modal.classList.add("show");
});

// Funções para fechar o Modal
function fecharModal() {
    modal.classList.remove("show");
}

closeBtn.addEventListener("click", fecharModal);
fecharBtn.addEventListener("click", fecharModal);

