<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Личный кабинет</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/pages/profile.css?v=7">
    <link rel="stylesheet" href="../css/components/custom-select.css?v=3">
    <link rel="icon" type="image/x-icon" href="../assets/logo/favicon.svg">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    <div class="container">
        <main class="profile-page">
            <div class="title-events-row">
                <div class="title-events">Личный кабинет</div>
                <div class="profile-badge">Студент</div>
            </div>
            <div class="profile-overview">
                <section class="profile-card">
                    <div class="profile-card-header">
                        <div class="profile-avatar">Е</div>
                        <div>
                            <div class="profile-name">Елизавета Розенко</div>
                            <div class="profile-subtitle">ФАИТ · Группа ИТ-23</div>
                        </div>
                    </div>
                    <div class="profile-info-grid">
                        <div class="profile-info-item">
                            <span>Студенческий билет</span>
                            <strong>123456</strong>
                        </div>
                        <div class="profile-info-item">
                            <span>Email</span>
                            <strong>emr032005@mail.ru</strong>
                        </div>
                        <div class="profile-info-item">
                            <span>Факультет</span>
                            <strong>ФАИТ</strong>
                        </div>
                        <div class="profile-info-item">
                            <span>Телефон</span>
                            <strong>+7 (960) 621-76-28</strong>
                        </div>
                    </div>
                </section>
                <aside class="profile-aside">
                    <div class="profile-actions">
                        <div class="profile-action-card">
                            <div class="profile-action-title">Мои мероприятия</div>
                            <div class="profile-action-value">12</div>
                        </div>
                        <div class="profile-action-card">
                            <div class="profile-action-title">Предстоящие</div>
                            <div class="profile-action-value">5</div>
                        </div>
                    </div>
                    <div class="profile-quick-links">
                        <a href="../pages/calendar.php" class="profile-link">Посмотреть календарь</a>
                        <a href="#" class="profile-link profile-link-secondary">Редактировать профиль</a>
                    </div>
                </aside>
            </div>
            <section class="student-analytics" id="studentAnalytics" aria-labelledby="studentAnalyticsTitle">
                <div class="student-analytics-heading">
                    <div>
                        <p class="student-analytics-eyebrow">МОЯ АКТИВНОСТЬ</p>
                        <h2 id="studentAnalyticsTitle">Аналитика мероприятий</h2>
                    </div>
                    <label class="student-analytics-period">
                        <span>Период</span>
                        <select id="studentAnalyticsPeriod">
                            <option value="year">2026 год</option>
                            <option value="all">За всё время</option>
                        </select>
                    </label>
                </div>
                <div class="student-analytics-kpis">
                    <article class="student-analytics-kpi">
                        <span>Всего участий</span>
                        <strong id="studentParticipationValue">8</strong>
                        <small>за выбранный период</small>
                    </article>
                    <article class="student-analytics-kpi">
                        <span>Посещено</span>
                        <strong id="studentAttendedValue">6</strong>
                        <small>из всех регистраций</small>
                    </article>
                    <article class="student-analytics-kpi">
                        <span>Предстоит</span>
                        <strong id="studentUpcomingValue">5</strong>
                        <small>ближайшие мероприятия</small>
                    </article>
                    <article class="student-analytics-kpi student-analytics-kpi-highlight">
                        <span>Посещаемость</span>
                        <strong id="studentAttendanceValue">75%</strong>
                        <small>от зарегистрированных</small>
                    </article>
                </div>
                <div class="student-analytics-charts">
                    <article class="student-analytics-panel student-activity-panel">
                        <div class="student-analytics-panel-heading">
                            <div>
                                <h3>Моя активность</h3>
                                <p>Участия по месяцам</p>
                            </div>
                        </div>
                        <div class="student-activity-chart-wrap">
                            <canvas id="studentActivityChart" aria-label="Моя активность по месяцам"></canvas>
                        </div>
                    </article>
                    <article class="student-analytics-panel student-types-panel">
                        <div class="student-analytics-panel-heading">
                            <div>
                                <h3>Типы мероприятий</h3>
                                <p>Распределение моих участий</p>
                            </div>
                        </div>
                        <div class="student-types-content">
                            <div class="student-donut-wrap">
                                <canvas id="studentTypesChart" aria-label="Мои участия по типам мероприятий"></canvas>
                                <strong id="studentTypesTotal">8</strong>
                            </div>
                            <div class="student-types-legend">
                                <div><i class="student-type-science"></i><span>Научные</span><strong data-student-type-count="0">3</strong></div>
                                <div><i class="student-type-sport"></i><span>Спортивные</span><strong data-student-type-count="1">1</strong></div>
                                <div><i class="student-type-public"></i><span>Общественные</span><strong data-student-type-count="2">2</strong></div>
                                <div><i class="student-type-creative"></i><span>Творческие</span><strong data-student-type-count="3">1</strong></div>
                                <div><i class="student-type-city"></i><span>Городские</span><strong data-student-type-count="4">1</strong></div>
                            </div>
                        </div>
                    </article>
                </div>
            </section>
            <section class="profile-events">
                <div class="profile-events-header">
                    <div>
                        <div class="profile-events-title">Мероприятия</div>
                        <div class="profile-events-count">Всего мероприятий: 3</div>
                    </div>
                    <div class="profile-events-note">Вы можете открыть карточку, прочитать описание и скачать служебную записку.</div>
                </div>
                <div class="profile-event-filters">
                    <button type="button" class="filter-chip filter-chip-active">Все</button>
                    <button type="button" class="filter-chip">Спортивные</button>
                    <button type="button" class="filter-chip">Научные</button>
                    <button type="button" class="filter-chip">Общественные</button>
                </div>
                <div class="profile-events-grid">
                    <article class="event-card-block">
                        <div class="event-card-meta">
                            <div class="event-card-date">12 авг · 14:00</div>
                            <div class="event-card-type">Научное</div>
                        </div>
                        <div class="event-card-title">Хахакмекфест 2027</div>
                        <p class="event-card-description">Хакатон для студентов и школьников.</p>
                        <div class="event-card-footer">
                            <a href="#" class="event-card-link">Подробнее</a>
                            <a href="#" class="event-card-download"><span class="download-icon"><img src="../assets/ui/download.svg" alt="Скачать"></span>Скачать</a>
                        </div>
                    </article>
                    <article class="event-card-block">
                        <div class="event-card-meta">
                            <div class="event-card-date">1 сен · 10:00</div>
                            <div class="event-card-type">Общественное</div>
                        </div>
                        <div class="event-card-title">День открытых дверей</div>
                        <p class="event-card-description">Линейка на территории университета.</p>
                        <div class="event-card-footer">
                            <a href="#" class="event-card-link">Подробнее</a>
                            <a href="#" class="event-card-download"><span class="download-icon"><img src="../assets/ui/download.svg" alt="Скачать"></span>Скачать</a>
                        </div>
                    </article>
                    <article class="event-card-block">
                        <div class="event-card-meta">
                            <div class="event-card-date">25 авг · 16:30</div>
                            <div class="event-card-type">Городское</div>
                        </div>
                        <div class="event-card-title">Погружение 2026</div>
                        <p class="event-card-description">Мероприятие для сплочения студентов.</p>
                        <div class="event-card-footer">
                            <a href="#" class="event-card-link">Подробнее</a>
                            <a href="#" class="event-card-download"><span class="download-icon"><img src="../assets/ui/download.svg" alt="Скачать"></span>Скачать</a>
                        </div>
                    </article>
                </div>
            </section>
        </main>
    </div>
    <?php include '../includes/footer.php'; ?>
    <script src="../js/calendar.js"></script>
    <script src="../js/analytics-dashboard.js?v=1"></script>
    <script src="../js/custom-select.js?v=3"></script>
</body>
</html>
