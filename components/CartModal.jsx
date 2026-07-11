"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  X, Minus, Plus, ShoppingBag, ChevronRight, ArrowLeft, 
  User, Phone, MapPin, FileText, CreditCard, CheckCircle2, MessageSquare 
} from "lucide-react";
import { useCart } from "@/components/CartContext";
import { createOrder } from "@/lib/dbService";

export default function CartModal() {
  const { 
    cartItems, isCartOpen, setIsCartOpen, updateQuantity, 
    removeFromCart, clearCart, cartTotal 
  } = useCart();

  const [step, setStep] = useState(1); // 1: Review, 2: Customer Info, 3: Payment, 4: Success
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [errors, setErrors] = useState({});

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    deliveryType: "delivery", // delivery | pickup
    address: "",
    notes: "",
    paymentMethod: "efectivo", // efectivo | transferencia
    cashAmount: "",
    reference: ""
  });

  if (!isCartOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectDelivery = (type) => {
    setFormData(prev => ({ ...prev, deliveryType: type }));
    setErrors(prev => ({ ...prev, address: "" }));
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es obligatorio";
    if (formData.deliveryType === "delivery" && !formData.address.trim()) {
      newErrors.address = "La dirección de entrega es obligatoria";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (formData.paymentMethod === "efectivo" && !formData.cashAmount.trim()) {
      newErrors.cashAmount = "Indica con cuánto vas a pagar";
    }
    if (formData.paymentMethod === "transferencia" && !formData.reference.trim()) {
      newErrors.reference = "Ingresa el número de referencia del pago";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCheckout = async () => {
    if (!validateStep3()) return;
    setIsProcessing(true);
    
    try {
      const order = {
        items: cartItems.map(item => ({ 
          id: item.id, 
          name: item.name, 
          quantity: item.quantity, 
          price: item.price 
        })),
        total: cartTotal,
        status: "pendiente",
        customer: {
          name: formData.name,
          phone: formData.phone,
          deliveryType: formData.deliveryType,
          address: formData.deliveryType === "delivery" ? formData.address : "Retiro en local",
          notes: formData.notes || "Sin especificaciones"
        },
        payment: {
          method: formData.paymentMethod,
          cashAmount: formData.paymentMethod === "efectivo" ? formData.cashAmount : null,
          reference: formData.paymentMethod === "transferencia" ? formData.reference : null
        }
      };

      // Registrar pedido usando el servicio híbrido
      const newId = await createOrder(order);
      setOrderId(newId);
      
      setStep(4);
      clearCart();
      setIsProcessing(false);
    } catch (error) {
      console.error("Error al procesar el pedido: ", error);
      setIsProcessing(false);
      alert("Hubo un error al procesar el pedido. Intente nuevamente.");
    }
  };

  // Genera el enlace de WhatsApp con el resumen del pedido
  const getWhatsAppLink = () => {
    const shortId = orderId ? orderId.slice(-4).toUpperCase() : "";
    const itemsText = cartItems.map(item => `• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})`).join("\n");
    const deliveryDetail = formData.deliveryType === "delivery" 
      ? `🛵 *Domicilio:* ${formData.address}` 
      : `🛍️ *Retiro en local*`;
      
    const paymentDetail = formData.paymentMethod === "efectivo"
      ? `💵 *Efectivo* (Paga con: $${formData.cashAmount})`
      : `💳 *Transferencia/Pago Móvil* (Ref: #${formData.reference})`;

    const notesDetail = formData.notes ? `📝 *Notas:* ${formData.notes}` : "";

    const text = `🍔 *PEDIDO CONFIRMADO #${shortId}* 🍔\n\n` +
                 `👤 *Cliente:* ${formData.name}\n` +
                 `📞 *Teléfono:* ${formData.phone}\n\n` +
                 `📋 *Detalle del Pedido:*\n${itemsText}\n\n` +
                 `💰 *Total:* $${cartTotal.toFixed(2)}\n\n` +
                 `${deliveryDetail}\n` +
                 `${paymentDetail}\n` +
                 `${notesDetail}`;

    return `https://wa.me/584120000000?text=${encodeURIComponent(text)}`;
  };

  const handleCloseModal = () => {
    setIsCartOpen(false);
    // Reiniciar formulario si se completó la orden
    if (step === 4) {
      setStep(1);
      setFormData({
        name: "",
        phone: "",
        deliveryType: "delivery",
        address: "",
        notes: "",
        paymentMethod: "efectivo",
        cashAmount: "",
        reference: ""
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={handleCloseModal}
      />
      
      {/* Sidebar Drawer */}
      <div className="relative w-full max-w-md bg-neutral-950 border-l border-white/10 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Cabecera del Carrito */}
        <div className="p-6 flex items-center justify-between border-b border-white/5 bg-zinc-900/50">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <ShoppingBag className="text-primary-red w-5 h-5" />
              {step === 1 && "Tu Pedido"}
              {step === 2 && "Tus Datos"}
              {step === 3 && "Confirmación de Pago"}
              {step === 4 && "¡Éxito!"}
            </h2>
            {step < 4 && (
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                Paso {step} de 3
              </span>
            )}
          </div>
          <button 
            onClick={handleCloseModal} 
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo Dinámico */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          
          {/* PASO 1: REVISIÓN DE PRODUCTOS */}
          {step === 1 && (
            <>
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4 py-20">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <ShoppingBag className="w-8 h-8 opacity-30 text-white" />
                  </div>
                  <p className="font-medium text-gray-400">Tu carrito está vacío</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 bg-white/5 border border-white/15 text-white text-xs font-bold rounded-xl hover:bg-white/10"
                  >
                    Ver Menú
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex gap-4 bg-zinc-900/60 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all group"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-950 flex items-center justify-center text-2xl">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                        ) : (
                          <span>{item.category === 'Hamburguesas' ? '🍔' : '🍟'}</span>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-white text-sm tracking-tight">{item.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id)} 
                            className="text-gray-500 hover:text-primary-red p-1 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-black text-primary-red text-sm">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          
                          {/* Controles de Cantidad */}
                          <div className="flex items-center gap-3 bg-neutral-950 border border-white/5 rounded-xl px-2 py-1">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)} 
                              className="w-5 h-5 rounded-md bg-zinc-800 flex items-center justify-center hover:text-primary-red text-white hover:bg-zinc-700 transition-colors"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center text-white">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)} 
                              className="w-5 h-5 rounded-md bg-zinc-800 flex items-center justify-center hover:text-primary-red text-white hover:bg-zinc-700 transition-colors"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* PASO 2: DATOS DEL CLIENTE */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              {/* Selector de Tipo de Entrega */}
              <div className="grid grid-cols-2 gap-3 p-1 bg-zinc-900 rounded-2xl border border-white/5">
                <button
                  type="button"
                  onClick={() => handleSelectDelivery("delivery")}
                  className={`py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2
                    ${formData.deliveryType === "delivery" 
                      ? "bg-primary-red text-white shadow-md" 
                      : "text-gray-400 hover:text-white"}`}
                >
                  <MapPin className="w-4 h-4" />
                  Domicilio (Delivery)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDelivery("pickup")}
                  className={`py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2
                    ${formData.deliveryType === "pickup" 
                      ? "bg-primary-red text-white shadow-md" 
                      : "text-gray-400 hover:text-white"}`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Retiro en local
                </button>
              </div>

              {/* Formulario */}
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-primary-red" /> Nombre Completo
                  </label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-zinc-900 border border-white/10 focus:border-primary-red rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors"
                  />
                  {errors.name && <span className="text-xs text-primary-red font-medium">{errors.name}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-primary-red" /> Teléfono de Contacto
                  </label>
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Ej. 04121234567"
                    className="w-full bg-zinc-900 border border-white/10 focus:border-primary-red rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors"
                  />
                  {errors.phone && <span className="text-xs text-primary-red font-medium">{errors.phone}</span>}
                </div>

                {formData.deliveryType === "delivery" && (
                  <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary-red" /> Dirección de Entrega
                    </label>
                    <textarea 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Calle, Edificio, Apto, Urbanización..."
                      className="w-full bg-zinc-900 border border-white/10 focus:border-primary-red rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors resize-none"
                    />
                    {errors.address && <span className="text-xs text-primary-red font-medium">{errors.address}</span>}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-primary-red" /> Notas para Cocina (Opcional)
                  </label>
                  <input 
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Ej. Sin cebolla, extra salsa..."
                    className="w-full bg-zinc-900 border border-white/10 focus:border-primary-red rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: CONFIRMACIÓN Y PAGO */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Selecciona Método de Pago
              </span>

              {/* Selector de Método */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "efectivo" }))}
                  className={`p-4 border rounded-2xl flex flex-col items-center gap-2 text-center transition-all duration-300
                    ${formData.paymentMethod === "efectivo" 
                      ? "border-primary-red bg-primary-red/10 text-white" 
                      : "border-white/10 bg-zinc-900 text-gray-400 hover:text-white"}`}
                >
                  <span className="text-2xl">💵</span>
                  <span className="text-xs font-bold">Efectivo</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "transferencia" }))}
                  className={`p-4 border rounded-2xl flex flex-col items-center gap-2 text-center transition-all duration-300
                    ${formData.paymentMethod === "transferencia" 
                      ? "border-primary-red bg-primary-red/10 text-white" 
                      : "border-white/10 bg-zinc-900 text-gray-400 hover:text-white"}`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-xs font-bold">Pago Móvil / Transferencia</span>
                </button>
              </div>

              {/* Contenido Condicional del Pago */}
              <div className="mt-2 bg-zinc-900/60 p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
                {formData.paymentMethod === "efectivo" ? (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400">¿Con cuánto vas a pagar? (Para preparar cambio)</label>
                    <input 
                      type="text"
                      name="cashAmount"
                      value={formData.cashAmount}
                      onChange={handleInputChange}
                      placeholder="Ej. Pagaré con billete de $20"
                      className="w-full bg-neutral-950 border border-white/10 focus:border-primary-red rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                    />
                    {errors.cashAmount && <span className="text-xs text-primary-red font-medium">{errors.cashAmount}</span>}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 text-xs leading-relaxed animate-in fade-in duration-300">
                    <div className="border-b border-white/5 pb-3">
                      <span className="block font-bold text-white uppercase text-[10px] tracking-wider mb-2 text-primary-red">
                        Datos Bancarios de la Tienda
                      </span>
                      <p className="text-gray-400"><strong className="text-white">Banco:</strong> Banco Nacional</p>
                      <p className="text-gray-400"><strong className="text-white">Pago Móvil:</strong> Tel: 0412-1234567 | C.I. 12345678</p>
                      <p className="text-gray-400"><strong className="text-white">Cuenta Corriente:</strong> 0102-1234-56-1234567890</p>
                      <p className="text-gray-400"><strong className="text-white">Titular:</strong> SistBurguer C.A.</p>
                      <p className="text-gray-400"><strong className="text-white">RIF:</strong> J-12345678-9</p>
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                      <label className="font-bold text-gray-400 text-xs">Ingrese el número de Referencia del Pago</label>
                      <input 
                        type="text"
                        name="reference"
                        value={formData.reference}
                        onChange={handleInputChange}
                        placeholder="Ej. Últimos 5 dígitos"
                        className="w-full bg-neutral-950 border border-white/10 focus:border-primary-red rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      />
                      {errors.reference && <span className="text-xs text-primary-red font-medium">{errors.reference}</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASO 4: ÉXITO */}
          {step === 4 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-6 py-10 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/5 animate-pulse">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-black text-white">¡Pedido Registrado!</h3>
                <p className="text-sm text-gray-400 leading-relaxed px-4">
                  Tu pedido ha sido enviado exitosamente al panel de cocina de la sucursal.
                </p>
              </div>

              <div className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-xs text-left flex flex-col gap-2">
                <p className="text-gray-500"><strong className="text-white">Pedido ID:</strong> #{orderId.slice(-6).toUpperCase()}</p>
                <p className="text-gray-500"><strong className="text-white">Cliente:</strong> {formData.name}</p>
                <p className="text-gray-500"><strong className="text-white">Entrega:</strong> {formData.deliveryType === 'delivery' ? 'Domicilio' : 'Retiro en local'}</p>
                <p className="text-gray-500"><strong className="text-white">Método de Pago:</strong> {formData.paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia/Pago Móvil'}</p>
              </div>

              {/* Botón WhatsApp de Respaldo */}
              <a 
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                ENVIAR DETALLE POR WHATSAPP
              </a>
            </div>
          )}

        </div>

        {/* Footer del Drawer (Totales y Botones de Acción) */}
        {step < 4 && cartItems.length > 0 && (
          <div className="p-6 bg-zinc-900/60 border-t border-white/5">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 font-bold text-sm uppercase tracking-wider">Total</span>
              <span className="text-3xl font-black text-white">${cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex gap-3">
              {step > 1 && (
                <button 
                  onClick={handlePrevStep}
                  disabled={isProcessing}
                  className="px-4 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl transition-all"
                  aria-label="Volver"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              
              {step < 3 ? (
                <button 
                  onClick={handleNextStep}
                  className="flex-1 py-4 bg-gradient-to-r from-primary-red to-orange-600 hover:from-primary-red-hover hover:to-orange-700 text-white rounded-2xl font-black tracking-wide text-sm transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary-red/10"
                >
                  CONTINUAR <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="flex-1 py-4 bg-gradient-to-r from-primary-red to-orange-600 hover:from-primary-red-hover hover:to-orange-700 text-white rounded-2xl font-black tracking-wide text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary-red/15 animate-pulse"
                >
                  {isProcessing ? (
                    <span>Procesando...</span>
                  ) : (
                    <span>CONFIRMAR Y ENVIAR</span>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
