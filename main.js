import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// ==========================================
// MOBILE DETECTION
// ==========================================
const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  || window.innerWidth < 768;

// ==========================================
// 1. GLASS LOADER DISMISSAL
// ==========================================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('glassLoader').classList.add('hide');
    // Trigger initial fade-ups after loader hides
    setTimeout(activateFades, 300);
  }, 1500);
});

// ==========================================
// 2. THREE.JS 3D BACKGROUND — EXTREME 3D EDITION
// ==========================================
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05060f, 0.035);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg-canvas'),
  alpha: true,
  antialias: !isMobile  // Disabled on mobile — MSAA is a major GPU killer on phones
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 1.5));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;
renderer.powerPreference = 'high-performance';

// ── Lighting Rig ──
const ambientLight = new THREE.AmbientLight(0x1a1a3e, 0.5);
scene.add(ambientLight);

const mainLight = new THREE.PointLight(0x00e5ff, 3.0, 40);
mainLight.position.set(4, 5, 6);
scene.add(mainLight);

const accentLight = new THREE.PointLight(0x7b2fff, 2.5, 30);
accentLight.position.set(-5, -2, 4);
scene.add(accentLight);

if (!isMobile) {
  const rimLight = new THREE.PointLight(0x00ffaa, 1.5, 20);
  rimLight.position.set(0, 8, -4);
  scene.add(rimLight);
}



// ── Deep Background Monoliths ──
const monoliths = [];
const monolithCount = isMobile ? 2 : 6;
for (let i = 0; i < monolithCount; i++) {
  const mGeo = new THREE.BoxGeometry(1.5, 8, 1.5);
  const mMat = isMobile
    ? new THREE.MeshStandardMaterial({
        color: 0x00e5ff,
        wireframe: true,
        roughness: 0.2,
        metalness: 1.0,
        transparent: true,
        opacity: 0.35,
        emissive: 0x0088aa,
        emissiveIntensity: 0.6
      })
    : new THREE.MeshPhysicalMaterial({
    color: 0x00e5ff,
    wireframe: true,
    roughness: 0.2,
    metalness: 1.0,
    transparent: true,
    opacity: 0.35,
    envMapIntensity: 2.0,
    emissive: 0x0088aa,
    emissiveIntensity: 0.6
  });
  const m = new THREE.Mesh(mGeo, mMat);
  m.position.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 10, -15 - Math.random() * 10);
  m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  scene.add(m);
  monoliths.push({ mesh: m, speed: Math.random() * 0.01 });
}

// ── Hero Icosahedron (main centerpiece) ──
const icoGeo = new THREE.IcosahedronGeometry(2.4, isMobile ? 0 : 1);
const icoMat = isMobile
  ? new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      wireframe: true,
      roughness: 0.1,
      metalness: 1.0,
      transparent: true,
      opacity: 0.45,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.35,
    })
  : new THREE.MeshPhysicalMaterial({
  color: 0x00e5ff,
  wireframe: true,
  roughness: 0.1,
  metalness: 1.0,
  transparent: true,
  opacity: 0.45,
  emissive: 0x00e5ff,
  emissiveIntensity: 0.35,
});
const icoMesh = new THREE.Mesh(icoGeo, icoMat);
icoMesh.position.set(3.5, 0, -2);
scene.add(icoMesh);

// Inner solid icosahedron for depth
const icoInnerGeo = new THREE.IcosahedronGeometry(1.7, isMobile ? 0 : 2);
const icoInnerMat = isMobile
  ? new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      roughness: 0.2,
      metalness: 1.0,
      transparent: true,
      opacity: 0.2,
      emissive: 0x7b2fff,
      emissiveIntensity: 0.35,
    })
  : new THREE.MeshPhysicalMaterial({
  color: 0xa855f7,
  roughness: 0.2,
  metalness: 1.0,
  transparent: true,
  opacity: 0.2,
  emissive: 0x7b2fff,
  emissiveIntensity: 0.35,
});
const icoInner = new THREE.Mesh(icoInnerGeo, icoInnerMat);
icoMesh.add(icoInner);



