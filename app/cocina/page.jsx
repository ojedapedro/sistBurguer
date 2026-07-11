"use client";

import { useEffect, useState, useRef } from "react";
import { subscribeToOrders, updateOrderStatus } from "@/lib/dbService";
import { 
  Clock, CheckCircle2, ChefHat, Phone, MapPin, 
  CreditCard, Volume2, VolumeX, AlertCircle 
} from "lucide-react";

export default function CocinaDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [time, setTime] = useState(0);
  
  const prevOrderIds = useRef(new Set());
  const audioContextRef = useRef(null);

  // Sintetizador de sonido de campana digital (Chime)
  const playBellSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);
        
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      // Chime elegante (Re5 -> La5)
      playTone(587.33, now, 0.4);
      playTone(880.00, now + 0.15, 0.6);
    } catch (e) {
      console.warn("No se pudo reproducir la alerta sonora:", e);
    }
  };

  // Inicializar cronómetro de renderizado (cada 10 segundos para actualizar los tiempos transcurridos)
  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(Date.now());
    }, 0);
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 10000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // Suscribirse a los pedidos en tiempo real
  useEffect(() => {
    const unsubscribe = subscribeToOrders((ordersData) => {
      // Filtrar pedidos activos (no entregados)
      const activeOrders = ordersData.filter(o => o.status !== "entregado");
      
      // Comprobar si hay un nuevo pedido pendiente para reproducir alerta
      const currentPendientes = activeOrders.filter(o => o.status === "pendiente");
      let hasNewPendiente = false;

      currentPendientes.forEach(order => {
        if (!prevOrderIds.current.has(order.id)) {
          hasNewPendiente = true;
        }
      });

      // Actualizar el registro de IDs procesados
      prevOrderIds.current = new Set(activeOrders.map(o => o.id));

      setOrders(activeOrders);
      setLoading(false);

      if (hasNewPendiente && soundEnabled) {
        playBellSound();
      }
    });

    return () => unsubscribe();
  }, [soundEnabled]);


  // Activar sonido interactuando (desbloquear política del navegador)
  const enableSound = () => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
      setSoundEnabled(true);
      // Reproducir tono de confirmación
      setTimeout(() => {
        playBellSound();
      }, 50);
    } catch (e) {
      console.error("Error al activar audio:", e);
    }
  };

  const disableSound = () => {
    setSoundEnabled(false);
  };

  // Calcular tiempo transcurrido en minutos
  const getElapsedTime = (createdAt) => {
    if (!createdAt || !createdAt.toDate) return 0;
    const orderTime = createdAt.toDate().getTime();
    const diffMs = time - orderTime;
    return Math.floor(diffMs / 60000);
  };

  // Clasificar pedidos por columnas Kanban
  const pendientes = orders.filter(o => o.status === "pendiente");
  const preparacion = orders.filter(o => o.status === "preparacion");
  const listos = orders.filter(o => o.status === "listo");

  return (
    <div className="min-h-screen bg-brand-dark text-foreground flex flex-col relative selection:bg-primary-red selection:text-white">
      {/* Fondo Ambient Glow */}
      <div className="glow-blob top-0 right-10 w-[500px] h-[500px] bg-primary-red/5" />
      <div className="glow-blob bottom-10 left-10 w-[400px] h-[400px] bg-orange-500/5" />

      {/* Header */}
      <header className="z-10 bg-zinc-950/80 backdrop-blur-md border-b border-white/5 px-6 py-5 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-red rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-red/10">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight leading-none">Panel de Cocina</h1>
              <span className="text-xs text-gray-500 font-semibold tracking-wider uppercase mt-1 block">
                Gestión de pedidos en tiempo real
              </span>
            </div>
          </div>
        </div>

        {/* Controles de Audio y Contadores */}
        <div className="flex items-center gap-4 self-end md:self-auto">
          {/* Indicador de Sonido */}
          <button 
            onClick={soundEnabled ? disableSound : enableSound}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border flex items-center gap-2
              ${soundEnabled 
                ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20" 
                : "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20 animate-pulse"}`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Alertas Activas</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Activar Alertas (Clic)</span>
              </>
            )}
          </button>

          {/* Contador de Pedidos Totales */}
          <div className="bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl flex items-center gap-2">
            <span className="text-xs text-gray-400 font-bold">Activos:</span>
            <span className="text-lg font-black text-primary-red">{orders.length}</span>
          </div>
        </div>
      </header>

      {/* Dashboard Kanban */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-primary-red animate-spin"></div>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-20 z-10">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 opacity-30 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">¡No hay pedidos activos!</h2>
          <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
            Todos los clientes están contentos. Buen momento para limpiar la cocina.
          </p>
        </div>
      ) : (
        <main className="flex-1 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-start z-10 overflow-x-auto">
          
          {/* COLUMNA 1: PENDIENTES */}
          <div className="flex flex-col gap-4 bg-zinc-950/40 border border-white/5 rounded-3xl p-5 min-h-[70vh]">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 px-2">
              <h2 className="text-sm font-black uppercase tracking-wider text-amber-500 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                Pendientes ({pendientes.length})
              </h2>
            </div>
            <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto pr-1">
              {pendientes.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  getElapsedTime={getElapsedTime} 
                  nextStatus="preparacion"
                  buttonText="Preparar"
                  buttonColor="bg-amber-500 hover:bg-amber-600 shadow-amber-500/10"
                />
              ))}
            </div>
          </div>

          {/* COLUMNA 2: EN PREPARACIÓN */}
          <div className="flex flex-col gap-4 bg-zinc-950/40 border border-white/5 rounded-3xl p-5 min-h-[70vh]">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 px-2">
              <h2 className="text-sm font-black uppercase tracking-wider text-primary-red flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-red animate-pulse" />
                En Cocina ({preparacion.length})
              </h2>
            </div>
            <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto pr-1">
              {preparacion.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  getElapsedTime={getElapsedTime} 
                  nextStatus="listo"
                  buttonText="Listo"
                  buttonColor="bg-primary-red hover:bg-primary-red-hover shadow-primary-red/10"
                />
              ))}
            </div>
          </div>

          {/* COLUMNA 3: LISTOS PARA ENTREGAR */}
          <div className="flex flex-col gap-4 bg-zinc-950/40 border border-white/5 rounded-3xl p-5 min-h-[70vh]">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 px-2">
              <h2 className="text-sm font-black uppercase tracking-wider text-green-500 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                Listos ({listos.length})
              </h2>
            </div>
            <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto pr-1">
              {listos.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  getElapsedTime={getElapsedTime} 
                  nextStatus="entregado"
                  buttonText="Entregar"
                  buttonColor="bg-green-600 hover:bg-green-700 shadow-green-500/10"
                />
              ))}
            </div>
          </div>

        </main>
      )}
    </div>
  );
}

// Subcomponente de Tarjeta de Pedido para evitar código repetitivo y encapsular cronómetros
function OrderCard({ order, getElapsedTime, nextStatus, buttonText, buttonColor }) {
  const elapsed = getElapsedTime(order.createdAt);
  
  // Asignar colores de urgencia al cronómetro
  const timeColor = elapsed > 20 
    ? "bg-red-500/20 text-red-500 border-red-500/30 animate-pulse font-extrabold" 
    : elapsed > 10 
      ? "bg-amber-500/20 text-amber-500 border-amber-500/30" 
      : "bg-white/5 text-gray-400 border-white/10";

  return (
    <div className="bg-zinc-900 border border-white/5 hover:border-white/10 rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 shadow-md">
      {/* Cabecera Tarjeta */}
      <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-3">
        <div>
          <span className="text-[10px] font-mono bg-white/10 px-2.5 py-1 rounded-md text-white font-bold uppercase">
            #{order.id.slice(-4).toUpperCase()}
          </span>
          <h3 className="font-extrabold text-white text-base mt-2 tracking-tight">
            {order.customer?.name || "Cliente Anónimo"}
          </h3>
        </div>

        {/* Cronómetro */}
        <div className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 ${timeColor}`}>
          <Clock className="w-3.5 h-3.5" />
          <span>{elapsed} min</span>
        </div>
      </div>

      {/* Detalles del Cliente */}
      <div className="flex flex-col gap-2.5 text-xs text-gray-400">
        <a 
          href={`tel:${order.customer?.phone}`} 
          className="flex items-center gap-2 text-primary-red hover:underline font-bold w-fit"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>{order.customer?.phone || "Sin Teléfono"}</span>
        </a>
        
        <div className="flex items-start gap-2 leading-relaxed">
          <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
          <span>
            <strong className="text-white">Envío: </strong> 
            {order.customer?.deliveryType === 'delivery' 
              ? order.customer?.address 
              : 'Retiro en local'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CreditCard className="w-3.5 h-3.5 text-gray-500" />
          <span>
            <strong className="text-white">Pago: </strong> 
            {order.payment?.method === "efectivo" 
              ? `Efectivo (${order.payment.cashAmount || "Monto exacto"})` 
              : `Transf. (Ref #${order.payment?.reference || "N/A"})`}
          </span>
        </div>

        {order.customer?.notes && order.customer.notes !== "Sin especificaciones" && (
          <div className="mt-1 flex items-start gap-2 bg-primary-red/5 border border-primary-red/10 px-3 py-2 rounded-xl text-primary-red text-[11px] font-medium leading-relaxed">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{order.customer.notes}</span>
          </div>
        )}
      </div>

      {/* Ítems del Pedido */}
      <div className="bg-black/50 border border-white/5 rounded-xl p-4 my-1 flex flex-col gap-2">
        <span className="text-[10px] uppercase font-extrabold tracking-wider text-gray-500 block mb-1">
          Ítems a Preparar
        </span>
        <ul className="space-y-2">
          {order.items.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center text-sm">
              <span className="text-white font-bold flex gap-2.5">
                <span className="text-primary-red font-black text-base">{item.quantity}x</span>
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Botón de Cambio de Estado */}
      <button 
        onClick={() => updateOrderStatus(order.id, nextStatus)}
        className={`w-full py-3.5 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md ${buttonColor}`}
      >
        {buttonText}
      </button>
    </div>
  );
}
