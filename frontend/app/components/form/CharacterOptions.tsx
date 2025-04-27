export default function CharacterOptions({ 
  character,
  includeDialogue,
  includeDescription,
  onChange
}: { 
  character: string;
  includeDialogue: boolean;
  includeDescription: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="character" className="block text-sm font-medium text-gray-700 mb-1">
          Main Character
        </label>
        <input
          id="character"
          type="text"
          name="character"
          value={character}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g., Detective, Wizard, Astronaut"
        />
      </div>
      
      <div className="flex flex-col justify-center space-y-2">
        <div className="flex items-center">
          <input
            id="include_dialogue"
            type="checkbox"
            name="include_dialogue"
            checked={includeDialogue}
            onChange={onChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="include_dialogue" className="ml-2 block text-sm text-gray-700">
            Include dialogue
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            id="include_description"
            type="checkbox"
            name="include_description"
            checked={includeDescription}
            onChange={onChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="include_description" className="ml-2 block text-sm text-gray-700">
            Include vivid descriptions
          </label>
        </div>
      </div>
    </div>
  );
}
