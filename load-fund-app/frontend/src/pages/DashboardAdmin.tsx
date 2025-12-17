import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function DashboardAdmin() {
  const [requests, setRequests] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const loadRequests = async () => {
    const res = await axiosClient.get("/loans/requests");
    setRequests(res.data);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const approve = async (id: number) => {
    const installmentsCount = Number(prompt("تعداد اقساط؟", "12")) || 12;
    try {
      await axiosClient.post(`/loans/requests/${id}/approve`, { installmentsCount });
      setMessage("وام تأیید شد");
      loadRequests();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "خطا در تأیید وام");
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "20px auto" }}>
      <h2>داشبورد ادمین</h2>
      {message && <p>{message}</p>}
      <h3>درخواست‌های وام</h3>
      <table width="100%" border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>کد</th>
            <th>کاربر</th>
            <th>ایمیل</th>
            <th>نوع وام</th>
            <th>مبلغ درخواست</th>
            <th>وضعیت</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.user.fullName}</td>
              <td>{r.user.email}</td>
              <td>{r.loanProduct.name}</td>
              <td>{r.requestedAmount}</td>
              <td>{r.status}</td>
              <td>
                {r.status === "pending" && (
                  <button onClick={() => approve(r.id)}>تأیید</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
