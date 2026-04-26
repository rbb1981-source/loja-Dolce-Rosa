const products = {
  "progressiva-organica": {
    title: "Progressiva Organica Sem Formol 1L",
    unit_price: 110,
  },
  "kit-absolutely-soft": {
    title: "Kit Absolutely Soft",
    unit_price: 80,
  },
  "kit-absolutely-care": {
    title: "Kit Absolutely Care",
    unit_price: 50,
  },
  "mascara-cronograma-500g": {
    title: "Mascara Cronograma Capilar 500g",
    unit_price: 30,
  },
  "mascara-cronograma-1kg": {
    title: "Mascara Cronograma Capilar 1kg",
    unit_price: 50,
  },
  "bb-cream": {
    title: "BB Cream Absolute Protection",
    unit_price: 30,
  },
  queratina: {
    title: "Queratina 300ml",
    unit_price: 20,
  },
  "ativador-cachos": {
    title: "Ativador de Cachos Absolutely Curls 500ml",
    unit_price: 20,
  },
  "miracle-intensive": {
    title: "Miracle Intensive 500ml",
    unit_price: 20,
  },
  "superplex-keratin": {
    title: "Superplex Keratin",
    unit_price: 40,
  },
  "hair-botox": {
    title: "Hair Botox 1kg",
    unit_price: 60,
  },
  "gelatin-power-curls": {
    title: "Gelatin Power Curls 500g",
    unit_price: 20,
  },
  "perfume-capilar": {
    title: "Perfume Capilar",
    unit_price: 30,
  },
};

function setCorsHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function buildPreferenceItems(cartItems) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error("Carrinho vazio.");
  }

  return cartItems.map((item) => {
    const product = products[item.id];
    const quantity = Number(item.quantity);

    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      throw new Error("Item inválido no carrinho.");
    }

    return {
      title: product.title,
      quantity,
      unit_price: product.unit_price,
      currency_id: "BRL",
    };
  });
}

module.exports = async function handler(request, response) {
  setCorsHeaders(response);

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (request.method !== "POST") {
    response.status(405).json({ error: "Método não permitido." });
    return;
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;

  if (!accessToken) {
    response.status(500).json({ error: "MP_ACCESS_TOKEN não configurado." });
    return;
  }

  try {
    const items = buildPreferenceItems(request.body?.items);
    const siteUrl = process.env.PUBLIC_SITE_URL || "https://example.com";

    const mercadoPagoResponse = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          back_urls: {
            success: siteUrl,
            failure: siteUrl,
            pending: siteUrl,
          },
          auto_return: "approved",
          external_reference: `dolce-rosa-${Date.now()}`,
          statement_descriptor: "DOLCE ROSA",
        }),
      },
    );

    const data = await mercadoPagoResponse.json();

    if (!mercadoPagoResponse.ok) {
      response.status(mercadoPagoResponse.status).json({
        error: data.message || "Erro ao criar checkout no Mercado Pago.",
      });
      return;
    }

    response.status(200).json({
      id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
    });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
};
