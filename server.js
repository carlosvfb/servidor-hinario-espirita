const express = require('express');
const app = express();

// Exemplo de conteúdo do musicas.json diretamente no código
const musicas = [
  {
    "nome": "Oração de São Francisco",
    "artista": "Desconhecido",
    "categoria": "Espírita",
    "cifra": [
      {
        "linha": "C      G       Am     F",
        "letra": "Senhor, fazei-me um instrumento de vossa paz"
      },
      {
        "linha": "F      Dm      G        C",
        "letra": "Onde houver ódio, que eu leve o amor"
      }
    ]
  },
  {
    "nome": "Canção do Amor",
    "artista": "Outro Artista",
    "categoria": "Espírita",
    "cifra": [
      {
        "linha": "G      C       D      G",
        "letra": "Onde houver amor, que eu leve a luz"
      },
      {
        "linha": "D      Em      C       G",
        "letra": "Onde houver tristeza, que eu leve alegria"
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
