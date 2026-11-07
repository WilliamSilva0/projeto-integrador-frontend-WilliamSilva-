/* main.js — Aulas 4 e 5: teste de formato do vídeo, gráfico em Canvas e botão do menu */
(() => {
  // ----- Aula 4 (desafio): qual <source> o navegador deve usar? Compara com '' (nunca como booleano: 'maybe' é truthy) -----
  const video = document.querySelector('.video-cardapio');
  if (video) {
    const fontes = [...video.querySelectorAll('source')];
    console.log('canPlayType webm:', video.canPlayType('video/webm; codecs="vp9, opus"'));
    console.log('canPlayType mp4:', video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'));
    const escolhida = fontes.find((fonte) => video.canPlayType(fonte.type) !== '');
    const aviso = document.createElement('small');
    aviso.textContent = escolhida
      ? `Formato provável neste navegador: ${escolhida.type.split(';')[0].replace('video/', '').toUpperCase()}`
      : 'Nenhum dos formatos parece compatível com este navegador.';
    video.after(aviso);
  }

  // ----- Aula 5: gráfico de barras em Canvas (immediate mode: limpa e redesenha tudo a cada frame) -----
  const canvas = document.getElementById('grafico-pedidos');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const dados = [
      { rotulo: 'Lanches', valor: 120, cor: '#d35400' },
      { rotulo: 'Bebidas', valor: 85, cor: '#f39c12' },
      { rotulo: 'Sobremesas', valor: 40, cor: '#107c41' },
    ];
    const BASE = 190;   // linha de base do gráfico (y)
    const ESCALA = 1.2; // pixels por pedido
    let progresso = 0;  // 0 a 1: quanto da animação já aconteceu

    function desenharFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // sem isso cada frame deixa rastro (Erro 2 da Aula 5)
      progresso = Math.min(progresso + 0.02, 1);
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      dados.forEach((barra, i) => {
        const x = 40 + i * 110;
        const altura = barra.valor * ESCALA * progresso;
        ctx.fillStyle = barra.cor;
        ctx.fillRect(x, BASE - altura, 70, altura);
        ctx.fillStyle = '#2c2c2c';
        ctx.fillText(Math.round(barra.valor * progresso), x + 35, BASE - altura - 6);
        ctx.fillText(barra.rotulo, x + 35, BASE + 18);
      });
      ctx.fillRect(20, BASE, 320, 1);
      if (progresso < 1) requestAnimationFrame(desenharFrame);
    }
    desenharFrame();
  }

  // ----- Botão hambúrguer (extra): alterna a classe e mantém aria-expanded coerente com o estado -----
  const botao = document.querySelector('.menu-hamburguer');
  const menu = document.querySelector('.menu');
  if (botao && menu) {
    botao.addEventListener('click', () => {
      const aberto = menu.classList.toggle('aberto');
      botao.setAttribute('aria-expanded', String(aberto));
      botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });
  }
})();
