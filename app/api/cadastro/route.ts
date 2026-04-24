import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { restaurant, gestor } = body;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 1. Create restaurant
    const { data: rest, error: restError } = await supabase
      .from("restaurants")
      .insert([{ ...restaurant, status: "ativo" }])
      .select()
      .single();

    if (restError) {
      return NextResponse.json({ error: restError.message }, { status: 400 });
    }

    // 2. Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: gestor.email,
      password: gestor.password,
      email_confirm: true,
      user_metadata: {
        full_name: gestor.name,
        restaurant_id: rest.id,
        role: "gestor",
      },
    });

    if (authError) {
      // Rollback restaurant if user creation fails
      await supabase.from("restaurants").delete().eq("id", rest.id);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // 3. Create restaurant_users record
    const { error: ruError } = await supabase.from("restaurant_users").insert([{
      restaurant_id: rest.id,
      email: gestor.email,
      full_name: gestor.name,
      role: "gestor",
      is_active: true,
    }]);

    if (ruError) {
      console.error("restaurant_users insert error:", ruError.message);
    }

    return NextResponse.json({
      success: true,
      restaurant_id: rest.id,
      user_id: authUser.user?.id,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
