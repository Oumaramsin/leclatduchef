<?php
// contact.php
header('Content-Type: application/json');

// Récupération des données JSON envoyées par fetch()
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    // Si ce n'est pas du JSON, on tente de lire un POST classique
    $data = $_POST;
}

$prenom = $data['prenom'] ?? '';
$nom = $data['nom'] ?? '';
$email = $data['email'] ?? '';
$telephone = $data['telephone'] ?? '';
$prestation = $data['prestation'] ?? '';
$convives = $data['convives'] ?? '';
$evenement = $data['evenement'] ?? '';
$lieu = $data['lieu'] ?? '';
$message = $data['message'] ?? '';
$recaptchaResponse = $data['g-recaptcha-response'] ?? '';

/* --- CAPTCHA DÉSACTIVÉ TEMPORAIREMENT ---
$recaptchaSecret = 'VOTRE_CLE_SECRETE_RECAPTCHA';
if (!$recaptchaResponse) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Le CAPTCHA est manquant.']);
    exit;
}
$verifyUrl = "https://www.google.com/recaptcha/api/siteverify?secret={$recaptchaSecret}&response={$recaptchaResponse}";
$recaptchaRes = file_get_contents($verifyUrl);
$recaptchaData = json_decode($recaptchaRes, true);
if (!$recaptchaData['success']) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'La validation du CAPTCHA a échoué.']);
    exit;
}
------------------------------------------- */

// Configuration de l'email
$to = 'tsmirac.68@gmail.com'; // L'adresse qui recevra les devis
$subject = "Nouveau devis : $prestation - $prenom $nom";

$body = "Vous avez reçu une nouvelle demande de devis sur L'Éclat du Chef.\n\n";
$body .= "Informations du client :\n";
$body .= "- Prénom : $prenom\n";
$body .= "- Nom : $nom\n";
$body .= "- Email : $email\n";
$body .= "- Téléphone : $telephone\n\n";
$body .= "Détails de l'événement :\n";
$body .= "- Prestation : $prestation\n";
$body .= "- Nombre de convives : $convives\n";
$body .= "- Date : " . ($evenement ?: 'Non précisée') . "\n";
$body .= "- Lieu : " . ($lieu ?: 'Non précisé') . "\n\n";
$body .= "Message supplémentaire :\n";
$body .= $message ?: 'Aucun message';

$headers = "From: contact@leclatduchef.fr\r\n"; // Expéditeur (doit être autorisé par OVH)
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Envoi de l'email (utilise la fonction native d'OVH sans besoin de mot de passe)
// L'arobase (@) permet de cacher les gros messages d'erreur de Windows en local
$mailSent = @mail($to, $subject, $body, $headers);

if ($mailSent) {
    echo json_encode(['success' => true, 'message' => 'Votre demande a bien été envoyée !']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'envoi de l\'email par le serveur.']);
}
