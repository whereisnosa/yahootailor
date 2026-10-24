# Yahoo Tailor Landing Page

A responsive, standalone storefront built with HTML, CSS and vanilla JavaScript.

## Run it
1. Extract the ZIP.
2. Open `index.html` in Chrome, Edge or Firefox.
3. An internet connection is needed for Google Fonts and the remote product/hero photos.

## Included
- Responsive desktop and mobile layout
- Four product cards with editable names and NGN prices
- Product search
- Shopping cart drawer with quantity controls and subtotal
- Custom-order enquiry form that prepares/copies a message
- No framework or build step required

## Before using it for real sales
1. **Replace the demo photos** in `styles.css` with photos of your actual products. The current images are remote placeholders and may not match the exact product design.
2. **Confirm every price** against your supplier costs and your target margin.
3. In `script.js`, set `const whatsappNumber = "";` to your WhatsApp Business number in international digits only (Nigeria example format: `23480...`, without `+`, spaces or dashes). This enables direct WhatsApp checkout.
4. The cart is a front-end demo: it does not save orders to a database or accept payments. For real checkout, connect a backend and a payment provider such as Paystack after testing the business model.
5. The quote form does not send anything to a server; it prepares a message for the customer to copy.

## Customize products
Edit the `PRODUCTS` object in `script.js` and the matching product cards in `index.html`. Prices are in naira.


## Pages
- `index.html` — landing page
- `shop.html` — dedicated shop page with category filters, search, shared cart, and custom-order enquiry flow

Keep `index.html`, `shop.html`, `styles.css`, and `script.js` in the same folder. Prices and product descriptions are demo content and should be confirmed before launch.
