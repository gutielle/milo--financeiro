# 💰 Gastos Pessoais

Aplicação web para controle de gastos pessoais, pensada para a realidade brasileira (São Paulo/SP): Pix como forma de pagamento padrão, categorias de orçamento adaptadas ao dia a dia e valores em Real (R$).

## ✨ Funcionalidades

- **Dashboard mensal** com navegação entre meses (◀ ▶) e comparativo de variação (%) vs. mês anterior
- **Cards de resumo**: Saldo, Receitas e Despesas
- **Gráfico de rosca** com a distribuição dos gastos por categoria
- **Orçamento por categoria** com barras de progresso coloridas (verde ≤ 70%, laranja 71–90%, vermelho > 90%)
- **Lista de transações** com busca, filtros (Tudo / Despesas / Receitas), edição e exclusão
- **Modal de lançamento** com máscara monetária automática (digite `19990` → `R$ 199,90`)
- **Atalho de teclado**: `Ctrl + N` abre o modal de nova transação
- **Persistência local** no navegador (`localStorage`)
- **Layout responsivo**: sidebar fixa no desktop, bottom navigation com FAB no mobile

## 🗂️ Categorias pré-definidas

**Receitas (5):** Salário · Freelance · Investimentos · Bônus/13º · Outros

**Despesas (10, com limite de orçamento):** Moradia · Transporte · Alimentação · Saúde · Lazer · Pessoal · Assinaturas · Dívidas · Educação · Outros

**Formas de pagamento (6):** Pix · Cartão de Crédito · Cartão de Débito · Dinheiro · Boleto · Transferência

## 🛠️ Stack

| Tecnologia | Versão | Uso |
| --- | --- | --- |
| React | 19 | Interface |
| TypeScript | 6 | Tipagem estática |
| Vite | 8 | Build e dev server |
| Tailwind CSS | 4 | Estilização |
| Chart.js + react-chartjs-2 | 4 / 5 | Gráfico de rosca |
| date-fns | 4 | Manipulação de datas |
| lucide-react | 1 | Ícones |
| oxlint | 1 | Lint |

## 🚀 Rodando localmente

Requer **Node.js 20+**.

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run dev

# Build de produção (gera a pasta dist/)
npm run build

# Pré-visualizar o build de produção
npm run preview

# Lint
npm run lint
```

> **Dica:** `npm run dev` sobe por padrão em `http://localhost:5173/`. Se você tem outros projetos Vite rodando na mesma máquina, use `npm run dev -- --port 5180` e acesse por `http://127.0.0.1:5180/`.

## 📁 Estrutura do projeto

```
src/
├── components/
│   ├── dashboard/     # Cards de resumo, gráfico, orçamento, lista de transações
│   ├── layout/        # AppShell, Header, Sidebar, BottomNav
│   └── ui/            # TransactionModal, Toasts
├── data/              # Categorias, formas de pagamento, dados de exemplo
├── pages/             # Dashboard
├── store/             # Context API + persistência em localStorage
├── types/             # Tipos TypeScript
├── utils/             # Formatadores (BRL), datas e cálculos financeiros
├── App.tsx
├── index.css          # Design system (tokens de cor, tipografia, espaçamento)
└── main.tsx
```

## ⚠️ Sobre o armazenamento dos dados

Hoje os dados são salvos **apenas no `localStorage` do navegador** que você está usando. Isso significa que:

- Limpar o cache/dados do navegador **apaga tudo**
- Os dados **não sincronizam** entre dispositivos (celular ≠ computador)
- Trocar de navegador mostra uma base vazia

A chave utilizada é `gastos-pessoais:transactions:v1`. Para uso sério, o próximo passo é migrar a persistência para um banco na nuvem.

## ☁️ Deploy na Vercel

O projeto é uma SPA estática e a Vercel detecta a configuração automaticamente — **não é necessário criar `vercel.json`**.

1. Suba o projeto para um repositório no GitHub (veja abaixo)
2. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório
3. A Vercel identifica o framework **Vite** sozinha. Confirme apenas:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Clique em **Deploy**

A cada `push` na branch `main`, a Vercel publica uma nova versão automaticamente.

### Publicando no GitHub

```bash
git add .
git commit -m "feat: MVP do controle de gastos pessoais"
git remote add origin https://github.com/SEU-USUARIO/gastos---pessoais.git
git push -u origin main
```

## 🗺️ Próximos passos (pós-MVP)

- Página de transações com extrato completo
- Página de categorias com limites editáveis
- Relatórios (mês vs. mês, fixos vs. variáveis)
- Metas financeiras (reserva de emergência, viagens)
- Persistência em nuvem (Supabase) com sincronização entre dispositivos
