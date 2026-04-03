import ReactMarkdown from 'react-markdown';

interface InventoryCardProps {
  title?: string;
  content: string;
}

export default function InventoryCard({ title = "Chef's Inventory Assessment", content }: InventoryCardProps) {
  return (
    <div className="bg-[#E6E6E1] border-l-4 border-[#5A5A40] rounded-2xl p-4 md:p-6 mb-8 md:mb-10 shadow-sm transform transition-all hover:shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs uppercase tracking-[0.2em] text-[#5A5A40] font-bold">{title}</span>
      </div>
      <div className="text-[#374151] leading-relaxed prose prose-sm max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
