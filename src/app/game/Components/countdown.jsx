import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetTime }) => {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = parseInt(1000 * targetTime) - (now);
    console.log("targetTime ", targetTime);
    console.log("Difference ", difference);
    console.log("Now ", now)
    if (difference <= 0) {
      // The countdown has ended
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  return (
    
    <div className="rounded logs flex-container mx-auto">
        <div className="flex-item">
          Days : 
          <div className="w-10 mx-auto">
            {(isNaN(timeLeft.days) ) ? "00" : timeLeft.days} 
          </div>
        </div>
        <div className="flex-item">
        Hours : 
          <div className="w-10 mx-auto">
        {(isNaN(timeLeft.hours) ) ? "00" : timeLeft.hours} 
        </div>
        </div>
        <div className="flex-item">
        Minutes : 
          <div className="w-10 mx-auto">
        {(isNaN(timeLeft.minutes) ) ? "00" : timeLeft.minutes} 
        </div>
        </div>
        <div className="flex-item">
        Seconds : 
          <div className="w-10 mx-auto">
        {(isNaN(timeLeft.seconds) ) ? "00" : timeLeft.seconds} 
        </div>
        </div>
        
      </div>
  );
};

export default CountdownTimer;
