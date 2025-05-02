interface AudioPlayerProps {
    audioUrl?: string;
}

const AudioPlayer = ({ audioUrl }: AudioPlayerProps) => {
    if (!audioUrl) return null;

    return (
        <div className="mt-4">
            <h3 className="text-lg font-medium mb-2 text-indigo-600 flex items-center">
                <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728"
                    />
                </svg>
                Listen to your story:
            </h3>
            <div className="bg-slate-50 p-3 rounded-lg">
                <audio controls className="w-full">
                    <source src={audioUrl} type="audio/wav" />
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    );
};

export default AudioPlayer;
