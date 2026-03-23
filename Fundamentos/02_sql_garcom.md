# 🗄️ Módulo 3: Onde os Dados Moram (SQL)

No exercício anterior, você filtrou uma lista no JavaScript usando `.filter()`. No mundo real, os dados não ficam soltos no código, eles ficam em **Bancos de Dados**.

A linguagem que usamos para conversar com esses bancos é o **SQL**.

---

## 📊 A Tabela de Pedidos

Imagine que a nossa lista de pedidos agora é uma planilha do Excel (uma tabela) chamada `pedidos`:

| mesa | prato  | status     |
| ---- | ------ | ---------- |
| 1    | Pizza  | preparando |
| 2    | Massa  | aguardando |
| 3    | Salada | preparando |
| 4    | Massa  | pronto     |

---

## 🔍 Como o SQL "pensa"

Para fazer o mesmo que você fez no JS, o SQL usa 3 palavras mágicas:

1. **SELECT**: "O que eu quero ver?" (Use `*` para ver tudo)
2. **FROM**: "Em qual tabela os dados estão?"
3. **WHERE**: "Qual é o meu filtro?" (Igual ao seu passo 3 da lógica!)

**Exemplo para as Massas:**

```sql
SELECT * FROM pedidos WHERE prato = 'Massa';
```

---

## 🛠️ SEU DESAFIO

Escreva abaixo as consultas SQL para os seguintes problemas (não precisa rodar nada, apenas escreva a lógica aqui no arquivo):

**1. O Chef quer ver apenas o pedido da Mesa 3:**
SELECT mesa FROM pedidos WHERE mesa = 3;

**2. O Garçom quer ver todos os pratos que já estão com o status 'pronto':**
SELECT status FROM pedidos WHERE status = 'pronto';

**3. (BÔNUS) Como você selecionaria apenas as colunas 'mesa' e 'prato' de todos os pedidos?**
SELECT mesa, prato FROM pedidos;
