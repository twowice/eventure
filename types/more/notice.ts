export type NoticeType = 'normal' | 'update' | 'event' | 'policy';

export interface Notice {
   id: number;
   type: NoticeType;
   title: string;
   detail: string;
   date: string;
   isTopFixed?: boolean;
}
