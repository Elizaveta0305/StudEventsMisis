<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Настройки</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/pages/settings.css?v=6">
    <link rel="stylesheet" href="../css/components/custom-select.css?v=3">
    <link rel="icon" type="image/x-icon" href="../assets/logo/favicon.svg">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    <div class="container">
        <main class="settings-page">
            <div class="settings-header">
                <div>
                    <div class="settings-title">Настройки</div>
                </div>
            </div>

            <section class="settings-section">
                <div class="settings-section-header">
                    <h2 class="settings-section-title">Внешний вид</h2>
                    <p class="settings-section-subtitle">Персонализация и тема оформления интерфейса</p>
                </div>
                <div class="settings-card">
                    <div class="settings-row">
                        <div class="settings-label-group">
                            <div class="settings-row-title">Тема оформления</div>
                            <p class="settings-row-text">Выберите тему оформления интерфейса.</p>
                        </div>

                        <label class="settings-select-wrap" aria-label="Выбор темы интерфейса">
                            <select id="themeSelect" class="settings-select">
                                <option value="light">Светлая</option>
                                <option value="dark">Тёмная</option>
                            </select>
                        </label>
                    </div>
                </div>
            </section>

            <section class="settings-section">
                <div class="settings-section-header">
                    <h2 class="settings-section-title">Календарь</h2>
                    <p class="settings-section-subtitle">Параметры отображения сетки, времени и категорий событий</p>
                </div>
                <div class="settings-card">
                    <div class="settings-row">
                    <div class="settings-label-group">
                        <div class="settings-row-title">Первый день недели</div>
                        <p class="settings-row-text">С какого дня начинается неделя в календаре.</p>
                    </div>
                    <label class="settings-select-wrap" aria-label="Первый день недели">
                        <select id="calendarWeekStart" class="settings-select">
                            <option value="mon">Понедельник</option>
                            <option value="sun">Воскресенье</option>
                        </select>
                    </label>
                </div>

                <div class="settings-row">
                    <div class="settings-label-group">
                        <div class="settings-row-title">Формат времени</div>
                        <p class="settings-row-text">Как показывать время мероприятий в карточках календаря.</p>
                    </div>
                    <label class="settings-select-wrap" aria-label="Формат времени">
                        <select id="calendarTimeFormat" class="settings-select">
                            <option value="24">24 часа (14:30)</option>
                            <option value="12">12 часов (2:30 PM)</option>
                        </select>
                    </label>
                </div>

                <div class="settings-row">
                    <div class="settings-label-group">
                        <div class="settings-row-title">Данные в карточке</div>
                        <p class="settings-row-text">Что показывать под названием мероприятия в календаре.</p>
                    </div>
                    <div class="settings-toggles">
                        <label class="settings-toggle-card">
                            <input type="checkbox" id="calendarShowTime" class="settings-toggle-input">
                            <span class="settings-toggle-content">
                                <span class="settings-toggle-icon" aria-hidden="true">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                </span>
                                <span class="settings-toggle-label">Время</span>
                                <span class="settings-switch-ui" aria-hidden="true">
                                    <span class="settings-switch-knob"></span>
                                </span>
                            </span>
                        </label>
                        <label class="settings-toggle-card">
                            <input type="checkbox" id="calendarShowPlace" class="settings-toggle-input">
                            <span class="settings-toggle-content">
                                <span class="settings-toggle-icon" aria-hidden="true">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                </span>
                                <span class="settings-toggle-label">Место проведения</span>
                                <span class="settings-switch-ui" aria-hidden="true">
                                    <span class="settings-switch-knob"></span>
                                </span>
                            </span>
                        </label>
                    </div>
                </div>

                <div class="settings-row">
                    <div class="settings-label-group">
                        <div class="settings-row-title">Типы мероприятий</div>
                        <p class="settings-row-text">Какие типы мероприятий показывать в календаре</p>
                        <div class="settings-type-actions">
                            <button type="button" class="settings-action-link" id="selectAllTypes">Выбрать все</button>
                            <span class="settings-action-sep">·</span>
                            <button type="button" class="settings-action-link" id="clearAllTypes">Снять все</button>
                        </div>
                    </div>
                    <div class="settings-type-chips">
                        <label class="settings-type-chip type-scientific">
                            <input type="checkbox" data-calendar-type value="Научное" class="settings-chip-input">
                            <span class="type-chip-body">
                                <span class="type-chip-dot"></span>
                                <span class="type-chip-label">Научное</span>
                                <span class="type-chip-check" aria-hidden="true">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </span>
                            </span>
                        </label>
                        <label class="settings-type-chip type-public">
                            <input type="checkbox" data-calendar-type value="Общественное" class="settings-chip-input">
                            <span class="type-chip-body">
                                <span class="type-chip-dot"></span>
                                <span class="type-chip-label">Общественное</span>
                                <span class="type-chip-check" aria-hidden="true">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </span>
                            </span>
                        </label>
                        <label class="settings-type-chip type-sport">
                            <input type="checkbox" data-calendar-type value="Спортивное" class="settings-chip-input">
                            <span class="type-chip-body">
                                <span class="type-chip-dot"></span>
                                <span class="type-chip-label">Спортивное</span>
                                <span class="type-chip-check" aria-hidden="true">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </span>
                            </span>
                        </label>
                        <label class="settings-type-chip type-creative">
                            <input type="checkbox" data-calendar-type value="Творческое" class="settings-chip-input">
                            <span class="type-chip-body">
                                <span class="type-chip-dot"></span>
                                <span class="type-chip-label">Творческое</span>
                                <span class="type-chip-check" aria-hidden="true">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </span>
                            </span>
                        </label>
                    </div>
                </div>
                </div>
            </section>
        </main>
    </div>
<?php include '../includes/footer.php'; ?>
    <script src="../js/calendar-settings.js?v=1"></script>
    <script src="../js/settings.js?v=3"></script>
    <script src="../js/custom-select.js?v=7"></script>
</body>
</html>