const express = require('express');
const path = require('path');
const AWS = require('aws-sdk');

const app = express();
const port = 3000;

// Configurar região AWS
AWS.config.update({ region: 'us-east-1c' }); 

const dynamodb = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

// Servir arquivos estáticos da pasta frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/clientes', (req, res) => {
  const { nome, cpf } = req.body;

  if (!nome || !cpf) {
    return res.status(400).json({ message: 'Nome e CPF são obrigatórios.' });
  }

  const params = {
    TableName: 'Clientes', // substitua pelo nome da sua tabela DynamoDB
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

// Exemplo para listar clientes
app.get('/clientes', (req, res) => {
  const params = {
    TableName: 'Clientes'
  };

  dynamodb.scan(params, (err, data) => {
    if (err) {
      console.error('Erro ao buscar clientes:', err);
      return res.status(500).json({ message: 'Erro ao buscar clientes.' });
    }
    res.json(data.Items);
  });
});

// Exemplo para atualizar cliente
app.put('/clientes/:cpf', (req, res) => {
  const cpf = req.params.cpf;
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ message: 'Nome é obrigatório para atualização.' });
  }

  const params = {
    TableName: 'Clientes',
    Key: { cpf: cpf },
    UpdateExpression: 'set nome = :n',
    ExpressionAttributeValues: {
      ':n': nome
    },
    ReturnValues: 'UPDATED_NEW'
  };

  dynamodb.update(params, (err, data) => {
    if (err) {
      console.error('Erro ao atualizar cliente:', err);
      return res.status(500).json({ message: 'Erro ao atualizar cliente.' });
    }
    res.json({ message: `Cliente ${cpf} atualizado com sucesso!`, updatedAttributes: data.Attributes });
  });
});

// Exemplo para deletar cliente
app.delete('/clientes/:cpf', (req, res) => {
  const cpf = req.params.cpf;

  const params = {
    TableName: 'Clientes',
    Key: { cpf: cpf }
  };

  dynamodb.delete(params, (err) => {
    if (err) {
      console.error('Erro ao deletar cliente:', err);
      return res.status(500).json({ message: 'Erro ao deletar cliente.' });
    }
    res.json({ message: `Cliente ${cpf} deletado com sucesso!` });
  });
});

// Para qualquer outra rota, enviar o index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});