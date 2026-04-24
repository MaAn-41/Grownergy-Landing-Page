import { Router, type IRouter } from "express";

const router: IRouter = Router();

const getErpUrl = (path: string) => {
  const base = (process.env["ERPNEXT_URL"] ?? "").replace(/\/$/, "");
  return `${base}${path}`;
};

// POST /api/auth/login
router.post("/auth/login", async (req, res) => {
  const { usr, pwd } = req.body as { usr: string; pwd: string };

  if (!usr || !pwd) {
    res.status(400).json({ error: "Email aur password required hain" });
    return;
  }

  try {
    const erpRes = await fetch(getErpUrl("/api/method/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usr, pwd }),
    });

    const data = await erpRes.json() as {
      message?: string;
      full_name?: string;
    };

    if (!erpRes.ok) {
      res.status(401).json({ error: "Email ya password galat hai" });
      return;
    }

    const setCookie = erpRes.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
    }

    res.json({ message: data.message, full_name: data.full_name });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/logout
router.post("/auth/logout", async (req, res) => {
  try {
    await fetch(getErpUrl("/api/method/logout"), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    res.setHeader("Set-Cookie", "sid=; Max-Age=0; Path=/;");
    res.json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/auth/me — sirf user ki cookie check karo, API key nahi
router.get("/auth/me", async (req, res) => {
  try {
    const erpRes = await fetch(getErpUrl("/api/method/frappe.auth.get_logged_user"), {
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.cookie ?? "",
      },
    });

    const data = await erpRes.json() as { message?: string };
    const email = data.message;

    if (!email || email === "Guest") {
      res.json({ user: null });
      return;
    }

    res.json({ user: { email } });
  } catch (err) {
    console.error("Auth me error:", err);
    res.json({ user: null });
  }
});

// POST /api/auth/signup
router.post("/auth/signup", async (req, res) => {
  const { email, full_name } = req.body as { email: string; full_name: string };

  if (!email || !full_name) {
    res.status(400).json({ error: "Email aur naam required hain" });
    return;
  }

  try {
    const erpRes = await fetch(
      getErpUrl("/api/method/frappe.core.doctype.user.user.sign_up"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, full_name, redirect_to: "/" }),
      }
    );

    const data = await erpRes.json() as { message?: number | string };
    res.json({ message: data.message });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;