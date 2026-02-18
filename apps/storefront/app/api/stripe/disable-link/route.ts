import { NextResponse } from "next/server";

/**
 * POST /api/stripe/disable-link
 *
 * For authenticated users, update the PaymentIntent to use explicit
 * payment_method_types (card only) instead of automatic_payment_methods.
 * This removes the Stripe Link "Save my information" prompt from the
 * PaymentElement since Link is no longer an allowed method.
 */
export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY not configured" },
      { status: 500 }
    );
  }

  const { clientSecret } = await request.json();
  if (!clientSecret || typeof clientSecret !== "string") {
    return NextResponse.json(
      { error: "Missing clientSecret" },
      { status: 400 }
    );
  }

  // Extract PaymentIntent ID from client secret (format: pi_xxx_secret_yyy)
  const piId = clientSecret.split("_secret_")[0];
  if (!piId.startsWith("pi_")) {
    return NextResponse.json(
      { error: "Invalid client secret format" },
      { status: 400 }
    );
  }

  const res = await fetch(
    `https://api.stripe.com/v1/payment_intents/${piId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "payment_method_types[]=card",
    }
  );

  if (!res.ok) {
    const errBody = await res.text();
    console.error("[disable-link] Stripe API error:", errBody);
    return NextResponse.json({ error: errBody }, { status: res.status });
  }

  return NextResponse.json({ ok: true });
}
