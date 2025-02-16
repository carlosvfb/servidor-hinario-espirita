const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Rota para listar todas as músicas
app.get('/musicas', async (req, res) => {
  const musicas = await prisma.musica.findMany();
  res.json(musicas);
});

// Rota para buscar uma música por nome
app.get('/musicas/:nome', async (req, res) => {
  const nomeMusica = req.params.nome.toLowerCase();

  const musica = await prisma.musica.findFirst({
    where: { nome: { equals: nomeMusica, mode: 'insensitive' } }
  });

  if (musica) {
    res.json(musica);
  } else {
    res.status(404).send('Música não encontrada');
  }
});

// Rota para gerar QR Code da música
app.get('/musicas/:nome/qrcode', async (req, res) => {
  const nomeMusica = req.params.nome.toLowerCase();

  const musica = await prisma.musica.findFirst({
    where: { nome: { equals: nomeMusica, mode: 'insensitive' } }
  });

  if (musica) {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(musica.urlQrCode);
      res.json({ nome: musica.nome, qrCode: qrCodeDataUrl });
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      res.status(500).send('Erro ao gerar QR Code');
    }
  } else {
    res.status(404).send('Música não encontrada');
  }
});

// Rota para adicionar uma nova música
app.post('/musicas', async (req, res) => {
  const { nome, artista, categoria, letra, cifra, url, urlQrCode } = req.body;

  try {
    const musica = await prisma.musica.create({
      data: { nome, artista, categoria, letra, cifra, url, urlQrCode }
    });
    res.status(201).json(musica);
  } catch (error) {
    console.error('Erro ao adicionar música:', error);
    res.status(400).send('Erro ao adicionar música');
  }
});

// Iniciar o servidor
app.listen(3002, () => {
  console.log('API rodando na porta 3002');
});
