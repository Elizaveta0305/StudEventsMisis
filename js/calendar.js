(function(){
  function renderCalendar(container){
    const now = new Date();
    let current = new Date(now.getFullYear(), now.getMonth(), 1);

    function build(){
      container.innerHTML = '';
      const header = document.createElement('div');
      header.className = 'calendar-header';

      const title = document.createElement('div');
      title.className = 'calendar-title';
      title.textContent = current.toLocaleString(undefined, {month: 'long', year: 'numeric'});

      const nav = document.createElement('div');
      nav.className = 'calendar-nav';
      const prev = document.createElement('button'); prev.textContent = '<';
      const next = document.createElement('button'); next.textContent = '>';
      prev.addEventListener('click', ()=>{ current = new Date(current.getFullYear(), current.getMonth()-1,1); build(); });
      next.addEventListener('click', ()=>{ current = new Date(current.getFullYear(), current.getMonth()+1,1); build(); });
      nav.appendChild(prev); nav.appendChild(next);

      header.appendChild(title); header.appendChild(nav);
      container.appendChild(header);

      const grid = document.createElement('div'); grid.className = 'calendar-grid';
      const weekdays = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
      weekdays.forEach(d=>{
        const w = document.createElement('div'); w.className='calendar-weekday'; w.textContent=d; grid.appendChild(w);
      });

      const year = current.getFullYear();
      const month = current.getMonth();
      const firstDay = new Date(year, month, 1);
      const leading = (firstDay.getDay()+6)%7;

      const daysInMonth = new Date(year, month+1, 0).getDate();
      const prevDays = new Date(year, month, 0).getDate();

      for(let i=0;i<leading;i++){
        const d = document.createElement('div'); d.className='calendar-day other-month';
        const dateSpan = document.createElement('div'); dateSpan.className='date';
        dateSpan.textContent = (prevDays - leading + 1 + i);
        d.appendChild(dateSpan);
        grid.appendChild(d);
      }

      for(let d=1; d<=daysInMonth; d++){
        const cell = document.createElement('div'); cell.className='calendar-day';
        const dateSpan = document.createElement('div'); dateSpan.className='date'; dateSpan.textContent = d;
        const today = new Date();
        if(d===today.getDate() && month===today.getMonth() && year===today.getFullYear()){
          cell.classList.add('today');
        }
        cell.appendChild(dateSpan);
        grid.appendChild(cell);
      }

      const totalCells = leading + daysInMonth;
      const trailing = (7 - (totalCells%7))%7;
      for(let i=1;i<=trailing;i++){
        const d = document.createElement('div'); d.className='calendar-day other-month';
        const dateSpan = document.createElement('div'); dateSpan.className='date'; dateSpan.textContent = i;
        d.appendChild(dateSpan);
        grid.appendChild(d);
      }

      container.appendChild(grid);
    }

    build();
  }

  window.initSimpleCalendar = function(selector){
    const el = document.querySelector(selector);
    if(!el) return;
    renderCalendar(el);
  }
})();

document.addEventListener('DOMContentLoaded', function(){ initSimpleCalendar('#simple-calendar'); });