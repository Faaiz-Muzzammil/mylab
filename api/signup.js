// api/signup.js
const { createClient } = require("@supabase/supabase-js");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const { name, email } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email }])
      .select("name")
      .single();

    if (error) throw error;
    // return the name we just inserted
    res.status(200).json({ name: data.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};
