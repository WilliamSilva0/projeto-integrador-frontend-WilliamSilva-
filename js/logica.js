/* logica.js — Aula 9: lógica de programação no console (nada é escrito na página).
   Cada etapa fica em um bloco { } para poder ser colada várias vezes sem erro de "já declarado". */

// ETAPA 1 — const/let, typeof e template literal
{
  const nome = 'X-Burguer Especial';
  const preco = 25.9;
  let disponivel = true;
  console.log(typeof nome, typeof preco, typeof disponivel); // string number boolean
  console.log(`${nome} custa R$ ${preco.toFixed(2)}`);
  disponivel = false; // let permite reatribuir; reatribuir uma const dá TypeError
}

// ETAPA 2 — entrada do usuário: prompt devolve TEXTO (ou null no Cancelar), então converte e valida
// Não roda sozinha para não abrir caixas ao carregar o site. Para testar: analisarComPrompt() no console.
function analisarComPrompt() {
  const notaEquipe = 9.0;
  const resposta = prompt('Que nota (0 a 10) você dá para o X-Burguer Especial?');
  // ERRADO (Erro 2): notaEquipe + resposta concatena ("9.08.5") em vez de somar
  const notaCliente = Number(resposta);
  const invalida = resposta === null || resposta.trim() === '' || Number.isNaN(notaCliente) || notaCliente < 0 || notaCliente > 10;
  if (invalida) {
    console.warn('Nota inválida:', resposta);
  } else {
    console.log(`Média com a equipe: ${((notaEquipe + notaCliente) / 2).toFixed(1)}`);
  }
}

// ETAPA 3 — if / else if / else (a ORDEM das faixas importa: da maior para a menor) + ternário
{
  const media = (9.4 + 8.6) / 2; // 9.0
  let faixa;
  if (media >= 9) {
    faixa = 'Queridinho';
  } else if (media >= 7) {
    faixa = 'Aprovado';
  } else if (media >= 5) {
    faixa = 'Regular';
  } else {
    faixa = 'Rever receita';
  }
  console.log(`Média ${media.toFixed(1)}: ${faixa}`);
  console.log(media >= 7 ? 'Manter no cardápio' : 'Revisar com a cozinha');
  // ERRADO (Erro 1): if (media = 10) ATRIBUI 10 e sempre entra no bloco. Certo: if (media === 10)
}

// ETAPA 4 — switch: cada categoria vai para uma estação da cozinha (sem break, a execução "cai" nos cases de baixo: Erro 5)
{
  const categoria = 'Bebidas';
  let estacao;
  switch (categoria) {
    case 'Lanches':
      estacao = 'Chapa';
      break;
    case 'Bebidas':
      estacao = 'Bar';
      break;
    case 'Sobremesas':
      estacao = 'Confeitaria';
      break;
    default:
      estacao = 'Cozinha geral';
  }
  console.log(`${categoria} -> ${estacao}`);
}

// ETAPA 5 — laços com os 3 padrões: acumulador, máximo e contador
/* PSEUDOCÓDIGO
   soma <- 0; melhor <- primeiro item; totalLanches <- 0
   PARA CADA item DO cardápio:
      soma <- soma + item.nota
      SE item.nota > melhor.nota ENTÃO melhor <- item
      SE item.categoria = "Lanches" ENTÃO totalLanches <- totalLanches + 1
   média <- soma / quantidade de itens
   TESTE DE MESA (3 primeiras voltas)
   volta | item                   | nota | soma  | melhor            | totalLanches
     1   | X-Burguer Especial     | 9.2  | 9.2   | X-Burguer Especial| 1
     2   | Smash Duplo            | 8.5  | 17.7  | X-Burguer Especial| 2
     3   | Milkshake de Chocolate | 8.3  | 26.0  | X-Burguer Especial| 2   */
{
  const itens = [
    { nome: 'X-Burguer Especial', categoria: 'Lanches', nota: 9.2 },
    { nome: 'Smash Duplo', categoria: 'Lanches', nota: 8.5 },
    { nome: 'Milkshake de Chocolate', categoria: 'Bebidas', nota: 8.3 },
    { nome: 'Limonada da Casa', categoria: 'Bebidas', nota: 6.5 },
    { nome: 'Brownie com Sorvete', categoria: 'Sobremesas', nota: 7.7 },
  ];
  for (let i = 0; i < itens.length; i++) { // "<", nunca "<=": o índice itens.length não existe (Erro 3)
    console.log(`${i + 1}. ${itens[i].nome}`);
  }
  let soma = 0;
  let melhor = itens[0];
  let totalLanches = 0;
  for (const item of itens) {
    soma += item.nota;
    if (item.nota > melhor.nota) melhor = item;
    if (item.categoria === 'Lanches') totalLanches++;
  }
  console.log(`Média geral: ${(soma / itens.length).toFixed(2)} | Melhor: ${melhor.nome} | Lanches: ${totalLanches}`);

  // ETAPA 6 — while com a condição ATUALIZADA dentro do laço (sem isso: laço infinito, Erro 4) e trava de segurança
  const respostas = ['8', 'abc', '', '11', '9', 'sair']; // simula o que a pessoa digitaria
  let posicao = 0;
  let somaNotas = 0;
  let quantidade = 0;
  let entrada = respostas[posicao];
  while (entrada !== undefined && entrada.toLowerCase() !== 'sair' && posicao < 20) {
    const nota = Number(entrada);
    const invalida = entrada.trim() === '' || Number.isNaN(nota) || nota < 0 || nota > 10;
    if (invalida) {
      console.warn(`"${entrada}" não é uma nota válida.`);
    } else {
      somaNotas += nota;
      quantidade++;
    }
    posicao++;                  // atualiza a condição
    entrada = respostas[posicao];
  }
  console.log(quantidade > 0 ? `Média de ${quantidade} nota(s): ${(somaNotas / quantidade).toFixed(1)}` : 'Nenhuma nota válida.');
  let tentativas = 0;
  do { tentativas++; } while (tentativas < 3); // do...while: executa ao menos uma vez
  console.log('do...while rodou', tentativas, 'vezes');

  // ETAPA 7 — relatório final: laço + if/else if + console.table
  const relatorio = [];
  for (const item of itens) {
    let faixa;
    if (item.nota >= 9) faixa = 'Queridinho';
    else if (item.nota >= 7) faixa = 'Aprovado';
    else if (item.nota >= 5) faixa = 'Regular';
    else faixa = 'Rever receita';
    relatorio.push({ nome: item.nome, nota: item.nota, faixa });
  }
  console.table(relatorio);
}
