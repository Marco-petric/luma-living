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

Vielen Dank für Ihre Anfrage bezüglich (${propertyType}) in ${location}.

Als Innerschweizer Gründerteam mit operativem Dienstleistungsbetrieb in Sarnen entwickeln und betreiben wir designorientierte Tiny Homes an touristischen Lagen im Kanton Obwalden.

Unser erprobtes LUMA LIVING Betreibermodell (Modell B):
1. Zonenabklärung & Baurecht: Vorprüfung der Zonenkonformität (Art. 22/24b RPG, Campinggesetz OW)
2. Wirtschaftlichkeit: Basisszenario CHF 235/Nacht, Break-even bereits bei 24.8% Auslastung (~90 Nächte/Jahr)
3. 360° Betrieb & Housekeeping: Hauseigenes Reinigungsteam, 24/7 Gästeservice, Airbnb Superhost & Direktbuchungskanal
4. Win-Win Partnerschaft: 25–35% Managementfee – der überwiegende Teil des Cashflows (~CHF 19'000+ EBITDA/Einheit) verbleibt bei Ihnen

Wann passt Ihnen ein kurzes, unverbindliches 15-minütiges Gespräch in Sarnen oder vor Ort auf Ihrem Areal?

Freundliche Grüsse
Marco Petric & das LUMA LIVING Gründerteam
Sarnen / Kanton Obwalden · m27pema@gmail.com`;

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
