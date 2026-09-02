"use client";

import Navbar from "@/components/Navbar";
import Countdown from "@/components/Countdown";

export default function LaunchPage() {
  return (
    <main className="page">
      <Navbar />

      <section className="launch">
        <div className="orb orbOne" />
        <div className="orb orbTwo" />

        <div className="content">
          <div className="badge">
            🦊 NOVA TOKEN
          </div>

          <h1>
            THE FUTURE
            <br />
            <span>IS COMING</span>
          </h1>

          <p className="description">
            Something bigger is about to begin.
            <br />
            Stay connected. Stay ready.
          </p>

          <div className="label">
            TOKEN LAUNCH IN
          </div>

          <Countdown />

          <div className="infoGrid">
            <div className="infoCard">
              <span>PROJECT</span>
              <strong>NOVA</strong>
            </div>

            <div className="infoCard">
              <span>STATUS</span>
              <strong>BUILDING</strong>
            </div>

            <div className="infoCard">
              <span>COMMUNITY</span>
              <strong>LIVE</strong>
            </div>
          </div>

          <div className="notice">
            ✦ Follow the official NOVA channels
            for launch announcements.
          </div>
        </div>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #05060a;
          color: white;
          overflow: hidden;
        }

        .launch {
          position: relative;

          min-height: calc(100vh - 80px);

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 80px 20px;

          background:
            radial-gradient(
              circle at 50% 30%,
              rgba(124, 58, 237, 0.2),
              transparent 30%
            ),
            radial-gradient(
              circle at 20% 80%,
              rgba(6, 182, 212, 0.08),
              transparent 25%
            );
        }

        .content {
          position: relative;
          z-index: 2;

          width: 100%;
          max-width: 1000px;

          text-align: center;
        }

        .badge {
          display: inline-block;

          padding: 10px 18px;

          border-radius: 999px;

          border:
            1px solid
            rgba(124, 58, 237, 0.35);

          background:
            rgba(124, 58, 237, 0.08);

          color: #c4b5fd;

          font-size: 12px;
          letter-spacing: 1px;

          box-shadow:
            0 0 35px
            rgba(124, 58, 237, 0.1);
        }

        h1 {
          margin: 28px 0 18px;

          font-size:
            clamp(55px, 10vw, 120px);

          line-height: 0.88;

          letter-spacing: -7px;
        }

        h1 span {
          background:
            linear-gradient(
              90deg,
              #ffffff,
              #a78bfa,
              #67e8f9
            );

          -webkit-background-clip: text;
          background-clip: text;

          color: transparent;
        }

        .description {
          margin: 0 auto 45px;

          color: #858996;

          font-size: 17px;
          line-height: 1.7;
        }

        .label {
          margin-bottom: 20px;

          color: #8b7cff;

          font-size: 11px;
          font-weight: bold;

          letter-spacing: 4px;
        }

        .infoGrid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 15px;

          max-width: 650px;

          margin: 50px auto 0;
        }

        .infoCard {
          padding: 18px;

          border-radius: 16px;

          border:
            1px solid
            rgba(255, 255, 255, 0.07);

          background:
            rgba(255, 255, 255, 0.03);

          backdrop-filter: blur(12px);
        }

        .infoCard span {
          display: block;

          color: #666;

          font-size: 9px;
          letter-spacing: 2px;

          margin-bottom: 8px;
        }

        .infoCard strong {
          font-size: 14px;
          letter-spacing: 1px;
        }

        .notice {
          display: inline-block;

          margin-top: 30px;

          padding: 11px 17px;

          border-radius: 10px;

          color: #777;

          background:
            rgba(255, 255, 255, 0.025);

          border:
            1px solid
            rgba(255, 255, 255, 0.05);

          font-size: 11px;
        }

        .orb {
          position: absolute;

          border-radius: 50%;

          filter: blur(70px);

          pointer-events: none;
        }

        .orbOne {
          width: 250px;
          height: 250px;

          top: 5%;
          left: -100px;

          background:
            rgba(124, 58, 237, 0.15);
        }

        .orbTwo {
          width: 220px;
          height: 220px;

          right: -80px;
          bottom: 10%;

          background:
            rgba(6, 182, 212, 0.1);
        }

        @media (max-width: 700px) {
          .launch {
            padding: 60px 15px;
          }

          h1 {
            letter-spacing: -4px;
          }

          .description {
            font-size: 15px;
          }

          .infoGrid {
            grid-template-columns: 1fr;

            max-width: 350px;

            margin-top: 35px;
          }

          .notice {
            max-width: 330px;

            line-height: 1.5;
          }
        }
      `}</style>
    </main>
  );
}