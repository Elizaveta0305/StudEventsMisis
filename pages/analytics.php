<?php
require_once '../includes/auth.php';
stud_require('analytics');
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Аналитика мероприятий</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css?v=4">
    <link rel="stylesheet" href="../css/pages/analytics.css?v=11">
    <link rel="stylesheet" href="../css/components/custom-select.css?v=3">
    <link rel="icon" type="image/x-icon" href="../assets/logo/favicon.svg">
</head>
<body>
    <?php include '../includes/header.php'; ?>

    <div class="container">
        <main class="employee-page">
            <div class="employee-header">
                <h1 class="employee-title">Аналитика мероприятий</h1>
            </div>

            <section class="employee-controls" aria-label="Поиск студента">
                <div class="search-field student-search-field">
                    <label for="studentSearch">Студент</label>
                    <div class="student-search-wrap">
                        <input id="studentSearch" type="search" placeholder="Введите имя студента" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="studentSuggestions" aria-autocomplete="list">
                        <div id="studentSuggestions" class="student-suggestions" role="listbox" hidden></div>
                    </div>
                </div>
                <label class="select-field">
                    <span>Факультет</span>
                    <select id="facultyFilter">
                        <option value="all">Все факультеты</option>
                    </select>
                </label>
            </section>

            <section class="employee-panel" aria-label="Аналитика выбранного студента">
                <div id="studentDetails" class="student-details"></div>
            </section>

            <section class="faculty-analytics-page" aria-labelledby="facultyAnalyticsTitle">
                <div class="faculty-analytics-heading">
                    <div>
                        <p class="faculty-analytics-eyebrow">ОБЩАЯ СТАТИСТИКА</p>
                        <h2 id="facultyAnalyticsTitle">Статистика факультета</h2>
                    </div>
                    <div class="faculty-analytics-heading-meta">
                        <label class="faculty-analytics-faculty-control">
                            <span>Факультет</span>
                            <select id="facultyAnalyticsFilter">
                                <option value="all">Все факультеты</option>
                                <option value="ФАИТ">ФАИТ</option>
                                <option value="ИЭФ">ИЭФ</option>
                                <option value="ФММТ">ФММТ</option>
                            </select>
                        </label>
                        <label class="faculty-analytics-period-control">
                            <span>Период</span>
                            <select id="periodAnalyticsFilter">
                                <option value="year">Текущий год</option>
                                <option value="semester">Текущий семестр</option>
                                <option value="month">Последние 30 дней</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div class="faculty-type-filter" id="facultyTypeFilter" role="group" aria-label="Тип мероприятий">
                    <button type="button" class="faculty-type-chip is-active" data-type="all" aria-pressed="true">Все типы<em></em></button>
                    <button type="button" class="faculty-type-chip" data-type="science" aria-pressed="false"><i></i>Научные<em></em></button>
                    <button type="button" class="faculty-type-chip" data-type="sport" aria-pressed="false"><i></i>Спортивные<em></em></button>
                    <button type="button" class="faculty-type-chip" data-type="public" aria-pressed="false"><i></i>Общественные<em></em></button>
                    <button type="button" class="faculty-type-chip" data-type="creative" aria-pressed="false"><i></i>Творческие<em></em></button>
                </div>

                <section class="faculty-analytics-kpis" aria-label="Показатели факультета">
                    <article class="faculty-kpi">
                        <span>Мероприятий</span>
                        <strong id="facultyEventsValue">115</strong>
                        <small id="facultyEventsHint">за выбранный период</small>
                    </article>
                    <article class="faculty-kpi">
                        <span>Участий студентов</span>
                        <strong id="facultyParticipationValue">846</strong>
                        <small>регистрации и посещения</small>
                    </article>
                    <article class="faculty-kpi">
                        <span>Активных студентов</span>
                        <strong id="facultyActiveValue">512</strong>
                        <small>приняли участие впервые</small>
                    </article>
                    <article class="faculty-kpi faculty-kpi-highlight">
                        <span>Посещаемость</span>
                        <strong id="facultyAttendanceValue">78%</strong>
                        <small>от зарегистрированных</small>
                    </article>
                </section>

                <section class="faculty-analytics-charts">
                    <article class="faculty-analytics-panel faculty-monthly-panel">
                        <div class="faculty-panel-heading">
                            <div>
                                <h3>Активность по месяцам</h3>
                                <p>Количество участий студентов</p>
                            </div>
                            <span class="faculty-chart-legend"><i id="facultyChartLegendDot"></i><span id="facultyChartLegendText">Участия</span></span>
                        </div>
                        <div class="faculty-monthly-chart-wrap">
                            <canvas id="facultyActivityChart" aria-label="График активности по месяцам"></canvas>
                        </div>
                    </article>

                    <article class="faculty-analytics-panel faculty-types-panel">
                        <div class="faculty-panel-heading">
                            <div>
                                <h3>Типы мероприятий</h3>
                                <p>Распределение за период</p>
                            </div>
                        </div>
                        <div class="faculty-types-content">
                            <div class="faculty-donut-wrap">
                                <canvas id="facultyTypesChart" aria-label="Диаграмма типов мероприятий"></canvas>
                                <strong id="facultyTypesTotal">115</strong>
                            </div>
                            <div class="faculty-types-legend" id="facultyTypesLegend"></div>
                        </div>
                    </article>
                </section>

                <article class="faculty-analytics-panel faculty-breakdown-panel">
                    <div class="faculty-panel-heading">
                        <div>
                            <h3>Мероприятия по факультетам</h3>
                            <p id="facultyBreakdownSubtitle">Состав по типам за выбранный период</p>
                        </div>
                        <span class="faculty-breakdown-total">Всего<strong id="facultyBreakdownTotal">115</strong></span>
                    </div>
                    <div class="faculty-breakdown-list" id="facultyBreakdownList"></div>
                </article>
            </section>
        </main>
    </div>

    <?php include '../includes/footer.php'; ?>

    <script src="../js/analytics.js?v=6"></script>
    <script src="../js/analytics-dashboard.js?v=4"></script>
    <script src="../js/custom-select.js?v=3"></script>
</body>
</html>