/* catalogo.js — Aula 11: funções, arrays e DOM. Parte 1 testa no console; Parte 2 leva o resultado para a página.
   Tudo dentro de uma função anônima para não colidir nomes com main.js e logica.js (mesmo escopo global). */
(() => {
  // ---------- Parte 1: funções puras (calculam e devolvem; não mexem na página) ----------
  const PESO_CLIENTES = 0.5;
  function calcularPontuacao(notaClientes, notaEquipe, peso = PESO_CLIENTES) {
    return notaClientes * peso + notaEquipe * (1 - peso); // return, não console.log (Erro 1)
  }
  function classificarItem(pontuacao) {
    if (pontuacao >= 9) return 'Queridinho';
    if (pontuacao >= 7) return 'Aprovado';
    if (pontuacao >= 5) return 'Regular';
    return 'Rever receita';
  }
  const pontuacaoDoItem = (item) => calcularPontuacao(item.notaClientes, item.notaEquipe);
  const formatarPreco = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Lê um card (dataset devolve TEXTO, por isso o Number) e devolve um objeto
  function lerItemDoCard(card) {
    return {
      nome: card.dataset.nome,
      categoria: card.dataset.categoria,
      preco: Number(card.dataset.preco),
      notaClientes: Number(card.dataset.notaClientes), // data-nota-clientes
      notaEquipe: Number(card.dataset.notaEquipe),     // data-nota-equipe
    };
  }

  // ---------- Parte 2: funções que mexem na página ----------
  const CLASSES_DA_FAIXA = {
    'Queridinho': 'faixa-queridinho',
    'Aprovado': 'faixa-aprovado',
    'Regular': 'faixa-regular',
    'Rever receita': 'faixa-rever',
  };

  function exibirPontuacao(card) {
    const item = lerItemDoCard(card);
    const pontuacao = pontuacaoDoItem(item);
    const faixa = classificarItem(pontuacao);
    const paragrafo = document.createElement('p');
    paragrafo.className = 'pontuacao';
    paragrafo.textContent = `${pontuacao.toFixed(1)} · ${faixa}`; // textContent: nunca innerHTML com dados externos
    card.classList.add(CLASSES_DA_FAIXA[faixa]);
    card.append(paragrafo);
  }

  // Recebe um objeto e devolve um card pronto, ainda fora da página
  function criarCardItem(item) {
    const card = document.createElement('article');
    card.className = 'card-item';
    card.dataset.nome = item.nome;
    card.dataset.categoria = item.categoria;
    card.dataset.preco = item.preco;
    card.dataset.notaClientes = item.notaClientes;
    card.dataset.notaEquipe = item.notaEquipe;
    const titulo = document.createElement('h3');
    titulo.textContent = item.nome;
    const meta = document.createElement('p');
    meta.className = 'meta';
    meta.textContent = `${item.categoria} · ${formatarPreco(item.preco)}`;
    const nota = document.createElement('p');
    nota.className = 'nota';
    const destaque = document.createElement('strong');
    destaque.textContent = item.notaClientes;
    nota.append('Clientes: ', destaque);
    card.append(titulo, meta, nota);
    exibirPontuacao(card);
    return card;
  }

  // Monta o painel de resumo a partir de um array (map + reduce)
  function montarResumo(lista) {
    const mediaGeral = lista.map(pontuacaoDoItem).reduce((soma, p) => soma + p, 0) / lista.length;
    const melhor = lista.reduce((atual, item) => (pontuacaoDoItem(item) > pontuacaoDoItem(atual) ? item : atual));
    const linhas = [
      ['Itens no cardápio', lista.length],
      ['Pontuação média', mediaGeral.toFixed(1)],
      ['Campeão da casa', `${melhor.nome} (${pontuacaoDoItem(melhor).toFixed(1)})`],
    ];
    const painel = document.createElement('section');
    painel.className = 'resumo-catalogo';
    const titulo = document.createElement('h3');
    titulo.textContent = 'Resumo do cardápio';
    const itens = document.createElement('ul');
    linhas.forEach(([rotulo, valor]) => {
      const li = document.createElement('li');
      li.textContent = `${rotulo}: ${valor}`;
      itens.append(li);
    });
    painel.append(titulo, itens);
    return painel;
  }

  // ---------- Execução (o script usa defer: o HTML já existe quando ele roda) ----------
  const cards = document.querySelectorAll('.card-item');
  const grade = document.querySelector('.grade-itens');
  if (!grade || cards.length === 0) { // seletor errado devolve null/lista vazia (Erro 5): avisa em vez de quebrar
    console.warn('Cardápio não encontrado na página.');
    return;
  }
  cards.forEach(exibirPontuacao);

  const novosItens = [
    { nome: 'Burger Veggie', categoria: 'Lanches', preco: 27.5, notaClientes: 9.4, notaEquipe: 9.6 },
    { nome: 'Sorvete de Pistache', categoria: 'Sobremesas', preco: 14, notaClientes: 5.2, notaEquipe: 4.6 },
  ];
  novosItens.forEach((item) => grade.append(criarCardItem(item)));

  const catalogoAtual = Array.from(document.querySelectorAll('.card-item'), lerItemDoCard);
  document.querySelector('.intro-avaliacao').after(montarResumo(catalogoAtual));

  // ---------- Console: map, filter, find, some/every, reduce, closure, rest/spread ----------
  console.table(catalogoAtual.map((item) => ({ nome: item.nome, pontuacao: pontuacaoDoItem(item).toFixed(1), faixa: classificarItem(pontuacaoDoItem(item)) })));
  console.log('Destaques (>= 8):', catalogoAtual.filter((item) => pontuacaoDoItem(item) >= 8).map((item) => item.nome));
  console.log('Primeira bebida:', catalogoAtual.find((item) => item.categoria === 'Bebidas').nome);
  console.log('Tem sobremesa?', catalogoAtual.some((item) => item.categoria === 'Sobremesas'), '| Todos >= 8?', catalogoAtual.every((item) => pontuacaoDoItem(item) >= 8));
  const porCategoria = catalogoAtual.reduce((acc, item) => {
    const atual = acc[item.categoria] || { soma: 0, quantidade: 0 };
    atual.soma += pontuacaoDoItem(item);
    atual.quantidade += 1;
    acc[item.categoria] = atual;
    return acc;
  }, {});
  Object.entries(porCategoria).forEach(([categoria, { soma, quantidade }]) => console.log(`${categoria}: ${(soma / quantidade).toFixed(2)} (${quantidade})`));

  function criarContador() { let total = 0; return () => ++total; } // closure: lembra o total entre as chamadas
  const contarCards = criarContador();
  cards.forEach(contarCards);
  console.log('Cards contados pelo closure:', contarCards() - 1);
  const mediaDe = (...notas) => notas.reduce((soma, n) => soma + n, 0) / notas.length; // rest
  console.log('mediaDe(spread):', mediaDe(...catalogoAtual.map(pontuacaoDoItem)).toFixed(2));
  // ERRADO (Erro 4): notas.sort() altera o array original. CERTO: ordenar uma cópia com spread
  const ranking = [...catalogoAtual].sort((a, b) => pontuacaoDoItem(b) - pontuacaoDoItem(a));
  console.log('Ranking:', ranking.map((item) => item.nome));
})();
