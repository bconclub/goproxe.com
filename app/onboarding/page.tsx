import type { Metadata } from 'next';
import OnboardingForm from './OnboardingForm';

export const metadata: Metadata = {
  title: 'Set up your brand',
  description: 'Start PROXe onboarding with your brand name and website.',
  robots: { index: false, follow: true },
};

export default function OnboardingPage() {
  return <OnboardingForm />;
}
