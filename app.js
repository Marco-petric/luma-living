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
      document.querySelectorAll('.mobile-nav-toggle').forEach(t => t.setAttribute('aria-expanded', 'false'));
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
    document.querySelectorAll('.header-nav-link, .editorial-nav-link, .view-nav-btn, .mobile-drawer-link').forEach(btn => {
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
   2. MOBILE DRAWER MENU (ALLE TOGGLES & UNTERSEITEN UNTERSTÜTZT)
   ========================================================================== */
function initMobileMenu() {
  const toggles = document.querySelectorAll('.mobile-nav-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-link, .mobile-drawer button');
  if (!drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    toggles.forEach(t => t.setAttribute('aria-expanded', 'true'));
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    toggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
  };

  toggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
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
   4. INTERAKTIVER ERTRAGSRECHNER (MODERN SLIDER WITH INPUT & RESET)
   ========================================================================== */
function initRoiCalculator() {
  const unitsSlider = document.getElementById('calc-units');
  const occSlider = document.getElementById('calc-occupancy');
  const adrSlider = document.getElementById('calc-adr');
  const investSlider = document.getElementById('calc-invest');

  const unitsInput = document.getElementById('calc-units-input');
  const occInput = document.getElementById('calc-occupancy-input');
  const adrInput = document.getElementById('calc-adr-input');
  const investInput = document.getElementById('calc-invest-input');

  const unitsBadge = document.getElementById('calc-units-badge');
  const occBadge = document.getElementById('calc-occupancy-badge');
  const adrBadge = document.getElementById('calc-adr-badge');
  const investBadge = document.getElementById('calc-invest-badge');

  const revenueOut = document.getElementById('calc-revenue-out');
  const nightsOut = document.getElementById('calc-nights-out');
  const costsOut = document.getElementById('calc-costs-out');
  const feeOut = document.getElementById('calc-fee-out');
  const netOut = document.getElementById('calc-net-out');
  const roiOut = document.getElementById('calc-roi-out');
  const resetBtn = document.getElementById('calc-reset-btn');

  if (!unitsSlider || !occSlider || !adrSlider || !investSlider) return;

  // Defaults
  const defaults = {
    units: 3,
    occupancy: 55,
    adr: 235,
    invest: 145000
  };

  // Format CHF with Swiss apostrophe
  const formatCHF = (num) => {
    return 'CHF ' + Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  };

  // Active track fill color from beginning up to the thumb button
  const updateSliderTrackFill = (slider) => {
    if (!slider) return;
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || min;
    const pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
    slider.style.background = `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${pct}%, var(--border-default) ${pct}%, var(--border-default) 100%)`;
  };

  const calculate = () => {
    const units = Math.max(1, Math.min(8, parseInt(unitsSlider.value, 10) || 1));
    const occPercent = Math.max(10, Math.min(100, parseInt(occSlider.value, 10) || 50));
    const adr = Math.max(100, Math.min(1000, parseInt(adrSlider.value, 10) || 200));
    const investPerUnit = Math.max(50000, Math.min(500000, parseInt(investSlider.value, 10) || 145000));

    // Update Slider Positions & Direct Inputs
    unitsSlider.value = units;
    if (unitsInput) unitsInput.value = units;

    occSlider.value = occPercent;
    if (occInput) occInput.value = occPercent;
    const nightsPerUnit = Math.round(365 * (occPercent / 100));
    if (occBadge) occBadge.textContent = `${nightsPerUnit} Nächte / Jahr`;

    adrSlider.value = adr;
    if (adrInput) adrInput.value = adr;

    investSlider.value = investPerUnit;
    if (investInput) investInput.value = investPerUnit;

    // Update Color Fill from 0% to Knopf for all 4 Sliders
    updateSliderTrackFill(unitsSlider);
    updateSliderTrackFill(occSlider);
    updateSliderTrackFill(adrSlider);
    updateSliderTrackFill(investSlider);

    // Model Calculations
    const totalLogisRevenue = units * nightsPerUnit * adr;
    const baseUnitCosts = 17450 * (adr / 235) * (occPercent / 55);
    const totalOperatingCosts = Math.round(units * baseUnitCosts);
    const lumaFee = Math.round(totalLogisRevenue * 0.25);
    const netResult = totalLogisRevenue - totalOperatingCosts - lumaFee;
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

  // Bind Slider Events
  [unitsSlider, occSlider, adrSlider, investSlider].forEach(slider => {
    slider.addEventListener('input', calculate);
  });

  // Bind Direct Number Input Events
  if (unitsInput) {
    unitsInput.addEventListener('input', (e) => {
      unitsSlider.value = e.target.value;
      calculate();
    });
  }
  if (occInput) {
    occInput.addEventListener('input', (e) => {
      occSlider.value = e.target.value;
      calculate();
    });
  }
  if (adrInput) {
    adrInput.addEventListener('input', (e) => {
      adrSlider.value = e.target.value;
      calculate();
    });
  }
  if (investInput) {
    investInput.addEventListener('input', (e) => {
      investSlider.value = e.target.value;
      calculate();
    });
  }

  // Bind Reset Button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      unitsSlider.value = defaults.units;
      occSlider.value = defaults.occupancy;
      adrSlider.value = defaults.adr;
      investSlider.value = defaults.invest;
      calculate();
    });
  }

  // Initial Calculation Run
  calculate();
}

/* ==========================================================================
   5. DIREKTER EMAIL-VERSAND (KEIN EIGENES MAIL-PROGRAMM NÖTIG)
   ========================================================================== */
function initPitchGenerator() {
  const directForm = document.getElementById('direct-contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const statusBox = document.getElementById('form-status-msg');

  if (!directForm) return;

  directForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Wird direkt übermittelt...</span>';
    }

    if (statusBox) {
      statusBox.style.display = 'none';
      statusBox.className = 'form-status-box';
    }

    const formData = new FormData(directForm);

    try {
      const response = await fetch('https://formsubmit.co/ajax/luma.living.ch@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      if (response.ok) {
        if (statusBox) {
          statusBox.className = 'form-status-box success';
          statusBox.innerHTML = '✓ <strong>Vielen Dank!</strong> Ihre Anfrage wurde erfolgreich direkt an uns (luma.living.ch@gmail.com) übermittelt. Wir melden uns innerhalb kürzester Zeit bei Ihnen.';
          statusBox.style.display = 'block';
        }
        directForm.reset();
      } else {
        throw new Error('Übertragungsfehler');
      }
    } catch (err) {
      // Graceful fallback option
      const name = formData.get('name') || 'Partner';
      const email = formData.get('email') || 'luma.living.ch@gmail.com';
      const location = formData.get('location') || 'Kanton Obwalden';
      const propertyType = formData.get('propertyType') || 'Areal';
      const message = formData.get('message') || '';

      const mailSubject = encodeURIComponent(`Projektanfrage Tiny Home Areal: ${location} (${name})`);
      const mailBody = encodeURIComponent(`Guten Tag Tim Lubura & Marco Petric,\n\nIch interessiere mich für ein unverbindliches Erstgespräch bezüglich unseres Areals für Tiny Homes.\n\nAngaben:\n• Name: ${name}\n• E-Mail: ${email}\n• Ort: ${location}\n• Kategorie: ${propertyType}\n• Details: ${message}\n\nFreundliche Grüsse\n${name}`);

      if (statusBox) {
        statusBox.className = 'form-status-box success';
        statusBox.innerHTML = `✓ Nachricht vorbereitet. <a href="mailto:luma.living.ch@gmail.com?subject=${mailSubject}&body=${mailBody}" style="color: var(--color-primary); font-weight: 700; text-decoration: underline;">Hier klicken, um die E-Mail direkt zu versenden</a>.`;
        statusBox.style.display = 'block';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Anfrage direkt senden</span>';
      }
    }
  });
}
