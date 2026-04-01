/* ============================================================
   KID'S CARE CLINIC — JavaScript
   Child & Eye Care Center | Navsari, Gujarat
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CUSTOM CURSOR ── */
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (cursor && ring && window.matchMedia('(hover: hover)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    const moveCursor = () => {
      rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
      cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(moveCursor);
    };
    moveCursor();
    document.querySelectorAll('a, button, .svc-card, .doctor-card, .gitem').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ── STICKY NAV ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── MOBILE MENU ── */
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      navMobile.classList.toggle('open');
      const isOpen = navMobile.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    navMobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navMobile.classList.remove('open'));
    });
  }

  /* ── SCROLL REVEAL ── */
  const reveals = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObs.observe(el));

  /* ── ANIMATED COUNTERS ── */
  function animateCounter(el, target, suffix = '') {
    const duration = 2000;
    const startTime = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(easeOut(progress) * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    };
    requestAnimationFrame(step);
  }

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

  /* ── TESTIMONIALS CAROUSEL ── */
  const track = document.getElementById('testi-track');
  const slides = document.querySelectorAll('.testi-slide');
  const dots = document.querySelectorAll('.tdot');
  const prevBtn = document.getElementById('testi-prev');
  const nextBtn = document.getElementById('testi-next');

  if (track && slides.length > 0) {
    let current = 0;
    let slidesPerView = getSlidesPerView();
    let maxIdx = Math.max(0, slides.length - slidesPerView);
    let autoTimer;

    function getSlidesPerView() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }

    function getSlideWidth() {
      return slides[0].getBoundingClientRect().width + 24; // 24 = gap
    }

    function goTo(idx) {
      slidesPerView = getSlidesPerView();
      maxIdx = Math.max(0, slides.length - slidesPerView);
      current = Math.max(0, Math.min(idx, maxIdx));
      track.style.transform = `translateX(-${current * getSlideWidth()}px)`;
      dots.forEach((d, i) => d.classList.toggle('on', i === current));
    }

    function startAuto() {
      autoTimer = setInterval(() => goTo(current >= maxIdx ? 0 : current + 1), 4500);
    }
    function stopAuto() { clearInterval(autoTimer); }

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));

    window.addEventListener('resize', () => goTo(current), { passive: true });
    goTo(0);
    startAuto();

    // Touch/swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { stopAuto(); goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
    }, { passive: true });
  }

  /* ── GALLERY LIGHTBOX ── */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');
  const lbCaption = document.getElementById('lb-caption');
  const galleryItems = document.querySelectorAll('.gitem');
  let currentLbIdx = 0;

  if (lightbox && galleryItems.length > 0) {
    function openLightbox(idx) {
      currentLbIdx = idx;
      const img = galleryItems[idx].querySelector('img');
      lbImg.src = img.src.replace(/\?.*$/, '') + '?w=1200&q=90&auto=format&fit=crop';
      if (lbCaption) lbCaption.textContent = img.alt || `Photo ${idx + 1} of ${galleryItems.length}`;
      lightbox.classList.add('on');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('on');
      document.body.style.overflow = '';
    }
    function lbNavigate(dir) {
      currentLbIdx = (currentLbIdx + dir + galleryItems.length) % galleryItems.length;
      const img = galleryItems[currentLbIdx].querySelector('img');
      lbImg.style.opacity = '0';
      setTimeout(() => {
        lbImg.src = img.src.replace(/\?.*$/, '') + '?w=1200&q=90&auto=format&fit=crop';
        if (lbCaption) lbCaption.textContent = img.alt || `Photo ${currentLbIdx + 1} of ${galleryItems.length}`;
        lbImg.style.opacity = '1';
      }, 200);
    }
    galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
    lbClose?.addEventListener('click', closeLightbox);
    lbPrev?.addEventListener('click', () => lbNavigate(-1));
    lbNext?.addEventListener('click', () => lbNavigate(1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('on')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbNavigate(-1);
      if (e.key === 'ArrowRight') lbNavigate(1);
    });
  }

  /* ── GROWTH TRACKER TABS ── */
  const trackerTabs = document.querySelectorAll('.tracker-tab');
  const trackerSvg = document.getElementById('tracker-svg');
  const chartData = {
    height: { label: 'Height (cm)', boys: [50,75,87,95,102,108,115,122,128], girls: [49,74,85,94,101,107,113,120,126], color1: '#2B9FD1', color2: '#EC4899' },
    weight: { label: 'Weight (kg)', boys: [3.5,9,12,14,16.5,18.5,20,22,25], girls: [3.3,8.8,11.5,13.5,15.8,17.5,19,21,23], color1: '#2DB87C', color2: '#F59E0B' }
  };
  let activeTab = 'height';

  function drawChart(type) {
    if (!trackerSvg) return;
    const data = chartData[type];
    const W = 480, H = 200, pl = 40, pt = 20, pr = 20, pb = 30;
    const cW = W - pl - pr, cH = H - pt - pb;
    const ages = ['0m','6m','1y','2y','3y','4y','5y','6y','7y'];
    const allVals = [...data.boys, ...data.girls];
    const minV = Math.min(...allVals) * 0.9, maxV = Math.max(...allVals) * 1.05;

    const xPos = (i) => pl + (i / (ages.length - 1)) * cW;
    const yPos = (v) => pt + cH - ((v - minV) / (maxV - minV)) * cH;

    const makePath = (vals) => vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xPos(i).toFixed(1)},${yPos(v).toFixed(1)}`).join(' ');
    const makeArea = (vals) => `${makePath(vals)} L ${xPos(vals.length-1).toFixed(1)},${(pt+cH).toFixed(1)} L ${xPos(0).toFixed(1)},${(pt+cH).toFixed(1)} Z`;

    trackerSvg.innerHTML = `
      <defs>
        <linearGradient id="ga1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${data.color1}" stop-opacity="0.22"/>
          <stop offset="100%" stop-color="${data.color1}" stop-opacity="0.02"/>
        </linearGradient>
        <linearGradient id="ga2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${data.color2}" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="${data.color2}" stop-opacity="0.02"/>
        </linearGradient>
      </defs>
      <!-- Grid -->
      ${[0,0.25,0.5,0.75,1].map(t => {
        const y = (pt + cH - t*cH).toFixed(1);
        return `<line x1="${pl}" y1="${y}" x2="${W-pr}" y2="${y}" stroke="#E2EEF8" stroke-width="1"/>
                <text x="${pl-6}" y="${(parseFloat(y)+4).toFixed(1)}" font-size="9" fill="#8CA3B8" text-anchor="end">${Math.round(minV + t*(maxV-minV))}</text>`;
      }).join('')}
      <!-- X labels -->
      ${ages.map((a, i) => `<text x="${xPos(i).toFixed(1)}" y="${H-8}" font-size="9" fill="#8CA3B8" text-anchor="middle">${a}</text>`).join('')}
      <!-- Areas -->
      <path d="${makeArea(data.boys)}" fill="url(#ga1)"/>
      <path d="${makeArea(data.girls)}" fill="url(#ga2)"/>
      <!-- Lines -->
      <path d="${makePath(data.boys)}" fill="none" stroke="${data.color1}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${makePath(data.girls)}" fill="none" stroke="${data.color2}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="5,3"/>
      <!-- Dots -->
      ${data.boys.map((v, i) => `<circle cx="${xPos(i).toFixed(1)}" cy="${yPos(v).toFixed(1)}" r="4" fill="${data.color1}" stroke="white" stroke-width="2"/>`).join('')}
      ${data.girls.map((v, i) => `<circle cx="${xPos(i).toFixed(1)}" cy="${yPos(v).toFixed(1)}" r="4" fill="${data.color2}" stroke="white" stroke-width="2"/>`).join('')}
    `;
  }

  trackerTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      trackerTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.dataset.tab;
      drawChart(activeTab);
    });
  });
  drawChart('height');

  /* ── APPOINTMENT FORM ── */
  const apptForm = document.getElementById('appt-form');
  if (apptForm) {
    apptForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = apptForm.querySelector('.form-submit');
      const original = btn.textContent;
      btn.textContent = '✅ Appointment Requested!';
      btn.style.background = 'linear-gradient(135deg, #2DB87C, #1E8A5A)';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        apptForm.reset();
      }, 3000);
    });
  }

  /* ── WHATSAPP BOOKING ── */
  document.querySelectorAll('.wa-book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = document.getElementById('f-name')?.value || '';
      const phone = document.getElementById('f-phone')?.value || '';
      const age = document.getElementById('f-age')?.value || '';
      const service = document.getElementById('f-service')?.value || '';
      const msg = encodeURIComponent(
        `Hello Doctor,\n\nI'd like to book an appointment at Kid's Care Clinic.\n\n` +
        `Name: ${name}\nPhone: ${phone}\nChild Age: ${age}\nService Needed: ${service}\n\nPlease confirm a suitable time. Thank you!`
      );
      window.open(`https://wa.me/919898898989?text=${msg}`, '_blank');
    });
  });

  /* ── RIPPLE EFFECT ON BUTTONS ── */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute; border-radius:50%; transform:scale(0);
        animation:rippleAnim 0.6s linear; pointer-events:none;
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        background:rgba(255,255,255,0.3);
      `;
      btn.style.position = 'relative'; btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `@keyframes rippleAnim { to { transform:scale(4); opacity:0; } }`;
  document.head.appendChild(rippleStyle);

  /* ── SMOOTH SCROLL NAV ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  /* ── ACTIVE NAV LINK HIGHLIGHT ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(l => {
          l.style.color = l.getAttribute('href') === `#${id}` ? 'var(--primary)' : '';
          l.style.background = l.getAttribute('href') === `#${id}` ? 'var(--primary-light)' : '';
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => sectionObs.observe(s));

  /* ── PARALLAX HERO BLOBS (subtle) ── */
  const heroBlobs = document.querySelectorAll('.hero-blob');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    heroBlobs.forEach((blob, i) => {
      const speed = 0.08 + i * 0.04;
      blob.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }, { passive: true });

  /* ── STAGGER CARD ANIMATIONS ── */
  const svcCards = document.querySelectorAll('.svc-card');
  svcCards.forEach((c, i) => {
    c.style.transitionDelay = `${i * 0.05}s`;
    c.classList.add('reveal');
  });

  /* ── RE-OBSERVE AFTER STAGGER ── */
  document.querySelectorAll('.reveal:not(.in)').forEach(el => revealObs.observe(el));

  /* ── FLOATING WHATSAPP NUMBER ── */
  const waFloat = document.getElementById('wa-float');
  if (waFloat) {
    waFloat.addEventListener('click', () => {
      window.open('https://wa.me/919898898989', '_blank');
    });
  }

});

