(function(){
  const chips = Array.from(document.querySelectorAll('.profile-event-filters .filter-chip'));
  const cards = Array.from(document.querySelectorAll('.profile-events-grid .event-card-block'));
  const counter = document.getElementById('profileEventsCount');
  const empty = document.getElementById('profileEventsEmpty');

  if(!chips.length || !cards.length) return;

  function countFor(type){
    return type === 'all'
      ? cards.length
      : cards.filter(card => card.dataset.eventType === type).length;
  }

  function apply(type){
    let visible = 0;

    cards.forEach(card => {
      const match = type === 'all' || card.dataset.eventType === type;
      card.hidden = !match;
      if(match) visible += 1;
    });

    chips.forEach(chip => {
      const isActive = chip.dataset.filter === type;
      chip.classList.toggle('filter-chip-active', isActive);
      chip.setAttribute('aria-pressed', String(isActive));
    });

    if(counter) counter.textContent = `Всего мероприятий: ${visible}`;
    if(empty) empty.hidden = visible > 0;
  }

  chips.forEach(chip => {
    const count = chip.querySelector('.filter-chip-count');
    const total = countFor(chip.dataset.filter);
    if(count) count.textContent = total;
    chip.classList.toggle('filter-chip-empty', total === 0);
    chip.addEventListener('click', () => apply(chip.dataset.filter));
  });

  apply('all');
})();
