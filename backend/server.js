const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());

// Servir arquivos estáticos da pasta frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/clientes', (req, res) => {
  const { nome, cpf } = req.body;

  if (!nome || !cpf) {
    return res.status(400).json({ message: 'Nome e CPF são obrigatórios.' });
  }

  console.log('Cliente cadastrado:', nome, cpf);

  res.json({ message: `Cliente ${nome} cadastrado com sucesso!` });
});

// Para qualquer outra rota, enviar o index.html (SPA)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

const AWS = require('aws-sdk');

// Configure a região (exemplo: us-east-1)
AWS.config.update({ region: 'us-east-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient();

app.post('/clientes', (req, res) => {
  const { nome, cpf } = req.body;

  if (!nome || !cpf) {
    return res.status(400).json({ message: 'Nome e CPF são obrigatórios.' });
  }

  const params = {
    TableName: 'Clientes',
    Item: {
      cpf: cpf,
      nome: nome,
      criadoEm: new Date().toISOString()
    }
  };

  dynamodb.put(params, (err) => {
    if (err) {
      console.error('Erro ao inserir no DynamoDB:', err);
      return res.status(500).json({ message: 'Erro ao cadastrar cliente.' });
    }
    res.json({ message: `Cliente ${nome} cadastrado com sucesso!` });
  });
});
