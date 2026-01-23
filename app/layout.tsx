import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/app/context/AuthContext";
import { WishlistProvider } from "@/app/context/WishlistContext";
import { CheckoutProvider } from "@/app/context/CheckoutContext";
import { Toaster } from "react-hot-toast";
import WhatsAppFloating from "@/components/ui/WhatsAppFloating";

// layout.tsx refinement
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Changed bg-gray-50 to bg-white for that clean boutique feel */}
      <body className="bg-white text-brandBlack antialiased">
        <AuthProvider>
          <WishlistProvider>
            <CheckoutProvider>
              <Toaster position="bottom-center" /> {/* Miss Mosa uses bottom notifications often */}
              
              <Navbar />

              {/* Removed shadow-sm and bg-white from main. 
                  Let the page components handle their own spacing. */}
              <main className="min-h-screen">
                {children}
                <WhatsAppFloating />
              </main>

              <Footer />
            </CheckoutProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
