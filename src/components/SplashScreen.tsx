import { motion } from 'motion/react';
import { ChefHat } from 'lucide-react';

export default function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#5A5A40] text-white"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.5, 
          delay: 0.2,
          type: "spring",
          stiffness: 200 
        }}
        className="flex flex-col items-center"
      >
        <div className="bg-white/10 p-6 rounded-full mb-6 backdrop-blur-sm">
          <ChefHat size={80} className="text-white" />
        </div>
        <h1 className="text-5xl font-serif font-bold tracking-tight">FridgeChef</h1>
        <p className="mt-4 text-white/70 font-medium tracking-[0.2em] uppercase text-xs">Your Personal Kitchen Assistant</p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12"
      >
        <div className="flex gap-1">
          <motion.div 
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
            className="w-1.5 h-1.5 bg-white/40 rounded-full" 
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
            className="w-1.5 h-1.5 bg-white/40 rounded-full" 
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
            className="w-1.5 h-1.5 bg-white/40 rounded-full" 
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
