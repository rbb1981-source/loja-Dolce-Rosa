# Dolce Rosa Professional - Loja Virtual

Loja responsiva em HTML, CSS e JavaScript puro, pronta para hospedagem no GitHub Pages.

## Como publicar no GitHub Pages

1. Envie `index.html`, `styles.css`, `script.js`, `README.md` e a pasta `assets` para um repositório no GitHub.
2. A pasta `assets/catalog` e o arquivo `assets/contact-sheet.jpg` são materiais brutos de trabalho e já estão ignorados pelo `.gitignore`.
3. Abra `Settings` > `Pages`.
4. Em `Build and deployment`, selecione `Deploy from a branch`.
5. Escolha a branch principal e a pasta raiz.

## WhatsApp

No arquivo `script.js`, preencha a constante `WHATSAPP_NUMBER` com o número desejado no formato internacional, somente dígitos.

Exemplo:

```js
const WHATSAPP_NUMBER = "5511999999999";
```

Se a constante ficar vazia, o botão abre o WhatsApp com a mensagem pronta para compartilhar com um contato escolhido.

## Mercado Pago com GitHub Pages

O GitHub Pages continua hospedando a loja. Para o checkout automático do Mercado Pago, publique a pasta do projeto também na Vercel, que vai usar a função segura `api/create-preference.js`.

### Configurar na Vercel

1. Crie um projeto na Vercel usando este repositório.
2. Em `Settings` > `Environment Variables`, adicione:
   - `MP_ACCESS_TOKEN`: seu access token do Mercado Pago.
   - `PUBLIC_SITE_URL`: endereço público da loja no GitHub Pages.
   - `ALLOWED_ORIGIN`: endereço público da loja no GitHub Pages.
3. Faça o deploy.
4. Copie a URL da Vercel, por exemplo `https://sua-loja.vercel.app`.
5. No arquivo `script.js`, preencha:

```js
const MERCADO_PAGO_BACKEND_URL = "https://sua-loja.vercel.app";
```

Depois disso, ao escolher `Mercado Pago` no carrinho, o botão cria o checkout seguro e redireciona o cliente para pagamento.
