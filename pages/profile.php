<?php
require_once '../includes/auth.php';
stud_require('profile');
$isEmployee = $studRole === 'employee';
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Личный кабинет</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css?v=9">
    <link rel="stylesheet" href="../css/pages/profile.css?v=10">
    <link rel="stylesheet" href="../css/components/custom-select.css?v=3">
    <link rel="icon" type="image/x-icon" href="../assets/logo/favicon.svg">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    <div class="container">
        <main class="profile-page">
            <div class="title-events-row">
                <div class="title-events">Личный кабинет</div>
                <div class="profile-badge"><?= htmlspecialchars($studUser['label'], ENT_QUOTES, 'UTF-8') ?></div>
            </div>
            <?php if ($isEmployee): ?>
            <section class="notice-composer" aria-labelledby="noticeComposerTitle">
                <div class="notice-section-heading">
                    <p class="notice-eyebrow">УВЕДОМЛЕНИЯ</p>
                    <h2 id="noticeComposerTitle">Новое уведомление для студентов</h2>
                    <p class="notice-section-hint">Студенты увидят окно с уведомлением, смогут перейти на страницу, прочитать текст и скачать прикреплённые файлы.</p>
                </div>
                <form id="noticeForm" class="event-modal-form notice-form" novalidate>
                    <div class="event-form-grid">
                        <label class="event-field-wide">
                            Заголовок
                            <input type="text" id="noticeTitle" name="title" maxlength="120" placeholder="Например: Документы для поездки на форум" required>
                        </label>
                        <label class="event-field-wide">
                            Текст уведомления
                            <textarea id="noticeText" name="text" rows="5" maxlength="4000" placeholder="Что нужно знать студентам: дата, место сбора, что взять с собой" required></textarea>
                        </label>
                        <div class="event-field-wide notice-files-field">
                            <span class="notice-files-label">Файлы</span>
                            <label class="notice-files-drop" for="noticeFiles">
                                <input type="file" id="noticeFiles" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.zip">
                                <span class="notice-files-drop-title">Выбрать файлы</span>
                                <small>До 5 файлов, каждый до 1,5 МБ. PDF, Word, Excel, PowerPoint, JPG, PNG или ZIP.</small>
                            </label>
                            <ul class="notice-files-list" id="noticeFilesList" aria-live="polite"></ul>
                            <div class="notice-system-file">
                                <span class="notice-file-badge">DOC</span>
                                <span class="notice-system-file-text">
                                    <strong>Мои мероприятия</strong>
                                    <small>Файл формирует система: каждый студент получит свой список мероприятий. Прикрепляется автоматически.</small>
                                </span>
                                <span class="notice-system-tag">Системный</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="modal-save" id="noticeSubmit">Отправить всем студентам</button>
                    </div>
                </form>
            </section>
            <section class="notice-history" aria-labelledby="noticeHistoryTitle">
                <div class="notice-section-heading">
                    <h2 id="noticeHistoryTitle">Отправленные уведомления</h2>
                </div>
                <div class="notice-list" id="noticeHistory"></div>
            </section>
            <?php else: ?>
            <div class="profile-overview">
                <section class="profile-card">
                    <div class="profile-card-header">
                        <div class="profile-avatar" data-profile-avatar>Е</div>
                        <div>
                            <div class="profile-name" data-profile-field="fullName">Розенко Елизавета Максимовна</div>

                        </div>
                    </div>
                    <div class="profile-info-grid">
                        <div class="profile-info-item">
                            <span>Факультет</span>
                            <strong data-profile-field="faculty">ФАИТ</strong>
                        </div>
                        <div class="profile-info-item">
                            <span>Группа</span>
                            <strong data-profile-field="group">ИТ-23</strong>
                        </div>
                        <div class="profile-info-item">
                            <span>Почта</span>
                            <strong data-profile-field="email">emr032005@mail.ru</strong>
                        </div>
                        <div class="profile-info-item">
                            <span>Телефон</span>
                            <strong data-profile-field="phone">+7 (960) 621-76-28</strong>
                        </div>
                        <div class="profile-info-item">
                            <span>Дата рождения</span>
                            <strong data-profile-field="birth">11.03.2005 (21 год)</strong>
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
                        <button type="button" class="profile-link profile-link-secondary" id="profileEditButton">Редактировать профиль</button>
                    </div>
                </aside>
            </div>
            <section class="notice-history notice-history-student" aria-labelledby="studentNoticesTitle">
                <div class="notice-section-heading">
                    <p class="notice-eyebrow">ДОКУМЕНТЫ</p>
                    <h2 id="studentNoticesTitle">Уведомления от сотрудников</h2>
                </div>
                <div class="notice-list" id="studentNotices"></div>
            </section>
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
                            </div>
                        </div>
                    </article>
                </div>
            </section>
            <section class="profile-events">
                <div class="profile-events-header">
                    <div>
                        <div class="profile-events-title">Мероприятия</div>
                        <div class="profile-events-count" id="profileEventsCount">Всего мероприятий: 3</div>
                    </div>
                    <div class="profile-events-note">Вы можете открыть карточку, прочитать описание и скачать служебную записку.</div>
                </div>
                <div class="profile-event-filters" role="group" aria-label="Фильтр по типу мероприятий">
                    <button type="button" class="filter-chip filter-chip-active" data-filter="all" aria-pressed="true">Все<span class="filter-chip-count"></span></button>
                    <button type="button" class="filter-chip" data-filter="scientific" aria-pressed="false">Научные<span class="filter-chip-count"></span></button>
                    <button type="button" class="filter-chip" data-filter="sport" aria-pressed="false">Спортивные<span class="filter-chip-count"></span></button>
                    <button type="button" class="filter-chip" data-filter="public" aria-pressed="false">Общественные<span class="filter-chip-count"></span></button>
                    <button type="button" class="filter-chip" data-filter="creative" aria-pressed="false">Творческие<span class="filter-chip-count"></span></button>
                </div>
                <div class="profile-events-grid">
                    <article class="event-card-block" data-event-type="scientific">
                        <div class="event-card-meta">
                            <time class="event-card-when" datetime="2026-08-12T14:00">
                                <span class="event-card-day"><b>12</b><i>авг</i></span>
                                <span class="event-card-time"><small>Начало</small><b>14:00</b></span>
                            </time>
                            <div class="event-card-type event-type-scientific">Научное</div>
                        </div>
                        <div class="event-card-title">Хахакмекфест 2027</div>
                        <div class="event-card-level">Всероссийский уровень</div>
                        <p class="event-card-description">Хакатон для студентов и школьников.</p>
                        <div class="event-card-footer">
                            <a href="../pages/event.php?id=event-1" class="event-card-link">Подробнее</a>
                            <a href="#" class="event-card-download"><span class="download-icon"><img src="../assets/ui/download.svg" alt="Скачать"></span>Скачать</a>
                        </div>
                    </article>
                    <article class="event-card-block" data-event-type="public">
                        <div class="event-card-meta">
                            <time class="event-card-when" datetime="2026-09-01T10:00">
                                <span class="event-card-day"><b>1</b><i>сен</i></span>
                                <span class="event-card-time"><small>Начало</small><b>10:00</b></span>
                            </time>
                            <div class="event-card-type event-type-public">Общественное</div>
                        </div>
                        <div class="event-card-title">День открытых дверей</div>
                        <div class="event-card-level">Университетский уровень</div>
                        <p class="event-card-description">Линейка на территории университета.</p>
                        <div class="event-card-footer">
                            <a href="../pages/event.php?id=event-2" class="event-card-link">Подробнее</a>
                            <a href="#" class="event-card-download"><span class="download-icon"><img src="../assets/ui/download.svg" alt="Скачать"></span>Скачать</a>
                        </div>
                    </article>
                    <article class="event-card-block" data-event-type="scientific">
                        <div class="event-card-meta">
                            <time class="event-card-when" datetime="2026-08-25T16:30">
                                <span class="event-card-day"><b>25</b><i>авг</i></span>
                                <span class="event-card-time"><small>Начало</small><b>16:30</b></span>
                            </time>
                            <div class="event-card-type event-type-scientific">Научное</div>
                        </div>
                        <div class="event-card-title">Погружение 2026</div>
                        <div class="event-card-level">Городской уровень</div>
                        <p class="event-card-description">Мероприятие для сплочения студентов.</p>
                        <div class="event-card-footer">
                            <a href="../pages/event.php?id=event-3" class="event-card-link">Подробнее</a>
                            <a href="#" class="event-card-download"><span class="download-icon"><img src="../assets/ui/download.svg" alt="Скачать"></span>Скачать</a>
                        </div>
                    </article>
                </div>
                <div class="profile-events-empty" id="profileEventsEmpty" hidden>Мероприятий этого типа пока нет</div>
            </section>
            <?php endif; ?>
        </main>
    </div>
    <?php include '../includes/footer.php'; ?>
    <?php if ($isEmployee): ?>
    <script src="../js/notice-composer.js?v=1"></script>
    <?php else: ?>
    <div id="profileModalOverlay" class="modal-overlay"></div>
    <div id="profileModal" class="event-modal" role="dialog" aria-modal="true" aria-labelledby="profileModalTitle">
        <div class="event-modal-header">
            <div id="profileModalTitle" class="event-modal-title">Редактировать профиль</div>
            <button type="button" class="event-modal-close" id="profileModalClose" aria-label="Закрыть">
                <img src="../assets/ui/close.svg" alt="Закрыть">
            </button>
        </div>
        <form id="profileForm" class="event-modal-form" novalidate>
            <div class="event-form-grid">
                <label class="event-field-wide">
                    ФИО
                    <input type="text" id="profileFullName" name="fullName" autocomplete="name" placeholder="Фамилия Имя Отчество" required>
                </label>
                <label>
                    Факультет
                    <select id="profileFaculty" name="faculty" required>
                        <option value="ФАИТ">ФАИТ</option>
                        <option value="ИЭФ">ИЭФ</option>
                        <option value="ФММТ">ФММТ</option>
                    </select>
                </label>
                <label>
                    Группа
                    <input type="text" id="profileGroup" name="group" placeholder="ИТ-23" required>
                </label>
                <label>
                    Почта
                    <input type="email" id="profileEmail" name="email" autocomplete="email" placeholder="name@mail.ru" required>
                </label>
                <label>
                    Телефон
                    <input type="tel" id="phone" name="phone" autocomplete="tel" placeholder="+7 (___) ___-__-__" maxlength="18" required>
                </label>
                <label class="date-field">
                    <span>Дата рождения</span>
                    <div class="date-input-wrap">
                        <input type="date" id="profileBirth" name="birth" class="date-input-custom" required>
                        <button type="button" class="date-trigger" aria-label="Открыть календарь"></button>
                    </div>
                </label>
            </div>
            <div class="modal-actions">
                <button type="button" class="modal-cancel" id="profileCancel">Отмена</button>
                <button type="submit" class="modal-save">Сохранить</button>
            </div>
        </form>
    </div>
    <script src="../js/calendar.js"></script>
    <script src="../js/analytics-dashboard.js?v=3"></script>
    <script src="../js/custom-select.js?v=3"></script>
    <script src="../js/profile-events.js?v=1"></script>
    <script src="../js/profile-edit.js?v=1"></script>
    <script src="../js/student-notices.js?v=1"></script>
    <?php endif; ?>
</body>
</html>