import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { data, error } = await supabase
    .from('profiles')
    .update({ swipes_remaining: 100, super_likes_remaining: 1 })
    .neq('id', '00000000-0000-0000-0000-000000000000') // Dummy to update all

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  return new Response(JSON.stringify({ message: 'Swipes reset successfully' }), { status: 200 })
})