/* ═══════════════════════════════════════════════════════════════
   💉 VACCINATION TRACKER
   IAP (Indian Academy of Pediatrics) Schedule 2023
   ═══════════════════════════════════════════════════════════════ */

const VAX_SCHEDULE = [
  {
    ageLabel: "At Birth", ageMonths: 0,
    vaccines: [
      { id:"v_bcg",  name:"BCG", full:"Bacillus Calmette-Guérin (Tuberculosis)", optional:false },
      { id:"v_opv0", name:"OPV-0", full:"Oral Polio Vaccine – Birth Dose", optional:false },
      { id:"v_hepb1",name:"Hepatitis B1", full:"Hepatitis B – 1st Dose (Birth)", optional:false },
      { id:"v_vit_k",name:"Vitamin K", full:"Vitamin K injection (Phytomenadione)", optional:false },
    ]
  },
  {
    ageLabel: "6 Weeks", ageMonths: 1.5,
    vaccines: [
      { id:"v_dtp1",  name:"DTwP/DTaP-1", full:"Diphtheria, Tetanus, Pertussis – 1st Dose", optional:false },
      { id:"v_ipv1",  name:"IPV-1", full:"Inactivated Polio Vaccine – 1st Dose", optional:false },
      { id:"v_hib1",  name:"Hib-1", full:"Haemophilus influenzae type b – 1st Dose", optional:false },
      { id:"v_hepb2", name:"Hepatitis B2", full:"Hepatitis B – 2nd Dose (6 weeks)", optional:false },
      { id:"v_rota1", name:"Rotavirus-1", full:"Rotavirus Vaccine – 1st Dose", optional:false },
      { id:"v_pcv1",  name:"PCV-1", full:"Pneumococcal Conjugate Vaccine – 1st Dose", optional:false },
    ]
  },
  {
    ageLabel: "10 Weeks", ageMonths: 2.5,
    vaccines: [
      { id:"v_dtp2",  name:"DTwP/DTaP-2", full:"Diphtheria, Tetanus, Pertussis – 2nd Dose", optional:false },
      { id:"v_ipv2",  name:"IPV-2", full:"Inactivated Polio Vaccine – 2nd Dose", optional:false },
      { id:"v_hib2",  name:"Hib-2", full:"Haemophilus influenzae type b – 2nd Dose", optional:false },
      { id:"v_rota2", name:"Rotavirus-2", full:"Rotavirus Vaccine – 2nd Dose", optional:false },
      { id:"v_pcv2",  name:"PCV-2", full:"Pneumococcal Conjugate Vaccine – 2nd Dose", optional:false },
    ]
  },
  {
    ageLabel: "14 Weeks", ageMonths: 3.5,
    vaccines: [
      { id:"v_dtp3",  name:"DTwP/DTaP-3", full:"Diphtheria, Tetanus, Pertussis – 3rd Dose", optional:false },
      { id:"v_ipv3",  name:"IPV-3", full:"Inactivated Polio Vaccine – 3rd Dose", optional:false },
      { id:"v_hib3",  name:"Hib-3", full:"Haemophilus influenzae type b – 3rd Dose", optional:false },
      { id:"v_hepb3", name:"Hepatitis B3", full:"Hepatitis B – 3rd Dose (14 weeks)", optional:false },
      { id:"v_rota3", name:"Rotavirus-3", full:"Rotavirus Vaccine – 3rd Dose", optional:false },
      { id:"v_pcv3",  name:"PCV-3", full:"Pneumococcal Conjugate Vaccine – 3rd Dose", optional:false },
    ]
  },
  {
    ageLabel: "6 Months", ageMonths: 6,
    vaccines: [
      { id:"v_flu1",  name:"Influenza-1", full:"Influenza Vaccine – 1st Dose (annual thereafter)", optional:false },
      { id:"v_typh1", name:"Typhoid (TCV)", full:"Typhoid Conjugate Vaccine – 1st Dose", optional:false },
    ]
  },
  {
    ageLabel: "9 Months", ageMonths: 9,
    vaccines: [
      { id:"v_mmr1",  name:"MMR-1", full:"Measles, Mumps, Rubella – 1st Dose", optional:false },
      { id:"v_jenc1", name:"JE-1", full:"Japanese Encephalitis – 1st Dose (endemic areas)", optional:false },
      { id:"v_mcv1",  name:"MCV-1", full:"Meningococcal Conjugate Vaccine – 1st Dose", optional:true },
    ]
  },
  {
    ageLabel: "12 Months", ageMonths: 12,
    vaccines: [
      { id:"v_var1",  name:"Varicella-1", full:"Chickenpox Vaccine – 1st Dose", optional:false },
      { id:"v_hepa1", name:"Hepatitis A-1", full:"Hepatitis A – 1st Dose", optional:false },
      { id:"v_pcvb",  name:"PCV Booster", full:"Pneumococcal Conjugate Vaccine – Booster", optional:false },
    ]
  },
  {
    ageLabel: "15–18 Months", ageMonths: 15,
    vaccines: [
      { id:"v_mmr2",  name:"MMR-2", full:"Measles, Mumps, Rubella – 2nd Dose", optional:false },
      { id:"v_dtpb1", name:"DTwP/DTaP B1", full:"Diphtheria, Tetanus, Pertussis – 1st Booster", optional:false },
      { id:"v_ipvb1", name:"IPV Booster-1", full:"Inactivated Polio Vaccine – 1st Booster", optional:false },
      { id:"v_hibb",  name:"Hib Booster", full:"Haemophilus influenzae type b – Booster", optional:false },
    ]
  },
  {
    ageLabel: "18 Months", ageMonths: 18,
    vaccines: [
      { id:"v_hepa2", name:"Hepatitis A-2", full:"Hepatitis A – 2nd Dose", optional:false },
      { id:"v_jenc2", name:"JE-2", full:"Japanese Encephalitis – 2nd Dose", optional:false },
    ]
  },
  {
    ageLabel: "2 Years", ageMonths: 24,
    vaccines: [
      { id:"v_typh2", name:"Typhoid Booster", full:"Typhoid Conjugate Vaccine – Booster (every 3 yrs)", optional:false },
      { id:"v_flu_a", name:"Influenza (Annual)", full:"Annual Influenza Vaccine – Yearly booster recommended", optional:false },
    ]
  },
  {
    ageLabel: "4–6 Years", ageMonths: 48,
    vaccines: [
      { id:"v_dtpb2", name:"DTwP/DTaP B2", full:"Diphtheria, Tetanus, Pertussis – 2nd Booster", optional:false },
      { id:"v_opvb",  name:"OPV Booster", full:"Oral Polio Vaccine – Booster", optional:false },
      { id:"v_mmr3",  name:"MMR-3 / MR", full:"Measles, Mumps, Rubella – 3rd Dose", optional:false },
      { id:"v_var2",  name:"Varicella-2", full:"Chickenpox Vaccine – 2nd Dose", optional:false },
    ]
  },
  {
    ageLabel: "10–12 Years", ageMonths: 120,
    vaccines: [
      { id:"v_tdap",  name:"Tdap", full:"Tetanus, Diphtheria, Pertussis – Adolescent Booster", optional:false },
      { id:"v_hpv",   name:"HPV", full:"Human Papillomavirus Vaccine (2 doses, 6 months apart)", optional:true },
      { id:"v_td",    name:"Td", full:"Tetanus-Diphtheria – Booster every 10 years", optional:false },
    ]
  }
];

