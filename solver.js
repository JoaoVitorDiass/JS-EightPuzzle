var running = false
var objetivo

var passos = 0
var nivelMax = 0

const arrVisitados = []
const lines = []

const pilha = new Stack()
const pilhaNivel = new Stack()

const pilhaPercorridos = new Stack()

const fila = new PriorityQueue()
const filaNivel = new PriorityQueue()

const filaPercorridos = new PriorityQueue()

function calculaDistanciaManhattan(matriz, matrizObjetivo) {
    var distancia = 0 
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < j; j++) {
            for (let k = 0; k < 3; k++) {
                for (let l = 0; l < 3; l++) {
                    let estadoAtual = matriz[i][j]
                    let estadoFinal = matrizObjetivo[k][l]

                    if(estadoAtual == estadoFinal && estadoAtual != 0) {
                        distancia += Math.abs(i - k) + Math.abs(j - l)
                    }
                }
            }
        }
    }
    return distancia
}

function matrixToString(matrix) {
    return matrix.map(row => row.join(',')).join(',');
}

//----------------------------------

function buscaProfundidade(matrizInicio, matrizObjetivo) {


    pilha.push(matrizInicio)
    pilhaNivel.push(0)

    addLine([matrizInicio],0, [matrizInicio])
}

function buscaProfundidadeStep() {
    
    if(!pilha.isEmpty() && running) {

        let matriz = pilha.pop()
        let nivel  = pilhaNivel.pop()

        if( nivelMax < nivel ){
            nivelMax = nivel
        }

        passos ++

        pilhaPercorridos.push([nivel,matrixToString(matriz).replaceAll(",","")])

        arrVisitados.push(matrixToString(matriz))

        if(arraysEqual(matriz,objetivo)) {
            running = false
            
            addResumo("Nós visitados: "+passos,"Tempo gasto: ","Tamanho: "+(nivel+1))

            pintaCaminhoPilha()

            $("#btn-final").hide()
            $("#btn-avancar").hide()
        }
        else {

            movimentos = movimentosPossiveis(matriz)

            let possiveisMovimentos = movimentos.filter(element => {
                if(!arrVisitados.includes(matrixToString(element)) || arraysEqual(element,objetivo)) {
                    return element
                }
            })

            $.each(possiveisMovimentos, function (index, element) { 
                pilha.push(element)
                pilhaNivel.push(nivel+1)
            })
            addLine(possiveisMovimentos, nivel+1, matriz)

            if(possiveisMovimentos.length == 0 ) {
                pilhaPercorridos.pop()
            }
        }
    }
}

function buscaProfundidadeFull() {
    if (running) {
        buscaProfundidadeStep();
        requestAnimationFrame(buscaProfundidadeFull); // Chamando novamente
    }
}

function buscaAestrela(matrizInicio, matrizObjetivo) {
    distancia = calculaDistanciaManhattan(matrizInicio,matrizObjetivo)
    fila.enqueue(matrizInicio,distancia)
    filaNivel.enqueue(0,distancia)

    addLine([matrizInicio],0,[matrizInicio])
}

function buscaAestrelaStep() {

    if(!fila.isEmpty()) {
        let matriz = fila.dequeue().item
        let nivel  = filaNivel.dequeue().item

        passos ++

        filaPercorridos.enqueue(matrixToString(matriz).replaceAll(",",""),nivel)

        if(arraysEqual(matriz, objetivo)) {
            running = false

            pintaCaminhoFila()
            addResumo("Nós visitados: "+passos,"Tempo gasto: ","Tamanho: "+nivel)

            $("#btn-final").hide()
            $("#btn-avancar").hide()
        }
        else {
            movimentos = movimentosPossiveis(matriz)

            let possiveisMovimentos = movimentos.filter(element => {
                if(!arrVisitados.includes(matrixToString(element)) || arraysEqual(element,objetivo)) {
                    return element
                }
            })

            $.each(possiveisMovimentos, function (index, element) { 
                distancia = calculaDistanciaManhattan(element,objetivo)
                fila.enqueue(element,distancia)
                filaNivel.enqueue(nivel+1, distancia)

                arrVisitados.push(matrixToString(element))
            })
            addLine(possiveisMovimentos, nivel+1, matriz)

        }
    }
}

function buscaAestrelaFull() {
    if (running) {
        buscaAestrelaStep();
        requestAnimationFrame(buscaAestrelaFull); // Chamando novamente
    }
}

function pintaCaminhoPilha() {
    
    while(!pilhaPercorridos.isEmpty()) {
        let elem = pilhaPercorridos.pop()

        $(`#nivel-${elem[0]}>#card-${elem[1]}`).css('background-color', '#90ffcc');
    }
}

function pintaCaminhoFila() {
    
    while(!filaPercorridos.isEmpty()) {
        let elem = filaPercorridos.dequeue()

        $(`#nivel-${elem.priority}>#card-${elem.item}`).css('background-color', '#90ffcc');
    }
}

function solve() {

    $(".leader-line").remove()
    $("#resumo").remove()

    passos = 0

    const heuristic = $("#algoritmo").val()
    
    if(heuristic == "") {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Selecione um tipo de algoritmo!",
        });
    }
    else {
        running = true
        addButonsRunning()

        const matrizInicio = getMatrizAtual("estado-inicial")
        const matrizObjetivo = getMatrizAtual("estado-final")

        objetivo = matrizObjetivo

        switch (heuristic) {

            case "buscaProfundidade":
                buscaProfundidade(matrizInicio, matrizObjetivo)
                break
    
            case "buscaAestrela":
                buscaAestrela(matrizInicio, matrizObjetivo)
                break
        }
    }
}

function step() {
    const heuristic = $("#algoritmo").val()

    switch(heuristic) {
        case "buscaProfundidade":
            buscaProfundidadeStep()
            break;
        case "buscaAestrela":
            buscaAestrelaStep()
            break;
    }
}

function full() {
    
    const heuristic = $("#algoritmo").val()

    switch(heuristic) {
        case "buscaProfundidade":
            buscaProfundidadeFull()
            break;
        case "buscaAestrela":
            buscaAestrelaFull()
            break;
    }
}