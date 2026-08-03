<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Регистрация</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="icon" type="image/x-icon" href="../assets/logo/favicon.svg">
</head>
<body>
    <main>
        <div class="auth-container">
            <div class="auth-wrapper">
                <div class="auth-header">
                    <div class="welcome-text">Добро пожаловать на сервис учета мероприятий</div>
                    <img src="../assets/logo/main_logo.png" alt="logo" class="auth-logo">
                </div>
                <div class="auth-box">
                    <div class="text-auth">Регистрация</div>
                    <form action="/register.php" method="post" class="auth-form register-form">
                        <label for="first-name">Имя</label>
                        <input id="first-name" name="first_name" type="text" required>

                        <label for="last-name">Фамилия</label>
                        <input id="last-name" name="last_name" type="text" required>

                        <label for="patronymic">Отчество</label>
                        <input id="patronymic" name="patronymic" type="text">

                        <label for="student-id">Номер студенческого билета</label>
                        <input id="student-id" name="student_id" type="text" required>

                        <label for="faculty">Факультет</label>
                        <select id="faculty" name="faculty" required>
                            <option value="">Выберите факультет</option>
                            <option value="it">ФАИТ</option>
                            <option value="economics">ИЭФ</option>
                            <option value="law">ФММТ</option>
                        </select>

                        <label for="group">Группа</label>
                        <input id="group" name="group" type="text" required>

                        <label for="register-login">Логин</label>
                        <input id="register-login" name="register_login" type="text" required>

                        <label for="register-password">Пароль</label>
                        <input id="register-password" name="register_password" type="password" required>

                        <label for="confirm-password">Повторите пароль</label>
                        <input id="confirm-password" name="confirm_password" type="password" required>

                        <label>Капча</label>
                        <div class="captcha-placeholder">[CAPTCHA]</div>

                        <div class="checkbox-row">
                            <input id="agree" name="agree" type="checkbox">
                            <label for="agree" class="checkbox-label">Я ознакомлен с условиями <a href="#">использования</a></label>
                        </div>

                        <button type="submit" class="btn-login">Зарегистрироваться</button>
                    </form>

                    <p class="auth-switch">
                        Уже есть аккаунт? <a href="../index.php">Войдите</a>
                    </p>
                </div>
            </div>
        </div>
    </main>
    <script src="../js/ui.js"></script>
</body>
</html>
