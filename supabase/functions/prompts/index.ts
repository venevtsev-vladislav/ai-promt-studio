import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.5";
const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type"
};
serve(async (req)=>{
    if (req.method === "OPTIONS") {
        return new Response("ok", {
            status: 200,
            headers
        });
    }
    const auth = req.headers.get("Authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
        return new Response(JSON.stringify({
            msg: "Missing authorization header"
        }), {
            status: 401,
            headers
        });
    }
    const token = auth.split(" ")[1];
    const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_ANON_KEY"), {
        global: {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    });
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
        return new Response(JSON.stringify({
            msg: "Unauthorized"
        }), {
            status: 401,
            headers
        });
    }
    const url = new URL(req.url);
    const pathname = url.pathname.replace(/^\/functions\/v1\/prompts\/?/, "");
    const promptId = pathname || null;
    try {
        switch(req.method){
            case "GET":
            {
                const { data, error } = await supabase.from("prompts").select("*").eq("user_id", user.id).order("created_at", {
                    ascending: false
                });
                if (error) throw error;
                return new Response(JSON.stringify(data), {
                    status: 200,
                    headers
                });
            }
            case "POST":
            {
                const body = await req.json();
                const { name, instruction, description = "", parameters = [], param1 = null, param2 = null, is_draft = false } = body;
                const { data, error } = await supabase.from("prompts").insert({
                    name,
                    instruction,
                    description,
                    parameters,
                    user_id: user.id,
                    param1,
                    param2,
                    is_draft
                }).select().single();
                if (error) throw error;
                return new Response(JSON.stringify(data), {
                    status: 200,
                    headers
                });
            }
            case "PUT":
            {
                if (!promptId) {
                    return new Response(JSON.stringify({
                        msg: "Missing prompt ID in path"
                    }), {
                        status: 400,
                        headers
                    });
                }
                const body = await req.json();
                const { data, error } = await supabase.from("prompts").update(body).eq("id", promptId).eq("user_id", user.id).select().single();
                if (error) throw error;
                return new Response(JSON.stringify(data), {
                    status: 200,
                    headers
                });
            }
            case "DELETE":
            {
                if (!promptId) {
                    return new Response(JSON.stringify({
                        msg: "Missing prompt ID in path"
                    }), {
                        status: 400,
                        headers
                    });
                }
                const { error } = await supabase.from("prompts").delete().eq("id", promptId).eq("user_id", user.id);
                if (error) throw error;
                return new Response(JSON.stringify({
                    success: true
                }), {
                    status: 200,
                    headers
                });
            }
            default:
                return new Response(JSON.stringify({
                    msg: "Method not allowed"
                }), {
                    status: 405,
                    headers
                });
        }
    } catch (err) {
        return new Response(JSON.stringify({
            error: err.message || String(err)
        }), {
            status: 400,
            headers
        });
    }
});
