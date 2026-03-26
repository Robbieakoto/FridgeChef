import ReactMarkdown from 'react-markdown';

interface RecipeCardProps {
  recipe: string;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 markdown-body transform hover:scale-105 transition-transform duration-300">
      <ReactMarkdown>{recipe}</ReactMarkdown>
    </div>
  );
}
