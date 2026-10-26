(function(){
  const documentEl = document.getElementById('noticeDocument');
  if(!documentEl || !window.StudNotices) return;

  const eventsKey = 'studEvents.events.v1';
  const profileKey = 'studEvents.profile.v1';
  const defaultName = 'Розенко Елизавета Максимовна';
  const roleLabels = { organizers: 'Организатор', volunteers: 'Волонтёр', participants: 'Участник' };

  const id = new URLSearchParams(window.location.search).get('id');
  const notice = id ? window.StudNotices.get(id) : null;

  if(!notice){
    const empty = document.createElement('div');
    empty.className = 'notice-empty';
    empty.textContent = 'Уведомление не найдено. Возможно, сотрудник его удалил.';
    documentEl.appendChild(empty);
    return;
  }

  function readJson(key, fallback){
    try{
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value ?? fallback;
    }catch{
      return fallback;
    }
  }

  function currentStudentName(){
    return readJson(profileKey, {}).fullName || defaultName;
  }

  function nameTokens(name){
    return String(name || '').toLocaleLowerCase('ru').split(/\s+/).filter(Boolean);
  }

  function isSameStudent(roleName, fullName){
    const tokens = nameTokens(roleName);
    const full = nameTokens(fullName);
    return tokens.length >= 2 && tokens.every(token => full.includes(token));
  }

  function collectStudentEvents(fullName){
    const events = readJson(eventsKey, []);
    const rows = [];

    (Array.isArray(events) ? events : []).forEach(event => {
      const roles = event.roles || event.studentsByRole || {};
      const found = Object.keys(roleLabels).filter(role => (roles[role] || []).some(person => isSameStudent(person?.name, fullName)));
      if(found.length) rows.push({ event, role: found.map(role => roleLabels[role]).join(', ') });
    });

    return rows.sort((a, b) => String(a.event.date).localeCompare(String(b.event.date)));
  }

  function escapeHtml(value){
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  function formatDate(value){
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function buildReportHtml(fullName){
    const rows = collectStudentEvents(fullName);
    const body = rows.length
      ? rows.map((row, index) => `<tr><td>${index + 1}</td><td>${escapeHtml(row.event.title)}</td><td>${escapeHtml(row.event.type)}</td><td>${escapeHtml(row.event.level)}</td><td>${escapeHtml(formatDate(row.event.date))}</td><td>${escapeHtml(row.event.location)}</td><td>${escapeHtml(row.role)}</td></tr>`).join('')
      : '<tr><td colspan="7">Мероприятий пока нет</td></tr>';

    return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><style>body{font-family:'Times New Roman',serif;font-size:14px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #000;padding:6px;text-align:left}</style></head><body><h2>Мои мероприятия</h2><p>Студент: ${escapeHtml(fullName)}</p><p>Уведомление: ${escapeHtml(notice.title)}</p><table><tr><th>№</th><th>Мероприятие</th><th>Тип</th><th>Уровень</th><th>Дата</th><th>Место</th><th>Роль</th></tr>${body}</table></body></html>`;
  }

  function downloadReport(){
    const blob = new Blob(['\ufeff', buildReportHtml(currentStudentName())], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Мои мероприятия.doc';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function buildFileRow(file, options = {}){
    const item = document.createElement('li');
    const row = document.createElement(options.asButton ? 'button' : 'a');
    row.className = 'notice-download';

    if(options.asButton){
      row.type = 'button';
      row.addEventListener('click', options.onClick);
    }else if(options.href){
      row.href = options.href;
      row.download = file.name;
    }

    const badge = document.createElement('span');
    badge.className = 'notice-file-badge';
    badge.textContent = String(file.ext || '').slice(0, 4);

    const info = document.createElement('span');
    info.className = 'notice-download-info';

    const name = document.createElement('strong');
    name.textContent = file.name;

    const size = document.createElement('small');
    size.textContent = file.size || '';

    info.append(name, size);
    row.append(badge, info);

    if(options.tag){
      const tag = document.createElement('span');
      tag.className = 'notice-system-tag';
      tag.textContent = options.tag;
      row.appendChild(tag);
    }

    const action = document.createElement('span');
    action.className = 'notice-download-action';
    action.textContent = 'Скачать';
    row.appendChild(action);

    item.appendChild(row);
    return item;
  }

  document.title = `${notice.title} · Уведомление`;

  const eyebrow = document.createElement('p');
  eyebrow.className = 'notice-eyebrow';
  eyebrow.textContent = 'УВЕДОМЛЕНИЕ';

  const title = document.createElement('h1');
  title.className = 'notice-document-title';
  title.textContent = notice.title;

  const meta = document.createElement('div');
  meta.className = 'notice-document-meta';
  meta.textContent = window.StudNotices.formatDate(notice.createdAt);

  const text = document.createElement('div');
  text.className = 'notice-document-text';
  text.textContent = notice.text;

  documentEl.append(eyebrow, title, meta, text);

  const hasFiles = Boolean(notice.files?.length);
  const hasReport = Boolean(notice.systemReport);

  if(hasFiles || hasReport){
    const filesTitle = document.createElement('h2');
    filesTitle.className = 'notice-files-title';
    filesTitle.textContent = 'Файлы';

    const list = document.createElement('ul');
    list.className = 'notice-download-list';

    (notice.files || []).forEach(file => list.appendChild(buildFileRow(file, { href: file.url })));

    if(hasReport){
      list.appendChild(buildFileRow(
        { name: 'Мои мероприятия.doc', ext: 'DOC', size: 'Формируется системой для каждого студента' },
        { asButton: true, tag: 'Системный', onClick: downloadReport }
      ));
    }

    documentEl.append(filesTitle, list);
  }

  if(window.StudAuth?.role === 'student') window.StudNotices.markSeen(notice.id);
})();