// ── Floating Cubes (scattered gems) ──
const floatingGems = [];
const allGemPositions = [
  { x: -6, y: 3, z: -15, s: 0.5, speed: 0.8 },
  { x: 5, y: -3, z: -16, s: 0.4, speed: 1.1 },
  { x: -4, y: -4, z: -13, s: 0.3, speed: 1.3 },
  { x: 8, y: 3, z: -17, s: 0.6, speed: 0.7 },
  { x: -8, y: -1, z: -18, s: 0.55, speed: 0.9 },
  { x: 2, y: 5, z: -14, s: 0.35, speed: 1.2 },
];
const gemPositions = isMobile ? allGemPositions.slice(0, 2) : allGemPositions;
gemPositions.forEach((g, i) => {
  const geo = new THREE.BoxGeometry(g.s, g.s, g.s);
  const mat = isMobile
    ? new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x00e5ff : 0xa855f7,
        wireframe: i % 3 === 0,
        roughness: 0.1,
        metalness: 1.0,
        transparent: true,
        opacity: 0.4 + Math.random() * 0.2,
        emissive: i % 2 === 0 ? 0x006688 : 0x5a18c4,
        emissiveIntensity: 0.7,
      })
    : new THREE.MeshPhysicalMaterial({
    color: i % 2 === 0 ? 0x00e5ff : 0xa855f7,
    wireframe: i % 3 === 0,
    roughness: 0.1,
    metalness: 1.0,
    transparent: true,
    opacity: 0.4 + Math.random() * 0.2,
    emissive: i % 2 === 0 ? 0x006688 : 0x5a18c4,
    emissiveIntensity: 0.7,
  });
  const m = new THREE.Mesh(geo, mat);
  m.position.set(g.x, g.y, g.z);
  m.userData = { originY: g.y, originZ: g.z, speed: g.speed, phase: Math.random() * Math.PI * 2 };
  scene.add(m);
  floatingGems.push(m);
});

