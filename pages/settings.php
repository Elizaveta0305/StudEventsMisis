<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Настройки</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/pages/settings.css">
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
                    <a href="../pages/calendar.php">Календарь</a>
                    <div class="user-menu">
                        <button type="button" class="user-link" id="userToggle">
                            Имя Пользователя <img src="../assets/ui/user.svg" alt="">
                        </button>
                        <div class="user-dropdown" id="userDropdown">
                            <a href="../pages/profile.php"><span>Личный кабинет</span><span class="dropdown-icon"><img src="../assets/ui/id_page.svg" alt=""></span></a>
                            <a href="../pages/settings.php"><span>Настройки</span><span class="dropdown-icon"><img src="../assets/ui/settings.svg" alt=""></span></a>
                            <a href="#" class="logout-link"><span>Выйти</span><span class="dropdown-icon"><img src="../assets/ui/logout.svg" alt=""></span></a>
                        </div>
                    </div>
                </span>
            </div>
        </header>
    </div>
    <div class="container">
        <main class="settings-page">
            <div class="settings-header">
                <div>
                    <div class="settings-title">Настройки</div>
                </div>
            </div>
            <section class="settings-grid">
                <article class="settings-card">
                    <div class="settings-card-title">Внешний вид</div>
                    <p class="settings-card-text">Выберите тему оформления и переключайтесь между светлым и тёмным режимом.</p>
                    <div class="theme-switch-wrapper">
                        <label class="theme-switch">
                            <input type="radio" name="theme" value="light" id="themeLight">
                            <span class="theme-switch-box"></span>
                            <span>Светлая</span>
                        </label>
                        <label class="theme-switch">
                            <input type="radio" name="theme" value="dark" id="themeDark">
                            <span class="theme-switch-box"></span>
                            <span>Тёмная</span>
                        </label>
                    </div>
                </article>
            </section>
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
    <script src="../js/ui.js"></script>
    <script src="../js/settings.js"></script>
</body>
</html>
