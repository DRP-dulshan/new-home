import LegalDocument from '@/components/legal/LegalDocument';
import { terms } from '@/data/legal';

export const metadata = { title: 'Terms & Conditions | Dubai Rapid Properties' };

export default function Page() {
  return <LegalDocument doc={terms} other={{ label: 'Privacy Policy', href: '/privacy' }} />;
}
