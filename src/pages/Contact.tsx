import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageSquare, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-muted-foreground">Have a question or feedback? We'd love to hear from you.</p>
        </div>

        {sent ? (
          <div className="card-elevated p-8 text-center animate-fade-in">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
            <p className="text-sm text-muted-foreground">Thanks for reaching out. We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card-elevated p-6 md:p-8 space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Name</label>
                <Input placeholder="Your name" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <Input type="email" placeholder="you@example.com" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Subject</label>
              <Input placeholder="What's this about?" required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Message</label>
              <Textarea placeholder="Tell us more..." rows={5} required />
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0">
              <MessageSquare className="h-4 w-4 mr-2" /> Send Message
            </Button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Mail className="h-4 w-4" /> support@edgeledger.app
          </p>
        </div>
      </div>
    </div>
  );
}
