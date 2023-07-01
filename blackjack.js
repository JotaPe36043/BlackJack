var somaDoDealer = 0; // Soma das cartas do dealer
var suaSoma = 0; // Soma das suas cartas

var contadorDeAsDoDealer = 0; // Contador de Ases do dealer
var seuContadorDeAs = 0; // Contador de Ases seus

var cartaEscondida; // Carta do dealer que fica escondida
var baralho; // Array que representa o baralho

var podePegarCarta = true; // Permite que o jogador (você) pegue cartas enquanto suaSoma <= 21

var temaJogo = new Audio('sounds/Tema.mp3');

var carteiraInicial = 1500;
var bonusCarteira = 0;

window.onload = function() {
  construirBaralho();
  embaralharBaralho();
}

// Constrói o baralho com todas as combinações de valores e naipes
function construirBaralho() {
  let valores = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  let naipes = ["C", "D", "H", "S"];
  baralho = [];

  for (let i = 0; i < naipes.length; i++) {
    for (let j = 0; j < valores.length; j++) {
      baralho.push(valores[j] + "-" + naipes[i]); // A-C -> K-C, A-D -> K-D
    }
  }
}

// Embaralha as cartas no baralho
function embaralharBaralho() {
  
  for (let i = 0; i < baralho.length; i++) {
    let j = Math.floor(Math.random() * baralho.length); // (0-1) * 52 => (0-51.9999)
    let temp = baralho[i];
    baralho[i] = baralho[j];
    baralho[j] = temp;
  }
}

// Inicia o jogo, distribuindo as cartas para o dealer e o jogador
function iniciarJogo() {
  
  
  cartaEscondida = baralho.pop();
  somaDoDealer += obterValorDaCarta(cartaEscondida);
  contadorDeAsDoDealer += verificarAs(cartaEscondida);

  // Exibir a soma do dealer no elemento "soma-do-dealer"
  document.getElementById("soma-do-dealer").innerText = somaDoDealer

  while (somaDoDealer < 16) {
    let imgCarta = document.createElement("img");
    let carta = baralho.pop();
    imgCarta.src = "./cards/" + carta + ".png";
    somaDoDealer += obterValorDaCarta(carta);
    contadorDeAsDoDealer += verificarAs(carta);

    document.getElementById("cartas-do-dealer").append(imgCarta);
  }

  for (let i = 0; i < 2; i++) {
    setTimeout(comprar, i * 250);
  }
}


// Função chamada quando o jogador (você) clica no botão "Comprar"
function comprar() {
  if (!podePegarCarta) {
    return;
  }
  var num = Math.floor(Math.random() * 4) + 1;
  var compraCarta = new Audio('sounds/comprar_'+num+'.mp3');
  compraCarta.play();
  let imgCarta = document.createElement("img");
  let carta = baralho.pop();
  imgCarta.src = "./cards/" + carta + ".png";
  suaSoma += obterValorDaCarta(carta);
  seuContadorDeAs += verificarAs(carta);
  document.getElementById("suas-cartas").append(imgCarta);

  if (reduzirAs(suaSoma, seuContadorDeAs) > 21) {
    podePegarCarta = false;
    ficar();
    imgCarta.classList.add("carta-voadora");
    document.getElementById("sua-soma").innerText = suaSoma;
    return
  }

  imgCarta.classList.add("carta-voadora");
  var somaDealersEscondido = parseInt(somaDoDealer) - obterValorDaCarta(cartaEscondida);
  var somaDealersEscondidoAs1 = parseInt(somaDealersEscondido) - 10;
  var suaSomaAs1 = parseInt(suaSoma) - 10;
  if (contadorDeAsDoDealer>0 && parseInt(somaDealersEscondido) <= 21 && obterValorDaCarta(cartaEscondida)!= 11){
    document.getElementById("soma-do-dealer").innerText = somaDealersEscondidoAs1 + "/" + somaDealersEscondido;
  }else if (contadorDeAsDoDealer>0 && parseInt(somaDealersEscondido) > 21 && obterValorDaCarta(cartaEscondida)!= 11){
    document.getElementById("soma-do-dealer").innerText = somaDealersEscondidoAs1;
  }else{
    document.getElementById("soma-do-dealer").innerText = somaDealersEscondido;
  }
  if (seuContadorDeAs>0 && parseInt(suaSoma) <= 21){
    document.getElementById("sua-soma").innerText = suaSomaAs1 + "/" + suaSoma;
  }else if (seuContadorDeAs>0 && parseInt(suaSoma) > 21){
    document.getElementById("sua-soma").innerText = suaSomaAs1;
  }else {
    document.getElementById("sua-soma").innerText = suaSoma;
  }
}

