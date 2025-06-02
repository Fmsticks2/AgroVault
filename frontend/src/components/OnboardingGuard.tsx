import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface OnboardingGuardProps {
  children: ReactNode;
}

const OnboardingGuard = ({ children }: OnboardingGuardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    setHasCompletedOnboarding(onboardingCompleted === 'true');
    setIsLoading(false);
  }, []);

  if (isLoading) {
    // Show loading state while checking localStorage
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If onboarding is not completed, redirect to onboarding
  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // If onboarding is completed, render the children
  return <>{children}</>;
};

export default OnboardingGuard;