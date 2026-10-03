import { redirect } from 'next/navigation';

// Deploy signup goes to the real PROXe onboarding (Z, 3 Oct 2026). This route
// stays only so old links and bookmarks land in the right place.
export default function OnboardingPage() {
  redirect('https://proxe.goproxe.com/onboarding');
}
