import React from "react";
import { createRoot } from "react-dom/client";
import { CelestiaStorefront } from "../components/ui/knockout-landing-page";

const rootEl = document.getElementById("storefront-root");
if (rootEl) {
  const root = createRoot(rootEl);
  // Pass Celestia editorial assets to showcase the haute couture & parfeumerie pieces
  const customPhotos = {
    "model-1": "/public/images/model_standing.jpg",
    "model-2": "/public/images/suit_portrait.jpg",
    "model-3": "/public/images/hero_editorial.jpg",
    "catalog-denim": "/public/images/card_form.jpg",
    "intro-scarlet": "/public/images/perfume_peony.jpg",
    "catalog-track": "/public/images/candle_scallop.jpg",
    "product-1": "/public/images/model_suit_portrait.jpg",
    "product-2": "/public/images/card_scent.jpg",
    "product-4": "/public/images/perfume_square.jpg",
    "product-5": "/public/images/card_ritual.jpg",
  };
  root.render(<CelestiaStorefront photos={customPhotos} />);
}
