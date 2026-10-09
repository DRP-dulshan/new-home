import GuidePage from '@/components/guides/GuidePage';
import { goldenVisa as guide } from '@/data/guides';

export const metadata = guide.meta;

export default function Page() {
  return <GuidePage guide={guide} />;
}
