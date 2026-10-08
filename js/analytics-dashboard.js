(function(){
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  const typeColors = ['#0643f0', '#10b981', '#f59e0b', '#a855f7', '#ef4444'];

  function drawBarChart(canvas, labels, values){
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

    const padding = { top: 12, right: 8, bottom: 28, left: 8 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maximum = Math.max(...values, 1);
    const slotWidth = chartWidth / values.length;
    const barWidth = Math.min(26, slotWidth * 0.58);

    context.font = '11px Raleway, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'top';

    values.forEach((value, index) => {
      const barHeight = value ? Math.max(3, chartHeight * value / maximum) : 0;
      const x = padding.left + slotWidth * index + (slotWidth - barWidth) / 2;
      const y = padding.top + chartHeight - barHeight;

      if(barHeight){
        context.fillStyle = '#0643f0';
        context.beginPath();
        context.roundRect(x, y, barWidth, barHeight, [5, 5, 2, 2]);
        context.fill();
      }

      context.fillStyle = '#788397';
      context.fillText(labels[index], x + barWidth / 2, height - padding.bottom + 8);
    });
  }

  function drawDonutChart(canvas, values){
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
    const radius = Math.min(width, height) * 0.42;
    const thickness = Math.max(12, radius * 0.28);
    const total = values.reduce((sum, value) => sum + value, 0) || 1;
    let angle = -Math.PI / 2;

    values.forEach((value, index) => {
      const nextAngle = angle + value / total * Math.PI * 2;
      context.beginPath();
      context.arc(centerX, centerY, radius, angle, nextAngle);
      context.strokeStyle = typeColors[index];
      context.lineWidth = thickness;
      context.lineCap = 'butt';
      context.stroke();
      angle = nextAngle;
    });
  }

  function initFacultyDashboard(){
    const facultyFilter = document.getElementById('facultyAnalyticsFilter');
    const periodFilter = document.getElementById('periodAnalyticsFilter');
    const activityCanvas = document.getElementById('facultyActivityChart');
    const typesCanvas = document.getElementById('facultyTypesChart');
    const legend = document.getElementById('facultyTypesLegend');

    if(!facultyFilter || !periodFilter || !activityCanvas || !typesCanvas || !legend) return;

    const eventTypes = [
      { label: 'Научные', color: typeColors[0] },
      { label: 'Спортивные', color: typeColors[1] },
      { label: 'Общественные', color: typeColors[2] },
      { label: 'Творческие', color: typeColors[3] },
      { label: 'Городские', color: typeColors[4] }
    ];
    const facultyData = {
      all: { participations: 846, activeStudents: 512, attendance: 78, types: [42, 24, 31, 18, 13] },
      'ФАИТ': { participations: 330, activeStudents: 148, attendance: 82, types: [16, 9, 12, 7, 5] },
      'ИЭФ': { participations: 292, activeStudents: 203, attendance: 77, types: [14, 7, 10, 6, 6] },
      'ФММТ': { participations: 224, activeStudents: 161, attendance: 74, types: [12, 8, 9, 5, 2] }
    };
    const monthValues = [48, 55, 63, 58, 76, 82, 67, 72, 91, 86, 104, 44];
    const periodMultipliers = { year: 1, semester: 0.58, month: 0.14 };

    function renderLegend(values){
      legend.innerHTML = eventTypes.map((type, index) => `
        <div class="faculty-type-legend-item"><i style="background:${type.color}"></i><span>${type.label}</span><strong>${values[index]}</strong></div>
      `).join('');
    }

    function update(){
      const multiplier = periodMultipliers[periodFilter.value] || 1;
      const data = facultyData[facultyFilter.value] || facultyData.all;
      const currentTypes = data.types.map(count => Math.max(1, Math.round(count * multiplier)));
      const eventTotal = currentTypes.reduce((sum, count) => sum + count, 0);

      document.getElementById('facultyEventsValue').textContent = eventTotal;
      document.getElementById('facultyParticipationValue').textContent = Math.round(data.participations * multiplier);
      document.getElementById('facultyActiveValue').textContent = Math.round(data.activeStudents * multiplier);
      document.getElementById('facultyAttendanceValue').textContent = `${data.attendance}%`;
      document.getElementById('facultyTypesTotal').textContent = eventTotal;

      renderLegend(currentTypes);
      drawDonutChart(typesCanvas, currentTypes);

      const participationRatio = data.participations / facultyData.all.participations;
      drawBarChart(activityCanvas, months, monthValues.map(value => Math.round(value * participationRatio * multiplier)));
    }

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