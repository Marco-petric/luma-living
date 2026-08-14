/**
 * LUMA LIVING · Nachhaltig aus der Schweiz
 * Application JavaScript: Click-Driven Section Views, Slide-Up Animations & Pitch Generator
 */

document.addEventListener('DOMContentLoaded', () => {
  initSectionViewRouter();
  initMobileMenu();
  initFaqAccordion();
  initPitchGenerator();
});

/* ==========================================================================
   1. CLICK-ONLY SECTION VIEW ROUTER
   ========================================================================== */
function initSectionViewRouter() {
  const views = document.querySelectorAll('.editorial-section-view');
  const openButtons = document.querySelectorAll('[data-open-view]');
  const closeButtons = document.querySelectorAll('[data-close-views]');
  const drawer = document.getElementById('mobile-drawer');

  // Function to switch to a specific view
  const switchView = (targetViewId) => {
    // Close mobile drawer if open
    if (drawer) {
      drawer.classList.remove('open');
      const toggle = document.querySelector('.mobile-nav-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }

    if (!targetViewId || targetViewId === 'hero') {
      // Close all overlays, return to fullscreen hero
      views.forEach(v => v.classList.remove('active'));
      updateNavHighlight(null);
      return;
    }

    const targetEl = document.getElementById(`view-${targetViewId}`);
    if (targetEl) {
      views.forEach(v => {
        if (v !== targetEl) v.classList.remove('active');
      });
      targetEl.classList.add('active');
      targetEl.scrollTop = 0;
      updateNavHighlight(targetViewId);
    }
  };

  // Update navigation underline indicators
  const updateNavHighlight = (activeId) => {
    document.querySelectorAll('.header-nav-link, .editorial-nav-link, .view-nav-btn').forEach(btn => {
      const view = btn.getAttribute('data-open-view');
      if (view === activeId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  // Open view triggers
  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-open-view');
      switchView(target);
    });
  });

  // Close view triggers
  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('hero');
    });
  });

  // Escape key closes overlay back to hero
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal-overlay.open');
      if (openModal) {
        openModal.classList.remove('open');
      } else {
        switchView('hero');
      }
    }
  });
}

/* ==========================================================================
   2. MOBILE DRAWER MENU
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const drawer = document.getElementById('mobile-drawer');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
}

/* ==========================================================================
   3. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const button = item.querySelector('.faq-q');
    if (!button) return;

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const otherBtn = other.querySelector('.faq-q');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      button.setAttribute('aria-expanded', !isOpen);
    });
  });
}

/* ==========================================================================
   4. SWISS OWNER PITCH & LEAD GENERATOR
   ========================================================================== */
function initPitchGenerator() {
  const mainForm = document.getElementById('lead-form-main');
  const pitchModal = document.getElementById('pitch-preview-modal');
  const pitchOutput = document.getElementById('pitch-text-output');
  const copyBtn = document.getElementById('copy-pitch-btn');
  const closeModalBtns = document.querySelectorAll('[data-close-modal]');

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (pitchModal) pitchModal.classList.remove('open');
    });
  });

  if (pitchModal) {
    pitchModal.addEventListener('click', (e) => {
      if (e.target === pitchModal) pitchModal.classList.remove('open');
    });
  }

  const handleLeadSubmit = (e, form) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name') || 'Liegenschaftsbesitzer/in';
    const location = formData.get('location') || 'Schweiz';
    const propertyType = formData.get('propertyType') || 'Wohnung';

    const pitchTemplate = `Guten Tag ${name},

Vielen Dank für Ihre Anfrage bezüglich Ihrer Liegenschaft (${propertyType}) in ${location}.

Basierend auf aktuellen Schweizer Marktdaten erzielen Liegenschaften in ${location} im professionellen Co-Hosting Modell von LUMA LIVING durchschnittlich bis zu +45% mehr Nettoertrag als bei einer herkömmlichen Dauermiete.

Unser Schweizer Co-Hosting Leistungspaket umfasst:
1. Vollständiges operatives Management (24/7 Gästekommunikation, Nuki Smart Check-in)
2. 5-Sterne Housekeeping & Wäscheservice durch unser geschultes Reinigungsteam
3. Tägliches Dynamic AI-Pricing für maximale Auslastung & Spitzenpreise
4. Umfassender Schutz über Airbnb AirCover (bis 3 Mio. USD) und Kautionssystem

Wann passt Ihnen ein kurzes, 10-minütiges Kennenlerngespräch oder eine kostenlose Besichtigung vor Ort?

Freundliche Grüsse
Ihr LUMA LIVING Hospitality Team Schweiz
https://lumaliving.ch · contact@lumaliving.ch`;

    if (pitchOutput) {
      pitchOutput.value = pitchTemplate;
    }

    if (pitchModal) {
      pitchModal.classList.add('open');
    }

    form.reset();
  };

  if (mainForm) {
    mainForm.addEventListener('submit', e => handleLeadSubmit(e, mainForm));
  }

  if (copyBtn && pitchOutput) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pitchOutput.value);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = 'Kopiert!';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      } catch (err) {
        pitchOutput.select();
        document.execCommand('copy');
      }
    });
  }
}
