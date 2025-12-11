// src/components/header/Header.tsx
'use client';

import { Icon24 } from '@/components/icons/icon24';
import { Icon36 } from '@/components/icons/icon36';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const mainMenu = [
  { name: '이벤트',    icon: 'event',     href: '/event' },
  { name: '여행 기록', icon: 'record',    href: '/record' },
  { name: '파티 모집', icon: 'matching',  href: '/party' },
  { name: '마이페이지', icon: 'profile',   href: '/mypage' },
  { name: '더보기',    icon: 'more',      href: '/more' },
] as const;

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAuthClick = () => {
    setIsLoggedIn(!isLoggedIn);
    setIsOpen(false);
  };

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={clsx(
          'fixed top-0 left-0 bottom-0 z-50 w-32 bg-[#F1F5FA] border-r border-gray-200 shadow-2xl',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">

          {/* 로고 */}
          <div className="h-16 flex items-center justify-center border-b border-gray-200">
            <h1 className="text-2xl font-bold text-[#007DE4]">Myway</h1>
          </div>

          {/* 메뉴 - 완벽한 정렬 + 색상 통일 */}
          <nav className="flex-1 flex flex-col justify-center px-4 py-8">
            <div className="space-y-12">
              {mainMenu.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex flex-col items-center gap-2 px-4 py-3 rounded-2xl hover:bg-white/70 transition-all duration-200 hover:scale-105"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon36
                      name={item.icon}
                      className={clsx(
                        'w-9 h-9 flex-shrink-0 transition-colors duration-300',
                        isActive ? 'text-[#007DE4]' : 'text-[#04152F]'
                      )}
                    />
                    <span
                      className={clsx(
                        'text-xs font-medium transition-colors duration-300',
                        isActive ? 'text-[#007DE4]' : 'text-[#04152F]'
                      )}
                    >
                      {item.name}
                    </span>
                  </a>
                );
              })}
            </div>
          </nav>

          {/* 하단 로그인/로그아웃 - 미니멀 텍스트 */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={handleAuthClick}
              className="w-full py-3 text-center text-base font-medium text-[#04152F] hover:text-[#007DE4] transition-colors duration-300"
            >
              {isLoggedIn ? '로그아웃' : '로그인'}
            </button>
          </div>
        </div>
      </aside>

      {/* 모바일 햄버거 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-all"
      >
        <Icon24 name="hambugi" className="w-7 h-7 text-[#04152F]" />
      </button>
    </>
  );
}