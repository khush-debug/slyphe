import React from "react";
import { createRoot } from "react-dom/client";
import { CelestiaStorefront } from "../components/ui/celestia-landing-page";

const rootEl = document.getElementById("storefront-root");
if (rootEl) {
  const root = createRoot(rootEl);
  // Full-resolution 1000px+ photography for every slot and spread in Celestia Lookbook
  const customPhotos = {
    "model-1": "/public/images/model_standing.jpg",
    "model-2": "/public/images/suit_portrait.jpg",
    "model-3": "/public/images/hero_editorial.jpg",
    "intro-scarlet": "/public/images/perfume_peony.jpg",
    "intro-sand": "/public/images/hero_editorial.jpg",
    "intro-chalk": "/public/images/candle_scallop.jpg",
    "campaign-chalk": "/public/images/suit_portrait.jpg",
    "catalog-denim": "/public/images/card_form.jpg",
    "catalog-track": "/public/images/candle_scallop.jpg",
    "catalog-knit": "/public/images/model_standing.jpg",
    "catalog-hoodie": "/public/images/hero_editorial.jpg",
    "catalog-shirt": "/public/images/model_standing.jpg",
    "catalog-sand": "/public/images/card_form.jpg",
    "catalog-suede": "/public/images/suit_portrait.jpg",
    "catalog-leather": "/public/images/perfume_square.jpg",
    "product-1": "/public/images/suit_portrait.jpg",
    "product-2": "/public/images/card_scent.jpg",
    "product-4": "/public/images/perfume_square.jpg",
    "product-5": "/public/images/card_ritual.jpg",
  };
  root.render(<CelestiaStorefront photos={customPhotos} />);
}
