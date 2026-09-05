"use server";

import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { writeAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/rbac";
import { checkoutSchema } from "@/lib/validations";

type Line = {
  kind: "merch" | "ticket";
  variantId?: string;
  ticketTypeId?: string;
  qty: number;
};

async function priceLines(lines: Line[]) {
  const priced: {
    kind: "merch" | "ticket";
    label: string;
    variantId?: string;
    ticketTypeId?: string;
    eventId?: string;
    qty: number;
    unitCents: number;
  }[] = [];

  for (const line of lines) {
    if (line.kind === "merch") {
      if (!line.variantId) throw new Error("Missing variant.");
      const variant = await prisma.productVariant.findUnique({
        where: { id: line.variantId },
        include: { product: true },
      });
      if (!variant || variant.product.status !== "published") {
        throw new Error("Relic is not for sale.");
      }
      if (variant.inventory < line.qty) {
        throw new Error(`${variant.product.name} (${variant.size}) is short.`);
      }
      priced.push({
        kind: "merch",
        label: `${variant.product.name} · ${variant.size}`,
        variantId: variant.id,
        qty: line.qty,
        unitCents: variant.priceCents ?? variant.product.priceCents,
      });
    } else {
      if (!line.ticketTypeId) throw new Error("Missing ticket type.");
      const ticketType = await prisma.ticketType.findUnique({
        where: { id: line.ticketTypeId },
        include: { event: true },
      });
      if (!ticketType || !ticketType.event.published || ticketType.event.status !== "on_sale") {
        throw new Error("That rite is closed.");
      }
      if (ticketType.inventory < line.qty) {
        throw new Error(`${ticketType.name} tickets are short.`);
      }
      priced.push({
        kind: "ticket",
        label: `${ticketType.event.city} · ${ticketType.name}`,
        ticketTypeId: ticketType.id,
        eventId: ticketType.eventId,
        qty: line.qty,
        unitCents: ticketType.priceCents,
      });
    }
  }

  const totalCents = priced.reduce((sum, item) => sum + item.unitCents * item.qty, 0);
  return { priced, totalCents };
}

export async function fulfillOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order || order.status === "paid") return order;

  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      if (item.kind === "merch" && item.variantId) {
        const variant = await tx.productVariant.update({
          where: { id: item.variantId },
          data: { inventory: { decrement: item.qty } },
        });
        if (variant.inventory < 0) {
          throw new Error("Inventory raced out.");
        }
      }
      if (item.kind === "ticket" && item.ticketTypeId) {
        const type = await tx.ticketType.update({
          where: { id: item.ticketTypeId },
          data: { inventory: { decrement: item.qty } },
        });
        if (type.inventory < 0) {
          throw new Error("Tickets raced out.");
        }
        for (let i = 0; i < item.qty; i += 1) {
          await tx.ticket.create({
            data: {
              userId: order.userId,
              orderId: order.id,
              eventId: type.eventId,
              ticketTypeId: type.id,
              code: `SOTW-${randomBytes(6).toString("hex").toUpperCase()}`,
            },
          });
        }
      }
    }

    await tx.order.update({
      where: { id: order.id },
      data: { status: "paid" },
    });
    await tx.notification.create({
      data: {
        userId: order.userId,
        title: "Order sealed",
        body: `Order ${order.id.slice(-6).toUpperCase()} is paid. Relics and tickets are in your hall.`,
      },
    });
  });

  await writeAudit({
    userId: order.userId,
    action: "publish",
    resource: "orders",
    targetId: order.id,
    meta: "fulfill",
  });
  return prisma.order.findUnique({ where: { id: orderId } });
}

export async function startCheckout(input: unknown) {
  const user = await requireUser();
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "The bag could not be read." };
  }

  let priced;
  try {
    priced = await priceLines(parsed.data.lines);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Checkout failed." };
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: "pending",
      totalCents: priced.totalCents,
      items: {
        create: priced.priced.map((item) => ({
          kind: item.kind,
          label: item.label,
          variantId: item.variantId,
          ticketTypeId: item.ticketTypeId,
          qty: item.qty,
          unitCents: item.unitCents,
        })),
      },
    },
  });

  await writeAudit({
    userId: user.id,
    action: "create",
    resource: "orders",
    targetId: order.id,
  });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey) {
    const stripe = new Stripe(stripeKey);
    const origin = process.env.AUTH_URL ?? "http://localhost:3001";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      client_reference_id: order.id,
      success_url: `${origin}/fan/orders?paid=${order.id}`,
      cancel_url: `${origin}/checkout?cancelled=1`,
      line_items: priced.priced.map((item) => ({
        quantity: item.qty,
        price_data: {
          currency: "usd",
          unit_amount: item.unitCents,
          product_data: { name: item.label },
        },
      })),
    });
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });
    if (!session.url) {
      return { error: "Stripe did not return a checkout path." };
    }
    redirect(session.url);
  }

  if (process.env.DEV_CHECKOUT === "1") {
    await fulfillOrder(order.id);
    redirect(`/fan/orders?paid=${order.id}`);
  }

  return { error: "Payments are not configured." };
}
