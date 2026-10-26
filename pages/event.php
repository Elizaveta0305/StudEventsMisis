<?php
require_once '../includes/auth.php';
$events = [
    'event-1' => [
        'title' => 'Хахакмекфест 2027',
        'type' => 'Научное',
        'level' => 'Всероссийский',
        'date' => '12 августа 2027',
        'dateISO' => '2027-08-12',
        'time' => '14:00',
        'location' => 'Главный корпус МИСИС',
        'signer' => 'Анна Михайловна Мартынова',
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

$event = $events[$eventId] ?? [
    'title' => 'Мероприятие',
    'type' => 'Научное',
    'level' => 'Университетский',
    'date' => '',
    'dateISO' => '',
    'time' => '',
    'location' => '',
    'signer' => '',
    'cover' => '',
    'description' => '',
    'students' => ['Организаторы' => [], 'Волонтёры' => [], 'Участники' => []],
    'orderFile' => null
];

$studentDirectory = [];
foreach ($events as $eventRecord) {
    foreach ($eventRecord['students'] as $students) {
        foreach ($students as $student) {
            $studentDirectory[$student['name']] = $student;
        }
    }
}

$memoName = 'Служебная записка — ' . ($event['title'] ?? 'Мероприятие') . '.doc';
$orderFile = $event['orderFile'] ?? null;
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($event['title'], ENT_QUOTES, 'UTF-8') ?> · Мероприятие</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/pages/event.css?v=16">
    <link rel="icon" type="image/x-icon" href="../assets/logo/favicon.svg">
</head>
<body>
    <?php include '../includes/header.php'; ?>

    <div class="container">
        <main class="event-page">
            <div class="event-page-toolbar">
                <a class="event-back-link" href="../pages/calendar.php">← Вернуться в календарь</a>
                <?php if (stud_can('edit_event')): ?>
                    <div class="event-page-actions">
                        <button class="event-edit-button" id="eventEditButton" type="button">Редактировать</button>
                        <button class="event-edit-button event-edit-save" id="eventSaveButton" type="button" hidden>Сохранить</button>
                        <button class="event-edit-button event-edit-cancel" id="eventCancelButton" type="button" hidden>Отмена</button>
                    </div>
                <?php endif; ?>
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
                        <div class="info-level-card">
                            <div class="event-document-type" data-event-type><?= htmlspecialchars($event['type'], ENT_QUOTES, 'UTF-8') ?></div>
                            <div class="event-level-tag" data-event-level><?= htmlspecialchars($event['level'], ENT_QUOTES, 'UTF-8') ?></div> 
                        </div>
                </header>

                <dl class="event-properties" aria-label="Параметры мероприятия">
                    <div class="event-property">
                        <dt>Дата</dt>
                        <dd data-event-date data-date-iso="<?= htmlspecialchars($event['dateISO'] ?? '', ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($event['date'] ?? 'Не указана', ENT_QUOTES, 'UTF-8') ?></dd>
                    </div>
                    <div class="event-property">
                        <dt>Время</dt>
                        <dd data-event-time><?= htmlspecialchars($event['time'] ?? 'Не указано', ENT_QUOTES, 'UTF-8') ?></dd>
                    </div>
                    <div class="event-property event-property-location">
                        <dt>Место проведения</dt>
                        <dd data-event-location><?= htmlspecialchars($event['location'] ?? 'Не указано', ENT_QUOTES, 'UTF-8') ?></dd>
                    </div>
                    <div class="event-property">
                        <dt>Ответственный</dt>
                        <dd data-event-signer><?= htmlspecialchars($event['signer'] ?? 'Не указан', ENT_QUOTES, 'UTF-8') ?></dd>
                    </div>
                </dl>

                <section class="event-description" aria-labelledby="eventDescriptionTitle" data-event-description-section>
                    <h2 id="eventDescriptionTitle">О мероприятии</h2>
                    <p data-event-description><?= htmlspecialchars($event['description'] ?? '', ENT_QUOTES, 'UTF-8') ?></p>
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
                        <?php
                        $studentsData = $event['students'] ?? ['Организаторы' => [], 'Волонтёры' => [], 'Участники' => []];
                        foreach ($studentsData as $role => $students):
                            $roleId = [
                                'Организаторы' => 'organizers',
                                'Волонтёры' => 'volunteers',
                                'Участники' => 'participants'
                            ][$role] ?? 'participants';
                        ?>
                            <section class="event-role" aria-label="<?= htmlspecialchars($role, ENT_QUOTES, 'UTF-8') ?>" data-event-role="<?= $roleId ?>">
                                <h3><?= htmlspecialchars($role, ENT_QUOTES, 'UTF-8') ?> <span><?= count($students) ?></span></h3>
                                <hr class="line-card">
                                <ul data-role-list>
                                    <?php if (!empty($students)): foreach ($students as $student): ?>
                                        <li class="event-person">
                                            <span class="event-person-avatar" aria-hidden="true"><?= htmlspecialchars($student['initials'] ?? '', ENT_QUOTES, 'UTF-8') ?></span>
                                            <span class="event-person-details">
                                                <strong><?= htmlspecialchars($student['name'] ?? '', ENT_QUOTES, 'UTF-8') ?></strong>
                                                <small><?= htmlspecialchars($student['group'] ?? '', ENT_QUOTES, 'UTF-8') ?></small>
                                            </span>
                                        </li>
                                    <?php endforeach; else: ?>
                                        <li class="event-role-empty">Список пока не заполнен</li>
                                    <?php endif; ?>
                                </ul>
                            </section>
                        <?php endforeach; ?>
                    </div>
                </section>

                <section class="event-attachments" aria-labelledby="eventAttachmentsTitle" data-event-attachments>
                    <div class="event-team-heading">
                        <div>
                            <p class="event-section-kicker">МАТЕРИАЛЫ</p>
                            <h2 id="eventAttachmentsTitle">Документы мероприятия</h2>
                        </div>
                    </div>

                    <div class="event-files-list">
                        <div class="event-file-card" data-event-memo-card>
                            <div class="event-file-info">
                                <span class="event-file-badge" aria-hidden="true">W</span>
                                <div class="event-file-details">
                                    <strong data-event-memo-name><?= htmlspecialchars($memoName, ENT_QUOTES, 'UTF-8') ?></strong>
                                    <small data-event-memo-meta>Служебная записка · Формируется автоматически из данных мероприятия</small>
                                </div>
                            </div>

                            <div class="event-file-actions">
                                <a class="event-file-download" data-event-memo-download href="#" download="<?= htmlspecialchars($memoName, ENT_QUOTES, 'UTF-8') ?>">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                        <polyline points="7 10 12 15 17 10"/>
                                        <line x1="12" y1="15" x2="12" y2="3"/>
                                    </svg>
                                    <span>Скачать файл</span>
                                </a>
                            </div>
                        </div>

                        <div class="event-file-card" data-event-order-card <?= empty($orderFile) ? 'hidden' : '' ?>>
                            <div class="event-file-info">
                                <span class="event-file-badge" data-event-order-ext aria-hidden="true">
                                    <?= htmlspecialchars($orderFile['ext'] ?? 'PDF', ENT_QUOTES, 'UTF-8') ?>
                                </span>
                                <div class="event-file-details">
                                    <strong data-event-order-name><?= htmlspecialchars($orderFile['name'] ?? 'Приказ не прикреплён', ENT_QUOTES, 'UTF-8') ?></strong>
                                    <small data-event-order-meta><?= !empty($orderFile) ? htmlspecialchars(($orderFile['size'] ?? '') . ' · Приказ о мероприятии', ENT_QUOTES, 'UTF-8') : 'Прикрепите файл приказа, если он требуется для мероприятия' ?></small>
                                </div>
                            </div>

                            <div class="event-file-actions">
                                <a class="event-file-download" data-event-order-download href="<?= htmlspecialchars($orderFile['url'] ?? '#', ENT_QUOTES, 'UTF-8') ?>" download="<?= htmlspecialchars($orderFile['name'] ?? 'order.pdf', ENT_QUOTES, 'UTF-8') ?>" <?= empty($orderFile) ? 'hidden' : '' ?>>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                        <polyline points="7 10 12 15 17 10"/>
                                        <line x1="12" y1="15" x2="12" y2="3"/>
                                    </svg>
                                    <span>Скачать приказ</span>
                                </a>

                                <div class="event-file-edit-controls" data-order-edit-actions hidden>
                                    <input type="file" id="eventOrderInput" data-event-order-input accept=".pdf,.doc,.docx" hidden>
                                    <label for="eventOrderInput" class="event-file-upload-btn">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                            <polyline points="17 8 12 3 7 8"/>
                                            <line x1="12" y1="3" x2="12" y2="15"/>
                                        </svg>
                                        <span data-event-order-btn-text><?= !empty($orderFile) ? 'Заменить приказ' : 'Загрузить приказ' ?></span>
                                    </label>
                                    <button type="button" class="event-file-reset-btn" data-event-order-remove <?= empty($orderFile) ? 'hidden' : '' ?>>
                                        Удалить приказ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </article>
        </main>
    </div>

    <?php include '../includes/footer.php'; ?>
    <script type="application/json" id="eventInitialData"><?= json_encode($event, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) ?></script>
    <script type="application/json" id="eventStudentDirectory"><?= json_encode(array_values($studentDirectory), JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) ?></script>
    <script src="../js/custom-select.js?v=6"></script>
    <script src="../js/event-details.js?v=13"></script>
</body>
</html>