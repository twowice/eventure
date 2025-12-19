'use client';

import { TwoFunctionPopup } from '@/components/popup/twofunction';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';

type PartyCreate = {
   partyName: string;
   max_members: string;
   description?: string;
   location?: string;
   date?: string;
   time?: string;
};

type PartyCreatePopupProps = {
   trigger: React.ReactNode;
   onSave: (data: PartyCreate) => void;
   initialData?: Partial<PartyCreate>;
   mode?: 'create' | 'edit';
};

export const PartyCreatePopup = ({ trigger, onSave, initialData, mode = 'create' }: PartyCreatePopupProps) => {
   const [create, setCreate] = useState<PartyCreate>({
      partyName: '',
      max_members: '',
      location: '',
      date: '',
      time: '',
      description: '',
   });

   useEffect(() => {
      if (initialData) {
         setCreate({
            partyName: initialData.partyName || '',
            max_members: initialData.max_members || '',
            location: initialData.location || '',
            date: initialData.date || '',
            time: initialData.time || '',
            description: initialData.description || '',
         });
      } else {
         setCreate({
            partyName: '',
            max_members: '',
            location: '',
            date: '',
            time: '',
            description: '',
         });
      }
   }, [initialData]);

   const handleSave = () => {
      if (!create.partyName.trim()) {
         alert('파티명을 입력해주세요.');
         return;
      }
      if (!create.max_members || parseInt(create.max_members) < 1) {
         alert('최대 인원을 입력해주세요.');
         return;
      }
      if (!create.location) {
         alert('장소를 입력해주세요.');
         return;
      }
      if (!create.date) {
         alert('날짜를 입력해주세요.');
         return;
      }
      if (!create.time) {
         alert('시간을 입력해주세요.');
         return;
      }
      if (!create.description?.trim()) {
         alert('파티 소개를 입력해주세요.');
         return;
      }
      onSave(create);
   };

   const handleCancel = () => {
      setCreate({
         partyName: '',
         max_members: '',
         location: '',
         date: '',
         time: '',
         description: '',
      });
   };

   const PopupBody = (
      <div className="flex flex-col gap-4 h-full overflow-y-auto">
         {/* 파티명 */}
         <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
               파티명
               <span className="text-red-500">*</span>
            </label>
            <Input
               type="text"
               value={create.partyName}
               onChange={e => setCreate({ ...create, partyName: e.target.value })}
               placeholder="파티 명을 입력하세요."
            />
         </div>
         {/* 일정 */}
         <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
               일정
               <span className="text-red-500">*</span>
            </label>
            <Input type="datetime-local" />
         </div>
         {/* 이벤트명 */}
         <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
               이벤트명
               <span className="text-red-500">*</span>
            </label>
            <Input
               type="text"
               value={create.eventName}
               onChange={e => setCreate({ ...create, eventName: e.target.value })}
               placeholder="이벤트 명을 입력하세요."
            />
         </div>
         {/* 최대 인원 */}
         <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
               최대 인원
               <span className="text-red-500">*</span>
            </label>
            <Input
               type="number"
               value={create.max_members}
               onChange={e => setCreate({ ...create, max_members: e.target.value })}
               placeholder="1"
               min={1}
            />
         </div>
         {/* 위치 */}
         <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
               위치
               <span className="text-red-500">*</span>
            </label>
            <Input
               type="text"
               value={create.location}
               onChange={e => setCreate({ ...create, location: e.target.value })}
               placeholder="장소를 입력하세요."
            />
         </div>
         {/* 파티 소개 */}
         <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-medium text-gray-700">
               파티 소개
               <span className="text-red-500">*</span>
            </label>
            <Textarea
               value={create.description}
               onChange={e => setCreate({ ...create, description: e.target.value })}
               placeholder="파티에 대한 소개설명을 입력하세요."
               className="resize-none flex-1"
            />
         </div>
         {/* 태그 */}
         <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
               해시태그
               <span className="text-red-500">*</span>
            </label>
            <Input
               type="text"
               value={create.tag}
               onChange={e => setCreate({ ...create, tag: e.target.value })}
               placeholder="태그를 입력하세요."
            />
         </div>
      </div>
   );
   return (
      <TwoFunctionPopup
         dialogTrigger={trigger}
         title="새 파티"
         body={PopupBody}
         leftTitle="취소"
         leftCallback={handleCancel}
         rightTitle="등록"
         rightCallback={handleSave}
         className="w-150 h-[calc(100vh-40px)]"
         hideOverlay={true}
         position="top-left"
      />
   );
};
