import { Metadata } from "next";
import "./global.css";
import Navbar from "./components/navbar/Navbar";

export const metadata: Metadata = {
  title: "Eggtive Recall",
  description: "Active Recall studying app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar></Navbar>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
