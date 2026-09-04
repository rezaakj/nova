"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

const phases = [
  {
    number: "01",
    title: "Genesis",
    status: "COMPLETED",
    description:
      "NOVA foundation, identity and initial ecosystem architecture.",
    items: [
      "NOVA brand identity",
      "Website launch",
      "Community channels",
      "Initial ecosystem design",
    ],
  },
  {
    number: "02",
    title: "Community",
    status: "LIVE",
    description:
      "Growing the NOVA community through social activities and rewards.",
    items: [
      "Social tasks",
      "NOVA Points",
      "Community campaigns",
      "Community growth",
    ],
  },
  {
    number: "03",
    title: "Token Launch",
    status: "UPCOMING",
    description:
      "The next major milestone for the NOVA ecosystem.",
    items: [
      "Token launch",
      "Token ecosystem",
      "Community allocation",
      "Launch campaign",
    ],
  },
  {
    number: "04",
    title: "Ecosystem",
    status: "UPCOMING",
    description:
      "Expanding NOVA beyond the initial launch.",
    items: [
      "Ecosystem expansion",
      "New utilities",
      "Partnerships",
      "New community features",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <main className="page">
      <Navbar />

      <div className="ambient ambientOne" />
      <div className="ambient ambientTwo" />
      <div className="grid" />

      <div className="container">
        <div className="topRow">
          <Link href="/" className="back">
            <span>←</span>
            NOVA Home
          </Link>

          <div className="systemStatus">
            <span />
            ECOSYSTEM ROADMAP
          </div>
        </div>

        <header className="hero">
          <div className="eyebrow">
            <i />
            NOVA ROADMAP
            <i />
          </div>

          <h1>
            Building the
            <br />
            <span>future.</span>
          </h1>

          <p>
            NOVA is being built step by step.
            Follow our roadmap and discover where
            the ecosystem is heading next.
          </p>

          <div className="heroStats">
            <div>
              <span>PHASES</span>
              <strong>04</strong>
            </div>

            <b />

            <div>
              <span>LIVE</span>
              <strong className="live">01</strong>
            </div>

            <b />

            <div>
              <span>STATUS</span>
              <strong>BUILDING</strong>
            </div>
          </div>
        </header>

        <section className="progressCard">
          <div className="progressTop">
            <div>
              <div className="sectionEyebrow">
                ECOSYSTEM PROGRESS
              </div>

              <h2>NOVA Journey</h2>
            </div>

            <div className="percent">
              50<span>%</span>
            </div>
          </div>

          <div className="progressTrack">
            <div className="progressValue">
              <div className="progressGlow" />
            </div>
          </div>

          <div className="progressLabels">
            <span className="done">GENESIS</span>
            <span className="liveLabel">
              COMMUNITY
            </span>
            <span>TOKEN LAUNCH</span>
            <span>ECOSYSTEM</span>
          </div>
        </section>

        <section className="timelineSection">
          <div className="sectionHeader">
            <div>
              <div className="sectionEyebrow">
                DEVELOPMENT PATH
              </div>

              <h2>
                The NOVA
                <span> journey.</span>
              </h2>
            </div>

            <div className="phaseCounter">
              01 — 04
            </div>
          </div>

          <div className="timeline">
            <div className="timelineLine">
              <div className="timelineProgress" />
            </div>

            {phases.map((phase) => {
              const completed =
                phase.status === "COMPLETED";

              const live =
                phase.status === "LIVE";

              return (
                <article
                  key={phase.number}
                  className={
                    live
                      ? "phase activePhase"
                      : completed
                      ? "phase completedPhase"
                      : "phase"
                  }
                >
                  <div className="markerColumn">
                    <div className="marker">
                      {completed ? "✓" : phase.number}
                    </div>
                  </div>

                  <div className="phaseCard">
                    <div className="phaseGlow" />

                    <div className="phaseTop">
                      <div>
                        <div className="phaseNumber">
                          PHASE {phase.number}
                        </div>

                        <h3>{phase.title}</h3>
                      </div>

                      <div
                        className={
                          completed
                            ? "badge completed"
                            : live
                            ? "badge liveBadge"
                            : "badge upcoming"
                        }
                      >
                        <span />
                        {phase.status}
                      </div>
                    </div>

                    <p className="description">
                      {phase.description}
                    </p>

                    <div className="features">
                      {phase.items.map((item) => (
                        <div
                          key={item}
                          className="feature"
                        >
                          <span>
                            {completed ? "✓" : "✦"}
                          </span>

                          {item}
                        </div>
                      ))}
                    </div>

                    {live && (
                      <div className="building">
                        <span />
                        <strong>
                          CURRENTLY BUILDING
                        </strong>

                        <div className="buildingLine">
                          <i />
                        </div>
                      </div>
                    )}

                    {!completed && !live && (
                      <div className="upcomingText">
                        <span>◈</span>
                        NEXT PHASE
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="launchCard">
          <div className="launchGlow" />

          <div className="rocket">
            🚀
          </div>

          <div className="launchInfo">
            <div className="sectionEyebrow">
              NEXT MAJOR MILESTONE
            </div>

            <h2>
              Token Launch
              <span> is coming.</span>
            </h2>

            <p>
              The countdown has started. Stay active,
              collect NOVA Points and follow the
              official channels for every update.
            </p>
          </div>

          <Link
            href="/launch"
            className="launchButton"
          >
            <span>View Countdown</span>
            <b>↗</b>
          </Link>
        </section>

        <section className="explore">
          <div>
            <div className="sectionEyebrow">
              KEEP EXPLORING
            </div>

            <h2>
              Your NOVA journey
              <span> continues.</span>
            </h2>
          </div>

          <div className="exploreLinks">
            <Link href="/tasks">
              <span>✦</span>
              Tasks
              <b>↗</b>
            </Link>

            <Link href="/social">
              <span>◎</span>
              Social
              <b>↗</b>
            </Link>

            <Link href="/profile">
              <span>◉</span>
              Profile
              <b>↗</b>
            </Link>
          </div>
        </section>
      </div>

      <footer>
        <div className="footerBrand">
          <strong>NOVA</strong>
          <span>FOX ECOSYSTEM</span>
        </div>

        <span>
          Building the future together 🦊
        </span>

        <span className="footerCode">
          ROADMAP / 2026
        </span>
      </footer>

      <style jsx>{`
        .page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(124, 58, 237, 0.1),
              transparent 28%
            ),
            #05060a;
          color: white;
        }

        .grid {
          position: fixed;
          inset: 86px 0 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.22;
          background-image:
            linear-gradient(
              rgba(124, 58, 237, 0.04) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(124, 58, 237, 0.04) 1px,
              transparent 1px
            );
          background-size: 42px 42px;
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 80%
          );
        }

        .ambient {
          position: fixed;
          width: 430px;
          height: 430px;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }

        .ambientOne {
          top: 80px;
          right: -180px;
          background: rgba(124, 58, 237, 0.13);
        }

        .ambientTwo {
          bottom: -200px;
          left: -160px;
          background: rgba(6, 182, 212, 0.07);
        }

        .container {
          position: relative;
          z-index: 2;
          max-width: 1120px;
          margin: auto;
          padding: 38px 25px 100px;
        }

        .topRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 65px;
        }

        .back {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #666;
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
          transition: 0.25s;
        }

        .back span {
          color: #8b7cff;
          font-size: 17px;
          transition: 0.25s;
        }

        .back:hover {
          color: white;
        }

        .back:hover span {
          transform: translateX(-4px);
        }

        .systemStatus {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 99px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.025);
          color: #555;
          font-size: 8px;
          letter-spacing: 1.5px;
        }

        .systemStatus span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow:
            0 0 12px rgba(34, 197, 94, 0.8);
          animation: pulse 2s infinite;
        }

        .hero {
          max-width: 820px;
          margin: 0 auto 70px;
          text-align: center;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #8b7cff;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .eyebrow i {
          display: block;
          width: 35px;
          height: 1px;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(139, 124, 255, 0.7)
            );
        }

        .eyebrow i:last-child {
          background:
            linear-gradient(
              90deg,
              rgba(139, 124, 255, 0.7),
              transparent
            );
        }

        .hero h1 {
          margin: 22px 0;
          font-size: clamp(60px, 10vw, 105px);
          line-height: 0.86;
          letter-spacing: -7px;
          font-weight: 900;
        }

        .hero h1 span {
          background:
            linear-gradient(
              100deg,
              #fff,
              #a78bfa 48%,
              #67e8f9
            );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow:
            0 0 50px rgba(124, 58, 237, 0.12);
        }

        .hero > p {
          max-width: 620px;
          margin: auto;
          color: #737783;
          font-size: 14px;
          line-height: 1.9;
        }

        .heroStats {
          display: inline-flex;
          align-items: center;
          margin-top: 32px;
          padding: 11px 18px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background:
            linear-gradient(
              135deg,
              rgba(124, 58, 237, 0.06),
              rgba(255, 255, 255, 0.02)
            );
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.04),
            0 15px 40px rgba(0, 0, 0, 0.18);
        }

        .heroStats div {
          padding: 0 20px;
          text-align: center;
        }

        .heroStats div span {
          display: block;
          margin-bottom: 5px;
          color: #444;
          font-size: 7px;
          letter-spacing: 2px;
        }

        .heroStats div strong {
          font-size: 10px;
          letter-spacing: 1px;
        }

        .heroStats .live {
          color: #86efac;
        }

        .heroStats > b {
          width: 1px;
          height: 27px;
          background: rgba(255, 255, 255, 0.07);
        }

        .progressCard {
          position: relative;
          padding: 25px;
          margin-bottom: 75px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 22px;
          background:
            linear-gradient(
              135deg,
              rgba(124, 58, 237, 0.08),
              rgba(255, 255, 255, 0.02)
            );
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .progressTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }

        .sectionEyebrow {
          color: #7064c9;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .progressTop h2 {
          margin: 7px 0 0;
          font-size: 21px;
        }

        .percent {
          font-size: 38px;
          font-weight: 900;
          background:
            linear-gradient(
              90deg,
              #a78bfa,
              #67e8f9
            );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .percent span {
          font-size: 17px;
        }

        .progressTrack {
          position: relative;
          height: 9px;
          overflow: hidden;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.06);
        }

        .progressValue {
          position: relative;
          width: 50%;
          height: 100%;
          border-radius: 99px;
          background:
            linear-gradient(
              90deg,
              #7c3aed,
              #2563eb,
              #06b6d4
            );
          box-shadow:
            0 0 25px rgba(124, 58, 237, 0.45);
        }

        .progressGlow {
          position: absolute;
          top: 0;
          right: 0;
          width: 80px;
          height: 100%;
          background: rgba(255, 255, 255, 0.4);
          filter: blur(8px);
          animation: progressMove 2.5s infinite;
        }

        .progressLabels {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          margin-top: 11px;
          color: #3f4048;
          font-size: 7px;
          letter-spacing: 1.5px;
        }

        .progressLabels span:nth-child(2),
        .progressLabels .done {
          color: #7167c7;
        }

        .progressLabels span:nth-child(2) {
          text-align: center;
        }

        .progressLabels span:nth-child(3) {
          text-align: center;
        }

        .progressLabels span:last-child {
          text-align: right;
        }

        .timelineSection {
          margin-top: 10px;
        }

        .sectionHeader {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 30px;
        }

        .sectionHeader h2 {
          margin: 8px 0 0;
          font-size: 29px;
          letter-spacing: -0.8px;
        }

        .sectionHeader h2 span {
          color: #a78bfa;
        }

        .phaseCounter {
          color: #3d3e47;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .timeline {
          position: relative;
        }

        .timelineLine {
          position: absolute;
          top: 30px;
          bottom: 35px;
          left: 29px;
          width: 1px;
          background:
            linear-gradient(
              to bottom,
              rgba(124, 58, 237, 0.5),
              rgba(255, 255, 255, 0.05),
              transparent
            );
        }

        .timelineProgress {
          width: 100%;
          height: 43%;
          background:
            linear-gradient(
              to bottom,
              #7c3aed,
              #06b6d4
            );
          box-shadow:
            0 0 12px rgba(124, 58, 237, 0.5);
        }

        .phase {
          position: relative;
          display: grid;
          grid-template-columns: 60px minmax(0, 1fr);
          gap: 18px;
          margin-bottom: 20px;
        }

        .markerColumn {
          position: relative;
          z-index: 3;
          display: flex;
          justify-content: center;
        }

        .marker {
          width: 60px;
          height: 60px;
          display: grid;
          place-items: center;
          border-radius: 20px;
          border: 1px solid rgba(124, 58, 237, 0.18);
          background:
            linear-gradient(
              145deg,
              rgba(124, 58, 237, 0.18),
              rgba(255, 255, 255, 0.025)
            );
          color: #7669ce;
          font-size: 11px;
          font-weight: 900;
          box-shadow:
            0 10px 30px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          transition: 0.3s;
        }

        .completedPhase .marker {
          background:
            linear-gradient(
              145deg,
              #7c3aed,
              #2563eb
            );
          color: white;
          box-shadow:
            0 0 30px rgba(124, 58, 237, 0.28);
        }

        .activePhase .marker {
          border-color: rgba(103, 232, 249, 0.35);
          background:
            linear-gradient(
              145deg,
              rgba(124, 58, 237, 0.35),
              rgba(6, 182, 212, 0.2)
            );
          color: #67e8f9;
          box-shadow:
            0 0 35px rgba(6, 182, 212, 0.12);
          animation: markerPulse 2.5s infinite;
        }

        .phaseCard {
          position: relative;
          min-height: 235px;
          padding: 26px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.065);
          border-radius: 22px;
          background:
            linear-gradient(
              120deg,
              rgba(255, 255, 255, 0.04),
              rgba(255, 255, 255, 0.018)
            );
          backdrop-filter: blur(18px);
          transition:
            transform 0.3s,
            border-color 0.3s,
            box-shadow 0.3s;
        }

        .phaseCard:hover {
          transform: translateX(5px);
          border-color: rgba(124, 58, 237, 0.22);
          box-shadow:
            0 20px 55px rgba(0, 0, 0, 0.25),
            0 0 35px rgba(124, 58, 237, 0.05);
        }

        .activePhase .phaseCard {
          border-color: rgba(124, 58, 237, 0.2);
          box-shadow:
            0 0 45px rgba(124, 58, 237, 0.055);
        }

        .phaseCard::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 22px;
          pointer-events: none;
          background:
            linear-gradient(
              120deg,
              rgba(124, 58, 237, 0.07),
              transparent 45%
            );
        }

        .phaseGlow {
          position: absolute;
          width: 220px;
          height: 220px;
          right: -100px;
          top: -100px;
          border-radius: 50%;
          background: rgba(124, 58, 237, 0.1);
          filter: blur(40px);
          pointer-events: none;
        }

        .phaseTop {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .phaseNumber {
          color: #53545e;
          font-size: 7px;
          letter-spacing: 3px;
          font-weight: 800;
        }

        .phaseTop h3 {
          margin: 8px 0 0;
          font-size: 26px;
          letter-spacing: -0.5px;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 10px;
          border-radius: 99px;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 1.2px;
        }

        .badge span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }

        .completed {
          color: #75a083;
          background: rgba(34, 197, 94, 0.05);
          border: 1px solid rgba(34, 197, 94, 0.1);
        }

        .completed span {
          background: #22c55e;
        }

        .liveBadge {
          color: #78aeb7;
          background: rgba(6, 182, 212, 0.05);
          border: 1px solid rgba(6, 182, 212, 0.12);
        }

        .liveBadge span {
          background: #67e8f9;
          box-shadow:
            0 0 10px rgba(103, 232, 249, 0.8);
          animation: pulse 1.5s infinite;
        }

        .upcoming {
          color: #565761;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .upcoming span {
          background: #44454e;
        }

        .description {
          position: relative;
          z-index: 2;
          max-width: 700px;
          margin: 13px 0 19px;
          color: #696a74;
          font-size: 11px;
          line-height: 1.8;
        }

        .features {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 11px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.025);
          color: #62636c;
          font-size: 9px;
          border: 1px solid rgba(255, 255, 255, 0.035);
        }

        .feature span {
          color: #7c3aed;
          font-size: 10px;
        }

        .completedPhase .feature span {
          color: #67e8a0;
        }

        .building {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 15px;
          color: #667f84;
          font-size: 7px;
          letter-spacing: 1.5px;
        }

        .building > span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #67e8f9;
          box-shadow:
            0 0 12px rgba(103, 232, 249, 0.8);
          animation: pulse 1.7s infinite;
        }

        .buildingLine {
          flex: 1;
          height: 2px;
          margin-left: 5px;
          overflow: hidden;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.04);
        }

        .buildingLine i {
          display: block;
          width: 35%;
          height: 100%;
          border-radius: 99px;
          background:
            linear-gradient(
              90deg,
              #7c3aed,
              #67e8f9
            );
          animation: loading 2.2s infinite;
        }

        .upcomingText {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 15px;
          color: #3e3f48;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .upcomingText span {
          color: #6658bd;
        }

        .launchCard {
          position: relative;
          display: flex;
          align-items: center;
          gap: 22px;
          margin-top: 75px;
          padding: 28px;
          overflow: hidden;
          border: 1px solid rgba(124, 58, 237, 0.18);
          border-radius: 24px;
          background:
            linear-gradient(
              110deg,
              rgba(124, 58, 237, 0.1),
              rgba(6, 182, 212, 0.04)
            );
        }

        .launchGlow {
          position: absolute;
          width: 300px;
          height: 180px;
          left: -80px;
          top: -90px;
          border-radius: 50%;
          background: rgba(124, 58, 237, 0.13);
          filter: blur(45px);
        }

        .rocket {
          position: relative;
          z-index: 2;
          width: 68px;
          height: 68px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 21px;
          background:
            linear-gradient(
              145deg,
              rgba(124, 58, 237, 0.28),
              rgba(6, 182, 212, 0.12)
            );
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 32px;
          box-shadow:
            0 15px 35px rgba(124, 58, 237, 0.15);
          transform:
            rotateX(6deg)
            rotateY(-6deg);
        }

        .launchInfo {
          position: relative;
          z-index: 2;
          flex: 1;
        }

        .launchInfo h2 {
          margin: 6px 0 7px;
          font-size: 23px;
        }

        .launchInfo h2 span {
          color: #a78bfa;
        }

        .launchInfo p {
          max-width: 650px;
          margin: 0;
          color: #656670;
          font-size: 10px;
          line-height: 1.8;
        }

        .launchButton {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 15px;
          flex-shrink: 0;
          padding: 14px 17px;
          border-radius: 13px;
          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #2563eb
            );
          color: white;
          text-decoration: none;
          font-size: 9px;
          font-weight: 800;
          box-shadow:
            0 10px 30px rgba(124, 58, 237, 0.22);
          transition: 0.3s;
        }

        .launchButton:hover {
          transform: translateY(-3px);
          box-shadow:
            0 15px 40px rgba(124, 58, 237, 0.35);
        }

        .launchButton b {
          color: #c4b5fd;
          font-size: 15px;
        }

        .explore {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          margin-top: 70px;
          padding: 25px;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 21px;
          background: rgba(255, 255, 255, 0.02);
        }

        .explore h2 {
          margin: 7px 0 0;
          font-size: 19px;
        }

        .explore h2 span {
          color: #a78bfa;
        }

        .exploreLinks {
          display: flex;
          gap: 8px;
        }

        .exploreLinks a {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 11px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.025);
          color: #777;
          text-decoration: none;
          font-size: 9px;
          font-weight: 700;
          transition: 0.25s;
        }

        .exploreLinks a span {
          color: #8b7cff;
        }

        .exploreLinks a b {
          color: #67e8f9;
          font-size: 12px;
        }

        .exploreLinks a:hover {
          color: white;
          transform: translateY(-3px);
          border-color: rgba(124, 58, 237, 0.25);
          background: rgba(124, 58, 237, 0.06);
        }

        footer {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 30px 6%;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          color: #4e4f57;
          font-size: 10px;
        }

        .footerBrand strong {
          display: block;
          color: white;
          font-size: 13px;
          letter-spacing: 4px;
        }

        .footerBrand span {
          display: block;
          margin-top: 4px;
          color: #3f4047;
          font-size: 6px;
          letter-spacing: 2px;
        }

        .footerCode {
          color: #35363e;
          letter-spacing: 1px;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.55;
            transform: scale(0.9);
          }

          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        @keyframes markerPulse {
          0%,
          100% {
            box-shadow:
              0 0 25px rgba(6, 182, 212, 0.08);
          }

          50% {
            box-shadow:
              0 0 40px rgba(6, 182, 212, 0.2);
          }
        }

        @keyframes progressMove {
          0% {
            transform: translateX(-100px);
            opacity: 0;
          }

          30% {
            opacity: 1;
          }

          100% {
            transform: translateX(100px);
            opacity: 0;
          }
        }

        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(300%);
          }
        }

        @media (max-width: 800px) {
          .container {
            padding: 28px 17px 75px;
          }

          .topRow {
            margin-bottom: 50px;
          }

          .hero h1 {
            letter-spacing: -5px;
          }

          .phase {
            grid-template-columns: 45px minmax(0, 1fr);
            gap: 12px;
          }

          .timelineLine {
            left: 22px;
          }

          .marker {
            width: 45px;
            height: 45px;
            border-radius: 15px;
          }

          .phaseCard {
            padding: 21px;
          }

          .launchCard {
            flex-wrap: wrap;
          }

          .launchButton {
            width: 100%;
            justify-content: center;
          }

          .explore {
            flex-direction: column;
            align-items: flex-start;
          }

          .exploreLinks {
            width: 100%;
          }

          .exploreLinks a {
            flex: 1;
            justify-content: center;
          }
        }

        @media (max-width: 560px) {
          .systemStatus {
            display: none;
          }

          .heroStats {
            width: 100%;
            justify-content: center;
          }

          .heroStats div {
            padding: 0 10px;
          }

          .heroStats div span {
            font-size: 6px;
          }

          .heroStats div strong {
            font-size: 8px;
          }

          .progressCard {
            padding: 20px;
          }

          .progressLabels {
            font-size: 5px;
            letter-spacing: 0.7px;
          }

          .sectionHeader h2 {
            font-size: 23px;
          }

          .phaseTop {
            flex-direction: column;
          }

          .badge {
            align-self: flex-start;
          }

          .features {
            grid-template-columns: 1fr;
          }

          .phaseCard {
            min-height: 0;
          }

          .launchCard {
            padding: 20px;
          }

          .rocket {
            width: 58px;
            height: 58px;
            font-size: 27px;
          }

          .launchInfo h2 {
            font-size: 20px;
          }

          .exploreLinks {
            flex-direction: column;
          }

          footer {
            flex-direction: column;
            align-items: flex-start;
            padding: 25px 17px;
          }
        }
      `}</style>
    </main>
  );
}
