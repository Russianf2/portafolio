const IMAGES = [
  { file: 'big.png', title: 'Big Mind',    subtitle: 'Rediseño'     },
  { file: 'portada.jpg', title: 'Fortnite x Southpark',         subtitle: 'Parcial'        },
  { file: 'portada.png', title: 'Portada Cancion',        subtitle: 'Trabajo'    },
  { file: 'SUHI.png', title: 'SUHI',          subtitle: 'Portada de video clip'    },
  { file: 'SUPLICAZZ.png', title: 'SUPLICAZZ',          subtitle: 'Portada de video clip'    },
  { file: 'Soundly.png', title: 'Soundly',          subtitle: 'Landing Page'    },
];

const IMAGES_FOLDER = 'imagenes/';

/* Colores de respaldo si la imagen no carga */
const FALLBACK_COLORS = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#a18cd1,#fbc2eb)',
  'linear-gradient(135deg,#ffecd2,#fcb69f)',
  'linear-gradient(135deg,#a1c4fd,#c2e9fb)',
  'linear-gradient(135deg,#fd7043,#ff8a65)',
];


const YOUTUBE_VIDEOS = [
  { id: 'j4u0800M__k', title: 'Suhi Video Clip',       channel: 'KURE' },
  // { id: 'TU_ID_AQUI', title: 'Nombre', channel: 'Proyecto' },
];


const state = {
  windows: {},
  topZ:    100,
};

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function updateClocks() {
  const now   = new Date();
  const hh    = String(now.getHours()).padStart(2, '0');
  const mm    = String(now.getMinutes()).padStart(2, '0');
  const dias  = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const dd    = String(now.getDate()).padStart(2, '0');
  const mo    = String(now.getMonth() + 1).padStart(2, '0');

  const map = {
    '#login-time'  : `${hh}:${mm}`,
    '#login-date'  : `${dias[now.getDay()]}, ${now.getDate()} de ${meses[now.getMonth()]}`,
    '#taskbar-time': `${hh}:${mm}`,
    '#taskbar-date': `${dd}/${mo}/${now.getFullYear()}`,
  };

  for (const [sel, val] of Object.entries(map)) {
    const el = $(sel);
    if (el) el.textContent = val;
  }
}

updateClocks();
setInterval(updateClocks, 1000);

const PASS = 'gio2024';

function handleLogin() {
  const passEl  = $('#login-pass');
  const errorEl = $('#login-error');

  if (passEl.value === PASS) {
    errorEl.classList.remove('visible');
    const loginScreen = $('#login-screen');
    loginScreen.classList.add('fade-out');
    setTimeout(() => {
      loginScreen.classList.add('hidden');
      showDesktop();
    }, 600);
  } else {
    errorEl.classList.add('visible');
    passEl.value = '';
  }
}

$('#login-btn').addEventListener('click', handleLogin);
$('#login-pass').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleLogin();
});

function showDesktop() {
  $('#desktop').classList.remove('hidden');


  $$('.window').forEach(win => {
    state.windows[win.id] = { minimized: false, maximized: false, prevBounds: null };
  });

  buildImageList();
  buildVideoList();


  $$('.desk-icon').forEach((icon, i) => {
    icon.style.opacity   = '0';
    icon.style.transform = 'translateY(20px)';
    setTimeout(() => {
      icon.style.transition = 'opacity .4s ease, transform .4s ease';
      icon.style.opacity    = '1';
      icon.style.transform  = '';
    }, 100 + i * 80);
  });

  showToast('¡Bienvenido! 👋');
}


function buildImageList() {
  const list = $('#image-list');
  if (!list) return;

  $$('.side-item', list).forEach(el => el.remove());

  if (IMAGES.length === 0) {
    const p = document.createElement('p');
    p.style.cssText = 'font-size:12px;color:var(--muted);padding:8px 4px;line-height:1.6';
    p.textContent = 'Agrega imágenes en el array IMAGES (script.js) y súbelas a /imagenes/';
    list.appendChild(p);
    return;
  }

  IMAGES.forEach((img, idx) => {
    const item = document.createElement('div');
    item.className = 'side-item' + (idx === 0 ? ' active' : '');

    const fallback = FALLBACK_COLORS[idx % FALLBACK_COLORS.length];

    item.innerHTML = `
      <div class="side-thumb" style="background:${fallback}">
        <img
          src="${IMAGES_FOLDER}${img.file}"
          alt="${img.title}"
          loading="lazy"
          onerror="this.style.display='none'"
        />
      </div>
      <div class="side-meta">
        <span class="side-name">${img.title}</span>
        <span class="side-sub">${img.subtitle}</span>
      </div>
    `;

    item.addEventListener('click', () => selectImage(idx));
    list.appendChild(item);
  });

  selectImage(0);
}

