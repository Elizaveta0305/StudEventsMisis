<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Календарь мероприятий</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="icon" type="image/x-icon" href="../assets/logo/favicon.svg">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    <div class="container">
        <main>
            <div class="title-events-row">
                <div class="title-events">Календарь мероприятий</div>
                <button type="button" id="addEventButton" class="calendar-action-btn">Создать мероприятие</button>
            </div>
            <div class="calendar-wrap">
                <div id="simple-calendar" class="calendar"></div>
            </div>
        </main>
    </div>
<?php include '../includes/footer.php'; ?>

    <div id="modalOverlay" class="modal-overlay"></div>
    <div id="eventModal" class="event-modal" role="dialog" aria-modal="true" aria-labelledby="eventModalTitle">
        <div class="event-modal-header">
            <div>
                <div id="eventModalTitle" class="event-modal-title">Создать мероприятие</div>
            </div>
            <button type="button" class="event-modal-close" id="closeModal" aria-label="Закрыть">
                <img src="../assets/ui/close.svg" alt="Закрыть">
            </button>
        </div>
        <form id="eventForm" class="event-modal-form">
            <div class="event-form-grid">
            <label class="event-field-wide">
                Название мероприятия
                <input type="text" id="eventTitle" name="title" placeholder="Название" required>
            </label>
            <label>
                Тип мероприятия
                <select id="eventType" name="type" required>
                    <option value="" selected disabled>Выберите тип</option>
                    <option value="Научное">Научное</option>
                    <option value="Общественное">Общественное</option>
                    <option value="Спортивное">Спортивное</option>
                    <option value="Творческое">Творческое</option>
                    <option value="Городское">Городское</option>
                </select>
            </label>
            <label>
                Уровень мероприятия
                <select id="eventLevel" name="level" required>
                    <option value="" selected disabled>Выберите уровень</option>
                    <option value="Университетский">Университетский</option>
                    <option value="Городской">Городской</option>
                    <option value="Региональный">Региональный</option>
                    <option value="Межрегиональный">Межрегиональный</option>
                    <option value="Всероссийский">Всероссийский</option>
                </select>
            </label>
            <label class="date-field">
                <span>Дата</span>
                <div class="date-input-wrap">
                    <input type="date" id="eventDate" name="date" class="date-input-custom" required>
                    <button type="button" class="date-trigger" aria-label="Открыть календарь"></button>
                </div>
            </label>
            <label>
                Время
                <input type="time" id="eventTime" name="time">
            </label>
            <label>
                Место проведения
                <input type="text" id="eventLocation" name="location" placeholder="Корпус, аудитория или адрес">
            </label>
            <label>
                Кто подписывает служебные записки
                <input type="text" id="eventSigner" name="signer" placeholder="ФИО ответственного за мероприятие">
            </label>
            <label class="event-field-wide">
                Описание
                <textarea id="eventDescription" name="description" rows="3" placeholder="Краткая информация о мероприятии"></textarea>
            </label>
            <label class="event-description-toggle event-field-wide">
                <input type="checkbox" id="eventDescriptionHidden" name="description_hidden" value="1">
                <span>Не добавлять описание мероприятия</span>
            </label>
            <label class="event-field-wide">
                Фото мероприятия
                <input type="file" id="eventCover" name="cover" accept="image/jpeg,image/png,image/webp">
                <small class="event-field-hint">JPG, PNG или WebP, до 1,5 МБ. Фото будет обложкой страницы мероприятия.</small>
                <span class="event-cover-preview" id="eventCoverPreview" hidden>
                    <img id="eventCoverPreviewImage" alt="Предпросмотр обложки мероприятия">
                    <span id="eventCoverPreviewName"></span>
                </span>
            </label>
            <fieldset class="event-role-fields event-field-wide">
                <legend>Студенты и их роли</legend>
                <p>Добавляйте студентов по одному из списка или переключитесь на массовый ввод.</p>
                <div class="calendar-role-entry" data-calendar-role="organizers">
                    <label for="organizersSearch">Организаторы</label>
                    <div class="calendar-role-single-entry">
                        <div class="calendar-student-search-wrap">
                            <input class="calendar-student-search" id="organizersSearch" type="search" autocomplete="off" placeholder="Введите фамилию">
                            <div class="calendar-student-suggestions" role="listbox" hidden></div>
                        </div>
                        <ul class="calendar-role-selected-list" aria-label="Выбранные организаторы"></ul>
                    </div>
                    <details class="calendar-role-bulk-mode">
                        <summary>Добавить списком</summary>
                        <textarea class="calendar-role-bulk" id="eventOrganizers" name="organizers" rows="3" placeholder="ФИО, по одному на строку"></textarea>
                    </details>
                    <div class="calendar-role-entry-footer">
                        <small class="student-directory-status" id="organizersStatus" aria-live="polite">Введите фамилию для поиска.</small>
                    </div>
                </div>
                <div class="calendar-role-entry" data-calendar-role="volunteers">
                    <label for="volunteersSearch">Волонтёры</label>
                    <div class="calendar-role-single-entry">
                        <div class="calendar-student-search-wrap">
                            <input class="calendar-student-search" id="volunteersSearch" type="search" autocomplete="off" placeholder="Введите фамилию">
                            <div class="calendar-student-suggestions" role="listbox" hidden></div>
                        </div>
                        <ul class="calendar-role-selected-list" aria-label="Выбранные волонтёры"></ul>
                    </div>
                    <details class="calendar-role-bulk-mode">
                        <summary>Добавить списком</summary>
                        <textarea class="calendar-role-bulk" id="eventVolunteers" name="volunteers" rows="3" placeholder="ФИО, по одному на строку"></textarea>
                    </details>
                    <div class="calendar-role-entry-footer">
                        <small class="student-directory-status" id="volunteersStatus" aria-live="polite">Введите фамилию для поиска.</small>
                    </div>
                </div>
                <div class="calendar-role-entry" data-calendar-role="participants">
                    <label for="participantsSearch">Участники</label>
                    <div class="calendar-role-single-entry">
                        <div class="calendar-student-search-wrap">
                            <input class="calendar-student-search" id="participantsSearch" type="search" autocomplete="off" placeholder="Введите фамилию">
                            <div class="calendar-student-suggestions" role="listbox" hidden></div>
                        </div>
                        <ul class="calendar-role-selected-list" aria-label="Выбранные участники"></ul>
                    </div>
                    <details class="calendar-role-bulk-mode">
                        <summary>Добавить списком</summary>
                        <textarea class="calendar-role-bulk" id="eventParticipants" name="participants" rows="3" placeholder="ФИО, по одному на строку"></textarea>
                    </details>
                    <div class="calendar-role-entry-footer">
                        <small class="student-directory-status" id="participantsStatus" aria-live="polite">Введите фамилию для поиска.</small>
                    </div>
                </div>
            </fieldset>
            </div>
            <div class="modal-actions">
                <button type="button" class="modal-cancel" id="cancelModal">Отмена</button>
                <button type="submit" class="modal-save">Создать</button>
            </div>
        </form>
    </div>
    <script src="../js/custom-select.js?v=6"></script>
    <script src="../js/calendar.js?v=21"></script>
</body>
</html>
