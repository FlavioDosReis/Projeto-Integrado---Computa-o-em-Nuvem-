document.getElementById('clienteForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const cpf = document.getElementById('cpf').value;

  try {
    const response = await fetch('/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, cpf })
    });
    const data = await response.json();
    document.getElementById('mensagem').textContent = data.message;
  } catch (error) {
    document.getElementById('mensagem').textContent = 'Erro ao cadastrar cliente.';
  }
});