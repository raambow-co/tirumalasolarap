/**
 * TIRUMALA SOLAR SYSTEMS - INTERACTIVE SCRIPT
 * Focused Exclusively on Andhra Pradesh
 * Solar Calculator, Project Carousel with Lightbox, Testimonial Slider,
 * FAQ Accordion, Enquiry Form Validation & WhatsApp Integration
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. STICKY NAVBAR & MOBILE MENU & SCROLLSPY
  // =========================================================================
  const siteHeader = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.querySelector('.floating-top-btn');

  // Sticky header blur effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle & drawer controller
  function closeMobileMenu() {
    navMenu?.classList.remove('active');
    document.body.classList.remove('menu-open');
    if (mobileToggle) {
      mobileToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`;
    }
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = navMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open', isExpanded);
      mobileToggle.innerHTML = isExpanded 
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`;
    });

    navLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close when tapping outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  // Smooth back to top
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // =========================================================================
  // 2. INTERACTIVE SOLAR SAVINGS CALCULATOR (Andhra Pradesh Tariffs)
  // =========================================================================
  const tabModeBill = document.getElementById('calcTabBill');
  const tabModeCapacity = document.getElementById('calcTabCapacity');
  const groupCalcBill = document.getElementById('groupCalcBill');
  const groupCalcCapacity = document.getElementById('groupCalcCapacity');

  const billSlider = document.getElementById('calcBill');
  const capacitySlider = document.getElementById('calcCapacity');
  const locationSelect = document.getElementById('calcLocation');

  const billValDisplay = document.getElementById('calcBillVal');
  const capacityValDisplay = document.getElementById('calcCapacityVal');
  const autoRoofVal = document.getElementById('autoRoofVal');
  const autoUnitsVal = document.getElementById('autoUnitsVal');

  const resRequiredRoof = document.getElementById('resRequiredRoof');
  const resSystemSize = document.getElementById('resSystemSize');
  const resAnnualSavings = document.getElementById('resAnnualSavings');
  const resGovtSubsidy = document.getElementById('resGovtSubsidy');
  const resNetCost = document.getElementById('resNetCost');
  const resOrigCost = document.getElementById('resOrigCost');
  const resPayback = document.getElementById('resPayback');
  const applySubsidyBtn = document.getElementById('btnApplySubsidy');

  let activeCalcMode = 'bill'; // 'bill' | 'capacity'

  function calculateSolarSavings() {
    if (!billSlider || !capacitySlider) return;

    let finalKW = 3.5;
    let monthlyBill = 3500;

    if (activeCalcMode === 'bill') {
      monthlyBill = parseInt(billSlider.value, 10);
      if (billValDisplay) billValDisplay.textContent = `₹${monthlyBill.toLocaleString('en-IN')}`;

      // AP domestic tariff: ~₹7.8/unit. 1 kW generates ~125 units/month (~₹975-₹1000 bill offset)
      let calcKW = (monthlyBill / 1000);
      calcKW = Math.round(calcKW * 2) / 2;
      finalKW = Math.max(1, Math.min(15, calcKW));

      // Keep capacity slider in sync
      capacitySlider.value = finalKW;
      if (capacityValDisplay) capacityValDisplay.textContent = `${finalKW.toFixed(1)} kW`;
    } else {
      finalKW = parseFloat(capacitySlider.value);
      if (capacityValDisplay) capacityValDisplay.textContent = `${finalKW.toFixed(1)} kW`;

      // Approximate bill offset for this capacity
      monthlyBill = Math.round(finalKW * 1000);
      billSlider.value = Math.min(30000, Math.max(1000, monthlyBill));
      if (billValDisplay) billValDisplay.textContent = `₹${monthlyBill.toLocaleString('en-IN')}`;
    }

    // Required Shadow-free Roof Space: ~80 sq.ft per kW in India (panels + clearance)
    const reqRoofArea = Math.round(finalKW * 80);
    const monthlyUnits = Math.round(finalKW * 125);

    // Update dynamic auto-summary badges
    if (autoRoofVal) autoRoofVal.textContent = `~${reqRoofArea.toLocaleString('en-IN')} Sq. Ft.`;
    if (autoUnitsVal) autoUnitsVal.textContent = `~${monthlyUnits.toLocaleString('en-IN')} Units`;

    // PM Surya Ghar Yojana Subsidy:
    // 1 kW: ₹30,000 | 2 kW: ₹60,000 | 3 kW+: ₹78,000 (residential cap)
    let subsidy = 0;
    if (finalKW >= 3) {
      subsidy = 78000;
    } else if (finalKW >= 2) {
      subsidy = 60000;
    } else if (finalKW >= 1) {
      subsidy = 30000;
    } else {
      subsidy = Math.round(finalKW * 30000);
    }

    // Benchmark turnkey AP pricing:
    const grossCost = finalKW <= 3 
      ? Math.round(finalKW * 65000) 
      : Math.round(3 * 65000 + (finalKW - 3) * 55000);

    const netCost = Math.max(0, grossCost - subsidy);
    const annualUnits = finalKW * 125 * 12;
    const annualSavings = Math.round(annualUnits * 7.8);
    const paybackYears = (netCost / annualSavings).toFixed(1);

    // Update Results Card
    if (resSystemSize) resSystemSize.innerHTML = `${finalKW.toFixed(1)} <span>kW</span>`;
    if (resRequiredRoof) resRequiredRoof.textContent = reqRoofArea.toLocaleString('en-IN');
    if (resAnnualSavings) resAnnualSavings.textContent = `₹${annualSavings.toLocaleString('en-IN')}`;
    if (resGovtSubsidy) resGovtSubsidy.textContent = `₹${subsidy.toLocaleString('en-IN')}`;
    if (resNetCost) resNetCost.textContent = `₹${netCost.toLocaleString('en-IN')}`;
    if (resOrigCost) resOrigCost.textContent = `₹${grossCost.toLocaleString('en-IN')}`;
    if (resPayback) resPayback.textContent = `${paybackYears} Years`;
  }

  // Mode Toggle Handlers
  tabModeBill?.addEventListener('click', () => {
    activeCalcMode = 'bill';
    tabModeBill.classList.add('active');
    tabModeBill.setAttribute('aria-selected', 'true');
    tabModeCapacity?.classList.remove('active');
    tabModeCapacity?.setAttribute('aria-selected', 'false');

    if (groupCalcBill) groupCalcBill.style.display = 'block';
    if (groupCalcCapacity) groupCalcCapacity.style.display = 'none';
    calculateSolarSavings();
  });

  tabModeCapacity?.addEventListener('click', () => {
    activeCalcMode = 'capacity';
    tabModeCapacity.classList.add('active');
    tabModeCapacity.setAttribute('aria-selected', 'true');
    tabModeBill?.classList.remove('active');
    tabModeBill?.setAttribute('aria-selected', 'false');

    if (groupCalcCapacity) groupCalcCapacity.style.display = 'block';
    if (groupCalcBill) groupCalcBill.style.display = 'none';
    calculateSolarSavings();
  });

  billSlider?.addEventListener('input', calculateSolarSavings);
  capacitySlider?.addEventListener('input', calculateSolarSavings);
  locationSelect?.addEventListener('change', calculateSolarSavings);

  calculateSolarSavings();

  applySubsidyBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const systemSize = resSystemSize?.textContent.replace('kW', '').trim() || '3.5';
    const reqRoof = resRequiredRoof?.textContent || '280';
    const billVal = billSlider ? billSlider.value : '3500';
    const selectedLoc = locationSelect ? locationSelect.value : 'Vijayawada';

    const enquiryLocation = document.getElementById('enquiryCity');
    const enquiryBill = document.getElementById('enquiryBill');
    const enquiryCapacity = document.getElementById('enquiryCapacity');

    if (enquiryLocation) enquiryLocation.value = selectedLoc;
    if (enquiryBill) enquiryBill.value = `₹${parseInt(billVal, 10).toLocaleString('en-IN')} / month`;
    if (enquiryCapacity) enquiryCapacity.value = `${systemSize} kW On-Grid (Req. ~${reqRoof} Sq. Ft.)`;

    const enquirySection = document.getElementById('enquiry');
    if (enquirySection) {
      enquirySection.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('enquiryName')?.focus();
    }
  });


  // =========================================================================
  // 3. OUR PROJECTS CAROUSEL (Real Installation Projects in Andhra Pradesh)
  // =========================================================================
  const projectsData = [
    {
      id: 1,
      img: 'images/project-1.jpg',
      category: 'elevated',
      title: '3 kW Elevated Rooftop Solar Plant',
      location: 'Benz Circle, Vijayawada',
      capacity: '3 kW On-Grid',
      savings: '₹34,000 / year',
      desc: 'High-clearance elevated hot-dip galvanized structure installed on concrete terrace with shadow-free efficiency.'
    },
    {
      id: 3,
      img: 'images/project-3.jpg',
      category: 'residential',
      title: '4-Panel Monocrystalline Rooftop System',
      location: 'MVP Colony, Visakhapatnam',
      capacity: '2.5 kW On-Grid',
      savings: '₹28,500 / year',
      desc: 'Neat residential rooftop solar array with lightning arrestor, surge protection, and safety earthing.'
    },
    {
      id: 4,
      img: 'images/project-4.jpg',
      category: 'residential',
      title: 'High-Tilt Tier-1 Solar Array',
      location: 'Chandragiri Road, Tirupati',
      capacity: '3.3 kW On-Grid',
      savings: '₹38,000 / year',
      desc: 'Engineered tilt angle for maximum irradiance capture throughout seasonal coastal solar trajectories.'
    },
    {
      id: 5,
      img: 'images/project-5.jpg',
      category: 'residential',
      title: 'Residential Villa Rooftop Array',
      location: 'Brodipet, Guntur',
      capacity: '4 kW Hybrid',
      savings: '₹46,000 / year',
      desc: 'Installed on high-grade concrete terrace with dedicated inverter and dual AC/DC distribution box.'
    },
    {
      id: 6,
      img: 'images/project-6.jpg',
      category: 'elevated',
      title: 'Superstructure Solar Pergola',
      location: 'Thenepalle, Andhra Pradesh',
      capacity: '5 kW On-Grid',
      savings: '₹58,000 / year',
      desc: 'Raised 9-foot elevated frame allowing full recreational terrace utilization beneath solar modules.',
      objectPosition: 'center 20%'
    },
    {
      id: 7,
      img: 'images/project-7.jpg',
      category: 'residential',
      title: 'Polavaram Rooftop Solar System',
      location: 'Polavaram, Andhra Pradesh',
      capacity: '3 kW On-Grid',
      savings: '₹36,000 / year',
      desc: 'Tier-1 monocrystalline panels installed on residential terrace in Polavaram, Andhra Pradesh under PM Surya Ghar Yojana.',
      objectPosition: 'center 15%'
    },
    {
      id: 8,
      img: 'images/project-8.jpg',
      category: 'commercial',
      title: 'Slanted Industrial Tin-Shed Array',
      location: 'Autonagar, Vijayawada',
      capacity: '10 kW Commercial',
      savings: '₹1,20,000 / year',
      desc: 'Leak-proof non-penetrative mounting on industrial color-coated metal roof sheets.'
    },
    {
      id: 9,
      img: 'images/project-9.jpg',
      category: 'elevated',
      title: 'Rooftop Elevated Canopy Solar',
      location: 'Gajuwaka, Visakhapatnam',
      capacity: '6 kW Hybrid',
      savings: '₹70,000 / year',
      desc: 'Coastal anti-corrosive anodized aluminum clamps with hot-dip galvanized mounting pillars.'
    },
    {
      id: 10,
      img: 'images/project-10.jpg',
      category: 'residential',
      title: 'High-Efficiency Mono-PERC Panels',
      location: 'Kothapet, Guntur',
      capacity: '3 kW On-Grid',
      savings: '₹35,000 / year',
      desc: 'PM Surya Ghar subsidized residential installation delivering 14 units daily on average.'
    },
    {
      id: 11,
      img: 'images/project-11.jpg',
      category: 'residential',
      title: 'Multi-Row Terrace Solar System',
      location: 'Alipiri, Tirupati',
      capacity: '5 kW On-Grid',
      savings: '₹59,000 / year',
      desc: 'Optimized inter-row spacing ensuring zero shadow loss between solar string arrays.'
    },
    {
      id: 12,
      img: 'images/project-12.jpg',
      category: 'commercial',
      title: 'Commercial Complex Solar Array',
      location: 'Magunta Layout, Nellore',
      capacity: '8 kW On-Grid',
      savings: '₹94,000 / year',
      desc: 'Connected with APSPDCL smart net-meter for automatic billing credit adjustments.'
    },
    {
      id: 13,
      img: 'images/project-13.jpg',
      category: 'elevated',
      title: 'Elevated High-Clearance Structure',
      location: 'Nandyal Road, Kurnool',
      capacity: '4 kW On-Grid',
      savings: '₹47,000 / year',
      desc: 'Custom engineered for high wind load compliance and zero damage to existing roof waterproof membrane.'
    },
    {
      id: 14,
      img: 'images/project-14.jpg',
      category: 'residential',
      title: 'Bifacial Solar Module Setup',
      location: 'Bhanugudi Junction, Kakinada',
      capacity: '3.5 kW On-Grid',
      savings: '₹42,000 / year',
      desc: 'Dual-surface solar energy harvesting capturing both direct sunlight and terrace albedo reflectance.'
    },
    {
      id: 15,
      img: 'images/project-15.jpg',
      category: 'residential',
      title: 'Residential Starter Rooftop System',
      location: 'Subhash Road, Anantapur',
      capacity: '2 kW On-Grid',
      savings: '₹24,000 / year',
      desc: 'Compact residential setup with ₹60,000 government subsidy approval in 20 days.'
    },
    {
      id: 16,
      img: 'images/project-16.jpg',
      category: 'commercial',
      title: 'Hospital Rooftop Solar Array',
      location: 'Governorpet, Vijayawada',
      capacity: '12 kW Hybrid',
      savings: '₹1,45,000 / year',
      desc: 'Critical medical facility with 24/7 battery energy storage and automated grid synchronization.'
    },
    {
      id: 17,
      img: 'images/project-17.jpg',
      category: 'elevated',
      title: 'High-Altitude Aerial View System',
      location: 'Seethammadhara, Visakhapatnam',
      capacity: '5 kW On-Grid',
      savings: '₹60,000 / year',
      desc: 'Clean architectural alignment complementing the aesthetics of the residential property.'
    },
    {
      id: 18,
      img: 'images/project-18.jpg',
      category: 'residential',
      title: 'Complete Balance of System (BOS)',
      location: 'Andhra Pradesh Wide',
      capacity: 'Quality Engineering',
      savings: '25-Yr Performance',
      desc: 'Surge arrestors, IP65 junction boxes, fire-safe cables, and copper chemical earthing rods.'
    }
  ];

  const carouselTrack = document.getElementById('projectCarouselTrack');
  const carouselPrevBtn = document.getElementById('carouselPrev');
  const carouselNextBtn = document.getElementById('carouselNext');
  const carouselDotsWrap = document.getElementById('carouselDots');
  const tabButtons = document.querySelectorAll('.tab-btn');

  let filteredProjects = [...projectsData];
  let currentIndex = 0;
  let autoSlideTimer = null;

  function renderProjectCards() {
    if (!carouselTrack) return;
    carouselTrack.innerHTML = '';

    filteredProjects.forEach((proj) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.setAttribute('data-id', proj.id);
      const objPos = proj.objectPosition || 'center center';
      card.innerHTML = `
        <div class="project-thumb-wrap">
          <img src="${proj.img}" alt="${proj.title || 'Tirumala Solar Installation in Andhra Pradesh'}" class="project-thumb-img" style="object-position: ${objPos};" loading="lazy">
          <div class="project-zoom-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/></svg>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        openLightbox(proj);
      });

      carouselTrack.appendChild(card);
    });

    renderDots();
    updateCarouselPosition();
  }

  function getVisibleCount() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function renderDots() {
    if (!carouselDotsWrap) return;
    carouselDotsWrap.innerHTML = '';
    const visibleCount = getVisibleCount();
    const totalDots = Math.max(1, filteredProjects.length - visibleCount + 1);

    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('span');
      dot.className = `dot-indicator ${i === currentIndex ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarouselPosition();
        resetAutoSlide();
      });
      carouselDotsWrap.appendChild(dot);
    }
  }

  function updateCarouselPosition() {
    if (!carouselTrack) return;
    const cards = carouselTrack.querySelectorAll('.project-card');
    if (!cards.length) return;

    const visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, filteredProjects.length - visibleCount);

    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const cardWidth = cards[0].offsetWidth;
    const computedGap = parseFloat(window.getComputedStyle(carouselTrack).gap);
    const gap = !isNaN(computedGap) ? computedGap : 20;
    const moveAmount = currentIndex * (cardWidth + gap);

    carouselTrack.style.transform = `translateX(-${moveAmount}px)`;

    const dots = carouselDotsWrap?.querySelectorAll('.dot-indicator');
    dots?.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function nextSlide() {
    const visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, filteredProjects.length - visibleCount);
    if (currentIndex >= maxIndex) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }
    updateCarouselPosition();
  }

  function prevSlide() {
    const visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, filteredProjects.length - visibleCount);
    if (currentIndex <= 0) {
      currentIndex = maxIndex;
    } else {
      currentIndex--;
    }
    updateCarouselPosition();
  }

  carouselNextBtn?.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
  });

  carouselPrevBtn?.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
  });

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      if (filter === 'all') {
        filteredProjects = [...projectsData];
      } else {
        filteredProjects = projectsData.filter(p => p.category === filter);
      }
      currentIndex = 0;
      renderProjectCards();
      resetAutoSlide();
    });
  });

  function startAutoSlide() {
    autoSlideTimer = setInterval(nextSlide, 4500);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  window.addEventListener('resize', () => {
    renderDots();
    updateCarouselPosition();
  });

  let touchStartX = 0;
  let touchEndX = 0;
  carouselTrack?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carouselTrack?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      nextSlide();
      resetAutoSlide();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
      resetAutoSlide();
    }
  }, { passive: true });

  renderProjectCards();
  startAutoSlide();


  // =========================================================================
  // 4. LIGHTBOX MODAL FUNCTIONALITY
  // =========================================================================
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxLoc = document.getElementById('lightboxLoc');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxEnquireBtn = document.getElementById('lightboxEnquireBtn');

  let activeProject = null;

  function openLightbox(proj) {
    if (!lightboxModal) return;
    activeProject = proj;
    if (lightboxImg) {
      lightboxImg.src = proj.img;
      lightboxImg.alt = proj.title || 'Tirumala Solar Project Installation';
    }
    if (lightboxTitle) lightboxTitle.textContent = proj.title || '';
    if (lightboxLoc) lightboxLoc.textContent = `📍 ${proj.location || ''} • ${proj.capacity || ''}`;
    if (lightboxDesc) lightboxDesc.textContent = proj.desc || '';
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal?.classList.contains('active')) {
      closeLightbox();
    }
  });

  lightboxEnquireBtn?.addEventListener('click', () => {
    closeLightbox();
    if (activeProject) {
      const notesField = document.getElementById('enquiryNotes');
      if (notesField) {
        notesField.value = `Hi, I am interested in a solar project similar to: "${activeProject.title}" located in ${activeProject.location}.`;
      }
      document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' });
    }
  });


  // =========================================================================
  // 5. TESTIMONIAL SLIDER (Andhra Pradesh Clients)
  // =========================================================================
  const testimonials = [
    {
      stars: 5,
      quote: `"We installed a 5kW hybrid solar system for our clinic in Vijayawada. Coastal summer voltage drops were a constant concern, but with Tirumala Solar's battery configuration, our medical diagnostic gear runs seamlessly. Generation is excellent and our power bill is down by 85%."`,
      author: 'Dr. K. Radhakrishna',
      location: 'Benz Circle, Vijayawada',
      avatar: 'images/customer-1.jpg'
    },
    {
      stars: 5,
      quote: `"Got a 3kW on-grid solar plant installed on our home in Visakhapatnam under PM Surya Ghar Yojana. Tirumala Solar took care of all APEPDCL net-meter paperwork and the ₹78,000 subsidy was deposited directly into my SBI account within 25 days. Extremely satisfied!"`,
      author: 'Sri. Venkateswara Rao',
      location: 'MVP Colony, Visakhapatnam',
      avatar: 'images/customer-2.jpg'
    },
    {
      stars: 5,
      quote: `"We opted for an elevated 9-foot superstructure on our terrace in Tirupati. Not only does it yield 22+ units of clean electricity daily, but the elevated shelter shields our top floor from scorching heat and keeps our terrace usable. Top quality workmanship!"`,
      author: 'Smt. Lakshmi Prasanna',
      location: 'Chandragiri Road, Tirupati',
      avatar: 'images/customer-1.jpg'
    }
  ];

  let testIndex = 0;
  const testQuoteText = document.getElementById('testQuoteText');
  const testAvatar = document.getElementById('testAvatar');
  const testName = document.getElementById('testName');
  const testLocation = document.getElementById('testLocation');
  const testPrevBtn = document.getElementById('testPrev');
  const testNextBtn = document.getElementById('testNext');
  const testDotsWrap = document.getElementById('testDotsWrap');

  function renderTestimonial() {
    if (!testQuoteText) return;
    const t = testimonials[testIndex];
    testQuoteText.textContent = t.quote;
    testAvatar.src = t.avatar;
    testAvatar.alt = t.author;
    testName.textContent = t.author;
    testLocation.textContent = t.location;

    const dots = testDotsWrap?.querySelectorAll('.dot-indicator');
    dots?.forEach((d, idx) => {
      d.classList.toggle('active', idx === testIndex);
    });
  }

  function renderTestDots() {
    if (!testDotsWrap) return;
    testDotsWrap.innerHTML = '';
    testimonials.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = `dot-indicator ${idx === testIndex ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        testIndex = idx;
        renderTestimonial();
      });
      testDotsWrap.appendChild(dot);
    });
  }

  testNextBtn?.addEventListener('click', () => {
    testIndex = (testIndex + 1) % testimonials.length;
    renderTestimonial();
  });

  testPrevBtn?.addEventListener('click', () => {
    testIndex = (testIndex - 1 + testimonials.length) % testimonials.length;
    renderTestimonial();
  });

  renderTestDots();
  renderTestimonial();

  // Testimonials touch swipe for mobile
  const testCard = document.querySelector('.testimonial-card');
  let testTouchStartX = 0;
  let testTouchEndX = 0;
  testCard?.addEventListener('touchstart', (e) => {
    testTouchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  testCard?.addEventListener('touchend', (e) => {
    testTouchEndX = e.changedTouches[0].screenX;
    if (testTouchStartX - testTouchEndX > 45) {
      testIndex = (testIndex + 1) % testimonials.length;
      renderTestimonial();
    } else if (testTouchEndX - testTouchStartX > 45) {
      testIndex = (testIndex - 1 + testimonials.length) % testimonials.length;
      renderTestimonial();
    }
  }, { passive: true });


  // =========================================================================
  // 6. FAQS ACCORDION
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const collapse = item.querySelector('.faq-answer-collapse');

    btn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherCollapse = other.querySelector('.faq-answer-collapse');
        if (otherCollapse) otherCollapse.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        collapse.style.maxHeight = collapse.scrollHeight + 30 + 'px';
      }
    });
  });

  if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
    const firstCollapse = faqItems[0].querySelector('.faq-answer-collapse');
    if (firstCollapse) firstCollapse.style.maxHeight = firstCollapse.scrollHeight + 30 + 'px';
  }

  // Adjust open FAQ height dynamically on mobile orientation/resize
  window.addEventListener('resize', () => {
    const activeFaq = document.querySelector('.faq-item.active .faq-answer-collapse');
    if (activeFaq) {
      activeFaq.style.maxHeight = activeFaq.scrollHeight + 30 + 'px';
    }
  });


  // =========================================================================
  // 7. ENQUIRY FORM & WHATSAPP GENERATION (Andhra Pradesh Context)
  // =========================================================================
  const enquiryForm = document.getElementById('enquiryForm');
  const btnSendWhatsApp = document.getElementById('btnSendWhatsApp');
  const toastNotice = document.getElementById('toastNotice');
  const toastMessage = document.getElementById('toastMessage');

  function showToast(msg) {
    if (!toastNotice || !toastMessage) return;
    toastMessage.textContent = msg;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 4500);
  }

  enquiryForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('enquiryName')?.value.trim();
    const phone = document.getElementById('enquiryPhone')?.value.trim();
    const city = document.getElementById('enquiryCity')?.value;
    const capacity = document.getElementById('enquiryCapacity')?.value || 'Not specified';

    if (!name || !phone) {
      showToast('⚠️ Please enter your Full Name and Mobile Number.');
      return;
    }

    if (phone.length < 10) {
      showToast('⚠️ Please enter a valid 10-digit mobile number.');
      return;
    }

    showToast(`🎉 Thank you, ${name}! Your quotation request for ${capacity} in ${city}, Andhra Pradesh has been received. Our engineer will call you at ${phone} shortly!`);
    enquiryForm.reset();
  });

  btnSendWhatsApp?.addEventListener('click', () => {
    const name = document.getElementById('enquiryName')?.value.trim() || 'Sir/Madam';
    const phone = document.getElementById('enquiryPhone')?.value.trim() || 'Not specified';
    const city = document.getElementById('enquiryCity')?.value || 'Andhra Pradesh';
    const bill = document.getElementById('enquiryBill')?.value || '₹2,500';
    const capacity = document.getElementById('enquiryCapacity')?.value || '3 kW';
    const roofType = document.getElementById('enquiryRoofType')?.value || 'RCC Flat Terrace';
    const notes = document.getElementById('enquiryNotes')?.value.trim() || 'Please arrange a site inspection.';

    const message = `*SOLAR INQUIRY - TIRUMALA SOLAR SYSTEMS (AP)*%0A%0A` +
      `*Name:* ${encodeURIComponent(name)}%0A` +
      `*Phone:* ${encodeURIComponent(phone)}%0A` +
      `*Location:* ${encodeURIComponent(city)}, Andhra Pradesh%0A` +
      `*Current Monthly Bill:* ${encodeURIComponent(bill)}%0A` +
      `*Required Capacity:* ${encodeURIComponent(capacity)}%0A` +
      `*Terrace Roof Type:* ${encodeURIComponent(roofType)}%0A` +
      `*Notes:* ${encodeURIComponent(notes)}%0A%0A` +
      `_Requested via Tirumala Solar Andhra Website_`;

    const waUrl = `https://wa.me/916301768198?text=${message}`;
    window.open(waUrl, '_blank');
  });


  // =========================================================================
  // 8. MOBILE SIDEWAYS AUTO-SCROLLER FOR ABOUT FEATURES, SOLUTIONS & SUBSIDY SLABS
  // =========================================================================
  function initMobileCardAutoScroller(containerSelector, cardSelector, intervalMs = 3800) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    let currentIndex = 0;
    let autoTimer = null;
    let isUserInteracting = false;
    let pauseTimer = null;

    function isMobile() {
      return window.innerWidth <= 768;
    }

    function getCards() {
      return Array.from(container.querySelectorAll(cardSelector));
    }

    // Create or locate dot container
    let dotsWrap = container.parentNode.querySelector(`.mobile-carousel-dots[data-target="${containerSelector.replace(/[^a-zA-Z0-9]/g, '')}"]`);
    if (!dotsWrap) {
      dotsWrap = document.createElement('div');
      dotsWrap.className = 'mobile-carousel-dots';
      dotsWrap.setAttribute('data-target', containerSelector.replace(/[^a-zA-Z0-9]/g, ''));
      container.parentNode.insertBefore(dotsWrap, container.nextSibling);
    }

    function renderDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      if (!isMobile()) {
        dotsWrap.style.display = 'none';
        return;
      }
      dotsWrap.style.display = 'flex';
      const cards = getCards();
      cards.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = `mobile-dot ${idx === currentIndex ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        dot.addEventListener('click', () => {
          pauseAutoScroll();
          scrollToCard(idx);
        });
        dotsWrap.appendChild(dot);
      });
    }

    function updateDots() {
      if (!dotsWrap || !isMobile()) return;
      const dots = dotsWrap.querySelectorAll('.mobile-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    function scrollToCard(index) {
      if (!isMobile()) return;
      const cards = getCards();
      if (cards.length === 0) return;
      currentIndex = (index + cards.length) % cards.length;
      const targetCard = cards[currentIndex];
      if (targetCard) {
        const cardRect = targetCard.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const scrollOffset = cardRect.left - containerRect.left + container.scrollLeft - (container.clientWidth - targetCard.clientWidth) / 2;
        container.scrollTo({
          left: Math.max(0, scrollOffset),
          behavior: 'smooth'
        });
        updateDots();
      }
    }

    function nextCard() {
      if (!isMobile() || isUserInteracting) return;
      const cards = getCards();
      if (cards.length <= 1) return;
      currentIndex = (currentIndex + 1) % cards.length;
      scrollToCard(currentIndex);
    }

    function pauseAutoScroll() {
      isUserInteracting = true;
      clearTimeout(pauseTimer);
      pauseTimer = setTimeout(() => {
        isUserInteracting = false;
      }, 5000);
    }

    // Pause on touch or wheel interaction
    container.addEventListener('touchstart', pauseAutoScroll, { passive: true });
    container.addEventListener('pointerdown', pauseAutoScroll, { passive: true });
    container.addEventListener('wheel', pauseAutoScroll, { passive: true });

    // Track active card on manual swipe/scroll
    let scrollTimeout = null;
    container.addEventListener('scroll', () => {
      if (!isMobile()) return;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const cards = getCards();
        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        let minDiff = Infinity;
        let activeIdx = 0;
        cards.forEach((card, idx) => {
          const cardRect = card.getBoundingClientRect();
          const cardCenter = cardRect.left + cardRect.width / 2;
          const diff = Math.abs(containerCenter - cardCenter);
          if (diff < minDiff) {
            minDiff = diff;
            activeIdx = idx;
          }
        });
        if (activeIdx !== currentIndex) {
          currentIndex = activeIdx;
          updateDots();
        }
      }, 60);
    }, { passive: true });

    function startAutoScroll() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        nextCard();
      }, intervalMs);
    }

    renderDots();
    startAutoScroll();

    window.addEventListener('resize', () => {
      renderDots();
      if (!isMobile()) {
        container.scrollTo({ left: 0, behavior: 'auto' });
      }
    });
  }

  // Initialize sideways auto-scrollers for all 3 mobile card groups
  initMobileCardAutoScroller('.about-features-grid', '.about-card', 3800);
  initMobileCardAutoScroller('.solutions-grid', '.solution-card', 4200);
  initMobileCardAutoScroller('.subsidy-slabs-container', '.subsidy-slab-card', 3500);

});

