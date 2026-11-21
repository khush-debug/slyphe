/**
 * CELESTIA — Interactive Atelier Booking Drawer
 * Handles appointment scheduling, consultation selection, and date/time reservations
 */

export class BookingDrawer {
  constructor(soundEngine) {
    this.sound = soundEngine;
    this.drawer = document.getElementById('bookingDrawer');
    this.backdrop = document.getElementById('drawerBackdrop');
    this.closeBtn = document.getElementById('closeDrawerBtn');
    this.form = document.getElementById('bookingForm');
    this.step1 = document.getElementById('bookingStep1');
    this.step2 = document.getElementById('bookingStep2');
    this.successState = document.getElementById('bookingSuccess');
    
    this.selectedService = 'Full Signature Curation';
    this.selectedTime = '11:00 AM';
    this.selectedDate = '2026-11-25';

    this.init();
  }

  init() {
    if (!this.drawer) return;

    // Attach open triggers to all "BOOK A CALL" and "BOOK A DISCOVERY CALL" buttons
    const triggers = document.querySelectorAll('[data-open-booking]');
    triggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.close());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    // Service selector chips
    const serviceChips = document.querySelectorAll('.service-chip');
    serviceChips.forEach(chip => {
      chip.addEventListener('click', () => {
        serviceChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.selectedService = chip.dataset.service || chip.textContent.trim();
        if (this.sound) this.sound.playClick(1400);
      });
    });

    // Time slot chips
    const timeChips = document.querySelectorAll('.time-chip');
    timeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        timeChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.selectedTime = chip.dataset.time || chip.textContent.trim();
        if (this.sound) this.sound.playClick(1200);
      });
    });

    // Form submission
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }

    const resetBtn = document.getElementById('resetBookingBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.reset();
      });
    }
  }

  isOpen() {
    return this.drawer && this.drawer.classList.contains('active');
  }

  open() {
    if (!this.drawer) return;
    this.drawer.classList.add('active');
    if (this.backdrop) this.backdrop.classList.add('active');
    document.body.classList.add('drawer-open');
    if (this.sound) {
      this.sound.playChime();
    }
  }

  close() {
    if (!this.drawer) return;
    this.drawer.classList.remove('active');
    if (this.backdrop) this.backdrop.classList.remove('active');
    document.body.classList.remove('drawer-open');
    if (this.sound) this.sound.playClick(900);
  }

  handleSubmit() {
    if (this.sound) this.sound.playChime();
    if (this.step1) this.step1.style.display = 'none';
    if (this.successState) {
      this.successState.style.display = 'block';
      const refEl = document.getElementById('bookingRefCode');
      if (refEl) {
        refEl.textContent = 'CLS-' + Math.floor(100000 + Math.random() * 900000);
      }
      const summaryEl = document.getElementById('bookingSummaryDetails');
      if (summaryEl) {
        summaryEl.textContent = `${this.selectedService} • ${this.selectedTime}`;
      }
    }
  }

  reset() {
    if (this.step1) this.step1.style.display = 'block';
    if (this.successState) this.successState.style.display = 'none';
    if (this.form) this.form.reset();
    this.close();
  }
}
