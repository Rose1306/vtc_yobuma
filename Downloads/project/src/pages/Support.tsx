import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

export const Support: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs: FAQ[] = [
    {
      question: "Comment fonctionne la réservation ?",
      answer: "Pour réserver un trajet, il suffit de saisir votre point de départ et votre destination. Notre système calculera automatiquement le prix en fonction de la distance. Vous pouvez choisir entre différents services (VTC, Tiak-Tiak, Covoiturage) selon vos besoins."
    },
    {
      question: "Quels sont les moyens de paiement acceptés ?",
      answer: "Nous acceptons plusieurs moyens de paiement : Wave, Orange Money, carte bancaire et paiement en espèces. Vous pouvez choisir votre mode de paiement préféré lors de la réservation."
    },
    {
      question: "Comment annuler une réservation ?",
      answer: "Vous pouvez annuler votre réservation jusqu'à 5 minutes avant l'heure prévue du trajet. Rendez-vous dans la section 'Mes réservations' et cliquez sur 'Annuler'. L'annulation est gratuite dans ce délai."
    },
    {
      question: "Les chauffeurs sont-ils vérifiés ?",
      answer: "Oui, tous nos chauffeurs passent par un processus de vérification rigoureux. Nous vérifions leur permis de conduire, leur casier judiciaire et leur expérience. Ils suivent également une formation sur la qualité de service."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous ajouteriez la logique pour envoyer le message
    console.log('Form submitted:', formData);
  };

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mb-4">
          Comment pouvons-nous vous aider ?
        </h1>
        <p className="text-xl text-gray-600">
          Notre équipe est là pour vous accompagner 24h/24 et 7j/7
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4">
            <Phone className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Par téléphone</h3>
          <p className="text-gray-600 mb-4">Disponible 24h/24</p>
          <a href="tel:+221338591234" className="text-blue-600 font-medium hover:text-blue-700">
            +221 33 859 12 34
          </a>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Chat en direct</h3>
          <p className="text-gray-600 mb-4">Réponse en quelques minutes</p>
          <button className="text-blue-600 font-medium hover:text-blue-700">
            Démarrer une conversation
          </button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Par email</h3>
          <p className="text-gray-600 mb-4">Réponse sous 24h</p>
          <a href="mailto:support@yobuma.com" className="text-blue-600 font-medium hover:text-blue-700">
            support@yobuma.com
          </a>
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Questions fréquentes</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {activeIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {activeIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Envoyez-nous un message</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Sujet
            </label>
            <input
              type="text"
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-blue-200"
          >
            Envoyer le message
          </button>
        </form>
      </div>
    </div>
  );
};