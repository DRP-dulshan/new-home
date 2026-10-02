import LegalDocument from '@/components/legal/LegalDocument';
import { privacy } from '@/data/legal';

export const metadata = { title: 'Privacy Policy | Dubai Rapid Properties' };

export default function Page() {
  return <LegalDocument doc={privacy} other={{ label: 'Terms & Conditions', href: '/terms' }} />;
}
