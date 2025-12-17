import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/member");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>ورود به سیستم صندوق وام</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ایمیل:</label>
          <input
            style={{ width: "100%" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </div>
        <div>
          <label>رمز عبور:</label>
          <input
            style={{ width: "100%" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ marginTop: 10 }}>
          ورود
        </button>
      </form>
    </div>
  );
}
