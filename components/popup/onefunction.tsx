"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

export const OneFunctionPopup = ({
  dialogTrigger,
  title,
  body,
  buttonTitle,
  callback = () => {},
}: {
  dialogTrigger: ReactNode; //팝업창 오픈 버튼이자 팝업창 오픈 전의 화면에 보여질 컴포넌트
  title: string; //팝업창 제목 (좌상단 가장 큰 글자)
  body: ReactNode; //팝업창 바디에 들어갈 컴포넌트
  buttonTitle: string; //하단 버튼에 들어갈 문자열
  callback?: () => void; //버튼 클릭시 기능 동작 콜백 함수
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className="flex flex-col bg-white w-min-8xl p-[16px] gap-[16px]">
        <DialogHeader>
          <DialogTitle>
            <div>
              <h1 className="flex justify-start text-[20px] font-semibold">
                {title}
              </h1>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center sm:justify-center">{body}</div>

        <DialogFooter className="flex flex-row gap-x-10px ">
          <DialogClose asChild>
            <Button
              className="flex-1 sm:flex-1 bg"
              type="button"
              onClick={callback}
            >
              {buttonTitle}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
