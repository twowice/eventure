/* ===========================
    Event Like
=========================== */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function POST(req: NextRequest, context: any) {
    try {
        const params = await context.params;  // <- await로 풀어줘야 함
        const eventId = Number(params.id);

        if(!eventId) return NextResponse.json({ message: "Invalid event id" }, { status: 400 });

        /* ===========================
            Login Check
        =========================== */
        // const userId = req.headers.get("x-user-id");
        // if(userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const userId = "f6f8dbcf-9d61-4674-950d-50210b318947";
        
        /* ===========================
            Like Check
        =========================== */
        const { data: liked } = await supabase
            .from("liked_events")
            .select("id")
            .eq("event_id", eventId)
            .eq("user_id", userId)
            .single();
        
        /* ===========================
            Like Cancle
        =========================== */
        if(liked) {
            await supabase
                .from("liked_events")
                .delete()
                .eq("event_id", eventId)
                .eq("user_id", userId)
            
            await supabase.rpc("decrease_event_like", { event_id: eventId })
            
            return NextResponse.json({ liked: false, message: "Like removed" }) 
        }

        /* ===========================
            Like Add
        =========================== */
        const { data, error } = await supabase.from("liked_events").insert({
            event_id: eventId,
            user_id: userId,
        });
        if (error) console.error("Insert Error:", error);

        await supabase.rpc("increase_event_like", { event_id: eventId })

        return NextResponse.json({ liked: true, message: "Liked" })
    }catch(e) { console.error(e); return NextResponse.json( { message: "Like API Error" }, { status: 500 } )}
}