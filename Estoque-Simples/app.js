// ==========================================
// CONFIGURAÇÕES DO SUPABASE (PREENCHA AQUI)
// ==========================================
const supabaseUrl = ""; // Cole sua URL do painel
const supabaseKey = ""; // Cole sua chave anon
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// ==========================================
// ESTADO GLOBAL DO SISTEMA
// ==========================================
let categorias = [];
let produtos = [];
const ESTOQUE_BAIXO_THRESHOLD = 5; // Configurável

// Elementos do DOM
const terminal = document.getElementById("terminal-log");
const tbody = document.getElementById("inventory-body");
const statTotal = document.getElementById("stat-total");
const statLow = document.getElementById("stat-low");

// ==========================================
// SISTEMA DE LOGS (TERMINAL)
// ==========================================
function logTerminal(message, type = "action") {
    const p = document.createElement("p");
    p.classList.add("log-entry", type);
    
    const time = new Date().toLocaleTimeString([], { hour12: false });
    p.innerHTML = `<span class="log-time">[${time}]</span>> ${message}`;
    
    terminal.appendChild(p);
    terminal.scrollTop = terminal.scrollHeight; // Auto-scroll pro final
}

// ==========================================
// FETCH (READ) - SUPABASE
// ==========================================
async function fetchCategorias() {
    logTerminal("Executando fetch em 'categorias'...", "init");
    const { data, error } = await supabaseClient.from('categorias').select('*').order('nome', { ascending: true });
    
    if (error) {
        logTerminal(`ERRO (Categorias): ${error.message}`, "error");
        return;
    }
    
    categorias = data;
    logTerminal(`${data.length} categorias carregadas.`, "success");
    atualizarSelectsCategoria();
}

async function fetchProdutos() {
    logTerminal("Executando fetch em 'produtos' (JOIN com categorias)...", "init");
    
    // O Supabase faz o JOIN (Inner/Left Join) automaticamente quando solicitamos a tabela relacionada pela Foreign Key
    const { data, error } = await supabaseClient
        .from('estoque produtos')
        .select(`
            id,
            nome,
            preco,
            quantidade,
            categoria_id,
            categorias ( nome )
        `)
        .order('id', { ascending: false });
        
    if (error) {
        logTerminal(`ERRO (Produtos): ${error.message}`, "error");
        return;
    }
    
    produtos = data;
    logTerminal(`${data.length} produtos carregados.`, "success");
    aplicarFiltros(); // Renderiza na tela
}

// ==========================================
// INSERÇÃO E ATUALIZAÇÃO (CREATE / UPDATE)
// ==========================================
async function criarCategoria(nome) {
    logTerminal(`Inserindo categoria: ${nome}...`, "action");
    const { error } = await supabaseClient.from('categorias').insert([{ nome }]);
    
    if (error) {
        logTerminal(`ERRO: ${error.message}`, "error");
        return;
    }
    
    logTerminal(`Categoria '${nome}' criada com sucesso.`, "success");
    await fetchCategorias();
}

async function criarProduto(nome, categoria_id, preco, quantidade) {
    logTerminal(`Inserindo produto: ${nome}...`, "action");
    const { error } = await supabaseClient.from('estoque produtos').insert([{ 
        nome, 
        categoria_id, 
        preco, 
        quantidade 
    }]);
    
    if (error) {
        logTerminal(`ERRO: ${error.message}`, "error");
        return;
    }
    
    logTerminal(`Produto '${nome}' adicionado com sucesso.`, "success");
    await fetchProdutos();
}

async function alterarQuantidade(id, novaQtd, nomeProduto, acao) {
    if (novaQtd < 0) {
        logTerminal(`Bloqueio: ${nomeProduto} está sem estoque!`, "error");
        return;
    }

    logTerminal(`Processando ${acao} para ${nomeProduto}...`, "action");
    const { error } = await supabaseClient.from('estoque produtos').update({ quantidade: novaQtd }).eq('id', id);

    if (error) {
        logTerminal(`ERRO: ${error.message}`, "error");
        return;
    }

    logTerminal(`${acao} concluída: ${nomeProduto} (Nova Qtd: ${novaQtd})`, "success");
    await fetchProdutos();
}

// Funções chamadas pelos botões HTML
window.VenderProduto = (id) => {
    const p = produtos.find(item => item.id === id);
    if(p) alterarQuantidade(id, p.quantidade - 1, p.nome, 'VENDA');
};

window.ReporPrompt = (id) => {
    const p = produtos.find(item => item.id === id);
    if(!p) return;
    const add = parseInt(prompt(`Quantidade para repor (${p.nome}):`));
    if (add && add > 0) {
        alterarQuantidade(id, p.quantidade + add, p.nome, 'REPOSIÇÃO');
    }
};

