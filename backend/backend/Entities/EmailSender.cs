using backend.Data;
using MailKit.Net.Smtp;
using MimeKit;

namespace backend.Entities
{
    public interface IEmailSender
    {
        void SendEmail(Message message);
    }
    public class EmailSender : IEmailSender
    {
        private readonly EmailConfiguration _emailConfig = AppData.GetEmailConfiguration();

        private MimeMessage CreateEmailMessage(Message message)
        {

            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("Voting System", _emailConfig.From));
            emailMessage.To.Add(message.To);
            emailMessage.Subject = message.Subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = string.Format("<p>Bitte klicken Sie auf den folgenden Link: <a href='https://localhost:4200/activate/{0}'>Activate</a> </p>", message.ActivationLink) };
            return emailMessage;
        }
        private void Send(MimeMessage mailMessage)
        {
            using (var client = new SmtpClient())
            {
                try
                {
                    client.Connect(_emailConfig.SmtpServer, _emailConfig.Port, true);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    client.Authenticate(_emailConfig.UserName, _emailConfig.Password);
                    client.Send(mailMessage);
                }
                catch
                {
                    //log an error message or throw an exception or both.
                    throw;
                }
                finally
                {
                    client.Disconnect(true);
                    client.Dispose();
                }
            }
        }
        public void SendEmail(Message message)
        {
            var emailMessage = CreateEmailMessage(message);
            Send(emailMessage);
        }
    }
}
