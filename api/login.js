// api/login.js
const { createClient } = require("@supabase/supabase-js");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { data, error } = await supabase
      .from("users")
      .select("name")
      .eq("email", email)
      .single();

    if (error) {
      // no row found or other error
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json({ name: data.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};
