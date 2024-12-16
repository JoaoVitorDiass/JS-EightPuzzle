# Resolução de Problemas por Meio de Busca

Este projeto é uma implementação de um jogo de resolução de problemas utilizando técnicas de **busca heurística** e **busca A***. O objetivo é encontrar a sequência de passos correta para chegar a um estado final definido pelo usuário a partir de um estado inicial embaralhado.

## 📋 Funcionalidades

- Permitir ao usuário:
  - Definir o estado final do jogo.
  - Embaralhar as peças para criar o estado inicial.
  - Escolher o tipo de busca para solução (incluindo obrigatoriamente A*).
  - Optar por calcular o 1º nível ou o 2º nível de buscas heurísticas.
- Utilizar funções de avaliação como:
  - Quantidade de peças fora do lugar.
  - Soma das distâncias Manhattan de cada peça em relação ao estado final.
- Exibir:
  - A solução encontrada (sequência de passos).
  - Quantidade de passos (nós) visitados.
  - Tempo gasto para encontrar a solução.
  - Tamanho do caminho da solução encontrada.

## 🚀 Como usar

1. Clone este repositório:
   ```bash
   git clone https://github.com/JoaoVitorDiass/JS-EightPuzzle.git
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd JS-EightPuzzle
   ```

3. Abra o arquivo `index.html` no navegador

5. Interaja com a interface:
   - Defina o estado final e embaralhe as peças.
   - Escolha a função de avaliação e a técnica de busca.
   - Visualize a solução passo a passo.

## 🎨 Tecnologias Utilizadas

- **HTML**: Estrutura do jogo e interface.
- **CSS**: Estilização visual.
- **JavaScript**: Implementação da lógica do jogo e algoritmos de busca.

---
