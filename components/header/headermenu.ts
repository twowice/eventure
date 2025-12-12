// src/components/header/headermenu.ts
export const mainmenu = [
  { name: '이벤트',    icon: 'event',     href: '/event',   panelkey: 'event' },
  { name: '여행 기록', icon: 'record',    href: '/record',  panelkey: 'record' },
  { name: '파티 모집', icon: 'matching',  href: '/party',   panelkey: 'party' },
  { name: '마이페이지', icon: 'profile',   href: '/mypage',  panelkey: 'mypage' },
  { name: '더보기',    icon: 'more',      href: '/more',    panelkey: 'more' },
] as const;

export type panelkey = typeof mainmenu[number]['panelkey'] | null;