// ── Star Dust Particles ──
const dustCount = isMobile ? 400 : 1500;
const dustGeo = new THREE.BufferGeometry();
const dustPos = new Float32Array(dustCount * 3);
for (let i = 0; i < dustCount * 3; i++) {
  dustPos[i] = (Math.random() - 0.5) * 35;
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
const dustMat = new THREE.PointsMaterial({
  size: 0.02,
  color: 0xffffff,
  transparent: true,
  opacity: 0.5,
  sizeAttenuation: true,
});
const dustMesh = new THREE.Points(dustGeo, dustMat);
scene.add(dustMesh);

// ── Nebula Orbs ──
const orbCount = isMobile ? 30 : 100;
const orbGeo = new THREE.BufferGeometry();
const orbPos = new Float32Array(orbCount * 3);
const orbColors = new Float32Array(orbCount * 3);
for (let i = 0; i < orbCount; i++) {
  orbPos[i * 3] = (Math.random() - 0.5) * 35;
  orbPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
  orbPos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 15;
  const c = Math.random();
  if (c < 0.5) { orbColors[i * 3] = 0; orbColors[i * 3 + 1] = 0.9; orbColors[i * 3 + 2] = 1; } // Cyan
  else if (c < 0.8) { orbColors[i * 3] = 0.48; orbColors[i * 3 + 1] = 0.18; orbColors[i * 3 + 2] = 1; } // Purple
  else { orbColors[i * 3] = 0; orbColors[i * 3 + 1] = 1; orbColors[i * 3 + 2] = 0.67; } // Green
}
orbGeo.setAttribute('position', new THREE.BufferAttribute(orbPos, 3));
orbGeo.setAttribute('color', new THREE.BufferAttribute(orbColors, 3));
const orbMat = new THREE.PointsMaterial({
  size: 0.09,
  vertexColors: true,
  transparent: true,
  opacity: 0.8,
  sizeAttenuation: true,
});
const orbMesh = new THREE.Points(orbGeo, orbMat);
scene.add(orbMesh);

camera.position.z = 7;

// ── Cached Scroll Position (avoids forced reflow in animation loop) ──
let cachedScrollY = 0;
window.addEventListener('scroll', () => { cachedScrollY = window.scrollY; }, { passive: true });

// ── Mouse Interaction ──
let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;
let mouseUpdatePending = false;

document.addEventListener('mousemove', (event) => {
  if (!mouseUpdatePending) {
    mouseUpdatePending = true;
    requestAnimationFrame(() => {
      targetMouseX = (event.clientX - window.innerWidth / 2) * 0.001;
      targetMouseY = (event.clientY - window.innerHeight / 2) * 0.001;
      mouseUpdatePending = false;
    });
  }
});

// ── Animation Loop ──
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  const scrollYRaw = cachedScrollY; // Use cached value — no forced reflow!
  const scrollY = scrollYRaw * 0.001;
  const extremeScroll = scrollYRaw * 0.005; // Restored the perfect extreme zoom!

  // Smooth mouse lerp
  mouseX += (targetMouseX - mouseX) * 0.05;
  mouseY += (targetMouseY - mouseY) * 0.05;



  // ── Deep Background Monoliths ──
  monoliths.forEach((m, i) => {
    m.mesh.rotation.y += m.speed;
    m.mesh.rotation.x += m.speed * 0.5;

    if (isMobile) {
      m.mesh.position.y += Math.sin(t * 0.3 + i) * 0.005;
    } else {
      let targetY = Math.sin(t * 0.5 + m.speed * 100) * 0.01;
      let targetZ = -25 - (i * 4) + extremeScroll * (15 + i * 2);
      if (targetZ > 10) targetZ = -40 + (targetZ % 50);
      m.mesh.position.y += targetY;
      m.mesh.position.z = targetZ;
    }
  });

  // ── Icosahedron ──
  if (isMobile) {
    icoMesh.rotation.y += 0.005;
    icoMesh.rotation.x = Math.sin(t * 0.2) * 0.1;
    icoMesh.position.y = Math.sin(t * 0.3) * 0.3;
    icoMesh.position.z = -4.5;
    icoMesh.scale.setScalar(0.65);

    icoInner.rotation.y -= 0.007;
    icoInner.rotation.x += 0.005;
  } else {
    // Desktop: full interaction
    icoMesh.rotation.y += 0.01;
    icoMesh.rotation.x = Math.sin(t * 0.4) * 0.2 + mouseY * 2.5 + extremeScroll * 0.1;
    icoMesh.rotation.z = Math.cos(t * 0.3) * 0.15;

    const heroFade = Math.min(scrollYRaw / 400, 1);
    icoMesh.material.opacity = 0.45 + heroFade * 0.25;
    icoMesh.material.emissiveIntensity = 0.35 + heroFade * 0.45;
    icoInner.material.opacity = 0.2 + heroFade * 0.2;
    icoInner.material.emissiveIntensity = 0.35 + heroFade * 0.45;

    icoMesh.position.y = Math.sin(t * 0.5) * 0.5 + extremeScroll * 1.5;
    icoMesh.position.z = -4.5 + extremeScroll * 5.5;
    icoMesh.scale.setScalar(0.7 + extremeScroll * 0.5);

    icoInner.rotation.y -= 0.015;
    icoInner.rotation.x += 0.01;
  }

  // ── Floating Gems ──
  if (isMobile) {
    floatingGems.forEach(gem => {
      const d = gem.userData;
      gem.position.y = d.originY + Math.sin(t * d.speed + d.phase) * 0.4;
      gem.position.z = d.originZ;
      gem.rotation.x = t * d.speed * 0.3;
      gem.rotation.y = t * d.speed * 0.25;
    });
  } else {
    floatingGems.forEach(gem => {
      const d = gem.userData;
      gem.position.y = d.originY + Math.sin(t * d.speed + d.phase) * 0.6 + extremeScroll * d.speed * 8;
      gem.rotation.x = t * d.speed * 0.5 + extremeScroll * 2;
      gem.rotation.y = t * d.speed * 0.4 + extremeScroll * 2;
    });
  }

  // ── Particles ──
  if (isMobile) {
    dustMesh.rotation.y = t * 0.01;
    dustMesh.rotation.x = t * 0.005;
    orbMesh.rotation.y = t * -0.008;
    orbMesh.rotation.x = t * 0.004;
  } else {
    dustMesh.rotation.y = t * 0.02 - mouseX * 0.4 + extremeScroll * 0.5;
    dustMesh.rotation.x = t * 0.01 - mouseY * 0.3 + extremeScroll * 0.5;
    orbMesh.rotation.y = t * -0.015 + mouseX * 0.2 - extremeScroll * 0.3;
    orbMesh.rotation.x = t * 0.008 + mouseY * 0.15 - extremeScroll * 0.3;
    orbMesh.position.z = extremeScroll * 5;
  }

  // ── Animated Lights ──
  if (isMobile) {
    mainLight.position.x = 4 + Math.sin(t * 0.2) * 1.5;
    mainLight.position.y = 5 + Math.cos(t * 0.25) * 1;
    accentLight.position.x = -5 + Math.sin(t * 0.3) * 2;
    accentLight.position.y = -2 + Math.cos(t * 0.2) * 1.5;
  } else {
    mainLight.position.x = 4 + Math.sin(t * 0.4) * 2.5;
    mainLight.position.y = 5 + Math.cos(t * 0.5) * 2;
    accentLight.position.x = -5 + Math.sin(t * 0.6) * 3.5;
    accentLight.position.y = -2 + Math.cos(t * 0.4) * 2.5;
  }

  // ── Camera ──
  if (isMobile) {
    // Mobile: static camera, no parallax
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 8;
    camera.lookAt(0, 0, -3);
  } else {
    camera.position.x = mouseX * 2.5;
    camera.position.y = -mouseY * 2.0;
    camera.position.z = 7 + extremeScroll * 1.5;
    camera.lookAt(0, extremeScroll * 1.5, -3);
  }

  renderer.render(scene, camera);
}

