import React from 'react'
import { MessageCircle, Moon, Sun, Github } from 'lucide-react';
import Header from './Header';
import { Footer } from './Footer';
;


const Layout = ({ children }) => {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </div>
    );
  };
  
  export default Layout;