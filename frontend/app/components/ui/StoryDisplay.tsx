// components/ui/StoryDisplay.tsx
import AudioPlayer from "./AudioPlayer";

interface StoryDisplayProps {
    story: string;
    audioUrl?: string;
    onGenerateAudio?: () => void;
}

export default function StoryDisplay({
    story,
    audioUrl,
    onGenerateAudio,
}: StoryDisplayProps) {
    if (!story) return null;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-indigo-600 flex items-center">
                {/* Simple document SVG */}
                Your Story
            </h2>
            <div className="prose max-w-none leading-relaxed">
                {story.split("\n").map((paragraph, i) =>
                    paragraph ? (
                        <p key={i} className="mb-4">
                            {paragraph}
                        </p>
                    ) : (
                        <br key={i} />
                    )
                )}
            </div>

            {/* Audio Player Component */}
            {audioUrl && (
                <div className="mt-6 border-t pt-4">
                    <AudioPlayer audioUrl={audioUrl} />
                </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
                {/* Generate Audio Button (if audio isn't available yet) */}
                {!audioUrl && onGenerateAudio && (
                    <button
                        onClick={onGenerateAudio}
                        className="inline-flex items-center px-3 py-2 border border-slate-300 shadow-sm text-sm leading-4 font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <svg
                            className="h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                            />
                        </svg>
                        Generate Audio
                    </button>
                )}

                <button
                    onClick={() => {
                        navigator.clipboard.writeText(story);
                        alert("Story copied to clipboard!");
                    }}
                    className="inline-flex items-center px-3 py-2 border border-slate-300 shadow-sm text-sm leading-4 font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <svg
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                    Copy Story
                </button>
            </div>
        </div>
    );
}
