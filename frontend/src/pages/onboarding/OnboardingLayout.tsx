import { ReactNode } from 'react';

interface OnboardingLayoutProps {
  children: ReactNode;
}

const OnboardingLayout = ({ children }: OnboardingLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="w-full bg-background-dark py-4 px-6 shadow-md">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <img 
              src="/logo.svg" 
              alt="AgroVault Logo" 
              className="h-8 w-8" 
              onError={(e) => {
                // Fallback if logo.svg doesn't exist
                e.currentTarget.src = 'https://via.placeholder.com/32/4F46E5/FFFFFF?text=AV';
              }}
            />
            <span className="text-xl font-bold text-white">AgroVault</span>
          </div>
          <div className="text-sm text-text-secondary">
            Secure Agricultural Finance Platform
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full bg-background-dark py-3 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-text-secondary">
          <div>© {new Date().getFullYear()} AgroVault. All rights reserved.</div>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingLayout;