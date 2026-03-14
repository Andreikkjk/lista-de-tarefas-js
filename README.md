# Minha Lista de Tarefas (To-Do List) ✅

Este é o meu primeiro projeto prático focado em consolidar os aprendizados de **JavaScript Vanilla**, **Manipulação de DOM** e **LocalStorage**. 

## 🚀 Sobre o Projeto
Uma aplicação simples e direta de Lista de Tarefas onde o usuário pode adicionar novos itens, visualizar os itens salvos, e limpar a lista. O grande diferencial é que os dados persistem no navegador da pessoa usando o `localStorage`, ou seja, se a página for recarregada os dados continuam lá!

### ✨ Funcionalidades
- **Adicionar Tarefas:** Insira novas atividades rapidamente.
- **Persistência de Dados:** As tarefas não somem ao fechar a aba! Elas ficam salvas na memória do seu navegador.
- **Limpar Lista:** Um botão dedicado (com destaque de cor e aviso) que apaga todos os dados do sistema e limpa a tela instantaneamente.
- **Prevenção de Bugs:** O sistema impede a criação de tarefas vazias ou só com espaços (usando o recuso `.trim()`).

## 🛠️ Tecnologias Utilizadas
- **HTML5:** Estruturação semântica.
- **CSS3 (Vanilla):** Estilos aplicados diretamente sem frameworks. Uso de efeitos como Blur, Gradiente nos textos (background-clip), e transições (Hover/Active) nos botões.
- **JavaScript (ES6+):** Lógica principal, criação dinâmica de elementos HTML no DOM e armazenamento de Strings.

## 🧠 Principais Aprendizados
1. Como "ouvir" ações do usuário através do `addEventListener`.
2. A diferença entre manipular o DOM com `createElement` em oposição a apenas injetar blocos de HTML, ganhando mais controle.
3. Como converter textos contínuos (Strings longas) em fragmentos úteis usando o `.split()` em conjunto com o `forEach()` para exibir os dados do LocalStorage de volta na tela.
4. O uso seguro do `localStorage.getItem` e `.setItem`.

---

*Projeto construído passo a passo como fundação dos meus estudos em Front-End.*
