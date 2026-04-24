import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body as {
    name: string;
    email: string;
    message: string;
  };

  // Basic validation
  if (!name || !email || !message) {
    res.status(400).json({ error: "name, email, aur message required hain" });
    return;
  }

  const erpnextUrl = process.env["ERPNEXT_URL"];
  const apiKey = process.env["ERPNEXT_API_KEY"];
  const apiSecret = process.env["ERPNEXT_API_SECRET"];

  if (!erpnextUrl || !apiKey || !apiSecret) {
    console.error("ERPNext environment variables not set");
    res.status(500).json({ error: "Server configuration error" });
    return;
  }

  try {
    const erpResponse = await fetch(`${erpnextUrl}/api/resource/ReactJS`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${apiKey}:${apiSecret}`,
      },
      body: JSON.stringify({
        full_name: name,
        email: email,
        message: message,
      }),
    });

    if (!erpResponse.ok) {
      const errData = await erpResponse.json().catch(() => ({}));
      console.error("ERPNext error:", errData);
      res
        .status(502)
        .json({ error: "ERPNext mein data save karne mein masla aaya" });
      return;
    }

    const data = await erpResponse.json();
    res.json({ success: true, doc: (data as { data?: { name?: string } }).data?.name });
  } catch (err) {
    console.error("Contact submit error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
