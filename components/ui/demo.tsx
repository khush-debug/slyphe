"use client";

import React from "react";
import { CelestiaStorefront } from "@/components/ui/celestia-landing-page";

/**
 * Demo integration for CelestiaStorefront component.
 * Custom images can be passed via the `photos` map or left empty to use the built-in catalog assets.
 */
export default function CelestiaDemo() {
  return (
    <main className="min-h-screen w-full">
      <CelestiaStorefront photos={{}} />
    </main>
  );
}
