<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, ['success' => false, 'message' => 'Méthode non autorisée.']);
}

if (session_status() !== PHP_SESSION_ACTIVE && !session_start()) {
    respond(500, ['success' => false, 'message' => 'Le formulaire est temporairement indisponible.']);
}

if (!empty($_POST['website'])) {
    respond(400, ['success' => false, 'message' => 'Soumission invalide.']);
}

$name = isset($_POST['name']) && is_string($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) && is_string($_POST['email']) ? trim($_POST['email']) : '';
$subject = isset($_POST['subject']) && is_string($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) && is_string($_POST['message']) ? trim($_POST['message']) : '';

if (
    $name === '' || strlen($name) > 100 ||
    $subject === '' || strlen($subject) > 150 ||
    $message === '' || strlen($message) > 5000 ||
    strlen($email) > 254 || filter_var($email, FILTER_VALIDATE_EMAIL) === false
) {
    respond(422, ['success' => false, 'message' => 'Vérifiez les champs du formulaire et réessayez.']);
}

$now = time();
$lastSentAt = isset($_SESSION['contact_last_sent_at']) ? (int) $_SESSION['contact_last_sent_at'] : 0;
if ($now - $lastSentAt < 30) {
    respond(429, ['success' => false, 'message' => 'Veuillez patienter avant d’envoyer un nouveau message.']);
}
$_SESSION['contact_last_sent_at'] = $now;

$receivingAddress = 'issiakaoued18@gmail.com';
$safeSubject = preg_replace('/[\r\n]+/', ' ', $subject);
$mailSubject = '=?UTF-8?B?' . base64_encode('Portfolio — ' . $safeSubject) . '?=';
$body = implode("\n", [
    'Nouveau message depuis le portfolio',
    '',
    'Nom : ' . $name,
    'E-mail : ' . $email,
    'Sujet : ' . $safeSubject,
    '',
    'Message :',
    $message
]);
$headers = [
    'From: Portfolio <' . $receivingAddress . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit'
];

if (!function_exists('mail')) {
    respond(503, ['success' => false, 'message' => 'L’envoi des e-mails n’est pas configuré sur cet hébergement.']);
}

if (!mail($receivingAddress, $mailSubject, $body, implode("\r\n", $headers))) {
    error_log('Portfolio contact email could not be sent.');
    respond(500, ['success' => false, 'message' => 'L’envoi du message a échoué. Réessayez plus tard.']);
}

respond(200, ['success' => true, 'message' => 'Message envoyé.']);
