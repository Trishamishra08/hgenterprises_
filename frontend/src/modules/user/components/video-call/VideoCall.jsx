import { useNavigate } from 'react-router-dom';
import { CALL_STATES } from '../../../../config/webrtc';
import useWebRTC from '../../../../hooks/useWebRTC';
import LocalVideo from './LocalVideo';
import RemoteVideo from './RemoteVideo';
import CallControls from './CallControls';

const statusLabel = {
    [CALL_STATES.IDLE]: 'Ready',
    [CALL_STATES.CONNECTING]: 'Connecting...',
    [CALL_STATES.CONNECTED]: 'Connected',
    [CALL_STATES.ENDED]: 'Call ended',
    [CALL_STATES.FAILED]: 'Connection failed',
};

/**
 * Full-screen 1-to-1 video call UI.
 * Remote = main stage; local = floating preview.
 */
export default function VideoCall({ callId, onLeavePath = '/video-call' }) {
    const navigate = useNavigate();
    const {
        localStream,
        remoteStream,
        callState,
        isMuted,
        isSpeakerEnabled,
        supportsSinkId,
        error,
        peerInfo,
        toggleMute,
        toggleSpeaker,
        endCall,
        bindRemoteVideoEl,
    } = useWebRTC({ callId, enabled: Boolean(callId) });

    const handleEnd = () => {
        endCall(true);
        navigate(onLeavePath, { replace: true });
    };

    const showEndedActions =
        callState === CALL_STATES.ENDED || callState === CALL_STATES.FAILED;

    return (
        <div className="fixed inset-0 z-[200] bg-[#1a0f10] text-white flex flex-col">
            <div className="absolute top-0 inset-x-0 z-20 px-4 py-3 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
                <div>
                    <p className="text-sm font-medium tracking-wide text-white/90">
                        HG Enterprises Call
                    </p>
                    <p className="text-xs text-white/60">
                        {peerInfo?.name ? `With ${peerInfo.name}` : `Room ${callId}`}
                    </p>
                </div>
                <span
                    className={`text-xs px-2.5 py-1 rounded-full border ${
                        callState === CALL_STATES.CONNECTED
                            ? 'border-[#C5A059]/50 text-[#C5A059] bg-[#C5A059]/10'
                            : callState === CALL_STATES.FAILED
                              ? 'border-red-400/50 text-red-200 bg-red-500/10'
                              : 'border-white/20 text-white/80 bg-white/5'
                    }`}
                >
                    {statusLabel[callState] || callState}
                </span>
            </div>

            <div className="relative flex-1 min-h-0">
                {remoteStream ? (
                    <RemoteVideo
                        stream={remoteStream}
                        muted={!isSpeakerEnabled}
                        onVideoRef={bindRemoteVideoEl}
                        className="absolute inset-0 w-full h-full"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center bg-[#2a181a]">
                        <div className="w-20 h-20 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-2xl font-serif text-[#C5A059]">
                            {(peerInfo?.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <p className="text-base text-white/80">
                            {callState === CALL_STATES.CONNECTING
                                ? 'Waiting for the other person to join...'
                                : showEndedActions
                                  ? statusLabel[callState]
                                  : 'No remote video yet'}
                        </p>
                        {error && (
                            <p className="text-sm text-red-200 max-w-md">{error}</p>
                        )}
                    </div>
                )}

                <div className="absolute bottom-28 right-4 sm:bottom-32 sm:right-6 w-28 h-40 sm:w-36 sm:h-52 rounded-xl overflow-hidden border-2 border-white/40 shadow-2xl bg-black z-10">
                    {localStream ? (
                        <LocalVideo stream={localStream} className="w-full h-full scale-x-[-1]" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-white/50 px-2 text-center">
                            Camera off
                        </div>
                    )}
                    <span className="absolute bottom-1.5 left-1.5 text-[10px] bg-black/50 px-1.5 py-0.5 rounded">
                        You
                    </span>
                </div>
            </div>

            <div className="relative z-20 px-4 pb-8 pt-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                {error && callState !== CALL_STATES.FAILED && remoteStream && (
                    <p className="text-center text-xs text-amber-200 mb-3">{error}</p>
                )}

                {showEndedActions ? (
                    <div className="flex flex-col items-center gap-3">
                        <p className="text-sm text-white/80">
                            {error || statusLabel[callState]}
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate(onLeavePath, { replace: true })}
                            className="px-6 py-2.5 rounded-full bg-[#C5A059] text-[#3E2723] text-sm font-semibold hover:bg-[#d4b06e] transition-colors"
                        >
                            Back to Video Call
                        </button>
                    </div>
                ) : (
                    <CallControls
                        isMuted={isMuted}
                        isSpeakerEnabled={isSpeakerEnabled}
                        supportsSinkId={supportsSinkId}
                        onToggleMute={toggleMute}
                        onToggleSpeaker={toggleSpeaker}
                        onEndCall={handleEnd}
                        disabled={callState === CALL_STATES.IDLE}
                    />
                )}
            </div>
        </div>
    );
}
