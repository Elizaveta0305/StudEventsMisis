(function(){
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  const typeColors = ['#0643f0', '#10b981', '#f59e0b', '#a855f7'];

  
  function drawBarChart(canvas, labels, values, color = '#0643f0') {
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const ratio = window.devicePixelRatio || 1;
    const width = bounds.width;
    const height = bounds.height;

    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);

    const context = canvas.getContext('2d');
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    const isMobile = width < 480;

    const padding = {
      top: 12,
      right: 8,
      bottom: isMobile ? 30 : 34,
      left: 8
    };

    const maximum = Math.max(...values, 1);
    const axisStep = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500, 1000].find(step => maximum / step <= 5) || Math.ceil(maximum / 5);
    const axisMax = Math.ceil(maximum / axisStep) * axisStep;
    const ticks = [];
    for (let tick = 0; tick <= axisMax; tick += axisStep) ticks.push(tick);

    const axisFont = isMobile ? '10px Raleway, sans-serif' : '11px Raleway, sans-serif';
    context.font = axisFont;
    const axisLabelWidth = Math.max(...ticks.map(tick => context.measureText(String(tick)).width));
    padding.left = Math.ceil(axisLabelWidth) + 14;

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const slotWidth = chartWidth / values.length;
    const barWidth = Math.min(isMobile ? 18 : 26, slotWidth * 0.58);

    context.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    context.lineWidth = 1;
    ticks.forEach(tick => {
      if (!tick) return;
      const tickY = Math.round(padding.top + chartHeight - chartHeight * tick / axisMax) + 0.5;
      context.beginPath();
      context.moveTo(padding.left, tickY);
      context.lineTo(width - padding.right, tickY);
      context.stroke();
    });

    context.fillStyle = '#a0aec0';
    context.font = axisFont;
    context.textAlign = 'right';
    context.textBaseline = 'middle';
    ticks.forEach(tick => {
      context.fillText(String(tick), padding.left - 8, padding.top + chartHeight - chartHeight * tick / axisMax);
    });

    context.beginPath();
    context.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    context.moveTo(padding.left, padding.top);
    context.lineTo(padding.left, padding.top + chartHeight);
    context.lineTo(width - padding.right, padding.top + chartHeight);
    context.stroke();

    values.forEach((value, index) => {
      const barHeight = value
        ? Math.max(3, chartHeight * value / axisMax)
        : 0;

      const x = padding.left + slotWidth * index
        + (slotWidth - barWidth) / 2;

      const y = padding.top + chartHeight - barHeight;

      if (barHeight > 0) {
        context.fillStyle = color;
        context.beginPath();
        context.roundRect(x, y, barWidth, barHeight, [5, 5, 2, 2]);
        context.fill();
      }

      if (isMobile && index % 2 !== 0) return;

      context.fillStyle = '#a0aec0';
      context.font = isMobile
        ? '10px Raleway, sans-serif'
        : '11px Raleway, sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'top';

      if (width < 480 && index % 2 !== 0) {
      return;
        }

      context.fillText(
      labels[index],
      x + barWidth / 2,
      height - padding.bottom + 8
      );
    });
  }

  function drawDonutChart(canvas, values, highlightIndex = -1){
    const bounds = canvas.getBoundingClientRect();
    if(!bounds.width || !bounds.height) return;

    const ratio = window.devicePixelRatio || 1;
    const width = bounds.width;
    const height = bounds.height;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);

    const context = canvas.getContext('2d');
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height);
    const thickness = Math.max(14, size * 0.15);
    const radius = size / 2 - thickness / 2 - 2;
    const total = values.reduce((sum, value) => sum + value, 0) || 1;
    let angle = -Math.PI / 2;

    values.forEach((value, index) => {
      const nextAngle = angle + value / total * Math.PI * 2;
      context.globalAlpha = highlightIndex < 0 || highlightIndex === index ? 1 : 0.2;
      context.beginPath();
      context.arc(centerX, centerY, radius, angle, nextAngle);
      context.strokeStyle = typeColors[index];
      context.lineWidth = thickness;
      context.lineCap = 'butt';
      context.stroke();
      angle = nextAngle;
    });
    context.globalAlpha = 1;
  }

  function initFacultyDashboard(){
    const facultyFilter = document.getElementById('facultyAnalyticsFilter');
    const periodFilter = document.getElementById('periodAnalyticsFilter');
    const activityCanvas = document.getElementById('facultyActivityChart');
    const typesCanvas = document.getElementById('facultyTypesChart');
    const legend = document.getElementById('facultyTypesLegend');
    const typeFilter = document.getElementById('facultyTypeFilter');
    const breakdownList = document.getElementById('facultyBreakdownList');
    const breakdownTotal = document.getElementById('facultyBreakdownTotal');
    const breakdownSubtitle = document.getElementById('facultyBreakdownSubtitle');
    const eventsHint = document.getElementById('facultyEventsHint');
    const legendDot = document.getElementById('facultyChartLegendDot');
    const legendText = document.getElementById('facultyChartLegendText');

    if(!facultyFilter || !periodFilter || !activityCanvas || !typesCanvas || !legend || !typeFilter || !breakdownList) return;

    const eventTypes = [
      { key: 'science', label: 'Научные', color: typeColors[0] },
      { key: 'sport', label: 'Спортивные', color: typeColors[1] },
      { key: 'public', label: 'Общественные', color: typeColors[2] },
      { key: 'creative', label: 'Творческие', color: typeColors[3] }
    ];
    const faculties = ['ФАИТ', 'ИЭФ', 'ФММТ'];
    const facultyData = {
      'ФАИТ': { participations: 330, activeStudents: 148, attendance: 82, types: [16, 9, 12, 7] },
      'ИЭФ': { participations: 292, activeStudents: 203, attendance: 77, types: [14, 7, 10, 6] },
      'ФММТ': { participations: 224, activeStudents: 161, attendance: 74, types: [12, 8, 9, 5] }
    };
    const overall = { participations: 846, activeStudents: 512, attendance: 78 };
    const monthValues = [48, 55, 63, 58, 76, 82, 67, 72, 91, 86, 104, 44];
    const periodMultipliers = { year: 1, semester: 0.58, month: 0.14 };
    const chips = Array.from(typeFilter.querySelectorAll('.faculty-type-chip'));
    let activeType = 'all';

    chips.forEach(chip => {
      const type = eventTypes.find(item => item.key === chip.dataset.type);
      if(type) chip.style.setProperty('--chip-color', type.color);
    });

    const sum = list => list.reduce((total, value) => total + value, 0);
    const scaleCount = (count, multiplier) => Math.max(1, Math.round(count * multiplier));

    function getTypeCounts(scope, multiplier){
      if(scope === 'all'){
        return eventTypes.map((_, index) => sum(faculties.map(name => scaleCount(facultyData[name].types[index], multiplier))));
      }
      return facultyData[scope].types.map(count => scaleCount(count, multiplier));
    }

    function renderLegend(values){
      legend.classList.toggle('has-active', activeType !== 'all');
      legend.innerHTML = eventTypes.map((type, index) => `
        <button type="button" class="faculty-type-legend-item${type.key === activeType ? ' is-active' : ''}" data-type="${type.key}" aria-pressed="${type.key === activeType}"><i style="background:${type.color}"></i><span>${type.label}</span><strong>${values[index]}</strong></button>
      `).join('');
    }

    function renderChips(counts, total){
      chips.forEach(chip => {
        const key = chip.dataset.type;
        const isActive = key === activeType;
        const index = eventTypes.findIndex(type => type.key === key);
        const count = chip.querySelector('em');
        chip.classList.toggle('is-active', isActive);
        chip.setAttribute('aria-pressed', String(isActive));
        if(count) count.textContent = index < 0 ? total : counts[index];
      });
    }

    function renderBreakdown(multiplier, typeIndex, selectedFaculty){
      const rows = faculties.map(name => {
        const counts = getTypeCounts(name, multiplier);
        return { name, counts, value: typeIndex < 0 ? sum(counts) : counts[typeIndex] };
      });
      const maxValue = Math.max(...rows.map(row => row.value), 1);
      const total = sum(rows.map(row => row.value));

      breakdownList.classList.toggle('has-selection', selectedFaculty !== 'all');
      breakdownList.innerHTML = rows.map(row => {
        const segments = typeIndex < 0
          ? row.counts.map((count, index) => ({ count, type: eventTypes[index] }))
          : [{ count: row.value, type: eventTypes[typeIndex] }];
        const track = segments.map(segment => `<i style="width:${segment.count / maxValue * 100}%;background:${segment.type.color}" title="${segment.type.label}: ${segment.count}"></i>`).join('');
        const share = total ? Math.round(row.value / total * 100) : 0;
        return `
          <div class="faculty-breakdown-row${row.name === selectedFaculty ? ' is-selected' : ''}">
            <span class="faculty-breakdown-name">${row.name}</span>
            <span class="faculty-breakdown-track">${track}</span>
            <strong>${row.value}</strong>
            <small>${share}%</small>
          </div>
        `;
      }).join('');

      breakdownTotal.textContent = total;
      if(breakdownSubtitle){
        breakdownSubtitle.textContent = typeIndex < 0
          ? 'Состав по типам за выбранный период'
          : `${eventTypes[typeIndex].label} по всем факультетам`;
      }
    }

    function setActiveType(key){
      activeType = key;
      update();
    }

    function update(){
      const multiplier = periodMultipliers[periodFilter.value] || 1;
      const scope = facultyData[facultyFilter.value] ? facultyFilter.value : 'all';
      const base = scope === 'all' ? overall : facultyData[scope];
      const counts = getTypeCounts(scope, multiplier);
      const total = sum(counts);
      const typeIndex = eventTypes.findIndex(type => type.key === activeType);
      const activeInfo = eventTypes[typeIndex];
      const eventsValue = activeInfo ? counts[typeIndex] : total;
      const share = total ? eventsValue / total : 0;

      document.getElementById('facultyEventsValue').textContent = eventsValue;
      document.getElementById('facultyParticipationValue').textContent = Math.round(base.participations * multiplier * share);
      document.getElementById('facultyActiveValue').textContent = Math.round(base.activeStudents * multiplier * share);
      document.getElementById('facultyAttendanceValue').textContent = `${base.attendance}%`;
      document.getElementById('facultyTypesTotal').textContent = eventsValue;
      if(eventsHint) eventsHint.textContent = activeInfo ? `${activeInfo.label} · за выбранный период` : 'за выбранный период';

      renderChips(counts, total);
      renderLegend(counts);
      drawDonutChart(typesCanvas, counts, typeIndex);
      renderBreakdown(multiplier, typeIndex, scope);

      const participationRatio = base.participations / overall.participations;
      const barColor = activeInfo ? activeInfo.color : typeColors[0];
      if(legendDot) legendDot.style.background = barColor;
      if(legendText) legendText.textContent = activeInfo ? `Участия · ${activeInfo.label}` : 'Участия';
      drawBarChart(activityCanvas, months, monthValues.map(value => Math.round(value * participationRatio * multiplier * share)), barColor);
    }

    typeFilter.addEventListener('click', event => {
      const chip = event.target.closest('.faculty-type-chip');
      if(chip) setActiveType(chip.dataset.type);
    });
    legend.addEventListener('click', event => {
      const item = event.target.closest('.faculty-type-legend-item');
      if(item) setActiveType(item.dataset.type === activeType ? 'all' : item.dataset.type);
    });
    facultyFilter.addEventListener('change', update);
    periodFilter.addEventListener('change', update);
    window.addEventListener('resize', update);
    update();
  }

  function initStudentDashboard(){
    const activityCanvas = document.getElementById('studentActivityChart');
    const typesCanvas = document.getElementById('studentTypesChart');
    const period = document.getElementById('studentAnalyticsPeriod');

    if(!activityCanvas || !typesCanvas || !period) return;

    const periodData = {
      year: { participations: 8, attended: 6, upcoming: 5, types: [3, 1, 2, 1, 1], months: [1, 0, 1, 1, 2, 0, 1, 0, 1, 0, 0, 1] },
      all: { participations: 12, attended: 9, upcoming: 5, types: [5, 2, 3, 1, 1], months: [1, 0, 2, 1, 2, 0, 1, 0, 2, 1, 1, 1] }
    };

    function update(){
      const data = periodData[period.value] || periodData.year;
      document.getElementById('studentParticipationValue').textContent = data.participations;
      document.getElementById('studentAttendedValue').textContent = data.attended;
      document.getElementById('studentUpcomingValue').textContent = data.upcoming;
      document.getElementById('studentAttendanceValue').textContent = `${Math.round(data.attended / data.participations * 100)}%`;
      document.getElementById('studentTypesTotal').textContent = data.participations;

      document.querySelectorAll('[data-student-type-count]').forEach((count, index) => {
        count.textContent = data.types[index];
      });

      drawBarChart(activityCanvas, months, data.months);
      drawDonutChart(typesCanvas, data.types);
    }

    period.addEventListener('change', update);
    window.addEventListener('resize', update);
    update();
  }

  initFacultyDashboard();
  initStudentDashboard();
})();