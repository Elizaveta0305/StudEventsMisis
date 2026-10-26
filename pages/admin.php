<?php
require_once '../includes/auth.php';
stud_require('admin');
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Админ-панель</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css?v=10">
    <link rel="stylesheet" href="../css/pages/admin.css?v=11">
    <link rel="icon" type="image/x-icon" href="../assets/logo/favicon.svg">
</head>
<body>
    <?php include '../includes/header.php'; ?>

    <div class="container">
        <main class="admin-page">
            <div class="admin-heading">
                <div>
                    <p class="admin-eyebrow">УПРАВЛЕНИЕ</p>
                    <h1>Панель управления</h1>
                </div>
            </div>

            <nav class="admin-nav" aria-label="Разделы админ-панели">
                <a class="admin-nav-active" href="#events">Мероприятия</a>
                <a href="#students">Студенты</a>
                <a href="#staff">Сотрудники</a>
            </nav>

            <section class="admin-section" id="events" aria-labelledby="adminEventsTitle">
                <div class="admin-section-heading">
                    <div>
                        <p class="admin-section-kicker">СОБЫТИЯ</p>
                        <h2 id="adminEventsTitle">Мероприятия</h2>
                    </div>
                    <button class="admin-button" id="adminCreateEvent" type="button">Создать мероприятие</button>
                </div>

                <div class="admin-toolbar">
                    <div class="admin-field admin-toolbar-search">
                        <label class="admin-visually-hidden" for="adminEventSearch">Поиск мероприятий</label>
                        <input type="search" id="adminEventSearch" placeholder="Поиск по названию, месту или подписанту" autocomplete="off">
                    </div>
                    <div class="admin-field admin-toolbar-type">
                        <label class="admin-visually-hidden" for="adminEventTypeFilter">Тип мероприятия</label>
                        <select id="adminEventTypeFilter">
                            <option value="">Все типы</option>
                            <option>Научное</option>
                            <option>Спортивное</option>
                            <option>Общественное</option>
                            <option>Творческое</option>
                        </select>
                    </div>
                    <div class="admin-segmented" role="group" aria-label="Период">
                        <button type="button" class="is-active" data-period="upcoming" aria-pressed="true">Предстоящие <span class="admin-segmented-count" data-count="upcoming"></span></button>
                        <button type="button" data-period="past" aria-pressed="false">Прошедшие <span class="admin-segmented-count" data-count="past"></span></button>
                        <button type="button" data-period="all" aria-pressed="false">Все <span class="admin-segmented-count" data-count="all"></span></button>
                    </div>
                </div>

                <p class="admin-list-summary" id="adminEventsSummary" role="status" aria-live="polite"></p>
                <ul class="admin-event-list" id="adminEventList"></ul>

                <div class="admin-empty" id="adminEventsEmpty" hidden>
                    <strong id="adminEmptyTitle"></strong>
                    <p id="adminEmptyText"></p>
                    <div class="admin-empty-actions" id="adminEmptyActions"></div>
                </div>
            </section>

            <section class="admin-section" id="students" aria-labelledby="adminStudentsTitle">
                <div class="admin-section-heading">
                    <div>
                        <p class="admin-section-kicker">УЧЁТНЫЕ ЗАПИСИ</p>
                        <h2 id="adminStudentsTitle">Добавить студента</h2>
                    </div>
                </div>

                <form class="admin-form" id="adminStudentForm" aria-label="Данные нового студента" novalidate>
                    <div class="admin-form-grid">
                        <label class="admin-field">
                            <span>Имя</span>
                            <input type="text" name="first_name" required>
                        </label>
                        <label class="admin-field">
                            <span>Фамилия</span>
                            <input type="text" name="last_name" required>
                        </label>
                        <label class="admin-field">
                            <span>Отчество</span>
                            <input type="text" name="patronymic">
                        </label>
                        <label class="admin-field">
                            <span>Факультет</span>
                            <select id="adminStudentFaculty" name="faculty" required>
                                <option value="" selected disabled>Выберите факультет</option>
                                <option value="it">ФАИТ</option>
                                <option value="economics">ИЭФ</option>
                                <option value="law">ФММТ</option>
                            </select>
                        </label>
                        <label class="admin-field">
                            <span>Группа</span>
                            <input type="text" name="group" required>
                        </label>
                        <label class="admin-field">
                            <span>Логин</span>
                            <input type="text" name="register_login" required>
                        </label>
                        <label class="admin-field">
                            <span>Пароль</span>
                            <input type="password" name="register_password" required>
                        </label>
                        <label class="admin-field">
                            <span>Повторите пароль</span>
                            <input type="password" name="confirm_password" required>
                        </label>
                    </div>
                    <div class="admin-form-actions">
                        <span class="admin-form-status" id="adminStudentStatus" role="status" aria-live="polite">Заполните форму и нажмите «Добавить студента» для проверки.</span>
                        <button class="admin-button admin-button-secondary" id="adminStudentCheck" type="button">Проверить данные</button>
                    </div>
                </form>
            </section>

            <section class="admin-section" id="staff" aria-labelledby="adminStaffTitle">
                <div class="admin-section-heading">
                    <div>
                        <p class="admin-section-kicker">УЧЁТНЫЕ ЗАПИСИ</p>
                        <h2 id="adminStaffTitle">Добавить сотрудника</h2>
                    </div>
                </div>

                <form class="admin-form" aria-label="Данные нового сотрудника">
                    <div class="admin-form-grid">
                        <label class="admin-field">
                            <span>Имя</span>
                            <input type="text" name="first_name" required>
                        </label>
                        <label class="admin-field">
                            <span>Фамилия</span>
                            <input type="text" name="last_name" required>
                        </label>
                        <label class="admin-field">
                            <span>Отчество</span>
                            <input type="text" name="patronymic">
                        </label>
                        <label class="admin-field">
                            <span>Подразделение</span>
                            <input type="text" name="staff_department" placeholder="Факультет или отдел" required>
                        </label>
                        <label class="admin-field">
                            <span>Должность</span>
                            <input type="text" name="staff_position" placeholder="Должность сотрудника">
                        </label>
                        <label class="admin-field">
                            <span>Логин</span>
                            <input type="text" name="register_login" required>
                        </label>
                        <label class="admin-field">
                            <span>Пароль</span>
                            <input type="password" name="register_password" required>
                        </label>
                        <label class="admin-field">
                            <span>Повторите пароль</span>
                            <input type="password" name="confirm_password" required>
                        </label>
                    </div>
                    <div class="admin-form-actions">
                        <button class="admin-button admin-button-secondary" type="button">Добавить сотрудника</button>
                    </div>
                </form>
            </section>
        </main>
    </div>

    <div class="admin-drawer-overlay" id="adminDrawerOverlay"></div>
    <aside class="admin-drawer" id="adminDrawer" role="dialog" aria-modal="true" aria-labelledby="adminDrawerTitle" aria-hidden="true">
        <form class="admin-drawer-form" id="adminEventForm" novalidate>
            <div class="admin-drawer-header">
                <div>
                    <p class="admin-section-kicker" id="adminDrawerKicker">НОВОЕ МЕРОПРИЯТИЕ</p>
                    <h2 id="adminDrawerTitle">Создание мероприятия</h2>
                </div>
                <button class="admin-drawer-close" id="adminDrawerClose" type="button" aria-label="Закрыть форму">&times;</button>
            </div>

            <div class="admin-drawer-body">
                <fieldset class="admin-fieldset">
                    <legend>Основное</legend>
                    <div class="admin-form-grid">
                        <div class="admin-field admin-field-wide" data-field="title">
                            <label for="adminEventTitle">Название <span class="admin-required" aria-hidden="true">*</span></label>
                            <input type="text" id="adminEventTitle" name="event_title" placeholder="Например, День открытых дверей" maxlength="140" autocomplete="off">
                            <small class="admin-field-error" data-error-for="title" hidden></small>
                        </div>
                        <div class="admin-field" data-field="type">
                            <label for="adminEventType">Тип <span class="admin-required" aria-hidden="true">*</span></label>
                            <select id="adminEventType" name="event_type">
                                <option value="" selected disabled>Выберите тип</option>
                                <option>Научное</option>
                                <option>Спортивное</option>
                                <option>Общественное</option>
                                <option>Творческое</option>
                            </select>
                            <small class="admin-field-error" data-error-for="type" hidden></small>
                        </div>
                        <div class="admin-field" data-field="level">
                            <label for="adminEventLevel">Уровень <span class="admin-required" aria-hidden="true">*</span></label>
                            <select id="adminEventLevel" name="event_level">
                                <option value="" selected disabled>Выберите уровень</option>
                                <option value="Университетский">Университетский</option>
                                <option value="Городской">Городской</option>
                                <option value="Региональный">Региональный</option>
                                <option value="Межрегиональный">Межрегиональный</option>
                                <option value="Всероссийский">Всероссийский</option>
                            </select>
                            <small class="admin-field-error" data-error-for="level" hidden></small>
                        </div>
                        <div class="admin-field admin-field-wide">
                            <label for="adminEventDescription">Описание</label>
                            <textarea id="adminEventDescription" name="event_description" rows="3" placeholder="Краткая информация о мероприятии"></textarea>
                            <label class="admin-description-toggle">
                                <input type="checkbox" name="event_description_hidden" value="1">
                                <span>Не показывать описание на странице мероприятия</span>
                            </label>
                        </div>
                    </div>
                </fieldset>

                <fieldset class="admin-fieldset">
                    <legend>Дата и место</legend>
                    <div class="admin-form-grid">
                        <div class="admin-field" data-field="date">
                            <label for="adminEventDate">Дата <span class="admin-required" aria-hidden="true">*</span></label>
                            <input type="date" id="adminEventDate" name="event_date">
                            <small class="admin-field-error" data-error-for="date" hidden></small>
                            <small class="admin-document-hint" id="adminDateHint" hidden></small>
                        </div>
                        <div class="admin-field">
                            <label for="adminEventTime">Время начала</label>
                            <input type="time" id="adminEventTime" name="event_time">
                        </div>
                        <div class="admin-field">
                            <label for="adminEventLocation">Место проведения</label>
                            <input type="text" id="adminEventLocation" name="event_location" placeholder="Корпус, аудитория или адрес" autocomplete="off">
                        </div>
                        <div class="admin-field">
                            <label for="adminEventSigner">Кто подписывает служебные записки</label>
                            <input type="text" id="adminEventSigner" name="event_signer" list="adminSignerList" placeholder="ФИО ответственного" autocomplete="off">
                            <datalist id="adminSignerList"></datalist>
                        </div>
                    </div>
                </fieldset>

                <fieldset class="admin-fieldset">
                    <legend>Студенты и сотрудники</legend>
                    <div class="admin-form-grid">
                        <div class="admin-field">
                            <span id="adminOrganizersLabel">Организаторы</span>
                            <div data-people-role="organizers" data-label-id="adminOrganizersLabel" data-placeholder="Найти студента"></div>
                        </div>
                        <div class="admin-field">
                            <span id="adminVolunteersLabel">Волонтёры</span>
                            <div data-people-role="volunteers" data-label-id="adminVolunteersLabel" data-placeholder="Найти студента"></div>
                        </div>
                        <div class="admin-field">
                            <span id="adminParticipantsLabel">Участники</span>
                            <div data-people-role="participants" data-label-id="adminParticipantsLabel" data-placeholder="Найти студента"></div>
                        </div>
                        <div class="admin-field">
                            <span id="adminStaffLabel">Ответственные сотрудники</span>
                            <div data-people-role="staff" data-label-id="adminStaffLabel" data-placeholder="Найти сотрудника"></div>
                        </div>
                    </div>
                </fieldset>

                <fieldset class="admin-fieldset">
                    <legend>Материалы</legend>
                    <div class="admin-form-grid">
                        <div class="admin-field admin-field-wide">
                            <label for="adminEventOrder">Приказ или документ мероприятия</label>
                            <input class="admin-file-input" id="adminEventOrder" type="file" name="event_order" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
                            <div class="admin-file-chip" id="adminOrderChip" hidden>
                                <span class="admin-file-badge" id="adminOrderExt">PDF</span>
                                <span class="admin-file-name" id="adminOrderName"></span>
                                <button class="admin-chip-button" id="adminOrderRemove" type="button">Убрать</button>
                            </div>
                            <small class="admin-document-hint" id="adminOrderHint">PDF, DOC или DOCX, не больше 2,5 МБ.</small>
                        </div>
                        <div class="admin-field admin-field-wide">
                            <label for="adminEventCover">Обложка мероприятия</label>
                            <input class="admin-file-input" id="adminEventCover" type="file" name="event_cover" accept="image/jpeg,image/png,image/webp">
                            <div class="admin-cover-preview" id="adminCoverPreview" hidden>
                                <img id="adminCoverPreviewImage" alt="Предпросмотр обложки мероприятия">
                                <button class="admin-chip-button" id="adminRemoveCover" type="button">Убрать обложку</button>
                            </div>
                            <small class="admin-document-hint" id="adminCoverHint">JPG, PNG или WebP до 1,5 МБ. Горизонтальное изображение размещается во всю ширину страницы мероприятия.</small>
                        </div>
                    </div>
                </fieldset>
            </div>

            <div class="admin-drawer-footer">
                <button class="admin-button admin-button-danger-outline" id="adminDrawerDelete" type="button" hidden>Удалить</button>
                <span class="admin-event-form-status" id="adminEventStatus" role="status" aria-live="polite"></span>
                <button class="admin-button admin-button-secondary" id="adminDrawerCancel" type="button">Отмена</button>
                <button class="admin-button" id="adminEventSubmit" type="submit">Создать мероприятие</button>
            </div>
        </form>
    </aside>

    <?php include '../includes/footer.php'; ?>
    <script src="../js/custom-select.js?v=4"></script>
    <script src="../js/admin.js?v=10"></script>
</body>
</html>