'use client';

import { ComboboxComponent } from '@/components/basic/combo';
import { Button } from '@/components/ui/button/button';
import { SearchBar } from '@/components/ui/searchBar';
import { useEffect, useMemo, useState } from 'react';
import { TableComponent } from './table';
import { EllipsisPagination } from '@/components/pagination/pagination';
import { UserReportDialog } from './UserReportDialog';
import { UserReportData } from '@/types/userReport';
import { allUserReports } from '@/dummy/admin';
import { Input } from '@/components/ui/input';

export default function UserReport() {
   const [currentPage, setCurrentPage] = useState(1);
   const [categoryFilter, setCategoryFilter] = useState('all');
   const [typeFilter, setTypeFilter] = useState('all');
   const [reportDate, setReportDate] = useState('');
   const [sortFilter, setSortFilter] = useState('user_name');
   const [searchText, setSearchText] = useState('');

   useEffect(() => {
      setCurrentPage(1);
   }, [categoryFilter, sortFilter, searchText, reportDate, typeFilter]);

   const filterData = useMemo(() => {
      return (
         allUserReports
            // 카테고리
            .filter(report => (categoryFilter === 'all' ? true : report.report_category === categoryFilter))
            // 제재 유형
            .filter(report => (typeFilter === 'all' ? true : report.sanction_type === typeFilter))
            // 검색
            .filter(report => {
               if (!searchText) return true;
               const field = sortFilter as keyof UserReportData;
               return String(report[field] ?? '')
                  .toLowerCase()
                  .includes(searchText.toLowerCase());
            })
            // 신고 날짜
            .filter(report => {
               if (!reportDate) return true;
               const reportDay = new Date(report.report_date);
               const filterDay = new Date(reportDate);
               return reportDay.toDateString() === filterDay.toDateString(); // 날짜만 비교
            })
      );
   }, [categoryFilter, typeFilter, sortFilter, searchText, reportDate]);

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
      setSortFilter('user_name');
      setTypeFilter('all');
      setSearchText('');
      setReportDate('');
      setCurrentPage(1);
   };

   return (
      <div className="flex  w-full h-full flex-col">
         <div className="flex flex-1 flex-col gap-6">
            <div>사용자 신고 관리</div>

            <div className="flex flex-col shrink-0 gap-5">
               <div className="flex flex-col p-4 gap-4 border rounded-md">
                  <div className="flex gap-4 text-base font-normal items-center">
                     <div className="w-16">카테고리</div>
                     <div className="w-50">
                        <ComboboxComponent
                           options={[
                              { value: 'all', label: '전체' },
                              { value: '부정적인 언어', label: '부정적인 언어' },
                              { value: '도배', label: '도배' },
                              { value: '광고', label: '광고' },
                              { value: '사기', label: '사기' },
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
                              { value: 'account_suspended_7days', label: '7일 계정정지' },
                              { value: 'account_suspended_14days', label: '14일 계정정지' },
                              { value: 'account_suspended_30days', label: '30일 계정정지' },
                              { value: 'account_suspended_permanent', label: '영구 계정정지' },
                              { value: 'undetermined', label: '미정' },
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
                           value={reportDate}
                           onChange={e => setReportDate(e.target.value)}
                        />
                     </div>
                  </div>

                  <div className="flex gap-4 text-base font-normal items-center">
                     <div className="w-16">분류</div>
                     <div className="w-50">
                        <ComboboxComponent
                           options={[
                              { value: 'user_name', label: '사용자 명' },
                              { value: 'phone_number', label: '전화번호' },
                              { value: 'reporter_name', label: '신고자 명' },
                           ]}
                           className="w-full"
                           value={sortFilter}
                           onValueChange={setSortFilter}
                        />
                     </div>
                     <div className="w-16">검색</div>
                     <div className="flex-1">
                        <SearchBar value={searchText} onChange={setSearchText} onEnter={handleSearch} />
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
                  <TableComponent<UserReportData>
                     columns={[
                        { key: 'user_name', label: '사용자 명', width: 'w-[100px]' },
                        { key: 'phone_number', label: '전화번호', width: 'w-[130px]' },
                        { key: 'report_date', label: '신고 접수날짜', width: 'w-[120px]' },
                        { key: 'sanction_period', label: '제재 기간', width: 'w-[170px]' },
                        {
                           key: 'sanction_type',
                           label: '제재 유형',
                           width: 'w-[120px]',
                           render: value => (
                              <span
                                 className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    value === '7일 계정정지'
                                       ? 'bg-red-100 text-red-800'
                                       : value === '14일 계정정지'
                                         ? 'bg-orange-100 text-orange-800'
                                         : value === '30일 계정정지'
                                           ? 'bg-yellow-100 text-yellow-800'
                                           : value === '영구 계정정지'
                                             ? 'bg-purple-100 text-purple-800'
                                             : 'bg-gray-100 text-gray-800'
                                 }`}
                              >
                                 {value}
                              </span>
                           ),
                        },
                        { key: 'reporter_name', label: '신고자 명', width: 'w-[100px]' },
                        {
                           key: 'report_category',
                           label: '카테고리',
                           width: 'w-[120px]',
                           render: value => (
                              <span
                                 className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    value === '부정적인 언어'
                                       ? 'bg-red-100 text-red-800'
                                       : value === '도배'
                                         ? 'bg-orange-100 text-orange-800'
                                         : value === '광고'
                                           ? 'bg-yellow-100 text-yellow-800'
                                           : value === '사기'
                                             ? 'bg-purple-100 text-purple-800'
                                             : 'bg-gray-100 text-gray-800'
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
                           render: (value, row) => <UserReportDialog reportData={row} type="user-report" />,
                        },
                     ]}
                     data={currentData}
                     itemsPerPage={itemsPerPage}
                  />
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
