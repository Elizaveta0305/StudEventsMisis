(function(){
  const container = document.getElementById('studentNotices');
  if(!container || !window.StudNotices) return;

  function render(){
    container.innerHTML = '';
    const notices = window.StudNotices.list();

    if(!notices.length){
      const empty = document.createElement('div');
      empty.className = 'notice-empty';
      empty.textContent = 'Пока нет уведомлений от сотрудников';
      container.appendChild(empty);
      return;
    }

    notices.forEach(notice => {
      const item = document.createElement('a');
      item.className = 'notice-item';
      item.href = window.StudNotices.noticeUrl(notice.id);

      const main = document.createElement('div');
      main.className = 'notice-item-main';

      const title = document.createElement('div');
      title.className = 'notice-item-title';
      title.textContent = notice.title;

      if(!window.StudNotices.isSeen(notice.id)){
        const badge = document.createElement('span');
        badge.className = 'notice-item-badge';
        badge.textContent = 'Новое';
        title.appendChild(badge);
      }

      const text = document.createElement('p');
      text.className = 'notice-item-text';
      text.textContent = window.StudNotices.excerpt(notice.text, 140);

      const meta = document.createElement('div');
      meta.className = 'notice-item-meta';
      const parts = [window.StudNotices.formatDate(notice.createdAt)];
      if(notice.files?.length) parts.push(window.StudNotices.filesLabel(notice.files.length));
      meta.textContent = parts.filter(Boolean).join(' · ');

      main.append(title, text, meta);

      const arrow = document.createElement('span');
      arrow.className = 'notice-item-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '→';

      item.append(main, arrow);
      container.appendChild(item);
    });
  }

  render();
})();