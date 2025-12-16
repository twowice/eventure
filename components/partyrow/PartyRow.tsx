"use client";

import { Icon24 } from "@/components/icons/icon24";
import { TwoFunctionPopup } from '@/components/popup/twofunction'
import { RadioComponent } from '@/components/basic/radio'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface PartyRowProps {
  index: number;
  partyName: string;
  current_members: number;
  max_members: number;
}

export function PartyRow({
  index,
  partyName,
  current_members,
  max_members,
}: PartyRowProps) {

  return (
    <div className="flex items-center justify-between w-full px-4 py-3 bg-[#007DE4]/10 rounded-[4px]">
      <div className="flex items-center gap-4">
        <span className="text-foreground font-semibold text-[16px]">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="text-[16px] font-medium text-[var(--foreground)]">
          {partyName}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-[14px] text-[var(--foreground)]">
          {current_members}/{max_members}
        </span>

        <button className="cursor-pointer">
          <Icon24 name="likedef" />
        </button>

        <TwoFunctionPopup
          dialogTrigger={
            <button className="cursor-pointer">
              <Icon24 name="notify" />
            </button>
          }
          title="사용자 신고 처리"
          body={
            <div className="flex flex-col gap-5 w-[360px] sm:w-[420px] pb-5 pt-2 max-h-[60vh] overflow-y-auto">

              {/* 신고자 */}
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-[#04152F]">신고자</p>
                <Input placeholder="신고자 이름 또는 ID" />
              </div>

              {/* 카테고리 */}
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-[#04152F]">카테고리</p>
                <RadioComponent
                  options={[
                    { value: '부정적인 언어', label: '부정적인 언어' },
                    { value: '도배', label: '도배' },
                    { value: '광고', label: '광고' },
                    { value: '사기', label: '사기' },
                    { value: '기타', label: '기타' },
                  ]}
                  className="flex flex-col gap-3"
                  itemGap="gap-2"
                />
              </div>

              {/* 신고 내용 */}
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-[#04152F]">신고 내용</p>
                <Textarea placeholder="신고 사유를 입력해주세요" rows={4} className="resize-none h-[96px]" />
              </div>

              {/* 채팅 내역 */}
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-[#04152F]">채팅 내역</p>
                <Input placeholder="관련 채팅 내용을 입력해주세요" />
              </div>

              {/* 발생 일시 */}
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-[#04152F]">발생 일시</p>
                <Input type="datetime-local" />
              </div>

              {/* 추가 의견 */}
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-[#04152F]">
                  추가 의견 <span className="text-xs text-muted-foreground">(선택)</span>
                </p>
                <Input placeholder="추가로 전달할 내용이 있다면 입력하세요" />
              </div>

            </div>
          }

          leftTitle="수정"
          rightTitle="적용"
          leftCallback={() => console.log("수정")}
          rightCallback={() => console.log("적용")}
        />
      </div>
    </div>
  );
}
