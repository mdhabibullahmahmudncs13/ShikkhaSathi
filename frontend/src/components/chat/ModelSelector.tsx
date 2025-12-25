import React from 'react';
import { Calculator, Globe, BookOpen } from 'lucide-react';

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
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-gray-700">AI Model</h3>
        {selectedOption && (
          <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
            {selectedOption.name}
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-1.5">
        {modelOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onModelChange(option.id)}
            disabled={disabled}
            className={`
              flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs transition-all
              ${selectedModel === option.id
                ? `${option.color} text-white shadow-sm`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={option.description}
          >
            <div className="w-3 h-3">
              {React.cloneElement(option.icon as React.ReactElement, { className: 'w-3 h-3' })}
            </div>
            <span className="font-medium">{option.name}</span>
          </button>
        ))}
      </div>
      
      {!selectedModel && (
        <p className="text-xs text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">
          Choose an AI model
        </p>
      )}
    </div>
  );
};

export default ModelSelector;