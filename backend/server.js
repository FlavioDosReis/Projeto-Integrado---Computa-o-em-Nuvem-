const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Para receber JSON no corpo das requisições
app.use(express.json());

// Servir arquivos estáticos da pasta frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rota para receber cadastro de clientes
app.post('/clientes', (req, res) => {
  const { nome, cpf } = req.body;

  if (!nome || !cpf) {
    return res.status(400).json({ message: 'Nome e CPF são obrigatórios.' });
  }

  console.log('Cliente cadastrado:', nome, cpf);

  res.json({ message: `Cliente ${nome} cadastrado com sucesso!` });
});

// Para qualquer outra rota, enviar o index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
