import { deleteProduct, deleteVariant, saveProduct, saveVariant } from "@/actions/cms";
import { DashHeader, EmptyState } from "@/components/dash-ui";
import { AutoSlug, DollarInput, Field, PublishSelect, areaClass, inputClass } from "@/components/easy-fields";
import { ImageUpload } from "@/components/image-upload";
import { money } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { hasPermission, requirePermission } from "@/lib/rbac";

export default async function StudioMerchPage() {
  const user = await requirePermission("merch", "view");
  const products = await prisma.product.findMany({ include: { variants: true }, orderBy: { name: "asc" } });
  const canCreate = hasPermission(user, "merch", "create");
  const canEdit = hasPermission(user, "merch", "edit");
  const canDelete = hasPermission(user, "merch", "delete");

  return (
    <main className="px-5 py-10 md:px-8">
      <DashHeader kicker="Store" title="Merch" hint="What you save here is what the store shows. Upload a photo. Type the price in dollars." />
      {canCreate ? (
        <form action={saveProduct} className="mt-8 grid gap-4 border border-steel bg-obsidian p-6 md:grid-cols-2">
          <ImageUpload name="imagePath" label="Relic photo" />
          <div className="grid gap-4 content-start">
            <AutoSlug titleName="name" slugName="slug" titleLabel="Name" />
            <Field label="Kind">
              <select name="kind" className={inputClass}>
                <option value="Apparel">Apparel</option>
                <option value="Vinyl">Vinyl</option>
                <option value="Audio">Audio</option>
                <option value="Print">Print</option>
                <option value="Relic">Relic</option>
              </select>
            </Field>
            <Field label="Material">
              <input name="fabric" className={inputClass} />
            </Field>
            <DollarInput />
            <PublishSelect />
            <Field label="Short description">
              <textarea name="blurb" className={areaClass} />
            </Field>
            <button className="border border-blood bg-blood px-4 py-2 font-display text-[11px] tracking-[0.2em] uppercase">
              Create relic
            </button>
          </div>
        </form>
      ) : null}
      <div className="mt-10 space-y-6">
        {products.length === 0 ? (
          <EmptyState title="No relics" body="Nothing is in the store catalog yet." />
        ) : (
          products.map((product) => (
            <article key={product.id} className="border border-steel bg-obsidian p-5">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-display text-[10px] tracking-[0.2em] text-blood uppercase">Store preview</p>
                  <h2 className="mt-2 font-display text-2xl uppercase text-bone">{product.name}</h2>
                  <p className="mt-1 text-sm text-ash">
                    {product.kind} · {money(product.priceCents)} · {product.status === "published" ? "Live on /store" : "Draft"}
                  </p>
                </div>
              </div>
              {canEdit ? (
                <form action={saveProduct} className="mt-4 grid gap-4 md:grid-cols-2">
                  <input type="hidden" name="id" value={product.id} />
                  <input type="hidden" name="slug" value={product.slug} />
                  <div className="md:col-span-2">
                    <ImageUpload name="imagePath" defaultValue={product.imagePath ?? ""} label="Relic photo" />
                  </div>
                  <Field label="Name">
                    <input name="name" defaultValue={product.name} className={inputClass} />
                  </Field>
                  <Field label="Kind">
                    <select name="kind" defaultValue={product.kind} className={inputClass}>
                      <option value="Apparel">Apparel</option>
                      <option value="Vinyl">Vinyl</option>
                      <option value="Audio">Audio</option>
                      <option value="Print">Print</option>
                      <option value="Relic">Relic</option>
                    </select>
                  </Field>
                  <Field label="Material">
                    <input name="fabric" defaultValue={product.fabric} className={inputClass} />
                  </Field>
                  <DollarInput defaultCents={product.priceCents} />
                  <PublishSelect defaultValue={product.status} />
                  <div className="md:col-span-2">
                    <Field label="Short description">
                      <textarea name="blurb" defaultValue={product.blurb} className={areaClass} />
                    </Field>
                  </div>
                  <button className="border border-blood px-4 py-2 text-xs uppercase">Save</button>
                </form>
              ) : (
                <p className="mt-3 text-sm text-ash">{product.blurb}</p>
              )}
              <p className="mt-5 font-display text-[10px] tracking-[0.18em] text-ash uppercase">Sizes</p>
              <ul className="mt-2 space-y-2">
                {product.variants.map((variant) => (
                  <li key={variant.id}>
                    {canEdit ? (
                      <form action={saveVariant} className="flex flex-wrap items-end gap-2">
                        <input type="hidden" name="id" value={variant.id} />
                        <input type="hidden" name="productId" value={product.id} />
                        <Field label="Size">
                          <input name="size" defaultValue={variant.size} className={`${inputClass} w-24`} />
                        </Field>
                        <Field label="In stock">
                          <input name="inventory" defaultValue={variant.inventory} className={`${inputClass} w-24`} />
                        </Field>
                        <button className="h-11 border border-steel px-3 text-xs uppercase">Save</button>
                        {canDelete ? (
                          <button formAction={deleteVariant.bind(null, variant.id)} className="h-11 text-xs uppercase text-ember">
                            Delete
                          </button>
                        ) : null}
                      </form>
                    ) : (
                      <p className="text-sm text-ash">
                        {variant.size} · {variant.inventory} left
                      </p>
                    )}
                  </li>
                ))}
              </ul>
              {canEdit ? (
                <form action={saveVariant} className="mt-4 flex flex-wrap items-end gap-2">
                  <input type="hidden" name="productId" value={product.id} />
                  <Field label="New size">
                    <input name="size" className={`${inputClass} w-28`} />
                  </Field>
                  <Field label="How many">
                    <input name="inventory" defaultValue={0} className={`${inputClass} w-24`} />
                  </Field>
                  <button className="h-11 border border-steel px-3 text-xs uppercase">Add size</button>
                </form>
              ) : null}
              {canDelete ? (
                <form action={deleteProduct.bind(null, product.id)} className="mt-3">
                  <button className="text-xs uppercase text-ember">Delete relic</button>
                </form>
              ) : null}
            </article>
          ))
        )}
      </div>
    </main>
  );
}
