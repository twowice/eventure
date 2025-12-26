"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { cn } from "@/lib/utils";

/**
 * @typedef {object} InfomationPopupProps
 * @property {string} className - 팝업의 전체에 적용하고 싶은 style을 받는 변수
 * @property {ReactNode} dialogTrigger - 팝업창을 열기 위한 트리거 컴포넌트입니다. (예: <Button>보기</Button>)
 * @property {string} title - 팝업창의 제목입니다.
 * @property {ReactNode} body - 팝업창의 본문 내용입니다. ReactNode 타입으로 다양한 컴포넌트를 전달할 수 있습니다.
 */

/**
 * 필요한 정보를 보여주는 용도로 사용하는 하단에 버튼이 없는 팝업창입니다.
 * className으로 적용하고 싶은 sytle을 전체 팝업 박스에 지정하는 것이 가능합니다.
 * 이 경우 기본 Dialog에 적용된 max-w-[calc(100%-2rem)] sm:max-w-lg 값이 삭제되어 반응형 구현이 사라지게 됩니다.
 * className으로 팝업창의 전체 크기를 조절하시고 싶으시면 lg:max-w-xxx, sm:max-w-xxx와 같은 형태로 반응형 크기 지정을 하셔야합니다.
 *
 * @param {InfomationPopupProps} props - 팝업에 전달될 속성들.
 * @returns {React.ReactElement} Infomation 팝업 컴포넌트.
 */
export const InfomationPopup = ({
  className,
  dialogTrigger,
  title,
  body,
}: {
  className?: string;
  dialogTrigger: ReactNode; //팝업창 오픈 버튼이자 팝업창 오픈 전의 화면에 보여질 컴포넌트
  title: string; //팝업창 제목 (좌상단 가장 큰 글자)
  body: ReactNode; //팝업창 바디에 들어갈 컴포넌트
}): React.ReactElement => {
  return (
    <Dialog>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent
        className={cn(
          "flex flex-col bg-white max-w-none p-4 gap-4",
          className ? "lg:max-w-none sm:max-w-none max-w-none " + className : ""
        )}
      >
        <DialogHeader>
          <DialogTitle>
            <div>
              <h1 className="flex justify-start text-[20px] font-semibold">
                {title}
              </h1>
            </div>
          </DialogTitle>
        </DialogHeader>
        {body}
      </DialogContent>
    </Dialog>
  );
};
