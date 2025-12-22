'use client';
import { RadioComponent } from '@/components/basic/radio';
import { Icon24 } from '@/components/icons/icon24';
import { Segment } from '@/components/tabs/segment/segment';
import { Button } from '@/components/ui/button/button';
import Tab from '@/components/ui/tab';
import { allNotices } from '@/dummy/more';
import { NoticeList } from '@/feature/more/noticeList';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import MorePanel from '@/components/header/panels/morepanel';
import { NoticeType } from '@/types/more/notice';
import { EllipsisPagination } from '@/components/pagination/pagination';

export default function MoreContent({ children }: { children?: React.ReactNode }) {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();
   const isDetailNotice = pathname.startsWith('/morepage/notice/');
   const isDetailPolicy = pathname.startsWith('/morepage/policy/');

   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 15;

   // 공지사항 탭 내의 세부 필터 상태 (전체, 일반 등)
   const [noticeFilter, setNoticeFilter] = useState<NoticeType | 'all'>('all');

   const tabFromUrl = searchParams.get('tab');
   const [selectedTab, setSelectedTab] = useState(
      isDetailNotice ? 'notice' : isDetailPolicy ? 'policy' : tabFromUrl || 'alarm',
   );

   // 1. 데이터 필터링 로직 (부모에서 계산)
   const filteredNotices = useMemo(() => {
      if (noticeFilter === 'all') return allNotices;
      return allNotices.filter(n => n.type === noticeFilter);
   }, [noticeFilter]);

   const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

   const pagedNotices = useMemo(() => {
      const start = (currentPage - 1) * itemsPerPage;
      return filteredNotices.slice(start, start + itemsPerPage);
   }, [currentPage, filteredNotices]);

   // 탭이나 필터 변경 시 페이지 초기화
   useEffect(() => {
      setCurrentPage(1);
   }, [selectedTab, noticeFilter]);

   useEffect(() => {
      if (isDetailNotice) {
         setSelectedTab('notice');
      } else if (isDetailPolicy) {
         setSelectedTab('policy');
      } else if (tabFromUrl) {
         setSelectedTab(tabFromUrl);
      }
   }, [isDetailNotice, tabFromUrl, isDetailPolicy]);

   return (
      <MorePanel>
         <div className="bg-white w-full h-full flex flex-col gap-6">
            {/* 헤더 */}
            <div className="shrink-0">
               <p className="text-[32px]">안녕하세요, 00님</p>
            </div>
            <div className="flex-1 min-h-0">
               <Tab
                  value={selectedTab}
                  onValueChange={setSelectedTab}
                  items={[
                     {
                        value: 'alarm',
                        label: '알림 설정',
                        content: (
                           <div className="flex flex-col h-full">
                              <div className="flex-1 overflow-y-auto">
                                 <div className="flex flex-col gap-4">
                                    <div className="text-xl flex flex-col gap-3">
                                       알림 설정
                                       <div className="flex flex-col gap-2 text-base">
                                          신고 알림
                                          <RadioComponent
                                             options={[
                                                { value: 'set', label: '설정' },
                                                { value: 'unset', label: '해제' },
                                             ]}
                                             className="flex text-base [&_label]:text-base [&_span]:text-base"
                                          />
                                       </div>
                                       <div className="flex flex-col gap-2 text-base">
                                          파티 신청완료 알림
                                          <RadioComponent
                                             options={[
                                                { value: 'set', label: '설정' },
                                                { value: 'unset', label: '해제' },
                                             ]}
                                             className="flex text-base [&_label]:text-base [&_span]:text-base"
                                          />
                                       </div>
                                       <div className="flex flex-col gap-2 text-base">
                                          파티 신청 알림
                                          <RadioComponent
                                             options={[
                                                { value: 'set', label: '설정' },
                                                { value: 'unset', label: '해제' },
                                             ]}
                                             className="flex text-base [&_label]:text-base [&_span]:text-base"
                                          />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <Button variant={'secondary'} size={'lg'} className="w-full shrink-0 mt-4">
                                 저장
                              </Button>
                           </div>
                        ),
                     },
                     {
                        value: 'notice',
                        label: '공지사항',
                        content: isDetailNotice ? (
                           <div className="flex flex-col h-full ">{children}</div>
                        ) : (
                           <div className="flex flex-col h-full min-h-0">
                              <div className="flex-1 min-h-0 h-full">
                                 <Segment
                                    onValueChange={val => setNoticeFilter(val as any)}
                                    contents={[
                                       {
                                          value: 'all',
                                          title: '전체',
                                          content: <NoticeList data={pagedNotices} />,
                                       },
                                       {
                                          value: 'normal',
                                          title: '일반',
                                          content: <NoticeList data={pagedNotices} />,
                                       },
                                       {
                                          value: 'update',
                                          title: '업데이트',
                                          content: <NoticeList data={pagedNotices} />,
                                       },
                                       {
                                          value: 'event',
                                          title: '이벤트',
                                          content: <NoticeList data={pagedNotices} />,
                                       },
                                       {
                                          value: 'policy',
                                          title: '이용정책',
                                          content: <NoticeList data={pagedNotices} />,
                                       },
                                    ]}
                                 />
                              </div>
                           </div>
                        ),
                     },
                     {
                        value: 'policy',
                        label: '이용약관 및 정책',
                        content: isDetailPolicy ? (
                           <div className="flex flex-col h-full">{children}</div>
                        ) : (
                           <div className="flex flex-col gap-2 overflow-y-auto">
                              <Button
                                 variant={'icon-right'}
                                 className="w-full"
                                 onClick={() => router.push('/morepage/policy/4')}
                              >
                                 <Icon24 name="go" className="text-secondary" />
                                 이용약관(서비스 약관)
                              </Button>
                              <Button
                                 variant={'icon-right'}
                                 className="w-full"
                                 onClick={() => router.push('/morepage/policy/1')}
                              >
                                 <Icon24 name="go" className="text-secondary" />
                                 개인정보 처리방침
                              </Button>
                              <Button
                                 variant={'icon-right'}
                                 className="w-full"
                                 onClick={() => router.push('/morepage/policy/2')}
                              >
                                 <Icon24 name="go" className="text-secondary" />
                                 위치 기반 서비스 이용 약관
                              </Button>
                              <Button
                                 variant={'icon-right'}
                                 className="w-full"
                                 onClick={() => router.push('/morepage/policy/3')}
                              >
                                 <Icon24 name="go" className="text-secondary" />
                                 커뮤니티 운영 정책
                              </Button>
                           </div>
                        ),
                     },
                  ]}
               />
            </div>
            {/* 페이지네이션 영역: 탭 하단에 고정 */}
            {selectedTab === 'notice' && !isDetailNotice && totalPages > 0 && (
               <div className="flex items-center justify-center shrink-0 h-14">
                  <EllipsisPagination
                     currentPage={currentPage}
                     totalPages={totalPages}
                     handlePageChange={setCurrentPage}
                  />
               </div>
            )}
            {/* 버전 정보 */}
            <div className="flex items-center justify-between text-gray-600 shrink-0 px-4 py-4 border-t">
               <p>버전정보 v.1.00.0</p>
               <p>최신 버전</p>
            </div>
         </div>
      </MorePanel>
   );
}
