<div class="container">
    <header>
        <div class="header_inner">
            <a href="./calendar.php" class="logo" aria-label="Перейти в календарь">
                <img src="../assets/logo/main_logo.png" alt="Logo">
            </a>
            <span class="header_links">
                <a href="#upcomingEventsModal" id="upcomingEventsTrigger" aria-haspopup="dialog" aria-controls="upcomingEventsModal">Мероприятия</a>
                <a href="./analytics.php">Аналитика</a>
                <a href="./calendar.php">Календарь</a>
                <div class="user-menu">
                    <button type="button" class="user-link" id="userToggle">
                        Имя Пользователя <img src="../assets/ui/user.svg" alt="">
                    </button>
                    <div class="user-dropdown" id="userDropdown">
                        <a href="./profile.php"><span>Личный кабинет</span><span class="dropdown-icon"><img src="../assets/ui/id_page.svg" alt=""></span></a>
                        <a href="./settings.php"><span>Настройки</span><span class="dropdown-icon"><img src="../assets/ui/settings.svg" alt=""></span></a>
                        <a href="#" class="logout-link"><span>Выйти</span><span class="dropdown-icon"><img src="../assets/ui/logout.svg" alt=""></span></a>
                    </div>
                </div>
            </span>
        </div>
    </header>
</div>
<div class="upcoming-events-overlay" id="upcomingEventsOverlay"></div>
<section class="upcoming-events-modal" id="upcomingEventsModal" role="dialog" aria-modal="true" aria-labelledby="upcomingEventsTitle" aria-hidden="true">
    <div class="upcoming-events-header">
        <div>
            <h2 id="upcomingEventsTitle">Ближайшие мероприятия</h2>
        </div>
        <button type="button" class="upcoming-events-close" id="closeUpcomingEvents" aria-label="Закрыть">
            <img src="../assets/ui/close.svg" alt="">
        </button>
    </div>
    <div class="upcoming-events-list" id="upcomingEventsList" aria-live="polite"></div>
    <a class="upcoming-events-calendar-link" href="./calendar.php">Открыть календарь</a>
</section>
<script src="../js/ui.js"></script>
<script src="../js/upcoming-events.js"></script>
