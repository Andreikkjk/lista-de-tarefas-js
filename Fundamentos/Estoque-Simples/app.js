// 🏪 PROJETO: SISTEMA DE ESTOQUE SIMPLES
//
// OBJETIVO: 
// Vamos aplicar Lógica, Git e SQL em um mini-sistema real.
// Primeiro, vamos definir nossos "Dados" (como se fosse uma tabela do Banco).

const estoque = [
    { id: 1, nome: "Teclado Gamer", categoria: "Eletrônicos", preco: 150, quantidade: 3 },
    { id: 2, nome: "Mouse sem fio", categoria: "Eletrônicos", preco: 80, quantidade: 12 },
    { id: 3, nome: "Caderno 10 Matérias", categoria: "Papelaria", preco: 25, quantidade: 45 },
    { id: 4, nome: "Caneta Azul", categoria: "Papelaria", preco: 2, quantidade: 100 },
    { id: 5, nome: "Cadeira de Escritório", categoria: "Móveis", preco: 450, quantidade: 2 }
];

// --- FASE 1: LOGICA DE NEGÓCIO ---
//
// O dono da loja quer que o sistema avise quando um produto tem menos de 5 unidades.
// Como você faria isso? Pense na lógica primeiro.

console.log("--- 📦 Relatório de Estoque ---");

// TENTE ESCREVER ABAIXO: 
// Use o .filter() para criar uma lista chamada 'estoqueBaixo' 
// com produtos que tenham quantidade < 5.
const EstoqueBaixo =
estoque.filter (n => {
    return n.quantidade < 5;
});

console.log("Produtos com estoque baixo:", EstoqueBaixo);
