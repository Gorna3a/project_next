'use client';

import { type ReactNode } from "react";
import { AuthProvider } from "../src/core/context/AuthContext";
import { ThemeProvider } from "../src/core/context/ThemeContext";
import { LanguageProvider } from "../src/core/context/LanguageContext";
import { NotificationProvider } from "../src/core/context/NotificationContext";
import { Toaster } from "react-hot-toast";

export const Providers = ({ children }: { children: ReactNode }) => (
  <LanguageProvider>
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "12px",
                fontSize: "14px",
              },
            }}
          />
          {children}
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  </LanguageProvider>
);
