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
  "model-2": "data:image/webp;base64,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",
  "catalog-knit": "data:image/webp;base64,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",
  "intro-sand": "data:image/webp;base64,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",
  "catalog-leather": "data:image/webp;base64,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",
  "intro-chalk": "data:image/webp;base64,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",
  "catalog-track": "data:image/webp;base64,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",
  "product-5": "data:image/webp;base64,UklGRmYdAABXRUJQVlA4IFodAADQzwCdASrgAeABPolEm0qlI6knJVJpwSARCWdukgkbGR2LthtjHvMnaLGx8SAqtDMPl6if8NA69YzdV8tPi2TyJusrbKLrf+KPNQ5Qj7Z6hH8z/0/rEf7Q0rkUH6/pOT3CAhflQuRTj6nJ7hAQxIGXt/VvS0pKe4QBTkICGKFBQURJpBJ8Yg/R/2ULjDltXava5Sfb7hzW4WTYcfU5Pc9r2PtTjp8sFAmm7mDo/c4rSqYYtMm5Gr2EQ/p/GaLnLIHjQEL8qDXe57yeAa+H8M0bimf+SEtdCEe+elVb/l6wT8hqG/TFS4fS9IYJNlFOP4yY7Y+p8Ch5Ny//v6Ope/EAy8+yLpkLdFvxIqEIrzTAJJ8yaUNoTfzEDg3u8HDchZDThyi4FUU+YwEKq0P9eH3vO/5kcjCUCLDJbPXeUuJsiEH91zJ7d/IuKh+RwWhyymu/jSbXgT7t6V1AUKuuaNUy8HTeO9A77QllcI+3/uEuCNF7TAGTgco5eDCul6/kHqZa6SjM1wzN9dmZQJq/SiItNJwpiJqLK5t2aPixl7kc5qk9pV+F7kGdUvlRgphQyWTLlJgvGc0nPWRkfBLdER3sBYKoJmea9mcyvyFfZ3VAFCgkY/DpSbHHy1l2Ezq2YlCm5Y1p00d7EhMmY5u0wLxE4v+9wgd/gH4adX8IsbAzrfsg59NwmFxdhUyPJw5pzAs+V3gqfiMdxre6gFqNS55EnxUJNKg9lYlKL2hb4gd1urSCkc1EDw1GAHPViMWgzfe85yblrwU9c5XQgybBrxDHa0UW3N/eN8IPLIOvQ1pGArzf+hfN/hWM4lyAmavDBInpZSnsBdPvpqjjnsM2L/6vTqmHGRWviYBxIf7BhMfCJJvsd0fGUKK4kYlkt3oB8PfwfqXn/jGX3Lf0y07esAGLUR85RHDSmaJTwYxWfIwu6vpc3AQAn7HRNKfXqIDdfexBVJf5Z5rqhdc5657g/1Ehj7O9R+Jr5jj2coAqIw8TtwYDYBVTcx4tDfds1VUrPf64GzwMbELxw700h/F6HXzFMwuZHgN0eYjqlEg7D/C4w5FOPqbEkOzaSa7cNjpjHwdLRbPH/1CxU0a7n4hVCNh6sYRijrdd+0q51OnoU+s0cI8P6EOmDSuuVyjUo6G5JERgsEOudzAag+lsBCvI4pCnPdY9nU3lxS/GkaTkVRKmFZg3AzSBA3g/SHR9UejCx5pbZmtJIsKkKGZfptXGYBPkWarWldjaGlHDuEX5BI4Wv0EjOYjpZvqB73F/8GIApwLSbKJvnlcuawJMnHsIm8VHuW5X55JQ0OxN0BKGjhDBDbIGFs4tfmnA2D6a1db4BILUaMgSOe7P1g7zBEJIS3edmZGg5efRg3dHAw3HCplM2JP1EtY5Qlg/S+5rzNdMh/3Ad27f36KgeY2GRALoJoigISbAG2Z7HZoaiAmZfsylxgOW15uMWK/C0qiQKO5xBxnYxsPmZivPGkhcF/SoxdjSPYuI7tPcBgSspQ0WnRLV927w0FNaHerczt6CTI9cG8EZ7/wXiAy3oaAyslJNICFYe4Ke2gh3Y6xgsRU3mhb47Dyp7ugiwJkOI/yYGooK4mMeOXB63TNPG5dJC3YtpFVK3CxvaBVMUcoElK6fYhDRSKWIFX/XvGTm2bxztcKUJ/WOP3EOYuPnoRCdfd1AD4QRvdDVrL/QCtFC6MyvuLH/jdH0h6bsxRzHTeX2h4vW9H8vje0dNqxyE5x90byC85fHDv4S1etS38CH1FgjECowazRSD/w2tU7ucfG8HJ3Mz4HJphnrf8sDl6guLaA7rPQHOmViVRthqVdIeYiSgMswJ+w/LWo0SibKwkiYkm2PEpJLaPjrzyTFqFpFKvUADorA/34XUspL4n80U5aRj910ZEAurbz3VdoXq6RI82gJCmmVsWgbauJd+JYGApMDGa7W+T8ao1kMdeX0xPf/lKsxZI+XlrYHgaGFwsITSuSDSaZCNQdmgAj/XC6ewSGr2c7GQB26HZylFHbfLgWfqkus40G1fUczumq+8DkZPYpTZWQd3b8XONPniyu/jdGAc18nFL4RKU6/2aLi4ukvlVJFibbjWeIVcDU5PVzjLaFq7uGQSMfi7rGTnp9OMn9l1eMJzSS2L2Ej3+dbdlEJSED87D7y6NB++LvG4QMIXj8iAs6U/GBPLu0DaEOXwEcEKsBLl8lTmu2ahaM4hTimxz3BbaDSo66hCwAA/vUJNU/slRg9qCUFZKD9QC3QEmgFq4HTuuAABxgAC1d1EAAAUmQFsjJdfmQPfSnm53EGyrMrAuTYgAqe8bNCw04rA/PE3Dol++efVaTe/E2ud6flu0p5Zt/KYBs2OF9TfrtFoDy2Fwp5x1B7a0wvpx0xc0AxPCx3cbWQrDbQAACDQsECi4DrgLPESXT/HLnkLnweXetEjmXaLX6OcDZiwUJZQL34UL9ehTZSudPgp2NYvlUtHSGKfrM6QqLOtCCx2V0GWRBn+9zlDxTb2vdywBcg1T+H6YV733BDfm2gFYTkvOPimtT7nTYU6TKwHyzY8tDCDwMIYa6vF42YA1AX22QSOu28vNwsHvjhvk0by5+MI7E9Geuyr5HTI7xaOKYJ/A6xkj0I+S8RF+4bMBL/Ma3id4I+hewhlb/fq/4Tlnstgc1L2D4jXrYviJPahiwKzYfMWmvwSq4W9QSdV9bwURJoMmhJHOaEqpu/fK3j5KAfKHw2aGRKKcKRC+zfA+A9zau3JmoK8ph63562wd/BALvbUxus08yS5QIiXh84MSvzY+ApoS7CsTENhw3D+VAYhWDfbZBvrRfBCxMB8GvTckaEHxdAdR+XHOqSThC671TXJ73zmy5L2PZczWEIvUqNPk9f4Bhn6stJPTWeVw93xZOg6+FKdb9B3+btDYaLgOQGUqunNkUk+e6rw/3+I73RD+F1ftGGTPHUuTnmUvqJpAnc49MpUwvmSOd4i6xUyIF6J0TQJyxjYJnkkSyjUWaLm/qIuHlT4MENBB+J46RNyVLlKdHTxIb6W8B7moREf7zx5sFfHqkZZTj9sReA8KayUwA4hMrlRCOK239QWB2b0bVNwtXjv5BN6H+/g6nHhoWQJnfslLawSh6nT/nGAbOAt3oujsRqQgieAAZfwvDaQJHI6so7tEaB16dK7+C9FZ0XQIPhc0ibDnsoWxzvAII2Iy3uearqKIJaZwPKJUYFQbZv47o5fhv//rBfpDmh2WLJdc1ku08tVNG9WzHC6Bz+95n02iMxA9wuG+1wLQEN9vdVajeIebymfiByYTyUrQfPMkzegJE+Fw2QXGmN5zRhEaKakRmrOUo/hJv24uMl5GtF6QsuqxD0n94JVM1XnyBVQEHLkeVgYNAPmk9WictRVMyHKjvNruWX057QaXlVuvN587POshV3uCNNPd3AZ2dvQcXLBMoD6iXaqRcZfJO8Srg1RumjE0SorOh+TiF2Ru3NDKbAqIcVFbMXaoi+bwEHEAAGiXoUrJYt7/R1+h/PD87i72leWrgSpvliv93BoSy3hp1UkEhJroFSSD0/glC/XYBe663bh5yntTsS9NR+OyVXWNkYuTQ3I4Dj2ePDnltK/Y/4vgAcQEYdczM7TDM/dpATsiLZN/y2d+g/ZDrX8cmrMZvAsnj1WFj6Xhzm3mnCYqTBu+CAULkLVjqkXv5zABRAzEvNPG3WdGuFQEXDWH/NzRp4+zD+Ih2wahSxuLYc5dfTcoHdZsGHGODIrotZq9k9hDnEsP2Q8chKsfj9Yz1zVi+NUX6sk5YtGIrquh6djVrCSiJjf89CkXzOsWK9nketB96AWjoujhHGZRf+4ejRXoWJ0g2izDAA2QGP8c0R3qpUlb+61soLZLK2Gyj87syX4MXx+49c7zwgbrT8TWxswJm9ng7LfcRjwEOQwZNHs6QVcLFSRJx4X4IyjzNBG5EmeQ20K6zVjhOFOzvmZhp6Eb/EzL4DeYfcHJ/8JdGzPtMqqXh1Q1ECgSTE9Vip7qK3uJxV/Fky1fh5ZIcT0fUTQ+mcc0wqCIvE8GIdgy+95kkmBk1Decs0L/jNP+BWK5HFqofX+zjiVSs1Vy4W+X0Q3pM+FPjrQ9HGR+zkw9tQFW/3MfmgBlgJhUAuYYAx8cmGK9caivc1wnSiriIOU4pTkEZBTZAymvm46Pt9uCich3zHBZplfxutuVEufyeIJGvENmfzrA7AObpSp4n9OoDvpG7+048x2F25fZKdrfcVk31DKNieaMnU03cLhlwdWT6MXrytdTkew2cSxSfzCgDlF0CFtGG3y4k2l6+ZeGHjYaTWhfqCAeYkNBZFQrwxVVn5OGkXXCyFIZuEhinaxg+D37dxY1/QxP/Y/skEyqZmHYkfYYlKeZaABoQHao5aDedaf5egd4kUe9XDyx9kbpMiYRwZySf/XMovtOZfuqozGhQbcQChehXwlMWr1KTvd+eGh3iHgq4QjumsUH10K1g8Ktm6Qlf/c7FiBdSgNxMHdmXRk1FcjwXuxHc6lbfw5h8gEd3rZKeJ4VoRrXgrE+HF+5jvNTR9vxwcCRg3YSY9cxx/mKMjPHG9R7eWI4Yj7oNone0uxQ6JD4/TjkmuN6FqRlhNAxv3cvvqqYiUXGQq4jSN2+LCZh9BrX82DnbiY6h7A3NvX+B9vd1pfo/uSf/Rc7nnpq7JYTytDRQJAhjGncDsHcOyBp7g3dZdwwfkNxMWVfwcoZCOuUuRTlPOybBnnjXnVDKIGkaXIOtdoF1iAkvogeR8C087C8QkerZEgKlSSNk0lxESe+m/nt89VMaqSwXqJCrRZ1BrQpKh++iwsaKh+JccVMZBHzQHxGLCNf8V4BzOLjNPn1McOpkzHLGS5yardih5XwnlMZPMoC93lTRN/C7GVa2jGrZmfRE/YiOzLUH9ZC4wXu7D4vwqs+efb2GQNGmfHglyZHUXHWF4DdsPVID6U3n9rMTZRIQXcmuzt4KAwPAQirMszdAyTPAGM+0QNcjAzcx+bO0Id03/7T3lNtbwq3bqjHNL7+y5xY6K3Pq9NAvXcD8Xb/r2VhZGAXzynp/oA3gl9rh0r2Iza/LbQzulYXJSdsQoWj4puedwhjuDREutHBBUhvn8xbiDhdFmiJt5Nu2HZVmzs3iKEDUlFBcj+0zX0ga8stciKwWQ+LYafEmsk3Fc4M4Pu+8c0iEY84+k7zqGHFoxIqr1ZUa+PSVsUmdl/JsJEpk2yazVfPyqAL5smr+Vwo/KYW/qJDgi04I54ujxwS2+DKQ/HSfpq28aPd6Hn18GR4/dLJhwxr0v7D2k4Ikzmm5Mx9YOP6i/G6cNS6bNXdNM2TS1pWETNloaUq/P2RR5C9LLqf2drICMt39bBHsid+/O5rJfL1CaZ+druFn3LzFcFV6yV92cuH6IynmAf1qbZMIscYokZvOFEE5hT2L3R6QJEW9OUgKkL3wizU5f+JHX2dq8d0GHhzwhNO1ZYt/vbRXsLmJtcGhtd8dnwrnb0urdfkHi4iM2Iw1WkVMmm6qc0gcbP6ZZZkr/+Vd9sRUD1Iu/TggPbARQw0j/z5EZ3zJmJNXEwzW/nZMmNE/5g3QQfVjmINnCGOqx93Xy0WQEE4WaAT7OZ2UkCub+DCsYt6yl9TyNFIuRvau2PFCUMZc0Oynzhus8NsMBPpdE6dfeUOktYjlX5e/7cHrsmnwqCXVFqDfcE3268ZmMHudKEfSzCtfhuccrKFrty9WfH6AtcmWah8Ypc4DeB/rBmBBsYxRgG69ZsP6W3zBAFe5pCjxjAebDJDEGYOnqBdUvmJDW8alI+N3vhJdN2BnICX3ODnt5tdKvksQDooUbhuX035hVe+Xz4kXc1lbh0zORsVgBnNFtBn81AErdM+xOnaJEU4WwG8gET2ftxFfNQRtQEwHr094JDLI1j60YIiX5BaElOR3IRFjsV6tGI+vlsUw/fkc7UHbtSqbX9Zg6mkL+YYCYXY4Ba5ZY/KBHyCUOHdvNmTpNFEj8ZY/1Rc13QCef/BjGYWyPwOA0IYAJvvykPTis7fOSlJhoffgwmLOyWA3jm84Rfiwb98RY6wE+/jn50rq8bwRG1OsjOeqhKB1GtGlO2o0un0nIJFjzfEtaImOAe1dq/vePRchaiDDUtyKB3CCOXU09PHFCKIBV0Y54lalF6lyBJ5eM8JKkj9/38U632PD4jk/v5PnqUvn8sow76NA8cXlrGR0rSQLNM0IRr7Q9HO4HnK290+3MPewhr/LRwQ+ZoIpyzSLAzSI5oxlKxeBqU0m+Kp3BqHNEga4v6ogWNION+8kW8/4R7IR0QUfi0ZFWPqsEZwDb8/70b0I0j8wk2d4L1PAfI5kNItiQagLYhsLQYHfalKgbB9CmH9L9Ofn0hxTqWYMe6ayfQZcIT0Om8RZ9a18AzKKtRuwae3wRmZs4bInkBNf8Lb4WZ0lUfW0cwe30aM6fMnsj29PSfUjxUnry1VNaHPlgEWD3gAF+/Pkc6sCFJLLoE/MSRvUP6ggcm5lYre3FtaKmozXjRLWOPraDoOi1korFgPXQxxKPN/Y6gjqtBb9riR0mmL+77yEby6Yj+E8b19xcg9A2AeVOS2XXU9jBhcLIPRKm675fdkQN6dgRglUHKfR61hWHDXVNRTY2E1VYS8+5HM4xrdJj+eq1mLA6rJTaAyeQfzYfdhuDMV8rdCJ9p3SN5P8lvd+4UEZJ3Tdlu5BvrPzE/d2vC/XIb8ugERs4BhMDm76qZAs5qkqqhcCQ0+B8T4QvMNrymYhcmKbvS7eTGVakhApaZerozje6BGziqYvQo94navonu8PGRF0/8Qppw3AgB0VqrNoHsGX2hG20rEzIPG7YS5TezHH0wATui63KmgV/MadnxWf09fjW3b51uPPGmm7R+1VhMNhgfjwbFqpzKV5gEqeNPUmkqh7QQSpyxub5AlZeFABvb/JhebY6m3aZUWr47k0j32YgmdXJXW6G5v32GrK7LNCr10gO4PHeswy+s66FLiz30trO4MD5oWxyCptZFVG94PJtUWcu2qvQItxfmUOTVVgqdolcnQ3i+6SpVjmff4Dpg1hrG+53Xk8yh2znzJikyGmc/vg0b+3A42FQkG1NdNj3xbYxljmXdvh/Sw/Sz+Re5Y1/4y3l5n/Wg/XxWi9r1aZbP8s+Xzi8blSFPGpGRPFCjtzVfldsu38Lq3FigQ+E7zke7bNS2Wdf2GowKB7AfR/aUvRnasiy3VT7Gsrm2W6V5woqsOVOtK5kQF+TJ0gseoCpy6pY0Bqd8OLq0H+x94AkOAv+N6cM7qT/JTmv/W/axsRfAZODtXLhb3yB5Zeos5ZBXJheTz2QDwK90nLNWcrDOBGSsAE6X3h8qsjCQUt5R/oYtpmerbqbRrG5+myBBDUCMTN+FgvJsjyiR97PiH8zYEQtsDTadZJ6mSUnmoi4mhWRpmh7+9sGuI1o80rMtOuZX93cRpq8OUqokUAsIFNuEA1ArKKPUYkcIxJlXPD0CBHy4dQmT6FyPRSTb3ycxgH9Jlxdg5CqQK5AR4dBTzvBAT+lP9YAoZY7vH9wHh40+2ibiaubChoRYvdic00bwtXJLEmEoXooFdI+qUNDKu0IeswGPeIQz0hvDkCnZ7GC6dtcJsjPqU+k2lsfGr5yad4yA+gd4wfz1Gj8FRm4w4hqtA2TLjxJoggduoxgn1P7NIiHI69gR2zPeIAcff3dCN0x2xZuAs25Xh0DAn8dljkpGDmHvmfEhES/6nzb7JuQshIkWb+grL2+FlLqpHczSaltWprRaLyByYrfwAXBL1E2mPf7nKUHQHnzt+prynXFJ+S04CqbJ1UYpRLn8+pB7qUDbombVGq+tUW1LqsuMIP0Dk/wDQP4vlQQ7NvfHloKZawOlZfym18L+LQw3WYv/kik2nrbRfjCyE6R3vMyJcnTlsCXZ4IW2vJLAtZGUaX8BXDPsaQLjUxBvx4uKu2OulehszhqHH3vHxmUx6afA+OZo1pFSz7wYx3RgKftOC/8J1+C1POIlrWeJ7vXmC7ajeLiHiIfQ7SwKUAl2j9mxd0De5x9GvfD4ab2MwVBr3ENip+6JE64oygOwWkn2XDRBdVN34aXwHLHQIcBBqxFJSVozRF7c0MwTZiJMTukJzpYOalk3WNFFiUvXD/KmgfK9jojdtiKys/k+iM2om6h1Z8wBd4tevgd7c+xvPSHwxZ1qzZ7eVJzPsAhoH1oNsu9lNS+qO2d7oncbYzoC8zhoWxnphD6+Qdm7WZ9IZbzFf8wEAi5wq3BWf1n2Brug7COKEI0p5Fe+DtVaK3bk1LVLWgfiIgXp74yYW5kjFmPcfL7KyEErHbrrc1H/j1b66/OqhdsLvaFzW1eLX3JrcmzBWicJfHAzr9u/GwOtQbed8eZLA8TCWZ3AEOOYT1uNS/dEAelgGJwVcd5SIvxgN9v0jazG4SCnYyGNFm2gk/t9F9+ihqyKFLRy9Ir+Z0YDbCvs4/vykMtnEdYE64fsfiMMENBPF3MhKqho6PLTLFbq3tRcfLY7mS5meD9PiS31O5YjerR4375+mqvTvHsh7P8TwnO6jM6n7KBu9+M7n/ONMbroUgOEYm4N2vwzE1q9/nOyLkkf9p43xIbagAkBOYwDoOU6gCNNT8f+3O2uPbq+yYa8TwMtzmDu9xEg0D/j32v08dW2+07QRXNikvcTz+2CDrkWponKt+pofXXGwiaBYs8cM/Rv/ynrhfWBlcdBwYGwXOYBITDF31MOakKRZZcE4sZ38Ns52pY5Mj8xkip3UmvxA+2KC/y36EmirVahBjY24Wj526XYDI7chYdyxS/8dufQtfcnF9g9vqINOVpqrvKyuFhriZoULLpy0mf+MoMaz24gwsQwlNTa/mdIel/IXZjm+MCPTmnDgINcKJDghqF1DIaRNTdbFZPY/uy6MbZGyE+XWPnrfozPhNHQviuROpJ5lr6MtJBhqrCmODshPHdQr5lL4wAoNb1YwIFLTZfIlNQlAUJNaU2z3oGOptbUoyW9KYXV85g3zvNN8isNbE7Ck6CJNijs/vhJ9O6CJEUf0oQUufAy/jk8NuMXY+MYRvEhXv/2MhaT1WtBfbacf3wBHKFmAqlt1vxXpX8EhwQTBHOTc9VU25uisYu5qzBjlqiTtzv/Ju7EQQBTRGyHMH52E/OJsV4xKHeI4qRj8IiyMnHBRV8QCuKqPnRPrj+Ga4fU4rPlO/PZfWB6WHHYOP6cDbDhhU3P4znhp0S9gB0S6+3hLVZXspA2ps4T1je6hz8Alv1oE+JnEzg9wruTT6VGMK1IK9Fxm7gyXpIBtbusM0RST/226h9OZSae7BNjpav61OjqKpAJ0Z5Fe9YC+QD4u7h3BeRdPO6VKS0i55nyli8s4asIl44zpPu9B+CLg/VmExp46AlHkiDMiRjD/1YKy8l1bJ5z7XwN3nN7NcLtpLaaeQf+AipItfWkc1f29EqcDBgVu7YkLEby7pHtlvyYg1C3hOa0Emtbrb74D/xqdFidcodoqWPxD9TBBgltkbzaMnkD8394Ol00PpnkYcjVmC4Wc5JVoPzOPG8VaOCiL0N6+EcHd5F/SEYgNgHExFqLLYE6LXCoqk8GegdSDaw3DePNA/j/yp6IIhpsLhrKoYhGKtBHq/u7MCYvQlfckP0SDS1lRm0S5wXiPKYCtMaZecP4V4k5cP8xRZFx7xzGrRNq1KDAa5ar1+NHeUfbyJ+kBmrGBAOKSwcq0OkU/fNGizNK/mMEjk4QL5dMCCBp43Gp0DN/UwgDiK0WjluJHCkQa521Ru3j8vChkGj7jLqG4LxVviO7tE/E1HWkKRGd0ATTdhnZowgjuo+FBdVoX8V5363UqfWHaYkaeSKT14OSjY/jgLpGrN/MG6CRjX2zJiemK8CdO1GCWRP75ClLpSASZABGONgHOTogL2o2fDcNLxDZZsAIU6BRNNqQALjQwzQX0e5/7/0+6D9VmGpghyoyW0BqmBmzdY8/x+7KDi1wKhyGEEs4VIttn2ye/bs40wGft4oFAAeIQAAAA==",
  "catalog-suede": "data:image/webp;base64,UklGRnwbAABXRUJQVlA4IHAbAAAQtwCdASqAAQACPolCmkolI6implO6GRARCWduVWlTTZfU1+PdH/MDaLGxMMEStTpdB0r5oenvMdN6quV7X1+7/4+dv8RxsdY3qieCNjX+qeaP1oB9cRygrLLGVccpGL5a1jdKq45hOSV0mAq2deR0xs/6DITGiJRI6VVxykS9P/l75WpSVM6Y23uV9RVg3Ehsr+2VJAt168zyXo2jhDd1gDPdAGLAvpr+KYD5+B8nHKRPk6qt9wCmSf3dDYIi0OxgPdrD0N1FcHwzf38xKYR2FoFQU8OUrqMmriOUFXxaqIPu8Ty///tIle7zRC8J8f69OAjli9msPczJ48jnJyrzkhdYzXFu4TUbHCMF45SJenvr4rxPePy4ff3CTe6QmlKaB3tvKbiz9njM9bngws/m3hGL+9Bw58VbxY9zXoqjfK1Kw9aHFCn5/2+6qIKhkYXlgIelYXXoWvLKouEmRDWimTs68xOpE5vTVH5dqVUfhfUSNmdA2ET7T2+LcnIzPy6x0WFvRboTCRvcleuMnbYMQDAry+WXpa7R6o/dkpGpSAjnUzWKcNUIKM/SLLbXOX/+RT3rHuomKyg0KCjf+kxEmQxyXFfK0uYllpOFfA7Oqbtm1RAAN+WTB567/8PHb2m+PVaCsdiGHzUOsg6oxfAUqQO04ElSkgo24qzE42Cn2cYbARer0y5QQRDQ+Z9tLYhBR9lHrpxKrgnIWe56/c+lImrphYI1bMvx+Z6ahp6boHnwHyhJfTfrY2fyPIL+Jt8q8lfS1N+57eyesJkS8+PCQeyLVG5/TkGSzqd1yAE+e6HoCHpYME81No2MrxnINlly7sxQ5rpt0EDZEpE8iu+RsLOCz+ZHzZESuY4mz0Y+9mGD70hsvJwcTiCRgAl5niftwN5jWmB7HCk+JhDwROJLXnbu2pTo2Mz4JCgTaaTYsHMcQAMokQtWOfN8Ye8ujEs6jzNZgjyYEqAIVBD9Y2+5gMydtCmmEj56G6VZ68B6qmS/AKYKDJyROQfsXvyB8x2ry1deYb7yesGXozgtMK8oyIHxMyG/Ot9Cb4ORH3GNrUik54S0mVuEa7o5q+lvZocuQo31r1Y9cKyVVzEpsH+TDO1yF+oo8wmjEE/rlW6O1kpFLMNvQmDvyGHQUvWF//byK94GD5wsh6PLJ++HTfSLEOnwFyNlhpUz41+AkyEnIl8VsgkA0rC0JWgkUF9DhTPwPc+m7iNIMIlC9f+ITBaYH0iO2rlgLxTo23EX0hsqCPS+ASunUmmgaBb2yoj/M9X7KDnkdyw/57dSKfYyFrTOFKjlKjFLtKkXXDZmhmbfa4j4pJyU3yT016fWS1rlPpiKan3zxF3N1IUVI3pUmToSiKBvCwPKtSyPjEoiySFJKBejiWPRiKRdI2CkZrDIz1ublei0uTEiOv89D2z40pDlUKOnyE43KS+rQjZUgFWv6wMnj9yCP0idetDjdghOyzGnt61EKC+RGxIX8//UQ6GQnVT7EQV2rQf9pl3K+s3h/VFbKozVVvLlqSvtj7utzF+fLM3/RuyOYblgbgCeo2iwVzbo9Ji93gxBSbwRhgb0uxHHo3310X8aj3xG+yoJXX6l0aU7Hh+oTLx8OoGNyQ7MT/CHl9IEUSpp8OTQl9xub1zjzVtv7oIjpitvMoI2BT2EGL3cLgVyEDb2BvuSflGJKaCuRqhJGu1b3GipM+CXTQ877llC2CDi5f6x/FY8fu5qgIj/6EeKb/EZvkUPsnFlc8jtAMQJ+p+ReLWw2C4/Pu2s1imr7N2ZUt7jNYA+1btQVytM2G7uE52JzUvvMj+5eYKZRAt4ISDQWfHHjZut7vQRazeaxcvpuxfYzLcrsJhXTDxOhj61jlK4RNz/h3nzxmuaKewkseBalIl6e8+2cTm3t6kahick8VBX9Il6e+VqUiYFU7nvlalIl6e+Vqfi2TG56F5AeBalIl6e+VqUWAAA/v2fL9AUPeisVLBZeSI5CES6LgliAGZxK6JLxUj1AGaDU4BZFtzETIQAAGFhAGMPYP89TpAQIB+AIAH2AAAAAHIryKJyL/D5O3w1lkNJysXtO13hNcXWQEchgok4Fnkjwu0ig083RRxjwqbLulH2zvn3I2537GwjhiqiS6+LSXEsp9DElk18P+2Zl6UtoM96KWutUpYnxs1me2JWYbMJPgfMauiaJRx5/k5dftffaZPAACfEAMn3M4Z4KLY7G34eLPL+5nV5qddXGTu/VQKeQqjRi/wj2kFJfjjEIQLoTIV2MazsjhfNdsuit/HT/5SCvI8Gkqjoz8gW1eQ/z3lMp+EMtG47buhKAJ8qiIYfBPD2fBN73M/OH11UUdLpenbbNI0psZp5IN6nEBSV5R00uNZfv0SD0Ps2kx70ByRsq++z60bg13GTKgtuoAAAALCw7LNeC4yk1STtrhvR/BctkHlKxef9Jyk11jwif6Yqz7Lp2YXytzZkYM4YWCUpysc/EW4RujyTBRwPpPRsHJlnWWBi+k60Hy+cfHt/GkUy/32hAFHowY+DL5LV2epOwiuk1WTP/Gok6AlQzBNJ7FsEjdZLq8i6lCUZOkBCwDBgz/h3ClJQyzc9ZoTJC8k0N85Fj3w6wk335GCohv6QhGVnJjwmAtbezBsgtzEqYNeTskCh71J/WNqZD8pULCd1EWAXuzMmWIK7X57H5lgIogTTSg1D2rimM0Cgz+VwS7rCPTTb8bZ112BazgsX/kHaQBnRAEdq49u7cXJnd5oW/MHk9L5CXQ4vbUZ/rvDKlvGn+6255igFD/1GxPxF17YymsLPXhGrb8xoK/HHs0C3I8q1LPYHM37RStNPvsG9BoPf5nwDkLDZRO4aC95nJzEfswjXnyarRXriJ82liu6pbpILOUu+hDPCd1neXKmXVJf73Ljrgnx21p38Kjk/a2C1Nx6i5njMbQVF+L0jQWkAa13J0qf4a/Qz+de/OMJx4iJl6qHgx77FmdA3gIyeT3xq2344eTJHKhHpm1VD9/OLITT9hUcpkjrfGXouTHyqufrcJmi6FYrzhB/aT0kVfhfszWAOl6f4wpIWH5CmoQjme/jrjRDQFd9F21eAhdcAMFdoyWEz52dlOCtTGrh4HzPmkv7eiWn7oLU71luaI1Tcgx0GSg0cTBzLnNfwaW4ndz8XKAOR4bn6envpaUeBJnHqTxoFbdNuWezDF1jaqzdmJdnrZFddGxHwCegcu6tO+pXHcvMi4MUDyjD1+5Pycee3C006ordIm1DlSshyu6zhYLQDOI7LtU/07Rx5V7Qqr0WFVoN0ypCaa6/VdZ6nQ85jKCIwPpBL08MOHdB9uEJ/0rXmjH/HvdqSyGkIseqPCsDUbRoVqXw0MVtUn7cbxxsR2CqZaqsfFpZDYsPYiW+cFXCuHGb6wKWNa0091ROw+2+VYq5wlmsgn1+q9g0/dVwMePaBiubtPeVS4Ru4k4Yy/YhOTk3efp1cwW1LGf3g6qJJT/HM6O5CMJVFwDZlEi1YQN+zYvWAMKWgABjVsiHm1Fym24YGLBHTwLk3chYc6hoJXE0D6xyYc6oDsi1rA1yngm/FhP62WRnkXBSwAwrtU7vXP3Gh0xe1JlQYxbMZh3F8vJ2xA5d7cE6tvwkh+W+f0bWfAwW4zSlqxBvo7TPQ+EsJe4HsZC4xZH+A9Q+NphRcu6frgpGn+C6IDPe7xQ4ua/K92mTP0R/K3oOEjU8uWuLZOkX+EddZ3IGorJhQyaTc5ItchkZUeaLysyaHSrlde5Qrr7tOKOTcfnfNXEUjDx/T2Gavyxj3rZ+syXyylkLuidiz9Th/X4wZ8fi3au2F70DPkDlJ2MViM0J9ygRSh4M68TnX0OquGwP45FpZyAZlCbYfKlwRu4gHA7CCbuqZTnqSHFkgjpWRlu2xYlC0idR0JvrRtIPuVFriyanGlzKH4HAaHm8bKjI07NE5y5PE+SPMAHeZxP87rl9RcoPGxS25dyrsRWQD4BG5no2p5V4CdBZBVciwH9JdL3wo8qRJASaX/UBHCC2TJjxjK2dQMc+4PFLHcGb3vKj+RK1Oefxm5aiW2J/ArnvmJNQLb9nnYdFJhxaXOGwbX/DfVfA00bsUNanvruTyAIjUQbYz0JxtLZsiWAWuQdY+4OBM+UOXo1Fr6r2scBKIEikE8D9VIulEBejtFxwOCv5U6S0iISoMHp01dEV8Jtm2CR3Im2LpEPJX5io9p46bJCijzgOkY1tDG6Rw5FYDRR5codtkjyrRJl0cIzDMK3BfbdyeTq3pb1xIzf2thkotQSMtcwiwZg8QkIXgjRw/MQY7p4CZ2T6zAmAx+iRqaKiWhKbmstUf4rkDVVIWDPQjinBicUALd0qQY5V536XBfA+8RaZ65Wd1LGOF4x0CC2q+fFlNzGRo/oeiRO413aX4ZD1TA2LpoDDjqhQu+UndFZ1tYHnlLE4qqlqT5SLtRv9s3MM1+pf1JOjTmRcO9WhXVkfq7eB69e0+3DmtyAmXFkoUqG5OoyZJF+k/TVfBrLovhIFMH2xPxwvf51zWvPSucTVrSIFOgqSfPKfhdcxbnEEw3wJn1Gzm5NZGwMh/55uzMTurZcsoLCOizMQL/oAAwSb5fDflI3h568UbPvpZg3nJiaKfOl7EJD3bXEKEK7rR+OmQYVkhsa5K1BQL13KzDO29YJeyzjjsZebjHyqcyY5ROV6D5GyKYgVzXb6l8OiOvUg4eR+YtyAhYTQv2L66QiE64pVUOvzE3xrhGdRrlfgXTiWKKSjUN0NbKC0Y01uT4kVjUDwdWSF8qckrJzjqkZ3Y2d5WpykMZNkJmZBy/zmkxHMEaQ8bcdyS8e14RtMf/xbHbueAj4h7mfArjheC3k6UPbkv1nd/CHKv4KJvp65ZCSCQpfSsnvYBPE8/TDN7u8EXt+uBuPDRYMXS+QFr0vR05mzK7KI00S8Ql/QJoTJr+mfGFjY9zQm7QRr2IZnHBiG2CorIAFy1Ga9h7z5SBIbVDrD9N1oqyyQA+2zWXn3OsdAFxEbx46uDGvRN8o1+6dKPsOPAOB8WoCsnT6kAdp8tX851QphfmOnebavzc4A9f2aAfp3Uh0uJb7/mkdIw8ytsvxRPq8PcRzRdOqQSrd/WInagHZiSZ6P0cJCWFLozVOErJ0HPmypXGMs3Vte60bYVJ2QpkzUv7NEYiDQgi5DqGRsJ9JWKbEwmgdcdmz6VLxeU5tYnmBIAckwpugNyUepzcJrEeUY6eyPlJyAPcNkMx7uHjcB+45UMy2wbdJIWsC7/PA2Kcp3TBgJr4H4nkElJdIqDmzarbJR4vXrtrkA9wwKLR3O3pL8CNHkSknmEeKfYXGyO2idm/fDceAQew9k51JbmsHEapTmMBvV5kyuuKk7hHKbRl6DRuEJYXg1sa2ZP4K7k6fEaAzaqVbJQz72974YrmgTV7XNA3ga8WOGxz102YrrmAv0WxWRM/RAhWUCz9XZyKW4EqF4dQH11pDgyFOLno0emqCb/W0/Ui+cf4nTD6C4f2RT0OGUT6kgL02fame5ENvU2drcwGtf48YCl60qwiOW9GwVyT/f3uvTfGbm6Ji1xnK4GhgemO2X8PnGgGQFTBQX2w+8sk1ztPcs//h2+LNOSkiV7ePPzy6P2Sjh+DTruavrInz/vdHxsx+/0x+3KlK/zirwMa03w8TD5OtdWCbkb+wavI05NSH8Qa8N4lFbsA13Pm/mVSPbqZsijEkh5OKN96wBr0eaLxGA8wy3wy8CaSWgtUlqyJq1rdFsI9i0/6HxVFTgtvoHRX38JIHj+hSHmgda1phrp4f6zEF7ZRMKVeQRnO+Y+FZw1H3G+GvdgFCwLT18YmAG4tMrxIjdJj4dV1Ro5MAuNol7KkDK11jt2d4BkRv8Zwq7voFm5f1og1Q73cVQVEPQTSCc0+3N4uE7XC8npr1oioQi1qgqcUKhu0DXjDd2IwfCzjXTvzkk+z3lrlPg5fUydOESL9maICIn07Vo1a0+l1l/FXnXva4tuMav5I5u2fv8m5KEprR63O+nI5n6+wSGfpi1ubuODiiSLmGzub5TPen+EcBx0tFXjOSvNkPcv1tywSV02TkJU/xyQzsCDuEI6d7f44hHIKxk35smHZMUzU1g7LZIaV1AhtpPNRLCEvXwnyAQHOxdZ5nocwm7tEtYRTLPc+FV8neXcJv4oi8y8nSe3n6+d4xY9IrcmzQ6pZ6hYA5XCBEo5czjwGmHz7lCBYCeiNOPQiSWcpthaIkJ0+1fY3/tgtvX+y1amd1In4Ft8HCMQymeKWLbzBMndeoR/UMw0o2CbXWCqM7QqgC+N1ART9nuS/y3D7nQMPwIuDdqxCvO3R+l1DugF8qrW9jpZHpej1PiUglPZidUp+HfVSiBvS0ri0JpgNMK8gc+3zidMRhWNYRcLWhq0u0Myw0cAOomN67qGLbUqI6FQ3WJb6uZfFiRDgB/dq9L9v34j/yIW6hJHRf1urNgOq0QIFbUjjijpR8kOcB2qn3jaGB7de1nkyx/2tOkqh6kaV+nmd/XoIxeNHuOjYzdVU9qHhvPNwPBTsNYAC8KgmvfuBBtEtsiqrzP+BaR6EtHLjD9UNCQpbv2MZwqYdQ+9TA713ieVYkFowzYmcxrp3cns8Vrm/FQe2XuGC1P90Cei8sagMNsTN1Zu4OelU1rPrXqkeW6yTIAzmXisxAhkpXklhwlqE5L6rtJaNVlN1lQKKCxkWlQwXiOnNJXoBoQWGcPSPsWrrjlvbTLh67zykKQzUeuqU0bhnpB+UzucRVJ5HF8dlY6UiOryVZH49IWfiA0W65cD4+YbVhL4fm+v4h7jNTm2AvmdwUHKs3ANAzu2yrXtCfXru7OlhtHo6wDyKX2AlCQU+UT0ioqzYHu0hVqZilH1rcAkJm/fqe6joM64CczBoV/MGV/gtJ10//JrZaejuO9CMHGdO/21Nd0G2bbCKjQEx99qnH0CqqhDWifQdKoSfVV7X215MP1ng4xwAvJisURfbkZ+AFAun+Cot9qmHqRyCeaxiPNfSKVHvYyvfZEzNwfw1ntsesd51+ePkcYgnHjctVMXodXI7us7mTxJUVbmEq7J6IrqpoS3EsErCpWRmNqvkkQF18rZO2zAIMo8w4Es+9O/sJYLFWMnKut4MXoZOPwGUUzr3Upzp0AnqKxTpO4U82M84Mwt9oSMP018ILNPuav+wkiADOyPcj+dgVwEDjkJ0N8uJ28YgsaKCSGO/jW577ErrnpamdKsAW1+SQOVTfjXoTRLpzHHoSMvKmx4sEbAWQnYNiOCnOo9vEMjBpZw8f/ZmC47umjeZNYI6jMGKGlMYhSB5mnHGtnhwTaPeK24c2IpK6sAPQPG842Mr7ciiEgRpJGAI0fUJSGJcMhvCY6x5glPW+x7Ujl5yuxxZS4jejB/Bk5BEvbbNGisFiPRoYjtVQMMZlAPQHpU6P4By8kpOLsK46LDFL1mXzBJ6MHx0VhjdvE6zD59q7sYPzU5leb8g+XyboqvRdQ62HLlBj1i0QU2ylnguP6MS6VW3IpXPgFljOIoMc95DS9rg6YyT3mDkkYp2TaPF/732HZwVg4FVo0H2+RI2x8AfvEBn1NSaM8GRk3b0pReZSkHxF2vv7mTtHHvZuMeQahNMiBQCWZz7A6wRy5mHHQJ0Bq2J2iFcc+zX9gR+m1YDm9Hrvz9kW/C18wcvKsO2j1H1qIH0ykrJLlmvT6OVougxwONCSe4aZzMbC2vnzN57l7sxUutxJeqghYxDlT7zuzBowf5ixlYEW5OHCwXK2+38V36PP45xE9EOgreUwch+Vc/ydFFZjS3k+nJvtVaXGteEr5ckXHrH5tOCOIIICDnw6N30vEc/O5fU7CSA5QcLCaEAU3ySEPs2zmNUnQeeE8GjxUFV4M/suuAXNHy3wDpDzDrP3QcvPqp7/nenq5kWM067pLo/MI+KLHGbl9jIAZuI/CLlThWkDHtWPr2wheVQB41fIUermMqKAR+G9nd9lhSyjpOQU6oeJAL0po02odJ9h3dRNelGgG5OEoRIPQ5GV/rjw2+SFZOZFTuNQC4j2ut4MuDdq7vJcPu6oUo8LQG8TkmKxmEWDwpTy38Fj94U9jKsqeCRo0+Vr+RIUxDpSXLQA8PapZtX7u4mSNotyPGhTrbLstz/IrCMMuKeBmqghzt8IdIfd6O98ExByvmOIc4WG1stLaaqiDemWh6qJ+3GAzUuJpV5T+CPA5d/PR9xkYp+rHJq0oVLUm0/b0mRM48imGNTwYCEn/iQwPYUZgjo09xLy9reeUxtOEpvaiP2v+xDrKXyaGgOXSqWI0OAc5NBQ8/Ax3H4Z+10BTuRtbBS8cAFWasFdsKlCUgqbMMOeVPH+qwqd4Fp8ls3OMHLfSJ1U5lQQzeupMGmBjaJVilLx5f+jGVS6itykPpeZnTU095T5SMFv2YStWEPWh4TCQen+lTpszK9roLBIn63/L+Fd8TzlS0A91QFETkHIWzgLZ2CunNSQ+f2TNJuJBMKFveTQG8Vi9VRzJTapoQ7pCsHrlgFBkLgcomyxMrH0HaSBSnig7zYla7nYMZ2uMVld6Uo4axNQEzcQFl2VOOyZihC5Ximln3UDGX12ztZxfQ+7jDO1AhoxpZUmH4SCP2/WIxi8+a263ILku6o4IW44L3G9C3FT5Ita/yR1Gi+kJvX+xr8wVvVSzp2TUYJcvGdqsQiKM6J9Q5CNiGjk1cDXraGCV1jugeFvJuBqKj6vF7peXDYoYuN1Ywt1V3pa9EV8vmz6mS7Avj+HUZI0k12I41OegUaC7EZWTb/8nydgROtccF7/YewkjvP/tb3cfkXNdAKNFUa5dBptvVVxvQL4mnyvtC0BD/No7OFX2STmPY3Yf3LSuTvLKb0FPkzlttBvNvDMPTn0dMu6qm9yqnqyhJ/0rhAP3fxe1uNoKMFRDZlMxUsgopwtbXzu51ueipRGqqSIAKQpIbzISxp43xZUzuN1rZNSGOq16FP6Y2GkvMjbUPtyGEkFkKbU99HXklGcCDwLIrNsuYiJTz4oiIBUDL7SxnQvKu/G7m9WGRUbONbSdltox0J+eZhKh7+4RwzoG0JvIPIIsXwd0NxmTBxhJcOcjSnhXv7FrVFJE7my0uEtG1jP48fuiP9hrB84FrkypYfAGKiaGCIAL54NL79W7N3H0ctJtle7TKHlIRYIcV9NISxGHLbvjfXq14GWX8VYTDETF0Yn27/lcMKGESyXsVEFr+invrGpBox1vb4y6pzD2SOVtKJryIBX30o1bJghGaY2hvpn7Ja8BlcbTUYCRlLAnfbt0JAAAAAAImRDw51LgPyVmr8AOLwgAAABNRQBLYAAAAAAAAAtcjbVyFH+EBHrif+cuAAAAA",
  "catalog-shirt": "data:image/webp;base64,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"
};

function buildCatalog(photos: PhotoUrls) {
  const asset = (name: string) => photos[name] ?? builtInPhotos[name];
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
export { CelestiaStorefront as KnockoutStorefront };
