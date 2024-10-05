const RANDOMMIZE = 50

function initState(id) {
    const tamanho = 3;
    let quadrados = [];

    for (let i = 1; i <= tamanho * tamanho - 1; i++) {
        quadrados.push(i);
    }

    quadrados.push(0);

    $(`#${id}`).empty();

    quadrados.forEach((valor, index) => {
        const quadrado = $('<div></div>')
            .addClass('box')
            .attr('draggable', valor === 0)
            .text(valor);
        if (valor === 0) {
            quadrado.addClass('vazio').text('');
        }
        $(`#${id}`).append(quadrado);
    });

    setupDragAndDrop(id);
}

function updateState(id, matriz) {
    $(`#${id}`).empty()
    let lista = [];
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            lista.push(matriz[i][j]);  // Adiciona cada elemento na lista
        }
    }
    lista.forEach((valor, index) => {
        const quadrado = $('<div></div>')
            .addClass('box')
            .attr('draggable', valor === 0)
            .text(valor);
        if (valor === 0) {
            quadrado.addClass('vazio').text('');
        }
        $(`#${id}`).append(quadrado);
    });

    setupDragAndDrop(id);
}

function setupDragAndDrop(id) {
    let vazioIndex;

    $(`#${id}>.box`).each(function (index) {
        if ($(this).hasClass('vazio')) {
            vazioIndex = index;
        }
    });

    $(`#${id}>.box`).on('dragstart', function (event) {
        if (!$(this).hasClass('vazio')) {
            event.preventDefault();
        }
    });

    $(`#${id}>.box`).on('dragover', function (event) {
        event.preventDefault();
        if (!$(this).hasClass('vazio')) {
            $(this).addClass('drag-over');
        }
    });

    $(`#${id}>.box`).on('dragleave', function (event) {
        $(this).removeClass('drag-over');
    });

    $(`#${id}>.box`).on('drop', function (event) {
        const dropIndex = $(this).index();
        if (isAdjacent(vazioIndex, dropIndex)) {
            swapBoxes(vazioIndex, dropIndex, id);
            vazioIndex = dropIndex; // Atualiza a posição do vazio
        }
    });
}

function isAdjacent(vazioIndex, targetIndex) {
    const tamanho = 3;
    const [vazioRow, vazioCol] = [Math.floor(vazioIndex / tamanho), vazioIndex % tamanho];
    const [targetRow, targetCol] = [Math.floor(targetIndex / tamanho), targetIndex % tamanho];

    const rowDiff = Math.abs(vazioRow - targetRow);
    const colDiff = Math.abs(vazioCol - targetCol);

    return (rowDiff + colDiff === 1); // Movimentos apenas para cima, baixo, esquerda ou direita
}

function swapBoxes(vazioIndex, targetIndex, id) {
    const quadrados = $(`#${id}>.box`);
    const temp = quadrados.eq(vazioIndex).html();
    quadrados.eq(vazioIndex).html(quadrados.eq(targetIndex).html()).removeClass('vazio').attr('draggable', false);
    quadrados.eq(targetIndex).html(temp).addClass('vazio').attr('draggable', true);
}

function getMatrizAtual(id) {
    var arr = []
    $.each($(`#${id}>.box`), (index, element) => {
        arr.push(Number(element.innerHTML))
    });
    var matriz = []
    let h = 0
    for (let i = 0; i < 3; i++) {
        let linha = [];
        for (let j = 0; j < 3; j++) {
            linha.push(arr[h++]);
        }
        matriz.push(linha);
    }
    return matriz
}

function encontrarPosicaoVazio(matriz) {
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            if (matriz[i][j] === 0) {
                return { linha: i, coluna: j };
            }
        }
    }
    return null;
}

function clonarMatriz(matriz) {
    return matriz.map(linha => linha.slice());  // Cria uma cópia profunda da matriz
}

function trocarValores(matriz, x1, y1, x2, y2) {
    const novaMatriz = clonarMatriz(matriz);
    const temp = novaMatriz[x1][y1];
    novaMatriz[x1][y1] = novaMatriz[x2][y2];
    novaMatriz[x2][y2] = temp;
    return novaMatriz;
}

function movimentosPossiveis(matriz) {
    const posicaoVazio = encontrarPosicaoVazio(matriz);
    const { linha, coluna } = posicaoVazio;
    const movimentos = [];

    // Verificar movimento para cima
    if (linha > 0) {
        movimentos.push(trocarValores(matriz, linha, coluna, linha - 1, coluna));
    }

    // Verificar movimento para baixo
    if (linha < 2) {
        movimentos.push(trocarValores(matriz, linha, coluna, linha + 1, coluna));
    }

    // Verificar movimento para a esquerda
    if (coluna > 0) {
        movimentos.push(trocarValores(matriz, linha, coluna, linha, coluna - 1));
    }

    // Verificar movimento para a direita
    if (coluna < 2) {
        movimentos.push(trocarValores(matriz, linha, coluna, linha, coluna + 1));
    }

    return movimentos;  // Retorna os estados possíveis
}
function randonmize() {
    const id = "estado-inicial"
    var matriz = getMatrizAtual(id)
    for (let i = 0; i < RANDOMMIZE; i++) {
        let estadosPossiveis = movimentosPossiveis(matriz);
        matriz = estadosPossiveis[Math.floor(Math.random() * estadosPossiveis.length)]
    }
    updateState(id,matriz)
}

$(document).ready(function () {
    // Inicializa os quadrados
    initState("estado-inicial");
    initState("estado-final");

});