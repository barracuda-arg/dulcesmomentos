<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
</head>

<body style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #111827;">
    <div
        style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 16px; border: 1px solid #f3f4f6;">
        <h2 style="color: #ec4899; margin-top: 0;">¡Nuevo mensaje recibido!</h2>
        <p style="font-size: 14px; color: #6b7280;">Te enviaron una consulta a través del formulario de contacto del
            sitio web:</p>

        <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 20px 0;">

        <p><strong>Remitente:</strong> {{ $formData['name'] }}</p>
        <p><strong>Email:</strong> {{ $formData['email'] }}</p>

        <div
            style="background: #f9fafb; padding: 16px; border-radius: 12px; margin-top: 16px; border: 1px solid #f3f4f6;">
            <p style="margin-top: 0; font-weight: bold; color: #374151;">Mensaje:</p>
            <p style="white-space: pre-wrap; margin-bottom: 0; color: #4b5563;">{{ $formData['message'] }}</p>
        </div>
    </div>
</body>

</html>