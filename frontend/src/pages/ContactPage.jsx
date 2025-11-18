import ContactForm from '@/features/Contact/ContactForm';

const ContactPage = () => {
  return (
    <main className="flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto px-4 py-12">
        <ContactForm />
      </div>
    </main>
  );
};

export default ContactPage;
