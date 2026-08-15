/**
 * LUMA LIVING · Ihr Areal. Unser Betrieb.
 * Application JavaScript: Click-Driven Section Views, Interactive ROI Calculator & Lead Flow
 */

document.addEventListener('DOMContentLoaded', () => {
  initSectionViewRouter();
  initMobileMenu();
  initFaqAccordion();
  initRoiCalculator();
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
  const switchView = (targetViewId, scrollTargetId = null) => {
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
      
      if (scrollTargetId) {
        setTimeout(() => {
          const scrollEl = document.getElementById(scrollTargetId);
          if (scrollEl) {
            scrollEl.scrollIntoView({ behavior: 'smooth' });
          } else {
            targetEl.scrollTop = 0;
          }
        }, 100);
      } else {
        targetEl.scrollTop = 0;
      }
      
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
      const scrollTarget = btn.getAttribute('data-scroll-target');
      switchView(target, scrollTarget);
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
   4. INTERAKTIVER ERTRAGSRECHNER (MATCHING EXACT BUSINESSPLAN MODEL)
   ========================================================================== */
function initRoiCalculator() {
  const unitsSlider = document.getElementById('calc-units');
  const occSlider = document.getElementById('calc-occupancy');
  const adrSlider = document.getElementById('calc-adr');
  const investSlider = document.getElementById('calc-invest');

  if (!unitsSlider || !occSlider || !adrSlider || !investSlider) return;

  const unitsDisplay = document.getElementById('calc-units-display');
  const occDisplay = document.getElementById('calc-occupancy-display');
  const adrDisplay = document.getElementById('calc-adr-display');
  const investDisplay = document.getElementById('calc-invest-display');

  const revenueOut = document.getElementById('calc-revenue-out');
  const nightsOut = document.getElementById('calc-nights-out');
  const costsOut = document.getElementById('calc-costs-out');
  const feeOut = document.getElementById('calc-fee-out');
  const netOut = document.getElementById('calc-net-out');
  const roiOut = document.getElementById('calc-roi-out');

  // Format CHF with Swiss apostrophe
  const formatCHF = (num) => {
    return 'CHF ' + Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  };

  const calculate = () => {
    const units = parseInt(unitsSlider.value, 10);
    const occPercent = parseInt(occSlider.value, 10);
    const adr = parseInt(adrSlider.value, 10);
    const investPerUnit = parseInt(investSlider.value, 10);

    // Update Slider Displays
    if (unitsDisplay) unitsDisplay.textContent = units.toString();
    if (occDisplay) occDisplay.textContent = `${occPercent} %`;
    if (adrDisplay) adrDisplay.textContent = formatCHF(adr);
    if (investDisplay) investDisplay.textContent = formatCHF(investPerUnit);

    // Model Calculations: 365 days / year
    const nightsPerUnit = Math.round(365 * (occPercent / 100));
    const totalLogisRevenue = units * nightsPerUnit * adr;

    // Operating costs per unit (Platform fees, marketing, energy, maintenance reserve)
    // Formula calibrated to business plan base: 3 units @ 55% occ = CHF 52'350 (CHF 17'450 / unit)
    const baseUnitCosts = 17450 * (adr / 235) * (occPercent / 55);
    const totalOperatingCosts = Math.round(units * baseUnitCosts);

    // Luma Living fee: 25% of logis revenue
    const lumaFee = Math.round(totalLogisRevenue * 0.25);

    // Net Result for Landowner
    const netResult = totalLogisRevenue - totalOperatingCosts - lumaFee;

    // Total Investment & ROI
    const totalInvestment = units * investPerUnit;
    const roiPercentage = totalInvestment > 0 ? (netResult / totalInvestment) * 100 : 0;

    // Render Outputs
    if (revenueOut) revenueOut.textContent = formatCHF(totalLogisRevenue);
    if (nightsOut) nightsOut.textContent = `${nightsPerUnit} × ${units} Einheit${units > 1 ? 'en' : ''}`;
    if (costsOut) costsOut.textContent = `− ${formatCHF(totalOperatingCosts)}`;
    if (feeOut) feeOut.textContent = `− ${formatCHF(lumaFee)}`;
    if (netOut) netOut.textContent = formatCHF(netResult);
    if (roiOut) roiOut.textContent = `${roiPercentage.toFixed(1).replace('.', ',')} %`;
  };

  [unitsSlider, occSlider, adrSlider, investSlider].forEach(slider => {
    slider.addEventListener('input', calculate);
  });

  // Initial Calculation Run
  calculate();
}

/* ==========================================================================
   5. KONTAKT & GESPRÄCHSVORLAGE GENERATOR (PAGES 8 & 9)
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
    const name = formData.get('name') || 'Partner';
    const email = formData.get('email') || 'm27pema@gmail.com';
    const location = formData.get('location') || 'Kanton Obwalden';
    const propertyType = formData.get('propertyType') || 'Areal';
    const message = formData.get('message') || 'Keine Zusatzangaben';

    const mailSubject = encodeURIComponent(`Projektanfrage Tiny Home Areal: ${location} (${name})`);
    const mailBody = `Guten Tag Tim Lubura & Marco Petric,

Ich interessiere mich für ein unverbindliches Erstgespräch bezüglich unseres Areals / Projekts für Tiny Homes.

Angaben zum Areal:
• Name: ${name}
• E-Mail: ${email}
• Ort des Areals: ${location}
• Kategorie: ${propertyType}
• Nachricht / Details: ${message}

Freundliche Grüsse
${name}`;

    if (pitchOutput) {
      pitchOutput.value = mailBody;
    }

    if (pitchModal) {
      pitchModal.classList.add('open');
    }

    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(pitchOutput.value).then(() => {
          const mailtoUrl = `mailto:m27pema@gmail.com?subject=${mailSubject}&body=${encodeURIComponent(mailBody)}`;
          window.location.href = mailtoUrl;
        });
      };
    }

    form.reset();
  };

  if (mainForm) {
    mainForm.addEventListener('submit', e => handleLeadSubmit(e, mainForm));
  }
}
