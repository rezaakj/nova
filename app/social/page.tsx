"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

const socials = [
  {
    name: "X / Twitter",
    description:
      "Follow NOVA for official announcements, updates and community news.",
    handle: "@NOVAverse12",
    url: "https://x.com/NOVAverse12",
    icon: "𝕏",
    tag: "OFFICIAL",
    number: "01",
  },
  {
    name: "Telegram",
    description:
      "Join the NOVA community and stay updated with the latest news.",
    handle: "@NOVAFOX18",
    url: "https://t.me/NOVAFOX18",
    icon: "✈",
    tag: "COMMUNITY",
    number: "02",
  },
];

export default function SocialPage() {
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

          <div className="status">
            <span className="statusDot" />
            ECOSYSTEM ONLINE
          </div>
        </div>

        <header className="hero">
          <div className="eyebrow">
            <span className="eyebrowLine" />
            NOVA COMMUNITY
            <span className="eyebrowLine" />
          </div>

          <h1>
            Social
            <span> Hub</span>
          </h1>

          <p>
            Connect with NOVA across our official channels,
            follow the journey and become part of the ecosystem.
          </p>

          <div className="heroStats">
            <div className="heroStat">
              <span>CHANNELS</span>
              <strong>02</strong>
            </div>

            <div className="statDivider" />

            <div className="heroStat">
              <span>STATUS</span>
              <strong className="liveText">LIVE</strong>
            </div>

            <div className="statDivider" />

            <div className="heroStat">
              <span>COMMUNITY</span>
              <strong>ACTIVE</strong>
            </div>
          </div>
        </header>

        <section className="section">
          <div className="sectionHeader">
            <div>
              <div className="sectionEyebrow">
                OFFICIAL NETWORK
              </div>

              <h2>Choose your channel.</h2>
            </div>

            <div className="sectionNumber">
              01 / 02
            </div>
          </div>

          <div className="socialGrid">
            {socials.map((social) => (
              <article
                className="socialCard"
                key={social.name}
              >
                <div className="cardGlow" />

                <div className="cardGrid" />

                <div className="cardTop">
                  <div className="iconWrap">
                    <div className="socialIcon">
                      {social.icon}
                    </div>

                    <div className="iconRing" />
                  </div>

                  <div className="cardNumber">
                    {social.number}
                  </div>
                </div>

                <div className="official">
                  <span className="onlineDot" />
                  {social.tag}
                </div>

                <h3>{social.name}</h3>

                <p>{social.description}</p>

                <div className="handle">
                  <span>@</span>
                  {social.handle.replace("@", "")}
                </div>

                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="joinButton"
                >
                  <span>Visit Channel</span>

                  <span className="buttonArrow">
                    ↗
                  </span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="community">
          <div className="communityGlow" />

          <div className="foxOrb">
            <div className="foxInner">🦊</div>
          </div>

          <div className="communityText">
            <div className="sectionEyebrow">
              BUILD WITH NOVA
            </div>

            <h2>
              The community is
              <span> the core.</span>
            </h2>

            <p>
              NOVA is built together. Follow our channels,
              complete community tasks, collect NOVA Points
              and stay close to every important update.
            </p>
          </div>

          <Link
            href="/tasks"
            className="tasksButton"
          >
            <span>Earn NOVA Points</span>
            <b>→</b>
          </Link>
        </section>

        <section className="channels">
          <div className="sectionHeader">
            <div>
              <div className="sectionEyebrow">
                OFFICIAL CHANNELS
              </div>

              <h2>Stay connected.</h2>
            </div>

            <div className="connectionBadge">
              <span />
              CONNECTED
            </div>
          </div>

          <div className="channelList">
            <div className="channelItem">
              <div className="miniIcon xIcon">
                𝕏
              </div>

              <div className="channelInfo">
                <strong>NOVA on X</strong>

                <span>
                  Official announcements & updates
                </span>
              </div>

              <div className="channelHandle">
                @NOVAverse12
              </div>

              <a
                href="https://x.com/NOVAverse12"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open
                <span>↗</span>
              </a>
            </div>

            <div className="channelItem">
              <div className="miniIcon telegramIcon">
                ✈
              </div>

              <div className="channelInfo">
                <strong>NOVA Telegram</strong>

                <span>
                  Community discussions & news
                </span>
              </div>

              <div className="channelHandle">
                @NOVAFOX18
              </div>

              <a
                href="https://t.me/NOVAFOX18"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open
                <span>↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className="bottomCta">
          <div className="ctaLines" />

          <div className="ctaContent">
            <div className="ctaIcon">✦</div>

            <div>
              <div className="sectionEyebrow">
                KEEP EXPLORING
              </div>

              <h2>
                Your NOVA journey
                <span> continues.</span>
              </h2>
            </div>

            <Link
              href="/roadmap"
              className="roadmapButton"
            >
              Explore Roadmap
              <span>↗</span>
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
          NOVA / 2026
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
          pointer-events: none;
          opacity: 0.25;
          background-image:
            linear-gradient(
              rgba(124, 58, 237, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(124, 58, 237, 0.035) 1px,
              transparent 1px
            );
          background-size: 42px 42px;
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 75%
          );
        }

        .ambient {
          position: fixed;
          width: 400px;
          height: 400px;
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
          bottom: -180px;
          left: -150px;
          background: rgba(6, 182, 212, 0.07);
        }

        .container {
          position: relative;
          z-index: 2;
          max-width: 1180px;
          margin: 0 auto;
          padding: 38px 25px 100px;
        }

        .topRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 70px;
        }

        .back {
          display: inline-flex;
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
          font-size: 16px;
          transition: 0.25s;
        }

        .back:hover {
          color: white;
        }

        .back:hover span {
          transform: translateX(-4px);
        }

        .status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.025);
          color: #555;
          font-size: 8px;
          letter-spacing: 1.5px;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .statusDot,
        .onlineDot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow:
            0 0 12px rgba(34, 197, 94, 0.9);
          animation: pulse 2s infinite;
        }

        .hero {
          text-align: center;
          margin: 0 auto 90px;
          max-width: 850px;
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

        .eyebrowLine {
          width: 35px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(139, 124, 255, 0.7)
          );
        }

        .eyebrowLine:last-child {
          background: linear-gradient(
            90deg,
            rgba(139, 124, 255, 0.7),
            transparent
          );
        }

        .hero h1 {
          margin: 20px 0 22px;
          font-size: clamp(58px, 10vw, 105px);
          line-height: 0.88;
          letter-spacing: -7px;
          font-weight: 900;
        }

        .hero h1 span {
          background:
            linear-gradient(
              100deg,
              #ffffff 5%,
              #a78bfa 45%,
              #67e8f9 100%
            );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow:
            0 0 45px rgba(124, 58, 237, 0.15);
        }

        .hero > p {
          max-width: 620px;
          margin: 0 auto;
          color: #737783;
          font-size: 14px;
          line-height: 1.9;
        }

        .heroStats {
          display: inline-flex;
          align-items: center;
          margin-top: 35px;
          padding: 11px 18px;
          border-radius: 15px;
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

        .heroStat {
          padding: 0 20px;
          text-align: center;
        }

        .heroStat span {
          display: block;
          color: #444;
          font-size: 7px;
          letter-spacing: 2px;
          margin-bottom: 5px;
        }

        .heroStat strong {
          font-size: 10px;
          letter-spacing: 1px;
        }

        .liveText {
          color: #86efac;
        }

        .statDivider {
          width: 1px;
          height: 27px;
          background: rgba(255, 255, 255, 0.07);
        }

        .section {
          margin-bottom: 25px;
        }

        .sectionHeader {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .sectionEyebrow {
          color: #7064c9;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .sectionHeader h2 {
          margin: 8px 0 0;
          font-size: 25px;
          letter-spacing: -0.7px;
        }

        .sectionNumber {
          color: #3e3e48;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .socialGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .socialCard {
          position: relative;
          min-height: 380px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 25px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.055),
              rgba(255, 255, 255, 0.018)
            );
          backdrop-filter: blur(20px);
          overflow: hidden;
          transform-style: preserve-3d;
          transition:
            transform 0.35s ease,
            border-color 0.35s ease,
            box-shadow 0.35s ease;
        }

        .socialCard::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 25px;
          padding: 1px;
          background:
            linear-gradient(
              135deg,
              rgba(167, 139, 250, 0.18),
              transparent 35%,
              rgba(103, 232, 249, 0.08)
            );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .socialCard:hover {
          transform:
            translateY(-8px)
            perspective(900px)
            rotateX(1.5deg);
          border-color: rgba(139, 124, 255, 0.25);
          box-shadow:
            0 25px 70px rgba(0, 0, 0, 0.3),
            0 0 45px rgba(124, 58, 237, 0.08);
        }

        .cardGlow {
          position: absolute;
          width: 220px;
          height: 220px;
          top: -110px;
          right: -80px;
          border-radius: 50%;
          background: rgba(124, 58, 237, 0.13);
          filter: blur(35px);
          pointer-events: none;
        }

        .cardGrid {
          position: absolute;
          inset: 0;
          opacity: 0.15;
          background-image:
            linear-gradient(
              rgba(124, 58, 237, 0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(124, 58, 237, 0.08) 1px,
              transparent 1px
            );
          background-size: 25px 25px;
          mask-image: linear-gradient(
            to bottom right,
            black,
            transparent 60%
          );
          pointer-events: none;
        }

        .cardTop {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .iconWrap {
          position: relative;
          width: 68px;
          height: 68px;
          perspective: 500px;
        }

        .socialIcon {
          position: relative;
          z-index: 2;
          width: 60px;
          height: 60px;
          display: grid;
          place-items: center;
          border-radius: 19px;
          background:
            linear-gradient(
              145deg,
              #7c3aed,
              #2563eb
            );
          color: white;
          font-size: 28px;
          font-weight: 900;
          box-shadow:
            0 15px 35px rgba(124, 58, 237, 0.28),
            inset 0 1px 1px rgba(255, 255, 255, 0.35);
          transform:
            rotateX(8deg)
            rotateY(-8deg);
          transition: 0.35s;
        }

        .socialCard:hover .socialIcon {
          transform:
            rotateX(12deg)
            rotateY(-15deg)
            translateY(-4px)
            scale(1.04);
          box-shadow:
            0 20px 45px rgba(124, 58, 237, 0.38),
            0 0 30px rgba(6, 182, 212, 0.12);
        }

        .iconRing {
          position: absolute;
          width: 68px;
          height: 68px;
          top: 0;
          left: 0;
          border-radius: 21px;
          border: 1px solid rgba(103, 232, 249, 0.12);
          transform: rotate(8deg);
        }

        .cardNumber {
          color: #33343d;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .official {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 20px;
          color: #60616b;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .socialCard h3 {
          position: relative;
          z-index: 2;
          margin: 10px 0 10px;
          font-size: 27px;
          letter-spacing: -0.7px;
        }

        .socialCard p {
          position: relative;
          z-index: 2;
          max-width: 500px;
          margin: 0;
          color: #777985;
          font-size: 12px;
          line-height: 1.8;
        }

        .handle {
          position: relative;
          z-index: 2;
          margin-top: 18px;
          color: #a78bfa;
          font-size: 11px;
          font-weight: 800;
        }

        .handle span {
          color: #67e8f9;
        }

        .joinButton {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding: 14px 16px;
          border: 1px solid rgba(124, 58, 237, 0.2);
          border-radius: 13px;
          background:
            linear-gradient(
              135deg,
              rgba(124, 58, 237, 0.13),
              rgba(37, 99, 235, 0.06)
            );
          color: white;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          overflow: hidden;
          transition: 0.25s;
        }

        .joinButton::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 70%;
          height: 100%;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.13),
              transparent
            );
          transform: skewX(-20deg);
          transition: 0.5s;
        }

        .joinButton:hover {
          border-color: rgba(139, 124, 255, 0.4);
          transform: translateY(-2px);
          box-shadow:
            0 10px 25px rgba(124, 58, 237, 0.15);
        }

        .joinButton:hover::before {
          left: 150%;
        }

        .buttonArrow {
          color: #67e8f9;
          font-size: 17px;
          transition: 0.25s;
        }

        .joinButton:hover .buttonArrow {
          transform: translate(3px, -3px);
        }

        .community {
          position: relative;
          display: flex;
          align-items: center;
          gap: 25px;
          margin-top: 20px;
          padding: 28px;
          border: 1px solid rgba(124, 58, 237, 0.18);
          border-radius: 24px;
          background:
            linear-gradient(
              110deg,
              rgba(124, 58, 237, 0.1),
              rgba(6, 182, 212, 0.045)
            );
          overflow: hidden;
        }

        .communityGlow {
          position: absolute;
          width: 300px;
          height: 180px;
          left: 0;
          top: -90px;
          border-radius: 50%;
          background: rgba(124, 58, 237, 0.1);
          filter: blur(50px);
          pointer-events: none;
        }

        .foxOrb {
          position: relative;
          z-index: 2;
          width: 78px;
          height: 78px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 25px;
          background:
            linear-gradient(
              145deg,
              rgba(124, 58, 237, 0.3),
              rgba(6, 182, 212, 0.15)
            );
          border: 1px solid rgba(255, 255, 255, 0.09);
          box-shadow:
            0 15px 40px rgba(124, 58, 237, 0.15),
            inset 0 1px 1px rgba(255, 255, 255, 0.15);
          transform:
            rotateX(5deg)
            rotateY(-5deg);
        }

        .foxInner {
          font-size: 39px;
          filter:
            drop-shadow(
              0 0 15px rgba(124, 58, 237, 0.45)
            );
        }

        .communityText {
          position: relative;
          z-index: 2;
          flex: 1;
        }

        .communityText h2 {
          margin: 7px 0;
          font-size: 22px;
        }

        .communityText h2 span {
          color: #a78bfa;
        }

        .communityText p {
          max-width: 650px;
          margin: 0;
          color: #70717b;
          font-size: 11px;
          line-height: 1.8;
        }

        .tasksButton {
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
          font-size: 10px;
          font-weight: 800;
          box-shadow:
            0 10px 30px rgba(124, 58, 237, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: 0.3s;
        }

        .tasksButton:hover {
          transform: translateY(-3px);
          box-shadow:
            0 15px 40px rgba(124, 58, 237, 0.35);
        }

        .tasksButton b {
          color: #c4b5fd;
          font-size: 15px;
        }

        .channels {
          margin-top: 75px;
        }

        .connectionBadge {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 10px;
          border-radius: 99px;
          background: rgba(34, 197, 94, 0.05);
          border: 1px solid rgba(34, 197, 94, 0.1);
          color: #4d795a;
          font-size: 7px;
          letter-spacing: 1.5px;
          font-weight: 800;
        }

        .connectionBadge span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 9px rgba(34, 197, 94, 0.8);
        }

        .channelList {
          display: grid;
          gap: 10px;
        }

        .channelItem {
          position: relative;
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          background:
            linear-gradient(
              110deg,
              rgba(255, 255, 255, 0.035),
              rgba(255, 255, 255, 0.018)
            );
          transition: 0.25s;
        }

        .channelItem:hover {
          transform: translateX(4px);
          border-color: rgba(124, 58, 237, 0.2);
          background: rgba(124, 58, 237, 0.045);
        }

        .miniIcon {
          width: 45px;
          height: 45px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 13px;
          font-size: 19px;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .xIcon {
          background: rgba(255, 255, 255, 0.05);
        }

        .telegramIcon {
          background:
            linear-gradient(
              135deg,
              rgba(124, 58, 237, 0.16),
              rgba(6, 182, 212, 0.1)
            );
        }

        .channelInfo {
          flex: 1;
        }

        .channelInfo strong {
          display: block;
          font-size: 12px;
        }

        .channelInfo span {
          display: block;
          margin-top: 4px;
          color: #5d5e67;
          font-size: 9px;
        }

        .channelHandle {
          color: #5e5f69;
          font-size: 9px;
        }

        .channelItem a {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          border: 1px solid rgba(124, 58, 237, 0.13);
          border-radius: 10px;
          background: rgba(124, 58, 237, 0.06);
          color: #a78bfa;
          text-decoration: none;
          font-size: 9px;
          font-weight: 800;
          transition: 0.2s;
        }

        .channelItem a:hover {
          color: white;
          background: rgba(124, 58, 237, 0.14);
        }

        .channelItem a span {
          font-size: 14px;
        }

        .bottomCta {
          position: relative;
          margin-top: 75px;
          padding: 1px;
          border-radius: 23px;
          overflow: hidden;
          background:
            linear-gradient(
              110deg,
              rgba(124, 58, 237, 0.3),
              rgba(6, 182, 212, 0.15),
              rgba(124, 58, 237, 0.05)
            );
        }

        .ctaLines {
          position: absolute;
          inset: 0;
          opacity: 0.3;
          background-image:
            linear-gradient(
              rgba(124, 58, 237, 0.12) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(124, 58, 237, 0.12) 1px,
              transparent 1px
            );
          background-size: 28px 28px;
        }

        .ctaContent {
          position: relative;
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 27px;
          border-radius: 22px;
          background: #080910;
        }

        .ctaIcon {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 15px;
          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #2563eb
            );
          font-size: 20px;
          box-shadow:
            0 0 30px rgba(124, 58, 237, 0.25);
        }

        .ctaContent > div:nth-child(2) {
          flex: 1;
        }

        .ctaContent h2 {
          margin: 6px 0 0;
          font-size: 19px;
        }

        .ctaContent h2 span {
          color: #a78bfa;
        }

        .roadmapButton {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 15px;
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.045);
          border: 1px solid rgba(255, 255, 255, 0.07);
          color: white;
          text-decoration: none;
          font-size: 10px;
          font-weight: 800;
          transition: 0.25s;
        }

        .roadmapButton:hover {
          transform: translateY(-2px);
          border-color: rgba(124, 58, 237, 0.3);
          background: rgba(124, 58, 237, 0.08);
        }

        .roadmapButton span {
          color: #67e8f9;
          font-size: 14px;
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
            opacity: 0.6;
            transform: scale(0.9);
          }

          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        @media (max-width: 800px) {
          .container {
            padding: 28px 17px 75px;
          }

          .topRow {
            margin-bottom: 50px;
          }

          .hero {
            margin-bottom: 65px;
          }

          .hero h1 {
            letter-spacing: -5px;
          }

          .socialGrid {
            grid-template-columns: 1fr;
          }

          .socialCard {
            min-height: 350px;
          }

          .community {
            flex-direction: column;
            align-items: flex-start;
          }

          .tasksButton {
            width: 100%;
            justify-content: space-between;
          }

          .channelHandle {
            display: none;
          }

          .ctaContent {
            flex-wrap: wrap;
          }

          .roadmapButton {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 500px) {
          .status {
            display: none;
          }

          .heroStats {
            width: 100%;
            justify-content: center;
          }

          .heroStat {
            padding: 0 10px;
          }

          .heroStat span {
            font-size: 6px;
          }

          .heroStat strong {
            font-size: 8px;
          }

          .statDivider {
            height: 22px;
          }

          .sectionHeader h2 {
            font-size: 21px;
          }

          .socialCard {
            padding: 23px;
            min-height: 350px;
          }

          .community {
            padding: 23px;
          }

          .channelItem {
            padding: 12px;
          }

          .channelInfo span {
            display: none;
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