const vaxDoneState = {};

function setQuickAge(months) {
  const now = new Date();
  const dob = new Date(now.getTime() - months * 30.44 * 24 * 3600 * 1000);
  const dobEl = document.getElementById('vt-dob');
  if (dobEl) {
    dobEl.value = dob.toISOString().split('T')[0];
    calcVaccineSchedule();
  }
}

function calcVaccineSchedule() {
  const dobVal = document.getElementById('vt-dob').value;
  if (!dobVal) { alert('Please select your child\'s date of birth.'); return; }

  const dob = new Date(dobVal);
  const now = new Date();
  const ageMs = now - dob;
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  const ageMonths = ageDays / 30.44;

  const ageYears = Math.floor(ageMonths / 12);
  const remainingMonths = Math.floor(ageMonths % 12);
  let ageText = '';
  if (ageYears > 0) ageText = `${ageYears} yr${ageYears > 1 ? 's' : ''} ${remainingMonths} mo`;
  else ageText = `${Math.round(ageMonths)} months`;

  const progressWrap = document.getElementById('vt-progress-wrap');
  const legend = document.getElementById('vt-legend');
  progressWrap.style.display = 'block';
  legend.style.display = 'flex';
  document.getElementById('vt-child-age-label').textContent = `Current Age: ${ageText}`;

  const schedule = document.getElementById('vt-schedule');
  schedule.innerHTML = '';

  let totalVax = 0, doneVax = 0, dueVax = 0, upcomingVax = 0;

  VAX_SCHEDULE.forEach(group => {
    const groupEl = document.createElement('div');
    groupEl.className = 'vt-age-group';

    const isPast = ageMonths > group.ageMonths + 1.5;
    const isCurrent = Math.abs(ageMonths - group.ageMonths) <= 1.5 || (ageMonths >= group.ageMonths - 0.5 && ageMonths < group.ageMonths + 2);
    const isFuture = ageMonths < group.ageMonths - 1.5;

    let badgeClass = 'future'; let badgeText = '⏳ Upcoming';
    if (group.ageMonths === 0 && ageMonths < 0.5) { badgeClass = 'at-birth'; badgeText = '🔔 Due Now'; }
    else if (isPast) { badgeClass = 'past'; badgeText = '✅ Past Due'; }
    else if (isCurrent) { badgeClass = 'current'; badgeText = '🔔 Due Now!'; }
    else { badgeClass = 'future'; badgeText = '📅 Upcoming'; }

    const groupDone = group.vaccines.filter(v => vaxDoneState[v.id]).length;
    const groupTotal = group.vaccines.length;
    group.vaccines.forEach(v => {
      totalVax++;
      const isVaxDone = !!vaxDoneState[v.id];
      if (isVaxDone) doneVax++;
      else if (!isFuture) dueVax++;
      else upcomingVax++;
    });

    groupEl.innerHTML = `
      <div class="vt-age-head" onclick="toggleVtGroup(this.parentElement)">
        <span class="vt-age-badge ${badgeClass}">${badgeText}</span>
        <span class="vt-age-title">${group.ageLabel}</span>
        <span class="vt-age-progress">${groupDone}/${groupTotal} done</span>
        <span class="vt-age-chevron">▾</span>
      </div>
      <div class="vt-age-body">
        <div class="vt-vaccines">
          ${group.vaccines.map(v => {
            const done = vaxDoneState[v.id];
            let statusClass = 'vt-status-upcoming'; let statusText = 'Upcoming';
            if (done) { statusClass = 'vt-status-done'; statusText = '✅ Done'; }
            else if (isCurrent || isPast) { statusClass = 'vt-status-due'; statusText = '🔔 Due'; }
            return `
              <div class="vt-vaccine-row ${done ? 'done-vac' : ''}" onclick="toggleVaccine('${v.id}', this)">
                <div class="vt-check">${done ? '✓' : ''}</div>
                <div style="flex:1;">
                  <span class="vt-vac-name">${v.name} ${v.optional ? '<span class="vt-optional-tag">Optional</span>' : ''}</span>
                  <span class="vt-vac-full">${v.full}</span>
                </div>
                <span class="vt-vac-status ${statusClass}">${statusText}</span>
              </div>`;
          }).join('')}
        </div>
      </div>`;

    // Auto-open current age group
    if (isCurrent) { groupEl.classList.add('open'); }
    schedule.appendChild(groupEl);
  });

  const pct = totalVax > 0 ? Math.round((doneVax / totalVax) * 100) : 0;
  document.getElementById('vt-progress-fill').style.width = pct + '%';
  document.getElementById('vt-done-count').textContent = doneVax;
  document.getElementById('vt-due-count').textContent = dueVax;
  document.getElementById('vt-upcoming-count').textContent = upcomingVax;
}

