'use client';

import { CheckboxComponent } from '@/components/basic/checkbox';
import PartyPanel from '@/components/header/panels/partypanel';
import { Icon24 } from '@/components/icons/icon24';
import { PartyRow } from '@/components/partyrow/PartyRow';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/searchBar';
import { parties as initialParties } from '@/dummy/party';
import { PartyCreatePopup } from '@/feature/party/partyCreatePopup';
import { PartyDetailPopup } from '@/feature/party/partyDetailPopup';
import { useState } from 'react';

export default function Party() {
   const [partyList, setPartyList] = useState(initialParties);
   const [selectedParty, setSelectedParty] = useState<any>(null);
   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

   const handleCreate = (create: any) => {
      console.log('파티 생성:', create);
      const newParty = {
         ...create,
         current_members: 0,
         max_members: parseInt(create.max_members),
         hostId: 'currentUser', // 실제 로그인한 유저 ID
         host: '현재 유저', // 실제 로그인한 유저이름
      };
      setPartyList([...partyList, newParty]);
   };

   const handleApply = () => {
      console.log('파티 신청 완료');
      setSelectedParty(null);
      setSelectedIndex(null);
   };

   const handleEdit = (updatedParty: any) => {
      console.log('파티 수정:', updatedParty);
      if (selectedIndex !== null) {
         const updatedList = [...partyList];
         updatedList[selectedIndex] = {
            ...updatedList[selectedIndex],
            ...updatedParty,
         };
         setPartyList(updatedList);
         setSelectedParty({
            ...updatedList[selectedIndex],
         });
      }
   };

   const handleSelect = (party: any, index: number) => {
      setSelectedParty(party);
      setSelectedIndex(index);
   };

   const handleDetailClose = () => {
      setSelectedParty(null);
      setSelectedIndex(null);
   };

   return (
      <PartyPanel>
         <div className="bg-white p-4 w-full flex flex-col gap-6">
            <p className="text-[32px]">안녕하세요, 00님</p>
            <div className="flex flex-col gap-2">
               <div className="flex flex-row justify-between">
                  <h1 className="text-[24px] font-semibold">파티 모집</h1>
                  <PartyCreatePopup
                     trigger={
                        <Button className="flex items-center">
                           새 파티
                           <Icon24 name="add" className="text-secondary" />
                        </Button>
                     }
                     onSave={handleCreate}
                     mode="create"
                  />
               </div>
               <SearchBar />
               <div className="p-2">
                  <CheckboxComponent
                     options={[
                        { value: 'applicable', label: '신청 가능' },
                        { value: 'applicable_deadline', label: '신청 마감' },
                     ]}
                  />
               </div>
               {partyList.length === 0 ? (
                  <div className="flex items-center justify-center text-foreground/60 font-semibold">
                     존재하는 파티가 없습니다.
                  </div>
               ) : (
                  partyList.map((party, index) => {
                     const isFull = party.current_members === party.max_members;
                     const isSelected = selectedIndex === index;
                     return (
                        <PartyDetailPopup
                           key={index}
                           party={party}
                           trigger={
                              <div
                                 className={isFull ? 'opacity-50' : 'cursor-pointer'}
                                 onClick={() => handleSelect(party, index)}
                              >
                                 <PartyRow
                                    index={index}
                                    partyName={party.partyName}
                                    current_members={party.current_members}
                                    max_members={party.max_members}
                                    isSelected={isSelected}
                                 />
                              </div>
                           }
                           currentUserId="currentUser" //실제 로그인한 유저 ID
                           onApply={handleApply}
                           onEdit={handleEdit}
                           onClose={handleDetailClose}
                        />
                     );
                  })
               )}
            </div>
            {/* 파티 생성 팝업 */}
            {selectedParty && (
               <PartyCreatePopup
                  trigger={<Button className="hidden" />}
                  onSave={handleEdit}
                  initialData={{
                     partyName: selectedParty.partyName,
                     max_members: selectedParty.max_members?.toString(),
                     location: selectedParty.location,
                     date: selectedParty.location,
                     time: selectedParty.time,
                     description: selectedParty.description,
                  }}
                  mode="edit"
               />
            )}
            {/* 페이지네이션 */}
         </div>
      </PartyPanel>
   );
}
