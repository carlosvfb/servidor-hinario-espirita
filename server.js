const express = require('express');
const fs = require('fs');
const app = express();

// Função para ler o arquivo de músicas e retornar os dados
const lerMusicas = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('musicas.json', 'utf8', (err, data) => {
      if (err) {
        reject('Erro ao ler o arquivo');
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

// Rota para listar todas as músicas
app.get('/musicas', async (req, res) => {
  try {
    const musicas = await lerMusicas();
    res.json(musicas);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Rota para buscar uma música específica pelo nome
app.get('/musicas/:nome', async (req, res) => {
  try {
    const nomeMusica = req.params.nome.toLowerCase();
    const musicas = await lerMusicas();
    const musica = musicas.find(m => m.nome.toLowerCase() === nomeMusica);

    if (musica) {
      res.json(musica);
    } else {
      res.status(404).send('Música não encontrada');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Iniciar o servidor na porta 3000
app.listen(3002, () => {
  console.log('API rodando na porta 3002');
});
