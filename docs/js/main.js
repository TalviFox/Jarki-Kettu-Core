/**
 * Järki Kettu Core (The Clever Fox) - Official Website Scripts
 * FoxDen Software / https://jkc.foxdensoftware.dev
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initThemeObserver();
    initCopyButtons();
    initInstallTabs();
    initSimulator();
    initFaqAccordion();
    initTelemetryTicker();
    initSmoothScroll();
    initHaCardInteractions();
    initImageProtection();
  });

  /* --------------------------------------------------------------------------
     1. Scroll-driven Ambient Theme Observer
     -------------------------------------------------------------------------- */
  function initThemeObserver() {
    const themeSections = document.querySelectorAll('[data-theme-trigger]');
    if (!themeSections.length || !('IntersectionObserver' in window)) {
      document.body.setAttribute('data-theme', 'dual');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const theme = entry.target.getAttribute('data-theme-trigger');
            if (theme) {
              document.body.setAttribute('data-theme', theme);
            }
          }
        });
      },
      {
        threshold: 0.35,
        rootMargin: '-10% 0px -20% 0px'
      }
    );

    themeSections.forEach((sec) => observer.observe(sec));
  }

  /* --------------------------------------------------------------------------
     2. Universal Clipboard Copy Buttons
     -------------------------------------------------------------------------- */
  function initCopyButtons() {
    const buttons = document.querySelectorAll('.btn-copy');

    buttons.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        let textToCopy = '';

        if (btn.dataset.copy) {
          textToCopy = btn.dataset.copy;
        } else if (btn.dataset.target) {
          const targetEl = document.querySelector(btn.dataset.target);
          if (targetEl) {
            textToCopy = targetEl.innerText || targetEl.textContent;
          }
        }

        if (!textToCopy) return;

        try {
          await navigator.clipboard.writeText(textToCopy.trim());
          const originalHTML = btn.innerHTML;
          btn.classList.add('copied');
          btn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Copied!</span>
          `;

          setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = originalHTML;
          }, 2200);
        } catch (err) {
          console.error('Failed to copy to clipboard:', err);
          // Fallback
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy.trim();
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand('copy');
            btn.classList.add('copied');
            setTimeout(() => btn.classList.remove('copied'), 2000);
          } catch (e) {
            console.error('Fallback copy failed', e);
          }
          document.body.removeChild(textarea);
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. Installation Tabs Navigation
     -------------------------------------------------------------------------- */
  function initInstallTabs() {
    const tabButtons = document.querySelectorAll('.install-tab-btn');
    const panes = document.querySelectorAll('.install-pane');

    if (!tabButtons.length || !panes.length) return;

    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');

        tabButtons.forEach((b) => b.classList.remove('active'));
        panes.forEach((p) => p.classList.remove('active'));

        btn.classList.add('active');
        const activePane = document.getElementById(targetId);
        if (activePane) {
          activePane.classList.add('active');
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. Interactive Thermal Envelope & Cycle Simulator
     -------------------------------------------------------------------------- */
  function initSimulator() {
    const driftInput = document.getElementById('calc-drift-rate');
    if (!driftInput) return;

    // Controls & State
    let currentUnit = 'f'; // 'f' or 'c'
    let currentSeason = 'heat'; // 'heat' or 'cool'
    let currentTons = 3.0; // 2.0, 3.0, 4.0, 5.0

    // Elements
    const labelDriftTitle = document.getElementById('label-drift-title');
    const valDriftRate = document.getElementById('val-drift-rate');
    const envelopeBadge = document.getElementById('calc-envelope-badge');
    const driftHint = document.getElementById('calc-drift-hint');
    const valCapacityTons = document.getElementById('val-capacity-tons');
    const simRecoverySpeed = document.getElementById('sim-recovery-speed');

    // Season Buttons
    const seasonButtons = document.querySelectorAll('#sim-season-group .sim-pill-btn');
    seasonButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        seasonButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentSeason = btn.dataset.season || 'heat';
        updateSeasonText();
        calculate();
      });
    });

    // Unit Buttons
    const unitButtons = document.querySelectorAll('#sim-unit-group .sim-pill-btn');
    unitButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextUnit = btn.dataset.unit || 'f';
        if (nextUnit === currentUnit) return;

        unitButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // Convert current slider value smoothly between °F and °C
        const curVal = parseFloat(driftInput.value) || 1.4;
        if (nextUnit === 'c') {
          // °F -> °C
          const cVal = Math.round(curVal * (5 / 9) * 20) / 20;
          driftInput.min = '0.1';
          driftInput.max = '2.0';
          driftInput.step = '0.05';
          driftInput.value = Math.max(0.1, Math.min(2.0, cVal)).toFixed(2);
        } else {
          // °C -> °F
          const fVal = Math.round(curVal * (9 / 5) * 10) / 10;
          driftInput.min = '0.2';
          driftInput.max = '3.5';
          driftInput.step = '0.1';
          driftInput.value = Math.max(0.2, Math.min(3.5, fVal)).toFixed(1);
        }

        currentUnit = nextUnit;
        calculate();
      });
    });

    // Equipment Tonnage Buttons
    const capButtons = document.querySelectorAll('#sim-capacity-buttons .sim-cap-btn');
    capButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        capButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentTons = parseFloat(btn.dataset.tons) || 3.0;
        calculate();
      });
    });

    // Season-aware elements
    const labelStdThird = document.getElementById('label-std-third');
    const labelJkThird = document.getElementById('label-jk-third');
    const simScienceTitle = document.getElementById('sim-science-title');
    const simScienceP = document.getElementById('sim-science-p');

    function updateSeasonText() {
      if (currentSeason === 'heat') {
        if (labelDriftTitle) labelDriftTitle.textContent = 'Envelope Heat Loss Rate (dT/dt)';
        if (driftHint) driftHint.textContent = 'Passive heat loss (conductive escape & cold infiltration) during cut-out.';
        if (labelStdThird) labelStdThird.textContent = 'Aux Heat Strip Activation:';
        if (labelJkThird) labelJkThird.textContent = 'Envelope Thermal Storage:';
        if (simScienceTitle) simScienceTitle.textContent = '🔬 Building Science: Thermal Mass & Auxiliary Heat Lockout';
        if (simScienceP) simScienceP.textContent = "During winter heating, narrow thermostat deadbands fail to warm structural framing and drywall. Rapid air-temperature drops frequently trigger expensive 10kW auxiliary electric heat strips. Järki Kettu executes deep steady-state soaks, storing BTUs in the home's structural mass while completely locking out auxiliary resistance strips.";
      } else {
        if (labelDriftTitle) labelDriftTitle.textContent = 'Envelope Heat Gain Rate (dT/dt)';
        if (driftHint) driftHint.textContent = 'Passive heat gain (solar radiation & ambient infiltration) during cut-out.';
        if (labelStdThird) labelStdThird.textContent = 'Latent Capacity Degradation:';
        if (labelJkThird) labelJkThird.textContent = 'Sensible Heat Ratio (SHR):';
        if (simScienceTitle) simScienceTitle.textContent = '🔬 Building Science: Sensible Heat vs. Latent Capacity';
        if (simScienceP) simScienceP.textContent = 'HVAC cooling capacity is split between sensible (temperature drop) and latent (moisture removal). Evaporator coils take 10-15 minutes to reach dew-point saturation. Short-cycling cools the air without removing humidity, creating a cold, clammy house. Deep thermal soaks allow sustained continuous coil drainage to dry the air.';
      }
    }

    // Comparison Stat Elements
    const statStdCph = document.getElementById('stat-std-cph');
    const statStdCycle = document.getElementById('stat-std-cycle');
    const statStdDehum = document.getElementById('stat-std-dehum');

    const statJkCph = document.getElementById('stat-jk-cph');
    const statJkCycle = document.getElementById('stat-jk-cycle');
    const statJkDehum = document.getElementById('stat-jk-dehum');

    const waveformStd = document.getElementById('waveform-standard');
    const waveformJk = document.getElementById('waveform-jk');
    const waveformStdCount = document.getElementById('waveform-std-count');
    const waveformJkCount = document.getElementById('waveform-jk-count');
    const timelineStdCph = document.getElementById('timeline-std-cph');
    const timelineJkCph = document.getElementById('timeline-jk-cph');

    function calculate() {
      const rawValue = parseFloat(driftInput.value) || (currentUnit === 'f' ? 1.4 : 0.8);
      
      // Normalize internal drift to °F/hr for physical calculations
      const driftF = currentUnit === 'f' ? rawValue : rawValue * (9 / 5);

      // Update Slider Value Pill
      if (valDriftRate) {
        valDriftRate.textContent = currentUnit === 'f' 
          ? `${rawValue.toFixed(1)}°F / hr` 
          : `${rawValue.toFixed(2)}°C / hr`;
      }

      // Update Envelope Classification Badge (Infiltration & Thermal Mass Categories)
      if (envelopeBadge) {
        envelopeBadge.className = 'sim-envelope-badge';
        if (driftF < 0.8) {
          envelopeBadge.classList.add('tight');
          envelopeBadge.textContent = '🏰 High-Capacitance Envelope (Low Infiltration • High Thermal Mass)';
        } else if (driftF <= 1.9) {
          envelopeBadge.classList.add('average');
          envelopeBadge.textContent = '🏡 Standard Building Envelope (Moderate Infiltration)';
        } else {
          envelopeBadge.classList.add('leaky');
          envelopeBadge.textContent = '🚪 High Air-Permeance Envelope (High Infiltration / Low Thermal Retention)';
        }
      }

      // Equipment Capacity Pill & Net Recovery Speed
      const btuRating = Math.round(currentTons * 12000);
      if (valCapacityTons) {
        valCapacityTons.textContent = `${currentTons.toFixed(1)} Ton (${Math.round(btuRating / 1000)}k BTU/h)`;
      }

      // Physics: In a ~2000 sq ft home (thermal capacitance ~25,000 BTU/°F),
      // gross heating/cooling recovery rate ≈ 3.5°F/hr for 3.0 Tons.
      const grossRateF = 3.5 * (currentTons / 3.0);
      const netRecF = Math.max(0.4, grossRateF - driftF);

      if (simRecoverySpeed) {
        if (currentUnit === 'f') {
          simRecoverySpeed.textContent = `+${netRecF.toFixed(1)}°F / hr`;
        } else {
          simRecoverySpeed.textContent = `+${(netRecF * (5 / 9)).toFixed(2)}°C / hr`;
        }
      }

      // Standard Thermostat Model: Narrow Throttling Range ±0.5°F (0.28°C)
      const deadbandStd = 0.5; // °F
      const coastMinsStd = Math.max(5, (deadbandStd / driftF) * 60);
      const runMinsStd = Math.max(5, (deadbandStd / netRecF) * 60);
      const cyclePeriodStd = coastMinsStd + runMinsStd;
      const startsStd = Math.min(72, Math.max(12, Math.round(1440 / cyclePeriodStd)));
      const cphStd = (startsStd / 24).toFixed(1);

      // Järki Kettu Model: Adaptive Coast Zone (2.5°F deadband)
      const deadbandJk = 2.5; // °F
      const coastMinsJk = Math.max(20, (deadbandJk / driftF) * 60);
      const runMinsJk = Math.max(15, (deadbandJk / netRecF) * 60);
      const cyclePeriodJk = coastMinsJk + runMinsJk;
      const startsJk = Math.max(4, Math.round(1440 / cyclePeriodJk));
      const cphJk = (startsJk / 24).toFixed(1);

      const reductionPct = Math.max(50, Math.min(88, Math.round((1 - (startsJk / startsStd)) * 100)));

      // Update Standard Stats (Transient Metrics & CPH)
      if (statStdCph) statStdCph.innerHTML = `${cphStd} CPH <small>(${startsStd} starts / day)</small>`;
      if (statStdCycle) statStdCycle.textContent = `${Math.round(runMinsStd)}m On / ${Math.round(coastMinsStd)}m Float`;
      if (statStdDehum) {
        if (currentSeason === 'heat') {
          statStdDehum.className = 'sim-tag bad';
          if (runMinsStd < 12) {
            statStdDehum.textContent = '🔴 High Aux Strip Risk (Short Pulse)';
          } else {
            statStdDehum.textContent = '🟡 Stratification & Heat Exchanger Cycling';
          }
        } else {
          if (runMinsStd < 12) {
            statStdDehum.className = 'sim-tag bad';
            statStdDehum.textContent = '🔴 Incomplete Saturation (< 2m condensing)';
          } else {
            statStdDehum.className = 'sim-tag bad';
            statStdDehum.textContent = `🟡 Sub-Optimal Saturation (~${Math.max(1, Math.round(runMinsStd - 10))}m condensing)`;
          }
        }
      }

      // Update Järki Kettu Stats (Steady-State, Proposed CPH & Seasonal Efficiency)
      if (statJkCph) statJkCph.innerHTML = `${cphJk} CPH <small>(${startsJk} starts / day • -${reductionPct}%)</small>`;
      if (statJkCycle) statJkCycle.textContent = `${Math.round(runMinsJk)}m On / ${Math.round(coastMinsJk)}m Float`;
      if (statJkDehum) {
        statJkDehum.className = 'sim-tag good';
        if (currentSeason === 'heat') {
          statJkDehum.textContent = '🟢 Aux Strips Locked Out (100% Compressor COP)';
        } else {
          const activeCondenseMins = Math.max(15, Math.round(runMinsJk - 10));
          statJkDehum.textContent = `🟢 Continuous Latent Extraction (~${activeCondenseMins}m continuous drain)`;
        }
      }

      // Update Matching Timeline Cards
      if (waveformStdCount) waveformStdCount.textContent = startsStd;
      if (waveformJkCount) waveformJkCount.textContent = startsJk;
      if (timelineStdCph) timelineStdCph.textContent = `${cphStd} CPH`;
      if (timelineJkCph) timelineJkCph.textContent = `Proposed ${cphJk} CPH`;

      renderWaveform(waveformStd, runMinsStd, coastMinsStd, 'run-std', 'coast-std');
      renderWaveform(waveformJk, runMinsJk, coastMinsJk, 'run-jk', 'coast-jk');
    }

    function renderWaveform(container, runMins, coastMins, runClass, coastClass) {
      if (!container) return;
      let html = '';
      let accumulated = 0;
      const totalDayMins = 1440;

      while (accumulated < totalDayMins) {
        // Run segment
        const r = Math.min(runMins, totalDayMins - accumulated);
        if (r > 0) {
          accumulated += r;
          const rWidth = (r / totalDayMins) * 100;
          html += `<div class="waveform-segment ${runClass}" style="width: ${rWidth}%" title="Running: ${Math.round(r)} mins"></div>`;
        }
        if (accumulated >= totalDayMins) break;

        // Coast segment
        const c = Math.min(coastMins, totalDayMins - accumulated);
        if (c > 0) {
          accumulated += c;
          const cWidth = (c / totalDayMins) * 100;
          html += `<div class="waveform-segment ${coastClass}" style="width: ${cWidth}%" title="Coasting: ${Math.round(c)} mins"></div>`;
        }
      }

      container.innerHTML = html;
    }

    driftInput.addEventListener('input', calculate);

    // Initial render
    updateSeasonText();
    calculate();
  }

  /* --------------------------------------------------------------------------
     5. FAQ Accordion Logic
     -------------------------------------------------------------------------- */
  function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close other open items for clean accordion UX
        document.querySelectorAll('.faq-item.open').forEach((other) => {
          if (other !== item) {
            other.classList.remove('open');
          }
        });

        if (isOpen) {
          item.classList.remove('open');
        } else {
          item.classList.add('open');
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. Cycling Live Telemetry Ticker
     -------------------------------------------------------------------------- */
  function initTelemetryTicker() {
    const slides = document.querySelectorAll('.telemetry-slide');
    const dots = document.querySelectorAll('.ticker-dot');
    const wrap = document.querySelector('.telemetry-ticker-wrap');
    if (!slides.length) return;

    let current = 0;
    let timer = null;

    function showSlide(index) {
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === index);
      });
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });
      current = index;
    }

    function nextSlide() {
      const next = (current + 1) % slides.length;
      showSlide(next);
    }

    function startTimer() {
      stopTimer();
      timer = setInterval(nextSlide, 3500);
    }

    function stopTimer() {
      if (timer) clearInterval(timer);
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.index, 10);
        if (!isNaN(idx)) {
          showSlide(idx);
          startTimer();
        }
      });
    });

    if (wrap) {
      wrap.addEventListener('mouseenter', stopTimer);
      wrap.addEventListener('mouseleave', startTimer);
    }

    startTimer();
  }

  /* --------------------------------------------------------------------------
     7. Smooth Navigation Anchor Links
     -------------------------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     8. Simulated Home Assistant Card Interactions
     -------------------------------------------------------------------------- */
  function initHaCardInteractions() {
    const coastToggle = document.getElementById('ha-coast-toggle');
    const statusCallout = document.getElementById('ha-mock-status-callout');
    const dialRing = document.getElementById('ha-mock-dial');
    const dialMode = document.getElementById('ha-mock-dial-mode');
    const dialTarget = document.getElementById('ha-mock-dial-target');
    const btnHeat = document.getElementById('btn-mode-heat');
    const btnCool = document.getElementById('btn-mode-cool');
    const btnOff = document.getElementById('btn-mode-off');

    if (coastToggle && statusCallout) {
      coastToggle.addEventListener('click', () => {
        coastToggle.classList.toggle('active');
        const isActive = coastToggle.classList.contains('active');
        if (isActive) {
          statusCallout.innerHTML = '❄️ <strong>Cooling Active:</strong> Driving house average down to 72.0°F.';
          statusCallout.style.borderColor = 'var(--brand-frost)';
          statusCallout.style.background = 'rgba(56, 189, 248, 0.1)';
        } else {
          statusCallout.innerHTML = '⚠️ <strong>Automation Disabled:</strong> Native thermostat logic taking over.';
          statusCallout.style.borderColor = 'var(--brand-amber)';
          statusCallout.style.background = 'rgba(245, 158, 11, 0.1)';
        }
      });
    }

    const modeBtns = [btnHeat, btnCool, btnOff];
    modeBtns.forEach((btn) => {
      if (!btn) return;
      btn.addEventListener('click', () => {
        modeBtns.forEach((b) => b && b.classList.remove('active', 'cool', 'heat'));
        if (btn === btnHeat) {
          btn.classList.add('active', 'heat');
          if (dialMode) dialMode.textContent = 'Heating';
          if (dialTarget) dialTarget.textContent = '68°';
          if (dialRing) {
            dialRing.style.borderTopColor = 'var(--brand-ember)';
            dialRing.style.borderRightColor = 'var(--brand-ember)';
            dialRing.style.boxShadow = '0 0 25px -4px var(--ember-glow)';
          }
          if (statusCallout) {
            statusCallout.innerHTML = '🔥 <strong>Heating Active:</strong> Deep soaking house average up to 68.5°F.';
            statusCallout.style.borderColor = 'var(--brand-ember)';
            statusCallout.style.background = 'rgba(249, 115, 22, 0.1)';
          }
        } else if (btn === btnCool) {
          btn.classList.add('active', 'cool');
          if (dialMode) dialMode.textContent = 'Cooling';
          if (dialTarget) dialTarget.textContent = '72°';
          if (dialRing) {
            dialRing.style.borderTopColor = 'var(--brand-frost)';
            dialRing.style.borderRightColor = 'var(--brand-frost)';
            dialRing.style.boxShadow = '0 0 25px -4px var(--frost-glow)';
          }
          if (statusCallout) {
            statusCallout.innerHTML = '❄️ <strong>Cooling Active:</strong> Driving house average down to 72.0°F.';
            statusCallout.style.borderColor = 'var(--brand-frost)';
            statusCallout.style.background = 'rgba(56, 189, 248, 0.1)';
          }
        } else if (btn === btnOff) {
          btn.classList.add('active');
          if (dialMode) dialMode.textContent = 'System Off';
          if (dialRing) {
            dialRing.style.borderTopColor = 'rgba(255, 255, 255, 0.2)';
            dialRing.style.borderRightColor = 'rgba(255, 255, 255, 0.2)';
            dialRing.style.boxShadow = 'none';
          }
          if (statusCallout) {
            statusCallout.innerHTML = '⏸️ <strong>System Idle:</strong> Thermostat is powered off.';
            statusCallout.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            statusCallout.style.background = 'rgba(255, 255, 255, 0.05)';
          }
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     Image Protection (Disable context menu and drag on images)
     -------------------------------------------------------------------------- */
  function initImageProtection() {
    document.addEventListener('contextmenu', (e) => {
      if (e.target.tagName === 'IMG' || (e.target.closest && e.target.closest('img'))) {
        e.preventDefault();
      }
    });

    document.addEventListener('dragstart', (e) => {
      if (e.target.tagName === 'IMG' || (e.target.closest && e.target.closest('img'))) {
        e.preventDefault();
      }
    });
  }
})();
