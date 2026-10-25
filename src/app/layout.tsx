import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minh Kỳ Academy",
  description: "Hệ thống đào tạo, học tập và thi online của Minh Kỳ Group",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
