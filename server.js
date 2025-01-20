const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
app.use(cors());

// Exemplo de conteúdo do musicas.json diretamente no código
const musicas = [
  {
    "nome": "Aos Pés do Monte",
    "artista": "Tim e Vanessa",
    "categoria": "Espírita",
    "letra": `
    Um sentimento me ronda
    Não sei dizer, tudo é novo pra mim
    Meu coração se renova
    Sinto a esperança invadir o meu ser
    Quero ser manso, ser limpo, ser justo
    E pobre de espírito ser
    
    Tua palavra me sonda
    Me conta do Reino que espera por mim
    Eu te ofereço meu pranto
    As dores da alma que quer renascer
    
    Eu ouvi tua voz
    Teu falar me encantou
    Quis seguir, caminhar
    Quis saber pra onde vou
    Eis-me aqui
    Minha dor serenou.`,
    "url": "https://www.cifraclub.com.br/tim-vanessa/aos-pes-do-monte/#tabs=false",
    "urlQrCode": "https://www.cifraclub.com.br/tim-vanessa/aos-pes-do-monte/"
  }
];

// Rota para listar todas as músicas
app.get('/musicas', (req, res) => {
  res.json(musicas);
});

// Rota para buscar uma música específica pelo nome
app.get('/musicas/:nome', (req, res) => {
  const nomeMusica = req.params.nome.toLowerCase();
  const musica = musicas.find(m => m.nome.toLowerCase() === nomeMusica);

  if (musica) {
    res.json(musica);
  } else {
    res.status(404).send('Música não encontrada');
  }
});

app.get('/musicas/:nome/qrcode', async (req, res) => {
  const nomeMusica = req.params.nome.toLowerCase();
  const musica = musicas.find(m => m.nome.toLowerCase() === nomeMusica);

  if (musica) {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(musica.urlQrCode); // Link da música no site
      res.json({ nome: musica.nome, qrCode: qrCodeDataUrl });
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      res.status(500).send('Erro ao gerar QR Code');
    }
  } else {
    res.status(404).send('Música não encontrada');
  }
});

// Iniciar o servidor na porta 3002
app.listen(3002, () => {
  console.log('API rodando na porta 3002');
});
