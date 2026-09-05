import { deleteNews, saveNews } from "@/actions/cms";
import { DashHeader, EmptyState } from "@/components/dash-ui";
import { AutoSlug, Field, PublishSelect, areaClass, inputClass } from "@/components/easy-fields";
import { prisma } from "@/lib/prisma";
import { hasPermission, requirePermission } from "@/lib/rbac";

export default async function StudioNewsPage() {
  const user = await requirePermission("news", "view");
  const articles = await prisma.newsArticle.findMany({ orderBy: { createdAt: "desc" } });
  const canCreate = hasPermission(user, "news", "create");
  const canEdit = hasPermission(user, "news", "edit");
  const canDelete = hasPermission(user, "news", "delete");

  return (
    <main className="px-5 py-10 md:px-8">
      <DashHeader kicker="Dispatches" title="News" hint="What you write and upload here is what /news shows." />
      {canCreate ? (
        <form action={saveNews} className="mt-8 grid gap-4 border border-steel bg-obsidian p-6">
          <p className="font-display text-[10px] tracking-[0.18em] text-blood uppercase">
            Add an article
          </p>
          <div className="grid gap-4">
            <AutoSlug titleLabel="Headline" />
            <Field label="Date line" hint="Shown above the article, like March 2026.">
              <input name="date" className={inputClass} />
            </Field>
            <Field label="Short excerpt">
              <textarea name="excerpt" className={areaClass} />
            </Field>
            <Field label="Full article">
              <textarea name="body" rows={8} className={areaClass} />
            </Field>
            <PublishSelect />
            <button className="w-fit border border-blood bg-blood px-4 py-2 text-xs uppercase">Add article</button>
          </div>
        </form>
      ) : null}
      <div className="mt-8 space-y-4">
        {articles.length === 0 ? (
          <EmptyState title="No articles" body="No news has been written yet." />
        ) : (
          articles.map((article) => (
            <article key={article.id} className="grid gap-6 border border-steel bg-obsidian p-4 md:grid-cols-2">
              <div>
                <p className="font-display text-[10px] tracking-[0.2em] text-blood uppercase">Public preview</p>
                <p className="mt-4 text-xs tracking-[0.18em] text-ash uppercase">{article.date}</p>
                <h2 className="mt-2 font-display text-2xl uppercase text-bone">{article.title}</h2>
                <p className="mt-3 text-sm leading-7 text-ash">{article.excerpt}</p>
              </div>
              {canEdit ? (
                <form action={saveNews} className="grid gap-4">
                  <input type="hidden" name="id" value={article.id} />
                  <input type="hidden" name="slug" value={article.slug} />
                  <Field label="Headline">
                    <input name="title" defaultValue={article.title} className={inputClass} />
                  </Field>
                  <Field label="Date line">
                    <input name="date" defaultValue={article.date} className={inputClass} />
                  </Field>
                  <Field label="Short excerpt">
                    <textarea name="excerpt" defaultValue={article.excerpt} className={areaClass} />
                  </Field>
                  <Field label="Full article">
                    <textarea name="body" defaultValue={article.body} rows={8} className={areaClass} />
                  </Field>
                  <PublishSelect defaultValue={article.status} />
                  <div className="flex gap-3">
                    <button className="border border-blood px-3 py-2 text-xs uppercase">Save</button>
                    {canDelete ? (
                      <button formAction={deleteNews.bind(null, article.id)} className="text-xs uppercase text-ember">
                        Delete
                      </button>
                    ) : null}
                  </div>
                </form>
              ) : (
                <p className="text-sm text-ash">
                  {article.date} · {article.status === "published" ? "Live" : "Draft"}
                </p>
              )}
            </article>
          ))
        )}
      </div>
    </main>
  );
}
