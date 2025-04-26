import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { WebRTCStream } from '@/components/webrtc-stream';
import { StreamType } from '@/types/stream';
import { useToast } from '@/components/ui/use-toast';

export default function NewStreamPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [streamType, setStreamType] = useState<StreamType>(StreamType.RTMP);
  const [stream, setStream] = useState<any>(null);

  const createStream = async () => {
    try {
      const response = await fetch('/api/streams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          streamType
        })
      });

      if (!response.ok) throw new Error('Failed to create stream');

      const newStream = await response.json();
      setStream(newStream);

      toast({
        title: 'Stream created',
        description: streamType === StreamType.RTMP 
          ? 'Use the provided RTMP URL and stream key in OBS'
          : 'You can now start streaming using your camera and microphone',
      });
    } catch (error) {
      console.error('Error creating stream:', error);
      toast({
        title: 'Error',
        description: 'Failed to create stream',
        variant: 'destructive'
      });
    }
  };

  const handleStreamStart = async () => {
    try {
      await fetch(`/api/streams/${stream.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'live' })
      });
    } catch (error) {
      console.error('Error updating stream status:', error);
    }
  };

  const handleStreamEnd = async () => {
    try {
      await fetch(`/api/streams/${stream.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ended' })
      });
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating stream status:', error);
    }
  };

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Create New Stream</h1>
        
        {!stream ? (
          <div className="space-y-4">
            <Input
              placeholder="Stream Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
            <Textarea
              placeholder="Stream Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="space-y-2">
              <label className="block font-medium">Stream Type</label>
              <select
                value={streamType}
                onChange={(e) => setStreamType(e.target.value as StreamType)}
                className="select select-bordered w-full"
              >
                <option value={StreamType.RTMP}>OBS/RTMP</option>
                <option value={StreamType.WEBRTC}>Camera/WebRTC</option>
              </select>
            </div>

            <Button onClick={createStream} className="w-full">
              Create Stream
            </Button>
          </div>
        ) : streamType === StreamType.RTMP ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="font-medium">RTMP URL:</p>
              <code className="block p-2 bg-background rounded">
                {stream.rtmpUrl}
              </code>
              
              <p className="font-medium">Stream Key:</p>
              <code className="block p-2 bg-background rounded">
                {stream.streamKey}
              </code>
            </div>

            <div className="text-sm text-muted-foreground">
              Use these credentials in your OBS settings to start streaming.
            </div>
          </div>
        ) : (
          <WebRTCStream
            streamId={stream.id}
            sessionId={stream.webrtcSessionId}
            iceServers={stream.webrtcConfiguration?.iceServers || []}
            onStreamStart={handleStreamStart}
            onStreamEnd={handleStreamEnd}
          />
        )}
      </div>
    </div>
  );
} 