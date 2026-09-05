import { revalidatePath } from "next/cache";

const PUBLIC_PATHS = [
  "/",
  "/music",
  "/tour",
  "/store",
  "/media",
  "/band",
  "/news",
  "/contact",
];

export function revalidateSite(...extra: string[]) {
  revalidatePath("/", "layout");
  for (const path of PUBLIC_PATHS) {
    revalidatePath(path, "page");
  }
  for (const path of extra) {
    if (path) revalidatePath(path);
  }
}
