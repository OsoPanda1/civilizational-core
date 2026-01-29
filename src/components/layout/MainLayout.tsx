import { ReactNode } from "react";
import { Header } from "./Header";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              TAMV Online — Territorio Autónomo de Memoria Viva
            </p>
            <p className="text-xs text-muted-foreground">
              Sistema de identidad soberana verificable
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
