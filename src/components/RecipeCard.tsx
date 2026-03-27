import ReactMarkdown from 'react-markdown';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FileText, Image as ImageIcon, Loader2, Bookmark, BookmarkCheck } from 'lucide-react';

interface RecipeCardProps {
  recipe: string;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState<'pdf' | 'image' | null>(null);

  const downloadAsImage = async () => {
    if (!cardRef.current || isDownloading) return;
    setIsDownloading('image');
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        onclone: (clonedDoc) => {
          // Fix for html2canvas not supporting oklch colors (common in Tailwind v4)
          const elements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            const style = window.getComputedStyle(el);
            
            // If the browser returns oklch, we force it to a safe fallback
            // Most modern browsers return rgb() from getComputedStyle even for oklch,
            // but if html2canvas is failing, it's seeing the raw value.
            if (el.style.color.includes('oklch') || style.color.includes('oklch')) {
              el.style.color = 'inherit'; // Fallback to parent or default
            }
            if (el.style.backgroundColor.includes('oklch') || style.backgroundColor.includes('oklch')) {
              el.style.backgroundColor = 'transparent';
            }
            if (el.style.borderColor.includes('oklch') || style.borderColor.includes('oklch')) {
              el.style.borderColor = 'currentColor';
            }
          }
        }
      });
      const link = document.createElement('a');
      link.download = `fridgechef-recipe-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Image download failed:', err);
    } finally {
      setIsDownloading(null);
    }
  };

  const downloadAsPDF = async () => {
    if (!cardRef.current || isDownloading) return;
    setIsDownloading('pdf');
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        onclone: (clonedDoc) => {
          // Fix for html2canvas not supporting oklch colors
          const elements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            const style = window.getComputedStyle(el);
            if (el.style.color.includes('oklch') || style.color.includes('oklch')) {
              el.style.color = 'inherit';
            }
            if (el.style.backgroundColor.includes('oklch') || style.backgroundColor.includes('oklch')) {
              el.style.backgroundColor = 'transparent';
            }
            if (el.style.borderColor.includes('oklch') || style.borderColor.includes('oklch')) {
              el.style.borderColor = 'currentColor';
            }
          }
        }
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`fridgechef-recipe-${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF download failed:', err);
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-[#F3F4F6] transition-all duration-300 hover:shadow-xl">
      <div 
        ref={cardRef}
        className="p-8 markdown-body bg-white"
      >
        <ReactMarkdown>{recipe}</ReactMarkdown>
      </div>
      
      <div className="bg-[#F9FAFB] px-4 md:px-8 py-4 border-t border-[#F3F4F6] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Actions</span>
        </div>
        <div className="flex gap-2 md:gap-3">
          <button
            onClick={downloadAsPDF}
            disabled={!!isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-[#5A5A40] text-white rounded-full hover:bg-[#4A4A30] transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading === 'pdf' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <FileText size={16} />
            )}
            PDF
          </button>
          <button
            onClick={downloadAsImage}
            disabled={!!isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-[#5A5A40] text-white rounded-full hover:bg-[#4A4A30] transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading === 'image' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ImageIcon size={16} />
            )}
            Image
          </button>
        </div>
      </div>
    </div>
  );
}
