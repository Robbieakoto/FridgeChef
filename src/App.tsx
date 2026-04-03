import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { AnimatePresence } from 'motion/react';
import Hero from './components/Hero';
import RecipeCard from './components/RecipeCard';
import InventoryCard from './components/InventoryCard';
import SplashScreen from './components/SplashScreen';

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. Please set it in your environment variables.');
  }
  return new GoogleGenAI({ apiKey });
};

export default function App() {
  const [ingredients, setIngredients] = useState('');
  const [mealName, setMealName] = useState('');
  const [searchMode, setSearchMode] = useState<'ingredients' | 'meal'>('ingredients');
  const [recipes, setRecipes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const findRecipes = async () => {
    if (searchMode === 'ingredients' && !ingredients.trim()) {
      setError('Please enter the ingredients you have.');
      return;
    }
    if (searchMode === 'meal' && !mealName.trim()) {
      setError('Please enter the meal you want to prepare.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const ai = getAI();
      let prompt = '';
      
      if (searchMode === 'ingredients') {
        prompt = `
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
      } else {
        prompt = `
        You are a friendly, experienced home chef called "FridgeChef."
        The user wants to prepare a specific meal. Your job is to provide them with three distinct variations or approaches for that meal (e.g., Traditional, Quick & Easy, and a Creative Twist).

        Requested Meal: ${mealName}

        Operational Guidelines:
        1.  **Clarity**: Use Markdown for bolding and lists to ensure the recipe is readable on a kitchen counter.
        2.  **Response Structure**: For each of the three recipes, follow this exact format:
            *   ### Recipe Name (Catchy and descriptive variation name)
            *   **Estimated Time**: (Prep + Cook)
            *   **Ingredients Required**: A detailed list of what's needed.
            *   **Instructions**: Numbered, concise steps.
            *   **Chef’s Tip**: A small trick to level up the dish.
            *   **Dietary Tweaks**: Suggest ways to make it vegetarian, gluten-free, etc. if applicable.
        3. **Tone and Voice**: Encouraging, knowledgeable, and inspiring.
        4. **Initial Assessment**: Start with a brief, enthusiastic introduction about the requested meal (like its origin or what makes it special). Use Markdown lists if needed.
        5. **Separate Recipes**: Use a horizontal rule '---' to clearly separate the three recipe options.
        `;
      }

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
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>
      
      <div className="min-h-screen w-full max-w-4xl mx-auto p-4 md:p-8">
        <Hero />

      <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-lg">
        <div className="flex bg-gray-100 rounded-full p-1 mb-6 relative">
           <button 
             onClick={() => setSearchMode('ingredients')}
             className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${searchMode === 'ingredients' ? 'bg-[#5A5A40] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
           >
             Pantry Raid
           </button>
           <button 
             onClick={() => setSearchMode('meal')}
             className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${searchMode === 'meal' ? 'bg-[#5A5A40] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
           >
             Specific Meal
           </button>
        </div>

        {searchMode === 'ingredients' ? (
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g., chicken breast, half a bag of spinach, can of tomatoes, onion..."
            className="w-full p-4 border border-[#E5E7EB] rounded-2xl h-32 focus:ring-2 focus:ring-[#5A5A40] focus:outline-none transition-shadow duration-300 text-base"
          />
        ) : (
          <input
            type="text"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            placeholder="e.g., Classic Lasagna, Chicken Tikka Masala..."
            className="w-full p-4 border border-[#E5E7EB] rounded-2xl focus:ring-2 focus:ring-[#5A5A40] focus:outline-none transition-shadow duration-300 text-base"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                findRecipes();
              }
            }}
          />
        )}
        <button
          onClick={findRecipes}
          disabled={isLoading}
          className="mt-4 w-full bg-[#5A5A40] text-white py-4 px-6 rounded-full text-lg font-semibold hover:bg-[#4A4A30] transition-colors duration-300 disabled:bg-[#9CA3AF] disabled:cursor-not-allowed flex items-center justify-center active:scale-95 transform"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Thinking...
            </>
          ) : 'Find Recipes'}
        </button>
        {error && <p className="text-red-500 mt-4 text-center text-sm">{error}</p>}
      </div>

      {recipes.length > 0 && (
        <div className="mt-8 md:mt-12 space-y-8">
            {recipes[0] && <InventoryCard title={searchMode === 'meal' ? "Chef's Notes" : "Chef's Inventory Assessment"} content={recipes[0]} />}
            <div className="grid grid-cols-1 gap-6 md:gap-8">
                {recipes.slice(1).map((recipe, index) => (
                    <RecipeCard key={index} recipe={recipe} />
                ))}
            </div>
        </div>
      )}
    </div>
  </>
);
}
