import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance;

if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials missing! Check .env file.");
    // Create a mock client that alerts user instead of crashing
    supabaseInstance = {
        auth: {
            getSession: async () => ({ data: { session: null } }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: async () => { alert("Supabase not configured!"); return { error: { message: "Supabase URL/Key missing" } }; },
            signUp: async () => { alert("Supabase not configured!"); return { error: { message: "Supabase URL/Key missing" } }; },
            signOut: async () => { }
        },
        from: () => ({
            select: () => ({ eq: () => ({ single: async () => ({ data: null }) }) }),
            insert: async () => ({ error: { message: "Supabase not configured" } })
        })
    };
} else {
    supabaseInstance = createClient(supabaseUrl, supabaseKey);
}

export const supabase = supabaseInstance;
