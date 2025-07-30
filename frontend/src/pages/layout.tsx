import LayoutWrapper from "@/components/LayoutWrapper";
import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LayoutWrapper>{children}</LayoutWrapper>
  );
}