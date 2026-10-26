(function(){
  const form = document.getElementById('noticeForm');
  const history = document.getElementById('noticeHistory');
  if(!form || !history || !window.StudNotices) return;

  const titleInput = document.getElementById('noticeTitle');
  const textInput = document.getElementById('noticeText');
  const fileInput = document.getElementById('noticeFiles');
  const fileList = document.getElementById('noticeFilesList');
  const submitButton = document.getElementById('noticeSubmit');

  const maxFiles = 5;
  const maxFileSize = 1.5 * 1024 * 1024;
  const allowedExt = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'zip'];
  let selected = [];

  function formatSize(bytes){
    if(bytes < 1024) return `${bytes} Б`;
    if(bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
    return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} МБ`;
  }

  function extOf(name){
    return (name.split('.').pop() || '').toLowerCase();
  }

  function readAsDataUrl(file){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result));
      reader.addEventListener('error', () => reject(new Error('Не удалось прочитать файл.')));
      reader.readAsDataURL(file);
    });
  }

  function renderFiles(){
    fileList.innerHTML = '';

    selected.forEach((file, index) => {
      const item = document.createElement('li');
      item.className = 'notice-file';

      const badge = document.createElement('span');
      badge.className = 'notice-file-badge';
      badge.textContent = extOf(file.name).toUpperCase().slice(0, 4);

      const name = document.createElement('span');
      name.className = 'notice-file-name';
      name.textContent = file.name;

      const size = document.createElement('span');
      size.className = 'notice-file-size';
      size.textContent = formatSize(file.size);

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'notice-file-remove';
      remove.setAttribute('aria-label', `Убрать файл ${file.name}`);
      remove.textContent = '\u00d7';
      remove.addEventListener('click', () => {
        selected.splice(index, 1);
        renderFiles();
      });

      item.append(badge, name, size, remove);
      fileList.appendChild(item);
    });
  }

  fileInput.addEventListener('change', () => {
    const incoming = [...fileInput.files];
    fileInput.value = '';

    incoming.forEach(file => {
      if(!allowedExt.includes(extOf(file.name))){
        window.showOperationFeedback?.('warning', `Формат файла «${file.name}» не поддерживается.`);
        return;
      }
      if(file.size > maxFileSize){
        window.showOperationFeedback?.('warning', `Файл «${file.name}» больше 1,5 МБ.`);
        return;
      }
      if(selected.some(item => item.name === file.name && item.size === file.size)) return;
      if(selected.length >= maxFiles){
        window.showOperationFeedback?.('warning', `Можно прикрепить не больше ${maxFiles} файлов.`);
        return;
      }
      selected.push(file);
    });

    renderFiles();
  });

  function renderHistory(){
    history.innerHTML = '';
    const notices = window.StudNotices.list();

    if(!notices.length){
      const empty = document.createElement('div');
      empty.className = 'notice-empty';
      empty.textContent = 'Вы ещё не отправляли уведомлений';
      history.appendChild(empty);
      return;
    }

    notices.forEach(notice => {
      const item = document.createElement('article');
      item.className = 'notice-item notice-item-static';

      const main = document.createElement('div');
      main.className = 'notice-item-main';

      const title = document.createElement('div');
      title.className = 'notice-item-title';
      title.textContent = notice.title;

      const text = document.createElement('p');
      text.className = 'notice-item-text';
      text.textContent = window.StudNotices.excerpt(notice.text, 140);

      const meta = document.createElement('div');
      meta.className = 'notice-item-meta';
      const parts = [window.StudNotices.formatDate(notice.createdAt)];
      if(notice.files?.length) parts.push(window.StudNotices.filesLabel(notice.files.length));
      meta.textContent = parts.filter(Boolean).join(' · ');

      main.append(title, text, meta);

      const actions = document.createElement('div');
      actions.className = 'notice-item-actions';

      const open = document.createElement('a');
      open.className = 'notice-action';
      open.href = window.StudNotices.noticeUrl(notice.id);
      open.textContent = 'Открыть';

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'notice-action notice-action-danger';
      remove.textContent = 'Удалить';
      remove.addEventListener('click', async () => {
        const confirmed = await window.StudDialog.confirm({
          title: 'Удалить уведомление?',
          text: `Уведомление «${notice.title}» и прикреплённые файлы исчезнут у всех студентов. Это действие нельзя отменить.`,
          confirmLabel: 'Удалить'
        });
        if(!confirmed) return;

        if(window.StudNotices.remove(notice.id)){
          renderHistory();
          window.showOperationFeedback?.('success', 'Уведомление удалено.');
        }else{
          window.showOperationFeedback?.('error', 'Не удалось удалить уведомление.');
        }
      });

      actions.append(open, remove);
      item.append(main, actions);
      history.appendChild(item);
    });
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if(form.dataset.saving === 'true') return;

    const title = titleInput.value.trim();
    const text = textInput.value.trim();

    if(!title || !text){
      window.showOperationFeedback?.('warning', 'Заполните заголовок и текст уведомления.', form);
      return;
    }

    form.dataset.saving = 'true';
    submitButton.disabled = true;

    try{
      const files = [];
      for(const file of selected){
        files.push({
          name: file.name,
          size: formatSize(file.size),
          ext: extOf(file.name).toUpperCase(),
          url: await readAsDataUrl(file)
        });
      }

      const saved = window.StudNotices.add({ title, text, author: window.StudAuth?.role || 'employee', files, systemReport: { type: 'student-events' } });

      if(!saved){
        window.showOperationFeedback?.('error', 'Не удалось сохранить уведомление. Возможно, переполнено хранилище браузера — попробуйте файлы поменьше.', form);
        return;
      }

      form.reset();
      selected = [];
      renderFiles();
      renderHistory();
      window.showOperationFeedback?.('success', 'Уведомление отправлено всем студентам.');
    }catch(error){
      window.showOperationFeedback?.('error', error?.message || 'Не удалось отправить уведомление.', form);
    }finally{
      delete form.dataset.saving;
      submitButton.disabled = false;
    }
  });

  renderFiles();
  renderHistory();
})();