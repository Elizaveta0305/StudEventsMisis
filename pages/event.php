<?php
$events = [
    'event-1' => [
        'title' => 'Хахакмекфест 2027',
        'type' => 'Научное',
        'level' => 'Всероссийский',
        'date' => '12 августа 2027',
        'dateISO' => '2027-08-12',
        'time' => '14:00',
        'location' => 'Главный корпус МИСИС',
        'signer' => 'Анна Сергеевна Мартынова',
        'cover' => '',
        'description' => 'Хакатон для студентов и школьников. Участники объединяются в команды, чтобы за один день разработать и представить собственные проекты.',
        'students' => [
            'Организаторы' => [
                ['initials' => 'ЕР', 'name' => 'Елизавета Розенко', 'group' => 'ИТ-23']
            ],
            'Волонтёры' => [
                ['initials' => 'АИ', 'name' => 'Александра Иванова', 'group' => 'ИТ-23'],
                ['initials' => 'ДС', 'name' => 'Даниил Смирнов', 'group' => 'Э/Ц-24']
            ],
            'Участники' => [
                ['initials' => 'МП', 'name' => 'Михаил Петров', 'group' => 'ИТ-22'],
                ['initials' => 'МК', 'name' => 'Мария Кузнецова', 'group' => 'ИТ-23']
            ]
        ]
    ],
    'event-2' => [
        'title' => 'День открытых дверей',
        'type' => 'Общественное',
        'level' => 'Университетский',
        'date' => '1 сентября 2026',
        'dateISO' => '2026-09-01',
        'time' => '10:00',
        'location' => 'Главный корпус МИСИС',
        'signer' => 'Наталья Викторовна Петрова',
        'cover' => '',
        'description' => 'Знакомство абитуриентов с университетом, образовательными программами и студенческой жизнью.',
        'students' => [
            'Организаторы' => [
                ['initials' => 'МП', 'name' => 'Михаил Петров', 'group' => 'ИТ-22']
            ],
            'Волонтёры' => [
                ['initials' => 'ЕР', 'name' => 'Елизавета Розенко', 'group' => 'ИТ-23']
            ],
            'Участники' => [
                ['initials' => 'АИ', 'name' => 'Александра Иванова', 'group' => 'ИТ-23'],
                ['initials' => 'МК', 'name' => 'Мария Кузнецова', 'group' => 'ИТ-23']
            ]
        ]
    ],
    'event-3' => [
        'title' => 'Погружение 2026',
        'type' => 'Городское',
        'level' => 'Городской',
        'date' => '25 августа 2026',
        'dateISO' => '2026-08-25',
        'time' => '16:30',
        'location' => 'Университетский кампус',
        'signer' => 'Ольга Александровна Иванова',
        'cover' => '',
        'description' => 'Встреча для знакомства и сплочения студентов. В программе командные задания, экскурсия по кампусу и общение.',
        'students' => [
            'Организаторы' => [
                ['initials' => 'ДС', 'name' => 'Даниил Смирнов', 'group' => 'Э/Ц-24']
            ],
            'Волонтёры' => [
                ['initials' => 'МК', 'name' => 'Мария Кузнецова', 'group' => 'ИТ-23'],
                ['initials' => 'АИ', 'name' => 'Александра Иванова', 'group' => 'ИТ-23']
            ],
            'Участники' => [
                ['initials' => 'ЕР', 'name' => 'Елизавета Розенко', 'group' => 'ИТ-23'],
                ['initials' => 'МП', 'name' => 'Михаил Петров', 'group' => 'ИТ-22']
            ]
        ]
    ]
];

