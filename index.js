import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const TOKEN = "TU_TOKEN_DE_WHAPI";

// Detectar intención de compra
function quiereComprar(text) {
  return (
    text.includes("quiero") ||
    text.includes("instalar") ||
    text.includes("contratar") ||
    text.includes("me interesa") ||
    text.includes("informacion") ||
    text.includes("info")
  );
}

app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.messages?.[0];

    // 🔥 FIX WHAPI (RESPUESTA INMEDIATA)
    res.sendStatus(200);

    if (!message || message.from_me) return;

    const from = message.chat_id;
    const text = message.text?.body?.toLowerCase() || "";

    let respuesta = "";

    // SALUDO + ENTRADA
    if (text.includes("hola") || text.includes("buenas")) {
      respuesta = `👋 ¡Hola! Soy asesor de *Perú Fibra* 🚀

Te ayudo rápido 👇

📶 Planes disponibles:
🔥 400 Mbps (promo) → S/59
🔥 800 Mbps (promo) → S/69

🛠 Instalación GRATIS
💸 Precio fijo para siempre

📍 Para validar cobertura:
• Ubicación actual
• o dirección exacta + referencia

🪪 Y tu DNI

⏱ Te confirmo en menos de 3 minutos`;
    }

    // INTENCIÓN DE COMPRA
    else if (quiereComprar(text)) {
      respuesta = `🔥 ¡Perfecto! Te ayudo a instalar hoy mismo 🚀

Solo necesito esto para avanzar:

📍 Tu ubicación actual o dirección exacta
🪪 Tu DNI

⏱ Validamos en menos de 3 minutos y dejamos listo tu pedido`;
    }

    // PLANES
    else if (text.includes("plan") || text.includes("precio")) {
      respuesta = `📶 Planes Perú Fibra:

🔹 400 Mbps (promo x6 meses) → S/59  
🔹 800 Mbps (promo x6 meses) → S/69  

💸 Precio fijo para siempre  
🛠 Instalación GRATIS  

👉 ¿Te ayudo a instalar hoy?

Envíame:
📍 Ubicación o dirección  
🪪 DNI`;
    }

    // COBERTURA
    else if (text.includes("cobertura")) {
      respuesta = `📍 Validamos tu cobertura en menos de 3 minutos

Envíame:
✔ Ubicación actual  
o  
✔ Dirección exacta + referencia  

🪪 Y tu DNI para validar promoción`;
    }

    // UBICACIÓN
    else if (message.type === "location") {
      respuesta = `📍 ¡Ubicación recibida! 🔥

Ahora envíame tu DNI para validar si calificas y dejar lista tu instalación`;
    }

    // POSIBLE DIRECCIÓN
    else if (text.length > 15 && !/^\d{8}$/.test(text)) {
      respuesta = `📍 Dirección recibida ✅

Ahora envíame tu DNI para validar cobertura y avanzar con tu instalación`;
    }

    // DNI
    else if (/^\d{8}$/.test(text)) {
      respuesta = `🪪 DNI recibido ✅

⏳ Estamos validando tu cobertura y calificación...

📞 En unos minutos un asesor te contactará para finalizar tu instalación 🚀`;
    }

    // PAGOS
    else if (text.includes("pago") || text.includes("pagar")) {
      respuesta = `💳 Puedes pagar por:

✔ Yape / Plin  
✔ App bancaria  
✔ Agentes  
✔ BCP, BBVA, Scotiabank  

📌 Código: tu DNI  

🗓 Pagos todos los 28  

📊 Instalación:
- Del 1 al 21: proporcional ese mes  
- Después del 21: siguiente mes + proporcional`;
    }

    // EMPUJE FINAL
    else {
      respuesta = `👋 Soy asesor de *Perú Fibra* 🚀

📶 Planes desde S/59  
🛠 Instalación GRATIS  

🔥 Podemos instalarte rápido

Solo envíame:
📍 Ubicación o dirección  
🪪 DNI  

y te dejo todo listo hoy mismo`;
    }

    // ENVÍO A WHAPI
    await fetch("https://gate.whapi.cloud/messages/text", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: from,
        body: respuesta,
      }),
    });

  } catch (error) {
    console.log(error);
  }
});

// 🔥 IMPORTANTE PARA RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Bot vendedor activo 🚀");
});
