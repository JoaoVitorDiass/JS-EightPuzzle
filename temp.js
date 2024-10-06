function buscaProfundidade(matrizInicio, matrizObjetivo) {
    const pilhaMatriz = []; 
    const arrVisitados = []; 
    let achou = false;

    pilhaMatriz.push(matrizInicio);
    
    // Função auxiliar para encontrar a posição do bloco vazio (0)
    while (pilhaMatriz.length > 0 && !achou) {
        let matrizAtual = pilhaMatriz.pop();

        if (arraysEqual(matrizAtual, matrizObjetivo)) {
            achou = true;
            console.log("Matriz objetivo encontrada!");
            console.table(matrizAtual);
            break;
        }
        arrVisitados.push(matrizAtual);

        const proximosMovimentos = movimentosPossiveis(matrizAtual);

        proximosMovimentos.forEach(novaMatriz => {
            if (!arrVisitados.some(visitado => arraysEqual(visitado, novaMatriz))) {
                pilhaMatriz.push(novaMatriz);
            }
        });
    }

    if (!achou) {
        console.log("Não foi possível encontrar a solução.");
    }
}