function selectImage(idx) {
  const img = IMAGES[idx];
  if (!img) return;

  $$('.side-item', $('#image-list')).forEach((el, i) =>
    el.classList.toggle('active', i === idx)
  );

  const titleEl = $('#img-title');
  if (titleEl) titleEl.textContent = `${img.title} — ${img.subtitle}`;

  const screen   = $('#image-screen');
  if (!screen) return;
  const fallback = FALLBACK_COLORS[idx % FALLBACK_COLORS.length];

  screen.innerHTML = '';
  screen.style.background = fallback;

  const imgEl = document.createElement('img');
  imgEl.className = 'viewer-img';
  imgEl.alt       = img.title;

  imgEl.onload  = () => {
    screen.style.background = '#0d0d1a';
    imgEl.classList.add('loaded');
  };
  imgEl.onerror = () => {

    screen.style.background = fallback;
  };

  imgEl.src = `${IMAGES_FOLDER}${img.file}`;
  screen.appendChild(imgEl);
}

function buildVideoList() {
  const list = $('#video-list');
  if (!list) return;

  $$('.side-item', list).forEach(el => el.remove());

  if (YOUTUBE_VIDEOS.length === 0) {
    const p = document.createElement('p');
    p.style.cssText = 'font-size:12px;color:var(--muted);padding:8px 4px;line-height:1.6';
    p.textContent = 'Agrega videos en YOUTUBE_VIDEOS (script.js) y activa el embebido en YouTube Studio.';
    list.appendChild(p);
    return;
  }

  YOUTUBE_VIDEOS.forEach((vid, idx) => {
    const item = document.createElement('div');
    item.className = 'side-item' + (idx === 0 ? ' active' : '');

    item.innerHTML = `
      <div class="side-thumb" style="background:#1a1a2e">
        <img
          src="https://img.youtube.com/vi/${vid.id}/mqdefault.jpg"
          alt="${vid.title}"
          loading="lazy"
          onerror="this.style.display='none'"
        />
      </div>
      <div class="side-meta">
        <span class="side-name">${vid.title}</span>
        <span class="side-sub">${vid.channel}</span>
      </div>
    `;

    item.addEventListener('click', () => selectVideo(idx));
    list.appendChild(item);
  });

  selectVideo(0);
}

function selectVideo(idx) {
  const vid = YOUTUBE_VIDEOS[idx];
  if (!vid) return;

  $$('.side-item', $('#video-list')).forEach((el, i) =>
    el.classList.toggle('active', i === idx)
  );

  const titleEl = $('#yt-title');
  if (titleEl) titleEl.textContent = `${vid.title} — ${vid.channel}`;

  const screen = $('#video-screen');
  if (!screen) return;

  screen.innerHTML = '';

  const iframe = document.createElement('iframe');
  iframe.src   = `https://www.youtube.com/embed/${vid.id}?rel=0&modestbranding=1`;
  iframe.title = vid.title;
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
  iframe.style.cssText = 'width:100%;height:100%;display:block;border:none';

  screen.appendChild(iframe);
}

function openWindow(id) {
  const win = $(`#${id}`);
  if (!win) return;
  const ws = state.windows[id];

  if (ws.minimized) {
    ws.minimized = false;
    win.classList.remove('hidden');
    win.classList.add('opening');
    win.addEventListener('animationend', () => win.classList.remove('opening'), { once: true });
    focusWindow(win);
    updateTaskbarBtn(id);
    return;
  }

  if (!win.classList.contains('hidden')) {
    focusWindow(win);
    return;
  }

  win.classList.remove('hidden');
  win.classList.add('opening');
  win.addEventListener('animationend', () => win.classList.remove('opening'), { once: true });
  focusWindow(win);
  updateTaskbarBtn(id);

  if (id === 'win-about') setTimeout(animateSkillBars, 400);
}

function focusWindow(win) {
  $$('.window').forEach(w => w.classList.remove('active-win'));
  state.topZ += 2;
  win.style.zIndex = state.topZ;
  win.classList.add('active-win');
}

function closeWindow(id) {
  const win = $(`#${id}`);
  if (!win) return;

  if (id === 'win-videos') {
    const screen = $('#video-screen');
    if (screen) screen.innerHTML = '';
  }

  state.windows[id].minimized = false;
  win.classList.add('closing');
  win.addEventListener('animationend', () => {
    win.classList.add('hidden');
    win.classList.remove('closing');
    updateTaskbarBtn(id);
  }, { once: true });
}

function minimizeWindow(id) {
  const win = $(`#${id}`);
  if (!win) return;
  state.windows[id].minimized = true;
  win.classList.add('minimizing');
  win.addEventListener('animationend', () => {
    win.classList.add('hidden');
    win.classList.remove('minimizing');
    updateTaskbarBtn(id);
  }, { once: true });
}

