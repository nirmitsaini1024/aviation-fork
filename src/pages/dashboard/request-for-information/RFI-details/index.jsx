import RFIDetailsSearch from "./components/RfiSearch";
import TableDetails from "./components/TableDetailsMain";

export const RFIDetailsContent = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 tracking-tight">
          Search <span className="text-blue-600">— Request For Information</span>
        </h3>

        <RFIDetailsSearch/>
      </div>
      <TableDetails/>
    </div>
  );
};

export default RFIDetailsContent;
