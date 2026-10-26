<?php require_once __DIR__ . '/auth.php'; ?>
<div class="container">
    <header>
        <div class="header_inner">
            <a href="./calendar.php" class="logo" aria-label="Перейти в календарь">
                <img src="../assets/logo/misis_logo.png" alt="Logo" class="logo-light">
                <img src="../assets/logo/misis_logo_dark.png" alt="" class="logo-dark" aria-hidden="true">
            </a>
            
            <div class="nav-toggle" id="navToggle" aria-label="Открыть меню" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </div>

            <span class="header_links">
                <a href="#upcomingEventsModal" id="upcomingEventsTrigger" aria-haspopup="dialog" aria-controls="upcomingEventsModal">Мероприятия</a>
                <?php if (stud_can('analytics')): ?>
                <a href="./analytics.php">Аналитика</a>
                <?php endif; ?>
                <?php if (stud_can('admin')): ?>
                <a href="./admin.php">Управление</a>
                <?php endif; ?>
                <a href="./calendar.php">Календарь</a>
                <div class="user-menu">
                    <button type="button" class="user-link" id="userToggle">
                        <span data-user-name><?= htmlspecialchars(preg_replace('/^([А-ЯЁ][а-яё\-]+)\s+([А-ЯЁ])[а-яё\-]+(?:\s+([А-ЯЁ])[а-яё\-]+)?/u', '$1 $2.$3.', trim($studUser['name'] ?? '')), ENT_QUOTES, 'UTF-8') ?></span> <img src="../assets/ui/user.svg" alt="">
                    </button>
                    <div class="user-dropdown" id="userDropdown">
                        <?php if (stud_can('profile')): ?>
                        <a href="./profile.php"><span>Личный кабинет</span><span class="dropdown-icon"><img src="../assets/ui/id_page.svg" alt=""></span></a>
                        <?php endif; ?>
                        <a href="./settings.php"><span>Настройки</span><span class="dropdown-icon"><img src="../assets/ui/settings.svg" alt=""></span></a>
                        <a href="#" class="logout-link"><span>Выйти</span><span class="dropdown-icon"><img src="../assets/ui/logout.svg" alt=""></span></a>
                        <div class="user-role-switch" role="group" aria-label="Роль для демонстрации">
                            <span class="user-role-switch-title">Роль</span>
                            <?php foreach (STUD_ROLES as $roleKey => $roleData): ?>
                            <a href="?<?= htmlspecialchars(http_build_query(array_merge($_GET, ['as' => $roleKey])), ENT_QUOTES, 'UTF-8') ?>" class="user-role-option<?= $roleKey === $studRole ? ' is-active' : '' ?>"><?= htmlspecialchars($roleData['label'], ENT_QUOTES, 'UTF-8') ?></a>
                            <?php endforeach; ?>
                        </div>
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

<script>
window.StudAuth = {
    role: <?= json_encode($studRole) ?>,
    permissions: <?= json_encode($studUser['permissions']) ?>,
    can: function(permission){ return this.permissions.indexOf(permission) !== -1; }
};
</script>
<script src="../js/ui.js"></script>
<script src="../js/confirm-dialog.js?v=1"></script>
<script src="../js/notices.js?v=1"></script>
<script src="../js/upcoming-events.js"></script>
<script src="../js/nav.js"></script>