import { z } from "zod";

const dataSourceSchema = z.enum(["mock", "supabase"]);

export type DataSource = z.infer<typeof dataSourceSchema>;

/**
 * Nguồn dữ liệu của ứng dụng. Production không được chạy bằng mock
 * (dữ liệu demo không được xuất hiện như dữ liệu thật).
 */
export function resolveDataSource(
  raw: string | undefined,
  nodeEnv: string | undefined,
): DataSource {
  const source = dataSourceSchema.parse(raw ?? "mock");
  if (source === "mock" && nodeEnv === "production") {
    throw new Error("NEXT_PUBLIC_DATA_SOURCE=mock không được phép ở production.");
  }
  return source;
}
