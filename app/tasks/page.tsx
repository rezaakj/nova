"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";

type Profile = {
  username: string | null;
  email: string | null;
  points: number;
};

type Post = {
  id: string;
  title: string;
  description: string | null;
  x_url: string;
  points: number;
};

export default function TasksPage() {
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [claimed, setClaimed] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();

    const stored =
      JSON.parse(
        localStorage.getItem("nova_claimed_tasks") || "[]"
      ) || [];

    setClaimed(stored);
  }, []);

  useEffect(() => {
    if (!activeTask || seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTask, seconds]);

  async function loadData() {
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

    const { data: profileData } = await supabase
      .from("profiles")
      .select("username,email,points")
      .eq("id", user.id)
      .single();

    if (profileData) {
      setProfile(profileData as Profile);
    }

    const { data: postData, error } = await supabase
      .from("social_posts")
      .select("id,title,description,x_url,points")
      .eq("active", true)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      setMessage("Could not load NOVA tasks.");
    }

    if (postData) {
      setPosts(postData as Post[]);
    }

    setLoading(false);
  }

  async function startTask(post: Post) {
    if (!profile) {
      setMessage("Please login to complete NOVA tasks.");
      return;
    }

    if (claimed.includes(post.id)) {
      return;
    }

    setMessage("");
    setActiveTask(post.id);
    setSeconds(30);

    const { error } = await supabase.rpc(
      "start_post_activity",
      {
        p_post_id: post.id,
      }
    );

    if (error) {
      console.error(error);
    }

    window.open(
      post.x_url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function claimTask(post: Post) {
    if (!profile) return;

    if (seconds > 0) {
      setMessage(
        `Please stay on the task for ${seconds} more seconds.`
      );
      return;
    }

    if (claimed.includes(post.id)) {
      return;
    }

    setMessage("");

    const { error } = await supabase.rpc(
      "claim_post_points",
      {
        p_post_id: post.id,
      }
    );

    if (error) {
      console.error(error);

      setMessage(
        error.message ||
          "Could not claim NOVA Points."
      );

      return;
    }

    const nextClaimed = [
      ...claimed,
      post.id,
    ];

    setClaimed(nextClaimed);

    localStorage.setItem(
      "nova_claimed_tasks",
      JSON.stringify(nextClaimed)
    );

    setActiveTask(null);

    setProfile((current) =>
      current
        ? {
            ...current,
            points:
              Number(current.points || 0) +
              Number(post.points || 0),
          }
        : current
    );

    setMessage(
      `+${post.points} NOVA Points added successfully.`
    );
  }

  if (loading) {
    return (
      <main className="loadingPage">
        <div className="loadingOrb">
          🦊
        </div>

        <div className="loadingTitle">
          NOVA
        </div>

        <div className="loadingText">
          INITIALIZING TASK SYSTEM...
        </div>

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
              0 0 60px
              rgba(124, 58, 237, 0.35);
            animation: float 2s ease-in-out infinite;
          }

          .loadingTitle {
            margin-top: 22px;
            font-size: 22px;
            font-weight: 900;
            letter-spacing: 7px;
          }

          .loadingText {
            margin-top: 9px;
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

  const points = Number(profile?.points || 0);

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
            TASK SYSTEM ONLINE
          </div>
        </div>

        <header className="hero">
          <div className="eyebrow">
            <span />
            NOVA MISSION CONTROL
            <span />
          </div>

          <h1>
            Complete
            <br />
            <span>Tasks.</span>
          </h1>

          <p>
            Support the NOVA ecosystem, complete
            community missions and collect NOVA Points.
          </p>

          <div className="pointsPanel">
            <div className="pointsIcon">
              ◆
            </div>

            <div className="pointsInfo">
              <span>YOUR NOVA BALANCE</span>

              <strong>
                {points.toLocaleString()}
              </strong>
            </div>

            <div className="pointsUnit">
              POINTS
            </div>
          </div>
        </header>

        <section className="taskSection">
          <div className="sectionHeader">
            <div>
              <div className="sectionEyebrow">
                COMMUNITY MISSIONS
              </div>

              <h2>
                Available Tasks
              </h2>
            </div>

            <div className="taskCount">
              {posts.length.toString().padStart(2, "0")}{" "}
              MISSIONS
            </div>
          </div>

          {!profile && (
            <div className="loginNotice">
              <div className="noticeIcon">
                ◉
              </div>

              <div>
                <strong>
                  Login required
                </strong>

                <span>
                  Login to your NOVA account to
                  complete missions and earn Points.
                </span>
              </div>

              <Link
                href="/"
                className="noticeButton"
              >
                Login →
              </Link>
            </div>
          )}

          {message && (
            <div
              className={
                message.includes("+")
                  ? "message successMessage"
                  : "message"
              }
            >
              <span>✦</span>
              {message}
            </div>
          )}

          {posts.length === 0 ? (
            <div className="emptyState">
              <div className="emptyIcon">
                ◇
              </div>

              <h3>
                No missions available
              </h3>

              <p>
                New NOVA missions will appear here
                soon.
              </p>
            </div>
          ) : (
            <div className="taskList">
              {posts.map((post, index) => {
                const isClaimed =
                  claimed.includes(post.id);

                const isActive =
                  activeTask === post.id;

                const canClaim =
                  isActive &&
                  seconds === 0 &&
                  !isClaimed;

                return (
                  <article
                    className={
                      isClaimed
                        ? "taskCard claimedCard"
                        : isActive
                        ? "taskCard activeCard"
                        : "taskCard"
                    }
                    key={post.id}
                  >
                    <div className="taskGlow" />

                    <div className="taskIndex">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <div className="taskMain">
                      <div className="taskTop">
                        <div className="taskType">
                          <span className="taskDot" />
                          SOCIAL MISSION
                        </div>

                        {isClaimed && (
                          <div className="completedBadge">
                            ✓ COMPLETED
                          </div>
                        )}

                        {isActive &&
                          !isClaimed && (
                            <div className="activeBadge">
                              ● ACTIVE
                            </div>
                          )}
                      </div>

                      <h3>
                        {post.title}
                      </h3>

                      <p>
                        {post.description ||
                          "Complete this NOVA community mission to earn Points."}
                      </p>

                      <div className="taskMeta">
                        <div className="reward">
                          <span>◆</span>
                          +{post.points} POINTS
                        </div>

                        <div className="duration">
                          ⏱ 30 SEC
                        </div>
                      </div>
                    </div>

                    <div className="taskAction">
                      {isClaimed ? (
                        <div className="claimedButton">
                          <span>✓</span>
                          Completed
                        </div>
                      ) : isActive ? (
                        <button
                          onClick={() =>
                            claimTask(post)
                          }
                          disabled={!canClaim}
                          className={
                            canClaim
                              ? "claimButton ready"
                              : "claimButton"
                          }
                        >
                          {seconds > 0 ? (
                            <>
                              <strong>
                                {seconds}
                              </strong>
                              <span>
                                WAIT
                              </span>
                            </>
                          ) : (
                            <>
                              <span>
                                Claim Reward
                              </span>
                              <b>↗</b>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            startTask(post)
                          }
                          disabled={!profile}
                          className="startButton"
                        >
                          <span>
                            Start Mission
                          </span>
                          <b>↗</b>
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="howSection">
          <div className="howHeader">
            <div className="sectionEyebrow">
              HOW IT WORKS
            </div>

            <h2>
              Three steps.
              <span> One journey.</span>
            </h2>
          </div>

          <div className="steps">
            <div className="step">
              <div className="stepNumber">
                01
              </div>

              <div className="stepIcon">
                ↗
              </div>

              <h3>
                Start
              </h3>

              <p>
                Choose an available NOVA mission
                and open the official channel.
              </p>
            </div>

            <div className="stepLine" />

            <div className="step">
              <div className="stepNumber">
                02
              </div>

              <div className="stepIcon">
                ◷
              </div>

              <h3>
                Engage
              </h3>

              <p>
                Stay active on the mission for
                the required 30 seconds.
              </p>
            </div>

            <div className="stepLine" />

            <div className="step">
              <div className="stepNumber">
                03
              </div>

              <div className="stepIcon">
                ◆
              </div>

              <h3>
                Earn
              </h3>

              <p>
                Claim your reward and watch your
                NOVA Points balance grow.
              </p>
            </div>
          </div>
        </section>

        <section className="bottomCta">
          <div className="ctaGlow" />

          <div className="ctaIcon">
            🦊
          </div>

          <div className="ctaText">
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
            View Roadmap
            <span>↗</span>
          </Link>
        </section>
      </div>

      <footer>
        <div>
          <strong>NOVA</strong>
          <span>FOX ECOSYSTEM</span>
        </div>

        <span>
          Building the future together 🦊
        </span>

        <span className="footerCode">
          MISSIONS / 2026
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
          top: 60px;
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
          max-width: 1180px;
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
          margin: 0 auto 80px;
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

        .eyebrow span {
          width: 35px;
          height: 1px;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(139, 124, 255, 0.7)
            );
        }

        .eyebrow span:last-child {
          background:
            linear-gradient(
              90deg,
              rgba(139, 124, 255, 0.7),
              transparent
            );
        }

        .hero h1 {
          margin: 20px 0;
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
        }

        .hero > p {
          max-width: 590px;
          margin: auto;
          color: #737783;
          font-size: 14px;
          line-height: 1.9;
        }

        .pointsPanel {
          display: inline-flex;
          align-items: center;
          gap: 13px;
          margin-top: 30px;
          padding: 10px 14px 10px 10px;
          border-radius: 17px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background:
            linear-gradient(
              135deg,
              rgba(124, 58, 237, 0.09),
              rgba(255, 255, 255, 0.025)
            );
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            0 15px 40px rgba(0, 0, 0, 0.2);
        }

        .pointsIcon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #06b6d4
            );
          color: white;
          font-size: 14px;
          box-shadow:
            0 0 25px rgba(124, 58, 237, 0.25);
        }

        .pointsInfo {
          text-align: left;
        }

        .pointsInfo span {
          display: block;
          color: #555;
          font-size: 7px;
          letter-spacing: 2px;
        }

        .pointsInfo strong {
          display: block;
          margin-top: 3px;
          font-size: 17px;
          background:
            linear-gradient(
              90deg,
              #fff,
              #a78bfa
            );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .pointsUnit {
          color: #555;
          font-size: 7px;
          letter-spacing: 1px;
        }

        .taskSection {
          margin-top: 10px;
        }

        .sectionHeader {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .sectionEyebrow {
          color: #7064c9;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .sectionHeader h2 {
          margin: 8px 0 0;
          font-size: 27px;
          letter-spacing: -0.7px;
        }

        .taskCount {
          color: #3e3e48;
          font-size: 8px;
          letter-spacing: 2px;
        }

        .loginNotice {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 13px;
          padding: 14px;
          border: 1px solid rgba(124, 58, 237, 0.16);
          border-radius: 16px;
          background: rgba(124, 58, 237, 0.055);
        }

        .noticeIcon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 12px;
          background: rgba(124, 58, 237, 0.12);
          color: #a78bfa;
        }

        .loginNotice > div:nth-child(2) {
          flex: 1;
        }

        .loginNotice strong {
          display: block;
          font-size: 11px;
        }

        .loginNotice span {
          display: block;
          margin-top: 4px;
          color: #666;
          font-size: 9px;
        }

        .noticeButton {
          padding: 9px 13px;
          border-radius: 10px;
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
        }

        .message {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 13px;
          padding: 11px 14px;
          border-radius: 12px;
          border: 1px solid rgba(248, 113, 113, 0.12);
          background: rgba(248, 113, 113, 0.045);
          color: #9b7373;
          font-size: 9px;
        }

        .message span {
          color: #a78bfa;
        }

        .successMessage {
          border-color: rgba(34, 197, 94, 0.12);
          background: rgba(34, 197, 94, 0.04);
          color: #6d9c7b;
        }

        .taskList {
          display: grid;
          gap: 12px;
        }

        .taskCard {
          position: relative;
          display: grid;
          grid-template-columns: 48px minmax(0, 1fr) auto;
          align-items: center;
          gap: 18px;
          min-height: 150px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.065);
          border-radius: 20px;
          background:
            linear-gradient(
              110deg,
              rgba(255, 255, 255, 0.04),
              rgba(255, 255, 255, 0.018)
            );
          backdrop-filter: blur(18px);
          overflow: hidden;
          transition:
            transform 0.3s,
            border-color 0.3s,
            box-shadow 0.3s;
        }

        .taskCard::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background:
            linear-gradient(
              120deg,
              rgba(124, 58, 237, 0.06),
              transparent 45%
            );
          pointer-events: none;
        }

        .taskCard:hover {
          transform: translateY(-4px);
          border-color: rgba(124, 58, 237, 0.2);
          box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.25),
            0 0 30px rgba(124, 58, 237, 0.05);
        }

        .activeCard {
          border-color: rgba(103, 232, 249, 0.2);
          box-shadow:
            0 0 35px rgba(6, 182, 212, 0.05);
        }

        .claimedCard {
          opacity: 0.72;
        }

        .taskGlow {
          position: absolute;
          width: 180px;
          height: 180px;
          right: -80px;
          top: -90px;
          border-radius: 50%;
          background: rgba(124, 58, 237, 0.1);
          filter: blur(35px);
          pointer-events: none;
        }

        .taskIndex {
          position: relative;
          z-index: 2;
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          border: 1px solid rgba(124, 58, 237, 0.14);
          background: rgba(124, 58, 237, 0.07);
          color: #6f62c5;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .taskMain {
          position: relative;
          z-index: 2;
          min-width: 0;
        }

        .taskTop {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .taskType {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #555;
          font-size: 7px;
          letter-spacing: 2px;
          font-weight: 800;
        }

        .taskDot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #8b7cff;
          box-shadow:
            0 0 8px rgba(139, 124, 255, 0.7);
        }

        .completedBadge,
        .activeBadge {
          padding: 5px 7px;
          border-radius: 99px;
          font-size: 6px;
          letter-spacing: 1px;
          font-weight: 800;
        }

        .completedBadge {
          color: #79a789;
          background: rgba(34, 197, 94, 0.055);
          border: 1px solid rgba(34, 197, 94, 0.1);
        }

        .activeBadge {
          color: #70a7b0;
          background: rgba(6, 182, 212, 0.055);
          border: 1px solid rgba(6, 182, 212, 0.12);
        }

        .taskMain h3 {
          margin: 9px 0 6px;
          font-size: 18px;
          letter-spacing: -0.3px;
        }

        .taskMain p {
          max-width: 650px;
          margin: 0;
          color: #666872;
          font-size: 10px;
          line-height: 1.75;
        }

        .taskMeta {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 12px;
        }

        .reward {
          color: #a78bfa;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.7px;
        }

        .reward span {
          color: #67e8f9;
        }

        .duration {
          color: #494a52;
          font-size: 8px;
          letter-spacing: 1px;
        }

        .taskAction {
          position: relative;
          z-index: 2;
          width: 150px;
        }

        .startButton,
        .claimButton,
        .claimedButton {
          width: 100%;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 0 14px;
          border-radius: 13px;
          font-size: 9px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.25s;
        }

        .startButton {
          border: 1px solid rgba(124, 58, 237, 0.18);
          background:
            linear-gradient(
              135deg,
              rgba(124, 58, 237, 0.15),
              rgba(37, 99, 235, 0.08)
            );
          color: white;
        }

        .startButton:hover:not(:disabled) {
          transform: translateY(-2px);
          border-color: rgba(139, 124, 255, 0.4);
          box-shadow:
            0 10px 25px rgba(124, 58, 237, 0.16);
        }

        .startButton:disabled {
          cursor: not-allowed;
          opacity: 0.4;
        }

        .startButton b,
        .claimButton b {
          color: #67e8f9;
          font-size: 15px;
        }

        .claimButton {
          justify-content: center;
          border: 1px solid rgba(124, 58, 237, 0.12);
          background: rgba(124, 58, 237, 0.06);
          color: #666;
          cursor: not-allowed;
        }

        .claimButton.ready {
          border-color: rgba(34, 197, 94, 0.2);
          background:
            linear-gradient(
              135deg,
              rgba(124, 58, 237, 0.2),
              rgba(6, 182, 212, 0.1)
            );
          color: white;
          cursor: pointer;
          box-shadow:
            0 10px 30px rgba(124, 58, 237, 0.12);
        }

        .claimButton.ready:hover {
          transform: translateY(-2px);
          box-shadow:
            0 15px 35px rgba(124, 58, 237, 0.22);
        }

        .claimButton strong {
          font-size: 19px;
          color: #67e8f9;
        }

        .claimButton span {
          font-size: 7px;
          color: #555;
          letter-spacing: 1px;
        }

        .claimedButton {
          justify-content: center;
          border: 1px solid rgba(34, 197, 94, 0.1);
          background: rgba(34, 197, 94, 0.04);
          color: #648a70;
          cursor: default;
        }

        .claimedButton span {
          color: #86efac;
          font-size: 14px;
        }

        .emptyState {
          padding: 70px 20px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.025);
        }

        .emptyIcon {
          font-size: 38px;
          color: #7c3aed;
          text-shadow:
            0 0 30px rgba(124, 58, 237, 0.5);
        }

        .emptyState h3 {
          margin: 15px 0 7px;
          font-size: 17px;
        }

        .emptyState p {
          margin: 0;
          color: #555;
          font-size: 10px;
        }

        .howSection {
          margin-top: 85px;
        }

        .howHeader h2 {
          margin: 8px 0 25px;
          font-size: 27px;
        }

        .howHeader h2 span {
          color: #a78bfa;
        }

        .steps {
          display: grid;
          grid-template-columns: 1fr 35px 1fr 35px 1fr;
          align-items: center;
          gap: 8px;
        }

        .step {
          min-height: 205px;
          padding: 23px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.025);
          transition: 0.3s;
        }

        .step:hover {
          transform: translateY(-4px);
          border-color: rgba(124, 58, 237, 0.18);
        }

        .stepNumber {
          color: #363740;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .stepIcon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          margin-top: 18px;
          border-radius: 13px;
          background:
            linear-gradient(
              135deg,
              rgba(124, 58, 237, 0.17),
              rgba(6, 182, 212, 0.08)
            );
          color: #a78bfa;
          font-size: 17px;
        }

        .step h3 {
          margin: 13px 0 6px;
          font-size: 15px;
        }

        .step p {
          margin: 0;
          color: #5e5f68;
          font-size: 9px;
          line-height: 1.7;
        }

        .stepLine {
          height: 1px;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(124, 58, 237, 0.3),
              transparent
            );
        }

        .bottomCta {
          position: relative;
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 70px;
          padding: 25px;
          border: 1px solid rgba(124, 58, 237, 0.16);
          border-radius: 23px;
          background:
            linear-gradient(
              110deg,
              rgba(124, 58, 237, 0.08),
              rgba(6, 182, 212, 0.035)
            );
          overflow: hidden;
        }

        .ctaGlow {
          position: absolute;
          width: 250px;
          height: 150px;
          left: -80px;
          top: -70px;
          border-radius: 50%;
          background: rgba(124, 58, 237, 0.1);
          filter: blur(45px);
          pointer-events: none;
        }

        .ctaIcon {
          position: relative;
          z-index: 2;
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 18px;
          background:
            linear-gradient(
              145deg,
              rgba(124, 58, 237, 0.25),
              rgba(6, 182, 212, 0.1)
            );
          font-size: 29px;
          box-shadow:
            0 10px 30px rgba(124, 58, 237, 0.15);
        }

        .ctaText {
          position: relative;
          z-index: 2;
          flex: 1;
        }

        .ctaText h2 {
          margin: 6px 0 0;
          font-size: 18px;
        }

        .ctaText h2 span {
          color: #a78bfa;
        }

        .roadmapButton {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 15px;
          border-radius: 11px;
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
            0 10px 25px rgba(124, 58, 237, 0.2);
          transition: 0.25s;
        }

        .roadmapButton:hover {
          transform: translateY(-3px);
          box-shadow:
            0 15px 35px rgba(124, 58, 237, 0.32);
        }

        .roadmapButton span {
          font-size: 14px;
          color: #c4b5fd;
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

        footer strong {
          display: block;
          color: white;
          font-size: 13px;
          letter-spacing: 4px;
        }

        footer div span {
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

        @media (max-width: 850px) {
          .container {
            padding: 28px 17px 75px;
          }

          .topRow {
            margin-bottom: 50px;
          }

          .hero {
            margin-bottom: 60px;
          }

          .taskCard {
            grid-template-columns: 42px minmax(0, 1fr);
          }

          .taskAction {
            grid-column: 2;
            width: 100%;
          }

          .steps {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .stepLine {
            display: none;
          }

          .step {
            min-height: auto;
          }

          .bottomCta {
            flex-wrap: wrap;
          }

          .roadmapButton {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 560px) {
          .systemStatus {
            display: none;
          }

          .hero h1 {
            letter-spacing: -5px;
          }

          .pointsPanel {
            width: 100%;
            justify-content: flex-start;
          }

          .pointsUnit {
            margin-left: auto;
          }

          .sectionHeader {
            align-items: flex-start;
          }

          .taskCount {
            display: none;
          }

          .loginNotice {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .noticeButton {
            width: 100%;
            text-align: center;
          }

          .taskCard {
            padding: 16px;
            gap: 12px;
          }

          .taskIndex {
            width: 40px;
            height: 40px;
            border-radius: 13px;
          }

          .taskMain h3 {
            font-size: 16px;
          }

          .taskMain p {
            font-size: 9px;
          }

          .taskMeta {
            gap: 10px;
          }

          .bottomCta {
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