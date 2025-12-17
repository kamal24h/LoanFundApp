import { useEffect, useState } from "react";
import { getLoanProducts, createLoanRequest, getMyLoans } from "../api/loanApi";

interface LoanProduct {
  id: number;
  name: string;
  description?: string;
  maxAmount: number;
  minAmount: number;
  interestRate: number;
  maxInstallments: number;
}

interface Loan {
  id: number;
  principalAmount: number;
  totalAmount: number;
  installmentsCount: number;
  status: string;
}

export default function DashboardMember() {
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    (async () => {
      const p = await getLoanProducts();
      setProducts(p);
      const l = await getMyLoans();
      setLoans(
        l.map((item: any) => ({
          id: item.id,
          principalAmount: item.principalAmount,
          totalAmount: item.totalAmount,
          installmentsCount: item.installmentsCount,
          status: item.status,
        }))
      );
    })();
  }, []);

  const handleRequest = async () => {
    if (!selectedProduct) {
      setMessage("یک نوع وام انتخاب کنید");
      return;
    }
    try {
      await createLoanRequest(selectedProduct, amount);
      setMessage("درخواست وام با موفقیت ثبت شد");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "خطا در ثبت درخواست");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "20px auto" }}>
      <h2>داشبورد عضو</h2>

      <h3>درخواست وام جدید</h3>
      <div>
        <label>نوع وام:</label>
        <select
          value={selectedProduct ?? ""}
          onChange={(e) => setSelectedProduct(Number(e.target.value))}
        >
          <option value="">انتخاب کنید</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (حداقل {p.minAmount}، حداکثر {p.maxAmount})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>مبلغ درخواستی:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>
      <button onClick={handleRequest} style={{ marginTop: 10 }}>
        ثبت درخواست وام
      </button>
      {message && <p>{message}</p>}

      <h3 style={{ marginTop: 30 }}>لیست وام‌های من</h3>
      <table width="100%" border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>کد</th>
            <th>اصل وام</th>
            <th>مبلغ کل</th>
            <th>تعداد اقساط</th>
            <th>وضعیت</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td>{loan.id}</td>
              <td>{loan.principalAmount}</td>
              <td>{loan.totalAmount}</td>
              <td>{loan.installmentsCount}</td>
              <td>{loan.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
