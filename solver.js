
function solve(){

    const algoritmo = $("#algoritmo").val()

    const matrizInicio = getMatrizAtual("estado-inicial")
    const matrizObjetivo = getMatrizAtual("estado-final")

    switch(algoritmo) {
        
        case "buscaProfundidade":
            buscaProfundidade(matrizInicio, matrizObjetivo)
            break

        case "buscaLargura":
            break

        case "buscaAestrela":
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

function buscaProfundidade(matrizInicio, matrizObjetivo) {

    var tempoInicio = new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const pilhaMatriz = new Stack()
    const pilhaMatrizPai = new Stack()
    const pilhaNivel = new Stack()

    var achou = false
    let arrVisitados = array()

    pilhaMatriz.push(matrizInicio)
    pilhaMatrizPai.push(matrizInicio)
    pilhaNivel.push(0)

    while(!pilhaMatriz.isEmpty() && !achou) {

        let matriz = pilhaMatriz.pop()
        let pai    = pilhaMatrizPai.pop()
        let nivel  = pilhaNivel.pop()

        arrVisitados.push(matriz)

        console.log(nivel)
        console.table(matriz)

        if(arraysEqual(matriz, matrizObjetivo)) {
            achou = true
        }
        else {
            console.log("movimentos:")
            $.each(movimentosPossiveis(matriz), (index, element) => {
                let flag = true
                $.each(arrVisitados, (indexVisitados, elementVisitado) => { 
                    if(arraysEqual(element,elementVisitado)) {
                        flag = true
                    }
                });
            });
            // $.each(movimentos, function (index, element) { 
            //     pilhaMatrizPai.push(matriz)
            //     pilhaMatriz.push(element)
            //     pilhaNivel.push(nivel+1)
            // });
        }
    }
    console.log("achou")

}