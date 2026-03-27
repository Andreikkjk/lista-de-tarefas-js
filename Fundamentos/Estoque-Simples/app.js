// 🏪 PROJETO: SISTEMA DE ESTOQUE SIMPLES
// FASE 2: FRONTEND INTEGRATION - PREMIUM UI

const estoque = [
    { id: 1, nome: "Teclado Gamer", categoria: "Eletrônicos", preco: 150, quantidade: 3 },
    { id: 2, nome: "Mouse sem fio", categoria: "Eletrônicos", preco: 80, quantidade: 12 },
    { id: 3, nome: "Caderno 10 Matérias", categoria: "Papelaria", preco: 25, quantidade: 45 },
    { id: 4, nome: "Caneta Azul", categoria: "Papelaria", preco: 2, quantidade: 100 },
    { id: 5, nome: "Cadeira de Escritório", categoria: "Móveis", preco: 450, quantidade: 2 }
];

// --- SELEÇÃO DE ELEMENTOS DO DOM ---
const bodyTabela = document.getElementById("inventory-body");
const logContent = document.getElementById("log-content");
const statTotal = document.getElementById("stat-total");
const statLow = document.getElementById("stat-low");

// --- FUNÇÕES DE INTERAÇÃO ---

function updateStats() {
    statTotal.innerText = estoque.length;
    statLow.innerText = estoque.filter(p => p.quantidade < 5).length;
}

function updateLog(mensagem, tipo = "info") {
    const p = document.createElement("p");
    p.classList.add("log-entry", tipo);
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour12: false });
    
    p.innerHTML = `<span class="timestamp">[${timeString}]</span> ${mensagem}`;
    
    logContent.prepend(p);
}

function getBadgeClass(categoria) {
    const normalize = categoria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if(normalize === "eletronicos") return "badge-eletronicos";
    if(normalize === "papelaria") return "badge-papelaria";
    if(normalize === "moveis") return "badge-moveis";
    return "";
}

function renderEstoque(lista = estoque) {
    bodyTabela.innerHTML = "";
    
    lista.forEach(p => {
        const tr = document.createElement("tr");
        
        // Estilização condicional da quantidade
        const isLow = p.quantidade < 5;
        const qtdColor = isLow ? 'color: var(--accent-warning); font-weight: bold;' : 'color: var(--text-main); font-weight: 500;';
        const badgeClass = getBadgeClass(p.categoria);
        
        tr.innerHTML = `
            <td>
                <div style="font-weight: 600; color: white;">${p.nome}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">#ID-${p.id.toString().padStart(4, '0')}</div>
            </td>
            <td><span class="badge ${badgeClass}">${p.categoria}</span></td>
            <td style="font-family: var(--font-mono);">R$ ${p.preco.toFixed(2)}</td>
            <td style="${qtdColor} font-size: 1.1rem; text-align: center;">${p.quantidade}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="VenderProduto(${p.id})" class="btn-action btn-vender" title="Vender 1 unidade">
                        <i class="ph ph-shopping-cart"></i> Vender
                    </button>
                    <button onclick="RestockPrompt(${p.id})" class="btn-action btn-repor" title="Repor estoque">
                        <i class="ph ph-plus-circle"></i> Repor
                    </button>
                </div>
            </td>
        `;
        bodyTabela.appendChild(tr);
    });
}

function VenderProduto(id) {
    const produto = estoque.find(p => p.id === id);
    
    if (produto) {
        if (produto.quantidade > 0) {
            produto.quantidade--;
            updateLog(`Venda realizada: ${produto.nome} (-1)`, "success");
            renderEstoque();
            updateStats();
        } else {
            updateLog(`Falha de bloqueio: ${produto.nome} totalmente sem estoque!`, "error");
        }
    }
}

function RestockPrompt(id) {
    const qtd = prompt("Quantidade para repor:");
    if (qtd !== null && !isNaN(qtd) && qtd > 0) {
        ReporEstoque(id, parseInt(qtd));
    } else {
        updateLog("Quantidade inválida informada via prompt.", "error");
    }
}

function ReporEstoque(id, quantidadeAdicional) {
    const produto = estoque.find(p => p.id === id);

    if (produto) {
        produto.quantidade += quantidadeAdicional;
        updateLog(`Reposição confirmada: ${produto.nome} (+${quantidadeAdicional})`, "info");
        renderEstoque();
        updateStats();
    }
}

// --- LÓGICA DE FILTRAGEM DINÂMICA ---
function aplicarFiltros() {
    const cat = document.getElementById("filter-category").value;
    const minPrice = parseFloat(document.getElementById("filter-price").value) || 0;

    const filtrados = estoque.filter(p => {
        const matchCat = cat === "Todas" || p.categoria === cat;
        const matchPrice = p.preco >= minPrice;
        return matchCat && matchPrice;
    });

    renderEstoque(filtrados);
}

// --- EVENT LISTENERS ---

// Filtros
document.getElementById("filter-category").addEventListener("change", () => {
    aplicarFiltros();
    updateLog("Filtro de categoria alterado.", "info");
});
document.getElementById("filter-price").addEventListener("input", aplicarFiltros);

document.getElementById("btn-reset").addEventListener("click", () => {
    document.getElementById("filter-category").value = "Todas";
    document.getElementById("filter-price").value = "";
    renderEstoque();
    updateLog("Reset: Filtros removidos.", "info");
});

// --- LÓGICA DO MODAL (ADICIONAR PRODUTO) ---
const modal = document.getElementById("modal-add");
const formAdd = document.getElementById("form-add-product");

function toggleModal(show) {
    if(show) {
        modal.classList.remove("hidden");
    } else {
        modal.classList.add("hidden");
        formAdd.reset();
    }
}

document.getElementById("btn-add-product").addEventListener("click", () => toggleModal(true));
document.getElementById("btn-close-modal").addEventListener("click", () => toggleModal(false));
document.getElementById("btn-cancel-modal").addEventListener("click", () => toggleModal(false));

formAdd.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const novoNome = document.getElementById("new-name").value.trim();
    const novaCat = document.getElementById("new-category").value;
    const novoPreco = parseFloat(document.getElementById("new-price").value);
    const novaQtd = parseInt(document.getElementById("new-qty").value);

    // Encontra o próximo ID disponível
    const novoId = estoque.length > 0 ? Math.max(...estoque.map(p => p.id)) + 1 : 1;

    const novoProduto = {
        id: novoId,
        nome: novoNome,
        categoria: novaCat,
        preco: novoPreco,
        quantidade: novaQtd
    };

    estoque.push(novoProduto);
    toggleModal(false);
    aplicarFiltros(); // Re-renderiza respeitando filtros atuais mantendo a consistência da view
    updateStats();
    updateLog(`Novo produto cadastrado: [${novoNome}]`, "success");
});

// --- INICIALIZAÇÃO ---
// Limpa o mock inicial do HTML
logContent.innerHTML = '';
renderEstoque();
updateStats();
updateLog("Sistema de Estoque On-line Inicializado (Premium Mode)!", "success");