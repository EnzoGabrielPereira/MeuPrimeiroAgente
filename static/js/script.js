const botaoSobre = document.getElementById("sobre");
const modal = document.getElementById("modalSobre");
const closeBtn = document.getElementById("closeModal");
const fecharBtn = document.getElementById("btnFecharModal");

// Open Modal
botaoSobre.addEventListener("click", () => {
    modal.classList.add("show");
});

// Close Modal functions
function fecharModal() {
    modal.classList.remove("show");
}

closeBtn.addEventListener("click", fecharModal);
fecharBtn.addEventListener("click", fecharModal);

