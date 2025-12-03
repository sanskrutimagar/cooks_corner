import React from 'react';
import { Heart, ChefHat, Book, Star } from 'lucide-react';

function ChatBotHome() {
  const features = [
    {
      title: "Recipe Creation",
      icon: <ChefHat className="h-8 w-8 sm:h-10 sm:w-10 text-amber-500" />,
      description: "Generate personalized recipes based on your preferences and dietary needs"
    },
    {
      title: "Meal Planning",
      icon: <Book className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-500" />,
      description: "Create weekly meal plans tailored to your lifestyle"
    },
    {
      title: "Cooking Tips",
      icon: <Star className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-500" />,
      description: "Learn professional cooking techniques and kitchen hacks"
    },
    {
      title: "Nutrition Guidance",
      icon: <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-rose-500" />,
      description: "Get insights about nutritional values and balanced eating"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8 text-gray-800">What Our AI Can Do</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg hover:border-gray-300 bg-white flex flex-col items-start gap-3 sm:gap-4"
          >
            <div className="bg-gray-50 p-3 sm:p-4 rounded-full self-center sm:self-start">
              {feature.icon}
            </div>
            
            <div className="flex-1 w-full text-center sm:text-left">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatBotHome;