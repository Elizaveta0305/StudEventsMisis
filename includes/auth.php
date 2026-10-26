<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

const STUD_ROLES = [
    'student' => [
        'label' => 'Студент',
        'name' => 'Розенко Елизавета Максимовна',
        'permissions' => ['profile', 'student_analytics', 'notice_view'],
    ],
    'employee' => [
        'label' => 'Сотрудник',
        'name' => 'Мартынова Анна Михайловна',
        'permissions' => ['profile', 'analytics', 'admin', 'create_event', 'edit_event', 'delete_event', 'notice_send', 'notice_view'],
    ],
    'teacher' => [
        'label' => 'Преподаватель',
        'name' => 'Ковтун Нелли Игоревна',
        'permissions' => [],
    ],
];

if (isset($_GET['as']) && isset(STUD_ROLES[$_GET['as']])) {
    $_SESSION['role'] = $_GET['as'];
}

$studRole = $_SESSION['role'] ?? 'student';
if (!isset(STUD_ROLES[$studRole])) {
    $studRole = 'student';
}
$studUser = STUD_ROLES[$studRole];

function stud_can(string $permission): bool
{
    global $studUser;
    return in_array($permission, $studUser['permissions'], true);
}

function stud_require(string $permission): void
{
    if (!stud_can($permission)) {
        header('Location: ./calendar.php');
        exit;
    }
}