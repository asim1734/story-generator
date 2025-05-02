"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import StoryPromptField from "./StoryPromptField";
import GenreStyleSelect from "./GenreStyleSelect";
import CharacterOptions from "./CharacterOptions";
import SubmitButton from "../ui/SubmitButton";

export type FormData = {
    prompt: string;
    genre: { value: string; label: string } | null;
    style: { value: string; label: string } | null;
    character: string;
    story_length: string;
    temperature: number;
    include_dialogue: boolean;
    include_description: boolean;
};

export default function StoryForm({
    onStoryGenerated,
    onError,
}: {
    onStoryGenerated: (story: string) => void;
    onError: (error: string) => void;
}) {
    // const router = useRouter();
    const [form, setForm] = useState<FormData>({
        prompt: "",
        genre: null,
        style: null,
        character: "",
        story_length: "medium",
        temperature: 0.8,
        include_dialogue: true,
        include_description: true,
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target as HTMLInputElement;

        if (type === "checkbox") {
            const checkbox = e.target as HTMLInputElement;
            setForm({ ...form, [name]: checkbox.checked });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSelectChange = (
        selectedOption: any,
        { name }: { name?: string }
    ) => {
        if (name) {
            setForm({ ...form, [name]: selectedOption });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare the data for the API
            const apiData = {
                prompt: form.prompt,
                genre: form.genre?.value || "",
                style: form.style?.value || "",
                character: form.character,
                story_length: form.story_length,
                temperature: Number(form.temperature),
                include_dialogue: form.include_dialogue,
                include_description: form.include_description,
            };

            const response = await fetch(
                "http://localhost:8000/generate-story",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(apiData),
                }
            );

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            onStoryGenerated(data.story);
        } catch (err: any) {
            console.error("Error generating story:", err);
            onError(`Failed to generate story: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <StoryPromptField
                value={form.prompt}
                onChange={handleInputChange}
            />

            <GenreStyleSelect
                genre={form.genre}
                style={form.style}
                onSelectChange={handleSelectChange}
            />

            <CharacterOptions
                character={form.character}
                includeDialogue={form.include_dialogue}
                includeDescription={form.include_description}
                onChange={handleInputChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Story Length Dropdown */}
                <div>
                    <label
                        htmlFor="story_length"
                        className="block text-sm font-medium text-slate-700 mb-1"
                    >
                        Story Length
                    </label>
                    <select
                        id="story_length"
                        name="story_length"
                        value={form.story_length}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="long">Long</option>
                    </select>
                </div>

                {/* Temperature */}
                <div className="md:col-span-2">
                    <label
                        htmlFor="temperature"
                        className="block text-sm font-medium text-slate-700 mb-1"
                    >
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
                            value={form.temperature}
                            onChange={handleInputChange}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="ml-2 w-12 text-sm text-slate-700">
                            {form.temperature}
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                        Lower = more predictable, Higher = more creative
                    </p>
                </div>
            </div>

            <SubmitButton loading={loading} />
        </form>
    );
}
