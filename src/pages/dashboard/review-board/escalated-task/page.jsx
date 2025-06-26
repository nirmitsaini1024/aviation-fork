import { EscalationTable } from "./components/escalation/EscalationTable";

export default function ({ globalFilter }) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-600">Escalation Center</h1>
      <EscalationTable globalFilter={globalFilter} />
    </div>
  );
}