function toggleMaximize(id) {
  const win = $(`#${id}`);
  if (!win) return;
  const ws = state.windows[id];
  if (!ws.maximized) {
    ws.prevBounds = { top: win.style.top, left: win.style.left, width: win.style.width, height: win.style.height };
    ws.maximized  = true;
    win.classList.add('maximized');
  } else {
    ws.maximized = false;
    win.classList.remove('maximized');
    if (ws.prevBounds) Object.assign(win.style, ws.prevBounds);
  }
}

document.addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, window: id } = btn.dataset;
  if (action === 'close')    closeWindow(id);
  if (action === 'minimize') minimizeWindow(id);
  if (action === 'maximize') toggleMaximize(id);
  e.stopPropagation();
});

document.addEventListener('click', e => {
  const icon = e.target.closest('.desk-icon');
  if (!icon) return;
  if (e.target.closest('[data-action]')) return;
  openWindow(icon.dataset.window);
});

/* Enfocar ventana al hacer clic en ella */
document.addEventListener('mousedown', e => {
  const win = e.target.closest('.window');
  if (win && !e.target.closest('[data-action]')) {
    focusWindow(win);
    updateTaskbarBtn(win.id);
  }
});

$$('.taskbar-app-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id  = btn.dataset.window;
    const ws  = state.windows[id];
    const win = $(`#${id}`);
    if (!win || (win.classList.contains('hidden') && !ws?.minimized)) {
      openWindow(id);
    } else if (ws?.minimized) {
      openWindow(id);
    } else {
      minimizeWindow(id);
    }
  });
});

function updateTaskbarBtn(winId) {
  const btn = $(`.taskbar-app-btn[data-window="${winId}"]`);
  if (!btn) return;
  const ws = state.windows[winId];
  btn.classList.remove('open', 'minimized');
  if (ws.minimized) {
    btn.classList.add('minimized');
  } else if (!$(`#${winId}`)?.classList.contains('hidden')) {
    btn.classList.add('open');
  }
}

const startMenu = $('#start-menu');
const startBtn  = $('#taskbar-start');

startBtn.addEventListener('click', e => {
  e.stopPropagation();
  startMenu.classList.toggle('hidden');
  startBtn.classList.toggle('active');
});

document.addEventListener('click', e => {
  if (!startMenu.classList.contains('hidden') &&
      !startMenu.contains(e.target) && e.target !== startBtn) {
    startMenu.classList.add('hidden');
    startBtn.classList.remove('active');
  }
});

$$('.start-app').forEach(app => {
  app.addEventListener('click', () => {
    openWindow(app.dataset.window);
    startMenu.classList.add('hidden');
    startBtn.classList.remove('active');
  });
});

$('#start-logout').addEventListener('click', () => {
  $$('.window').forEach(w => { if (!w.classList.contains('hidden')) closeWindow(w.id); });
  const videoScreen = $('#video-screen');
  if (videoScreen) videoScreen.innerHTML = '';
  setTimeout(() => {
    $('#desktop').classList.add('hidden');
    const ls = $('#login-screen');
    ls.classList.remove('hidden', 'fade-out');
    $('#login-pass').value = '';
    $('#login-error').classList.remove('visible');
    startMenu.classList.add('hidden');
    startBtn.classList.remove('active');
  }, 350);
});

let drag = null;

document.addEventListener('mousedown', e => {
  const tb = e.target.closest('.win-titlebar');
  if (!tb) return;
  const winId = tb.dataset.window;
  const win   = $(`#${winId}`);
  if (!win || state.windows[winId]?.maximized) return;
  focusWindow(win);
  updateTaskbarBtn(winId);
  const r = win.getBoundingClientRect();
  drag = { win, offX: e.clientX - r.left, offY: e.clientY - r.top };
  e.preventDefault();
});

document.addEventListener('mousemove', e => {
  if (!drag) return;
  const { win, offX, offY } = drag;
  const maxX = window.innerWidth  - win.offsetWidth;
  const maxY = window.innerHeight - win.offsetHeight - 52;
  win.style.left = Math.max(0, Math.min(e.clientX - offX, maxX)) + 'px';
  win.style.top  = Math.max(0, Math.min(e.clientY - offY, maxY)) + 'px';
});

document.addEventListener('mouseup', () => { drag = null; });

function animateSkillBars() {
  $$('.skill-fill').forEach(f => f.classList.add('animated'));
}

let toastTimer = null;

function showToast(msg, ms = 2800) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), ms);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !startMenu.classList.contains('hidden')) {
    startMenu.classList.add('hidden');
    startBtn.classList.remove('active');
  }
});
