// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ppfvbsnuanijtrgjrppx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZnZic251YW5panRyZ2pycHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NTA5NjIsImV4cCI6MjA2MDUyNjk2Mn0.gipj4AZ5Qg6OPzCKLLmW-hKZBZrk39bjKpCs-RBf2ag";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);