function toggleVaccine(id, row) {
  event && event.stopPropagation();
  vaxDoneState[id] = !vaxDoneState[id];
  const done = vaxDoneState[id];
  row.classList.toggle('done-vac', done);
  const check = row.querySelector('.vt-check');
  if (check) check.textContent = done ? '✓' : '';
  const status = row.querySelector('.vt-vac-status');
  if (status) {
    status.className = 'vt-vac-status ' + (done ? 'vt-status-done' : 'vt-status-due');
    status.textContent = done ? '✅ Done' : '🔔 Due';
  }
  // Recount
  const dobEl = document.getElementById('vt-dob');
  if (dobEl && dobEl.value) {
    const dob = new Date(dobEl.value);
    const ageMonths = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    let doneCount = 0, total = 0;
    VAX_SCHEDULE.forEach(g => g.vaccines.forEach(v => { total++; if (vaxDoneState[v.id]) doneCount++; }));
    const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
    document.getElementById('vt-progress-fill').style.width = pct + '%';
    document.getElementById('vt-done-count').textContent = doneCount;
  }
}

function toggleVtGroup(el) { el.classList.toggle('open'); }

// Set max date for DOB to today
const dobInput = document.getElementById('vt-dob');
if (dobInput) dobInput.max = new Date().toISOString().split('T')[0];


/* ═══════════════════════════════════════════════════════════════
   🤒 SYMPTOMS GUIDE
   ═══════════════════════════════════════════════════════════════ */

