const { createClient } = require("@supabase/supabase-js");

module.exports = async (req, res) => {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  const { name, email } = req.body;
  if (!name || !email)
    return res.status(400).json({ error: "Name and email are required" });

  // Initialize Supabase client with service role key
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email }]);
    if (error) throw error;

    res.status(200).json({ message: "User added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};
