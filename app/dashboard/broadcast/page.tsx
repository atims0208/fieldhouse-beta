"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/components/auth-provider";
import { Webcam, Mic, VideoOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// TODO: Import API functions when needed

export default function BroadcastPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaDevices, setMediaDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Get media devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); // Request permission first
        const devices = await navigator.mediaDevices.enumerateDevices();
        setMediaDevices(devices);
        // Set default devices
        const firstVideo = devices.find(d => d.kind === 'videoinput');
        const firstAudio = devices.find(d => d.kind === 'audioinput');
        if (firstVideo) setSelectedVideoDevice(firstVideo.deviceId);
        if (firstAudio) setSelectedAudioDevice(firstAudio.deviceId);
      } catch (err) {
        console.error("Error enumerating devices or getting permissions:", err);
        toast({
          title: "Error Accessing Devices",
          description: "Could not access camera or microphone. Please check permissions.",
          variant: "destructive",
        });
      }
    };
    getDevices();
  }, [toast]);

  // Start local media stream preview
  const startPreview = async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    try {
      const constraints: MediaStreamConstraints = {
        video: selectedVideoDevice ? { deviceId: { exact: selectedVideoDevice } } : true,
        audio: selectedAudioDevice ? { deviceId: { exact: selectedAudioDevice } } : true,
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error starting preview:", err);
       toast({
          title: "Error Starting Preview",
          description: "Could not access selected camera or microphone.",
          variant: "destructive",
        });
    }
  };

  // Start preview when device selection changes
  useEffect(() => {
    if (selectedVideoDevice || selectedAudioDevice) {
      startPreview();
    }
    // Cleanup function to stop tracks when component unmounts or devices change
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVideoDevice, selectedAudioDevice]); 

  const handleStartStreaming = async () => {
    setIsLoading(true);
    console.log("Attempting to start stream...");
    // TODO: 1. Call backend /api/streams/start to get WHIP URL & other details
    // TODO: 2. Set up RTCPeerConnection 
    // TODO: 3. Add tracks from `stream` to PeerConnection
    // TODO: 4. Create Offer, send to WHIP endpoint
    // TODO: 5. Handle Answer from WHIP endpoint
    // TODO: 6. Set remote description
    // TODO: 7. Update state: setIsStreaming(true);
    
    // Placeholder:
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    console.log("Streaming started (simulated)");
    setIsStreaming(true); 
    setIsLoading(false);
    toast({ title: "Streaming Started (Simulated)" });
  };

  const handleStopStreaming = async () => {
    setIsLoading(true);
    console.log("Attempting to stop stream...");
    // TODO: 1. Close RTCPeerConnection
    // TODO: 2. Optionally call backend /api/streams/:id/end
    // TODO: 3. Stop media tracks & clear preview
    stream?.getTracks().forEach(track => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setStream(null);

    // Placeholder:
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Streaming stopped (simulated)");
    setIsStreaming(false);
    setIsLoading(false);
     toast({ title: "Streaming Stopped (Simulated)" });
  };

  if (!user) {
    return <p>Please log in to access the broadcast page.</p>; // Or redirect
  }
  if (!user.isStreamer) {
    return <p>You need streamer privileges to broadcast.</p>; // Or show upgrade option
  }

  return (
    <div className="container px-4 py-6 md:px-6 space-y-6">
      <h1 className="text-2xl font-bold text-fhsb-cream">WebRTC Broadcast Setup</h1>
      
      <Card className="bg-card border-fhsb-green/20">
        <CardHeader>
          <CardTitle className="text-fhsb-cream">Video Preview & Controls</CardTitle>
          <CardDescription>Select your devices and start streaming from your browser.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video bg-black border border-fhsb-green/20 rounded-md flex items-center justify-center text-muted-foreground">
            {stream ? (
               <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-contain"></video>
            ) : (
              <VideoOff className="h-16 w-16" />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="video-device">Camera</Label>
              <Select value={selectedVideoDevice} onValueChange={setSelectedVideoDevice} disabled={isStreaming}>
                <SelectTrigger className="bg-muted/10 border-fhsb-green/30 focus:ring-fhsb-green/50">
                  <SelectValue placeholder="Select camera" />
                </SelectTrigger>
                <SelectContent className="bg-black border-fhsb-green/30">
                  {mediaDevices.filter(d => d.kind === 'videoinput').map(device => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>{device.label || `Camera ${device.deviceId.substring(0, 6)}`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="audio-device">Microphone</Label>
              <Select value={selectedAudioDevice} onValueChange={setSelectedAudioDevice} disabled={isStreaming}>
                <SelectTrigger className="bg-muted/10 border-fhsb-green/30 focus:ring-fhsb-green/50">
                  <SelectValue placeholder="Select microphone" />
                </SelectTrigger>
                <SelectContent className="bg-black border-fhsb-green/30">
                  {mediaDevices.filter(d => d.kind === 'audioinput').map(device => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>{device.label || `Microphone ${device.deviceId.substring(0, 6)}`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            {!isStreaming ? (
              <Button 
                onClick={handleStartStreaming} 
                disabled={isLoading || !stream} 
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Webcam className="mr-2 h-4 w-4" />
                {isLoading ? 'Starting...' : 'Start Streaming'}
              </Button>
            ) : (
              <Button 
                onClick={handleStopStreaming} 
                disabled={isLoading} 
                variant="destructive"
              >
                <VideoOff className="mr-2 h-4 w-4" />
                {isLoading ? 'Stopping...' : 'Stop Streaming'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 