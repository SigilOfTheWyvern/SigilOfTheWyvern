import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
});

export const checkoutLineSchema = z.object({
  kind: z.enum(["merch", "ticket"]),
  variantId: z.string().optional(),
  ticketTypeId: z.string().optional(),
  qty: z.number().int().min(1).max(12),
});

export const checkoutSchema = z.object({
  lines: z.array(checkoutLineSchema).min(1).max(40),
});

export const productSchema = z.object({
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(2).max(120),
  kind: z.string().trim().min(2).max(40),
  fabric: z.string().trim().max(80),
  blurb: z.string().trim().max(400),
  priceCents: z.coerce.number().int().min(0),
  status: z.enum(["draft", "published"]),
  imagePath: z.string().trim().max(240).optional(),
});

export const eventSchema = z.object({
  city: z.string().trim().min(2).max(80),
  venue: z.string().trim().min(2).max(80),
  support: z.string().trim().max(80).optional(),
  date: z.string().min(8),
  status: z.enum(["on_sale", "sold_out", "past"]),
  published: z.coerce.boolean().optional(),
});

export const userAdminSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  roleId: z.string().min(1),
  status: z.enum(["active", "disabled"]),
});

export const roleSchema = z.object({
  name: z.string().trim().min(2).max(60),
  slug: z.string().trim().min(2).max(60).regex(/^[a-z0-9-]+$/),
  description: z.string().trim().min(2).max(200),
  color: z.string().trim().regex(/^#([0-9a-fA-F]{6})$/).optional(),
});

export const sectionSchema = z.object({
  type: z.string().trim().min(2).max(40),
  heading: z.string().trim().max(160).optional(),
  body: z.string().trim().max(4000).optional(),
  buttonLabel: z.string().trim().max(60).optional(),
  buttonHref: z.string().trim().max(200).optional(),
  imagePath: z.string().trim().max(240).optional(),
  background: z.string().trim().max(80).optional(),
  published: z.coerce.boolean().optional(),
});
