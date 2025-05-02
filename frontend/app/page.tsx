"use client";

import { useState } from "react";
import StoryForm from "./components/form/StoryForm";
import StoryDisplay from "./components/ui/StoryDisplay";
import ErrorAlert from "./components/ui/ErrorAlert";

export default function Home() {
    const [story, setStory] = useState("");
    const [error, setError] = useState("");
    const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

    const handleStoryGenerated = (response: any) => {
        // Check if the response is a string (older implementation) or an object (new implementation with audio)
        if (typeof response === "string") {
            setStory(response);
            setAudioUrl(undefined);
        } else {
            // Assuming response is an object with story and possibly audio_url
            setStory(response.story);

            // If audio was generated with the story
            if (response.audio_url) {
                setAudioUrl(`http://localhost:8000${response.audio_url}`);
            } else {
                setAudioUrl(undefined);
            }
        }

        setError("");
    };

    const handleError = (errorMessage: string) => {
        setError(errorMessage);
    };

    // Function to generate audio for an existing story
    const generateAudio = async () => {
        if (!story) return;

        setIsGeneratingAudio(true);
        try {
            // Make a request to your backend to generate audio
            const response = await fetch("http://localhost:8000/tts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: story }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate audio");
            }

            // Get the audio URL from the response
            const data = await response.json();
            if (data.audio_url) {
                setAudioUrl(`http://localhost:8000${data.audio_url}`);
            } else {
                throw new Error("No audio URL in response");
            }
        } catch (error) {
            console.error("Error generating audio:", error);
            setError("Failed to generate audio. Please try again.");
        } finally {
            setIsGeneratingAudio(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-2 text-indigo-600">
                    AI Story Generator
                </h1>
                <p className="text-center text-slate-500 mb-8">
                    Craft unique stories with the power of AI. Customize your
                    narrative and watch it come to life.
                </p>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <StoryForm
                        onStoryGenerated={handleStoryGenerated}
                        onError={handleError}
                    />
                </div>

                <ErrorAlert message={error} />

                {story && (
                    <StoryDisplay
                        story={story}
                        audioUrl={audioUrl}
                        onGenerateAudio={generateAudio}
                    />
                )}

                {/* Loading indicator for audio generation */}
                {isGeneratingAudio && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl">
                            <p className="text-lg">Generating audio...</p>
                            <div className="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
