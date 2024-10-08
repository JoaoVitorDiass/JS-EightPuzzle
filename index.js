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

    // Verificar movimento para a esquerda
    if (coluna > 0) {
        movimentos.push(trocarValores(matriz, linha, coluna, linha, coluna - 1));
    }

    // Verificar movimento para a direita
    if (coluna < 2) {
        movimentos.push(trocarValores(matriz, linha, coluna, linha, coluna + 1));
    }

    // Verificar movimento para cima
    if (linha > 0) {
        movimentos.push(trocarValores(matriz, linha, coluna, linha - 1, coluna));
    }

    // Verificar movimento para baixo
    if (linha < 2) {
        movimentos.push(trocarValores(matriz, linha, coluna, linha + 1, coluna));
    }

    return movimentos;  // Retorna os estados possíveis
}

function randonmize(id) {

    var matriz = getMatrizAtual(id)
    for (let i = 0; i < RANDOMMIZE; i++) {
        let estadosPossiveis = movimentosPossiveis(matriz);
        matriz = estadosPossiveis[Math.floor(Math.random() * estadosPossiveis.length)]
    }
    updateState(id,matriz)
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false; // Verifica o comprimento

    for (let i = 0; i < arr1.length; i++) {
        if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
            // Se ambos os elementos são matrizes, chama a função recursivamente
            if (!arraysEqual(arr1[i], arr2[i])) return false;
        } else if (arr1[i] !== arr2[i]) {
            return false; // Compara os elementos
        }
    }
    return true; // As matrizes são iguais
}

function encontrarPosicaoVazia(matriz) {
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            if (matriz[i][j] === 0) {
                return { linha: i, coluna: j };
            }
        }
    }
}

function addButonsRunning() {
    $("#buttons").append(
        `<div id="buttons-running" class="card-footer text-center">
            <button id="btn-avancar" class="btn btn-primary me-2" onclick="step()">
                <i class="fas fa-forward"></i> <!-- Ícone Avançar para o final -->
            </button>
            <button id="btn-final" class="btn btn-primary me-2" onclick="full()">
                <i class="fas fa-step-forward"></i> <!-- Ícone Avançar -->
            </button>
            <button id="btn-stop" class="btn btn-danger" 
                    onclick="reset()">
                <i class="fas fa-stop"></i> <!-- Ícone Parar -->
            </button>
        </div>`)
    $('#button-solve').hide()
}

function getCard(element) {
    return `<div>${element[0][0]}</div>
            <div>${element[0][1]}</div>
            <div>${element[0][2]}</div>
            <div>${element[1][0]}</div>
            <div>${element[1][1]}</div>
            <div>${element[1][2]}</div>
            <div>${element[2][0]}</div>
            <div>${element[2][1]}</div>
            <div>${element[2][2]}</div>`
}

function addLine(arr, nivel, pai) {

    let idPai = matrixToString(pai).replaceAll(",","")

    if($(`#nivel-${nivel}`).length == 0) {
        let html = `
            <div id='nivel-${nivel}' class='row'>
                ${
                    arr.map(element => {
                        let idFilho = matrixToString(element).replaceAll(",","")
                        return `
                            <div id="card-${idFilho}" class="card">
                                ${getCard(element)}
                            </div>
                        `
                    })
                }
            </div>
        `
        $("#result").append(html)
    }
    else {
        $(`#nivel-${nivel}`).append(arr.map(element => {
            let idFilho = matrixToString(element).replaceAll(",","")
            return `
                <div id="card-${idFilho}" class="card">
                    ${getCard(element)}
                </div>
            `
        }))
    }

    if(nivel > 0) {
        arr.forEach(element => {
            let idFilho = matrixToString(element).replaceAll(",","")

            let line = new LeaderLine(
                $(`#nivel-${nivel-1}>#card-${idPai}`)[0],
                $(`#nivel-${nivel}>#card-${idFilho}`)[0],
                { 
                    startSocket: 'bottom',
                    endSocket: 'top', 
                    color: 'black', 
                    size: 2, 
                    endPlug: 'arrow' 
                }
            );
            lines.push(line)
        });
        lines.forEach(line => ()=>{
            if(line) 
                line.position()
        });
    }
}

function reset() {
    $('#buttons-running').remove(); 
    running=false; 
    $('#result').html(''); 
    $('#button-solve').show();
    objetivo = null
    arrVisitados.length = 0
    pilha.reset()
    pilhaNivel.reset()
    fila.reset()
    filaNivel.reset()

    lines.forEach(line => {
        if(line && line != undefined)
            line.remove()
    });

    pilhaPercorridos.reset()
    filaPercorridos.reset()

    passos = 0 
    nivelMax = 0
}

function addResumo(line1, line2, line3) {

    var $card = $('<div id="resumo"></div>').css({
        position: 'absolute',       
        top: '20px',                
        left: '20px',               
        backgroundColor: '#fff',    
        padding: '15px',            
        borderRadius: '5px',        
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 1000 
    });

    $card.append(`<p>${line1}</p>`);
    $card.append(`<p>${line2}</p>`);
    $card.append(`<p>${line3}</p>`);

    $('#result').css('position', 'relative');
    $('#result').append($card);

}

$(document).ready(function () {
    initState("estado-inicial");
    initState("estado-final");

    document.getElementById("result").addEventListener('resize', () => {
        line.position();
    });
    document.getElementById('result').addEventListener('scroll', () => {
        line.position(); // Reposiciona as setas ao rolar o conteúdo
    });
    window.addEventListener('scroll', () => {
        line.position();
    });
});