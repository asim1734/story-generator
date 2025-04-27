"use client";

import { useState } from "react";
import StoryForm from "./components/form/StoryForm";
import StoryDisplay from "./components/ui/StoryDisplay";
import ErrorAlert from "./components/ui/ErrorAlert";

export default function Home() {
  const [story, setStory] = useState("");
  const [error, setError] = useState("");

  const handleStoryGenerated = (generatedStory: string) => {
    setStory(generatedStory);
    setError("");
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-2 text-indigo-600">
          AI Story Generator
        </h1>
        <p className="text-center text-slate-500 mb-8">
          Craft unique stories with the power of AI. Customize your narrative and watch it come to life.
        </p>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <StoryForm 
            onStoryGenerated={handleStoryGenerated} 
            onError={handleError} 
          />
        </div>

        <ErrorAlert message={error} />
        <StoryDisplay story={story} />
      </div>
    </main>
  );
}
