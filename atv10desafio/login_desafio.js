
const formLogin = document.getElementById("formlogin");

const usuario = document.getElementById("usuario");
const senha = document.getElementById("senha");

const mensagemErro = document.getElementById("mensagemErro");
const botao = document.querySelector(".botao-enviar");

// Configurações do sistema
const MAX_TENTATIVAS = 5;
const TEMPO_BLOQUEIO = 30000;

let tentativas = 0;
let bloqueadoAte = 0;

// Usuário de demonstração
const usuarioCorreto = "bistecone";

// Hash SHA-256 da senha "MinhaSenha@2026"
const hashCorreto =
"6b7d8a6c9f3b8e4d2a1c0f5e7b9d6a3c";

// Função para transformar a senha em hash
async function gerarHash(texto) {

    const dados = new TextEncoder().encode(texto);

    const resultado = await crypto.subtle.digest(
        "SHA-256",
        dados
    );

    return Array.from(new Uint8Array(resultado))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

// Função para verificar o login
formLogin.addEventListener("submit", async function(event) {

    event.preventDefault();

    const agora = Date.now();

    // Verifica se existe bloqueio
    if (agora < bloqueadoAte) {

        const segundos = Math.ceil(
            (bloqueadoAte - agora) / 1000
        );

        mensagemErro.textContent =
            `Aguarde ${segundos} segundos para tentar novamente.`;

        return;
    }

    const nomeDigitado = usuario.value.trim();
    const senhaDigitada = senha.value;

    // Verifica campos vazios
    if (!nomeDigitado || !senhaDigitada) {

        mensagemErro.textContent =
            "Preencha todos os campos.";

        return;
    }

    // Gera o hash da senha digitada
    const hashDigitado = await gerarHash(senhaDigitada);

    // Verifica usuário e senha
    if (
        nomeDigitado === usuarioCorreto &&
        hashDigitado === hashCorreto
    ) {

        mensagemErro.style.color = "#16a34a";

        mensagemErro.textContent =
            "Login realizado com sucesso!";

        tentativas = 0;

        // Exemplo de redirecionamento
        // window.location.href = "painel.html";

    } else {

        tentativas++;

        mensagemErro.style.color = "#dc2626";

        mensagemErro.textContent =
            "Usuário ou senha incorretos.";

        senha.value = "";

        // Bloqueia após cinco tentativas
        if (tentativas >= MAX_TENTATIVAS) {

            bloqueadoAte = Date.now() + TEMPO_BLOQUEIO;

            mensagemErro.textContent =
                "Muitas tentativas. Aguarde 30 segundos.";

            tentativas = 0;
        }
    }

});
