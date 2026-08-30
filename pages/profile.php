<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Личный кабинет</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/pages/profile.css">
    <link rel="icon" type="image/x-icon" href="../assets/logo/favicon.svg">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    <div class="container">
        <main class="profile-page">
            <div class="title-events-row">
                <div class="title-events">Личный кабинет</div>
                <div class="profile-badge">Студент</div>
            </div>
            <div class="profile-overview">
                <section class="profile-card">
                    <div class="profile-card-header">
                        <div class="profile-avatar">А</div>
                        <div>
                            <div class="profile-name">Андрей Марченко</div>
                            <div class="profile-subtitle">ФАИТ · Группа АТ-24</div>
                        </div>
                    </div>
                    <div class="profile-info-grid">
                        <div class="profile-info-item">
                            <span>Студенческий билет</span>
                            <strong>123456</strong>
                        </div>
                        <div class="profile-info-item">
                            <span>Email</span>
                            <strong>andrusha192@vk.com</strong>
                        </div>
                        <div class="profile-info-item">
                            <span>Факультет</span>
                            <strong>ФАИТ</strong>
                        </div>
                        <div class="profile-info-item">
                            <span>Группа</span>
                            <strong>AT-24</strong>
                        </div>
                        <div class="profile-info-item">
                            <span>Телефон</span>
                            <strong>+7 (952) 435-91-64</strong>
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
                        <a href="#" class="profile-link profile-link-secondary">Редактировать профиль</a>
                    </div>
                </aside>
            </div>
            <section class="profile-events">
                <div class="profile-events-header">
                    <div>
                        <div class="profile-events-title">Мероприятия</div>
                        <div class="profile-events-count">Всего мероприятий: 3</div>
                    </div>
                    <div class="profile-events-note">Вы можете открыть карточку, прочитать описание и скачать служебную записку.</div>
                </div>
                <div class="profile-event-filters">
                    <button type="button" class="filter-chip filter-chip-active">Все</button>
                    <button type="button" class="filter-chip">Спортивные</button>
                    <button type="button" class="filter-chip">Научные</button>
                    <button type="button" class="filter-chip">Общественные</button>
                    <button type="button" class="filter-chip">Городские</button>
                </div>
                <div class="profile-events-grid">
                    <article class="event-card-block">
                        <div class="event-card-meta">
                            <div class="event-card-date">12 авг · 14:00</div>
                            <div class="event-card-type">Научное</div>
                        </div>
                        <div class="event-card-title">Хахакмекфест 2027</div>
                        <p class="event-card-description">Хакатон для студентов и школьников.</p>
                        <div class="event-card-footer">
                            <a href="#" class="event-card-link">Подробнее</a>
                            <a href="#" class="event-card-download"><span class="download-icon"><img src="../assets/ui/download.svg" alt="Скачать"></span>Скачать</a>
                        </div>
                    </article>
                    <article class="event-card-block">
                        <div class="event-card-meta">
                            <div class="event-card-date">1 сен · 10:00</div>
                            <div class="event-card-type">Общественное</div>
                        </div>
                        <div class="event-card-title">День открытых дверей</div>
                        <p class="event-card-description">Линейка на территории университета.</p>
                        <div class="event-card-footer">
                            <a href="#" class="event-card-link">Подробнее</a>
                            <a href="#" class="event-card-download"><span class="download-icon"><img src="../assets/ui/download.svg" alt="Скачать"></span>Скачать</a>
                        </div>
                    </article>
                    <article class="event-card-block">
                        <div class="event-card-meta">
                            <div class="event-card-date">25 авг · 16:30</div>
                            <div class="event-card-type">Городское</div>
                        </div>
                        <div class="event-card-title">Погружение 2026</div>
                        <p class="event-card-description">Мероприятие для сплочения студентов.</p>
                        <div class="event-card-footer">
                            <a href="#" class="event-card-link">Подробнее</a>
                            <a href="#" class="event-card-download"><span class="download-icon"><img src="../assets/ui/download.svg" alt="Скачать"></span>Скачать</a>
                        </div>
                    </article>
                </div>
            </section>
        </main>
    </div>
    <?php include '../includes/footer.php'; ?>
    <script src="../js/calendar.js"></script>
</body>
</html>
