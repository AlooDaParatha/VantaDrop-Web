# Vanta Drop Web

The web storefront for Vanta Drop, with product pages, a cart, checkout, and success and cancel pages. The static site lives in `public/` and uses product photos from `public/assets/products/`.

## What's inside

- `public/` - the storefront (`index.html`, `product.html`, `cart.html`, `cancel.html`, `success.html`) with CSS and JavaScript in `css/` and `js/`.
- `vantadrop-stripe-server/` - the Stripe payment server that handles checkout.
- `server/` - additional server code.
- `firebase.json` and `.firebaserc` - Firebase Hosting configuration. The site is hosted at `vantadrop1.web.app`.

## Running locally

1. Run `npm install` in the project folder.
2. Start the site with the Firebase emulator or open `public/index.html` in a browser.

*This repository includes configuration and secrets files. Keep it private.*