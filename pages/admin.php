<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Админ-панель</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/pages/admin.css?v=4">
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
                        <h2 id="adminEventsTitle">Новое мероприятие</h2>
                    </div>
                </div>

                <form class="admin-form" aria-label="Данные нового мероприятия">
                    <div class="admin-form-grid">
                        <label class="admin-field admin-field-wide">
                            <span>Название мероприятия</span>
                            <input type="text" name="event_name" placeholder="Например, День открытых дверей" required>
                        </label>

                        <label class="admin-field">
                            <span>Тип мероприятия</span>
                            <select name="event_type" required>
                                <option value="" selected disabled>Выберите тип</option>
                                <option>Научное</option>
                                <option>Спортивное</option>
                                <option>Общественное</option>
                                <option>Творческое</option>
                                <option>Городское</option>
                            </select>
                        </label>
                        <label class="admin-field">
                            <span>Место проведения</span>
                            <input type="text" name="event_location" placeholder="Корпус, аудитория или адрес">
                        </label>

                        <label class="admin-field">
                            <span>Дата</span>
                            <input type="date" name="event_date" required>
                        </label>
                        <label class="admin-field">
                            <span>Время начала</span>
                            <input type="time" name="event_time">
                        </label>

                        <label class="admin-field admin-field-wide">
                            <span>Описание</span>
                            <textarea name="event_description" rows="3" placeholder="Краткая информация о мероприятии"></textarea>
                        </label>

                        <div class="admin-field">
                            <span id="assignedStudentsLabel">Закреплённые студенты</span>
                            <div class="admin-people-picker" data-admin-people-picker data-field-name="students[]">
                                <div class="admin-picker-control">
                                    <input class="admin-picker-search" type="search" placeholder="Найти студента" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="assignedStudentsOptions" aria-labelledby="assignedStudentsLabel">
                                    <button class="admin-picker-toggle" type="button" aria-label="Открыть список студентов" tabindex="-1"><span aria-hidden="true"></span></button>
                                </div>
                                <div class="admin-picker-menu" hidden>
                                    <div class="admin-picker-list" id="assignedStudentsOptions" role="listbox" aria-multiselectable="true">
                                        <button class="admin-picker-option" type="button" role="option" aria-selected="false" data-value="student-1" data-search="Александра Иванова ИТ-23">Александра Иванова · ЭТ-23</button>
                                        <button class="admin-picker-option" type="button" role="option" aria-selected="false" data-value="student-2" data-search="Михаил Петров ИТ-22">Михаил Петров · ИТ-22</button>
                                        <button class="admin-picker-option" type="button" role="option" aria-selected="false" data-value="student-3" data-search="Елизавета Розенко ИТ-23">Елизавета Розенко · АТ-23</button>
                                        <button class="admin-picker-option" type="button" role="option" aria-selected="false" data-value="student-4" data-search="Даниил Смирнов ЭК-21">Даниил Смирнов · Э/Ц-24</button>
                                        <button class="admin-picker-option" type="button" role="option" aria-selected="false" data-value="student-5" data-search="Мария Кузнецова ИТ-22">Мария Кузнецова · ИТ-23</button>
                                    </div>
                                    <p class="admin-picker-empty" hidden>Ничего не найдено</p>
                                </div>
                                <div class="admin-picker-selected" aria-live="polite" hidden></div>
                            </div>
                        </div>
                        <div class="admin-field">
                            <span id="assignedStaffLabel">Ответственные сотрудники</span>
                            <div class="admin-people-picker" data-admin-people-picker data-field-name="staff[]">
                                <div class="admin-picker-control">
                                    <input class="admin-picker-search" type="search" placeholder="Найти сотрудника" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="assignedStaffOptions" aria-labelledby="assignedStaffLabel">
                                    <button class="admin-picker-toggle" type="button" aria-label="Открыть список сотрудников" tabindex="-1"><span aria-hidden="true"></span></button>
                                </div>
                                <div class="admin-picker-menu" hidden>
                                    <div class="admin-picker-list" id="assignedStaffOptions" role="listbox" aria-multiselectable="true">
                                        <button class="admin-picker-option" type="button" role="option" aria-selected="false" data-value="staff-1" data-search="Анна Сергеевна ФАИТ">Анна Мартынова · УВР</button>
                                        <button class="admin-picker-option" type="button" role="option" aria-selected="false" data-value="staff-2" data-search="Игорь Викторович Студенческий отдел">Натьлья Викторовна · ИЭФ</button>
                                        <button class="admin-picker-option" type="button" role="option" aria-selected="false" data-value="staff-3" data-search="Ольга Андреевна ФММТ">Анатолий Иванович · ФММТ</button>
                                        <button class="admin-picker-option" type="button" role="option" aria-selected="false" data-value="staff-4" data-search="Дмитрий Павлович ИЭФ">Ольга Александровна · ИЭФ</button>
                                        <button class="admin-picker-option" type="button" role="option" aria-selected="false" data-value="staff-5" data-search="Наталья Ивановна ФАИТ">Нелли Ковтун · ФАИТ</button>
                                    </div>
                                    <p class="admin-picker-empty" hidden>Ничего не найдено</p>
                                </div>
                                <div class="admin-picker-selected" aria-live="polite" hidden></div>
                            </div>
                        </div>

                        <label class="admin-field admin-field-wide">
                            <span>Приказ или документ мероприятия</span>
                            <input class="admin-file-input" type="file" name="event_document" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
                        </label>
                    </div>

                    <div class="admin-form-actions">
                        <button class="admin-button" type="button">Создать мероприятие</button>
                    </div>
                </form>
            </section>

            <section class="admin-section" id="students" aria-labelledby="adminStudentsTitle">
                <div class="admin-section-heading">
                    <div>
                        <p class="admin-section-kicker">УЧЁТНЫЕ ЗАПИСИ</p>
                        <h2 id="adminStudentsTitle">Добавить студента</h2>
                    </div>
                </div>

                <form class="admin-form" aria-label="Данные нового студента">
                    <div class="admin-form-grid">
                        <label class="admin-field">
                            <span>ФИО</span>
                            <input type="text" name="student_name" placeholder="Фамилия Имя Отчество" required>
                        </label>
                        <label class="admin-field">
                            <span>Email</span>
                            <input type="email" name="student_email" placeholder="name@example.ru" required>
                        </label>
                        <label class="admin-field">
                            <span>Факультет</span>
                            <select name="student_faculty" required>
                                <option value="" selected disabled>Выберите факультет</option>
                                <option>ФАИТ</option>
                                <option>ИЭФ</option>
                                <option>ФММТ</option>
                            </select>
                        </label>
                        <label class="admin-field">
                            <span>Группа</span>
                            <input type="text" name="student_group" placeholder="Например, ИТ-23" required>
                        </label>
                    </div>
                    <div class="admin-form-actions">
                        <button class="admin-button admin-button-secondary" type="button">Добавить студента</button>
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
                            <span>ФИО</span>
                            <input type="text" name="staff_name" placeholder="Фамилия Имя Отчество" required>
                        </label>
                        <label class="admin-field">
                            <span>Email</span>
                            <input type="email" name="staff_email" placeholder="name@example.ru" required>
                        </label>
                        <label class="admin-field">
                            <span>Подразделение</span>
                            <input type="text" name="staff_department" placeholder="Факультет или отдел" required>
                        </label>
                        <label class="admin-field">
                            <span>Должность</span>
                            <input type="text" name="staff_position" placeholder="Должность сотрудника">
                        </label>
                    </div>
                    <div class="admin-form-actions">
                        <button class="admin-button admin-button-secondary" type="button">Добавить сотрудника</button>
                    </div>
                </form>
            </section>
        </main>
    </div>

    <?php include '../includes/footer.php'; ?>
    <script src="../js/custom-select.js?v=4"></script>
    <script src="../js/admin.js?v=1"></script>
</body>
</html>