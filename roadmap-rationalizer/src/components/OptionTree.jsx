import BranchCard from './BranchCard';
import TreeDiagram from './TreeDiagram';
import RiskRadar from './RiskRadar';

export default function OptionTree({ branches, context, viewMode }) {
  if (!branches || branches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-seafoam">No branches to display yet. Upload files to start analysis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Conditional rendering based on view mode */}
      {viewMode === 'tree' && (
        <TreeDiagram branches={branches} context={context} />
      )}
      
      {viewMode === 'radar' && (
        <RiskRadar branches={branches} context={context} />
      )}
      
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {branches.map((branch, index) => (
            <BranchCard key={index} branch={branch} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

