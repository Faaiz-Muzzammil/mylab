// api/add-user.js
const { createClient } = require("@supabase/supabase-js");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "Both name and email are required." });
  }

  // Init Supabase with your service-role key
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { error } = await supabase.from("users").insert([{ name, email }]);

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    res.status(200).json({ message: "User added successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};
