// SearchBar.tsx
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
   placeholder?: string;
   onSearch?: (value: string) => void;
   onChange?: (value: string) => void;
   value?: string;
   className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
   placeholder = '검색어를 입력하세요',
   onSearch,
   onChange,
   value: controlledValue,
   className = '',
}) => {
   const [internalValue, setInternalValue] = useState('');
   const isControlled = controlledValue !== undefined;
   const value = isControlled ? controlledValue : internalValue;

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (!isControlled) {
         setInternalValue(newValue);
      }
      onChange?.(newValue);
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch?.(value);
   };

   const handleClear = () => {
      const newValue = '';
      if (!isControlled) {
         setInternalValue(newValue);
      }
      onChange?.(newValue);
      onSearch?.(newValue);
   };

   return (
      <form onSubmit={handleSubmit} className={`relative ${className}`}>
         <div className="relative flex items-center">
            <Search className="absolute left-3 h-5 w-5 text-gray-400" />

            <input
               type="text"
               value={value}
               onChange={handleChange}
               placeholder={placeholder}
               className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007DE4] focus:border-transparent transition-all"
            />

            {value && (
               <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
               >
                  <X className="h-4 w-4 text-gray-400" />
               </button>
            )}
         </div>
      </form>
   );
};
