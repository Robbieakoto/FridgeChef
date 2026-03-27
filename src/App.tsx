import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import Hero from './components/Hero';
import RecipeCard from './components/RecipeCard';
import InventoryCard from './components/InventoryCard';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findRecipes = async () => {
    if (!ingredients.trim()) {
      setError('Please enter the ingredients you have.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipes([]);

    try {
      
      const prompt = `
      You are a friendly, practical home chef assistant called "FridgeChef." 
      Your job is to help users cook delicious meals using only the ingredients they currently have at home — nothing more.

      Analyze the user's available ingredients and provide three distinct recipe options categorized by effort level (e.g., Quick Fix, Standard, and Creative).

      User's Ingredients: ${ingredients}

      Operational Guidelines:
      1.  **Ingredient Priority**: Use as many of the user's "at-home" ingredients as possible.
      2.  **The "Pantry Staples" Assumption**: You may assume the user has basic oil, salt, black pepper, and water. For any other "missing" ingredients (like specific spices or eggs), clearly label them as "**Required Additions**."
      3.  **Waste Reduction**: If an ingredient is perishable, prioritize recipes that use the entire amount.
      4.  **Clarity**: Use Markdown for bolding and lists to ensure the recipe is readable on a kitchen counter.
      5.  **Response Structure**: For each of the three recipes, follow this exact format:
          *   ### Recipe Name (Catchy and descriptive)
          *   **Estimated Time**: (Prep + Cook)
          *   **The Hero Ingredients**: Which of their items this uses.
          *   **Instructions**: Numbered, concise steps.
          *   **Chef’s Tip**: A small trick to level up the dish.
          *   **Substitution Corner**: Suggest alternatives for items they might be low on.
      6. **Tone and Voice**: Encouraging, resourceful, and slightly witty. Do not "hallucinate" complex ingredients the user didn't mention unless they are essential (and noted).
      7. **Initial Assessment**: Start with a brief, encouraging "Inventory Assessment" remark. Use Markdown lists if you are highlighting specific ingredient groups or observations to keep it organized and readable.
      8. **Separate Recipes**: Use a horizontal rule '---' to clearly separate the three recipe options.
      `;

      const result = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      const text = result.text;
      
      // Split the response into an introduction and the three recipes
      const parts = text.split('---').map(part => part.trim());
      setRecipes(parts);

    } catch (err) {
      console.error(err);
      setError('Sorry, I had trouble coming up with recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-4xl mx-auto p-4 md:p-8">
      <Hero />
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg">
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g., chicken breast, half a bag of spinach, can of tomatoes, onion..."
          className="w-full p-4 border border-[#E5E7EB] rounded-2xl h-32 focus:ring-2 focus:ring-[#5A5A40] focus:outline-none transition-shadow duration-300"
        />
        <button
          onClick={findRecipes}
          disabled={isLoading}
          className="mt-4 w-full bg-[#5A5A40] text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-[#4A4A30] transition-colors duration-300 disabled:bg-[#9CA3AF] disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Thinking of something delicious...
            </>
          ) : 'Find Recipes'}
        </button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>

      {recipes.length > 0 && (
        <div className="mt-12">
            {recipes[0] && <InventoryCard content={recipes[0]} />}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                {recipes.slice(1).map((recipe, index) => (
                    <RecipeCard key={index} recipe={recipe} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
