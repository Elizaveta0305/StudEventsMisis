<?php
require_once '../includes/auth.php';
stud_require('notice_view');
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Уведомление</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css?v=9">
    <link rel="icon" type="image/x-icon" href="../assets/logo/favicon.svg">
</head>
<body data-no-notice-popup="true">
    <?php include '../includes/header.php'; ?>
    <div class="container">
        <main class="notice-page">
            <a class="event-back-link" href="./profile.php">← Вернуться в личный кабинет</a>
            <article class="notice-document" id="noticeDocument" aria-live="polite"></article>
        </main>
    </div>
    <?php include '../includes/footer.php'; ?>
    <script src="../js/notice-page.js?v=1"></script>
</body>
</html>