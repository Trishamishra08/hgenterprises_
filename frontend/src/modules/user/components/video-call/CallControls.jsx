import { Mic, MicOff, Volume2, VolumeX, PhoneOff } from 'lucide-react';

export default function CallControls({
    isMuted,
    isSpeakerEnabled,
    supportsSinkId,
    onToggleMute,
    onToggleSpeaker,
    onEndCall,
    disabled = false,
}) {
    return (
        <div className="flex items-center justify-center gap-3 sm:gap-5">
            <button
                type="button"
                disabled={disabled}
                onClick={onToggleMute}
                className={`flex flex-col items-center gap-1.5 min-w-[4.5rem] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-pressed={isMuted}
                aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
                <span
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border transition-colors ${
                        isMuted
                            ? 'bg-white text-[#3E2723] border-white'
                            : 'bg-white/15 text-white border-white/30 hover:bg-white/25'
                    }`}
                >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </span>
                <span className="text-[11px] sm:text-xs text-white/90 font-medium">
                    {isMuted ? 'Unmute' : 'Mute'}
                </span>
            </button>

            <button
                type="button"
                disabled={disabled}
                onClick={onToggleSpeaker}
                title={
                    supportsSinkId
                        ? 'Toggle remote audio output'
                        : 'Toggle remote audio (device switch not supported in this browser)'
                }
                className={`flex flex-col items-center gap-1.5 min-w-[4.5rem] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-pressed={!isSpeakerEnabled}
                aria-label={isSpeakerEnabled ? 'Turn speaker off' : 'Turn speaker on'}
            >
                <span
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border transition-colors ${
                        !isSpeakerEnabled
                            ? 'bg-white text-[#3E2723] border-white'
                            : 'bg-white/15 text-white border-white/30 hover:bg-white/25'
                    }`}
                >
                    {isSpeakerEnabled ? (
                        <Volume2 className="w-5 h-5" />
                    ) : (
                        <VolumeX className="w-5 h-5" />
                    )}
                </span>
                <span className="text-[11px] sm:text-xs text-white/90 font-medium">
                    {isSpeakerEnabled ? 'Speaker ON' : 'Speaker OFF'}
                </span>
            </button>

            <button
                type="button"
                onClick={onEndCall}
                className="flex flex-col items-center gap-1.5 min-w-[4.5rem]"
                aria-label="End call"
            >
                <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-[#B91C1C] text-white shadow-lg hover:bg-[#991B1B] transition-colors">
                    <PhoneOff className="w-5 h-5" />
                </span>
                <span className="text-[11px] sm:text-xs text-white/90 font-medium">End Call</span>
            </button>
        </div>
    );
}