animate();

// Resize handler (debounced)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, 100);
});

// ==========================================
// 3. TYPING ANIMATION
// ==========================================
const roles = ['Data Analyst', 'Data Scientist'];
const typedEl = document.getElementById('typedRole');
let rIdx = 0, cIdx = 0, deleting = false;

function typeLoop() {
  const word = roles[rIdx];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++cIdx);
    if (cIdx === word.length) { deleting = true; return setTimeout(typeLoop, 2000); }
    setTimeout(typeLoop, 90);
  } else {
    typedEl.textContent = word.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; return setTimeout(typeLoop, 400); }
    setTimeout(typeLoop, 48);
  }
}
typeLoop();

// ==========================================
// 4. SUPER SMOOTH FADE-UP OBSERVER
// ==========================================
let fadeObs;
function activateFades() {
  if (fadeObs) fadeObs.disconnect();
  fadeObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-up:not(.visible)').forEach(el => fadeObs.observe(el));
}

// ==========================================
// 5. SMOOTH SCROLL & NAVIGATION
// ==========================================
function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  closeMenu();

  // Update active nav link
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const activeLink = document.querySelector(`.nav-links a[onclick*="'${id}'"]`);
  if (activeLink) activeLink.classList.add('active');
}

// Hamburger Menu
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}
function closeMenu() {
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}
document.addEventListener('click', e => {
  const nav = document.getElementById('navLinks');
  const btn = document.getElementById('hamburger');
  if (nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)) closeMenu();
});

// Expose functions to global scope for inline onclick handlers in HTML
window.smoothScrollTo = smoothScrollTo;
window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;

// Bind hamburger click directly (module scripts are deferred, so this guarantees binding)
document.getElementById('hamburger').addEventListener('click', toggleMenu);

