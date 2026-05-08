// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// @ts-ignore
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // @ts-ignore
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    // @ts-ignore
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    // @ts-ignore
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables missing')
    }

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured')
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString()
    const thirtyDaysAgoDateOnly = thirtyDaysAgo.toISOString().split('T')[0]

    const [jobsRes, paymentsRes, inventoryRes, expensesRes, customersRes, staffRes] = await Promise.all([
      supabaseClient.from('jobs').select('status, created_at').gte('created_at', thirtyDaysAgoStr),
      supabaseClient.from('payments').select('amount_paid, payment_method, created_at').gte('created_at', thirtyDaysAgoStr),
      supabaseClient.from('inventory_items').select('name, current_stock, minimum_stock, unit'),
      supabaseClient.from('expenses').select('amount, category, expense_date').gte('expense_date', thirtyDaysAgoDateOnly),
      supabaseClient.from('customers').select('id, created_at').gte('created_at', thirtyDaysAgoStr),
      supabaseClient.from('profiles').select('id, role, is_active').eq('is_active', true)
    ])

    if (jobsRes.error) throw new Error(`Jobs error: ${jobsRes.error.message}`)
    if (paymentsRes.error) throw new Error(`Payments error: ${paymentsRes.error.message}`)
    if (inventoryRes.error) throw new Error(`Inventory error: ${inventoryRes.error.message}`)
    if (expensesRes.error) throw new Error(`Expenses error: ${expensesRes.error.message}`)
    if (customersRes.error) throw new Error(`Customers error: ${customersRes.error.message}`)
    if (staffRes.error) throw new Error(`Staff error: ${staffRes.error.message}`)

    const jobs = jobsRes.data || []
    const payments = paymentsRes.data || []
    const inventory = inventoryRes.data || []
    const expenses = expensesRes.data || []
    const customers = customersRes.data || []
    const staff = staffRes.data || []

    const summary = {
      period: 'Last 30 days',
      total_jobs: jobs.length,
      completed_jobs: jobs.filter((j: any) => j.status === 'done').length,
      total_revenue: payments.reduce((sum: number, p: any) => sum + (Number(p.amount_paid) || 0), 0),
      revenue_by_method: payments.reduce((acc: Record<string, number>, p: any) => {
        const method = p.payment_method || 'unknown'
        acc[method] = (acc[method] || 0) + (Number(p.amount_paid) || 0)
        return acc
      }, {}),
      total_expenses: expenses.reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0),
      low_stock_items: inventory
        .filter((i: any) => Number(i.current_stock || 0) < Number(i.minimum_stock || 0))
        .map((i: any) => ({
          name: i.name,
          current: i.current_stock,
          min: i.minimum_stock,
          unit: i.unit
        })),
      new_customers: customers.length,
      active_staff_count: staff.filter((s: any) => s.role !== 'admin').length,
      currency: 'TZS'
    }

    // Use gemini-2.5-flash (available in your list)
    const model = "gemini-2.5-flash"
    
    const prompt = `You are an expert Tanzanian Business Analyst specializing in the car care industry. Analyze the following business data for "GariDesk", a car wash and detailing center in Tanzania.

Business Data (Last 30 Days):
${JSON.stringify(summary, null, 2)}

Respond with ONLY valid JSON. No markdown, no explanations. Use this exact structure:
{
  "daily_summary": "string summarizing daily performance in English with some Swahili business terms",
  "profit_loss": "string analyzing profit/loss in TZS",
  "stock_alerts": ["array of stock alert strings"],
  "staff_performance": "string evaluating staff",
  "recommendations": ["array of recommendation strings"],
  "creative_tip": "string with creative business tip"
}`

    // Correct endpoint with available model
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', response.status, errorText)
      throw new Error(`Gemini API returned ${response.status}: ${errorText}`)
    }

    const aiData = await response.json()
    
    let aiText = null
    if (aiData.candidates && aiData.candidates[0]) {
      if (aiData.candidates[0].content && aiData.candidates[0].content.parts) {
        aiText = aiData.candidates[0].content.parts[0]?.text
      } else if (aiData.candidates[0].text) {
        aiText = aiData.candidates[0].text
      }
    }
    
    if (!aiText) {
      throw new Error('Could not extract text from Gemini response')
    }

    let cleanedText = aiText.trim()
    cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    const insights = JSON.parse(cleanedText)

    return new Response(JSON.stringify(insights), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: any) {
    console.error('Edge Function Error:', error.message)
    
    return new Response(JSON.stringify({
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})