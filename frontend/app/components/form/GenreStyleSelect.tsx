"use client";

import Select from "react-select";

// Define sample options for dropdowns
const genreOptions = [
  { value: "fantasy", label: "Fantasy" },
  { value: "sci-fi", label: "Science Fiction" },
  { value: "mystery", label: "Mystery" },
  { value: "romance", label: "Romance" },
  { value: "horror", label: "Horror" },
  { value: "adventure", label: "Adventure" },
  { value: "historical", label: "Historical Fiction" },
  { value: "other", label: "Other" },
];

const styleOptions = [
  { value: "descriptive", label: "Descriptive" },
  { value: "conversational", label: "Conversational" },
  { value: "poetic", label: "Poetic" },
  { value: "humorous", label: "Humorous" },
  { value: "dramatic", label: "Dramatic" },
  { value: "minimalist", label: "Minimalist" },
  { value: "noir", label: "Noir" },
  { value: "fairytale", label: "Fairytale" },
];

export default function GenreStyleSelect({ 
  genre, 
  style, 
  onSelectChange 
}: { 
  genre: { value: string; label: string } | null;
  style: { value: string; label: string } | null;
  onSelectChange: (selectedOption: any, actionMeta: { name?: string }) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
          Genre
        </label>
        <Select
          id="genre"
          name="genre"
          options={genreOptions}
          value={genre}
          onChange={(selected) => onSelectChange(selected, { name: "genre" })}
          placeholder="Select a genre..."
          className="w-full text-sm"
          classNames={{
            control: (state) => 
              state.isFocused ? 'border-indigo-500 shadow-sm' : 'border-gray-300 shadow-sm',
          }}
          isClearable
        />
      </div>
      
      <div>
        <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-1">
          Writing Style
        </label>
        <Select
          id="style"
          name="style"
          options={styleOptions}
          value={style}
          onChange={(selected) => onSelectChange(selected, { name: "style" })}
          placeholder="Select a style..."
          className="w-full text-sm"
          classNames={{
            control: (state) => 
              state.isFocused ? 'border-indigo-500 shadow-sm' : 'border-gray-300 shadow-sm',
          }}
          isClearable
        />
      </div>
    </div>
  );
}
