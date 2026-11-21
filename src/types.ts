/**
 * CELESTIA — Core TypeScript Type Definitions
 * Strict types for looks, theme tokens, interactive components, and state machines.
 */

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonPalette = 
  | 'celestia-blue' 
  | 'obsidian-black' 
  | 'mineral-slate' 
  | 'terracotta-ochre'
  | 'atelier-cream';

export type ButtonRadius = 'sharp' | 'soft' | 'pill';

export interface ButtonLookTokens {
  primaryBg: string;
  primaryHoverBg: string;
  primaryColor: string;
  primaryBorder: string;
  height: string;
  paddingY: string;
  paddingX: string;
  fontSize: string;
  letterSpacing: string;
  borderRadius: string;
  boxShadow: string;
  boxShadowHover: string;
}

export interface ColorSchemeTokens {
  name: string;
  label: string;
  bgRoyal: string;
  bgRoyalHover: string;
  accentShadow: string;
}

export interface SizingPresetTokens {
  size: ButtonSize;
  label: string;
  height: string;
  paddingY: string;
  paddingX: string;
  fontSize: string;
  letterSpacing: string;
}

export type BookingStatus = 'idle' | 'submitting' | 'confirmed' | 'error';

export interface BookingPayload {
  service: string;
  format: string;
  date: string;
  time: string;
  name: string;
  email: string;
  notes?: string;
}

export interface BookingConfirmation {
  reference: string;
  timestamp: string;
  details: BookingPayload;
}

export type OlfactoryTier = 'top' | 'heart' | 'base';

export interface OlfactoryNoteData {
  tier: OlfactoryTier;
  title: string;
  subtitle: string;
  notes: string[];
  description: string;
  accord: string;
  concentrationPct: number;
}

export interface GarmentSpec {
  id: string;
  title: string;
  fabric: string;
  origin: string;
  weightGsm: number;
  composition: string;
  silhouette: string;
  description: string;
}

export interface SoundEnvelope {
  frequency: number;
  durationMs: number;
  type: OscillatorType;
  gain: number;
}
