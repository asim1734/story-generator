export default function GenerationParams({
  temperature,
  onChange
}: {
  temperature: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label htmlFor="temperature" className="block text-sm font-medium text-slate-700 mb-1">
        Creativity Level
      </label>
      <div className="flex items-center">
        <input
          id="temperature"
          type="range"
          name="temperature"
          min="0.1"
          max="1.5"
          step="0.1"
          value={temperature}
          onChange={onChange}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="ml-2 w-12 text-sm text-slate-700">{temperature}</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Lower = more predictable, Higher = more creative
      </p>
    </div>
  );
}
