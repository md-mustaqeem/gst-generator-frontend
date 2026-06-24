import { calculateInvoice } from "../utils/calculateInvoice";

export default function useInvoice(products) {
  return calculateInvoice(products);
}