const SYMPTOMS_DATA = [
  {
    id: "fever", icon: "🌡️", name: "Fever", category: "moderate",
    brief: "Body temperature above 100.4°F (38°C)",
    description: "Fever is the body's natural defense against infection. In children, it's very common and usually indicates the immune system is fighting a virus or bacteria.",
    homeCare: ["Give age-appropriate dose of Paracetamol (see Dose Guide)", "Dress in light clothing; avoid bundling", "Offer plenty of fluids (ORS, water, coconut water)", "Lukewarm sponge bath on forehead and armpits", "Ensure rest and monitor temperature every 3–4 hours"],
    whenToVisit: ["Fever above 104°F (40°C) unresponsive to medication", "Fever in infants under 3 months (any fever = visit clinic)", "Fever lasting more than 3 days", "Accompanied by rash, stiff neck, difficulty breathing", "Child is unusually lethargic, confused or inconsolable"],
    eyeNote: null, tags: ["fever","temperature","hot","warm"],
  },
  {
    id: "cough", icon: "🫁", name: "Cough & Cold", category: "mild",
    brief: "Common respiratory infection with runny nose, sneezing",
    description: "Cough and cold (upper respiratory tract infection) is the most common childhood illness, often caused by rhinovirus. Most cases resolve in 7–10 days.",
    homeCare: ["Saline nasal drops 2–3 times daily to clear congestion", "Steam inhalation (supervised) for older children", "Honey (for children 1yr+) — 1 tsp at bedtime soothes throat", "Keep child hydrated; warm soups and fluids help", "Elevate head while sleeping using an extra pillow"],
    whenToVisit: ["Breathing is fast or labored (ribs visible during breathing)", "High fever persistent with cough", "Cough lasting more than 2 weeks", "Green/yellow mucus for more than 7 days", "Child under 3 months with any cough"],
    eyeNote: null, tags: ["cough","cold","runny nose","sneeze","congestion","flu"],
  },
  {
    id: "diarrhea", icon: "💧", name: "Diarrhea & Vomiting", category: "moderate",
    brief: "Loose stools, vomiting — risk of dehydration",
    description: "Acute gastroenteritis (stomach flu) is very common in children. The main danger is dehydration. Oral rehydration therapy (ORS) is life-saving.",
    homeCare: ["Start ORS immediately — Electral, Enerzal or WHO-ORS", "Give 50–100 ml ORS after each loose stool", "Continue breastfeeding if applicable", "Zinc supplements (as prescribed) for 14 days", "BRAT diet: Banana, Rice, Apple sauce, Toast for older children"],
    whenToVisit: ["Signs of dehydration: no urination for 6+ hrs, dry mouth, sunken eyes", "Blood or mucus in stools", "Vomiting continuously (can't keep any fluids down)", "High fever with diarrhea", "Child appears very weak or drowsy"],
    eyeNote: null, tags: ["diarrhea","loose stool","vomiting","gastro","stomach","dehydration"],
  },
  {
    id: "rash", icon: "🔴", name: "Skin Rash", category: "moderate",
    brief: "Red spots, hives, eczema or unknown skin changes",
    description: "Rashes in children can be caused by viral infections, allergic reactions, heat, eczema, or insect bites. The appearance, spread, and accompanying symptoms help identify the cause.",
    homeCare: ["Keep rash area clean and dry", "Avoid scratching — trim nails short", "Cool compress for itchy rashes or hives", "Calamine lotion for mild itching (chickenpox, heat rash)", "Avoid suspected allergen foods or substances"],
    whenToVisit: ["Rash spreading rapidly or covering large body areas", "Rash with high fever, joint pain, or breathing difficulty", "Purple/dark red spots that don't fade on pressing (glass test)", "Severe allergic reaction: lip swelling, throat tightness", "Rash after a new medication was started — stop and visit immediately"],
    eyeNote: "Rashes near the eyes (eyelid, around eyes) need evaluation by Dr. Vibha Shah — some eye conditions present with periorbital rash.",
    tags: ["rash","spots","hives","eczema","allergy","itching","skin"],
  },
  {
    id: "eye_red", icon: "👁️", name: "Red / Pink Eye", category: "eye",
    brief: "Eye redness, discharge, itching or watering",
    description: "Conjunctivitis (pink eye) is an inflammation of the conjunctiva. It can be bacterial, viral, or allergic. Highly contagious in children — proper hygiene is essential.",
    homeCare: ["Clean eye discharge gently with cotton soaked in clean water (inner to outer corner)", "Do not rub eyes — keep hands clean", "Allergic conjunctivitis: cold compress provides relief", "Keep child home from school to prevent spread", "Do not share towels or pillowcases"],
    whenToVisit: ["Visit Dr. Vibha Shah if eye remains red after 48 hours", "Yellow/green discharge requiring antibiotic drops", "Eye pain or photosensitivity (sensitivity to light)", "Vision appears blurry or reduced", "Both eyes affected or spreading rapidly"],
    eyeNote: "All eye redness in children warrants evaluation by Dr. Vibha Shah (MS Eye Surgeon). Untreated conjunctivitis can lead to corneal involvement.",
    tags: ["red eye","pink eye","conjunctivitis","eye redness","discharge","watery eyes"],
  },
  {
    id: "squint", icon: "🔭", name: "Squint / Crossed Eyes", category: "eye",
    brief: "Eyes pointing in different directions, not aligned",
    description: "Squint (strabismus) occurs when the eyes don't align together. In children, it's crucial to treat early to prevent amblyopia (lazy eye) and permanent vision damage.",
    homeCare: ["There is no home treatment for squint — professional evaluation is essential", "Eye patching therapy (if prescribed) must be done consistently", "Encourage activities that require focused vision (reading, drawing)", "Avoid excessive screen time which can strain eye muscles", "Follow Dr. Vibha Shah's prescribed exercise regimen"],
    whenToVisit: ["Visit Dr. Vibha Shah as soon as you notice the squint", "Squint present from birth or appearing suddenly", "Child tilts or turns head to see clearly", "Family history of squint or glasses in childhood", "Child closes one eye in bright light or sunlight"],
    eyeNote: "Squint in children MUST be evaluated early. Dr. Vibha Shah specializes in pediatric squint treatment including glasses, patching, and surgery when needed.",
    tags: ["squint","strabismus","crossed eyes","lazy eye","eye alignment","misaligned"],
  },
  {
    id: "ear_pain", icon: "👂", name: "Ear Pain / Infection", category: "moderate",
    brief: "Pulling at ear, ear discharge, pain, hearing difficulty",
    description: "Ear infections (otitis media) are among the most common pediatric conditions, especially in children under 5. Often follows a cold or upper respiratory infection.",
    homeCare: ["Warm cloth compress on the ear provides pain relief", "Keep child's head slightly elevated (extra pillow)", "Do not insert anything into the ear canal", "Complete prescribed antibiotic course fully", "Avoid swimming during ear infection"],
    whenToVisit: ["Severe ear pain or crying inconsolably", "Fluid or discharge from the ear canal", "Hearing appears reduced after an infection", "Fever with ear pain", "Recurrent ear infections (3+ per year)"],
    eyeNote: null, tags: ["ear","ear pain","ear infection","otitis","discharge","hearing"],
  },
  {
    id: "stomach", icon: "🤢", name: "Stomach Pain / Cramps", category: "moderate",
    brief: "Abdominal pain, cramps, bloating or discomfort",
    description: "Stomach pain is very common in children and can range from simple gas to appendicitis. Location, severity, and associated symptoms help determine the cause.",
    homeCare: ["Warm compress on the abdomen for cramps and gas pain", "Light diet — avoid fried, spicy foods", "Peppermint tea or warm water with jeera (cumin) for gas", "Ensure regular bowel habits and fiber in diet", "Probiotics (Lactobacillus) can help with recurrent stomach pain"],
    whenToVisit: ["Severe pain or pain lasting more than 6 hours", "Pain concentrated in lower right abdomen (appendix area)", "Vomiting with severe abdominal pain", "Blood in stool", "Child cannot stand straight due to pain"],
    eyeNote: null, tags: ["stomach","abdomen","cramps","pain","tummy","gastric","belly"],
  },
  {
    id: "headache", icon: "🤕", name: "Headache", category: "mild",
    brief: "Head pain, throbbing, pressure or heaviness",
    description: "Headaches in children can be caused by dehydration, stress, eye strain (refractive errors), sinusitis, or rarely by more serious conditions requiring investigation.",
    homeCare: ["Ensure adequate hydration — most childhood headaches improve with water", "Rest in a quiet, dimly lit room", "Cold or warm compress on forehead", "Check if child needs spectacles (eye-strain headaches very common)", "Regular meals — low blood sugar causes headaches"],
    whenToVisit: ["Sudden severe headache ('thunderclap') — worst headache ever", "Headache with fever, stiff neck, rash (meningitis warning)", "Headache waking child from sleep", "Progressive headaches worsening over days/weeks", "Headache with vision changes, vomiting, or personality changes"],
    eyeNote: "Frequent headaches in children are often caused by uncorrected refractive errors (need for glasses). Visit Dr. Vibha Shah for an eye examination before assuming other causes.",
    tags: ["headache","head pain","migraine","head"],
  },
  {
    id: "breathing", icon: "😮‍💨", name: "Breathing Difficulty", category: "severe",
    brief: "Fast breathing, wheezing, chest recession",
    description: "Breathing difficulty (respiratory distress) in children is a medical emergency. Causes include asthma, bronchiolitis, pneumonia, croup, or anaphylaxis.",
    homeCare: ["Sit child upright or slightly forward — do not lay flat", "Keep child calm (anxiety worsens breathing difficulty)", "Use prescribed inhaler (Salbutamol) if child has asthma", "Ensure no tight clothing around chest or neck", "Do NOT give water or food if breathing is very labored"],
    whenToVisit: ["ANY breathing difficulty — visit clinic IMMEDIATELY or call 108", "Nostrils flaring or ribs visible with each breath", "Child turning blue (cyanosis) around lips or fingertips", "Breathing rate >60/min in infants, >40/min in children", "Child cannot speak full sentences due to breathlessness"],
    eyeNote: null, tags: ["breathing","wheeze","asthma","respiratory","croup","breathless","oxygen"],
  },
  {
    id: "growth", icon: "📏", name: "Growth Concerns", category: "mild",
    brief: "Child appears underweight, short stature or failing to thrive",
    description: "Growth faltering or 'failure to thrive' is when a child isn't gaining weight and height as expected. Early intervention is crucial for long-term developmental outcomes.",
    homeCare: ["Track height and weight monthly using WHO growth charts", "Ensure calorie-dense nutritious foods: dal, ghee, eggs, banana", "Regular mealtimes with no distractions (phones/TV during meals)", "Identify and address picky eating with gentle consistency", "Multivitamin/zinc supplementation if prescribed"],
    whenToVisit: ["Weight below 3rd percentile on growth chart", "Child not gaining weight for 2+ months", "Sudden weight loss", "Short height with no family history of short stature", "Developmental delay alongside growth concerns"],
    eyeNote: null, tags: ["growth","weight","height","short","stunted","underweight","failure to thrive"],
  },
  {
    id: "vaccination_reaction", icon: "💉", name: "Vaccine Reaction", category: "mild",
    brief: "Redness, swelling, fever after vaccination",
    description: "Mild vaccine reactions are normal and expected — they indicate the immune system is responding. Most resolve within 1–3 days without treatment.",
    homeCare: ["Paracetamol for fever and pain (see Dose Guide)", "Cold compress on injection site for swelling", "Do not massage the injection site", "Ensure child drinks plenty of fluids", "Comfort and breastfeed infants — it helps reduce pain"],
    whenToVisit: ["High-pitched crying lasting more than 3 hours", "Very high fever (above 104°F) not responding to Paracetamol", "Severe swelling beyond the injection site", "Hives, rash or allergic reaction after vaccination", "Child becomes very unwell or has a seizure after vaccination"],
    eyeNote: null, tags: ["vaccine","vaccination","injection","immunization","reaction","side effect"],
  },
  {
    id: "dental", icon: "🦷", name: "Teething / Dental Pain", category: "mild",
    brief: "Drooling, irritability, sore gums in infants",
    description: "Teething typically begins at 4–7 months and continues through age 3. While uncomfortable, teething alone does NOT cause high fever, diarrhea, or severe illness.",
    homeCare: ["Chilled (not frozen) teething ring or clean cloth to chew", "Gentle gum massage with clean finger", "Paracetamol for pain relief if significant discomfort", "Avoid teething gels containing benzocaine", "First dental visit recommended at 1 year or first tooth"],
    whenToVisit: ["High fever during teething (investigate other cause)", "Severe difficulty eating or drinking", "No teeth by 15–18 months", "Tooth pain in older children (cavity suspected)", "Dental trauma / broken or knocked-out tooth"],
    eyeNote: null, tags: ["teething","dental","tooth","teeth","gum","drool","mouth"],
  },
  {
    id: "eye_vision", icon: "🥽", name: "Vision / Glasses Needed", category: "eye",
    brief: "Squinting, sitting close to TV, rubbing eyes while reading",
    description: "Refractive errors (myopia, hyperopia, astigmatism) are very common in children. Early detection and glasses prescription prevents amblyopia (lazy eye) and academic difficulties.",
    homeCare: ["Limit screen time: 1 hr/day for 2–5 yrs, 2 hrs/day for older children", "Ensure adequate outdoor time — natural light reduces myopia progression", "Proper lighting while reading — no reading in dim light", "Hold books/devices at arm's length (45–50 cm)", "20-20-20 rule: every 20 min, look 20 feet away for 20 seconds"],
    whenToVisit: ["Child squints or closes one eye to see clearly", "Sitting very close to TV or holding phone very near eyes", "Complaints of blurry vision or headaches after reading", "Poor academic performance possibly related to vision", "Recommended annual eye check for all children from age 3"],
    eyeNote: "Dr. Vibha Shah (MS Eye Surgeon) specializes in children's vision testing and glasses prescription. Early correction of refractive errors is essential for normal visual development.",
    tags: ["vision","glasses","spectacles","myopia","short sighted","blur","squinting","tv close"],
  },
  {
    id: "neonatal", icon: "👼", name: "Newborn Concerns", category: "severe",
    brief: "Jaundice, feeding problems, weight loss in newborns",
    description: "Newborn concerns require prompt attention. Neonatal jaundice, feeding difficulties, and poor weight gain are common but need medical evaluation.",
    homeCare: ["Feed newborn every 2–3 hours (8–12 times in 24 hours)", "Expose baby to indirect morning sunlight for mild jaundice (under doctor guidance)", "Keep navel stump clean and dry", "Track daily wet nappies (minimum 6 per day = adequate feeding)", "Room-in with baby for easy breastfeeding"],
    whenToVisit: ["Jaundice appearing before 24 hours or persisting after 2 weeks", "Baby not regaining birth weight by 2 weeks", "Less than 6 wet diapers in 24 hours", "Temperature above 100.4°F or below 96.8°F in newborn", "Baby is very sleepy and difficult to wake for feeds"],
    eyeNote: "Newborn eye examination is recommended to detect congenital eye conditions. Dr. Vibha Shah performs neonatal eye screenings.",
    tags: ["newborn","jaundice","infant","neonatal","baby","yellow","feeding"],
  },
  {
    id: "allergy", icon: "🤧", name: "Allergy Symptoms", category: "moderate",
    brief: "Sneezing, itchy eyes, hives, food allergy reactions",
    description: "Allergies in children include food allergies, environmental allergies (dust, pollen), and skin allergies. Identifying triggers is key to management.",
    homeCare: ["Keep a food diary to identify food allergy triggers", "Use hypoallergenic bedding and covers for dust mite allergy", "Keep windows closed during high pollen season", "Antihistamine (as prescribed) for mild allergic reactions", "Avoid known allergens strictly"],
    whenToVisit: ["Anaphylaxis: throat swelling, difficulty breathing, collapse — CALL 108", "Hives spreading rapidly after food/medication", "Persistent allergic symptoms affecting sleep or school", "Suspected food allergy for testing", "Asthma triggered by allergies"],
    eyeNote: "Allergic conjunctivitis (itchy, watery eyes with sneezing) needs evaluation by Dr. Vibha Shah — eye drops different from other conjunctivitis.",
    tags: ["allergy","allergic","sneeze","itchy","hives","food allergy","eczema","atopic"],
  },
  {
    id: "constipation", icon: "😣", name: "Constipation", category: "mild",
    brief: "Infrequent hard stools, painful defecation",
    description: "Constipation is common in children, especially during toilet training, dietary changes, or after illness. Normal frequency varies — some children go 3 times/day, others every 3 days.",
    homeCare: ["Increase fiber: fruits (papaya, guava, prune), vegetables, whole grains", "Ensure adequate fluid intake throughout the day", "Regular toilet sitting time after meals (5–10 min)", "Physical activity helps bowel movement", "Glycerin suppository or lactulose (as prescribed by Dr. Mrunal Shah)"],
    whenToVisit: ["No bowel movement for more than 1 week", "Blood in stool or severe pain while passing stools", "Abdominal swelling with constipation", "Soiling of underwear (overflow incontinence)", "Constipation from birth (may indicate Hirschsprung disease)"],
    eyeNote: null, tags: ["constipation","hard stool","no poop","straining","bowel","difficult"],
  },
  {
    id: "sleep", icon: "😴", name: "Sleep Problems", category: "mild",
    brief: "Difficulty sleeping, night waking, snoring",
    description: "Sleep problems are very common in children. Adequate sleep is essential for growth, immunity, and brain development. Sleep requirements vary by age.",
    homeCare: ["Consistent bedtime routine: bath, story, dim lights, same time nightly", "No screens at least 1 hour before bed (blue light disrupts sleep)", "Ensure bedroom is cool, dark, and quiet", "Avoid caffeine-containing foods (chocolate, cola) in evenings", "White noise machine can help light sleepers"],
    whenToVisit: ["Loud snoring with pauses in breathing (sleep apnea)", "Child gasping or choking during sleep", "Severe nightmares or night terrors affecting day functioning", "Excessive daytime sleepiness despite adequate night sleep", "Behavioural changes, hyperactivity, or poor focus linked to poor sleep"],
    eyeNote: null, tags: ["sleep","insomnia","snoring","night waking","nightmares","bedtime"],
  },
];

