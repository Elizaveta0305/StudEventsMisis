<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Контакты</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/pages/contacts.css">
    <link rel="icon" type="image/x-icon" href="../assets/logo/favicon.svg">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    <div class="container">
        <main class="contacts-page">
            <div class="contacts-header">
                <div class="contacts-title">Контакты</div>
                <p class="contacts-subtitle">Найдите нас на карте и свяжитесь с нами</p>
            </div>

            <section class="contacts-section">
                <div class="contacts-content">
                    <div class="contact-info-block">
                        <div class="contact-info-title">СТИ НИТУ МИСИС</div>
                        <div class="contact-details">
                            <div class="contact-detail-item">
                                <span class="detail-label">Адрес:</span>
                                <span class="detail-value">Старый Оскол, микрорайон Макаренко, 42, корп. 1</span>
                            </div>
                            <div class="contact-detail-item">
                                <span class="detail-label">Телефон:</span>
                                <span class="detail-value">+7 (4725) 45-12-22</span>
                            </div>
                            <div class="contact-detail-item">
                                <span class="detail-label">Email:</span>
                                <span class="detail-value">info@misis.ru</span>
                            </div>
                            <div class="contact-detail-item">
                                <span class="detail-label">Веб-сайт:</span>
                                <span class="detail-value"><a href="http://sf.misis.ru/" target="_blank">sf.misis.ru</a></span>
                            </div>
                        </div>
                    </div>

                    <div id="contacts-map" class="contacts-map">
                        <div style="position:relative;overflow:hidden;width:100%;height:100%;"><a href="https://yandex.ru/maps/org/sti_nitu_misis/1070568256/?utm_medium=mapframe&utm_source=maps" style="color:#eee;font-size:12px;position:absolute;top:0px;z-index:1;"></a><a href="https://yandex.ru/maps/10649/stariy-oskol/category/university/184106140/?utm_medium=mapframe&utm_source=maps" style="color:#eee;font-size:12px;position:absolute;top:14px;z-index:1;"></a><iframe src="https://yandex.ru/map-widget/v1/org/sti_nitu_misis/1070568256/?ll=37.880536%2C51.312732&z=16" width="100%" height="100%" frameborder="0" allowfullscreen="true" style="position:relative;border-radius:12px;"></iframe></div>
                    </div>
                </div>
            </section>
        </main>
    </div>
    <?php include '../includes/footer.php'; ?>
</body>
</html>
