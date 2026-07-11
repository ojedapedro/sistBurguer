import { db, firebaseConfig } from "./firebase";
import { 
  collection, addDoc, query, onSnapshot, 
  doc, updateDoc, serverTimestamp 
} from "firebase/firestore";

// Detectar si estamos usando las credenciales dummy (mock mode)
const isMockMode = !firebaseConfig.apiKey || firebaseConfig.apiKey === "API_KEY";

if (isMockMode) {
  console.warn("⚠️ SistBurguer: Usando Base de Datos Simulada (Local Storage + BroadcastChannel). Configura Firebase en .env.local para producción.");
}

// Inicializar canal de comunicación entre pestañas para tiempo real en local
let channel = null;
if (typeof window !== "undefined") {
  try {
    channel = new BroadcastChannel("sistburguer_orders");
  } catch (e) {
    console.error("BroadcastChannel no soportado en este navegador:", e);
  }
}

// Helpers para base de datos simulada
const getMockOrders = () => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("mock_orders");
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return parsed.map(o => ({
      ...o,
      createdAt: o.createdAtVal ? { toDate: () => new Date(o.createdAtVal) } : null
    }));
  } catch (e) {
    return [];
  }
};

const saveMockOrders = (orders) => {
  if (typeof window === "undefined") return;
  const toStore = orders.map(o => {
    const dateVal = o.createdAt?.toDate ? o.createdAt.toDate().toISOString() : o.createdAtVal || new Date().toISOString();
    const { createdAt, ...rest } = o;
    return { ...rest, createdAtVal: dateVal };
  });
  localStorage.setItem("mock_orders", JSON.stringify(toStore));
};

export const subscribeToOrders = (callback) => {
  if (isMockMode) {
    const emitCurrent = () => {
      callback(getMockOrders());
    };

    emitCurrent();

    const handleStorageChange = (e) => {
      if (e.key === "mock_orders") {
        emitCurrent();
      }
    };

    const handleChannelMessage = () => {
      emitCurrent();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      if (channel) {
        channel.addEventListener("message", handleChannelMessage);
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageChange);
        if (channel) {
          channel.removeEventListener("message", handleChannelMessage);
        }
      }
    };
  } else {
    // FIX PRINCIPAL: Query SIN orderBy para evitar el error de índice compuesto
    // en Firestore. El campo createdAt sin serverTimestamp() causaba que el
    // listener fallara silenciosamente. El ordenamiento se realiza en el cliente.
    const q = query(collection(db, "orders"));

    return onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));

      // Ordenar en cliente de forma segura (tolerante a createdAt undefined)
      ordersData.sort((a, b) => {
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return timeA - timeB;
      });

      callback(ordersData);
    }, (error) => {
      console.error("🔴 Error al escuchar pedidos de Firestore:", error.code, error.message);
    });
  }
};

export const createOrder = async (orderData) => {
  if (isMockMode) {
    const now = new Date();
    const newOrder = {
      id: "mock_" + Math.random().toString(36).substring(2, 11),
      ...orderData,
      createdAt: { toDate: () => now },
      createdAtVal: now.toISOString()
    };

    const orders = getMockOrders();
    const updatedOrders = [...orders, newOrder];
    saveMockOrders(updatedOrders);

    if (channel) {
      channel.postMessage({ type: "ORDER_CREATED", orderId: newOrder.id });
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
    }
    return newOrder.id;
  } else {
    // FIX SECUNDARIO: Usar serverTimestamp() de Firestore garantiza que
    // el campo createdAt sea un Timestamp real y no undefined.
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  if (isMockMode) {
    const orders = getMockOrders();
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    saveMockOrders(updatedOrders);

    if (channel) {
      channel.postMessage({ type: "ORDER_UPDATED", orderId, status: newStatus });
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
    }
  } else {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: newStatus
    });
  }
};