let currentSympFilter = 'all';
let currentSearchTerm = '';

function renderSympGrid() {
  const grid = document.getElementById('symp-grid');
  if (!grid) return;
  grid.innerHTML = '';
  let visible = 0;
  SYMPTOMS_DATA.forEach(s => {
    const matchFilter = currentSympFilter === 'all' || s.category === currentSympFilter || (currentSympFilter === 'eye' && s.category === 'eye');
    const matchSearch = currentSearchTerm === '' || s.name.toLowerCase().includes(currentSearchTerm) || s.brief.toLowerCase().includes(currentSearchTerm) || (s.tags && s.tags.some(t => t.includes(currentSearchTerm)));
    const card = document.createElement('div');
    card.className = 'symp-card reveal' + (!matchFilter || !matchSearch ? ' hidden' : '');
    card.innerHTML = `
      <div class="symp-severity sev-${s.category}"></div>
      <span class="symp-card-icon">${s.icon}</span>
      <div class="symp-card-name">${s.name}</div>
      <div class="symp-card-brief">${s.brief}</div>
      <div class="symp-card-hint">👆 Tap for full guide →</div>
    `;
    card.addEventListener('click', () => openSympModal(s));
    grid.appendChild(card);
    if (matchFilter && matchSearch) visible++;
  });
  if (visible === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-light);">😕 No symptoms found for "${currentSearchTerm}". Try a different search term.</div>`;
  }
}

