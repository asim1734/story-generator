export default function StoryPromptField({ 
  value, 
  onChange 
}: { 
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div>
      <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 mb-1">
        Story Prompt*
      </label>
      <textarea
        id="prompt"
        name="prompt"
        required
        value={value}
        onChange={onChange}
        rows={3}
        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Enter a story prompt or idea..."
      />
      <p className="mt-1 text-xs text-slate-500">
        Be specific about what you want in your story. Example: "A detective solving a mystery in a small coastal town"
      </p>
    </div>
  );
}
