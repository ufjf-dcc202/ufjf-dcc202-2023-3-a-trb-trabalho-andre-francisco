// Variáveis globais
let turn = 1; // Vez do jogador (1 ou 2)
let dice = 0; // Valor do dado selecionado
let cells1 = []; // Array com os valores das células do jogador 1
let cells2 = []; // Array com os valores das células do jogador 2
let score1 = 0; // Pontuação do jogador 1
let score2 = 0; // Pontuação do jogador 2
let filled1 = 0; // Número de células preenchidas pelo jogador 1
let filled2 = 0; // Número de células preenchidas pelo jogador 2

// Seletores dos elementos do HTML
let player1 = document.getElementById("player1");
let player2 = document.getElementById("player2");
let score1Element = document.getElementById("score1");
let score2Element = document.getElementById("score2");
let message = document.getElementById("message");

// Array de caminhos das imagens do dado
const Dados = [
    './dados/dado1.png',
    './dados/dado2.png',
    './dados/dado3.png',
    './dados/dado4.png',
    './dados/dado5.png',
    './dados/dado6.png'
];

// Função para gerar números aleatórios de 1 a 6
function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

// Função para obter o caminho da imagem correspondente ao valor do dado
function getDiceImage(value) {
    // Certifique-se de que o valor esteja dentro do intervalo de 1 a 6
    value = Math.min(Math.max(value, 1), 6);
    return Dados[value - 1];
}


// Função para adicionar um evento de clique às células
function addCellClick(cellElement) {
    cellElement.addEventListener("click", function () {
        // Verificar se a célula está vazia
        if (!cellElement.querySelector('img')) {
            // Gerar um número aleatório para o dado
            dice = rollDice();
            // Obter o caminho da imagem correspondente ao valor do dado
            const diceImage = getDiceImage(dice);
            
            // Criar um elemento img e definir seu atributo src
            const imgElement = document.createElement('img');
            imgElement.src = diceImage;
            imgElement.alt = `dice${dice}`;

            // Adicionar o elemento img à célula
            cellElement.appendChild(imgElement);

            // Verificar qual jogador está jogando
            if (turn === 1) {
                // Adicionar o valor da célula ao array do jogador 1
                cells1.push(dice);
                // Incrementar o número de células preenchidas pelo jogador 1
                filled1++;
                // Descartar os dados do jogador 2 que tenham o mesmo valor
                discard(2, dice);
                // Calcular a pontuação do jogador 1
                score1 = calculateScore(cells1);
                // Atualizar a pontuação do jogador 1 no HTML
                score1Element.textContent = score1;
                // Verificar se o jogo acabou
                if (filled1 === 9) {
                    // Mostrar a mensagem de fim de jogo
                    endGame();
                } else {
                    // Mudar a vez para o jogador 2
                    changeTurn();
                }
            } else {
                // Adicionar o valor da célula ao array do jogador 2
                cells2.push(dice);
                // Incrementar o número de células preenchidas pelo jogador 2
                filled2++;
                // Descartar os dados do jogador 1 que tenham o mesmo valor
                discard(1, dice);
                // Calcular a pontuação do jogador 2
                score2 = calculateScore(cells2);
                // Atualizar a pontuação do jogador 2 no HTML
                score2Element.textContent = score2;
                // Verificar se o jogo acabou
                if (filled2 === 9) {
                    // Mostrar a mensagem de fim de jogo
                    endGame();
                } else {
                    // Mudar a vez para o jogador 1
                    changeTurn();
                }
            }
        }
    });
}

// Adicionar o evento de clique às células dos jogadores
for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 6; j++) {
        addCellClick(document.getElementById("cell" + i + j));
    }
}

// Função para descartar os dados do oponente que tenham o mesmo valor
function discard(player, value) {
    // Verificar qual jogador está sendo afetado
    if (player === 1) {
        // Percorrer as células do jogador 1
        for (let i = 1; i <= 3; i++) {
            for (let j = 1; j <= 3; j++) {
                // Pegar a célula atual
                let cell = document.getElementById("cell" + i + j);
                // Verificar se a célula tem o mesmo valor do dado
                if (cell.querySelector('img') && cell.querySelector('img').alt === `dice${value}`) {
                    // Limpar a célula
                    cell.innerHTML = "";
                    // Remover o valor da célula do array do jogador 1
                    cells1.splice(cells1.indexOf(value), 1);
                    // Decrementar o número de células preenchidas pelo jogador 1
                    filled1--;
                }
            }
        }
    } else {
        // Percorrer as células do jogador 2
        for (let i = 1; i <= 3; i++) {
            for (let j = 4; j <= 6; j++) {
                // Pegar a célula atual
                let cell = document.getElementById("cell" + i + j);
                // Verificar se a célula tem o mesmo valor do dado
                if (cell.querySelector('img') && cell.querySelector('img').alt === `dice${value}`) {
                    // Limpar a célula
                    cell.innerHTML = "";
                    // Remover o valor da célula do array do jogador 2
                    cells2.splice(cells2.indexOf(value), 1);
                    // Decrementar o número de células preenchidas pelo jogador 2
                    filled2--;
                }
            }
        }
    }
}

// Função para calcular a pontuação de um jogador
function calculateScore(cells) {
    // Inicializar a pontuação
    let score = 0;
    // Verificar se o array de células está vazio
    if (cells.length === 0) {
        // Retornar zero
        return score;
    }
    // Ordenar o array de células em ordem crescente
    cells.sort((a, b) => a - b);
    // Inicializar o valor e a quantidade do dado atual
    let value = cells[0];
    let count = 1;
    // Percorrer o array de células a partir do segundo elemento
    for (let i = 1; i < cells.length; i++) {
        // Verificar se o elemento atual é igual ao anterior
        if (cells[i] === value) {
            // Incrementar a quantidade do dado atual
            count++;
        } else {
            // Somar a pontuação do dado atual
            score += value * count * count; // Alterar a fórmula aqui
            // Atualizar o valor e a quantidade do dado atual
            value = cells[i];
            count = 1;
        }
    }
    // Somar a pontuação do último dado
    score += value * count * count; 
    // Retornar a pontuação
    return score;
}


// Função para mudar a vez do jogador
function changeTurn() {
    // Verificar qual jogador estava jogando
    if (turn === 1) {
        // Mudar a vez para o jogador 2
        turn = 2;
        // Atualizar a mensagem no HTML
        message.textContent = "Vez do jogador 2";
        // Desativar o jogador 1
        player1.classList.add("disabled");
        // Ativar o jogador 2
        player2.classList.remove("disabled");
    } else {
        // Mudar a vez para o jogador 1
        turn = 1;
        // Atualizar a mensagem no HTML
        message.textContent = "Vez do jogador 1";
        // Desativar o jogador 2
        player2.classList.add("disabled");
        // Ativar o jogador 1
        player1.classList.remove("disabled");
    }
}

// Função para mostrar a mensagem de fim de jogo
function endGame() {
    // Verificar qual jogador ganhou
    if (score1 > score2) {
        // Mostrar a mensagem de vitória do jogador 1
        message.textContent = "Jogador 1 venceu!";
    } else if (score1 < score2) {
        // Mostrar a mensagem de vitória do jogador 2
        message.textContent = "Jogador 2 venceu!";
    } else {
        // Mostrar a mensagem de empate
        message.textContent = "Empate!";
    }
}

