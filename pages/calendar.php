<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Календарь мероприятий</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="icon" type="image/x-icon" href="../assets/logo/favicon.svg">
</head>
<body>
    <div class="container">
        <header>
        <div class="header_inner">
            <div class="logo">
                <img src="../assets/logo/main_logo.png" alt="Logo">
            </div>
            <span class="header_links">
                <a href="../pages/register.php">Мероприятия</a>
                <a href="../index.php">Аналитика</a>
                <a href="#">Мероприятия</a>
                <div class="user-menu">
                    <button type="button" class="user-link" id="userToggle">
                        Имя Пользователя <img src="../assets/ui/user.svg" alt="">
                    </button>
                    <div class="user-dropdown" id="userDropdown">
                        <a href="#"><span>Личный кабинет</span><span class="dropdown-icon"><img src="../assets/ui/id_page.svg" alt=""></span></a>
                        <a href="#"><span>Настройки</span><span class="dropdown-icon"><img src="../assets/ui/settings.svg" alt=""></span></a>
                        <a href="#" class="logout-link"><span>Выйти</span><span class="dropdown-icon"><img src="../assets/ui/logout.svg" alt=""></span></a>
                    </div>
                </div>
            </span>
        </div>
    </header>
    </div>
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
    <div class="container">
        <footer>
            <div class="footer_inner">
                <div class="footer_logo">
                    <img src="../assets/logo/another_logo.svg" alt="Logo">
                </div>
                <span class="footer_links">
                    <a href="#">О сервисе</a>
                    <a href="#">Контакты</a>
                    <a href="#">Политика конфиденциальности</a>
                </span>
            </div>
        </footer>
    </div>

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
            <label>
                Название мероприятия
                <input type="text" id="eventTitle" name="title" placeholder="Название" />
            </label>
            <label>
                Дата
                <input type="date" id="eventDate" name="date" />
            </label>
            <label>
                Описание
                <textarea id="eventDescription" name="description" placeholder="Короткое описание (необязательно)"></textarea>
            </label>
            <div class="modal-actions">
                <button type="button" class="modal-cancel" id="cancelModal">Отмена</button>
                <button type="submit" class="modal-save">Создать</button>
            </div>
        </form>
    </div>
    <script src="../js/calendar.js"></script>
</body>
</html>
