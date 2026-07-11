"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Menu, X, ChevronRight, Utensils, Star, Flame, Sparkles } from "lucide-react";
import MenuList from "@/components/MenuList";
import CartModal from "@/components/CartModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useCart } from "@/components/CartContext";

export default function Home() {
  const { addToCart, isCartOpen, setIsCartOpen, cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-brand-dark text-foreground selection:bg-primary-red selection:text-white relative">
      {/* Glow Blobs de Fondo */}
      <div className="glow-blob top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-red/10" />
      <div className="glow-blob top-[60%] right-1/4 w-[400px] h-[400px] bg-amber-500/5" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 shadow-lg">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-red to-amber-600 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-primary-red/20">
              SB
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight leading-none text-white">SistBurguer</span>
              <span className="text-[10px] text-gray-500 tracking-wider uppercase font-semibold mt-0.5">Premium Smash</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10 font-semibold text-sm">
            <a href="#menu" className="text-gray-400 hover:text-white hover:scale-105 transition-all">Menú</a>
            <a href="#experiencia" className="text-gray-400 hover:text-white hover:scale-105 transition-all">Experiencia</a>
            <a href="#nosotros" className="text-gray-400 hover:text-white hover:scale-105 transition-all">Nosotros</a>
          </nav>

          {/* Cart & Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-md"
              aria-label="Abrir Carrito"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-primary-red text-white text-xs font-black rounded-full flex items-center justify-center border-2 border-brand-dark animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              className="md:hidden w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gray-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menú"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-panel border-b border-white/5 px-6 py-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <a 
              href="#menu" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-bold text-gray-300 hover:text-white"
            >
              Menú
            </a>
            <a 
              href="#experiencia" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-bold text-gray-300 hover:text-white"
            >
              Experiencia
            </a>
            <a 
              href="#nosotros" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-bold text-gray-300 hover:text-white"
            >
              Nosotros
            </a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:py-32 overflow-hidden flex-1 flex flex-col justify-center">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Texto */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
              {/* Badge decorativo */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-red/10 border border-primary-red/20 rounded-full w-fit mx-auto lg:mx-0 shadow-sm animate-pulse">
                <Flame className="w-4 h-4 text-primary-red fill-current" />
                <span className="text-xs font-extrabold text-primary-red uppercase tracking-wider">
                  Plantilla Web Premium para Restaurantes
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-white">
                Sabor extremo que te <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-red via-orange-500 to-amber-500">
                  vuela la cabeza.
                </span>
              </h1>
              
              <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Demuestra el poder de esta plantilla. Una landing page optimizada, rápida y diseñada para convertir visitantes en clientes para tu restaurante.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 justify-center lg:justify-start">
                <a 
                  href={`https://wa.me/584144415403?text=${encodeURIComponent("Hola, me interesa comprar el diseño web de la plantilla de restaurante SistBurguer. Quisiera más información.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-primary-red to-orange-600 hover:from-primary-red-hover hover:to-orange-700 text-white rounded-2xl font-black tracking-wide text-sm transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary-red/25"
                >
                  COMPRAR PLANTILLA <ChevronRight className="w-5 h-5" />
                </a>
                <a 
                  href="#menu" 
                  className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-2xl font-bold tracking-wide text-sm transition-all duration-300 flex items-center justify-center gap-2"
                >
                  VER MENÚ DEMO
                </a>
              </div>

              {/* Stats/Badges sutiles */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <span className="block text-3xl font-black text-white">100%</span>
                  <span className="text-xs text-gray-500">Carne Angus</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="block text-3xl font-black text-white">15 min</span>
                  <span className="text-xs text-gray-500">Envío Promedio</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="block text-3xl font-black text-white">4.9 ★</span>
                  <span className="text-xs text-gray-500">Calificación Google</span>
                </div>
              </div>
            </div>

            {/* Imagen Principal Animada */}
            <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[450px] lg:h-[450px]">
                {/* Aros de luz tras la imagen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-red/20 to-orange-500/20 rounded-full blur-3xl opacity-60 animate-pulse" />
                <div className="absolute -inset-4 border border-dashed border-white/10 rounded-full animate-[spin_60s_linear_infinite]" />
                
                {/* Tarjetas flotantes */}
                <div className="absolute top-10 -left-6 bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-3 shadow-2xl z-20 animate-bounce [animation-duration:4s]">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold">🔥</div>
                  <div>
                    <span className="block text-xs font-bold text-white">¡Recién Hecho!</span>
                    <span className="text-[10px] text-gray-400">Smash al instante</span>
                  </div>
                </div>

                <div className="absolute bottom-10 -right-6 bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-3 shadow-2xl z-20 animate-bounce [animation-duration:5s]">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500 font-bold">🍔</div>
                  <div>
                    <span className="block text-xs font-bold text-white">Classic Smash</span>
                    <span className="text-[10px] text-gray-400">La preferida</span>
                  </div>
                </div>

                {/* Contenedor Hamburguesa */}
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/5 shadow-2xl relative bg-zinc-950 flex items-center justify-center">
                  <Image 
                    src="/images/classic_smash.jpg"
                    alt="Hamburguesa Gourmet"
                    fill
                    priority
                    className="object-cover scale-105 hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experiencia / Propuesta de Valor */}
      <section id="experiencia" className="py-24 border-t border-white/5 relative bg-zinc-950">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card rounded-3xl p-8 flex flex-col gap-4">
              <div className="w-12 h-12 bg-primary-red/10 rounded-2xl flex items-center justify-center text-primary-red mb-2">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Receta Artesanal</h3>
              <p className="text-gray-400 font-light leading-relaxed text-sm">
                Pan brioche de receta propia y aderezos especiales batidos a mano todas las mañanas para garantizar un sabor inimitable.
              </p>
            </div>
            
            <div className="glass-card rounded-3xl p-8 flex flex-col gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-2">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Smash Perfecto</h3>
              <p className="text-gray-400 font-light leading-relaxed text-sm">
                Aplastamos la carne fresca sobre planchas hirviendo para crear esa costra caramelizada crujiente que retiene todo el jugo de la carne.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 flex flex-col gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-2">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Envío en Caliente</h3>
              <p className="text-gray-400 font-light leading-relaxed text-sm">
                Nuestros empaques térmicos premium están diseñados para respirar sin humedecer el pan, asegurando que tu hamburguesa llegue como recién salida de la plancha.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-28 relative">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-20 flex flex-col items-center gap-4">
            <span className="text-primary-red font-extrabold uppercase tracking-widest text-xs">Nuestra Selección</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">
              Menú Legendario
            </h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-primary-red to-orange-500 rounded-full mt-2" />
          </div>
          
          <MenuList onAdd={addToCart} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-zinc-950 py-16">
        <div className="container mx-auto px-4 md:px-8 text-center text-gray-500 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-red rounded-lg flex items-center justify-center font-bold text-white text-sm">
              SB
            </div>
            <span className="text-md font-bold tracking-tight text-white">SistBurguer</span>
          </div>
          <p className="text-sm font-light">© {new Date().getFullYear()} SistBurguer. Creadores de hamburguesas premium artesanales. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Overlays */}
      <CartModal />
      <WhatsAppButton 
        phoneNumber="584144415403" 
        message="Hola, me interesa comprar la plantilla de restaurante SistBurguer." 
      />
    </div>
  );
}
