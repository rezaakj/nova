"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Leader = {
  id: string;
  username: string | null;
  points: number;
};

type CurrentUser = {
  id: string;
  username: string | null;
  points: number;
};

function getLevel(points: number) {
  if (points >= 2500) return "V4";
  if (points >= 1500) return "V3";
  if (points >= 750) return "V2";
  return "V1";
}

function getLevelProgress(points: number) {
  if (points >= 2500) return 100;

  if (points >= 1500) {
    return ((points - 1500) / 1000) * 100;
  }

  if (points >= 750) {
    return ((points - 750) / 750) * 100;
  }

  return (points / 750) * 100;
}

function getInitial(username: string | null) {
  if (!username) return "N";

  return username.charAt(0).toUpperCase();
}

function formatPoints(points: number) {
  return points.toLocaleString("en-US");
}

function PodiumCard({
  leader,
  rank,
}: {
  leader: Leader | undefined;
  rank: 1 | 2 | 3;
}) {
  if (!leader) {
    return (
      <div className={`podium-card empty rank-${rank}`}>
        <div className="empty-icon">?</div>
        <div className="empty-title">EMPTY SLOT</div>
        <div className="empty-text">Be the first legend.</div>
      </div>
    );
  }

  const level = getLevel(leader.points);

  return (
    <div className={`podium-card rank-${rank}`}>
      {rank === 1 && <div className="crown">♛</div>}

      <div className="rank-number">
        {rank === 1 ? "1ST" : rank === 2 ? "2ND" : "3RD"}
      </div>

      <div className="avatar">
        {getInitial(leader.username)}
      </div>

      <div className="leader-name">
        @{leader.username || "NOVA_USER"}
      </div>

      <div className="leader-level">{level}</div>

      <div className="leader-points">
        {formatPoints(leader.points)}
        <span> XP</span>
      </div>

      <div className="podium-base">
        <span>
          {rank === 1 ? "CHAMPION" : rank === 2 ? "ELITE" : "RISING"}
        </span>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const supabase = useMemo(() => createClient(), []);

  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadLeaderboard() {
    try {
      setError("");

      const { data, error: leaderboardError } =
        await supabase.rpc("get_leaderboard");

      if (leaderboardError) {
        console.error("Leaderboard error:", leaderboardError);
        throw new Error(leaderboardError.message);
      }

      const formatted: Leader[] = (data || []).map((item: any) => ({
        id: item.id,
        username: item.username,
        points: Number(item.points || 0),
      }));

      setLeaders(formatted);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setCurrentUser(null);
        return;
      }

      const existingUser = formatted.find((item) => item.id === user.id);

      if (existingUser) {
        setCurrentUser({
          id: existingUser.id,
          username: existingUser.username,
          points: existingUser.points,
        });

        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id,username,points")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Profile error:", profileError);
        return;
      }

      if (profile) {
        setCurrentUser({
          id: profile.id,
          username: profile.username,
          points: Number(profile.points || 0),
        });
      }
    } catch (err: any) {
      console.error(err);

      setError(
        err?.message ||
          "Could not load leaderboard. Please check your Supabase setup."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function refreshLeaderboard() {
    setRefreshing(true);
    await loadLeaderboard();
  }

  useEffect(() => {
    loadLeaderboard();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadLeaderboard();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const currentRank = useMemo(() => {
    if (!currentUser) return null;

    const rank =
      leaders.findIndex((leader) => leader.id === currentUser.id) + 1;

    return rank > 0 ? rank : null;
  }, [leaders, currentUser]);

  const topThree = leaders.slice(0, 3);

  const remainingLeaders = leaders.slice(3);

  return (
    <main className="page">
      <div className="background-grid" />
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      <nav className="navbar">
        <div className="brand">
          <div className="brand-orb">
            <span>✦</span>
          </div>

          <div>
            <div className="brand-name">NOVA</div>
            <div className="brand-sub">COMMUNITY NETWORK</div>
          </div>
        </div>

        <div className="nav-links">
          <a href="/">HOME</a>
          <a href="/tasks">TASKS</a>

          <a href="/leaderboard" className="active">
            LEADERBOARD
          </a>

          <a href="/profile">PROFILE</a>
        </div>

        <div className="socials">
          <a
            href="https://t.me/NOVAFOX18"
            target="_blank"
            rel="noreferrer"
            className="social telegram"
          >
            TG
          </a>

          <a
            href="https://x.com/NOVAverse12"
            target="_blank"
            rel="noreferrer"
            className="social x"
          >
            𝕏
          </a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge">
          <span className="pulse-dot" />
          LIVE COMMUNITY RANKING
        </div>

        <h1>
          NOVA
          <span>LEADERBOARD</span>
        </h1>

        <p>
          Rise through the ranks.
          <br />
          Earn XP. Become a legend.
        </p>

        <div className="hero-line">
          <div />
          <span>✦</span>
          <div />
        </div>
      </section>

      {currentUser && (
        <section className="my-rank">
          <div className="my-rank-left">
            <div className="my-avatar">
              {getInitial(currentUser.username)}
            </div>

            <div>
              <div className="small-label">YOUR POSITION</div>

              <div className="my-name">
                @{currentUser.username || "NOVA_USER"}
              </div>
            </div>
          </div>

          <div className="my-stats">
            <div>
              <span>RANK</span>
              <strong>
                {currentRank ? `#${currentRank}` : "TOP 100+"}
              </strong>
            </div>

            <div>
              <span>LEVEL</span>
              <strong>{getLevel(currentUser.points)}</strong>
            </div>

            <div>
              <span>XP</span>
              <strong>{formatPoints(currentUser.points)}</strong>
            </div>
          </div>

          <div className="my-progress">
            <div className="progress-top">
              <span>LEVEL PROGRESS</span>
              <span>{Math.round(getLevelProgress(currentUser.points))}%</span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${getLevelProgress(currentUser.points)}%`,
                }}
              />
            </div>
          </div>
        </section>
      )}

      <section className="leaderboard-section">
        <div className="section-header">
          <div>
            <div className="section-kicker">TOP PLAYERS</div>
            <h2>THE ELITE</h2>
          </div>

          <button
            className="refresh"
            onClick={refreshLeaderboard}
            disabled={refreshing}
          >
            <span className={refreshing ? "spin" : ""}>↻</span>
            {refreshing ? "UPDATING..." : "REFRESH"}
          </button>
        </div>

        {loading ? (
          <div className="loading-box">
            <div className="loader" />

            <div className="loading-title">
              CONNECTING TO NOVA NETWORK
            </div>

            <div className="loading-text">
              Loading community rankings...
            </div>
          </div>
        ) : error ? (
          <div className="error-box">
            <div className="error-icon">!</div>

            <h3>LEADERBOARD OFFLINE</h3>

            <p>{error}</p>

            <button onClick={refreshLeaderboard}>
              TRY AGAIN
            </button>
          </div>
        ) : leaders.length === 0 ? (
          <div className="empty-board">
            <div className="empty-big">✦</div>

            <h3>NO LEGENDS YET</h3>

            <p>
              Start completing tasks and become the first NOVA legend.
            </p>

            <a href="/tasks">START EARNING XP →</a>
          </div>
        ) : (
          <>
            <div className="podium">
              <div className="podium-side second">
                <PodiumCard leader={topThree[1]} rank={2} />
              </div>

              <div className="podium-center">
                <PodiumCard leader={topThree[0]} rank={1} />
              </div>

              <div className="podium-side third">
                <PodiumCard leader={topThree[2]} rank={3} />
              </div>
            </div>

            {remainingLeaders.length > 0 && (
              <div className="ranking-list">
                <div className="list-head">
                  <span>RANK</span>
                  <span>USER</span>
                  <span>LEVEL</span>
                  <span>XP</span>
                </div>

                {remainingLeaders.map((leader, index) => {
                  const rank = index + 4;
                  const isMe = currentUser?.id === leader.id;

                  return (
                    <div
                      className={`ranking-row ${
                        isMe ? "current-user" : ""
                      }`}
                      key={leader.id}
                    >
                      <div className="rank">
                        #{rank}
                      </div>

                      <div className="user-cell">
                        <div className="mini-avatar">
                          {getInitial(leader.username)}
                        </div>

                        <div>
                          <div className="username">
                            @{leader.username || "NOVA_USER"}
                            {isMe && (
                              <span className="you-badge">YOU</span>
                            )}
                          </div>

                          <div className="user-status">
                            NOVA MEMBER
                          </div>
                        </div>
                      </div>

                      <div className="level">
                        <span>{getLevel(leader.points)}</span>
                      </div>

                      <div className="xp">
                        {formatPoints(leader.points)}
                        <span> XP</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="ranking-footer">
              <span>
                SHOWING TOP {Math.min(leaders.length, 100)} PLAYERS
              </span>

              <span>•</span>

              <span>UPDATED LIVE</span>
            </div>
          </>
        )}
      </section>

      <footer>
        <div className="footer-logo">
          <span>✦</span>
          NOVA
        </div>

        <div className="footer-text">
          Born on the internet. Built for the community.
        </div>

        <div className="footer-links">
          <a
            href="https://t.me/NOVAFOX18"
            target="_blank"
            rel="noreferrer"
          >
            TELEGRAM
          </a>

          <a
            href="https://x.com/NOVAverse12"
            target="_blank"
            rel="noreferrer"
          >
            X / TWITTER
          </a>
        </div>
      </footer>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: #030308;
          color: white;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        body {
          overflow-x: hidden;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button {
          font-family: inherit;
        }

        .page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(123, 63, 255, 0.2),
              transparent 35%
            ),
            radial-gradient(
              circle at 10% 40%,
              rgba(0, 204, 255, 0.08),
              transparent 28%
            ),
            radial-gradient(
              circle at 90% 70%,
              rgba(168, 55, 255, 0.08),
              transparent 30%
            ),
            #030308;
        }

        .background-grid {
          position: absolute;
          inset: 0;
          opacity: 0.18;
          pointer-events: none;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.035) 1px,
              transparent 1px
            );
          background-size: 50px 50px;
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 85%
          );
        }

        .glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.13;
          pointer-events: none;
        }

        .glow-one {
          top: 250px;
          left: -250px;
          background: #6c2cff;
        }

        .glow-two {
          top: 700px;
          right: -250px;
          background: #00bfff;
        }

        .navbar {
          width: min(1200px, calc(100% - 32px));
          margin: 0 auto;
          height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 5;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-orb {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background:
            linear-gradient(
              145deg,
              rgba(145, 80, 255, 0.5),
              rgba(35, 120, 255, 0.18)
            );
          border: 1px solid rgba(174, 117, 255, 0.4);
          box-shadow:
            0 0 25px rgba(125, 65, 255, 0.35),
            inset 0 0 20px rgba(255, 255, 255, 0.05);
          font-size: 20px;
        }

        .brand-name {
          font-weight: 950;
          font-size: 18px;
          letter-spacing: 4px;
        }

        .brand-sub {
          font-size: 7px;
          color: #77778b;
          letter-spacing: 2px;
          margin-top: 3px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-links a {
          padding: 9px 13px;
          color: #858598;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.2px;
          border-radius: 9px;
          transition: 0.2s;
        }

        .nav-links a:hover,
        .nav-links a.active {
          color: white;
          background: rgba(135, 75, 255, 0.11);
        }

        .nav-links a.active {
          box-shadow:
            inset 0 0 0 1px rgba(142, 89, 255, 0.25),
            0 0 20px rgba(123, 63, 255, 0.08);
        }

        .socials {
          display: flex;
          gap: 7px;
        }

        .social {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 10px;
          color: #a0a0b3;
          font-size: 10px;
          font-weight: 900;
          transition: 0.2s;
          background: rgba(255, 255, 255, 0.025);
        }

        .social:hover {
          color: white;
          transform: translateY(-2px);
          border-color: rgba(146, 89, 255, 0.5);
          box-shadow: 0 0 20px rgba(126, 68, 255, 0.18);
        }

        .hero {
          width: min(1000px, calc(100% - 32px));
          margin: 0 auto;
          text-align: center;
          padding: 88px 0 45px;
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          width: fit-content;
          margin: 0 auto 24px;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(132, 75, 255, 0.28);
          background: rgba(109, 56, 255, 0.07);
          color: #a995ff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 2px;
          box-shadow: 0 0 30px rgba(123, 63, 255, 0.1);
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          display: inline-block;
          border-radius: 50%;
          background: #6dffba;
          margin-right: 7px;
          box-shadow: 0 0 12px #6dffba;
          animation: pulse 1.6s infinite;
        }

        .hero h1 {
          margin: 0;
          font-size: clamp(48px, 8vw, 96px);
          line-height: 0.9;
          font-weight: 1000;
          letter-spacing: -5px;
          text-shadow:
            0 0 40px rgba(133, 69, 255, 0.2),
            0 10px 50px rgba(0, 0, 0, 0.8);
        }

        .hero h1 span {
          display: block;
          margin-top: 12px;
          background: linear-gradient(
            90deg,
            #8e59ff,
            #c59dff,
            #4ecbff,
            #8e59ff
          );
          background-size: 250% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gradientMove 5s linear infinite;
        }

        .hero p {
          color: #8c8c9e;
          line-height: 1.8;
          margin: 28px 0 0;
          font-size: 14px;
        }

        .hero-line {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 13px;
          margin-top: 35px;
        }

        .hero-line div {
          width: 100px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(137, 80, 255, 0.55)
          );
        }

        .hero-line div:last-child {
          background: linear-gradient(
            90deg,
            rgba(137, 80, 255, 0.55),
            transparent
          );
        }

        .hero-line span {
          color: #a978ff;
          text-shadow: 0 0 20px #8548ff;
        }

        .my-rank {
          width: min(1100px, calc(100% - 32px));
          margin: 0 auto 45px;
          padding: 20px;
          position: relative;
          z-index: 3;
          display: grid;
          grid-template-columns: 1.2fr auto 1fr;
          align-items: center;
          gap: 30px;
          border: 1px solid rgba(143, 91, 255, 0.2);
          border-radius: 20px;
          background:
            linear-gradient(
              135deg,
              rgba(120, 62, 255, 0.1),
              rgba(255, 255, 255, 0.025)
            );
          box-shadow:
            0 25px 80px rgba(0, 0, 0, 0.35),
            inset 0 0 35px rgba(139, 79, 255, 0.035);
          backdrop-filter: blur(18px);
        }

        .my-rank-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .my-avatar,
        .mini-avatar {
          display: grid;
          place-items: center;
          border-radius: 50%;
          font-weight: 950;
          background:
            linear-gradient(
              145deg,
              #8250ff,
              #277aff
            );
          box-shadow:
            0 0 25px rgba(116, 72, 255, 0.3),
            inset 0 0 20px rgba(255, 255, 255, 0.13);
        }

        .my-avatar {
          width: 52px;
          height: 52px;
          font-size: 18px;
        }

        .small-label {
          color: #77778a;
          font-size: 8px;
          letter-spacing: 2px;
          font-weight: 900;
        }

        .my-name {
          font-size: 15px;
          font-weight: 900;
          margin-top: 4px;
        }

        .my-stats {
          display: flex;
          gap: 25px;
        }

        .my-stats div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .my-stats span,
        .progress-top span {
          color: #69697c;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .my-stats strong {
          font-size: 14px;
        }

        .my-progress {
          min-width: 180px;
        }

        .progress-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .progress-track {
          height: 6px;
          border-radius: 20px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.07);
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #7741ff,
            #44bfff
          );
          box-shadow:
            0 0 15px rgba(113, 76, 255, 0.7);
          transition: width 0.5s ease;
        }

        .leaderboard-section {
          width: min(1100px, calc(100% - 32px));
          margin: 0 auto;
          position: relative;
          z-index: 2;
          padding-bottom: 80px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 30px;
        }

        .section-kicker {
          color: #936aff;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 3px;
        }

        .section-header h2 {
          margin: 7px 0 0;
          font-size: 27px;
          letter-spacing: 1px;
        }

        .refresh {
          border: 1px solid rgba(142, 92, 255, 0.28);
          background: rgba(127, 69, 255, 0.08);
          color: #c1aaff;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
          cursor: pointer;
          transition: 0.2s;
        }

        .refresh:hover:not(:disabled) {
          transform: translateY(-2px);
          color: white;
          border-color: rgba(160, 111, 255, 0.6);
          box-shadow: 0 0 25px rgba(119, 61, 255, 0.18);
        }

        .refresh:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spin {
          display: inline-block;
          animation: spin 0.8s linear infinite;
        }

        .podium {
          min-height: 470px;
          display: grid;
          grid-template-columns: 1fr 1.12fr 1fr;
          align-items: end;
          gap: 20px;
          margin-bottom: 25px;
        }

        .podium-center {
          align-self: stretch;
          display: flex;
          align-items: end;
        }

        .podium-side {
          display: flex;
          align-items: end;
        }

        .podium-card {
          width: 100%;
          min-height: 350px;
          position: relative;
          overflow: hidden;
          padding: 40px 18px 0;
          text-align: center;
          border-radius: 22px 22px 12px 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background:
            linear-gradient(
              160deg,
              rgba(255, 255, 255, 0.06),
              rgba(255, 255, 255, 0.018)
            );
          box-shadow:
            0 25px 60px rgba(0, 0, 0, 0.4),
            inset 0 0 50px rgba(255, 255, 255, 0.015);
          backdrop-filter: blur(15px);
          transition:
            transform 0.3s,
            border-color 0.3s;
        }

        .podium-card:hover {
          transform: translateY(-8px);
          border-color: rgba(157, 103, 255, 0.35);
        }

        .podium-card.rank-1 {
          min-height: 425px;
          padding-top: 55px;
          border-color: rgba(177, 119, 255, 0.3);
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(139, 71, 255, 0.2),
              transparent 42%
            ),
            linear-gradient(
              160deg,
              rgba(126, 69, 255, 0.1),
              rgba(255, 255, 255, 0.02)
            );
          box-shadow:
            0 0 70px rgba(118, 55, 255, 0.15),
            0 30px 70px rgba(0, 0, 0, 0.5),
            inset 0 0 70px rgba(119, 65, 255, 0.04);
        }

        .podium-card.rank-2 {
          border-color: rgba(170, 176, 200, 0.2);
        }

        .podium-card.rank-3 {
          border-color: rgba(194, 126, 73, 0.2);
        }

        .crown {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 35px;
          color: #d6a9ff;
          text-shadow:
            0 0 10px #9b52ff,
            0 0 35px #7440ff;
          animation: float 2.3s ease-in-out infinite;
        }

        .rank-number {
          color: #78788c;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 2px;
          margin-bottom: 15px;
        }

        .rank-1 .rank-number {
          color: #b07cff;
        }

        .avatar {
          width: 86px;
          height: 86px;
          margin: 0 auto 17px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          font-size: 28px;
          font-weight: 1000;
          background:
            radial-gradient(
              circle at 30% 20%,
              #c4a2ff,
              #7140df 45%,
              #1d3b9c
            );
          border: 3px solid rgba(255, 255, 255, 0.13);
          box-shadow:
            0 0 35px rgba(124, 65, 255, 0.38),
            inset 0 0 25px rgba(255, 255, 255, 0.12);
        }

        .rank-1 .avatar {
          width: 105px;
          height: 105px;
          font-size: 34px;
          border-color: rgba(197, 154, 255, 0.45);
          box-shadow:
            0 0 50px rgba(127, 64, 255, 0.55),
            0 0 100px rgba(87, 101, 255, 0.13),
            inset 0 0 30px rgba(255, 255, 255, 0.14);
        }

        .leader-name {
          font-size: 16px;
          font-weight: 950;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .leader-level {
          width: fit-content;
          margin: 8px auto 18px;
          padding: 5px 10px;
          border-radius: 999px;
          color: #bda6ff;
          background: rgba(135, 79, 255, 0.09);
          border: 1px solid rgba(137, 83, 255, 0.2);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 1px;
        }

        .leader-points {
          font-size: 25px;
          font-weight: 1000;
          letter-spacing: -1px;
        }

        .leader-points span {
          color: #77778c;
          font-size: 9px;
          letter-spacing: 1px;
        }

        .podium-base {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 48px;
          display: grid;
          place-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(0, 0, 0, 0.2);
        }

        .podium-base span {
          color: #727285;
          font-size: 7px;
          font-weight: 950;
          letter-spacing: 2px;
        }

        .rank-1 .podium-base {
          background: linear-gradient(
            90deg,
            rgba(117, 59, 255, 0.1),
            rgba(49, 156, 255, 0.08)
          );
        }

        .empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0.5;
        }

        .empty-icon {
          width: 70px;
          height: 70px;
          display: grid;
          place-items: center;
          border: 1px dashed rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          color: #67677a;
          font-size: 24px;
          margin-bottom: 18px;
        }

        .empty-title {
          color: #757589;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 2px;
        }

        .empty-text {
          color: #4e4e60;
          font-size: 9px;
          margin-top: 8px;
        }

        .ranking-list {
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.018);
          box-shadow: 0 20px 70px rgba(0, 0, 0, 0.3);
        }

        .list-head,
        .ranking-row {
          display: grid;
          grid-template-columns: 80px 1fr 110px 140px;
          align-items: center;
        }

        .list-head {
          min-height: 45px;
          padding: 0 20px;
          color: #606073;
          background: rgba(255, 255, 255, 0.025);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 7px;
          font-weight: 950;
          letter-spacing: 1.5px;
        }

        .ranking-row {
          min-height: 76px;
          padding: 0 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.045);
          transition: 0.2s;
          animation: rowIn 0.4s ease both;
        }

        .ranking-row:last-child {
          border-bottom: none;
        }

        .ranking-row:hover {
          background: rgba(130, 72, 255, 0.055);
        }

        .ranking-row.current-user {
          background:
            linear-gradient(
              90deg,
              rgba(120, 64, 255, 0.12),
              rgba(63, 139, 255, 0.04)
            );
          box-shadow:
            inset 3px 0 0 #8450ff,
            inset 0 0 30px rgba(120, 63, 255, 0.04);
        }

        .rank {
          color: #858597;
          font-size: 12px;
          font-weight: 950;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .mini-avatar {
          width: 38px;
          height: 38px;
          flex: 0 0 auto;
          font-size: 12px;
        }

        .username {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-status {
          color: #505062;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-top: 4px;
        }

        .you-badge {
          padding: 3px 6px;
          border-radius: 5px;
          color: #c9b5ff;
          background: rgba(129, 70, 255, 0.14);
          border: 1px solid rgba(142, 89, 255, 0.25);
          font-size: 6px;
          letter-spacing: 1px;
        }

        .level span {
          padding: 5px 9px;
          border-radius: 6px;
          color: #9f8bca;
          background: rgba(127, 77, 255, 0.06);
          border: 1px solid rgba(127, 77, 255, 0.12);
          font-size: 8px;
          font-weight: 900;
        }

        .xp {
          text-align: right;
          font-size: 13px;
          font-weight: 950;
        }

        .xp span {
          color: #606073;
          font-size: 7px;
          letter-spacing: 1px;
        }

        .ranking-footer {
          display: flex;
          justify-content: center;
          gap: 10px;
          color: #4f4f62;
          margin-top: 18px;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .loading-box,
        .error-box,
        .empty-board {
          min-height: 350px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.018);
        }

        .loader {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.08);
          border-top-color: #9562ff;
          border-right-color: #40bfff;
          animation: spin 0.8s linear infinite;
          margin-bottom: 25px;
        }

        .loading-title,
        .error-box h3,
        .empty-board h3 {
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 2px;
        }

        .loading-text,
        .error-box p,
        .empty-board p {
          color: #646477;
          font-size: 10px;
          margin: 9px 0 0;
        }

        .error-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #ff718c;
          border: 1px solid rgba(255, 82, 116, 0.25);
          background: rgba(255, 55, 91, 0.07);
          font-weight: 1000;
          margin-bottom: 15px;
        }

        .error-box button,
        .empty-board a {
          margin-top: 20px;
          padding: 11px 17px;
          border-radius: 9px;
          border: 1px solid rgba(138, 83, 255, 0.3);
          background: rgba(128, 69, 255, 0.1);
          color: #c4b0ff;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 1px;
          cursor: pointer;
        }

        .empty-big {
          font-size: 40px;
          color: #8d57ff;
          text-shadow: 0 0 35px rgba(130, 70, 255, 0.5);
          margin-bottom: 10px;
        }

        footer {
          width: min(1100px, calc(100% - 32px));
          margin: 0 auto;
          padding: 25px 0 35px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          position: relative;
          z-index: 2;
        }

        .footer-logo {
          font-size: 14px;
          font-weight: 950;
          letter-spacing: 3px;
        }

        .footer-logo span {
          color: #9662ff;
          margin-right: 5px;
        }

        .footer-text {
          color: #4e4e60;
          font-size: 8px;
        }

        .footer-links {
          display: flex;
          gap: 15px;
        }

        .footer-links a {
          color: #656577;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .footer-links a:hover {
          color: #a987ff;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }

          50% {
            opacity: 0.45;
            transform: scale(0.75);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateX(-50%) translateY(0);
          }

          50% {
            transform: translateX(-50%) translateY(-7px);
          }
        }

        @keyframes gradientMove {
          0% {
            background-position: 0% center;
          }

          100% {
            background-position: 250% center;
          }
        }

        @keyframes rowIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 850px) {
          .nav-links {
            display: none;
          }

          .my-rank {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .my-stats {
            justify-content: space-between;
          }

          .podium {
            grid-template-columns: 1fr;
            gap: 15px;
            min-height: auto;
          }

          .podium-center {
            order: -1;
          }

          .podium-card,
          .podium-card.rank-1 {
            min-height: 330px;
            padding-top: 40px;
          }

          .list-head {
            display: none;
          }

          .ranking-row {
            grid-template-columns: 55px 1fr auto;
            gap: 10px;
            padding: 12px 15px;
          }

          .level {
            display: none;
          }

          .xp {
            text-align: right;
          }
        }

        @media (max-width: 520px) {
          .navbar {
            height: 70px;
          }

          .socials {
            display: none;
          }

          .hero {
            padding-top: 65px;
          }

          .hero h1 {
            font-size: 50px;
            letter-spacing: -3px;
          }

          .hero p {
            font-size: 12px;
          }

          .my-stats {
            gap: 12px;
          }

          .my-stats strong {
            font-size: 12px;
          }

          .section-header {
            align-items: center;
          }

          .section-header h2 {
            font-size: 21px;
          }

          .refresh {
            padding: 9px 10px;
            font-size: 8px;
          }

          .ranking-row {
            min-height: 68px;
          }

          .username {
            max-width: 140px;
          }

          footer {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
