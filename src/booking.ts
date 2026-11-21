/**
 * CELESTIA — Atelier Consultation Booking System
 * Typed state machine controlling the drawer overlay, service selection, and appointment confirmation.
 */

import { SoundEngine } from './sound.js';
import { BookingConfirmation, BookingPayload, BookingStatus } from './types.js';

export class BookingDrawer {
  private drawer: HTMLElement | null = null;
  private backdrop: HTMLElement | null = null;
  private form: HTMLFormElement | null = null;
  private stepForm: HTMLElement | null = null;
  private stepSuccess: HTMLElement | null = null;
  private closeBtn: HTMLElement | null = null;
  private resetBtn: HTMLElement | null = null;
  private soundEngine: SoundEngine | null = null;

  private selectedService: string = 'Full Signature Curation';
  private selectedFormat: string = 'Private Atelier';
  private selectedTime: string = '10:00 AM';
  private status: BookingStatus = 'idle';

  constructor(soundEngine?: SoundEngine) {
    this.soundEngine = soundEngine || null;
    this.initElements();
    this.bindEvents();
  }

  private initElements(): void {
    this.drawer = document.getElementById('bookingDrawer');
    this.backdrop = document.getElementById('drawerBackdrop');
    this.form = document.getElementById('bookingForm') as HTMLFormElement;
    this.stepForm = document.getElementById('bookingStep1');
    this.stepSuccess = document.getElementById('bookingSuccess');
    this.closeBtn = document.getElementById('closeDrawerBtn');
    this.resetBtn = document.getElementById('resetBookingBtn');
  }

  private bindEvents(): void {
    // Global open triggers
    const openTriggers = document.querySelectorAll<HTMLElement>('[data-open-booking]');
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
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    // Experience Service Chips
    const serviceChips = this.drawer?.querySelectorAll<HTMLButtonElement>('.service-chip[data-service]');
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
    const timeChips = this.drawer?.querySelectorAll<HTMLButtonElement>('.time-chip[data-time]');
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
    this.form?.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault();
      this.submitBooking();
    });
  }

  public open(): void {
    if (!this.drawer || !this.backdrop) return;
    this.drawer.classList.add('open');
    this.backdrop.classList.add('open');
    document.body.classList.add('drawer-open');

    if (this.soundEngine) {
      this.soundEngine.playClick(1400);
    }
  }

  public close(): void {
    if (!this.drawer || !this.backdrop) return;
    this.drawer.classList.remove('open');
    this.backdrop.classList.remove('open');
    document.body.classList.remove('drawer-open');
  }

  public isOpen(): boolean {
    return this.drawer?.classList.contains('open') ?? false;
  }

  private submitBooking(): void {
    if (!this.form) return;

    this.status = 'submitting';

    const dateInput = this.form.querySelector<HTMLInputElement>('input[type="date"]');
    const nameInput = this.form.querySelector<HTMLInputElement>('input[type="text"]');
    const emailInput = this.form.querySelector<HTMLInputElement>('input[type="email"]');

    const payload: BookingPayload = {
      service: this.selectedService,
      format: this.selectedFormat,
      date: dateInput?.value || new Date().toISOString().split('T')[0],
      time: this.selectedTime,
      name: nameInput?.value.trim() || 'Guest',
      email: emailInput?.value.trim() || 'guest@celestia.atelier'
    };

    const ref = `CLS-${Math.floor(100000 + Math.random() * 900000)}`;
    const confirmation: BookingConfirmation = {
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

  public reset(): void {
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
