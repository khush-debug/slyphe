"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { Asterisk, ArrowDown, ArrowUpRight, RotateCcw, ShoppingBag, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import "@fontsource-variable/manrope";

const storefrontStyles = `:root[data-celestia-theme] {
  font-family: "Manrope Variable", system-ui, sans-serif;
  font-synthesis: none;
  color-scheme: light;
  background: var(--page);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}

:root[data-celestia-theme="dark"] {
  color-scheme: dark;
}

*, *::before, *::after { box-sizing: border-box; }
:root[data-celestia-theme] body { background: var(--page); color: var(--ink); font-family: inherit; margin: 0; }
img { display: block; max-inline-size: 100%; }
button, input { font: inherit; }
button { color: inherit; cursor: pointer; }
button:disabled { cursor: default; }
a { color: inherit; text-decoration: none; }
:where(a, button, input):focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 4px;
}

.preview-icon-button {
  display: inline-grid;
  place-items: center;
  flex: none;
  inline-size: 44px;
  block-size: 44px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--page);
}

.preview-icon-button:hover:enabled { background: var(--surface); }
.preview-icon-button:disabled { opacity: .4; }
.preview-icon-button svg { inline-size: 18px; block-size: 18px; }

.preview-dialog {
  color: var(--ink);
  background: var(--page);
  border: 1px solid var(--line);
  padding: 0;
  width: min(760px, calc(100% - 28px));
  max-height: calc(100% - 28px);
  overscroll-behavior: contain;
}

.preview-dialog::backdrop { background: rgb(12 12 12 / .72); }
.preview-dialog-inner { position: relative; }
.preview-close { position: absolute; z-index: 1; top: 12px; right: 12px; }

.preview-skip {
  position: fixed;
  top: 8px;
  left: 8px;
  z-index: 30;
  transform: translateY(-150%);
  color: var(--ink);
  background: var(--page);
  padding: 12px 16px;
}

.preview-skip:focus { transform: none; }

.preview-visually-hidden {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  white-space: nowrap;
  clip-path: inset(50%);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
  }
}

:root[data-celestia-theme] {
  scrollbar-gutter: stable;
  --cutline-obsidian: #050505;
  --cutline-cream: #ebded8;
  --cutline-signal: #d91b16;
  --product: #eeeae7;
}

:root[data-celestia-theme], [data-cutline-theme="light"] {
  --page: var(--cutline-cream);
  --ink: #151211;
  --muted: #675955;
  --line: #bfb0aa;
  --surface: #e0d0c8;
  --focus: #ab1513;
  --accent: #bb1815;
  --accent-ink: #fff1eb;
}

:root[data-celestia-theme="dark"], [data-cutline-theme="dark"] {
  --page: var(--cutline-obsidian);
  --ink: #eae0da;
  --muted: #a59892;
  --line: #4b4240;
  --surface: #201c1b;
  --focus: #ff7265;
  --accent: #ff6255;
  --accent-ink: #1a0807;
}

:root[data-celestia-theme="signal"], [data-cutline-theme="signal"] {
  --page: var(--cutline-signal);
  --ink: #fff0eb;
  --muted: #ffefeb;
  --line: #e38a7b;
  --surface: #8d1715;
  --focus: #fff0eb;
  --accent: #fff0eb;
  --accent-ink: #8f1714;
}

::selection { background: var(--accent); color: var(--accent-ink); }

.cutline {
  --edge: clamp(14px, 2.35vw, 44px);
  --gap: clamp(9px, 1.35vw, 24px);
  --nav-height: clamp(52px, 4.6vw, 74px);
}
.cutline-wrap { width: calc(100% - var(--edge) * 2); margin-inline: auto; }
.cutline-scroll-content { padding-top: var(--nav-height); }
/* Hash links must scroll the document, not the fixed smoothing wrapper. */
.cutline-scroll-frame[data-smoothed] { overflow: clip !important; }
.cutline button { padding: 0; border: 0; background: none; }
.cutline :where(a, button):focus-visible { outline-offset: 3px; }
.cutline .preview-dialog button.preview-close { background: var(--page); border: 1px solid var(--line); }

.cutline-header {
  position: fixed;
  z-index: 5;
  inset: 0 0 auto;
  background: var(--page);
}

.cutline-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--nav-height);
}

.cutline button.cutline-logo {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-inline-start: -11px;
}

.cutline-logo svg { width: 27px; height: 27px; stroke-width: 1.45; }
.cutline-header nav { display: flex; align-items: center; gap: clamp(12px, 2.37vw, 38px); }
.cutline-header nav > :is(a, button) {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  white-space: nowrap;
  font-size: .79rem;
  letter-spacing: -.015em;
  font-weight: 800;
}

.cutline-header nav > a { text-decoration: underline; text-underline-offset: 4px; }
.cutline-header nav > :is(a, button):hover, .cutline-logo:hover { color: var(--accent); }
.cutline-swatches { display: flex; align-items: center; margin-inline-end: -7px; }

.cutline-swatches button {
  display: grid;
  place-items: center;
  width: 27px;
  height: 44px;
}

.cutline-swatches span { width: 11px; height: 11px; border: 1px solid var(--line); border-radius: 50%; }
.cutline-swatches [aria-pressed="true"] span { outline: 1px solid var(--ink); outline-offset: 3px; }
.cutline-swatches [aria-disabled="true"] { pointer-events: none; }

.cutline-hero { padding-top: clamp(2px, .95vw, 18px); }
.cutline-title-frame { container-type: inline-size; overflow: clip; }
.cutline-title-frame h1 {
  margin: 0;
  width: max-content;
  font-size: clamp(42px, 20cqw, 445px);
  line-height: .89;
  transform: scaleX(var(--word-stretch, 1));
  transform-origin: left center;
}

.cutline-title-frame h1:focus { outline: none; }
.cutline-word { display: inline-flex; align-items: flex-end; width: max-content; font-weight: 800; letter-spacing: -.075em; }
.cutline-glyph { display: block; overflow: clip; }
.cutline-glyph-ink { display: block; padding: .055em .028em .095em 0; }
.cutline-word-stamp {
  font-size: .09em;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -.02em;
  margin: 0 .08em 1.55em .75em;
  font-variant-numeric: tabular-nums;
}
.cutline-hero-rule, .cutline-footer-rule { height: 1px; background: var(--ink); opacity: .78; transform-origin: left; }

.cutline-hero-note {
  display: grid;
  grid-template-columns: 1fr 1fr 1.6fr auto;
  gap: var(--gap);
  align-items: start;
  padding-block: clamp(12px, 1.75vw, 28px) clamp(18px, 3vw, 45px);
  font-size: clamp(.68rem, 1.02vw, .88rem);
  font-weight: 700;
  letter-spacing: -.017em;
  line-height: 1.35;
}

.cutline-hero-note p { margin: 0; max-width: 32ch; color: var(--muted); }
.cutline-hero-note > span { text-align: right; color: var(--muted); }
.cutline-hero-note a, .cutline-footer-bottom :is(a, button) { display: inline-flex; gap: 7px; align-items: center; }
.cutline-hero-note a:hover, .cutline-footer-bottom :is(a, button):hover { text-decoration: underline; text-underline-offset: 4px; }
.cutline-hero-note svg, .cutline-footer-bottom svg { flex: none; width: 14px; height: 14px; }

.cutline-collection { scroll-margin-top: 78px; }
.cutline-products { display: grid; gap: var(--gap); list-style: none; padding: 0; margin: 0; }
.cutline-products-lead { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.cutline-product-entry { min-width: 0; align-self: start; }
.cutline button.cutline-product { display: block; width: 100%; text-align: start; }
.cutline-product-media {
  display: block;
  position: relative;
  overflow: clip;
  aspect-ratio: 3 / 4;
  background: var(--surface);
}

.cutline-product-art { display: block; position: absolute; inset: 0; overflow: clip; background: var(--product); }
.cutline-product-art > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.cutline-product-art > .cutline-look {
  opacity: 0;
  object-position: center top;
  transform: scale(1);
  transition: opacity .15s linear, transform .32s cubic-bezier(.16, 1, .3, 1);
}
.cutline-product:focus-visible .cutline-look[data-ready="true"] { opacity: 1; }
@media (hover: hover) and (pointer: fine) {
  .cutline-product:hover .cutline-look[data-ready="true"] { opacity: 1; transform: scale(1.03); }
}

.cutline-product-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 4px 8px;
  padding: 9px 0 0;
  font-size: clamp(.76rem, 1.05vw, .97rem);
  letter-spacing: -.017em;
  line-height: 1.2;
}

.cutline-product-info strong { display: block; font-weight: 800; }
.cutline-product-info small { display: block; color: var(--muted); font-size: .78em; margin-top: 5px; line-height: 1.3; }
.cutline-price { font-variant-numeric: tabular-nums; white-space: nowrap; font-size: .92em; }
.cutline-product:hover strong { text-decoration: underline; text-underline-offset: 3px; }

.cutline-spread {
  grid-template-columns: repeat(12, minmax(0, 1fr));
  margin-top: clamp(82px, 14vw, 240px);
}
.cutline-spread-1 > :nth-child(1) { grid-column: 1 / 3; }
.cutline-spread-1 > :nth-child(2) { grid-column: 4 / 6; margin-top: 2.9vw; }
.cutline-spread-1 > :nth-child(3) { grid-column: 7 / 13; }
.cutline-spread-1 > :nth-child(3) .cutline-product-media { aspect-ratio: 5 / 6; }
.cutline-spread-2 { margin-top: clamp(74px, 12.5vw, 200px); }
.cutline-spread-2 > :nth-child(1) { grid-column: 1 / 3; margin-top: 4.5vw; }
.cutline-spread-2 > :nth-child(2) { grid-column: 5 / 8; }
.cutline-spread-2 > :nth-child(3) { grid-column: 9 / 11; margin-top: 3.1vw; }
.cutline-spread-3 > :nth-child(1) { grid-column: 1 / 6; }
.cutline-spread-3 > :nth-child(1) .cutline-product-media { aspect-ratio: 5 / 6; }
.cutline-spread-3 > :nth-child(2) { grid-column: 8 / 10; margin-top: 4vw; }
.cutline-spread-3 > :nth-child(3) { grid-column: 11 / 13; margin-top: 7vw; }

.cutline-footer { margin-top: clamp(120px, 17vw, 300px); }
.cutline-footer-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px 24px;
  min-height: clamp(270px, 29vw, 440px);
  padding-top: clamp(20px, 4.5vw, 62px);
}
.cutline-footer-main h2 { margin: 0; font-size: clamp(1.9rem, 5.45vw, 6.5rem); font-weight: 800; letter-spacing: -.068em; line-height: 1.05; }
.cutline-footer-line, .cutline-copyright-mask { display: block; overflow: clip; }
.cutline-footer-line > span { display: block; padding-bottom: .045em; }
.cutline-footer-muted { color: var(--muted); }
.cutline-copyright { display: block; font-size: clamp(3.9rem, 14.1vw, 17rem); font-weight: 800; letter-spacing: -.085em; line-height: .86; padding: .04em .075em .085em 0; }
.cutline-footer-bottom {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  min-height: 76px;
  border-top: 1px solid var(--line);
  font-size: .78rem;
  font-weight: 750;
  color: var(--muted);
}
.cutline-footer-bottom :is(a, button) { min-height: 44px; color: var(--ink); }

.cutline-intro {
  display: grid;
  place-items: center;
  overflow: clip;
  background: var(--cutline-cream);
}
.cutline[data-intro] { height: 100dvh; overflow: clip; }
.cutline[data-intro] .cutline-shop-outer {
  position: fixed;
  z-index: 26;
  inset: 0;
  height: 100dvh;
  overflow: hidden;
  visibility: hidden;
}
.cutline[data-intro] .cutline-shop-inner { height: 100%; overflow: hidden; }
.cutline[data-intro] .cutline-shop { min-height: 100dvh; background: var(--page); }
.cutline-intro {
  position: fixed;
  z-index: 25;
  inset: 0;
  height: 100dvh;
  color: var(--cutline-signal);
  --intro-ui: #382726;
  --focus: #942422;
}
.cutline-intro[data-replay="true"] {
  background: var(--page);
  color: var(--ink);
  --intro-ui: var(--ink);
  --focus: var(--ink);
}
.cutline-intro-lockup {
  position: relative;
  isolation: isolate;
  display: grid;
  place-items: center;
  font-size: clamp(2rem, min(12vw, 22svh), 14rem);
  line-height: .92;
}
.cutline-intro-word { position: relative; z-index: 0; visibility: hidden; transform: scaleX(1.15); pointer-events: none; }
.cutline-intro-art {
  position: absolute;
  z-index: 1;
  inset: 0;
  font-size: .84em;
  pointer-events: none;
}
.cutline-intro-layer {
  position: absolute;
  inset: 50% auto auto 50%;
  width: 1em;
  aspect-ratio: 1;
  transform: translate(calc(-50% + var(--layer-x)), calc(-50% + var(--layer-y)));
}
.cutline-intro-face {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--look-background);
  opacity: 0;
  visibility: hidden;
}
.cutline-intro-face img { width: 100%; height: 100%; object-fit: cover; object-position: center 27%; }
.cutline-intro-count {
  position: absolute;
  z-index: 2;
  left: calc(107.5% + .9rem);
  top: -.28em;
  font: 600 clamp(.67rem, 1.1vw, 1rem) / 1 ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
}
.cutline button.cutline-intro-skip {
  position: absolute;
  z-index: 3;
  top: var(--edge);
  right: var(--edge);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  color: var(--intro-ui);
  font-size: .77rem;
  font-weight: 800;
}
.cutline-intro-skip:hover { text-decoration: underline; text-underline-offset: 4px; }
.cutline-intro-skip svg { width: 15px; height: 15px; }
.cutline-intro-cue {
  position: absolute;
  bottom: max(var(--edge), calc(env(safe-area-inset-bottom) + 16px));
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--intro-ui);
  font-size: .77rem;
  font-weight: 750;
}
.cutline-intro-cue svg { width: 14px; height: 14px; }

.cutline-cursor {
  position: fixed;
  z-index: 27;
  inset: 0 auto auto 0;
  opacity: 0;
  pointer-events: none;
}
.cutline-cursor[data-visible] { opacity: 1; }
.cutline-cursor span {
  position: absolute;
  display: grid;
  place-items: center;
  left: 0;
  top: 0;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--accent);
  color: transparent;
  white-space: nowrap;
  font-size: .65rem;
  font-weight: 800;
  transform-origin: center;
  transform: translate(-50%, -50%) scale(.444444);
  transition: transform .18s cubic-bezier(.2,.65,.3,1), color .12s;
}
.cutline-cursor[data-on-item] span { color: var(--accent-ink); transform: translate(-50%, -50%) scale(1); }

.cutline .preview-dialog { border-radius: 0; }
.cutline-product-detail { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.cutline-detail-media { position: relative; min-height: 330px; background: var(--product); }
.cutline-detail-media img { width: 100%; height: 100%; object-fit: contain; }
.cutline button.cutline-detail-toggle {
  position: absolute;
  inset: auto 12px 12px;
  min-height: 44px;
  background: #f6eeea;
  color: #211714;
  border: 1px solid #c6b6af;
  font-size: .79rem;
  font-weight: 800;
}
.cutline-product-detail-text, .cutline-bag { padding: clamp(20px, 4vw, 45px); padding-top: 62px; }
.cutline-product-detail h2, .cutline-bag h2 {
  font-size: clamp(1.55rem, 3vw, 2.6rem);
  line-height: 1.03;
  margin: 0;
  letter-spacing: -.045em;
}
.cutline-product-detail p, .cutline-bag p { color: var(--muted); font-size: .89rem; line-height: 1.5; }
.cutline-sizes { display: flex; gap: 6px; margin: 21px 0 12px; }
.cutline .cutline-sizes button { min-width: 44px; min-height: 44px; border: 1px solid var(--line); font-size: .83rem; font-weight: 800; }
.cutline .cutline-sizes button[aria-pressed="true"] { background: var(--ink); border-color: var(--ink); color: var(--page); }
.cutline button.cutline-add {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  min-height: 46px;
  background: var(--accent);
  color: var(--accent-ink);
  font-weight: 800;
}
.cutline-add svg { width: 16px; height: 16px; }
.cutline-added { min-height: 18px; font-size: .8rem; margin-top: 9px; }
.cutline-bag ul { list-style: none; padding: 0; margin: 20px 0; border-top: 1px solid var(--line); }
.cutline-bag li { display: grid; grid-template-columns: 54px minmax(0, 1fr) auto; align-items: center; gap: 11px; padding: 9px 0; border-bottom: 1px solid var(--line); font-size: .86rem; }
.cutline-bag li img { width: 54px; height: 62px; object-fit: cover; }
.cutline-bag li p { margin: 5px 0 0; font-size: .8rem; }
.cutline .cutline-bag li button { min-height: 44px; font-size: .76rem; text-decoration: underline; text-underline-offset: 3px; }
.cutline-bag .cutline-subtotal { display: flex; justify-content: space-between; color: var(--ink); }

@media (max-width: 780px) {
  .cutline-spread-1 > :nth-child(1) { grid-column: 1 / 4; }
  .cutline-spread-1 > :nth-child(2) { grid-column: 4 / 7; }
  .cutline-spread-3 > :nth-child(2) { grid-column: 7 / 10; }
  .cutline-spread-3 > :nth-child(3) { grid-column: 10 / 13; }
}

@media (max-width: 570px) {
  .cutline { --nav-height: 56px; }
  .cutline-hero { padding-top: 13px; }
  .cutline-hero-note { grid-template-columns: 1fr auto; row-gap: 11px; padding-bottom: 20px; }
  .cutline-hero-note > *:nth-child(even) { justify-self: end; }
  .cutline-hero-note > p { max-width: 29ch; }
  .cutline-collection { scroll-margin-top: 64px; }
  .cutline-products-lead { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: 18px; }
  .cutline-product-info { flex-wrap: wrap; justify-content: space-between; padding-top: 8px; }
  .cutline-spread { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 21px var(--gap); margin-top: 76px; }
  .cutline-spread > :nth-child(n) { grid-column: auto; margin-top: 0; }
  .cutline-spread-1 > :nth-child(3), .cutline-spread-3 > :nth-child(1) { grid-column: 1 / -1; }
  .cutline-spread-1 > :nth-child(2), .cutline-spread-2 > :nth-child(2), .cutline-spread-3 > :nth-child(3) { margin-top: 20px; }
  .cutline-spread-2 > :nth-child(3) { grid-column: 2; margin-right: 17%; }
  .cutline-footer { margin-top: 100px; }
  .cutline-footer-main { flex-wrap: wrap; min-height: 0; padding-bottom: 36px; }
  .cutline-footer-main h2 { font-size: clamp(1.8rem, 7.65vw, 2.7rem); }
  .cutline-copyright-mask { margin-left: auto; }
  .cutline-copyright { font-size: clamp(4.8rem, 20vw, 8rem); }
  .cutline-footer-bottom { flex-wrap: wrap; padding-block: 7px; gap: 0 12px; }
  .cutline-intro-lockup { font-size: min(12vw, 27svh); }
  .cutline-intro-count { left: calc(107.5% + .46rem); }
  .cutline-product-detail { grid-template-columns: minmax(0, 1fr); }
  .cutline-detail-media { height: min(44svh, 350px); min-height: 0; }
  .cutline-product-detail-text { padding-top: 19px; }
}

@media (prefers-reduced-motion: reduce) {
  .cutline .cutline-look, .cutline .cutline-cursor span { transition: none; }
  .cutline-product:hover .cutline-look[data-ready="true"] { transform: none; }
  .cutline-cursor { display: none; }
}


.cutline {
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 100dvh;
  background: var(--page);
  color: var(--ink);
}`;

