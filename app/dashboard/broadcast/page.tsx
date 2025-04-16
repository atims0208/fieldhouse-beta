"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/components/auth-provider";
import { Webcam, VideoOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Copy } from "lucide-react";

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
  const router = useRouter();

  // Effect to update video element when stream changes
  useEffect(() => {
    if (stream && videoRef.current) {
      console.log("Setting stream to video element");
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.error("Error playing video:", e));
    }
  }, [stream]);

  // Get media devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        console.log("Requesting media permissions...");
        const initialStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        console.log("Got initial media stream:", initialStream.getTracks().map(t => t.kind));
        
        // Stop the initial stream since we'll create a new one with selected devices
        initialStream.getTracks().forEach(track => track.stop());
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log("Available devices:", devices.map(d => ({ kind: d.kind, label: d.label })));
        
        setMediaDevices(devices);
        
        // Set default devices
        const firstVideo = devices.find(d => d.kind === 'videoinput');
        const firstAudio = devices.find(d => d.kind === 'audioinput');
        
        console.log("Selected default video device:", firstVideo?.label);
        console.log("Selected default audio device:", firstAudio?.label);
        
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
    console.log("Starting preview with devices:", {
      video: selectedVideoDevice,
      audio: selectedAudioDevice
    });
    
    if (stream) {
      console.log("Stopping existing stream tracks");
      stream.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
    }
    
    try {
      const constraints: MediaStreamConstraints = {
        video: selectedVideoDevice ? { deviceId: { exact: selectedVideoDevice } } : true,
        audio: selectedAudioDevice ? { deviceId: { exact: selectedAudioDevice } } : true,
      };
      
      console.log("Requesting media with constraints:", constraints);
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Got media stream with tracks:", mediaStream.getTracks().map(t => t.kind));
      
      setStream(mediaStream);
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
    return (
      <div className="container px-4 py-6 md:px-6">
        <Card className="bg-card border-fhsb-green/20">
          <CardHeader>
            <CardTitle className="text-fhsb-cream">Streamer Privileges Required</CardTitle>
            <CardDescription>
              You need to be a streamer to access the broadcast dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Upgrade your account to streamer status to start broadcasting your sports content.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/dashboard/upgrade")} className="w-full">
              Upgrade to Streamer
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
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
          <div className="aspect-video bg-black border border-fhsb-green/20 rounded-md flex items-center justify-center text-muted-foreground relative min-h-[360px]">
            {stream ? (
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline 
                className="w-full h-full object-contain rounded-md"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <VideoOff className="h-16 w-16" />
                <p className="text-sm">No camera preview available</p>
              </div>
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