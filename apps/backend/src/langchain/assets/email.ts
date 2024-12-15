import Application from '../../applications/entities/application.object';

type EmailOptions = {
  application: Application;
  text: string
}

const buildEmail = ({ application, text }: EmailOptions) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    ${text.split('\n').map((line) => `<p style="margin-bottom: 15px;">${line}</p>`).join('')}
    
    
    <p style="margin-bottom: 15px;">
    You can open your current application using link below or just respond to this email with answers provided.
    </p>
    
    <p style="margin-bottom: 15px;">
        <a href="${process.env.FRONTEND_PUBLIC_URL}/${application.id}" style="color: #007bff; text-decoration: none;">
        Open application form
        </a>
    </p>
    
    <p style="margin-top: 30px; font-size: 14px; color: #777;">
        Best regards,<br>
        FightForms AI Assistant.
    </p>
</body>
</html>
`

export default buildEmail;
