from flask import Flask, render_template, request, jsonify
from foundry import criar_conversa, conversar

app = Flask(__name__)

# Cria uma conversa quando o servidor inicia
conversation_id = criar_conversa()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/chat")
def chat():
    return render_template("chat.html")


@app.route("/api/chat", methods=["POST"])
def api_chat():

    data = request.get_json()

    pergunta = data.get("mensagem")

    resposta = conversar(conversation_id, pergunta)

    return jsonify({
        "resposta": resposta
    })


if __name__ == "__main__":
    app.run(debug=True)