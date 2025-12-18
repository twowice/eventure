/* ===========================
    Event Card
=========================== */

"use client";
import { useState } from "react";
import { Icon24 } from '@/components/icons/icon24';

interface FilterCardProps {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    region: string;
    imageUrl: string;
}

export function EventCard({ id, title, startDate, endDate, region, imageUrl }: FilterCardProps) {
    
    const [liked, setLiked] = useState(false);
    
    /* ===========================
        API Fetch
    =========================== */
    const eventLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setLiked(prev => !prev);

        try {
            await fetch(`/api/events/${id}/like`, {
                method: "POST",
            });

        } catch (e) { console.error("❌ Event Like Fail:", e); setLiked(prev => !prev); }
    }

    return (
        <div className="w-full h-auto overflow-hidden ">
            <div className='relative w-full h-[300px]'>
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover rounded-[8px]"
                />
                <button onClick={eventLike} className='absolute top-2 right-2 w-[36px] h-[36px] bg-white/70 rounded-full shadow-sm cursor-pointer flex items-center justify-center'>
                    {liked ? (
                        <Icon24 name="likefill" className="text-red-500" />
                    ) : (
                        <Icon24 name="likedef" className="text-gray-400" />
                    )}
                </button>
            </div>

            <div className='flex flex-col gap-[7px] mt-[12px]'>
                <span className="text-[24px] font-bold text-[#04152F]">{title}</span>
                <span className="text-[14px] font-regular text-[#616161]">{startDate} ~ {endDate}</span>
                <span className="text-[14px] font-regular text-[#848484]">{region}</span>
            </div>
        </div>
    );
}
