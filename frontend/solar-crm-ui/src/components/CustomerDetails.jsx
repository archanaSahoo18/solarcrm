import { useState } from "react";
import FinanceForm from "../components/FinanceForm";

export default function CustomerDetails({ customerId }) {
  const [showFinance, setShowFinance] = useState(false);

  return (
    <div>
      <button onClick={() => setShowFinance(true)}>Add Finance</button>

      {showFinance && (
        <FinanceForm
          customerId={customerId}
          onSuccess={() => {
            setShowFinance(false);
            // reload customer details here
          }}
          onCancel={() => setShowFinance(false)}
        />
      )}
    </div>
  );
}