export type CutlineProduct = {
  id: string;
  name: string;
  color: string;
  price: number;
  detail: string;
  image: string;
  look?: string;
  backdrop?: string;
  editorial?: boolean;
};
type PhotoUrls = Readonly< Record< string, string>>;
const builtInPhotos: PhotoUrls = {
  "model-1": "/public/images/model_standing.jpg",
  "model-2": "/public/images/suit_portrait.jpg",
  "model-3": "/public/images/hero_editorial.jpg",
  "intro-scarlet": "/public/images/perfume_peony.jpg",
  "catalog-track": "/public/images/candle_scallop.jpg",
  "intro-sand": "/public/images/hero_editorial.jpg",
  "catalog-denim": "/public/images/card_form.jpg",
  "campaign-chalk": "/public/images/suit_portrait.jpg",
  "catalog-knit": "/public/images/model_standing.jpg",
  "intro-chalk": "/public/images/candle_scallop.jpg",
  "product-1": "/public/images/suit_portrait.jpg",
  "product-2": "/public/images/card_scent.jpg",
  "product-4": "/public/images/perfume_square.jpg",
  "product-5": "/public/images/card_ritual.jpg",
  "catalog-hoodie": "/public/images/hero_editorial.jpg",
  "catalog-shirt": "/public/images/model_standing.jpg",
  "catalog-sand": "/public/images/card_form.jpg",
  "catalog-suede": "/public/images/suit_portrait.jpg",
  "catalog-leather": "/public/images/perfume_square.jpg",
};