$eventId = $_GET['id'] ?? 'event-1';
$event = $events[$eventId] ?? $events['event-1'];
$studentDirectory = [];
foreach ($events as $eventRecord) {
    foreach ($eventRecord['students'] as $students) {
        foreach ($students as $student) {
            $studentDirectory[$student['name']] = $student;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($event['title'], ENT_QUOTES, 'UTF-8') ?> · Мероприятие</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/pages/event.css?v=11">
    <link rel="icon" type="image/x-icon" href="../assets/logo/favicon.svg">
</head>
<body>
    <?php include '../includes/header.php'; ?>

    <div class="container">
        <main class="event-page">
            <div class="event-page-toolbar">
                <a class="event-back-link" href="../pages/calendar.php">← Вернуться в календарь</a>
                <div class="event-page-actions">
                    <button class="event-edit-button" id="eventEditButton" type="button">Редактировать</button>
                    <button class="event-edit-button event-edit-save" id="eventSaveButton" type="button" hidden>Сохранить</button>
                    <button class="event-edit-button event-edit-cancel" id="eventCancelButton" type="button" hidden>Отмена</button>
                </div>
            </div>

            <article class="event-document" id="eventDocument" data-event-id="<?= htmlspecialchars($eventId, ENT_QUOTES, 'UTF-8') ?>">
                <div class="event-cover" data-event-cover>
                    <?php if (!empty($event['cover'])): ?>
                        <img src="<?= htmlspecialchars($event['cover'], ENT_QUOTES, 'UTF-8') ?>" alt="Обложка: <?= htmlspecialchars($event['title'], ENT_QUOTES, 'UTF-8') ?>">
                    <?php else: ?>
                        <div class="event-cover-placeholder" role="img" aria-label="Обложка мероприятия не добавлена">
                            <span>Обложка мероприятия</span>
                        </div>
                    <?php endif; ?>
                </div>
                <header class="event-document-header">
                    <h1 data-event-title><?= htmlspecialchars($event['title'], ENT_QUOTES, 'UTF-8') ?></h1>
                    <div class="event-document-type" data-event-type><?= htmlspecialchars($event['type'], ENT_QUOTES, 'UTF-8') ?></div>
                    <div class="event-level-tag" data-event-level><?= htmlspecialchars($event['level'], ENT_QUOTES, 'UTF-8') ?></div>
                    <p class="event-document-lead">Информация о мероприятии и закреплённых студентах</p>
                </header>

                <dl class="event-properties" aria-label="Параметры мероприятия">
                    <div class="event-property">
                        <dt>Дата</dt>
                        <dd data-event-date data-date-iso="<?= htmlspecialchars($event['dateISO'], ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($event['date'], ENT_QUOTES, 'UTF-8') ?></dd>
                    </div>
                    <div class="event-property">
                        <dt>Время</dt>
                        <dd data-event-time><?= htmlspecialchars($event['time'], ENT_QUOTES, 'UTF-8') ?></dd>
                    </div>
                    <div class="event-property event-property-location">
                        <dt>Место проведения</dt>
                        <dd data-event-location><?= htmlspecialchars($event['location'], ENT_QUOTES, 'UTF-8') ?></dd>
                    </div>
                    <div class="event-property">
                        <dt>Ответственный</dt>
                        <dd data-event-signer><?= htmlspecialchars($event['signer'], ENT_QUOTES, 'UTF-8') ?></dd>
                    </div>
                </dl>

                <section class="event-description" aria-labelledby="eventDescriptionTitle" data-event-description-section>
                    <h2 id="eventDescriptionTitle">О мероприятии</h2>
                    <p data-event-description><?= htmlspecialchars($event['description'], ENT_QUOTES, 'UTF-8') ?></p>
                    <label class="event-description-edit-option" data-description-edit-option hidden>
                        <input type="checkbox" data-description-hidden>
                        <span>Скрыть описание на странице мероприятия</span>
                    </label>
                </section>

                <section class="event-team" aria-labelledby="eventTeamTitle">
                    <div class="event-team-heading">
                        <div>
                            <p class="event-section-kicker">КОМАНДА</p>
                            <h2 id="eventTeamTitle">Студенты</h2>
                        </div>
                    </div>

                    <div class="event-role-grid" data-event-roles>
                        <?php foreach ($event['students'] as $role => $students): ?>
                            <?php
                            $roleId = [
                                'Организаторы' => 'organizers',
                                'Волонтёры' => 'volunteers',
                                'Участники' => 'participants'
                            ][$role] ?? 'participants';
                            ?>
                            <section class="event-role" aria-label="<?= htmlspecialchars($role, ENT_QUOTES, 'UTF-8') ?>" data-event-role="<?= $roleId ?>">
                                <h3><?= htmlspecialchars($role, ENT_QUOTES, 'UTF-8') ?> <span><?= count($students) ?></span></h3>
                                <ul data-role-list>
                                    <?php foreach ($students as $student): ?>
                                        <li class="event-person">
                                            <span class="event-person-avatar" aria-hidden="true"><?= htmlspecialchars($student['initials'], ENT_QUOTES, 'UTF-8') ?></span>
                                            <span class="event-person-details">
                                                <strong><?= htmlspecialchars($student['name'], ENT_QUOTES, 'UTF-8') ?></strong>
                                                <small><?= htmlspecialchars($student['group'], ENT_QUOTES, 'UTF-8') ?></small>
                                            </span>
                                        </li>
                                    <?php endforeach; ?>
                                </ul>
                            </section>
                        <?php endforeach; ?>
                    </div>
                </section>
            </article>
        </main>
    </div>

    <?php include '../includes/footer.php'; ?>
    <script type="application/json" id="eventInitialData"><?= json_encode($event, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) ?></script>
    <script type="application/json" id="eventStudentDirectory"><?= json_encode(array_values($studentDirectory), JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) ?></script>
    <script src="../js/custom-select.js?v=6"></script>
    <script src="../js/event-details.js?v=8"></script>
</body>
</html>