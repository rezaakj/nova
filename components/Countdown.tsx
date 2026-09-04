"use client";

import { useEffect, useState } from "react";

const LAUNCH_DATE =
  new Date("2026-10-10T00:00:00Z").getTime();

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateTime(): TimeLeft {
  const difference =
    LAUNCH_DATE - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(
      difference /
        (1000 * 60 * 60 * 24)
    ),

    hours: Math.floor(
      (difference /
        (1000 * 60 * 60)) %
        24
    ),

    minutes: Math.floor(
      (difference /
        (1000 * 60)) %
        60
    ),

    seconds: Math.floor(
      (difference / 1000) % 60
    ),
  };
}

function pad(value: number) {
  return value
    .toString()
    .padStart(2, "0");
}

export default function Countdown() {
  const [time, setTime] =
    useState<TimeLeft>(
      calculateTime()
    );

  useEffect(() => {
    const interval =
      window.setInterval(() => {
        setTime(calculateTime());
      }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const launched =
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0;

  if (launched) {
    return (
      <div className="launched">
        🚀 NOVA IS LIVE
      </div>
    );
  }

  return (
    <div className="countdown">
      <div className="countBox">
        <strong>{time.days}</strong>
        <span>DAYS</span>
      </div>

      <div className="separator">:</div>

      <div className="countBox">
        <strong>
          {pad(time.hours)}
        </strong>
        <span>HOURS</span>
      </div>

      <div className="separator">:</div>

      <div className="countBox">
        <strong>
          {pad(time.minutes)}
        </strong>
        <span>MINUTES</span>
      </div>

      <div className="separator">:</div>

      <div className="countBox">
        <strong>
          {pad(time.seconds)}
        </strong>
        <span>SECONDS</span>
      </div>

      <style jsx>{`
        .countdown {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
        }

        .countBox {
          min-width: 115px;
          padding: 22px 15px;

          border-radius: 20px;

          border:
            1px solid
            rgba(255, 255, 255, 0.09);

          background:
            rgba(255, 255, 255, 0.045);

          backdrop-filter: blur(15px);

          box-shadow:
            0 15px 50px
            rgba(0, 0, 0, 0.25);

          transition: 0.2s;
        }

        .countBox:hover {
          transform: translateY(-3px);

          border-color:
            rgba(124, 58, 237, 0.45);

          box-shadow:
            0 15px 50px
            rgba(124, 58, 237, 0.15);
        }

        .countBox strong {
          display: block;

          font-size: 42px;
          line-height: 1;

          letter-spacing: -2px;

          background:
            linear-gradient(
              90deg,
              #ffffff,
              #a78bfa,
              #67e8f9
            );

          -webkit-background-clip: text;
          color: transparent;
        }

        .countBox span {
          display: block;

          margin-top: 9px;

          color: #777;

          font-size: 9px;
          letter-spacing: 2px;
        }

        .separator {
          color: #7c3aed;

          font-size: 32px;
          font-weight: bold;

          margin-top: -20px;

          text-shadow:
            0 0 20px
            rgba(124, 58, 237, 0.7);
        }

        .launched {
          padding: 25px 40px;

          border-radius: 18px;

          border:
            1px solid
            rgba(34, 197, 94, 0.3);

          background:
            rgba(34, 197, 94, 0.08);

          color: #86efac;

          font-size: 24px;
          font-weight: bold;

          box-shadow:
            0 0 50px
            rgba(34, 197, 94, 0.12);
        }

        @media (max-width: 700px) {
          .countdown {
            gap: 5px;
          }

          .countBox {
            min-width: 70px;
            padding: 15px 5px;
            border-radius: 14px;
          }

          .countBox strong {
            font-size: 25px;
          }

          .countBox span {
            font-size: 7px;
            letter-spacing: 1px;
          }

          .separator {
            font-size: 20px;
          }
        }

        @media (max-width: 420px) {
          .countBox {
            min-width: 62px;
          }

          .countBox strong {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}
