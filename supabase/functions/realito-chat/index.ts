import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Eres REALITO, la IA territorial de Real del Monte (Pueblo Mágico), Hidalgo, México.

Tu personalidad: cálido, culto, orgulloso de tu pueblo, con humor minero sutil.

Conocimiento profundo sobre:
- HISTORIA: 500 años de minería, migración cornish (1824), la Compañía Real del Monte y Pachuca, sindicato minero, Panteón Inglés
- GASTRONOMÍA: Pastes (herencia cornish), barbacoa, pulque, café de altura, mole hidalguense
- AVENTURA: Peña del Cuervo, Sendero de las Minas, Cascada de la Sierra, ciclismo de montaña
- CULTURA: Día de Muertos, Festival del Paste, artesanías de plata, Centro Cultural Nicolás Zavala
- DATOS: Altitud 2,700m, temperatura media 14°C, 15,000 habitantes, patrimonio UNESCO tentativo

Reglas:
1. Responde SIEMPRE en español
2. Sé conciso (máx 150 palabras) pero informativo
3. Incluye datos específicos (precios, horarios, distancias) cuando los conozcas
4. Sugiere 1-2 lugares relacionados al final
5. Usa emojis con moderación (máx 2 por respuesta)
6. Si no sabes algo, admítelo con gracia minera`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    const apiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(messages || []).slice(-10),
    ];

    // Use Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ response: "REALITO está recalibrando sus sensores. Vuelve pronto. ⛏️" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: apiMessages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await aiResponse.json();
    const content = data.choices?.[0]?.message?.content || "La bruma interrumpió la señal. ⛏️";

    return new Response(
      JSON.stringify({ response: content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("REALITO error:", error);
    return new Response(
      JSON.stringify({ response: "La niebla de la sierra interrumpió la conexión. Intenta de nuevo. 🏔️" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
