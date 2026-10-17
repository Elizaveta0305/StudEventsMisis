(function(){
  const feedbackTimers = new WeakMap();

  function showOperationFeedback(type, message, target){
    const allowedTypes = ['success', 'warning', 'error'];
    if(!allowedTypes.includes(type)) return;

    let stack = document.querySelector('.operation-feedback-stack');
    if(!stack){
      stack = document.createElement('div');
      stack.className = 'operation-feedback-stack';
      stack.setAttribute('aria-label', 'Уведомления');
      document.body.appendChild(stack);
    }

    const titles = {
      success: 'Успешно',
      warning: 'Проверьте данные',
      error: 'Не удалось выполнить операцию'
    };
    const symbols = { success: '\u2713', warning: '!', error: '\u00d7' };
    const toast = document.createElement('div');
    toast.className = `operation-feedback operation-feedback-${type}`;
    toast.setAttribute('role', type === 'success' ? 'status' : 'alert');

    const icon = document.createElement('span');
    icon.className = 'operation-feedback-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = symbols[type];

    const content = document.createElement('div');
    content.className = 'operation-feedback-content';
    const title = document.createElement('strong');
    title.textContent = titles[type];
    const description = document.createElement('span');
    description.textContent = message;
    content.append(title, description);

    const close = document.createElement('button');
    close.className = 'operation-feedback-close';
    close.type = 'button';
    close.setAttribute('aria-label', 'Закрыть уведомление');
    close.textContent = '\u00d7';
    close.addEventListener('click', () => toast.remove());

    toast.append(icon, content, close);
    stack.appendChild(toast);
    window.setTimeout(() => toast.remove(), 5000);

    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
    if(targetElement instanceof HTMLElement){
      const previousTimer = feedbackTimers.get(targetElement);
      if(previousTimer) window.clearTimeout(previousTimer);
      targetElement.classList.add('operation-feedback-target');
      targetElement.dataset.operationState = type;
      const timer = window.setTimeout(() => {
        delete targetElement.dataset.operationState;
        targetElement.classList.remove('operation-feedback-target');
        feedbackTimers.delete(targetElement);
      }, 5000);
      feedbackTimers.set(targetElement, timer);
    }
  }

  window.showOperationFeedback = showOperationFeedback;

  function initUserDropdown(toggleSelector = '#userToggle', menuSelector = '.user-menu'){
    const userToggle = document.querySelector(toggleSelector);
    const userMenu = document.querySelector(menuSelector);
    if(!userToggle || !userMenu) return;

    userToggle.addEventListener('click', function(event){
      event.preventDefault();
      event.stopPropagation();
      userMenu.classList.toggle('open');
    });

    document.addEventListener('click', function(event){
      if(!userMenu.contains(event.target) && !userToggle.contains(event.target)){
        userMenu.classList.remove('open');
      }
    });
  }

  function loadSiteTheme(){
    const saved = localStorage.getItem('siteTheme');
    if(saved === 'dark'){
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function initLogoutIconState(){
    const logoutItem = document.querySelector('.user-dropdown a.logout-link');
    if(!logoutItem) return;
    const logoutIcon = logoutItem.querySelector('.dropdown-icon img');
    if(!logoutIcon) return;

    let isHover = false;

    const isDarkMode = () => document.documentElement.classList.contains('dark');

    const applyState = () => {
      const dark = isDarkMode();
      if(isHover){
        if(dark){
          logoutItem.style.background = '#ffffff';
          logoutItem.style.color = '#111827';
          logoutIcon.style.filter = 'brightness(0) saturate(100%)';
        } else {
          logoutItem.style.background = '#fee2e2';
          logoutItem.style.color = '#b91c1c';
          logoutIcon.style.filter = 'none';
        }
      } else {
        logoutItem.style.background = 'transparent';
        if(dark){
          logoutItem.style.color = '#f8fafc';
          logoutIcon.style.filter = 'brightness(0) invert(1)';
        } else {
          logoutItem.style.color = '#111827';
          logoutIcon.style.filter = 'none';
        }
      }
    };

    logoutItem.addEventListener('mouseenter', () => {
      isHover = true;
      applyState();
    });
    logoutItem.addEventListener('mouseleave', () => {
      isHover = false;
      applyState();
    });

    const observer = new MutationObserver(applyState);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    applyState();
  }

  function initDateInputBehavior(){
    const dateField = document.querySelector('.date-field');
    const dateInput = dateField ? dateField.querySelector('input[type="date"]') : null;
    const dateTrigger = dateField ? dateField.querySelector('.date-trigger') : null;
    if(!dateField || !dateInput || !dateTrigger) return;

    const openPicker = () => {
      dateInput.focus();
      if(typeof dateInput.showPicker === 'function'){
        dateInput.showPicker();
      } else {
        dateInput.click();
      }
    };

    dateTrigger.addEventListener('click', function(event){
      event.preventDefault();
      openPicker();
    });

    dateField.addEventListener('click', function(event){
      if(event.target === dateTrigger) return;
      if(event.target === dateInput) return;
      event.preventDefault();
      openPicker();
    });
  }

  function initCaptcha(){
    const root = document.getElementById('captcha');
    if(!root) return;
    const form = root.closest('form');
    const W = 320;
    const H = 160;
    const S = 44;
    const R = 8;
    const PAD = 4;
    const PW = S + R;
    const TOLERANCE = 6;
    const HANDLE_GAP = 6;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const palettes = [
      ['#2563eb', '#7c3aed'],
      ['#0891b2', '#2563eb'],
      ['#db2777', '#7c3aed'],
      ['#059669', '#0891b2'],
      ['#ea580c', '#db2777']
    ];

    const stage = document.createElement('div');
    stage.className = 'captcha-stage';
    const bg = document.createElement('canvas');
    bg.className = 'captcha-bg';
    const piece = document.createElement('canvas');
    piece.className = 'captcha-piece';
    const refresh = document.createElement('button');
    refresh.type = 'button';
    refresh.className = 'captcha-refresh';
    refresh.setAttribute('aria-label', 'Показать другую картинку');
    refresh.textContent = '\u21bb';
    const result = document.createElement('div');
    result.className = 'captcha-result';
    result.textContent = '\u2713 Проверка пройдена';
    stage.append(bg, piece, refresh, result);

    const track = document.createElement('div');
    track.className = 'captcha-track';
    const fill = document.createElement('div');
    fill.className = 'captcha-fill';
    const hint = document.createElement('span');
    hint.className = 'captcha-hint';
    const handle = document.createElement('button');
    handle.type = 'button';
    handle.className = 'captcha-handle';
    handle.setAttribute('role', 'slider');
    handle.setAttribute('aria-label', 'Передвиньте кусочек пазла на место');
    handle.setAttribute('aria-valuemin', '0');
    handle.setAttribute('aria-valuemax', '100');
    handle.setAttribute('aria-valuenow', '0');
    handle.textContent = '\u2192';
    track.append(fill, hint, handle);

    const status = document.createElement('p');
    status.className = 'captcha-status';
    status.setAttribute('aria-live', 'polite');

    const token = document.createElement('input');
    token.type = 'hidden';
    token.name = 'captcha_solved';
    token.value = '';

    root.replaceChildren(stage, track, status, token);

    const base = document.createElement('canvas');
    let gapX = 0;
    let gapY = 0;
    let ratio = 0;
    let solved = false;
    let dragging = false;
    let startX = 0;
    let startRatio = 0;
    let startedAt = 0;
    let moves = 0;
    let viaKeyboard = false;
    let failTimer = null;

    function sizeCanvas(canvas, width, height){
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return ctx;
    }

    function rand(min, max){
      return min + Math.random() * (max - min);
    }

    function piecePath(ctx, x, y){
      const middle = S / 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + S, y);
      ctx.lineTo(x + S, y + middle - R);
      ctx.arc(x + S, y + middle, R, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(x + S, y + S);
      ctx.lineTo(x, y + S);
      ctx.closePath();
    }

    function drawScene(ctx){
      const [from, to] = palettes[Math.floor(Math.random() * palettes.length)];
      const gradient = ctx.createLinearGradient(0, 0, W, H);
      gradient.addColorStop(0, from);
      gradient.addColorStop(1, to);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);

      for(let i = 0; i < 9; i++){
        ctx.fillStyle = `rgba(255,255,255,${rand(0.07, 0.22).toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(rand(0, W), rand(0, H), rand(14, 46), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.lineWidth = 2;
      for(let i = 0; i < 5; i++){
        ctx.strokeStyle = `rgba(255,255,255,${rand(0.18, 0.35).toFixed(2)})`;
        ctx.beginPath();
        ctx.moveTo(0, rand(0, H));
        ctx.bezierCurveTo(rand(0, W), rand(0, H), rand(0, W), rand(0, H), W, rand(0, H));
        ctx.stroke();
      }

      for(let i = 0; i < 6; i++){
        ctx.save();
        ctx.translate(rand(0, W), rand(0, H));
        ctx.rotate(rand(0, Math.PI));
        ctx.fillStyle = `rgba(255,255,255,${rand(0.1, 0.2).toFixed(2)})`;
        const size = rand(10, 24);
        ctx.fillRect(-size / 2, -size / 2, size, size);
        ctx.restore();
      }
    }

    function newPuzzle(){
      window.clearTimeout(failTimer);
      solved = false;
      dragging = false;
      viaKeyboard = false;
      moves = 0;
      token.value = '';
      root.classList.remove('is-solved', 'is-failed', 'is-required', 'is-dragging');
      root.classList.add('is-resetting');
      handle.removeAttribute('aria-disabled');
      status.textContent = '';
      hint.textContent = 'Передвиньте ползунок, чтобы собрать пазл';

      gapX = rand(W * 0.35, W - PW - 12);
      gapY = rand(18, H - S - 18);

      const baseCtx = sizeCanvas(base, W, H);
      drawScene(baseCtx);

      const bgCtx = sizeCanvas(bg, W, H);
      bgCtx.drawImage(base, 0, 0, W, H);
      piecePath(bgCtx, gapX, gapY);
      bgCtx.fillStyle = 'rgba(0,0,0,0.42)';
      bgCtx.fill();
      bgCtx.strokeStyle = 'rgba(255,255,255,0.75)';
      bgCtx.lineWidth = 1.5;
      bgCtx.stroke();

      const pieceW = PW + PAD * 2;
      const pieceH = S + PAD * 2;
      const pieceCtx = sizeCanvas(piece, pieceW, pieceH);
      pieceCtx.clearRect(0, 0, pieceW, pieceH);
      pieceCtx.save();
      piecePath(pieceCtx, PAD, PAD);
      pieceCtx.clip();
      pieceCtx.drawImage(base, PAD - gapX, PAD - gapY, W, H);
      pieceCtx.restore();
      piecePath(pieceCtx, PAD, PAD);
      pieceCtx.strokeStyle = 'rgba(255,255,255,0.95)';
      pieceCtx.lineWidth = 2;
      pieceCtx.stroke();

      piece.style.width = `${(pieceW / W) * 100}%`;
      piece.style.top = `${((gapY - PAD) / H) * 100}%`;
      setRatio(0);
      window.setTimeout(() => root.classList.remove('is-resetting'), 380);
    }

    function maxTravel(){
      return Math.max(track.clientWidth - handle.offsetWidth - HANDLE_GAP, 1);
    }

    function setRatio(value){
      ratio = Math.min(1, Math.max(0, value));
      const x = ratio * maxTravel();
      handle.style.transform = `translateX(${x}px)`;
      fill.style.width = `${x + handle.offsetWidth + HANDLE_GAP / 2}px`;
      piece.style.left = `${((ratio * (W - PW) - PAD) / W) * 100}%`;
      handle.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
      hint.style.opacity = ratio > 0.04 ? '0' : '1';
    }

    function succeed(){
      solved = true;
      root.classList.remove('is-failed', 'is-required');
      root.classList.add('is-solved', 'is-resetting');
      setRatio(gapX / (W - PW));
      handle.setAttribute('aria-disabled', 'true');
      handle.textContent = '\u2713';
      hint.textContent = 'Проверка пройдена';
      hint.style.opacity = '1';
      status.textContent = 'Вы не робот. Можно продолжать.';
      token.value = '1';
    }

    function fail(){
      root.classList.add('is-failed');
      status.textContent = 'Не получилось. Попробуйте ещё раз.';
      failTimer = window.setTimeout(() => {
        handle.textContent = '\u2192';
        newPuzzle();
        status.textContent = 'Картинка обновлена. Попробуйте ещё раз.';
      }, 700);
    }

    function verify(){
      const position = ratio * (W - PW);
      const duration = performance.now() - startedAt;
      const looksHuman = viaKeyboard || (moves >= 3 && duration >= 350);
      if(Math.abs(position - gapX) <= TOLERANCE && looksHuman){
        succeed();
      }else if(ratio > 0.02){
        fail();
      }
    }

    handle.addEventListener('pointerdown', event => {
      if(solved || root.classList.contains('is-failed')) return;
      event.preventDefault();
      handle.setPointerCapture?.(event.pointerId);
      dragging = true;
      viaKeyboard = false;
      startX = event.clientX;
      startRatio = ratio;
      startedAt = performance.now();
      moves = 0;
      root.classList.remove('is-required', 'is-resetting');
      root.classList.add('is-dragging');
      status.textContent = '';
    });

    handle.addEventListener('pointermove', event => {
      if(!dragging) return;
      moves++;
      setRatio(startRatio + (event.clientX - startX) / maxTravel());
    });

    function endDrag(){
      if(!dragging) return;
      dragging = false;
      root.classList.remove('is-dragging');
      verify();
    }

    handle.addEventListener('pointerup', endDrag);
    handle.addEventListener('pointercancel', endDrag);

    handle.addEventListener('keydown', event => {
      if(solved || root.classList.contains('is-failed')) return;
      const step = event.shiftKey ? 0.1 : 0.02;
      if(event.key === 'ArrowRight' || event.key === 'ArrowLeft'){
        event.preventDefault();
        if(!viaKeyboard){
          viaKeyboard = true;
          startedAt = performance.now();
        }
        root.classList.remove('is-resetting', 'is-required');
        setRatio(ratio + (event.key === 'ArrowRight' ? step : -step));
      }else if(event.key === 'Enter' || event.key === ' '){
        event.preventDefault();
        verify();
      }
    });

    refresh.addEventListener('click', () => {
      handle.textContent = '\u2192';
      newPuzzle();
    });

    if(window.ResizeObserver){
      new ResizeObserver(() => setRatio(ratio)).observe(track);
    }else{
      window.addEventListener('resize', () => setRatio(ratio));
    }

    form?.addEventListener('submit', event => {
      if(solved) return;
      event.preventDefault();
      root.classList.add('is-required');
      status.textContent = 'Сначала пройдите проверку: соберите пазл.';
      window.showOperationFeedback?.('warning', 'Пройдите проверку «Я не робот».');
      root.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });

    newPuzzle();
  }

  document.addEventListener('DOMContentLoaded', function(){
    loadSiteTheme();
    initCaptcha();
    initLogoutIconState();
    initDateInputBehavior();
    initUserDropdown('#userToggle', '.user-menu');
  });

  window.initUserDropdown = initUserDropdown;
})();