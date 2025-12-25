export interface UserReportData {
   user_name: string;
   phone_number: string;
   event_name: string;
   sanction_content: string;
   sanction_chat: string;
   reporter_name: string;
   report_date: string;
   report_category: string;
   sanction_type: string;
   sanction_period: string;
   add_opinion: string;
   is_processed: boolean; // 신고 처리 여부
}

export interface PartyReportData {
   user_name: string;
   party_name: string;
   party_chairman_name: string;
   report_date: string;
   party_dissolution_date: string;
   sanction_content: string;
   sanction_type: string;
   reporter_name: string;
   report_category: string;
   add_opinion: string;
   event_name: string;
   is_processed: boolean;
}

export interface EventImage {
   id?: number;
   event_id: number;
   image_url: string;
   is_main?: boolean;
   created_at?: string;
}

export interface EventData {
   id?: number;
   content_id?: number;
   title: string;
   start_date: string;
   end_date: string;
   address?: string;
   address2?: string;
   area_code?: string;
   sigungu_code?: string;
   latitude?: number;
   longitude?: number;
   phone?: string;
   cat1?: string;
   cat2?: string;
   cat3?: string;
   lcls1?: string;
   lcls2?: string;
   lcls3?: string;
   homepage?: string;
   overview?: string;
   price?: number;
   insta_url?: string;
   api_modified_at?: string;
   created_at?: string;
   updated_at?: string;
   event_images?: EventImage[];
}

export interface EventDisplayData {
   id: number;
   name: string;
   host: string;
   period: string;
   operating_hours: string;
   price: string;
   location: string;
   state: string;
}
export interface NoticeData {
   name: string;
   add_date: string;
   edit_date: string;
   top_fixed: boolean;
   category: string;
}