// Função chamada quando o jogador (você) clica no botão "Ficar"
function ficar() {
  document.getElementById('resultado').style.display = 'inline-block';
  // Zerar a carteira
  var carteiraAtual = parseInt(document.getElementById('numero_carteira').textContent);
  var apostaAtual = parseInt(document.getElementById('numero_aposta').textContent);
  document.getElementById("comprar").style.display = "none";
  document.getElementById("ficar").style.display = "none";
  document.getElementById("dobrar").style.display = "none";

  // Esvaziar a div que contém os chips
  var divChips = document.getElementById("aposta_feita");
  while (divChips.firstChild) {
    divChips.removeChild(divChips.firstChild);
  }
  somaDoDealer = reduzirAs(somaDoDealer, contadorDeAsDoDealer);
  suaSoma = reduzirAs(suaSoma, seuContadorDeAs);
  podePegarCarta = false;
  document.getElementById("escondida").src = "./cards/" + cartaEscondida + ".png";

  let mensagem = "";

  if (suaSoma == somaDoDealer || (somaDoDealer > 21 && suaSoma > 21)) {
    mensagem = "Empate!";
  } else if (somaDoDealer > 21) {
    mensagem = "Você ganhou!";
    document.getElementById('resultado').style.backgroundColor = '#46ec1c';
  } else if (suaSoma > 21) {
    mensagem = "Você perdeu!";
    document.getElementById('resultado').style.backgroundColor = '#ec1c1c';
  } else if (suaSoma > somaDoDealer) {
    mensagem = "Você ganhou!";
    document.getElementById('resultado').style.backgroundColor = '#46ec1c';
  } else if (suaSoma < somaDoDealer) {
    mensagem = "Você perdeu!";
    document.getElementById('resultado').style.backgroundColor = '#ec1c1c';
  }

  document.getElementById("soma-do-dealer").innerText = parseInt(somaDoDealer);
  document.getElementById("resultado").innerText = mensagem;
  document.getElementById("numero_aposta").textContent = "0";
  if(mensagem == "Você ganhou!"){
    document.getElementById("numero_carteira").textContent = carteiraAtual + (apostaAtual*2);
  }else if (mensagem == "Empate!"){
    document.getElementById("numero_carteira").textContent = carteiraAtual + apostaAtual;
  }
  
}




// Obtém o valor numérico de uma carta
function obterValorDaCarta(carta) {
  let dados = carta.split("-");
  let valor = dados[0];

  if (isNaN(valor)) { // A J Q K
    if (valor == "A") {
      return 11;
    }
    return 10;
  }
  return parseInt(valor);
}

// Verifica se a carta é um Ás
function verificarAs(carta) {
  if (carta[0] == "A") {
    return 1;
  }
  return 0;
}

// Reduz o valor da soma do jogador removendo 10 para cada Ás quando a soma ultrapassa 21
function reduzirAs(somaDoJogador, contadorDeAs) {
  while (somaDoJogador > 21 && contadorDeAs > 0) {
    somaDoJogador -= 10;
    contadorDeAs -= 1;
  }
  return somaDoJogador;
}

