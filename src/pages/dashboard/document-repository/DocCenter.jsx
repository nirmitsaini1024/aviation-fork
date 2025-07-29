import { DocCenterProvider } from "./context/DocCenterContext";
import { FilterSection } from "./components/FilterSection";
import { DocumentTabs } from "./components/DocumentTabs";

const DocCenterContent = ({ setIsBotOpen }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium mb-4">Document Repositories</h3>
        <FilterSection />
      </div>
      <DocumentTabs setIsBotOpen={setIsBotOpen} />
    </div>
  );
};

export default function DocCenter({ setIsBotOpen }) {
  return (
    <DocCenterProvider setIsBotOpen={setIsBotOpen}>
      <DocCenterContent setIsBotOpen={setIsBotOpen} />
    </DocCenterProvider>
  );
}