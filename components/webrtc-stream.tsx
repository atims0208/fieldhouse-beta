import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface WebRTCStreamProps {
  streamId: string;
  sessionId: string;
  iceServers: RTCIceServer[];
  onStreamStart?: () => void;
  onStreamEnd?: () => void;
}

export function WebRTCStream({
  streamId,
  sessionId,
  iceServers,
  onStreamStart,
  onStreamEnd
}: WebRTCStreamProps) {
  const { toast } = useToast();
  const [isStreaming, setIsStreaming] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>();
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>();
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Get available devices
  useEffect(() => {
    async function getDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setDevices(devices);
        
        // Set default devices
        const defaultCamera = devices.find(d => d.kind === 'videoinput')?.deviceId;
        const defaultMic = devices.find(d => d.kind === 'audioinput')?.deviceId;
        
        setSelectedCamera(defaultCamera);
        setSelectedMicrophone(defaultMic);
      } catch (error) {
        console.error('Error getting devices:', error);
        toast({
          title: 'Error',
          description: 'Failed to get media devices',
          variant: 'destructive'
        });
      }
    }

    getDevices();
  }, [toast]);

  const startStream = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: selectedCamera ? { deviceId: selectedCamera } : true,
        audio: selectedMicrophone ? { deviceId: selectedMicrophone } : true
      });

      // Save stream reference
      streamRef.current = stream;

      // Show preview
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create and configure RTCPeerConnection
      const peerConnection = new RTCPeerConnection({ iceServers });
      peerConnectionRef.current = peerConnection;

      // Add tracks to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Create and set local description
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Send offer to Bunny.net
      const response = await fetch(`/api/streams/${streamId}/webrtc/offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          offer: peerConnection.localDescription
        })
      });

      if (!response.ok) throw new Error('Failed to send offer');

      const { answer } = await response.json();
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));

      setIsStreaming(true);
      onStreamStart?.();

      // Handle ICE candidates
      peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
          await fetch(`/api/streams/${streamId}/webrtc/candidate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              candidate: event.candidate
            })
          });
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        if (peerConnection.connectionState === 'disconnected') {
          stopStream();
        }
      };

    } catch (error) {
      console.error('Error starting stream:', error);
      toast({
        title: 'Error',
        description: 'Failed to start stream',
        variant: 'destructive'
      });
    }
  };

  const stopStream = () => {
    // Stop all tracks
    streamRef.current?.getTracks().forEach(track => track.stop());
    
    // Close peer connection
    peerConnectionRef.current?.close();
    
    // Clear video preview
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    setIsStreaming(false);
    onStreamEnd?.();
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <select
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
            className="select select-bordered w-full"
            disabled={isStreaming}
          >
            {devices
              .filter(device => device.kind === 'videoinput')
              .map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                </option>
              ))}
          </select>

          <select
            value={selectedMicrophone}
            onChange={(e) => setSelectedMicrophone(e.target.value)}
            className="select select-bordered w-full"
            disabled={isStreaming}
          >
            {devices
              .filter(device => device.kind === 'audioinput')
              .map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                </option>
              ))}
          </select>
        </div>

        <Button
          onClick={isStreaming ? stopStream : startStream}
          variant={isStreaming ? "destructive" : "default"}
          className="w-full"
        >
          {isStreaming ? 'Stop Streaming' : 'Start Streaming'}
        </Button>
      </div>
    </div>
  );
} 