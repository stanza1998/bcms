<?php
// Include the PHPMailer library
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'path/to/PHPMailer/src/PHPMailer.php';
require 'path/to/PHPMailer/src/SMTP.php';
require 'path/to/PHPMailer/src/Exception.php';

// Create a new PHPMailer object
$mail = new PHPMailer(true);

try {
    // Set the mailer to use SMTP
    $mail->isSMTP();
    $mail->SMTPDebug = SMTP::DEBUG_OFF; // Enable verbose debug output if needed
    $mail->Host = 'srv588.main-hosting.eu'; // SMTP server hostname
    $mail->SMTPAuth = true; // Enable SMTP authentication
    $mail->Username = 'no-reply@lotsinsights.com'; // SMTP username
    $mail->Password = 'your-smtp-password'; // SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 587; // TCP port to connect to

    // Set the email content
    $mail->setFrom('no-reply@lotsinsights.com', 'Lots Insights');
    $mail->addAddress('recipient@example.com', 'Recipient Name');
    $mail->Subject = 'Subject of your email';
    $mail->Body = 'Body of your email';

    // Send the email
    $mail->send();
    echo 'Email sent successfully!';
} catch (Exception $e) {
    echo "Error sending email: {$mail->ErrorInfo}";
}