// ==========================================
// RENDERIZAÇÃO E UI
// ==========================================
function atualizarSelectsCategoria() {
    const filterSelect = document.getElementById("filter-category");
    const inputSelect = document.getElementById("input-categoria");
    
    filterSelect.innerHTML = '<option value="ALL">ALL CATEGORIES</option>';
    inputSelect.innerHTML = '<option value="" disabled selected>SELECIONE...</option>';
    
    categorias.forEach(cat => {
        filterSelect.innerHTML += `<option value="${cat.id}">${cat.nome.toUpperCase()}</option>`;
        inputSelect.innerHTML += `<option value="${cat.id}">${cat.nome.toUpperCase()}</option>`;
    });
}

// Animação de contagem de números (Microinteração)
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function renderizarTabela(lista) {
    tbody.innerHTML = "";
    let lowStockCount = 0;

    lista.forEach(p => {
        const tr = document.createElement("tr");
        const isLow = p.quantidade < ESTOQUE_BAIXO_THRESHOLD;
        if (isLow) lowStockCount++;
        
        const qtdClass = isLow ? "qtd-low" : "qtd-ok";
        
        // O Supabase retorna o array do join na prop 'categorias'
        const nomeCategoria = p.categorias ? p.categorias.nome : "Sem Categoria";
        
        tr.innerHTML = `
            <td><span class="id-badge">#${String(p.id).padStart(4, '0')}</span></td>
            <td class="item-name">${p.nome}</td>
            <td><span class="cat-badge">${nomeCategoria.toUpperCase()}</span></td>
            <td>R$ ${Number(p.preco).toFixed(2)}</td>
            <td class="${qtdClass}">${p.quantidade}</td>
            <td>
                <div class="control-actions" style="justify-content: flex-start; gap: 0.5rem">
                    <button class="btn-ghost" onclick="VenderProduto(${p.id})">[ SELL ]</button>
                    <button class="btn-ghost" onclick="ReporPrompt(${p.id})">[ RESTOCK ]</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Anima stats se houver mudança
    if(parseInt(statTotal.innerText) !== lista.length) {
        animateValue(statTotal, parseInt(statTotal.innerText) || 0, lista.length, 500);
    }
    if(parseInt(statLow.innerText) !== lowStockCount) {
        animateValue(statLow, parseInt(statLow.innerText) || 0, lowStockCount, 500);
    }
}

// ==========================================
// FILTROS
// ==========================================
function aplicarFiltros() {
    const catId = document.getElementById("filter-category").value;
    const minPrice = parseFloat(document.getElementById("filter-min-price").value) || 0;
    const maxPrice = parseFloat(document.getElementById("filter-max-price").value) || Infinity;

    const filtrados = produtos.filter(p => {
        const matchCat = catId === "ALL" || String(p.categoria_id) === catId;
        const matchPrice = p.preco >= minPrice && p.preco <= maxPrice;
        return matchCat && matchPrice;
    });

    renderizarTabela(filtrados);
}

document.getElementById("filter-category").addEventListener("change", () => {
    logTerminal("Filtro aplicado: Categoria.", "action");
    aplicarFiltros();
});
document.getElementById("filter-min-price").addEventListener("input", aplicarFiltros);
document.getElementById("filter-max-price").addEventListener("input", aplicarFiltros);

document.getElementById("btn-reset-filters").addEventListener("click", () => {
    document.getElementById("filter-category").value = "ALL";
    document.getElementById("filter-min-price").value = "";
    document.getElementById("filter-max-price").value = "";
    logTerminal("Filtros resetados.", "action");
    aplicarFiltros();
});

// ==========================================
// MODAIS E EVENTOS DE FORMULÁRIO
// ==========================================
const modalProd = document.getElementById("modal-product");
const modalCat = document.getElementById("modal-category");

document.getElementById("btn-open-modal").addEventListener("click", () => modalProd.classList.remove("hidden"));
document.getElementById("btn-open-cat-modal").addEventListener("click", () => modalCat.classList.remove("hidden"));
document.getElementById("btn-cancel-modal").addEventListener("click", () => modalProd.classList.add("hidden"));
document.getElementById("btn-cancel-cat-modal").addEventListener("click", () => modalCat.classList.add("hidden"));

document.getElementById("form-category").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("input-cat-nome").value.trim();
    await criarCategoria(nome);
    e.target.reset();
    modalCat.classList.add("hidden");
});

document.getElementById("form-product").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("input-nome").value.trim();
    const catId = document.getElementById("input-categoria").value;
    const preco = parseFloat(document.getElementById("input-preco").value);
    const qtd = parseInt(document.getElementById("input-qtd").value);
    
    await criarProduto(nome, catId, preco, qtd);
    e.target.reset();
    modalProd.classList.add("hidden");
});

// ==========================================
// BOOT SEQUENCE
// ==========================================
async function init() {
    logTerminal("BOOT SEQUENCE INITIATED...", "init");
    await fetchCategorias();
    await fetchProdutos();
    logTerminal("SYSTEM READY.", "success");
}

init();