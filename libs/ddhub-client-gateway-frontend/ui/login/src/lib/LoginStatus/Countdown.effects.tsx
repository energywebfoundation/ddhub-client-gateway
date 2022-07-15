import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

/**
 * Countdown effect to display the remaining time before a refresh.
 * @param milliseconds
 * @returns
 */
const useCountdown = (milliseconds: number, callback?: () => void) => {
  const countdownTime = () =>
    Math.round(
      (DateTime.now()
        .plus({
          milliseconds: milliseconds > 0 ? milliseconds : 1000,
        })
        .toMillis() -
        DateTime.now().toMillis()) /
        1000
    ) * 1000;

  const [countdown, setCountdown] = useState(countdownTime);
  const resetCountdown = () => setCountdown(countdownTime);

  useEffect(() => {
    if (countdown <= 0) {
      if (callback) {
        callback();
      }
      return;
    }

    const interval = setInterval(() => {
      setCountdown((countdown) => countdown - 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  return { resetCountdown, ...getReturnValues(countdown) };
};

/**
 * Calculate time left for a given number of milliseconds
 * @param countdown
 * @returns
 */
const getReturnValues = (countdown: number) => {
  const days = Math.floor(countdown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countdown % (1000 * 60)) / 1000);
  const totalSeconds = Math.floor(countdown / 1000);

  return { days, hours, minutes, seconds, totalSeconds };
};

export { useCountdown };
