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
    <?php include '../includes/header.php'; ?>
    <div class="container">
        <main class="settings-page">
            <div class="settings-header">
                <div>
                    <div class="settings-title">Настройки</div>
                </div>
            </div>

            <section class="settings-panel">
                <div class="settings-row">
                    <div class="settings-label-group">
                        <div class="settings-row-title">Внешний вид</div>
                        <p class="settings-row-text">Выберите тему оформления интерфейса.</p>
                    </div>

                    <label class="settings-select-wrap" aria-label="Выбор темы интерфейса">
                        <select id="themeSelect" class="settings-select">
                            <option value="light">Светлая</option>
                            <option value="dark">Тёмная</option>
                        </select>
                    </label>
                </div>
            </section>
            <section class="settings-panel">
                <div class="settings-row">
                    <div class="settings-label-group">
                        <div class="settings-row-title">Внешний вид</div>
                        <p class="settings-row-text">Выберите тему оформления интерфейса.</p>
                    </div>

                    <label class="settings-select-wrap" aria-label="Выбор темы интерфейса">
                        <select id="themeSelectSecondary" class="settings-select">
                            <option value="light">Светлая</option>
                            <option value="dark">Тёмная</option>
                        </select>
                    </label>
                </div>
            </section>
        </main>
    </div>
<?php include '../includes/footer.php'; ?>
    <script src="../js/settings.js"></script>
</body>
</html>
