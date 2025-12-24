'use client';

import { ComboboxComponent } from '@/components/basic/combo';
import { EllipsisPagination } from '@/components/pagination/pagination';
import { Button } from '@/components/ui/button/button';
import { SearchBar } from '@/components/ui/searchBar';
import { useEffect, useMemo, useState } from 'react';
import { TableComponent } from './table';
import { UserReportDialog } from './UserReportDialog';
import { PartyReportData } from '@/types/userReport';
import { allPartyReports } from '@/dummy/admin';
import { Input } from '@/components/ui/input';

export default function PartyReport() {
   const [currentPage, setCurrentPage] = useState(1);
   const [categoryFilter, setCategoryFilter] = useState('all');
   const [typeFilter, setTypeFilter] = useState('all');
   const [partyDate, setPartyDate] = useState('');
   const [sortFilter, setSortFilter] = useState('party_name');
   const [searchText, setSearchText] = useState('');

   useEffect(() => {
      setCurrentPage(1);
   }, [categoryFilter, sortFilter, searchText, partyDate, typeFilter]);

   const filterData = useMemo(() => {
      return (
         allPartyReports
            // 카테고리
            .filter(party => (categoryFilter === 'all' ? true : party.report_category === categoryFilter))
            // 제재 유형
            .filter(party => (typeFilter === 'all' ? true : party.sanction_type === typeFilter))
            // 검색
            .filter(party => {
               if (!searchText) return true;
               const field = sortFilter as keyof PartyReportData;
               return String(party[field] ?? '')
                  .toLowerCase()
                  .includes(searchText.toLowerCase());
            })
            // 신고 날짜
            .filter(party => {
               if (!partyDate) return true;
               if (!party.party_dissolution_date) return false;
               const partyDay = new Date(party.party_dissolution_date);
               const filterDay = new Date(partyDate);
               return partyDay.toDateString() === filterDay.toDateString();
            })
      );
   }, [categoryFilter, typeFilter, sortFilter, searchText, partyDate]);

   const itemsPerPage = 12;
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
      setCategoryFilter('all');
      setSortFilter('party_name');
      setTypeFilter('all');
      setSearchText('');
      setPartyDate('');
      setCurrentPage(1);
   };
   return (
      <div className="flex w-full h-full flex-col">
         <div className="flex flex-col justify-between h-full gap-6">
            <div className="flex flex-1 flex-col gap-6">
               <div>파티 신고 관리</div>

               <div className="flex flex-col shrink-0 gap-5">
                  <div className="flex flex-col p-4 gap-4 border rounded-md">
                     <div className="flex gap-4 text-base font-normal items-center">
                        <div className="w-16">카테고리</div>
                        <div className="w-50">
                           <ComboboxComponent
                              options={[
                                 { value: 'all', label: '전체' },
                                 { value: '사이비 포교 활동', label: '사이비 포교 활동' },
                                 { value: '미허가 영리활동', label: '미허가 영리활동' },
                                 { value: '부적절한 언어', label: '부적절한 언어' },
                                 { value: '사칭 목적 파티', label: '사칭 목적 파티' },
                                 { value: '불법 행위', label: '불법 행위' },
                                 { value: '광고', label: '광고' },
                                 { value: '기타', label: '기타' },
                              ]}
                              className="w-full"
                              value={categoryFilter}
                              onValueChange={setCategoryFilter}
                           />
                        </div>
                        <div className="w-16">제재 유형</div>
                        <div className="w-50">
                           <ComboboxComponent
                              options={[
                                 { value: 'all', label: '전체' },
                                 { value: '파티 해산', label: '파티 해산' },
                                 { value: '파티 복구', label: '파티 복구' },
                                 { value: '미정', label: '미정' },
                              ]}
                              className="w-full"
                              value={typeFilter}
                              onValueChange={setTypeFilter}
                           />
                        </div>
                        <div className="flex gap-4 text-base font-normal items-center">
                           <div className="w-16">신고 날짜</div>
                           <Input
                              type="date"
                              className="h-10 w-50"
                              value={partyDate}
                              onChange={e => setPartyDate(e.target.value)}
                           />
                        </div>
                     </div>

                     <div className="flex gap-4 text-base font-normal items-center">
                        <div className="w-16">분류</div>
                        <div className="w-50">
                           <ComboboxComponent
                              options={[
                                 { value: 'party_name', label: '파티 명' },
                                 { value: 'party_chairman_name', label: '파티장 명' },
                                 { value: 'reporter_name', label: '신고자 명' },
                              ]}
                              className="w-full"
                              value={sortFilter}
                              onValueChange={setSortFilter}
                           />
                        </div>
                        <div className="w-16">검색</div>
                        <div className="flex-1">
                           <SearchBar value={searchText} onChange={setSearchText} />
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

                  <div className="flex-1 min-h-0">
                     <TableComponent<PartyReportData>
                        columns={[
                           { key: 'party_name', label: '파티 명', width: 'w-[120px]' },
                           { key: 'party_chairman_name', label: '파티장 명', width: 'w-[100px]' },
                           { key: 'report_date', label: '신고 접수날짜', width: 'w-[130px]' },
                           { key: 'party_dissolution_date', label: '파티 해산 날짜', width: 'w-[130px]' },
                           { key: 'reporter_name', label: '신고자 명', width: 'w-[100px]' },
                           {
                              key: 'report_category',
                              label: '신고 사유',
                              width: 'w-[140px]',
                              render: value => (
                                 <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                       value === '사이비 포교 활동'
                                          ? 'bg-red-100 text-red-800'
                                          : value === '미허가 영리활동'
                                            ? 'bg-orange-100 text-orange-800'
                                            : value === '부적절한 언어'
                                              ? 'bg-yellow-100 text-yellow-800'
                                              : value === '불법 행위'
                                                ? 'bg-purple-100 text-purple-800'
                                                : value === '광고'
                                                  ? 'bg-blue-100 text-blue-800'
                                                  : 'bg-gray-100 text-gray-800'
                                    }`}
                                 >
                                    {value}
                                 </span>
                              ),
                           },
                           {
                              key: 'sanction_type',
                              label: '제재 유형',
                              width: 'w-[100px]',
                              render: value => (
                                 <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                       value === '파티 해산' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                    }`}
                                 >
                                    {value}
                                 </span>
                              ),
                           },
                           {
                              key: 'is_processed',
                              label: '제재관리',
                              width: 'w-[110px]',
                              render: (value, row) => <UserReportDialog reportData={row} type="party-report" />,
                           },
                        ]}
                        data={currentData}
                        itemsPerPage={itemsPerPage}
                     />
                  </div>
               </div>
            </div>

            <div className="flex justify-center shrink-0 items-center">
               <EllipsisPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
               />
            </div>
         </div>
      </div>
   );
}
