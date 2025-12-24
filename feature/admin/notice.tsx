'use client';

import { ComboboxComponent } from '@/components/basic/combo';
import { Button } from '@/components/ui/button/button';
import { SearchBar } from '@/components/ui/searchBar';
import { TableComponent } from './table';
import { useEffect, useMemo, useState } from 'react';
import { EllipsisPagination } from '@/components/pagination/pagination';
import { AddNotice } from './addNoticeDialog';
import { allNotices } from '@/dummy/admin';
import { NoticeData } from '@/types/userReport';
import { Input } from '@/components/ui/input';

export default function Notice() {
   const [currentPage, setCurrentPage] = useState(1);
   const [categoryFilter, setCategoryFilter] = useState('all');
   const [sortFilter, setSortFilter] = useState('name');
   const [searchText, setSearchText] = useState('');
   const [addDate, setAddDate] = useState('');
   const [editDate, setEditDate] = useState('');

   useEffect(() => {
      setCurrentPage(1);
   }, [categoryFilter, sortFilter, searchText, addDate, editDate]);

   const filterData = useMemo(() => {
      return (
         allNotices
            // 카테고리
            .filter(notice => (categoryFilter === 'all' ? true : notice.category === categoryFilter))
            // 검색
            .filter(notice => {
               if (!searchText) return true;
               const field = sortFilter as keyof NoticeData;
               return String(notice[field] ?? '')
                  .toLowerCase()
                  .includes(searchText.toLowerCase());
            })
            // 기간
            .filter(notice => {
               if (!addDate && !editDate) return true;

               const noticeAdd = new Date(notice.add_date);
               const noticeEdit = notice.edit_date ? new Date(notice.edit_date) : noticeAdd;

               const filterAdd = addDate ? new Date(addDate) : null;
               const filterEdit = editDate ? new Date(editDate) : null;

               if (filterAdd && filterEdit) {
                  return noticeAdd >= filterAdd && noticeAdd <= filterEdit;
               }
               if (filterAdd) return noticeAdd >= filterAdd;
               if (filterEdit) return noticeEdit <= filterEdit;

               return true;
            })
      );
   }, [categoryFilter, sortFilter, searchText, addDate, editDate]);

   const itemsPerPage = 11;
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
      setSortFilter('name');
      setSearchText('');
      setCurrentPage(1);
   };

   return (
      <div className="flex  w-full h-full flex-col">
         <div className="flex flex-col justify-between h-full gap-6">
            <div className="flex flex-1 flex-col gap-6">
               <div>공지사항 관리</div>

               <div className="flex flex-col gap-5 h-full w-full ">
                  <div className="flex justify-end">
                     <AddNotice />
                  </div>

                  <div className="flex flex-col p-4 gap-4 border rounded-md">
                     <div className="flex gap-4 text-base font-normal items-center">
                        <div className="w-16">카테고리</div>
                        <div className="w-50">
                           <ComboboxComponent
                              options={[
                                 { value: 'all', label: '전체' },
                                 { value: '일반', label: '일반' },
                                 { value: '업데이트', label: '업데이트' },
                                 { value: '이벤트', label: '이벤트' },
                                 { value: '이용정책', label: '이용정책' },
                                 { value: '기타', label: '기타' },
                              ]}
                              className="w-full"
                              value={categoryFilter}
                              onValueChange={setCategoryFilter}
                           />
                        </div>
                        <div className="flex gap-4 text-base font-normal items-center">
                           <div className="w-16">기간</div>
                           <div className="text-sm text-foreground/50 font-semibold">게시날짜</div>
                           <Input
                              type="date"
                              className="h-10 w-50"
                              value={addDate}
                              onChange={e => setAddDate(e.target.value)}
                           />
                           <div className="text-sm text-foreground/50 font-semibold">수정날짜</div>

                           <Input
                              type="date"
                              className="h-10 w-50"
                              value={editDate}
                              onChange={e => setEditDate(e.target.value)}
                           />
                        </div>
                     </div>

                     <div className="flex gap-4 text-base font-normal items-center">
                        <div className="w-16">분류</div>
                        <div className="w-50">
                           <ComboboxComponent
                              options={[
                                 { value: 'name', label: '제목' },
                                 { value: 'top_fixed', label: '상단 고정 유무' },
                                 { value: 'category', label: '카테고리' },
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
                     <TableComponent<NoticeData>
                        columns={[
                           { key: 'name', label: '제목' },
                           { key: 'add_date', label: '게시날짜' },
                           { key: 'edit_date', label: '수정날짜' },
                           { key: 'top_fixed', label: '상단 고정 유무' },
                           { key: 'category', label: '카테고리' },
                        ]}
                        data={currentData}
                     />
                  </div>
               </div>
            </div>

            <div className="flex justify-center items-center shrink-0">
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
