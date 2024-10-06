var running = false
var objetivo

const arrVisitados = []

const pilha = new Stack()
const pilhaNivel = new Stack()

const fila = new PriorityQueue()
const filaNivel = new PriorityQueue()

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

    
    addLine([matrizInicio],0, [matrizInicio] ,0)
}

function buscaProfundidadeStep() {
    
    if(!pilha.isEmpty() && running) {

        let matriz = pilha.pop()
        let nivel  = pilhaNivel.pop()

        arrVisitados.push(matrixToString(matriz))

        if(arraysEqual(matriz,objetivo)) {
            console.log("Achou!")
            running = false
            
            $("#btn-final").hide()
            $("#btn-avancar").hide()
        }
        else {

            movimentos = movimentosPossiveis(matriz)

            let possiveisMovimentos = movimentos.filter(element => {
                if(!arrVisitados.includes(matrixToString(element))) {
                    return element
                }
            })

            if(possiveisMovimentos.length > 0 ) {
                $.each(possiveisMovimentos, function (index, element) { 
                    pilha.push(element)
                    pilhaNivel.push(nivel+1)
                })
                addLine(possiveisMovimentos, nivel+1, matriz)
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

    addLine([matrizInicio],0,0)
}

function buscaAestrelaStep() {
    if(!fila.isEmpty()) {
        let matriz = fila.dequeue().item
        let nivel  = filaNivel.dequeue().item

        if(arraysEqual(matriz, objetivo)) {
            console.log("achou")
            running = false
            $("#btn-final").hide()
            $("#btn-avancar").hide()
        }
        else {
            movimentos = movimentosPossiveis(matriz)

            let possiveisMovimentos = movimentos.filter(element => {
                if(!arrVisitados.includes(matrixToString(element))) {
                    return element
                }
            })

            $.each(possiveisMovimentos.reverse(), function (index, element) { 
            
                distancia = calculaDistanciaManhattan(element,objetivo)
                fila.enqueue(element,distancia)
                filaNivel.enqueue(nivel+1, distancia)

                arrVisitados.push(matrixToString(element))
            })
            addLine(possiveisMovimentos.reverse(), nivel+1)
        }
    }
}

function buscaAestrelaStepFull() {
    if (running) {
        buscaProfundidadeStep();
        requestAnimationFrame(buscaProfundidadeFull); // Chamando novamente
    }
}

function solve() {

    running = true
    addButonsRunning()

    const heuristic = $("#algoritmo").val()
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

        default:
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Selecione um tipo de algoritmo!",
            });
            break
    }
}

function step() {
    console.log("clicou")
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
        case "buscaAestrelaFull":
            buscaAestrelaStep()
            break;
    }
}