function buildCatalog(photos: PhotoUrls) {
  const asset = (name: string) => {
    let val = photos[name] || builtInPhotos[name];
    if (!val || val.startsWith("data:image")) val = "/public/images/suit_portrait.jpg";
    if (val.startsWith("public/")) val = "/" + val;
    return val;
  };
  const existingLooks = [1, 2, 3].map(index => asset(`model-${index}`));

  const introLooks = [
    { src: asset("intro-scarlet"), x: -.08, y: .03, backdrop: "#ddd4cb" },
    { src: asset("catalog-track"), x: .06, y: .05, backdrop: "#eeeae7" },
    { src: existingLooks[2], x: .10, y: -.08, backdrop: "#e2d9cf" },
    { src: existingLooks[1], x: -.07, y: .02, backdrop: "#d4cfc8" },
    { src: asset("intro-sand"), x: .04, y: .07, backdrop: "#dbd6ce" },
    { src: asset("catalog-denim"), x: .09, y: .03, backdrop: "#eeeae7" },
    { src: asset("campaign-chalk"), x: .05, y: -.06, backdrop: "#ddd9d3" },
    { src: asset("catalog-knit"), x: -.04, y: .07, backdrop: "#eeeae7" },
    { src: asset("intro-chalk"), x: -.07, y: -.04, backdrop: "#d2cdc7" },
    { src: existingLooks[0], x: 0, y: 0, backdrop: "#e0dcd6" },
  ];

  const firstDrop: CutlineProduct[] = [
    { id: "coach", image: asset("product-1"), look: existingLooks[0], backdrop: "#e0dcd6", name: "Satin Coach Jacket", color: "Ink", price: 165, detail: "Smooth black satin, snap closures and an easy shape for everyday layering." },
    { id: "chore", image: asset("product-2"), look: existingLooks[1], backdrop: "#d4cfc8", name: "Denim Chore Coat", color: "Washed indigo", price: 190, detail: "A straight-cut denim coat with a roomy fit and deep front patch pockets." },
    { id: "bomber", image: asset("product-4"), backdrop: "#e2dcd3", name: "Insulated Bomber", color: "Dune", price: 225, detail: "A warm taupe shell with a relaxed sleeve and a ribbed collar and hem." },
    { id: "overshirt", image: asset("product-5"), look: existingLooks[2], backdrop: "#e2d9cf", name: "Suede Overshirt", color: "Oxblood", price: 245, detail: "Soft oxblood suede cut like an overshirt, with a broad collar and two front pockets." },
  ];

  const spreads: CutlineProduct[][] = [
    [
      { id: "denim", image: asset("catalog-denim"), name: "Wide Leg Denim", color: "Washed charcoal", price: 110, detail: "Washed denim in a long, straight leg with room through the knee." },
      { id: "knit", image: asset("catalog-knit"), name: "Loose Rib Knit", color: "Oat", price: 98, detail: "An open rib stitch, dropped shoulders and a soft crew neckline." },
      { id: "chalk", image: asset("campaign-chalk"), editorial: true, name: "Chalk Utility Jacket", color: "Chalk", price: 185, detail: "Off-white cotton with oversized flap pockets and tonal snap fasteners." },
    ],
    [
      { id: "track", image: asset("catalog-track"), name: "Track Shell", color: "Signal red", price: 125, detail: "Light nylon with an upright collar and a clean zip front." },
      { id: "hoodie", image: asset("catalog-hoodie"), name: "Heavyweight Hoodie", color: "Wine", price: 105, detail: "Dense brushed fleece and a generous hood with a clean neckline." },
      { id: "workshirt", image: asset("catalog-shirt"), name: "Canvas Work Shirt", color: "Bone", price: 120, detail: "A boxy work shirt made from washed cotton canvas." },
    ],
    [
      { id: "sand", image: asset("catalog-sand"), name: "Sand Zip Hoodie", color: "Sand", price: 115, detail: "A heavyweight zip hoodie with a gently structured shape." },
      { id: "suede", image: asset("catalog-suede"), name: "Suede Coach Jacket", color: "Tobacco", price: 240, detail: "Brushed suede with a simple zip and a straight, easy fit." },
      { id: "leather", image: asset("catalog-leather"), name: "Rider Jacket", color: "Washed black", price: 295, detail: "Soft washed leather with an asymmetric silver zip and a wide lapel." },
    ],
  ];
  return { introLooks, firstDrop, spreads };
}

