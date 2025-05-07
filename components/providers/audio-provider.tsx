"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Howl } from 'howler';

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (soundName: SoundName) => void;
}

type SoundName = 'hover' | 'click' | 'success' | 'error';

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const sounds: Record<SoundName, string> = {
  hover: '/sounds/hover.mp3',
  click: '/sounds/click.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
};

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(true);
  const soundsRef = useRef<Record<SoundName, Howl | null>>({
    hover: null,
    click: null,
    success: null,
    error: null,
  });
  const bgMusicRef = useRef<Howl | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Initialize sounds on client side
    Object.entries(sounds).forEach(([name, path]) => {
      soundsRef.current[name as SoundName] = new Howl({
        src: [path],
        volume: 0.5,
        preload: true,
      });
    });
    
    // Initialize background music
    bgMusicRef.current = new Howl({
      src: ['/sounds/background.mp3'],
      loop: true,
      volume: 0.2,
      preload: true,
    });
    
    return () => {
      // Clean up sounds
      Object.values(soundsRef.current).forEach(sound => sound?.unload());
      bgMusicRef.current?.unload();
    };
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    if (isMuted) {
      bgMusicRef.current?.pause();
    } else {
      bgMusicRef.current?.play();
    }
  }, [isMuted, isClient]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const playSound = (soundName: SoundName) => {
    if (isMuted || !isClient) return;
    soundsRef.current[soundName]?.play();
  };

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playSound }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}