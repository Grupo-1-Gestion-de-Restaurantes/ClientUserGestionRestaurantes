import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';
import { useSoundStore } from '../../../features/home/store/useSoundStore';
import { useUIStore } from '../../store/useUIStore';

export const MusicManager = () => {
  const { pathname } = useLocation();
  const { initAudio, play, pause, isPlaying, isActuallyPlaying, toggle } = useSoundStore();
  const isIntroLocked = useUIStore((s) => s.isIntroLocked);

  const isHome = pathname === '/';
  const isPartners = pathname === '/partners';
  const shouldPlay = isHome || isPartners;

  useEffect(() => {
    initAudio();
  }, [initAudio]);

  useEffect(() => {
    if (shouldPlay) {
      if (!isHome || !isIntroLocked) {
        play();
      }
    } else {
      pause();
    }
  }, [shouldPlay, isHome, isIntroLocked, play, pause]);

  if (!shouldPlay) return null;
  if (isHome && isIntroLocked) return null;

  return (
    <button
      onClick={toggle}
      className="fixed bottom-8 right-8 z-[60] bg-surface-2 border-[3px] border-stroke-strong p-3 rounded-full shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all text-on-base"
      title={isActuallyPlaying ? "Silenciar música" : "Activar música"}
    >
      {isActuallyPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
    </button>
  );
};