function filterSymptoms() {
  const searchEl = document.getElementById('symp-search');
  currentSearchTerm = searchEl ? searchEl.value.toLowerCase().trim() : '';
  const clearBtn = document.getElementById('symp-clear');
  if (clearBtn) clearBtn.style.display = currentSearchTerm ? 'flex' : 'none';
  renderSympGrid();
}

function clearSympSearch() {
  const searchEl = document.getElementById('symp-search');
  if (searchEl) { searchEl.value = ''; searchEl.focus(); }
  currentSearchTerm = '';
  document.getElementById('symp-clear').style.display = 'none';
  renderSympGrid();
}

function setSympFilter(filter, btn) {
  currentSympFilter = filter;
  document.querySelectorAll('.symp-filter').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderSympGrid();
}

function openSympModal(s) {
  const modal = document.getElementById('symp-modal');
  const content = document.getElementById('symp-modal-content');
  const sevColors = { mild: '#22C55E', moderate: '#F59E0B', severe: '#EF4444', eye: '#2B9FD1' };
  const sevLabels = { mild: '🟢 Mild — Usually manageable at home', moderate: '🟡 Moderate — Monitor closely, visit if worsening', severe: '🔴 Urgent — Visit clinic / call 108 if sudden', eye: '👁️ Eye Condition — Dr. Vibha Shah recommended' };
  content.innerHTML = `
    <div class="smd-header">
      <span class="smd-icon">${s.icon}</span>
      <div class="smd-name">${s.name}</div>
      <span class="smd-severity-badge" style="background:${sevColors[s.category]}22;color:${sevColors[s.category]};border:1.5px solid ${sevColors[s.category]}44;">${sevLabels[s.category]}</span>
      <p style="margin-top:0.75rem;font-size:0.9rem;color:var(--text-med);line-height:1.65;">${s.description}</p>
    </div>
    <div class="smd-body">
      <div class="smd-section">
        <h5>🏠 Home Care Tips</h5>
        <ul class="smd-list">${s.homeCare.map(c => `<li><span>✓</span><span>${c}</span></li>`).join('')}</ul>
      </div>
      <div class="smd-section">
        <div class="smd-when-card">
          <div class="smd-when-title">🏥 When to Visit Kid's Care Clinic</div>
          <ul class="smd-list">${s.whenToVisit.map(w => `<li><span>⚠</span><span>${w}</span></li>`).join('')}</ul>
        </div>
      </div>
      ${s.eyeNote ? `<div class="smd-section"><div class="smd-eye-card"><strong>👁️ Eye Doctor Note:</strong><p style="font-size:0.85rem;margin-top:0.35rem;color:var(--primary-dark)">${s.eyeNote}</p></div></div>` : ''}
      <button class="smd-book-btn" onclick="closeSympModal();document.getElementById('appointment').scrollIntoView({behavior:'smooth'});">📅 Book Appointment with Dr. ${s.category === 'eye' ? 'Vibha Shah (Eye Surgeon)' : 'Mrunal Shah (Pediatrician)'}</button>
    </div>`;
  modal.classList.add('on');
  document.body.style.overflow = 'hidden';
}

function closeSympModal() {
  document.getElementById('symp-modal').classList.remove('on');
  document.body.style.overflow = '';
}

// Close modal on backdrop click or Escape
document.getElementById('symp-modal')?.addEventListener('click', e => { if (e.target === document.getElementById('symp-modal')) closeSympModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSympModal(); });

// Initialize symptom grid
renderSympGrid();


/* ═══════════════════════════════════════════════════════════════
   📏 BMI CALCULATOR
   ═══════════════════════════════════════════════════════════════ */

// WHO Child BMI-for-age percentile thresholds (simplified)
// Using standard international cutoffs for children
const BMI_CUTOFFS = {
  // [underweight, normal_high, overweight_high] — below=underweight, above last=obese
  2:  [14.7, 18.3, 19.8],
  3:  [14.4, 17.8, 19.3],
  4:  [14.2, 17.6, 19.1],
  5:  [14.1, 17.5, 19.2],
  6:  [14.1, 17.6, 19.6],
  7:  [14.2, 17.9, 20.1],
  8:  [14.4, 18.4, 20.8],
  9:  [14.7, 19.1, 21.6],
  10: [15.0, 19.8, 22.5],
  11: [15.4, 20.5, 23.3],
  12: [15.8, 21.2, 24.1],
  13: [16.2, 21.9, 24.8],
  14: [16.6, 22.5, 25.4],
  15: [17.0, 23.0, 25.9],
  16: [17.3, 23.4, 26.3],
  17: [17.6, 23.8, 26.7],
  18: [17.8, 24.1, 26.9],
};

