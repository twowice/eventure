'use client';

import { panelstore } from '@/stores/panelstore';
import SlidePanel from '../slidepanel';

export default function PartyPanel({ children }: { children: React.ReactNode }) {
   const { openpanel, setopenpanel } = panelstore();

   return (
      <SlidePanel isopen={openpanel === 'party'} onclose={() => setopenpanel(null)} title="파티 모집">
         <div className="space-y-4">{children}</div>
      </SlidePanel>
   );
}
