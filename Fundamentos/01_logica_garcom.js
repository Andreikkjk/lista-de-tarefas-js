// --- DESAFIO 1: A Lógica do Garçom ---

const pedidosDeHoje = [
    { mesa: 1, prato: "Pizza", status: "preparando" },
    { mesa: 2, prato: "Massa", status: "aguardando" },
    { mesa: 3, prato: "Salada", status: "preparando" },
    { mesa: 4, prato: "Massa", status: "pronto" }
];

// SUA LÓGICA (O ALGORITMO):
// Passo 1: Pegar as comandas
// Passo 2: olhar cada comanda
// Passo 3: se for massa, separar
// Passo 4: se não for, ignorar
// Passo 5: repetir ate acabarem as comandas
// Passo 6: entregar as massas para o chef

// --- A HORA DO CÓDIGO (A IMPLEMENTAÇÃO) ---

const massasParaOChef = pedidosDeHoje.filter(pedido => {
    // Escreva a lógica aqui: Queremos retornar o pedido 
    // APENAS se o prato for igual a "Massa"
    return pedido.prato === "Massa"; 
});

console.log("Comandas de Massa para o Chef:", massasParaOChef);
