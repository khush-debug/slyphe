/**
 * CELESTIA — Atelier Consultation Booking System
 * Typed state machine controlling the drawer overlay, service selection, and appointment confirmation.
 */

import { SoundEngine } from './sound.js';
import { BookingConfirmation, BookingPayload, BookingStatus } from './types.js';

export class BookingDrawer {
          drawer                     = null;
          backdrop                     = null;
          form                         = null;
          stepForm                     = null;
          stepSuccess                     = null;
          closeBtn                     = null;
          resetBtn                     = null;
          soundEngine                     = null;

          selectedService         = 'Full Signature Curation';
          selectedFormat         = 'Private Atelier';
          selectedTime         = '10:00 AM';
          status                = 'idle';

  constructor(soundEngine              ) {
    this.soundEngine = soundEngine || null;
    this.initElements();
    this.bindEvents();
  }

          initElements()       {
    this.drawer = document.getElementById('bookingDrawer');
    this.backdrop = document.getElementById('drawerBackdrop');
    this.form = document.getElementById('bookingForm')                   ;
    this.stepForm = document.getElementById('bookingStep1');
    this.stepSuccess = document.getElementById('bookingSuccess');
    this.closeBtn = document.getElementById('closeDrawerBtn');
    this.resetBtn = document.getElementById('resetBookingBtn');
  }

          bindEvents()       {
    // Global open triggers
    const openTriggers = document.querySelectorAll             ('[data-open-booking]');
    openTriggers.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    // Close triggers
    this.closeBtn?.addEventListener('click', () => this.close());
    this.backdrop?.addEventListener('click', () => this.close());
    this.resetBtn?.addEventListener('click', () => {
      this.reset();
      this.close();
    });

    // Escape key listener
    window.addEventListener('keydown', (e               ) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    // Experience Service Chips
    const serviceChips = this.drawer?.querySelectorAll                   ('.service-chip[data-service]');
    serviceChips?.forEach((chip) => {
      chip.addEventListener('click', () => {
        const parent = chip.closest('.chips-row');
        if (!parent) return;
        parent.querySelectorAll('.service-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        this.selectedService = chip.getAttribute('data-service') || 'Full Signature Curation';
        if (this.soundEngine) this.soundEngine.playClick(1900);
      });
    });

    // Time Slot Chips
    const timeChips = this.drawer?.querySelectorAll                   ('.time-chip[data-time]');
    timeChips?.forEach((chip) => {
      chip.addEventListener('click', () => {
        const parent = chip.closest('.chips-row');
        if (!parent) return;
        parent.querySelectorAll('.time-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        this.selectedTime = chip.getAttribute('data-time') || '10:00 AM';
        if (this.soundEngine) this.soundEngine.playClick(2100);
      });
    });

    // Form Submission
    this.form?.addEventListener('submit', (e             ) => {
      e.preventDefault();
      this.submitBooking();
    });
  }

         open()       {
    if (!this.drawer || !this.backdrop) return;
    this.drawer.classList.add('open');
    this.backdrop.classList.add('open');
    document.body.classList.add('drawer-open');

    if (this.soundEngine) {
      this.soundEngine.playClick(1400);
    }
  }

         close()       {
    if (!this.drawer || !this.backdrop) return;
    this.drawer.classList.remove('open');
    this.backdrop.classList.remove('open');
    document.body.classList.remove('drawer-open');
  }

         isOpen()          {
    return this.drawer?.classList.contains('open') ?? false;
  }

          submitBooking()       {
    if (!this.form) return;

    this.status = 'submitting';

    const dateInput = this.form.querySelector                  ('input[type="date"]');
    const nameInput = this.form.querySelector                  ('input[type="text"]');
    const emailInput = this.form.querySelector                  ('input[type="email"]');

    const payload                 = {
      service: this.selectedService,
      format: this.selectedFormat,
      date: dateInput?.value || new Date().toISOString().split('T')[0],
      time: this.selectedTime,
      name: nameInput?.value.trim() || 'Guest',
      email: emailInput?.value.trim() || 'guest@celestia.atelier'
    };

    const ref = `CLS-${Math.floor(100000 + Math.random() * 900000)}`;
    const confirmation                      = {
      reference: ref,
      timestamp: new Date().toISOString(),
      details: payload
    };

    // Transition to success state
    this.status = 'confirmed';

    if (this.stepForm && this.stepSuccess) {
      this.stepForm.style.display = 'none';
      this.stepSuccess.classList.add('active');

      const refEl = document.getElementById('bookingRefCode');
      const detailsEl = document.getElementById('bookingSummaryDetails');

      if (refEl) refEl.textContent = confirmation.reference;
      if (detailsEl) detailsEl.textContent = `${payload.service} • ${payload.time} on ${payload.date}`;
    }

    if (this.soundEngine) {
      this.soundEngine.playChime();
    }
  }

         reset()       {
    this.status = 'idle';
    if (this.stepForm && this.stepSuccess) {
      this.stepForm.style.display = 'block';
      this.stepSuccess.classList.remove('active');
    }
    if (this.form) {
      this.form.reset();
    }
  }
}
