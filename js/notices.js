(function(){
  const noticesKey = 'studEvents.notices.v1';
  const seenKey = 'studEvents.notices.seen.v1';

  function readJson(key){
    try{
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? value : [];
    }catch{
      return [];
    }
  }

  function writeJson(key, value){
    try{
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    }catch{
      return false;
    }
  }

  function list(){
    return readJson(noticesKey).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }

  function get(id){
    return list().find(notice => notice.id === id) || null;
  }

  function add(notice){
    const notices = readJson(noticesKey);
    const saved = {
      ...notice,
      id: `notice-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString()
    };
    notices.push(saved);
    if(!writeJson(noticesKey, notices)) return null;
    return saved;
  }

  function remove(id){
    const notices = readJson(noticesKey).filter(notice => notice.id !== id);
    writeJson(seenKey, readJson(seenKey).filter(seenId => seenId !== id));
    return writeJson(noticesKey, notices);
  }

  function isSeen(id){
    return readJson(seenKey).includes(id);
  }

  function markSeen(id){
    const seen = readJson(seenKey);
    if(seen.includes(id)) return;
    seen.push(id);
    writeJson(seenKey, seen);
  }

  function unseen(){
    return list().filter(notice => !isSeen(notice.id));
  }

  function formatDate(iso){
    const date = new Date(iso);
    if(Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  }

  function noticeUrl(id){
    return `./notice.php?id=${encodeURIComponent(id)}`;
  }

  function filesLabel(count){
    const mod10 = count % 10;
    const mod100 = count % 100;
    if(mod10 === 1 && mod100 !== 11) return `${count} файл`;
    if(mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} файла`;
    return `${count} файлов`;
  }

  function excerpt(text, limit = 160){
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    return clean.length > limit ? `${clean.slice(0, limit).trimEnd()}…` : clean;
  }

  window.StudNotices = { list, get, add, remove, isSeen, markSeen, unseen, formatDate, noticeUrl, filesLabel, excerpt };

  function showStudentPopup(){
    if(!window.StudAuth || window.StudAuth.role !== 'student') return;
    if(!window.StudAuth.can('notice_view') || !window.StudDialog) return;
    if(document.body.dataset.noNoticePopup === 'true') return;

    const pending = unseen();
    if(!pending.length) return;

    const notice = pending[0];
    const body = document.createElement('div');

    const kicker = document.createElement('span');
    kicker.className = 'stud-dialog-kicker';
    kicker.textContent = 'Новое уведомление';

    const heading = document.createElement('strong');
    heading.textContent = notice.title;
    heading.style.display = 'block';
    heading.style.color = 'var(--color-text)';
    heading.style.marginBottom = '8px';

    const text = document.createElement('p');
    text.className = 'stud-dialog-excerpt';
    text.textContent = excerpt(notice.text);

    const meta = document.createElement('span');
    meta.className = 'stud-dialog-meta';
    const parts = [formatDate(notice.createdAt)];
    if(notice.files?.length) parts.push(`Вложения: ${filesLabel(notice.files.length)}`);
    if(pending.length > 1) parts.push(`Ещё новых: ${pending.length - 1}`);
    meta.textContent = parts.filter(Boolean).join(' · ');

    body.append(kicker, heading, text, meta);

    window.StudDialog.open({
      title: 'Сообщение от сотрудника',
      body,
      tone: 'neutral',
      actions: [
        { label: 'Закрыть', value: 'close', variant: 'secondary' },
        { label: 'Перейти', value: 'open', variant: 'primary' }
      ]
    }).then(result => {
      markSeen(notice.id);
      if(result === 'open') window.location.href = noticeUrl(notice.id);
    });
  }

  document.addEventListener('DOMContentLoaded', () => window.setTimeout(showStudentPopup, 400));
})();