function PreviewDialog({
  label,
  onClose,
  children,
}: {
  label: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const dialog = useRef< HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  function close() {
    dialog.current?.close();
    onClose();
  }

  return (
    <dialog
      ref={dialog}
      className="preview-dialog"
      aria-label={label}
      onCancel={event => {
        event.preventDefault();
        close();
      }}
      onClick={event => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="preview-dialog-inner">
        <button
          type="button"
          className="preview-icon-button preview-close"
          aria-label="Close dialog"
          onClick={close}
        >
          <X aria-hidden="true" />
        </button>
        {children}
      </div>
    </dialog>
  );
}

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useCutlineIntro(
  curtain: RefObject< HTMLElement | null>,
  enter: () => void,
  complete: () => void,
) {
  const events = useRef({ enter, complete });
  events.current = { enter, complete };

  useGSAP(() => {
    const element = curtain.current;
    const stage = element?.closest(".cutline");
    const outer = stage?.querySelector(".cutline-shop-outer");
    const inner = stage?.querySelector(".cutline-shop-inner");
    const shop = stage?.querySelector(".cutline-shop");
    if (!element || !outer || !inner || !shop) return;
    const word = element.querySelector(".cutline-intro-word");
    const glyphs = element.querySelectorAll(".cutline-glyph-ink");
    const layers = element.querySelectorAll(".cutline-intro-face");
    const count = element.querySelector(".cutline-intro-count");
    const counter = { value: 0 };
    let requested = false;
    let finished = false;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finish = () => {
      if (finished) return;
      finished = true;
      events.current.complete();
    };
    if (motion.matches) {
      finish();
      return;
    }
    const motionChange = (event: MediaQueryListEvent) => { if (event.matches) finish(); };
    motion.addEventListener("change", motionChange);
    const arrival = gsap.timeline({
      paused: true,
      defaults: { duration: 1.05, ease: "power1.inOut" },
      onStart: () => events.current.enter(),
      onComplete: finish,
    })
      .set(outer, { autoAlpha: 1 }, 0)
      .fromTo([outer, inner], { yPercent: index => index ? -100 : 100 }, {
        yPercent: 0, immediateRender: false,
      }, 0)
      .fromTo(shop, { y: () => innerHeight * .15 }, { y: 0, immediateRender: false }, 0)
      .to(element, { yPercent: -15 }, 0);

    const stack = gsap.timeline({
      paused: true,
      onComplete: () => { if (requested) stack.reverse(); },
      onReverseComplete: () => arrival.play(),
    })
      .fromTo(layers, { autoAlpha: 0, scale: .96 }, {
        autoAlpha: 1, scale: 1, duration: .04, stagger: .125, ease: "steps(1)",
      }, .16)
      .fromTo(glyphs, { yPercent: 112 }, {
        yPercent: 0, stagger: { amount: 1.08 }, duration: .42, ease: "expo.out",
      }, 0)
      // Briefly expose the covered letters; reversing the stack retraces this overlap.
      .set(word, { zIndex: 2 }, 1.08)
      .set(word, { zIndex: 0 }, 1.3);
    gsap.set(".cutline-intro-word", { visibility: "visible" });
    gsap.to(counter, {
      value: 100,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        if (count) count.textContent = String(Math.floor(counter.value)).padStart(3, "0");
      },
    });

    function enterShop() {
      if (requested || finished) return;
      requested = true;
      // An early gesture waits for the final image, then reverses the same timeline.
      if (stack.progress() === 1) stack.reverse();
    }
    const observer = ScrollTrigger.observe({
      target: element,
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onUp: enterShop,
      tolerance: 10,
      lockAxis: true,
      preventDefault: true,
      allowClicks: true,
      ignore: element.querySelectorAll("button"),
    });
    const keyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      if (event.target instanceof Element && event.target.closest("button, a, input, textarea")) return;
      if (["ArrowDown", "PageDown", " ", "End"].includes(event.key)) {
        event.preventDefault();
        enterShop();
      }
    };
    window.addEventListener("keydown", keyDown);
    stack.play();

    return () => {
      observer.kill();
      window.removeEventListener("keydown", keyDown);
      motion.removeEventListener("change", motionChange);
    };
  }, { scope: curtain });
}