function comecaAposta() {
    document.getElementById("telainicial").style.display = "none";
    document.getElementById("apostas").style.display = "block";
    document.getElementById("chips").style.display = "flex";
    document.getElementById("numero-fichas").style.display = "block";
    temaJogo.play();
    document.getElementById('numero_carteira').textContent = carteiraInicial + bonusCarteira;
  }

  

  function moverDiv() {
    var pokerchip = event.target;
    var apostas = document.getElementById('apostas');

    // Reposicionar a pokerchip para a div de apostas
    apostas.appendChild(pokerchip);
  }
  
  function criarCopia(cor, preco) {
    // Verificar se há fundos suficientes na carteira
    var carteira = parseFloat(document.getElementById('numero_carteira').textContent);
    if (preco > carteira) {
      alert('Saldo insuficiente na carteira!');
      return;
    }
    var num = Math.floor(Math.random() * 2) + 1;
    var pokerChip = new Audio('sounds/pokerchip_'+num+'.mp3');
    pokerChip.play();
    // Cria um novo elemento div para representar a ficha copiada
    var fichaCopia = document.createElement('div');
    fichaCopia.className = 'pokerchip ' + cor;
  
    // Define as coordenadas de posicionamento da ficha copiada
    var posicaoTop = document.getElementById('aposta_feita').childElementCount * 20; // Espaço de 20px entre as fichas
    fichaCopia.style.position = 'absolute';
    fichaCopia.style.top = posicaoTop + 'px';
    fichaCopia.style.left = '0';
  
    // Adiciona a cópia da ficha à área de aposta
    document.getElementById('aposta_feita').appendChild(fichaCopia);
    
    // Atualizar o valor da aposta
    var apostaAtual = parseInt(document.getElementById('numero_aposta').textContent);
    var novaAposta = apostaAtual + preco;
    document.getElementById('numero_aposta').textContent = novaAposta.toFixed(0);
  
    // Atualizar o valor da carteira
    var novaCarteira = carteira - preco;
    document.getElementById('numero_carteira').textContent = novaCarteira.toFixed(0);
  
    // Exibir o botão de aposta se houver alguma aposta feita
    if (novaAposta > 0) {
      document.getElementById('botao_aposta').style.display = 'block';
    }
    teste_saldo(novaCarteira)
  }
  function esvaziarAposta() {
    var apostaAtual = parseInt(document.getElementById('numero_aposta').textContent);
    if (apostaAtual>0){
      var num = Math.floor(Math.random() * 2) + 1;
      var puxaChip = new Audio('sounds/puxachip_'+num+'.mp3');
      puxaChip.play();
      var carteiraAtual = parseInt(document.getElementById('numero_carteira').textContent);
      var novaCarteira = carteiraAtual + apostaAtual;
      document.getElementById('numero_carteira').textContent = novaCarteira.toFixed(0);
    
      document.getElementById('aposta_feita').innerHTML = '';
      document.getElementById('numero_aposta').textContent = '0';
    
      document.getElementById('botao_aposta').style.display = 'none';
      teste_saldo(novaCarteira);
    }
  }

  function teste_saldo(saldo) {
    var ficha50 = document.getElementById('ficha50');
    var ficha100 = document.getElementById('ficha100');
    var ficha250 = document.getElementById('ficha250');
    var ficha500 = document.getElementById('ficha500');
    var ficha1000 = document.getElementById('ficha1000');
    if (50>saldo){
      ficha50.style.visibility = 'hidden';
    }else{
      ficha50.style.visibility = 'visible';
    }
    if (100>saldo){
      ficha100.style.visibility = 'hidden';
    }else{
      ficha100.style.visibility = 'visible';
    }
    if (250>saldo){
      ficha250.style.visibility = 'hidden';
    }else{
      ficha250.style.visibility = 'visible';
    }
    if (500>saldo){
      ficha500.style.visibility = 'hidden';
    }else{
      ficha500.style.visibility = 'visible';
    }
    if (1000>saldo){
      ficha1000.style.visibility = 'hidden';
    }else{
      ficha1000.style.visibility = 'visible';
    }
  }
  
  function comecajogo(){
    document.getElementById("apostas").style.display = "none";
    document.getElementById("chips").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    var apostaAtual = parseInt(document.getElementById('numero_aposta').textContent);
    var carteiraAtual = parseInt(document.getElementById('numero_carteira').textContent);
    if (apostaAtual<=carteiraAtual){
      document.getElementById("dobrar").style.display = "inline-block";
    }
    iniciarJogo();
  }

  function dobrar(){
    // Atualizar o valor da aposta
    var apostaAtual = parseInt(document.getElementById('numero_aposta').textContent);
    var novaAposta = apostaAtual*2;
    document.getElementById('numero_aposta').textContent = novaAposta.toFixed(0);
  
    // Atualizar o valor da carteira
    var carteira = parseFloat(document.getElementById('numero_carteira').textContent);
    var novaCarteira = carteira - apostaAtual;
    document.getElementById('numero_carteira').textContent = novaCarteira.toFixed(0);

    var apostaAtual = parseInt(document.getElementById('numero_aposta').textContent);
    var carteiraAtual = parseInt(document.getElementById('numero_carteira').textContent);
    comprar();
      document.getElementById("dobrar").style.display = "none";
    
  }

  function verificarCodigo() {
    // Obtenha o valor do campo de texto
    var codigo = document.getElementById("meuCampo").value;
    var mensagem = document.getElementById("mensagem");

    // Faça a verificação do código aqui
    if (codigo === "CODIGO-TESTE-1000") {
      mensagem.textContent = "1000 pontos adicionados a carteira!";
      mensagem.style.color = "green";
      bonusCarteira += 1000;
    } else {
      mensagem.textContent = "Código inválido!";
      mensagem.style.color = "red";
    }
  }