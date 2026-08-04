# ☁️ Guia: ligar a nuvem (salvar vendas em qualquer aparelho)

Este guia é pra você, Lauren. Sem pressa — cada passo tem o que clicar.
Quando terminar, suas vendas ficam salvas na nuvem e aparecem no celular
**e** no PC, com login por e-mail e senha. Tudo **grátis**.

O código já está **100% pronto** esperando só as suas 2 chaves. 👍

---

## Parte 1 — Criar o banco na nuvem (Supabase) · ~5 min

1. Acesse **https://supabase.com** e clique em **"Start your project"**.
2. Entre com o **GitHub** ou com um **e-mail** (crie a conta — é grátis).
3. Clique em **"New project"** e preencha:
   - **Name:** `pudins-da-lauren`
   - **Database Password:** crie uma senha forte e **guarde** (você quase não vai usar, mas anote).
   - **Region:** escolha **South America (São Paulo)**.
4. Clique em **"Create new project"** e espere ~2 minutos (ele monta o banco).

### 1.1 Criar a tabela (copiar e colar)
1. No menu à esquerda, abra **SQL Editor** (ícone de banco/`</>`).
2. Clique em **"New query"**.
3. Abra o arquivo **`supabase/schema.sql`** deste projeto, copie **tudo** e cole ali.
4. Clique em **"Run"** (ou Ctrl+Enter). Deve aparecer **"Success"**. ✅

### 1.2 Pegar as suas 2 chaves
1. No menu, abra **Project Settings** (engrenagem ⚙️) → **API**.
2. Copie estes dois valores:
   - **Project URL** — algo como `https://xxxxxxxx.supabase.co`
   - **anon public** — uma chave longa começando com `eyJ...`
3. **Me mande esses 2 valores** aqui no chat (pode compartilhar sem medo — a
   chave `anon` é pública por design; a segurança fica nas regras do banco que
   já criamos). Se preferir fazer sozinha, veja a Parte 2.

---

## Parte 2 — Colocar as chaves no app (2 formas — escolha 1)

### Forma A — Direto no Vercel (recomendada)
Você faz isso na Parte 3, no painel do Vercel, em **Environment Variables**:
- `REACT_APP_SUPABASE_URL` = a Project URL
- `REACT_APP_SUPABASE_ANON_KEY` = a chave anon

### Forma B — Colar no código
Abra o arquivo **`src/cloud/config.js`** e cole entre as aspas:
```js
const SUPABASE_URL_MANUAL = "https://xxxxxxxx.supabase.co";
const SUPABASE_ANON_KEY_MANUAL = "eyJ...sua-chave...";
```
Salve. Pronto — a nuvem liga sozinha.

> Enquanto as chaves estiverem vazias, o app funciona normal salvando **só
> neste aparelho** (modo protótipo com PIN `1234`). Com as chaves, ele passa
> a pedir **e-mail e senha** e salva na nuvem.

---

## Parte 3 — Publicar o site (Vercel) · ~5 min

1. Acesse **https://vercel.com** e clique em **"Sign Up"** → entre com **GitHub**.
2. Clique em **"Add New… → Project"**.
3. Escolha o repositório **`react-zbh6twhw`** e clique em **"Import"**.
4. Em **Environment Variables**, adicione as duas (se escolheu a Forma A):
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
5. Clique em **"Deploy"** e espere ~2 min.
6. Vai aparecer um endereço tipo **`pudins-da-lauren.vercel.app`** — **esse é o
   seu site de verdade.** Salve nos favoritos e use no celular e no PC. 🎉

---

## Parte 4 — Seu primeiro login

1. Abra o site do Vercel → clique em **"🔒 Área do dono"**.
2. Clique em **"Criar conta"**, informe seu **e-mail** e uma **senha**.
3. O Supabase manda um e-mail de confirmação — clique no link dele.
4. Volte ao site e faça **login**. Pronto! Agora é só registrar vendas.
5. Teste: registre uma venda no PC, abra no celular e faça login — a venda
   **estará lá**. ☁️✅

> Quer pular a confirmação por e-mail nos testes? No Supabase:
> **Authentication → Sign In / Providers → Email** e desligue
> **"Confirm email"**. (Pode religar depois.)

---

## Dúvidas comuns

- **É grátis mesmo?** Sim. Supabase e Vercel têm planos gratuitos de sobra
  pra um negócio começando.
- **Perco os dados que já testei?** Os testes atuais ficam no navegador. Ao
  entrar pela 1ª vez na nuvem, o app **envia o que está neste aparelho** pra
  nuvem. Depois disso, tudo sincroniza.
- **Preciso mexer em código?** Não. Se me mandar as 2 chaves, eu configuro
  o resto. Só o clique de "Deploy" no Vercel é seu.

Qualquer passo que travar, me chama aqui que eu te ajudo na hora. 💛