function calcBMI() {
  const age = parseInt(document.getElementById('bmi-age').value);
  const height = parseFloat(document.getElementById('bmi-height').value);
  const weight = parseFloat(document.getElementById('bmi-weight').value);

  if (!age || !height || !weight || age < 2 || age > 18 || height < 50 || weight < 2) return;

  const bmi = weight / ((height / 100) ** 2);
  const cutoff = BMI_CUTOFFS[Math.min(Math.max(age, 2), 18)];
  const resultEl = document.getElementById('bmi-result');
  const bmiValEl = document.getElementById('bmi-value');
  const bmiCatEl = document.getElementById('bmi-category');
  const bmiAdvEl = document.getElementById('bmi-advice');
  const bmiBox = document.getElementById('bmi-result-box');
  const needle = document.getElementById('bmi-gauge-needle');

  resultEl.style.display = 'block';
  bmiValEl.textContent = bmi.toFixed(1);

  let category, advice, pct, boxClass;
  if (bmi < cutoff[0]) {
    category = 'Underweight'; pct = 5;
    advice = 'Your child\'s BMI is below the recommended range. Consider consulting Dr. Mrunal Shah for a nutrition plan and to rule out underlying causes.';
    boxClass = 'bmi-underweight';
  } else if (bmi <= cutoff[1]) {
    category = '✅ Healthy Weight'; pct = 42;
    advice = 'Great! Your child is in the healthy weight range. Continue with a balanced diet, regular activity, and annual growth monitoring.';
    boxClass = 'bmi-normal';
  } else if (bmi <= cutoff[2]) {
    category = 'Overweight'; pct = 72;
    advice = 'Your child is slightly above the healthy weight range. Dr. Mrunal Shah can provide dietary guidance and an activity plan to help.';
    boxClass = 'bmi-overweight';
  } else {
    category = '⚠️ Obese'; pct = 92;
    advice = 'Your child\'s BMI indicates obesity. Please visit Dr. Mrunal Shah for a comprehensive evaluation, dietary plan, and monitoring.';
    boxClass = 'bmi-obese';
  }

  bmiCatEl.textContent = category;
  bmiAdvEl.textContent = advice;
  bmiBox.className = 'bmi-result-box ' + boxClass;
  bmiValEl.className = 'bmi-num';
  if (needle) needle.style.left = pct + '%';
}


/* ═══════════════════════════════════════════════════════════════
   💊 DOSE CALCULATOR
   ═══════════════════════════════════════════════════════════════ */

function calcDose() {
  const weight = parseFloat(document.getElementById('dose-weight').value);
  const med = document.getElementById('dose-med').value;
  if (!weight || weight < 2 || weight > 60) return;

  const resultEl = document.getElementById('dose-result');
  const rowsEl = document.getElementById('dose-rows');
  const ruleEl = document.getElementById('dose-rule-text');
  resultEl.style.display = 'block';

  if (med === 'para') {
    const minMg = Math.round(10 * weight);
    const maxMg = Math.round(15 * weight);
    const minMl = (minMg / 120 * 5).toFixed(1); // 120mg/5ml suspension
    const maxMl = (maxMg / 120 * 5).toFixed(1);
    const tabletMg = maxMg < 250 ? null : maxMg < 500 ? '250mg tablet' : '500mg tablet';
    rowsEl.innerHTML = `
      <div class="dose-row" style="border-color:var(--primary-mid);"><div class="dose-row-label">💊 Dose Range</div><div class="dose-row-val">${minMg}–${maxMg} mg</div><div class="dose-row-sub">10–15 mg/kg body weight per dose</div></div>
      <div class="dose-row"><div class="dose-row-label">🧴 Syrup (120mg/5ml — Crocin / Calpol)</div><div class="dose-row-val">${minMl}–${maxMl} ml</div><div class="dose-row-sub">Per dose, every 4–6 hours, max 4 times/day</div></div>
      ${tabletMg ? `<div class="dose-row"><div class="dose-row-label">💊 Tablet Option</div><div class="dose-row-val">${tabletMg}</div><div class="dose-row-sub">Only if child can swallow tablets safely</div></div>` : ''}
      <div class="dose-row" style="border-color:#FECACA;"><div class="dose-row-label">⏱️ Max Doses Per Day</div><div class="dose-row-val" style="color:#DC2626;">4 doses</div><div class="dose-row-sub">Minimum 4 hours between doses. Max 5 days without doctor advice.</div></div>
    `;
    ruleEl.innerHTML = `<strong>When to give Paracetamol:</strong> Fever ≥ 38°C (100.4°F), teething pain, post-vaccination fever, minor aches. Do NOT give in children under 3 months without doctor advice. Never exceed 4 doses in 24 hours.`;
  } else {
    const minMg = Math.round(5 * weight);
    const maxMg = Math.round(10 * weight);
    const minMl = (minMg / 100 * 5).toFixed(1); // 100mg/5ml suspension
    const maxMl = (maxMg / 100 * 5).toFixed(1);
    rowsEl.innerHTML = `
      <div class="dose-row" style="border-color:var(--secondary-mid);"><div class="dose-row-label">💊 Dose Range</div><div class="dose-row-val">${minMg}–${maxMg} mg</div><div class="dose-row-sub">5–10 mg/kg body weight per dose</div></div>
      <div class="dose-row"><div class="dose-row-label">🧴 Syrup (100mg/5ml — Brufen)</div><div class="dose-row-val">${minMl}–${maxMl} ml</div><div class="dose-row-sub">Per dose, every 6–8 hours, max 3 times/day</div></div>
      <div class="dose-row" style="border-color:#FECACA;"><div class="dose-row-label">⏱️ Max Doses Per Day</div><div class="dose-row-val" style="color:#DC2626;">3 doses</div><div class="dose-row-sub">Give with food to prevent stomach upset. Max 5 days.</div></div>
    `;
    ruleEl.innerHTML = `<strong>When to give Ibuprofen:</strong> Fever ≥ 38.5°C unresponsive to Paracetamol, pain and inflammation. NOT for infants under 6 months. Give with food or milk to reduce stomach irritation. Avoid in dehydration.`;
  }
}


/* ═══════════════════════════════════════════════════════════════
   🚨 EMERGENCY ACCORDION
   ═══════════════════════════════════════════════════════════════ */

function toggleEmerg(card) {
  const isOpen = card.classList.contains('open');
  document.querySelectorAll('.emerg-card').forEach(c => c.classList.remove('open'));
  if (!isOpen) card.classList.add('open');
}