// ==========================================
// 6. PROJECT MODAL
// ==========================================
function openProjectModal(type) {
  const data = {
    football: {
      title: 'Football Analytics Dashboard',
      overview: 'Comprehensive football analytics dashboard built to evaluate player performance, club trends, market value distribution, goals, assists and positional effectiveness. Designed to transform raw football datasets into actionable scouting and performance insights.',
      tools: 'Power BI, SQL, Excel, Data Cleaning, Data Modelling, DAX, Data Analytics',
      insights: 'Analyzed player efficiency, club valuation trends, goal contributions, assist patterns and positional strengths. Identified top-performing players and performance indicators useful for recruitment and strategic decision-making.',
      github: 'https://github.com/YashChatniwala/Capstone-Project'
    },
    movie: {
      title: 'Movie Performance & Rating Analysis',
      overview: 'End-to-end movie analytics project focused on understanding ratings, audience engagement, popularity, revenue generation and return on investment across genres and production trends.',
      tools: 'Power BI, SQL, Python, Pandas, Data Visualisation, Dashboard Design',
      insights: 'Explored genre performance, audience preferences, rating behaviour, revenue drivers and ROI trends. Highlighted high-performing content categories and factors influencing commercial success.',
      github: 'https://github.com/YashChatniwala/Movie-Data-Analysis'
    }
  }[type];

  if (!data) return;

  document.getElementById('mTitle').textContent = data.title;
  document.getElementById('mOverview').textContent = data.overview;
  document.getElementById('mTools').textContent = data.tools;
  document.getElementById('mInsights').textContent = data.insights;
  document.getElementById('mGithub').href = data.github;

  const modal = document.getElementById('projectModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  modal.classList.remove('active');
  document.body.style.overflow = ''; // Restore scrolling
}

// Close modal on outside click
document.getElementById('projectModal').addEventListener('click', (e) => {
  if (e.target.id === 'projectModal') closeProjectModal();
});

// Expose modal functions to global scope for inline onclick handlers
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;

// ==========================================
// 7. EMAILJS INTEGRATION
// ==========================================
emailjs.init({ publicKey: "jOkhab-vObRZ0xKsn" });

const contactForm = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const purpose = document.getElementById('purpose').value;
  const reply_to = document.getElementById('visitorEmail').value;
  const message = document.getElementById('visitorMessage').value;
  const phone = document.getElementById('visitorPhone').value;

  if (!reply_to || !message) {
    alert("Please complete all required fields.");
    return;
  }

  sendBtn.textContent = "Sending...";
  sendBtn.disabled = true;

  emailjs.send("service_lcb1hdx", "template_hgesd0b", {
    purpose: purpose,
    reply_to: reply_to,
    message: message,
    phone: phone
  }).then(() => {
    sendBtn.textContent = "✓ Message Sent";
    sendBtn.style.background = "#00b894";
    contactForm.reset();
    setTimeout(() => {
      sendBtn.textContent = "Send Message →";
      sendBtn.style.background = "";
      sendBtn.disabled = false;
    }, 3000);
  }).catch((error) => {
    console.error("EmailJS Error:", error);
    sendBtn.textContent = "Failed. Try Again";
    setTimeout(() => {
      sendBtn.textContent = "Send Message →";
      sendBtn.disabled = false;
    }, 3000);
  });
});

// ==========================================
// 8. CUSTOM CURSOR (Magnetic)
// ==========================================
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let cursorX = 0, cursorY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  cursorDot.style.left = cursorX + 'px';
  cursorDot.style.top = cursorY + 'px';
});

function animateCursor() {
  ringX += (cursorX - ringX) * 0.12;
  ringY += (cursorY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Magnetic hover on interactive elements
const magneticEls = document.querySelectorAll('a, button, .social-icon, .skill-card, .project-card');
magneticEls.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.classList.add('hover');
    cursorRing.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('hover');
    cursorRing.classList.remove('hover');
  });
});

// ==========================================
// 9. 3D TILT ON PROJECT CARDS
// ==========================================
const tiltCards = document.querySelectorAll('.project-card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ==========================================
// 10. ANIMATED STAT COUNTERS
// ==========================================
function animateCounter(el, target, suffix) {
  const isFloat = target % 1 !== 0;
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = isFloat
      ? (target * eased).toFixed(1)
      : Math.floor(target * eased);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent;
      const num = parseFloat(text);
      const suffix = text.replace(/[\d.]/g, '');
      animateCounter(el, num, suffix);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

// ==========================================
// 11. CONSOLIDATED SCROLL HANDLER
// ==========================================
const scrollProgressBar = document.getElementById('scrollProgress');
const heroText = document.querySelector('.hero-text');
const mainNav = document.getElementById('mainNav');
let lastScrollY = -1;

function onScroll() {
  const scrollY = window.scrollY;
  if (scrollY === lastScrollY) return;
  lastScrollY = scrollY;

  // Progress bar
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
  scrollProgressBar.style.width = progress + '%';

  // Hero parallax (only when hero is in view)
  if (scrollY < window.innerHeight) {
    heroText.style.transform = `translate3d(0, ${scrollY * 0.25}px, 0)`; // translate3d forces GPU layer
    heroText.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);
  }

  // Nav shadow
  mainNav.classList.toggle('scrolled', scrollY > 20);
}
window.addEventListener('scroll', onScroll, { passive: true });