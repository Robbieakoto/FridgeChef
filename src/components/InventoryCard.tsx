import ReactMarkdown from 'react-markdown';

interface InventoryCardProps {
  content: string;
}

export default function InventoryCard({ content }: InventoryCardProps) {
  return (
    <div className="bg-[#E6E6E1] border-l-4 border-[#5A5A40] rounded-2xl p-6 mb-10 shadow-sm transform transition-all hover:shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs uppercase tracking-[0.2em] text-[#5A5A40] font-bold">Chef's Inventory Assessment</span>
      </div>
      <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
