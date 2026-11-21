"use client";

import React from "react";
import { KnockoutStorefront } from "@/components/ui/knockout-landing-page";

/**
 * Demo integration for KnockoutStorefront component.
 * Custom images can be passed via the `photos` map or left empty to use the built-in catalog assets.
 */
export default function KnockoutDemo() {
  return (
    <main className="min-h-screen w-full">
      <KnockoutStorefront photos={{}} />
    </main>
  );
}
