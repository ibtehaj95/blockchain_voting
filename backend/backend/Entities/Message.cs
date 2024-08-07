using MimeKit;
namespace backend.Entities
{
    public class Message
    {
        public MailboxAddress To { get; set; }
        public string Subject { get; set; }
        public string ActivationLink { get; set; }
        public Message(string name, string to, string subject, string activationLink)
        {
            To = new MailboxAddress(name, to);
            Subject = subject;
            ActivationLink = activationLink;
        }
    }
}
