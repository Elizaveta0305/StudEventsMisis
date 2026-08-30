<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>О сервисе</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/pages/about.css">
    <link rel="icon" type="image/x-icon" href="../assets/logo/favicon.svg">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    <div class="container">
        <main class="about-page">
            <div class="about-header">
                <div class="about-title">О сервисе</div>
                <p class="about-subtitle">Управление событиями и мероприятиями СТИ НИТУ МИСИС</p>
            </div>

            <section class="about-section">
                <div class="about-section-header">
                    <h2 class="about-section-title">О нас</h2>
                </div>
                <div class="about-section-content">
                    <p><b>StudEvents</b> — это современный сервис для управления мероприятиями и событиями в СТИ НИТУ МИСИС. Мы помогаем студентам и сотрудникам отслеживать, организовать и участвовать в событиях на единой удобной платформе.</p>
                    <p>Наша платформа предоставляет интуитивный интерфейс для просмотра календаря событий, управления расписанием и получения актуальной информации о предстоящих мероприятиях.</p>
                </div>
            </section>

            <section class="about-section">
                <div class="about-section-header">
                    <h2 class="about-section-title">Основные возможности</h2>
                </div>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-title">Календарь мероприятий</div>
                        <p class="feature-description">Просматривайте все события в удобном календарном формате с возможностью фильтрации и поиска.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-title">Управление профилем</div>
                        <p class="feature-description">Ведите свой личный кабинет, отслеживайте зарегистрированные события и просматривайте историю участий.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-title">Аналитика</div>
                        <p class="feature-description">Получайте статистику по мероприятиям и анализируйте участие в мероприятиях.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-title">Персонализация</div>
                        <p class="feature-description">Настраивайте внешний вид интерфейса в соответствии с вашими предпочтениями: светлая или тёмная тема.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-title">Документы</div>
                        <p class="feature-description">Доступ к документам и служебным запискам, сервис составит документы с вашими мероприятиями и посчитает баллы за вас.</p>
                    </div>
                </div>
            </section>

            <section class="about-section">
                <div class="about-section-header">
                    <h2 class="about-section-title">Как начать</h2>
                </div>
                <div class="about-section-content">
                    <ol class="steps-list">
                        <li><strong>Авторизуйтесь</strong> в системе используя ваши учетные данные</li>
                        <li><strong>Изучите календарь</strong> предстоящих мероприятий на главной странице</li>
                        <li><strong>Управляйте профилем</strong> и смотрите ваши зарегистрированные мероприятия</li>
                        <li><strong>Следите за аналитикой</strong> участия в событиях</li>
                    </ol>
                </div>
            </section>
        </main>
    </div>
    <?php include '../includes/footer.php'; ?>
</body>
</html>
