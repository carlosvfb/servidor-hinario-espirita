const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/musicas', async (req, res) => {
  const musicas = await prisma.musica.findMany();
  res.json(musicas);
});

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

app.put('/musicas/:id', async (req, res) => {
  const { id } = req.params;  // Agora vamos usar o id
  const { nome, artista, categoria, letra, cifra, cifraSimplificada, urlQrCode } = req.body;

  try {
    // Verifica se a música existe pelo id
    const musicaExistente = await prisma.musica.findUnique({
      where: { id: Number(id) }  // Busca pela chave `id`
    });

    if (!musicaExistente) {
      return res.status(404).json({ error: 'Música não encontrada' });
    }

    // Verifica se já existe uma música com o mesmo nome e artista, mas que não seja a música atual
    const musicaComMesmoNomeEArtista = await prisma.musica.findFirst({
      where: { nome: nome, artista: artista, NOT: { id: Number(id) } }  // Verifica se não é a mesma música
    });

    if (musicaComMesmoNomeEArtista) {
      return res.status(400).json({ error: 'Já existe uma música com esse nome e artista.' });
    }

    // Atualiza a música com os novos dados
    const musicaAtualizada = await prisma.musica.update({
      where: { id: Number(id) },  // Atualiza a música pelo id
      data: { nome, artista, categoria, letra, cifra, cifraSimplificada, urlQrCode }
    });

    res.json(musicaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar música:', error);
    res.status(500).json({ error: 'Erro ao atualizar música' });
  }
});


app.post('/musicas', async (req, res) => {
  const { nome, artista, categoria, letra, cifra, cifraSimplificada, urlQrCode } = req.body;

  try {
    const musicaExistente = await prisma.musica.findFirst({
      where: { nome: nome, artista: artista }
    });

    if (musicaExistente) {
      return res.status(400).json({ error: 'Já existe uma música com esse nome e artista.' });
    }

    const musica = await prisma.musica.create({
      data: { nome, artista, categoria, letra, cifra, cifraSimplificada, urlQrCode }
    });
    res.status(201).json(musica);
  } catch (error) {
    console.error('Erro ao adicionar música:', error);
    res.status(400).send('Erro ao adicionar música');
  }
});

app.listen(3002, () => {
  console.log('API rodando na porta 3002');
});
