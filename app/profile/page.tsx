"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";

type Profile = {
  id: string;
  email: string | null;
  username: string | null;
  points: number;
};

export default function ProfilePage() {
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,username,points")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error(error);
      setMessage("Could not load your NOVA profile.");
    } else if (data) {
      setProfile(data as Profile);
    }

    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <main className="loadingPage">
        <div className="loadingOrb">🦊</div>
        <strong>NOVA</strong>
        <span>LOADING PROFILE...</span>

        <style jsx>{`
          .loadingPage {
            min-height: 100vh;
            display: grid;
            place-items: center;
            align-content: center;
            background: #05060a;
            color: white;
          }

          .loadingOrb {
            width: 85px;
            height: 85px;
            display: grid;
            place-items: center;
            border-radius: 26px;
            background:
              linear-gradient(
                145deg,
                #7c3aed,
                #06b6d4
              );
            font-size: 40px;
            box-shadow:
              0 0 60px rgba(124, 58, 237, 0.35);
            animation: float 2s ease-in-out infinite;
          }

          .loadingPage strong {
            margin-top: 22px;
            font-size: 22px;
            letter-spacing: 7px;
          }

          .loadingPage > span {
            margin-top: 8px;
            color: #555;
            font-size: 8px;
            letter-spacing: 3px;
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-8px);
            }
          }
        `}</style>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="guestPage">
        <Navbar />

        <div className="guestGlow" />

        <section className="guestContent">
          <div className="guestFox">🦊</div>

          <div className="eyebrow">
            NOVA PROFILE
          </div>

          <h1>
            Login
            <span> Required.</span>
          </h1>

          <p>
            Login to access your NOVA profile,
            points and ecosystem progress.
          </p>

          {message && (
            <div className="error">
              {message}
            </div>
          )}

          <Link
            href="/"
            className="loginButton"
          >
            Login to NOVA
            <span>↗</span>
          </Link>
        </section>

        <style jsx>{`
          .guestPage {
            position: relative;
            min-height: 100vh;
            overflow: hidden;
            background:
              radial-gradient(
                circle at 50% 10%,
                rgba(124, 58, 237, 0.18),
                transparent 35%
              ),
              #05060a;
            color: white;
          }

          .guestGlow {
            position: fixed;
            width: 400px;
            height: 400px;
            top: 15%;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 50%;
            background: rgba(124, 58, 237, 0.08);
            filter: blur(100px);
            pointer-events: none;
          }

          .guestContent {
            position: relative;
            z-index: 2;
            max-width: 600px;
            margin: auto;
            padding: 100px 20px;
            text-align: center;
          }

          .guestFox {
            width: 100px;
            height: 100px;
            display: grid;
            place-items: center;
            margin: 0 auto 25px;
            border-radius: 30px;
            background:
              linear-gradient(
                145deg,
                rgba(124, 58, 237, 0.3),
                rgba(6, 182, 212, 0.12)
              );
            border: 1px solid rgba(255, 255, 255, 0.08);
            font-size: 50px;
            box-shadow:
              0 0 55px rgba(124, 58, 237, 0.22);
          }

          .eyebrow {
            color: #8b7cff;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 4px;
          }

          h1 {
            margin: 17px 0;
            font-size: clamp(45px, 8vw, 75px);
            line-height: 0.9;
            letter-spacing: -4px;
            font-weight: 900;
          }

          h1 span {
            background:
              linear-gradient(
                90deg,
                #fff,
                #a78bfa,
                #67e8f9
              );
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          .guestContent p {
            max-width: 470px;
            margin: auto;
            color: #70717b;
            font-size: 13px;
            line-height: 1.9;
          }

          .error {
            margin: 20px auto 0;
            padding: 11px 15px;
            border-radius: 11px;
            background: rgba(248, 113, 113, 0.05);
            border: 1px solid rgba(248, 113, 113, 0.12);
            color: #9b7373;
            font-size: 10px;
          }

          .loginButton {
            display: inline-flex;
            align-items: center;
            gap: 15px;
            margin-top: 28px;
            padding: 14px 20px;
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
              0 12px 35px rgba(124, 58, 237, 0.25);
            transition: 0.3s;
          }

          .loginButton:hover {
            transform: translateY(-3px);
            box-shadow:
              0 18px 45px rgba(124, 58, 237, 0.35);
          }

          .loginButton span {
            color: #c4b5fd;
            font-size: 15px;
          }
        `}</style>
      </main>
    );
  }

  const points = Number(profile.points || 0);

  let level = 1;
  let nextLevel = 100;
  let previousLevel = 0;

  if (points >= 2500) {
    level = 4;
    nextLevel = 2500;
    previousLevel = 1000;
  } else if (points >= 1000) {
    level = 4;
    nextLevel = 2500;
    previousLevel = 1000;
  } else if (points >= 500) {
    level = 3;
    nextLevel = 1000;
    previousLevel = 500;
  } else if (points >= 100) {
    level = 2;
    nextLevel = 500;
    previousLevel = 100;
  }

  let progress = 0;

  if (points >= 2500) {
    progress = 100;
  } else {
    const range = nextLevel - previousLevel;

    if (range > 0) {
      progress =
        ((points - previousLevel) / range) * 100;
    }

    progress = Math.max(
      0,
      Math.min(100, progress)
    );
  }

  const username =
    profile.username ||
    profile.email?.split("@")[0] ||
    "NOVA User";

  const isMaxLevel = points >= 2500;

  const nextLevelText = isMaxLevel
    ? "MAX LEVEL"
    : `${nextLevel.toLocaleString()} POINTS`;

  const pointsRemaining = Math.max(
    0,
    nextLevel - points
  );

  const remainingText = isMaxLevel
    ? "You reached the current NOVA level cap."
    : `${pointsRemaining.toLocaleString()} more points to reach V${level + 1}.`;

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
            <span />
            MEMBER SYSTEM ONLINE
          </div>
        </div>

        <header className="hero">
          <div className="eyebrow">
            <i />
            NOVA MEMBER AREA
            <i />
          </div>

          <h1>
            Your
            <span> Profile.</span>
          </h1>

          <p>
            Track your NOVA journey, points,
            level and ecosystem progress.
          </p>
        </header>

        {message && (
          <div className="message">
            <span>!</span>
            {message}
          </div>
        )}

        <section className="profileGrid">
          <div className="profileCard">
            <div className="cardGlow" />

            <div className="avatar">
              🦊
            </div>

            <div className="memberInfo">
              <div className="smallLabel">
                NOVA MEMBER
              </div>

              <h2>{username}</h2>

              <p>{profile.email}</p>

              <div className="memberBadge">
                <span />
                ACTIVE MEMBER
              </div>
            </div>

            <div className="cardNumber">
              MEMBER / 01
            </div>
          </div>

          <div className="levelCard">
            <div className="smallLabel">
              CURRENT LEVEL
            </div>

            <div className="level">
              V{level}
            </div>

            <div className="levelName">
              NOVA Explorer
            </div>

            <div className="levelLine">
              <span />
            </div>

            <div className="levelStatus">
              {isMaxLevel
                ? "MAXIMUM LEVEL"
                : `NEXT: V${level + 1}`}
            </div>
          </div>
        </section>

        <section className="pointsCard">
          <div className="pointsTop">
            <div>
              <div className="smallLabel">
                NOVA POINTS
              </div>

              <div className="points">
                {points.toLocaleString()}
              </div>
            </div>

            <div className="activeBadge">
              <span />
              ACTIVE
            </div>
          </div>

          <div className="progressMeta">
            <span>
              LEVEL V{level}
            </span>

            <span>
              {nextLevelText}
            </span>
          </div>

          <div className="progressTrack">
            <div
              className="progressValue"
              style={{
                width: `${progress}%`,
              }}
            >
              <i />
            </div>
          </div>

          <div className="progressBottom">
            <span>
              {Math.round(progress)}% COMPLETE
            </span>

            <span>
              {remainingText}
            </span>
          </div>
        </section>

        <section className="statsGrid">
          <div className="statCard">
            <div className="statIcon">
              ◆
            </div>

            <span>POINT BALANCE</span>

            <strong>
              {points.toLocaleString()}
            </strong>

            <small>NOVA POINTS</small>
          </div>

          <div className="statCard">
            <div className="statIcon fox">
              🦊
            </div>

            <span>MEMBER STATUS</span>

            <strong className="green">
              ACTIVE
            </strong>

            <small>ECOSYSTEM MEMBER</small>
          </div>

          <div className="statCard">
            <div className="statIcon rocket">
              🚀
            </div>

            <span>NEXT MILESTONE</span>

            <strong>
              TOKEN
            </strong>

            <small>LAUNCH</small>
          </div>
        </section>

        <section className="quickSection">
          <div className="sectionHeader">
            <div>
              <div className="smallLabel">
                QUICK ACCESS
              </div>

              <h2>
                Explore NOVA.
              </h2>
            </div>

            <div className="sectionCode">
              04 MODULES
            </div>
          </div>

          <div className="quickGrid">
            <Link href="/tasks">
              <div className="quickIcon">
                ✦
              </div>

              <div>
                <strong>Tasks</strong>
                <span>Earn NOVA Points</span>
              </div>

              <b>↗</b>
            </Link>

            <Link href="/social">
              <div className="quickIcon">
                ◎
              </div>

              <div>
                <strong>Social</strong>
                <span>Join the community</span>
              </div>

              <b>↗</b>
            </Link>

            <Link href="/roadmap">
              <div className="quickIcon">
                ◈
              </div>

              <div>
                <strong>Roadmap</strong>
                <span>Explore the journey</span>
              </div>

              <b>↗</b>
            </Link>

            <Link href="/launch">
              <div className="quickIcon">
                🚀
              </div>

              <div>
                <strong>Launch</strong>
                <span>View countdown</span>
              </div>

              <b>↗</b>
            </Link>
          </div>
        </section>

        <section className="journeyCard">
          <div className="journeyGlow" />

          <div className="journeyFox">
            🦊
          </div>

          <div className="journeyText">
            <div className="smallLabel">
              KEEP BUILDING
            </div>

            <h2>
              Your NOVA journey
              <span> continues.</span>
            </h2>

            <p>
              Complete more missions, collect Points
              and stay connected with the ecosystem.
            </p>
          </div>

          <Link
            href="/tasks"
            className="journeyButton"
          >
            Earn More Points
            <span>↗</span>
          </Link>
        </section>

        <div className="logoutWrap">
          <button
            onClick={logout}
            className="logout"
          >
            <span>↪</span>
            Logout from NOVA
          </button>
        </div>
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
          PROFILE / 2026
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
          width: 420px;
          height: 420px;
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
          left: -160px;
          background: rgba(6, 182, 212, 0.07);
        }

        .container {
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: auto;
          padding: 38px 25px 100px;
        }

        .topRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 55px;
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
          border-radius: 99px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.025);
          color: #555;
          font-size: 8px;
          letter-spacing: 1.5px;
        }

        .status span,
        .memberBadge span,
        .activeBadge span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow:
            0 0 10px rgba(34, 197, 94, 0.8);
        }

        .hero {
          max-width: 800px;
          margin: auto;
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
          margin: 20px 0;
          font-size: clamp(58px, 10vw, 100px);
          line-height: 0.88;
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
        }

        .hero p {
          max-width: 600px;
          margin: auto;
          color: #737783;
          font-size: 14px;
          line-height: 1.9;
        }

        .message {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 30px auto -10px;
          max-width: 700px;
          padding: 11px 14px;
          border-radius: 11px;
          background: rgba(248, 113, 113, 0.045);
          border: 1px solid rgba(248, 113, 113, 0.12);
          color: #9b7373;
          font-size: 9px;
        }

        .message span {
          color: #f87171;
        }

        .profileGrid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 280px;
          gap: 16px;
          margin-top: 55px;
        }

        .profileCard,
        .levelCard,
        .pointsCard,
        .statCard,
        .quickSection,
        .journeyCard {
          border: 1px solid rgba(255, 255, 255, 0.07);
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.045),
              rgba(255, 255, 255, 0.018)
            );
          backdrop-filter: blur(18px);
        }

        .profileCard {
          position: relative;
          min-height: 220px;
          display: flex;
          align-items: center;
          gap: 22px;
          padding: 30px;
          border-radius: 24px;
          overflow: hidden;
        }

        .profileCard::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              110deg,
              rgba(124, 58, 237, 0.1),
              transparent 55%
            );
          pointer-events: none;
        }

        .cardGlow {
          position: absolute;
          width: 240px;
          height: 240px;
          top: -120px;
          right: -70px;
          border-radius: 50%;
          background: rgba(124, 58, 237, 0.13);
          filter: blur(45px);
        }

        .avatar {
          position: relative;
          z-index: 2;
          width: 92px;
          height: 92px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 28px;
          background:
            linear-gradient(
              145deg,
              #7c3aed,
              #06b6d4
            );
          font-size: 45px;
          box-shadow:
            0 15px 40px rgba(124, 58, 237, 0.3),
            inset 0 1px 1px rgba(255, 255, 255, 0.25);
          transform:
            perspective(500px)
            rotateX(5deg)
            rotateY(-5deg);
        }

        .memberInfo {
          position: relative;
          z-index: 2;
        }

        .smallLabel {
          color: #7064c9;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .memberInfo h2 {
          margin: 7px 0 5px;
          font-size: 28px;
        }

        .memberInfo p {
          margin: 0;
          color: #666872;
          font-size: 11px;
        }

        .memberBadge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 13px;
          padding: 6px 9px;
          border-radius: 99px;
          background: rgba(34, 197, 94, 0.04);
          border: 1px solid rgba(34, 197, 94, 0.08);
          color: #688b72;
          font-size: 7px;
          letter-spacing: 1px;
          font-weight: 800;
        }

        .cardNumber {
          position: absolute;
          right: 20px;
          bottom: 18px;
          color: #303139;
          font-size: 7px;
          letter-spacing: 2px;
        }

        .levelCard {
          min-height: 220px;
          padding: 30px;
          border-radius: 24px;
          text-align: center;
        }

        .level {
          margin-top: 10px;
          font-size: 58px;
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
          text-shadow:
            0 0 35px rgba(124, 58, 237, 0.15);
        }

        .levelName {
          color: #70717b;
          font-size: 10px;
        }

        .levelLine {
          height: 4px;
          margin-top: 18px;
          overflow: hidden;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.06);
        }

        .levelLine span {
          display: block;
          width: 65%;
          height: 100%;
          border-radius: 99px;
          background:
            linear-gradient(
              90deg,
              #7c3aed,
              #06b6d4
            );
        }

        .levelStatus {
          margin-top: 11px;
          color: #44454e;
          font-size: 7px;
          letter-spacing: 2px;
        }

        .pointsCard {
          margin-top: 16px;
          padding: 28px;
          border-radius: 24px;
        }

        .pointsTop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .points {
          margin-top: 6px;
          font-size: 46px;
          font-weight: 900;
          background:
            linear-gradient(
              90deg,
              #fff,
              #a78bfa,
              #67e8f9
            );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .activeBadge {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 10px;
          border-radius: 99px;
          background: rgba(34, 197, 94, 0.045);
          border: 1px solid rgba(34, 197, 94, 0.08);
          color: #64856c;
          font-size: 7px;
          letter-spacing: 1.5px;
          font-weight: 800;
        }

        .progressMeta {
          display: flex;
          justify-content: space-between;
          margin-top: 25px;
          color: #5b5c65;
          font-size: 8px;
          letter-spacing: 1px;
        }

        .progressTrack {
          position: relative;
          height: 9px;
          margin-top: 9px;
          overflow: hidden;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.06);
        }

        .progressValue {
          position: relative;
          height: 100%;
          min-width: 0;
          border-radius: 99px;
          background:
            linear-gradient(
              90deg,
              #7c3aed,
              #2563eb,
              #06b6d4
            );
          box-shadow:
            0 0 25px rgba(124, 58, 237, 0.4);
          transition: width 0.6s ease;
        }

        .progressValue i {
          position: absolute;
          right: 0;
          top: 0;
          width: 70px;
          height: 100%;
          background: rgba(255, 255, 255, 0.4);
          filter: blur(8px);
        }

        .progressBottom {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          margin-top: 10px;
          color: #45464f;
          font-size: 8px;
        }

        .statsGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 16px;
        }

        .statCard {
          min-height: 175px;
          padding: 23px;
          border-radius: 20px;
          transition: 0.3s;
        }

        .statCard:hover {
          transform: translateY(-5px);
          border-color: rgba(124, 58, 237, 0.2);
          box-shadow:
            0 18px 45px rgba(0, 0, 0, 0.22);
        }

        .statIcon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          margin-bottom: 18px;
          border-radius: 13px;
          background:
            linear-gradient(
              135deg,
              rgba(124, 58, 237, 0.18),
              rgba(6, 182, 212, 0.08)
            );
          color: #a78bfa;
          font-size: 17px;
        }

        .statIcon.fox {
          font-size: 22px;
        }

        .statIcon.rocket {
          font-size: 20px;
        }

        .statCard > span {
          display: block;
          color: #555660;
          font-size: 7px;
          letter-spacing: 1.7px;
        }

        .statCard strong {
          display: block;
          margin-top: 7px;
          font-size: 20px;
        }

        .statCard strong.green {
          color: #86efac;
        }

        .statCard small {
          display: block;
          margin-top: 5px;
          color: #393a42;
          font-size: 6px;
          letter-spacing: 1px;
        }

        .quickSection {
          margin-top: 70px;
          padding: 25px;
          border-radius: 22px;
        }

        .sectionHeader {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .sectionHeader h2 {
          margin: 7px 0 0;
          font-size: 24px;
        }

        .sectionCode {
          color: #3d3e47;
          font-size: 8px;
          letter-spacing: 2px;
        }

        .quickGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .quickGrid a {
          display: flex;
          align-items: center;
          gap: 11px;
          min-height: 70px;
          padding: 11px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.055);
          background: rgba(255, 255, 255, 0.02);
          color: white;
          text-decoration: none;
          transition: 0.25s;
        }

        .quickGrid a:hover {
          transform: translateY(-4px);
          border-color: rgba(124, 58, 237, 0.25);
          background: rgba(124, 58, 237, 0.055);
        }

        .quickIcon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 12px;
          background:
            linear-gradient(
              135deg,
              rgba(124, 58, 237, 0.16),
              rgba(6, 182, 212, 0.07)
            );
          color: #a78bfa;
          font-size: 16px;
        }

        .quickGrid a div:nth-child(2) {
          min-width: 0;
          flex: 1;
        }

        .quickGrid strong {
          display: block;
          font-size: 10px;
        }

        .quickGrid a div:nth-child(2) span {
          display: block;
          margin-top: 4px;
          color: #51525b;
          font-size: 7px;
        }

        .quickGrid b {
          color: #67e8f9;
          font-size: 14px;
        }

        .journeyCard {
          position: relative;
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 18px;
          padding: 25px;
          border-radius: 22px;
          overflow: hidden;
          background:
            linear-gradient(
              110deg,
              rgba(124, 58, 237, 0.09),
              rgba(6, 182, 212, 0.035)
            );
        }

        .journeyGlow {
          position: absolute;
          width: 260px;
          height: 180px;
          left: -80px;
          top: -90px;
          border-radius: 50%;
          background: rgba(124, 58, 237, 0.12);
          filter: blur(45px);
        }

        .journeyFox {
          position: relative;
          z-index: 2;
          width: 65px;
          height: 65px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 20px;
          background:
            linear-gradient(
              145deg,
              rgba(124, 58, 237, 0.25),
              rgba(6, 182, 212, 0.1)
            );
          font-size: 31px;
          box-shadow:
            0 12px 30px rgba(124, 58, 237, 0.15);
        }

        .journeyText {
          position: relative;
          z-index: 2;
          flex: 1;
        }

        .journeyText h2 {
          margin: 6px 0;
          font-size: 19px;
        }

        .journeyText h2 span {
          color: #a78bfa;
        }

        .journeyText p {
          margin: 0;
          color: #5f6069;
          font-size: 9px;
          line-height: 1.7;
        }

        .journeyButton {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 13px;
          flex-shrink: 0;
          padding: 13px 16px;
          border-radius: 12px;
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
            0 10px 28px rgba(124, 58, 237, 0.22);
          transition: 0.25s;
        }

        .journeyButton:hover {
          transform: translateY(-3px);
          box-shadow:
            0 15px 35px rgba(124, 58, 237, 0.35);
        }

        .journeyButton span {
          color: #c4b5fd;
          font-size: 14px;
        }

        .logoutWrap {
          display: flex;
          justify-content: center;
          margin-top: 32px;
        }

        .logout {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 11px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(255, 255, 255, 0.02);
          color: #666;
          font-size: 9px;
          cursor: pointer;
          transition: 0.25s;
        }

        .logout:hover {
          color: white;
          border-color: rgba(248, 113, 113, 0.2);
          background: rgba(248, 113, 113, 0.045);
        }

        .logout span {
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

        @media (max-width: 850px) {
          .container {
            padding: 28px 17px 75px;
          }

          .profileGrid {
            grid-template-columns: 1fr;
          }

          .statsGrid {
            grid-template-columns: 1fr;
          }

          .quickGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .journeyCard {
            flex-wrap: wrap;
          }

          .journeyButton {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 560px) {
          .status {
            display: none;
          }

          .hero h1 {
            letter-spacing: -5px;
          }

          .profileCard {
            min-height: 190px;
            padding: 21px;
            gap: 15px;
          }

          .avatar {
            width: 70px;
            height: 70px;
            border-radius: 21px;
            font-size: 34px;
          }

          .memberInfo h2 {
            font-size: 21px;
          }

          .memberInfo p {
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .levelCard {
            min-height: 190px;
          }

          .pointsCard {
            padding: 21px;
          }

          .points {
            font-size: 36px;
          }

          .progressBottom {
            flex-direction: column;
            gap: 5px;
          }

          .quickSection {
            padding: 20px;
          }

          .quickGrid {
            grid-template-columns: 1fr;
          }

          .sectionCode {
            display: none;
          }

          .journeyCard {
            padding: 20px;
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
