const express = require('express');
const app = express();

// Exemplo de conteúdo do musicas.json diretamente no código
const musicas = [
  {
    "nome": "Aos Pés do Monte",
    "artista": "Tim e Vanessa",
    "categoria": "Espírita",
    "cifra": [
      {
        "cifra": "Am                Dm",
        "letra": "Um sentimento me ronda"
      },
      {
        "cifra": "G                      C        E",
        "letra": "Não sei dizer, tudo é novo pra mim"
      },
      {
        "cifra": "Am               Dm",
        "letra": "Meu coração se renova"
      },
      {
        "cifra": "  G                   C          E",
        "letra": "Sinto a esperança invadir o meu ser"
      }
    ]
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

// Iniciar o servidor na porta 3002
app.listen(3002, () => {
  console.log('API rodando na porta 3002');
});
