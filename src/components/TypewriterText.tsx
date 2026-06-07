import { useState, useEffect } from "react";

interface Props {
  text: string;
  className?: string;
  speed?: number;
  onComplete?: () => void;
}

export default function TypewriterText({ text, className = "", speed = 30, onComplete }: Props) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return (
    <p className={className}>
      {displayed}
      {!done && <span className="animate-pulse text-[#1DB954]">|</span>}
    </p>
  );
}
