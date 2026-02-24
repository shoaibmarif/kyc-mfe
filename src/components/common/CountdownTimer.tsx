import React from 'react';

interface CountdownTimerProps {
  seconds: number;
  onComplete?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ seconds, onComplete }) => {
  const [timer, setTimer] = React.useState(seconds);

  React.useEffect(() => {
    if (timer <= 0) {
      if (onComplete) onComplete();
      return;
    }
    const interval = setInterval(() => {
      setTimer(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, onComplete]);

  const formatted = `${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`;

  return (
    <span>{formatted}</span>
  );
};

export default CountdownTimer;
