import { Plus, Star } from "lucide-react";
import Image from "next/image";

const MENU_ITEMS = [
  {
    id: 1,
    name: "Classic Smash",
    description: "Doble carne smash, queso cheddar americano, cebolla caramelizada y salsa secreta de la casa.",
    price: 12.50,
    category: "Hamburguesas",
    image: "/images/classic_smash.png",
    badge: "Más Vendida",
    rating: 4.9
  },
  {
    id: 2,
    name: "Bacon Beast",
    description: "Triple carne, cuádruple tocino ahumado, salsa BBQ ahumada, queso fundido y aros de cebolla crujientes.",
    price: 15.00,
    category: "Hamburguesas",
    image: "/images/bacon_beast.png",
    badge: "Recomendado",
    rating: 4.8
  },
  {
    id: 3,
    name: "Chicken Crunch",
    description: "Pollo frito extracrujiente bañado en mayonesa picante casera con ensalada coleslaw fresca.",
    price: 11.00,
    category: "Hamburguesas",
    image: "/images/chicken_crunch.png",
    badge: "Nuevo",
    rating: 4.7
  },
  {
    id: 4,
    name: "Papas Trufadas",
    description: "Papas rústicas fritas con aceite de trufa blanca, parmesano madurado rallado y perejil fresco.",
    price: 5.50,
    category: "Acompañamientos",
    image: "/images/papas_trufadas.png",
    badge: "Gourmet",
    rating: 4.9
  }
];

export default function MenuList({ onAdd }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {MENU_ITEMS.map((item) => (
        <div 
          key={item.id} 
          className="glass-card rounded-3xl p-5 flex flex-col gap-4 group relative overflow-hidden"
        >
          {/* Imagen del Producto */}
          <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-neutral-900 flex items-center justify-center">
            {item.image ? (
              <Image 
                src={item.image} 
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                priority={item.id <= 2}
              />
            ) : (
              <span className="text-4xl">{item.category === 'Hamburguesas' ? '🍔' : '🍟'}</span>
            )}
            
            {/* Gradiente sutil sobre la imagen */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            
            {/* Badge */}
            {item.badge && (
              <span className="absolute top-3 left-3 bg-primary-red text-white text-[10px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-full shadow-md z-10">
                {item.badge}
              </span>
            )}

            {/* Rating */}
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-gold z-10">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{item.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Información */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-xl font-extrabold tracking-tight text-white group-hover:text-primary-red transition-colors">
                {item.name}
              </h3>
            </div>
            
            <p className="text-sm text-gray-400 leading-relaxed font-light line-clamp-3">
              {item.description}
            </p>
            
            <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-widest">Precio</span>
                <span className="text-2xl font-black text-white">${item.price.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => onAdd(item)}
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary-red hover:border-primary-red text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-black/20"
                aria-label={`Agregar ${item.name} al carrito`}
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

