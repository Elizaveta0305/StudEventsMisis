<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Авторизация</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/style.css">
    <link rel="icon" type="image/x-icon" href="./assets/logo/favicon.svg">
</head>
<body>
    <main>
            <div class="auth-container">
                <div class="auth-wrapper">
                    <div class="auth-header">
                        <div class="welcome-text">Добро пожаловать на сервис учета мероприятий</div>
                        <img src="./assets/logo/main_logo.png" alt="logo" class="auth-logo">
                    </div>
                    <div class="auth-box">
                        <div class="text-auth">Авторизация</div>
                        <form action="/login.php" method="post" class="auth-form login-form">
                            <label for="login">Логин</label>
                            <input id="login" name="login" type="text" required>

                            <label for="password">Пароль</label>
                            <input id="password" name="password" type="password" required>

                            <button type="submit" class="btn-login">Войти</button>

                            <p class="auth-switch">
                                Если у вас нет аккаунта, <a href="./pages/register.php">зарегистрируйтесь</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
    </main>
</body>
</html>