function useCutlineShopMotion(root: RefObject< HTMLDivElement | null>, ready: boolean, visible: boolean, dialogOpen: boolean) {
  const smoother = useRef< ScrollSmoother | null>(null);
  useGSAP(() => {
    if (!visible || !root.current) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({ defaults: { ease: "expo.out" } })
        .from(".cutline-title-frame .cutline-glyph-ink", { yPercent: 115, stagger: .036, duration: .76 }, .2)
        .from(".cutline-hero-rule", { scaleX: 0, duration: .7 }, .44)
        .from(".cutline-hero-note > *", { opacity: 0, y: 7, stagger: .048, duration: .46 }, .51)
        .from(".cutline-products-lead .cutline-product-media", {
          y: 38, opacity: .2, duration: .56, stagger: .075, ease: "power3.out", clearProps: "transform,opacity",
        }, .3)
        .from(".cutline-products-lead .cutline-product-art", {
          clipPath: "inset(0 100% 0 0)", duration: .51, stagger: .075, ease: "power2.inOut", clearProps: "clipPath",
        }, .45);
    });
    return () => media.revert();
  }, { scope: root, dependencies: [visible], revertOnUpdate: true });
  useGSAP(() => {
    const stage = root.current;
    if (!ready || !stage) return;
    const media = gsap.matchMedia();
    media.add("(min-width: 781px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const wrapper = stage.querySelector< HTMLElement>(".cutline-scroll-frame");
      const content = stage.querySelector< HTMLElement>(".cutline-scroll-content");
      if (!wrapper || !content) return;
      const instance = ScrollSmoother.create({
        wrapper,
        content,
        smooth: .38,
        smoothTouch: false,
      });
      wrapper.dataset.smoothed = "";
      smoother.current = instance;
      const collection = content.querySelector< HTMLElement>("#collection");
      function positionCollection(smooth: boolean) {
        if (!collection) return;
        const inset = parseFloat(getComputedStyle(collection).scrollMarginTop) || 0;
        instance.scrollTo(Math.max(0, instance.offset(collection, "top top") - inset), smooth);
      }
      function followCollection(event: MouseEvent) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (!(event.target instanceof Element) || !event.target.closest('a[href="#collection"]') || !collection) return;
        event.preventDefault();
        if (location.hash !== "#collection") history.pushState(null, "", "#collection");
        collection.focus({ preventScroll: true });
        positionCollection(true);
      }
      stage.addEventListener("click", followCollection);
      // Align a deep link after the transformed wrapper has measured its content.
      const deepLink = location.hash === "#collection"
        ? requestAnimationFrame(() => positionCollection(false))
        : 0;
      const onHashChange = () => {
        if (location.hash === "#collection") positionCollection(false);
      };
      window.addEventListener("hashchange", onHashChange);
      return () => {
        cancelAnimationFrame(deepLink);
        window.removeEventListener("hashchange", onHashChange);
        stage.removeEventListener("click", followCollection);
        delete wrapper.dataset.smoothed;
        instance.kill();
        smoother.current = null;
      };
    });
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray< HTMLElement>(".cutline-spread", root.current).forEach(group => {
        const mediaFrames = group.querySelectorAll(".cutline-product-media");
        const images = group.querySelectorAll(".cutline-product-art");
        gsap.timeline({
          scrollTrigger: { trigger: group, start: "top 92%", once: true },
        })
          .from(mediaFrames, { y: 38, opacity: .2, duration: .56, stagger: .075, ease: "power3.out", clearProps: "transform,opacity" }, 0)
          .from(images, { clipPath: "inset(0 100% 0 0)", duration: .51, stagger: .075, ease: "power2.inOut", clearProps: "clipPath" }, .15);
      });

      gsap.timeline({ scrollTrigger: { trigger: ".cutline-footer", start: "top 84%", once: true } })
        .from(".cutline-footer-rule", { scaleX: 0, duration: .72, ease: "power3.out" }, 0)
        .from(".cutline-footer-line > span, .cutline-copyright", { yPercent: 104, duration: .67, stagger: .064, ease: "expo.out" }, .17);
    });
    return () => media.revert();
  }, { scope: root, dependencies: [ready], revertOnUpdate: true });
  useGSAP(() => {
    if (!ready || !smoother.current) return;
    smoother.current.paused(dialogOpen);
  }, { scope: root, dependencies: [ready, dialogOpen] });
}

