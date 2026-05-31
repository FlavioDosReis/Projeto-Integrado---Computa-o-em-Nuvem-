const express = require('express');
const app = express();
const port = 3000;

// Para receber JSON no corpo das requisições
app.use(express.json());

// Rota para receber cadastro de clientes
app.post('/clientes', (req, res) => {
  const { nome, cpf } = req.body;

  // Validação simples
  if (!nome || !cpf) {
    return res.status(400).json({ message: 'Nome e CPF são obrigatórios.' });
  }

  // Aqui você pode salvar no banco de dados (ainda não implementado)
  console.log('Cliente cadastrado:', nome, cpf);

  res.json({ message: `Cliente ${nome} cadastrado com sucesso!` });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
