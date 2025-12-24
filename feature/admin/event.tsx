'use client';

import { ComboboxComponent } from '@/components/basic/combo';
import { Button } from '@/components/ui/button/button';
import { SearchBar } from '@/components/ui/searchBar';
import { TableComponent } from './table';
import { EllipsisPagination } from '@/components/pagination/pagination';
import { useEffect, useMemo, useState } from 'react';
import { AddEvent } from './addEventDialog';
import { allEvents } from '@/dummy/admin';
import { EventData } from '@/types/userReport';
import { Input } from '@/components/ui/input';

export default function Event() {
   const [currentPage, setCurrentPage] = useState(1);
   const [statusFilter, setStatusFilter] = useState('all');
   const [sortFilter, setSortFilter] = useState('name');
   const [searchText, setSearchText] = useState('');
   const [startDate, setStartDate] = useState('');
   const [endDate, setEndDate] = useState('');

   useEffect(() => {
      setCurrentPage(1);
   }, [statusFilter, sortFilter, searchText, startDate, endDate]);

   const filterData = useMemo(() => {
      return (
         allEvents
            //상태
            .filter(event => (statusFilter === 'all' ? true : event.state === statusFilter))
            //검색어 + 분류
            .filter(event => {
               if (!searchText) return true;
               const field = sortFilter as keyof EventData;
               return String(event[field]).toLowerCase().includes(searchText.toLowerCase());
            })
            // 기간
            .filter(event => {
               if (!startDate && !endDate) return true;
               const [start, end] = event.period.split('~').map(v => v.trim());
               const eventStart = new Date(start);
               const eventEnd = new Date(end || start);
               const filterStart = startDate ? new Date(startDate) : null;
               const filterEnd = endDate ? new Date(endDate) : null;

               if (filterStart && filterEnd) {
                  return eventEnd >= filterStart && eventStart <= filterEnd;
               }

               if (filterStart) return eventEnd >= filterStart;
               if (filterEnd) return eventStart <= filterEnd;
               return true;
            })
      );
   }, [statusFilter, sortFilter, searchText, startDate, endDate]);

   const itemsPerPage = 10;
   const totalPages = useMemo(() => {
      return Math.ceil(filterData.length / itemsPerPage);
   }, [filterData.length]);

   const currentData = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filterData.slice(startIndex, endIndex);
   }, [currentPage, filterData]);

   const handlePageChange = (page: number) => {
      setCurrentPage(page);
   };

   const handleSearch = () => setCurrentPage(1);
   const handleReset = () => {
      setStatusFilter('all');
      setSortFilter('name');
      setSearchText('');
      setStartDate('');
      setEndDate('');
      setCurrentPage(1);
   };

   return (
      <div className="flex flex-col gap-6 w-full h-full">
         <div className="text-foreground font-semibold text-2xl">이벤트 관리</div>

         <div className="flex justify-end">
            <AddEvent />
         </div>
         <div className="flex flex-col p-4 gap-4 border rounded-md shrink-0 w-full">
            <div className="flex flex-col gap-4 xl:flex-row">
               <div className="flex gap-4 text-base font-normal items-center xl:flex-1">
                  <div className="w-16 shrink-0">상태</div>
                  <div className="flex-1">
                     <ComboboxComponent
                        options={[
                           { value: 'all', label: '전체' },
                           { value: '진행중', label: '진행중' },
                           { value: '예정', label: '예정' },
                           { value: '예약접수', label: '예약접수' },
                           { value: '취소', label: '취소' },
                           { value: '종료', label: '종료' },
                        ]}
                        className="w-full"
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                     />
                  </div>
               </div>
               <div className="flex gap-4 text-base font-normal items-center xl:flex-1">
                  <div className="w-16 shrink-0">기간</div>
                  <div className="flex gap-2 items-center flex-wrap w-full">
                     <div className="flex flex-col gap-2 flex-1">
                        <div className="text-xs text-foreground/50 font-semibold w-10 gap-4">시작일</div>
                        <Input
                           type="date"
                           className="h-10 w-full"
                           value={startDate}
                           onChange={e => setStartDate(e.target.value)}
                        />
                     </div>
                     <div className="flex flex-col gap-2 flex-1">
                        <div className="text-xs text-foreground/50 font-semibold w-10 gap-4">종료일</div>
                        <Input
                           type="date"
                           className="h-10 w-full"
                           value={endDate}
                           onChange={e => setEndDate(e.target.value)}
                        />
                     </div>
                  </div>
               </div>
            </div>
            <div className="flex flex-col xl:flex-row gap-4">
               <div className="flex gap-4 text-base font-normal items-center xl:flex-1">
                  <div className="w-16 shrink-0">분류</div>
                  <div className="flex-1">
                     <ComboboxComponent
                        options={[
                           { value: 'name', label: '이벤트 명' },
                           { value: 'host', label: '주최' },
                           { value: 'period', label: '기간' },
                           { value: 'operating_hours', label: '운영시간' },
                           { value: 'price', label: '가격' },
                           { value: 'location', label: '이벤트 장소' },
                           { value: 'state', label: '이벤트 상태' },
                        ]}
                        className="w-full"
                        value={sortFilter}
                        onValueChange={setSortFilter}
                     />
                  </div>
               </div>
               <div className="flex gap-4 text-base font-normal items-center xl:flex-1">
                  <div className="w-16 shrink-0">검색</div>
                  <div className="flex-1">
                     <SearchBar value={searchText} onChange={setSearchText} />
                  </div>
               </div>
            </div>
            <div className="flex justify-end gap-4">
               <Button variant={'secondary'} size={'lg'} onClick={handleReset}>
                  초기화
               </Button>
               <Button variant={'default'} size={'lg'} onClick={handleSearch}>
                  검색
               </Button>
            </div>
         </div>
         <div className="flex-1 min-h-0 relative overflow-hidden">
            <div className="absolute inset-0 overflow-auto">
               <TableComponent<EventData>
                  columns={[
                     { key: 'name', label: '이벤트 명' },
                     { key: 'host', label: '주최' },
                     { key: 'period', label: '기간' },
                     { key: 'operating_hours', label: '운영 시간' },
                     { key: 'price', label: '가격' },
                     { key: 'location', label: '이벤트 장소' },
                     {
                        key: 'state',
                        label: '이벤트 상태',
                        render: value => (
                           <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                 value === '진행중'
                                    ? 'bg-green-100 text-green-800'
                                    : value === '예정'
                                      ? 'bg-blue-100 text-blue-800'
                                      : value === '종료'
                                        ? 'bg-gray-100 text-gray-800'
                                        : value === '취소'
                                          ? 'bg-red-100 text-red-800'
                                          : value === '예약접수' && 'bg-yellow-100 text-yellow-800'
                              }`}
                           >
                              {value}
                           </span>
                        ),
                     },
                  ]}
                  data={currentData}
               />
            </div>
         </div>
         <div className="flex justify-center items-center shrink-0">
            <EllipsisPagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
         </div>
      </div>
   );
}
