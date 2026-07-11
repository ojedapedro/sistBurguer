import { MessageCircle } from "lucide-react";

export default function WhatsAppButton({ phoneNumber, message = "Hola! Tengo una duda sobre el menú." }) {
  // Generico para WhatsApp. El numero puede ser el del restaurante (e.g. 1234567890)
  const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  return (
    <a 
      href={waLink} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform flex items-center justify-center"
      aria-label="Chat por WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
    </a>
  );
}
