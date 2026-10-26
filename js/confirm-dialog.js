(function(){
  let openDialog = null;

  function closeCurrent(result){
    if(!openDialog) return;
    const { overlay, dialog, resolve, previousFocus, onKeyDown } = openDialog;
    openDialog = null;
    document.removeEventListener('keydown', onKeyDown, true);
    overlay.classList.remove('open');
    dialog.classList.remove('open');
    window.setTimeout(() => {
      overlay.remove();
      dialog.remove();
    }, 200);
    if(previousFocus instanceof HTMLElement) previousFocus.focus();
    resolve(result);
  }

  function open(options){
    if(openDialog) closeCurrent(null);

    return new Promise(resolve => {
      const overlay = document.createElement('div');
      overlay.className = 'stud-dialog-overlay';

      const dialog = document.createElement('div');
      dialog.className = 'stud-dialog';
      if(options.tone) dialog.dataset.tone = options.tone;
      dialog.setAttribute('role', options.tone === 'danger' ? 'alertdialog' : 'dialog');
      dialog.setAttribute('aria-modal', 'true');

      const titleId = `studDialogTitle${Date.now()}`;
      dialog.setAttribute('aria-labelledby', titleId);

      const header = document.createElement('div');
      header.className = 'stud-dialog-header';

      const title = document.createElement('h2');
      title.id = titleId;
      title.className = 'stud-dialog-title';
      title.textContent = options.title || '';

      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'stud-dialog-close';
      close.setAttribute('aria-label', 'Закрыть');
      close.textContent = '\u00d7';
      close.addEventListener('click', () => closeCurrent(null));

      header.append(title, close);
      dialog.appendChild(header);

      if(options.body){
        const body = document.createElement('div');
        body.className = 'stud-dialog-body';
        if(typeof options.body === 'string') body.textContent = options.body;
        else body.appendChild(options.body);
        dialog.appendChild(body);
      }

      const actions = document.createElement('div');
      actions.className = 'stud-dialog-actions';

      let primaryButton = null;
      (options.actions || []).forEach(action => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `stud-dialog-btn stud-dialog-btn-${action.variant || 'secondary'}`;
        button.textContent = action.label;
        button.addEventListener('click', () => closeCurrent(action.value));
        actions.appendChild(button);
        if(action.variant === 'primary' || action.variant === 'danger') primaryButton = button;
        if(!primaryButton && action.focus) primaryButton = button;
      });
      dialog.appendChild(actions);

      overlay.addEventListener('click', () => closeCurrent(null));

      function onKeyDown(event){
        if(event.key === 'Escape'){
          event.preventDefault();
          event.stopPropagation();
          closeCurrent(null);
          return;
        }

        if(event.key !== 'Tab') return;
        const focusable = [...dialog.querySelectorAll('button:not([disabled]), a[href]')];
        if(!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if(event.shiftKey && document.activeElement === first){
          event.preventDefault();
          last.focus();
        }else if(!event.shiftKey && document.activeElement === last){
          event.preventDefault();
          first.focus();
        }
      }

      openDialog = { overlay, dialog, resolve, previousFocus: document.activeElement, onKeyDown };
      document.addEventListener('keydown', onKeyDown, true);

      document.body.append(overlay, dialog);
      window.requestAnimationFrame(() => {
        overlay.classList.add('open');
        dialog.classList.add('open');
        const focusTarget = actions.querySelector('.stud-dialog-btn-secondary') || primaryButton;
        (focusTarget || close).focus();
      });
    });
  }

  function confirm(options){
    return open({
      title: options.title,
      body: options.text,
      tone: options.tone || 'danger',
      actions: [
        { label: options.cancelLabel || 'Отмена', value: false, variant: 'secondary' },
        { label: options.confirmLabel || 'Подтвердить', value: true, variant: options.tone === 'neutral' ? 'primary' : 'danger' }
      ]
    }).then(result => result === true);
  }

  window.StudDialog = { open, confirm, close: closeCurrent };
})();