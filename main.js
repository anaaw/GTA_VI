
// ELEMENTOS DA PÁGINA
// querySelector = procura no HTML o elemento com aquela classe
// querySelectorAll = procura TODOS e devolve uma lista

let nome = document.querySelector(".nome")
let personagem = document.querySelector(".personagem")
let botoes = document.querySelectorAll(".avatar, .voce") // as 3 bolinhas + a selfie
let aviso = document.querySelector(".aviso")

// TROCAR DE PERSONAGEM
// Recebe: nome, caminho da imagem, cor e o botão que foi clicado

function escolherPersonagem(nomePersonagem, imagemPersonagem, cor, botao){

    nome.innerHTML = nomePersonagem
    // innerHTML = colocar algo dentro do HTML

    personagem.src = imagemPersonagem
    // src = colocar algo dentro do src da imagem

    personagem.alt = nomePersonagem
    // alt = descrição da imagem pra leitores de tela

    document.documentElement.style.setProperty("--cor", cor)

    // Marcar qual bolinha está selecionada:
   
    if (botao) {
        botoes.forEach(function(b){ b.classList.remove("ativo") })
        botao.classList.add("ativo")
    }

    // Reiniciar a animação de entrada a cada troca.
    //  desliga a animação, força o navegador a "perceber" (offsetWidth) e liga de novo
    personagem.style.animation = "none"
    nome.style.animation = "none"
    void personagem.offsetWidth
    personagem.style.animation = ""
    nome.style.animation = ""
}

// MENSAGEM DE AVISO (se der erro)

function mostrarAviso(mensagem){

    aviso.textContent = mensagem
    aviso.classList.add("mostrar")

    // setTimeout = espera um tempo (em milissegundos) e depois faz algo
    setTimeout(function(){
        aviso.classList.remove("mostrar")
    }, 4000) // 4 segundos
}

/*
    ALGORITMO 2 (selfie)

    [x] Pegar a imagem do usuario
    [x] Enviar para a IA imagem + o que eu quero que ela faça
    [x] Receber a imagem da IA
    [x] Colocar a imagem no site

*/
function lerFoto(foto){

    // onchange() = quando mudar algo, faça algo
    // onclick() = quando clicar em algo, faça algo
    // onload() = quando carregar algo, faça algo
    // toda vez que eu tenho que ir no SERVIDOR - ASYNC / AWAIT

    // Se abrir o seletor e cancelar - não tem foto ENCERRAR
    if (!foto.files[0]) return

    let botao = foto.parentElement // o <label> do 📸
    botao.classList.add("carregando") // começa a pulsar

    let leitor = new FileReader() // FileReader = Leitor de arquivos
    leitor.readAsDataURL(foto.files[0]) // transforma a foto em URL (link)

    leitor.onload = async function(){

        // try/catch = "tenta fazer isso; se der erro, cai no catch"

        try {
            mostrarAviso("Crie sua conta ou entre com o login para continuar.(Sujeito ao limite gratuito de uso)")
            // await = espera a IA responder antes de continuar
            let desenho = await puter.ai.txt2img("Transforme a pessoa desta foto em um personagem de videogame no estilo de arte de capa do GTA VI, de meio corpo. Preserve a semelhança do rosto, a expressão, a pose, as proporções, as roupas e os acessórios. Renderize com contornos externos pretos grossos, linhas de tinta finas por dentro, blocos de cor limpos, sombreamento em camadas estilo cel shading, gradientes pictóricos e um grão de impressão sutil. Use cores vibrantes de pôr do sol de Miami só na iluminação do personagem: luz pêssego e âmbar nos destaques e sombras azul-violeta. Mantenha anatomia realista, a direção original da luz e transições suaves na pele. Fundo totalmente transparente: sem cenário, sem céu, sem chão, sem sombra projetada, sem logotipo e sem texto.",

               {
                    model: "replicate:openai/gpt-image-2.5-flare",
                    provider: "openai",
                    input_image: leitor.result,
                    quality: "low",
                    providerOptions: { background: "transparent" }
                })

            escolherPersonagem("Você", desenho, '#b9b604', botao)

        } catch (erro) {
            console.log("Erro ao gerar a imagem:", erro) 
            mostrarAviso("Infelizmente não deu para gerar sua selfie :( Tente novamente.")
        }

        botao.classList.remove("carregando") // para de pulsar
        foto.value = "" // limpa o input, assim dá pra escolher a mesma foto outra vez
    }
}