function useCutlineCursor(root: RefObject< HTMLDivElement | null>, enabled: boolean) {
  useGSAP(() => {
    if (!enabled || !root.current) return;
    const stage = root.current;
    const cursor = stage.querySelector< HTMLElement>(".cutline-cursor");
    if (!cursor) return;
    const dot = cursor;
    const media = gsap.matchMedia();
    media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      let x = 0;
      let y = 0;
      let targetX = 0;
      let targetY = 0;
      let vx = 0;
      let vy = 0;
      let frame = 0;
      let last = 0;
      const paint = () => { cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`; };

      function tick(now: number) {
        const dt = Math.min((now - last) / 1000, .024);
        last = now;
        vx += (220 * (targetX - x) - 25 * vx) * dt;
        vy += (220 * (targetY - y) - 25 * vy) * dt;
        x += vx * dt;
        y += vy * dt;
        paint();
        if (Math.hypot(targetX - x, targetY - y) + Math.hypot(vx, vy) > .35) {
          frame = requestAnimationFrame(tick);
        } else {
          frame = 0;
        }
      }

      function move(event: PointerEvent) {
        if (event.pointerType !== "mouse") return;
        targetX = event.clientX;
        targetY = event.clientY;
        if (!dot.hasAttribute("data-visible")) {
          x = targetX;
          y = targetY;
          vx = 0;
          vy = 0;
          paint();
        }
        dot.setAttribute("data-visible", "");
        dot.toggleAttribute("data-on-item", event.target instanceof Element && Boolean(event.target.closest(".cutline-product-media")));
        if (!frame) {
          last = performance.now();
          frame = requestAnimationFrame(tick);
        }
      }

      function hide() {
        cancelAnimationFrame(frame);
        frame = 0;
        dot.removeAttribute("data-visible");
        dot.removeAttribute("data-on-item");
      }

      stage.addEventListener("pointermove", move);
      stage.addEventListener("pointerleave", hide);
      window.addEventListener("blur", hide);
      window.addEventListener("scroll", hide, { passive: true });
      return () => {
        hide();
        stage.removeEventListener("pointermove", move);
        stage.removeEventListener("pointerleave", hide);
        window.removeEventListener("blur", hide);
        window.removeEventListener("scroll", hide);
      };
    });
    return () => media.revert();
  }, { scope: root, dependencies: [enabled], revertOnUpdate: true });
}

type Theme = "dark" | "light" | "signal";
type IntroPhase = "stacking" | "entering" | "ready";
type Size = "S" | "M" | "L" | "XL";
type BagEntry = { product: CutlineProduct; size: Size; quantity: number };
type Panel = { kind: "product"; product: CutlineProduct } | { kind: "bag" };

const themes: { id: Theme; label: string; color: string }[] = [
  { id: "dark", label: "Obsidian", color: "var(--cutline-obsidian)" },
  { id: "light", label: "Alabaster", color: "var(--cutline-cream)" },
  { id: "signal", label: "Signal red", color: "var(--cutline-signal)" },
];
const sizes: Size[] = ["S", "M", "L", "XL"];
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
function Wordmark({ suffix = false }: { suffix?: boolean }) {
  return (
    <span className="cutline-word" aria-hidden="true">
      {Array.from("CELESTIA", (letter, index) => (
        <span key={index} className="cutline-glyph"><span className="cutline-glyph-ink">{letter}</span></span>
      ))}
      {suffix && <span className="cutline-word-stamp">(01)</span>}
    </span>
  );
}

function returnToMasthead() {
  if (location.hash) history.replaceState(history.state, "", location.pathname + location.search);
  window.scrollTo({ top: 0, behavior: "instant" });
}

function Intro({ onEnter, onComplete, onSkip, focusSkip, introLooks }: {
  onEnter: () => void;
  onComplete: () => void;
  onSkip: () => void;
  focusSkip: boolean;
  introLooks: ReturnType< typeof buildCatalog>["introLooks"];
}) {
  const curtain = useRef< HTMLElement>(null);
  const skip = useRef< HTMLButtonElement>(null);
  useCutlineIntro(curtain, onEnter, onComplete);
  useEffect(() => {
    if (focusSkip) skip.current?.focus({ preventScroll: true });
  }, [focusSkip]);
  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") onSkip();
    }
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [onSkip]);
  return (
      <section className="cutline-intro" ref={curtain} data-replay={focusSkip || undefined} aria-label="Collection introduction">
        <button className="cutline-intro-skip" type="button" ref={skip} onClick={onSkip}>
          Skip intro <ArrowUpRight aria-hidden="true" />
        </button>
        <div className="cutline-intro-lockup">
          <div className="cutline-intro-word"><Wordmark /></div>
          <div className="cutline-intro-art" aria-hidden="true">
            {introLooks.map(({ src, x, y, backdrop }, index) => (
              <span key={src} className="cutline-intro-layer" style={{
                "--layer-x": x + "em",
                "--layer-y": y + "em",
                "--look-background": backdrop,
                zIndex: index + 1,
              } as CSSProperties}>
                <span className="cutline-intro-face">
                  <img src={src} alt="" width={480} height={480} fetchPriority={index === 0 ? "high" : "auto"} />
                </span>
              </span>
            ))}
          </div>
          <span className="cutline-intro-count" aria-hidden="true">000</span>
        </div>
        <span className="cutline-intro-cue">Scroll to enter <ArrowDown aria-hidden="true" /></span>
      </section>
  );
}

function ProductCard({ product, priority, select }: {
  product: CutlineProduct;
  priority?: boolean;
  select: (product: CutlineProduct) => void;
}) {
  const [lookReady, setLookReady] = useState(false);
  return (
    <li className="cutline-product-entry" data-product={product.id}>
      <button className="cutline-product" type="button" aria-label={"View " + product.name}
        aria-describedby={"cutline-info-" + product.id} onClick={() => select(product)}>
        <span className="cutline-product-media">
          <span className="cutline-product-art">
            <img className={product.editorial ? "cutline-campaign" : "cutline-packshot"} src={product.image} alt=""
              width={product.editorial ? 1000 : 384} height={product.editorial ? 1250 : 512} loading={priority ? "eager" : "lazy"} decoding="async" />
            {product.look && <img className="cutline-look" src={product.look} alt="" width={480} height={480}
              loading={priority ? "eager" : "lazy"} decoding="async"
              onLoad={() => setLookReady(true)} data-ready={lookReady} style={{ background: product.backdrop }} />}
          </span>
        </span>
        <span className="cutline-product-info" id={"cutline-info-" + product.id}>
          <span><strong>{product.name}</strong><small>{product.color} <span aria-hidden="true">·</span> In stock</small></span>
          <span className="cutline-price">{currency.format(product.price)}</span>
        </span>
      </button>
    </li>
  );
}

export function CelestiaStorefront({ photos }: { photos: PhotoUrls }) {
  const { introLooks, firstDrop, spreads } = useMemo(() => buildCatalog(photos), [photos]);
  const requestedTheme = typeof window === "undefined" ? null : new URLSearchParams(location.search).get("theme");
  const [theme, setTheme] = useState< Theme>(requestedTheme === "light" || requestedTheme === "signal" ? requestedTheme : "dark");
  const [introPhase, setIntroPhase] = useState< IntroPhase>(() =>
    typeof window !== "undefined" && !location.hash && !new URLSearchParams(location.search).has("skipIntro") && !reducedMotion() ? "stacking" : "ready",
  );
  const [panel, setPanel] = useState< Panel | null>(null);
  const [size, setSize] = useState< Size>("M");
  const [showLook, setShowLook] = useState(false);
  const [added, setAdded] = useState(false);
  const [bag, setBag] = useState< BagEntry[]>([]);
  const root = useRef< HTMLDivElement>(null);
  const title = useRef< HTMLHeadingElement>(null);
  const titleFrame = useRef< HTMLDivElement>(null);
  const manualIntro = useRef(false);

  const quantity = bag.reduce((total, entry) => total + entry.quantity, 0);
  const subtotal = bag.reduce((total, entry) => total + entry.product.price * entry.quantity, 0);
  const intro = introPhase !== "ready";
  const shopReady = !intro;
  const shopVisible = introPhase !== "stacking";

  useLayoutEffect(() => {
    const html = document.documentElement;
    html.dataset.celestiaTheme = theme;
    return () => { delete html.dataset.celestiaTheme; };
  }, [theme]);

  useLayoutEffect(() => {
    const frame = titleFrame.current;
    const word = title.current?.querySelector< HTMLElement>(".cutline-word");
    if (!frame || !word) return;
    const fit = () => {
      if (word.offsetWidth) frame.style.setProperty("--word-stretch", String(frame.clientWidth / word.offsetWidth));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    observer.observe(word);
    return () => observer.disconnect();
  }, []);

  function finishIntro(moveFocus = false) {
    const restoreFocus = moveFocus || Boolean(document.activeElement?.closest(".cutline-intro"));
    manualIntro.current = false;
    window.scrollTo({ top: 0, behavior: "instant" });
    setIntroPhase("ready");
    if (restoreFocus) requestAnimationFrame(() => title.current?.focus({ preventScroll: true }));
  }

  useCutlineShopMotion(root, shopReady, shopVisible, Boolean(panel));
  useCutlineCursor(root, !panel);

  function changeTheme(next: Theme) {
    if (intro) return;
    setTheme(next);
    replay();
  }

  function replay() {
    returnToMasthead();
    if (reducedMotion()) {
      title.current?.focus({ preventScroll: true });
      return;
    }
    manualIntro.current = true;
    setIntroPhase("stacking");
  }

  function openProduct(product: CutlineProduct) {
    setSize("M");
    setAdded(false);
    setShowLook(false);
    setPanel({ kind: "product", product });
  }

  function addToBag(product: CutlineProduct) {
    setBag(current => {
      const existing = current.find(entry => entry.product.id === product.id && entry.size === size);
      if (!existing) return [...current, { product, size, quantity: 1 }];
      return current.map(entry => entry === existing ? { ...entry, quantity: entry.quantity + 1 } : entry);
    });
    setAdded(true);
  }

  return (
    <div className="cutline" ref={root} id="top" data-intro={intro ? introPhase : undefined}>
      <style>{storefrontStyles}</style>
      <div className="cutline-shop-outer" inert={intro}>
        <div className="cutline-shop-inner">
          <div className="cutline-shop">
        <a className="preview-skip" href="#collection">Skip to collection</a>
        <header className="cutline-header">
          <div className="cutline-header-inner cutline-wrap">
            <button className="cutline-logo" type="button" onClick={replay} aria-label="CELESTIA, replay the opening">
              <Asterisk aria-hidden="true" />
            </button>
            <nav aria-label="Main navigation">
              <a href="#collection">Shop</a>
              <button type="button" className="cutline-bag-toggle" onClick={() => setPanel({ kind: "bag" })}>
                Bag ({quantity})
              </button>
              <div className="cutline-swatches" role="group" aria-label="Shop theme">
                {themes.map(item => (
                  <button key={item.id} type="button" aria-label={item.label} aria-pressed={theme === item.id}
                    aria-disabled={intro} onClick={() => changeTheme(item.id)}>
                    <span style={{ backgroundColor: item.color }} />
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </header>

        <div className="cutline-scroll-frame"><div className="cutline-scroll-content">
        <main>
          <section className="cutline-hero cutline-wrap" aria-labelledby="cutline-title">
            <div className="cutline-title-frame" ref={titleFrame}>
              <h1 id="cutline-title" ref={title} tabIndex={-1} aria-label="CELESTIA"><Wordmark suffix /></h1>
            </div>
            <div className="cutline-hero-rule" aria-hidden="true" />
            <div className="cutline-hero-note">
              <strong>CELESTIA Atelier</strong>
              <a href="#collection">Shop the collection <ArrowDown aria-hidden="true" /></a>
              <p>Outerwear and everyday layers, cut for the way you move.</p>
              <span>© 2026</span>
            </div>
          </section>

          <section className="cutline-collection cutline-wrap" id="collection" aria-label="Shop the collection" tabIndex={-1}>
            <ul className="cutline-products cutline-products-lead">
              {firstDrop.map(product => <ProductCard key={product.id} product={product} priority select={openProduct} />)}
            </ul>
            {spreads.map((products, index) => (
              <ul className={"cutline-products cutline-spread cutline-spread-" + (index + 1)} key={products[0].id}>
                {products.map(product => <ProductCard key={product.id} product={product} select={openProduct} />)}
              </ul>
            ))}
          </section>
        </main>

        <footer className="cutline-footer cutline-wrap">
          <div className="cutline-footer-rule" aria-hidden="true" />
          <div className="cutline-footer-main">
            <h2>
              <span className="cutline-footer-line"><span>Built to be worn.</span></span>
              <span className="cutline-footer-line cutline-footer-muted"><span>Or noticed. Or both.</span></span>
            </h2>
            <div className="cutline-copyright-mask"><span className="cutline-copyright" aria-label="Copyright 2026">©26</span></div>
          </div>
          <div className="cutline-footer-bottom">
            <span>CELESTIA Atelier</span>
            <a href="#collection">Shop the collection <ArrowUpRight aria-hidden="true" /></a>
            <button type="button" className="cutline-replay" onClick={replay}><RotateCcw aria-hidden="true" /> Replay intro</button>
          </div>
        </footer>
        </div></div>
          </div>
        </div>
      </div>

      {intro && <Intro introLooks={introLooks} onEnter={() => setIntroPhase("entering")}
        onComplete={() => finishIntro()} onSkip={() => finishIntro(true)} focusSkip={manualIntro.current} />}
      <div className="cutline-cursor" aria-hidden="true"><span>View item</span></div>

      {panel && (
        <PreviewDialog label={panel.kind === "product" ? panel.product.name : "Shopping bag"} onClose={() => setPanel(null)}>
          {panel.kind === "product" ? (
            <div className="cutline-product-detail">
              <div className="cutline-detail-media">
                <img src={showLook && panel.product.look ? panel.product.look : panel.product.image}
                  alt={showLook ? "Model wearing " + panel.product.name : panel.product.name + " in " + panel.product.color}
                  width={512} height={512} style={{ background: showLook ? panel.product.backdrop : undefined }} />
                {panel.product.look && (
                  <button className="cutline-detail-toggle" type="button" aria-pressed={showLook} onClick={() => setShowLook(value => !value)}>
                    {showLook ? "Show the garment" : "Show it on a model"}
                  </button>
                )}
              </div>
              <div className="cutline-product-detail-text">
                <h2>{panel.product.name}</h2>
                <p>{panel.product.color} · {currency.format(panel.product.price)}</p>
                <p>{panel.product.detail}</p>
                <div role="group" aria-label="Size" className="cutline-sizes">
                  {sizes.map(option => (
                    <button type="button" key={option} aria-pressed={option === size} onClick={() => { setSize(option); setAdded(false); }}>
                      {option}
                    </button>
                  ))}
                </div>
                <button className="cutline-add" type="button" onClick={() => addToBag(panel.product)}>
                  <ShoppingBag aria-hidden="true" /> Add to bag
                </button>
                <div className="cutline-added" role="status">{added ? "Added to bag (" + quantity + ")" : ""}</div>
              </div>
            </div>
          ) : (
            <div className="cutline-bag">
              <h2>Shopping bag</h2>
              {bag.length ? (
                <>
                  <ul>
                    {bag.map(entry => (
                      <li key={entry.product.id + entry.size}>
                        <img src={entry.product.image} alt="" width={384} height={512} />
                        <div><strong>{entry.product.name}</strong><p>Size {entry.size} · Qty {entry.quantity}</p></div>
                        <button type="button" aria-label={"Remove " + entry.product.name + ", size " + entry.size}
                          onClick={() => setBag(current => current.filter(item => item !== entry))}>Remove</button>
                      </li>
                    ))}
                  </ul>
                  <p className="cutline-subtotal"><strong>Subtotal</strong> {currency.format(subtotal)}</p>
                  <p>This is a demo bag.</p>
                </>
              ) : <p>Your bag is empty.</p>}
            </div>
          )}
        </PreviewDialog>
      )}
    </div>
  );
}

