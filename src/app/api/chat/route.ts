import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { supabaseAdmin } from "@/lib/supabase/admin";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // Fetch products to provide context
    const { data: products, error: supabaseError } = await supabaseAdmin
      .from("products")
      .select("id, title, price, category, brand, series, specs, stock, image_urls")
      .limit(100);

    if (supabaseError) {
      console.error("Supabase error in chat API:", supabaseError);
    }

    const productsContext = products && products.length > 0
      ? products
        .map(
          (p) =>
            `- ${p.title} (ID: ${p.id}) (${p.brand}${p.series ? ` ${p.series}` : ''}): RS. ${p.price?.toLocaleString()} | RAM: ${p.specs?.ram || 'N/A'} | Storage: ${p.specs?.storage || 'N/A'} | Category: ${p.category}`
        )
        .join("\n")
      : "No products currently available in the catalog.";

    const systemMessage = {
      role: "system",
      content: `You are the Lapzen assistant, a versatile, polite, and professional expert on laptops. 
Your primary goal is to answer any questions regarding laptops and provide details about Lapzen.

Lapzen Product Catalog:
${productsContext}

Guidelines:
1. ALWAYS check the 'Lapzen Product Catalog' provided above BEFORE answering any product-related queries.
2. If a user asks for a specific type of laptop (e.g., business, gaming, student), recommend matching items from the catalog.
3. If a requested laptop or category is NOT found in the catalog, you MUST explicitly inform the user and direct them to call our assistance support number at 03090009022 for personalized help.
4. Be knowledgeable about technical specs (RAM, Storage, Brand, Series) and provide comparisons if asked.
5. Always remain polite, professional, and helpful.
6. Mention all prices in Pakistani Rupees (RS.).
7. Keep responses concise but informative, using bullet points for clarity when listing products.
8. If the user's budget is mentioned, only suggest laptops within that budget from the catalog.
9. Each laptop found in catalog is always in stock.
10. IMPORTANT: When you recommend or mention specific products from the catalog, you MUST include a product card for each by using the format [PRODUCT_CARD:id] on a new line. For example: "I recommend the Dell XPS 15.\n[PRODUCT_CARD:uuid-here]"
11. CRITICAL: When displaying product cards [PRODUCT_CARD:id], keep your text response extremely brief (1-2 short sentences maximum). Let the cards do the talking. Avoid listing detailed specs in the text if you are already providing a card for that product.`,
    };

    const completion = await groq.chat.completions.create({
      model: "qwen/qwen3.6-27b",
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const rawResponse = completion.choices[0]?.message?.content || "";
    const response = rawResponse
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .trim();

    // Extract product IDs mentioned in the response to send product data
    const productIds = response?.match(/\[PRODUCT_CARD:([a-f0-9-]{36})\]/g)?.map(match => match.split(':')[1].replace(']', '')) || [];
    const mentionedProducts = products?.filter(p => productIds.includes(p.id)) || [];

    return NextResponse.json({ response, products: mentionedProducts });
  } catch (error: any) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
