import React, { Suspense } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { PageLoader } from '../shared/PageLoader';

export const PublicPageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Navbar />
    <main id="main-content" className="page-section pt-24 md:pt-28 animate-in fade-in duration-500 overflow-x-hidden">
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </main>
    <Footer />
  </>
);
