const botaoAdicionar = document.getElementById('botaoAdicionar');
const novaTarefaInput = document.getElementById('novaTarefa');
const listaTarefas = document.getElementById('listaTarefas');
const salvarBotao = document.getElementById('botaoSalvar');
const botaoLimpar = document.getElementById('botaoLimpar');

botaoAdicionar.addEventListener('click', function() {
  const novaTarefa = novaTarefaInput.value.trim();
  if (novaTarefa !== '') {
    const novaLi = document.createElement('li');
    novaLi.textContent = novaTarefa;
    listaTarefas.appendChild(novaLi);
    novaTarefaInput.value = '';
  }
});
salvarBotao.addEventListener('click', function() {
  const contentText = novaTarefaInput.value.trim();
  if (contentText !== '') {
    const savedItems = localStorage.getItem('savedItems') || '';
    const updatedItems = savedItems === '' ? contentText : `${savedItems}\n${contentText}`;
    localStorage.setItem('savedItems', updatedItems);
    novaTarefaInput.value = '';
    listaTarefas.innerHTML = ''; // Limpa a lista antes de recarregar
    loadsavedItems();
  }
});

function loadsavedItems() {
  const savedItems = localStorage.getItem('savedItems');
  if (savedItems) {
    const lines = savedItems.split('\n');
    lines.forEach(function(line) {
      if (line.trim() !== '') {
        const novaLi = document.createElement('li');
        novaLi.id = `tarefa-${lines.length+1}`;
        novaLi.textContent = line.trim(); // Correção aqui
        listaTarefas.appendChild(novaLi);
      }
    });
  }
}

loadsavedItems();

botaoLimpar.addEventListener('click', function() {
  localStorage.removeItem('savedItems');
  listaTarefas.innerHTML = '';
});