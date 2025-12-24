import React from 'react';
import { Brain, Calculator, Globe, BookOpen } from 'lucide-react';

interface ModelOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  subjects: string[];
}

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
  className?: string;
}

const modelOptions: ModelOption[] = [
  {
    id: 'bangla',
    name: 'বাংলা মডেল',
    description: 'Bengali language, literature, and cultural context',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'bg-green-500',
    subjects: ['Bangla', 'বাংলা', 'Bengali Literature']
  },
  {
    id: 'math',
    name: 'Math Model',
    description: 'Mathematical reasoning and problem solving',
    icon: <Calculator className="w-5 h-5" />,
    color: 'bg-blue-500',
    subjects: ['Mathematics', 'Algebra', 'Geometry', 'Calculus']
  },
  {
    id: 'general',
    name: 'General Model',
    description: 'Physics, Chemistry, Biology, and English',
    icon: <Globe className="w-5 h-5" />,
    color: 'bg-purple-500',
    subjects: ['Physics', 'Chemistry', 'Biology', 'English']
  }
];

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  disabled = false,
  className = ''
}) => {
  const selectedOption = modelOptions.find(option => option.id === selectedModel);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <Brain className="w-5 h-5 text-gray-600" />
        <h3 className="text-sm font-medium text-gray-700">Select AI Model</h3>
        {selectedOption && (
          <span className="text-xs text-gray-500">
            ({selectedOption.name})
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {modelOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onModelChange(option.id)}
            disabled={disabled}
            className={`
              relative p-4 rounded-lg border-2 transition-all duration-200 text-left
              ${selectedModel === option.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-start space-x-3">
              <div className={`
                p-2 rounded-lg text-white flex-shrink-0
                ${option.color}
              `}>
                {option.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm">
                  {option.name}
                </h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {option.description}
                </p>
                
                <div className="mt-2 flex flex-wrap gap-1">
                  {option.subjects.slice(0, 2).map((subject, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {subject}
                    </span>
                  ))}
                  {option.subjects.length > 2 && (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{option.subjects.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {selectedModel === option.id && (
              <div className="absolute top-2 right-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {!selectedModel && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Please select a model</strong> to start chatting. Each model is specialized for different subjects.
          </p>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;