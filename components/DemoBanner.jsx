import { ShoppingBag, ChevronRight, Info } from "lucide-react";

export default function DemoBanner() {
  const whatsappNumber = "584144415403";
  const message = "Hola, me interesa comprar el diseño web de la plantilla de restaurante SistBurguer. Quisiera más información.";
  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 border-b border-indigo-500/30 text-white z-[100] relative">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center bg-blue-500/20 text-blue-300 rounded-full w-8 h-8 font-bold animate-pulse">
            <Info className="w-4 h-4" />
          </span>
          <div>
            <p className="font-bold">Plantilla Web para Restaurantes (Versión Demo)</p>
            <p className="text-blue-200 text-xs mt-0.5">Precio Base: <strong className="text-white">$300</strong> (+ adicionales a convenir)</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a 
            href="/cocina"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-500/20 border border-indigo-400 text-indigo-100 hover:bg-indigo-500/40 px-5 py-2 rounded-full font-bold transition-all hover:scale-105 active:scale-95"
          >
            Panel Cocina
          </a>
          <a 
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-indigo-900 hover:bg-blue-50 px-5 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            Adquirir <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
