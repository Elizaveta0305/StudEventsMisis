<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Аналитика мероприятий</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/pages/analytics.css">
    <link rel="icon" type="image/x-icon" href="../assets/logo/favicon.svg">
</head>
<body>
    <?php include '../includes/header.php'; ?>

    <div class="container">
        <main class="employee-page">
            <div class="employee-header">
                <h1 class="employee-title">Аналитика мероприятий</h1>
            </div>

            <section class="employee-controls">
                <label class="search-field" aria-label="Поиск студента">
                    <span>Поиск</span>
                    <input id="studentSearch" type="text" placeholder="Введите имя, группу или факультет">
                </label>

                <label class="select-field" aria-label="Фильтр по факультету">
                    <span>Факультет</span>
                    <select id="facultyFilter">
                        <option value="all">Все факультеты</option>
                    </select>
                </label>
            </section>

            <section class="employee-panel">
                <div id="studentDetails" class="student-details"></div>
            </section>
        </main>
    </div>

    <?php include '../includes/footer.php'; ?>

    <script src="../js/analytics.js"></script>
</body>
</html>
