(function(){
  const students = [
    {
      id: 1,
      name: 'Алексей Петров',
      faculty: 'ФАИТ',
      group: 'АТ-24',
      email: 'alexey.petrov@example.com',
      activity: 82,
      events: 5,
      attendance: 76,
      avgScore: 4.7,
      groupSize: 28,
      groupActive: 20,
      status: 'Активен',
      records: [
        { title: 'Городская олимпиада', type: 'Научное', date: '12.05.2026', role: 'Участник' },
        { title: 'День открытых дверей', type: 'Общественное', date: '18.04.2026', role: 'Организатор' },
        { title: 'Мастер-класс по ИИ', type: 'Научное', date: '30.03.2026', role: 'Участник' }
      ]
    },
    {
      id: 2,
      name: 'Марина Иванова',
      faculty: 'ИЭФ',
      group: 'МТ-21',
      email: 'marina.ivanova@example.com',
      activity: 68,
      events: 4,
      attendance: 71,
      avgScore: 4.5,
      groupSize: 26,
      groupActive: 18,
      status: 'Активен',
      records: [
        { title: 'Конкурс научных проектов', type: 'Научное', date: '07.05.2026', role: 'Участник' },
        { title: 'Международный форум', type: 'Общественное', date: '21.04.2026', role: 'Участник' },
        { title: 'Встреча с экспертами', type: 'Научное', date: '15.03.2026', role: 'Волонтёр' }
      ]
    },
    {
      id: 3,
      name: 'Дмитрий Смирнов',
      faculty: 'ФММТ',
      group: 'Э-22',
      email: 'dmitry.smirnov@example.com',
      activity: 54,
      events: 3,
      attendance: 49,
      avgScore: 4.1,
      groupSize: 31,
      groupActive: 15,
      status: 'Под наблюдением',
      records: [
        { title: 'День студента', type: 'Общественное', date: '10.05.2026', role: 'Участник' },
        { title: 'Инженерная конференция', type: 'Научное', date: '02.04.2026', role: 'Участник' }
      ]
    },
    {
      id: 4,
      name: 'Екатерина Белова',
      faculty: 'ФАИТ',
      group: 'ИП-23',
      email: 'ekaterina.belova@example.com',
      activity: 89,
      events: 6,
      attendance: 92,
      avgScore: 4.9,
      groupSize: 24,
      groupActive: 22,
      status: 'Активен',
      records: [
        { title: 'Марафон программирования', type: 'Научное', date: '27.05.2026', role: 'Участник' },
        { title: 'Ресурсный день', type: 'Общественное', date: '14.04.2026', role: 'Организатор' },
        { title: 'Семинар по дизайну', type: 'Общественное', date: '18.03.2026', role: 'Участник' },
        { title: 'Конкурс стартапов', type: 'Научное', date: '25.02.2026', role: 'Участник' }
      ]
    },
    {
      id: 5,
      name: 'Иван Кузнецов',
      faculty: 'ИЭФ',
      group: 'Э-23',
      email: 'ivan.kuznetsov@example.com',
      activity: 63,
      events: 2,
      attendance: 58,
      avgScore: 4.3,
      groupSize: 30,
      groupActive: 17,
      status: 'Активен',
      records: [
        { title: 'Выставка проектов', type: 'Научное', date: '11.05.2026', role: 'Участник' },
        { title: 'Кейс-чемпионат', type: 'Научное', date: '08.03.2026', role: 'Участник' }
      ]
    },
    {
      id: 6,
      name: 'София Лебедева',
      faculty: 'ИЭФ',
      group: 'МТ-22',
      email: 'sofia.lebedeva@example.com',
      activity: 77,
      events: 5,
      attendance: 86,
      avgScore: 4.8,
      groupSize: 27,
      groupActive: 23,
      status: 'Активен',
      records: [
        { title: 'Школа лидеров', type: 'Общественное', date: '19.05.2026', role: 'Участник' },
        { title: 'Научный семинар', type: 'Научное', date: '28.04.2026', role: 'Участник' },
        { title: 'Командный проект', type: 'Научное', date: '13.03.2026', role: 'Руководитель' }
      ]
    }
  ];

  const studentSearch = document.getElementById('studentSearch');
  const facultyFilter = document.getElementById('facultyFilter');
  const studentDetails = document.getElementById('studentDetails');

  let currentStudent = null;
  let currentFilters = {
    year: 'all',
    month: 'all',
    eventQuery: ''
  };

  const eventTypeLabels = [
    { key: 'Научное', label: 'Научные', color: '#0643F0' },
    { key: 'Спортивное', label: 'Спортивные', color: '#10b981' },
    { key: 'Общественное', label: 'Общественные', color: '#f59e0b' },
    { key: 'Творческое', label: 'Творческие', color: '#a855f7' },
    { key: 'Городское', label: 'Городские', color: '#ef4444' }
  ];

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  function parseRecordDate(dateText) {
    const [day, month, year] = dateText.split('.');
    return {
      day: Number(day),
      month: Number(month),
      year: Number(year)
    };
  }

  function getFaculties() {
    return [...new Set(students.map(student => student.faculty))];
  }

  function renderFacultyOptions() {
    const faculties = getFaculties();
    faculties.forEach(faculty => {
      const option = document.createElement('option');
      option.value = faculty;
      option.textContent = faculty;
      facultyFilter.appendChild(option);
    });
  }

  function getFilteredStudents() {
    const search = studentSearch.value.trim().toLowerCase();
    const selectedFaculty = facultyFilter.value;

    return students.filter(student => {
      const matchesSearch = !search ||
        student.name.toLowerCase().includes(search) ||
        student.group.toLowerCase().includes(search) ||
        student.faculty.toLowerCase().includes(search);

      const matchesFaculty = selectedFaculty === 'all' || student.faculty === selectedFaculty;

      return matchesSearch && matchesFaculty;
    });
  }

  function getAvailableYears(records) {
    return [...new Set(records.map(record => parseRecordDate(record.date).year))].sort((a, b) => b - a);
  }

  function getAvailableMonths(records, year = 'all') {
    const recordsForYear = year === 'all'
      ? records
      : records.filter(record => parseRecordDate(record.date).year === Number(year));

    return [...new Set(recordsForYear.map(record => parseRecordDate(record.date).month))].sort((a, b) => a - b);
  }

  function getFilteredRecords(records, query = '', year = 'all', month = 'all') {
    const search = query.trim().toLowerCase();

    return records.filter(record => {
      const { year: recordYear, month: recordMonth } = parseRecordDate(record.date);
      const matchesYear = year === 'all' || recordYear === Number(year);
      const matchesMonth = month === 'all' || recordMonth === Number(month);
      const matchesSearch = !search || [record.title, record.type, record.role].join(' ').toLowerCase().includes(search);

      return matchesYear && matchesMonth && matchesSearch;
    });
  }

  function buildMonthDistribution(records, year = 'all') {
    const recordsForYear = year === 'all'
      ? records
      : records.filter(record => parseRecordDate(record.date).year === Number(year));

    return Array.from({ length: 12 }, (_, index) => {
      const monthNumber = index + 1;
      return {
        month: monthNumber,
        label: monthNames[index],
        value: recordsForYear.filter(record => parseRecordDate(record.date).month === monthNumber).length
      };
    });
  }

  function updateEventTable(student, filters) {
    const tbody = document.querySelector('.events-table tbody');
    const eventCount = document.getElementById('eventCount');
    const filteredRecords = getFilteredRecords(student.records, filters.eventQuery, filters.year, filters.month);

    if (!tbody || !eventCount) {
      return;
    }

    eventCount.textContent = `Всего мероприятий: ${filteredRecords.length}`;

    if (!filteredRecords.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4">
            <div class="empty-state">Ничего не найдено по заданным фильтрам</div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filteredRecords.map(record => `
      <tr>
        <td>${record.title}</td>
        <td><span class="event-pill">${record.type}</span></td>
        <td>${record.date}</td>
        <td>${record.role}</td>
      </tr>
    `).join('');
  }

  function renderStudentDetails(student, filters = {}) {
    currentStudent = student;
    currentFilters = {
      ...currentFilters,
      ...filters
    };

    const filteredRecords = getFilteredRecords(student.records, currentFilters.eventQuery, currentFilters.year, currentFilters.month);
    const yearRecords = currentFilters.year === 'all'
      ? student.records
      : student.records.filter(record => parseRecordDate(record.date).year === Number(currentFilters.year));

    studentDetails.innerHTML = `
      <div class="student-header">
        <div class="student-profile">
          <div class="student-avatar">${student.name.charAt(0)}</div>
          <div>
            <div class="student-name">${student.name}</div>
          </div>
        </div>
      </div>

      <div class="student-info-grid">
        <div class="info-card">
          <label>Факультет</label>
          <strong>${student.faculty}</strong>
        </div>
        <div class="info-card">
          <label>Группа</label>
          <strong>${student.group}</strong>
        </div>
        <div class="info-card">
          <label>Средний балл</label>
          <strong>${student.avgScore.toFixed(1)}</strong>
        </div>
        <div class="info-card">
          <label>Участие</label>
          <strong>${student.attendance}%</strong>
        </div>
      </div>

      <div class="analytics-grid">
        <div class="chart-card wide">
          <div class="section-top">
            <h3>Активность по месяцам</h3>
          </div>
          <div class="chart-box">
            <canvas id="activityChart"></canvas>
          </div>
        </div>

        <div class="chart-card types-card">
          <div class="types-card-content">
            <div class="types-visual">
              <h3>Типы мероприятий</h3>
              <div class="donut-box">
                <canvas id="eventChart"></canvas>
              </div>
            </div>
            <div class="event-types-grid single-column">
              ${eventTypeLabels.map(({ key, label, color }) => {
                const count = filteredRecords.filter(record => record.type === key).length;
                return `
                  <div class="event-type-item">
                    <div class="event-type-header">
                      <span class="event-type-dot" style="background:${color}"></span>
                      <span>${label}</span>
                    </div>
                    <strong>${count}</strong>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <div class="events-table-header">
          <h3>Участие в мероприятиях</h3>
          <span id="eventCount" class="event-count">Всего мероприятий: ${filteredRecords.length}</span>
        </div>

        <div class="event-search">
          <input id="eventSearch" type="text" value="${currentFilters.eventQuery}" placeholder="Поиск по названию, типу или роли">
        </div>

        <div class="events-table-wrap">
          <table class="events-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Тип</th>
                <th>Дата</th>
                <th>Роль</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRecords.length ? filteredRecords.map(record => `
                <tr>
                  <td>${record.title}</td>
                  <td><span class="event-pill">${record.type}</span></td>
                  <td>${record.date}</td>
                  <td>${record.role}</td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="4">
                    <div class="empty-state">Ничего не найдено по заданным фильтрам</div>
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;

    const eventSearchInput = document.getElementById('eventSearch');

    if (eventSearchInput) {
      const currentValue = currentFilters.eventQuery;
      eventSearchInput.value = currentValue;

      eventSearchInput.addEventListener('input', (event) => {
        currentFilters.eventQuery = event.target.value;
        updateEventTable(student, currentFilters);
      });
    }

    renderCharts(student, yearRecords, currentFilters.year);
  }

  function renderCharts(student, records, activeYear) {
    const activityCtx = document.getElementById('activityChart');
    const eventCtx = document.getElementById('eventChart');

    if (activityCtx) {
      const labels = buildMonthDistribution(records, activeYear).map(item => item.label.slice(0, 3));
      const values = buildMonthDistribution(records, activeYear).map(item => item.value);
      drawBarChart(activityCtx, labels, values, '#0643F0');
    }

    if (eventCtx) {
      const filteredRecords = getFilteredRecords(student.records, currentFilters.eventQuery, currentFilters.year, currentFilters.month);
      const typeCounts = eventTypeLabels.map(({ key }) => filteredRecords.filter(record => record.type === key).length);
      drawDoughnutChart(eventCtx, typeCounts, eventTypeLabels.map(item => item.color));
    }
  }

  function drawBarChart(canvas, labels, values, color) {
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || 740;
    const height = canvas.clientHeight || 180;

    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);

    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    const padding = 24;
    const chartHeight = height - padding * 2;
    const chartWidth = width - padding * 2;
    const max = Math.max(...values, 1);

    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    const barWidth = chartWidth / values.length * 0.58;

    values.forEach((value, index) => {
      const x = padding + index * (chartWidth / values.length) + 18;
      const barHeight = (value / max) * chartHeight;
      const y = height - padding - barHeight;

      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.fillStyle = '#475569';
      ctx.font = '12px Raleway';
      ctx.textAlign = 'center';
      ctx.fillText(labels[index], x + barWidth / 2, height - 8);
    });
  }

  function drawDoughnutChart(canvas, values, colors) {
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || 420;
    const height = canvas.clientHeight || 300;

    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);

    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.36;
    const total = values.reduce((sum, value) => sum + value, 0) || 1;

    let startAngle = -Math.PI / 2;

    values.forEach((value, index) => {
      if (!value) {
        return;
      }

      const sliceAngle = (value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index];
      ctx.fill();
      startAngle += sliceAngle;
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.52, 0, Math.PI * 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();

    ctx.fillStyle = '#111827';
    ctx.font = '700 16px Raleway';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(values.reduce((sum, value) => sum + value, 0)), centerX, centerY);
  }

  function applySearch() {
    const filtered = getFilteredStudents();

    if (!filtered.length) {
      currentStudent = null;
      studentDetails.innerHTML = '<div class="empty-state">Ничего не найдено по заданным фильтрам</div>';
      return;
    }

    const firstFilteredStudent = filtered[0];
    const isSameStudent = currentStudent && firstFilteredStudent.id === currentStudent.id;

    if (isSameStudent) {
      return;
    }

    const activeElement = document.activeElement;
    renderStudentDetails(firstFilteredStudent, currentFilters);

    if (activeElement && activeElement.id === 'studentSearch') {
      studentSearch.focus();
      studentSearch.setSelectionRange(studentSearch.value.length, studentSearch.value.length);
    }
  }

  function init() {
    renderFacultyOptions();
    applySearch();

    studentSearch.addEventListener('input', applySearch);
    facultyFilter.addEventListener('change', applySearch);
  }

  init();
})();
