import axiosClient from "./axiosClient";

export async function getLoanProducts() {
  const res = await axiosClient.get("/loan-products");
  return res.data;
}

export async function createLoanRequest(loanProductId: number, requestedAmount: number) {
  const res = await axiosClient.post("/loans/requests", {
    loanProductId,
    requestedAmount,
  });
  return res.data;
}

export async function getMyLoans() {
  const res = await axiosClient.get("/loans/my");
  return res.data;
}

export async function getLoanRequests() {
  const res = await axiosClient.get("/loans/requests");
  return res.data;
}   


