"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  email: string | null;
  username: string | null;
  points: number;
};

type Post = {
  id: string;
  title: string;
  content: string;
  x_url: string;
  points: number;
  created_at: string;
};

export default function Home() {
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const [mode, setMode] = useState<"login" | "signup">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [timers, setTimers] = useState<Record<string, number>>({});
  const [claiming, setClaiming] = useState<Record<string, boolean>>({});
  const [claimed, setClaimed] = useState<Record<string, boolean>>({});

  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [dailyLoading, setDailyLoading] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    loadProfile();
    loadPosts();
    checkDailyStatus();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
      checkDailyStatus();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setProfile(null);
      setDailyClaimed(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,username,points")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setProfile(data);
    }
  }

  async function loadPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("id,title,content,x_url,points,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMessage("Could not load NOVA activities.");
      return;
    }

    setPosts(data || []);
  }

  async function checkDailyStatus() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setDailyClaimed(false);
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("daily_checkins")
      .select("id")
      .eq("user_id", user.id)
      .eq("checkin_date", today)
      .maybeSingle();

    if (!error && data) {
      setDailyClaimed(true);
    } else {
      setDailyClaimed(false);
    }
  }

  async function claimDailyCheckin() {
    if (!profile || dailyLoading || dailyClaimed) {
      return;
    }

    setDailyLoading(true);
    setMessage("");

    const { data, error } = await supabase.rpc("claim_daily_checkin");

    if (error) {
      console.error(error);
      setMessage(error.message);
      setDailyLoading(false);
      return;
    }

    if (data?.already_claimed) {
      setDailyClaimed(true);
      setMessage("You already claimed today's Daily Check-in.");
      await loadProfile();
      setDailyLoading(false);
      return;
    }

    if (data?.success) {
      setDailyClaimed(true);

      setMessage(
        `+${data.points} NOVA Points added successfully! 🦊`
      );

      await loadProfile();
    }

    setDailyLoading(false);
  }

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Welcome back to NOVA 🦊");
        await loadProfile();
        await checkDailyStatus();
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split("@")[0],
          },
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Account created. Check your email to confirm your account."
        );
      }
    }

    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();

    setProfile(null);
    setTimers({});
    setClaimed({});
    setClaiming({});
    setDailyClaimed(false);
    setMessage("");
  }

  async function startActivity(post: Post) {
    if (!profile) {
      setMessage("Please login first.");

      document.getElementById("auth")?.scrollIntoView({
        behavior: "smooth",
      });

      return;
    }

    if (timers[post.id] !== undefined) {
      return;
    }

    if (claimed[post.id]) {
      return;
    }

    setMessage("");

    const { data, error } = await supabase.rpc("start_post_activity", {
      p_post_id: post.id,
    });

    if (error) {
      console.error(error);
      setMessage(error.message);
      return;
    }

    if (data?.already_claimed) {
      setClaimed((current) => ({
        ...current,
        [post.id]: true,
      }));

      return;
    }

    window.open(post.x_url, "_blank", "noopener,noreferrer");

    let remaining = 30;

    setTimers((current) => ({
      ...current,
      [post.id]: remaining,
    }));

    const interval = window.setInterval(() => {
      remaining -= 1;

      setTimers((current) => ({
        ...current,
        [post.id]: remaining,
      }));

      if (remaining <= 0) {
        window.clearInterval(interval);
      }
    }, 1000);
  }

  async function claimPoints(post: Post) {
    if (!profile) {
      setMessage("Please login first.");
      return;
    }

    if (claiming[post.id] || claimed[post.id]) {
      return;
    }

    setClaiming((current) => ({
      ...current,
      [post.id]: true,
    }));

    setMessage("");

    const { data, error } = await supabase.rpc("claim_post_points", {
      p_post_id: post.id,
    });

    if (error) {
      console.error(error);

      setMessage(error.message);

      setClaiming((current) => ({
        ...current,
        [post.id]: false,
      }));

      return;
    }

    if (data?.already_claimed) {
      setClaimed((current) => ({
        ...current,
        [post.id]: true,
      }));

      setClaiming((current) => ({
        ...current,
        [post.id]: false,
      }));

      return;
    }

    if (data?.success) {
      setClaimed((current) => ({
        ...current,
        [post.id]: true,
      }));

      setTimers((current) => {
        const next = { ...current };
        delete next[post.id];
        return next;
      });

      setMessage(
        `+${data.points} NOVA Points added successfully! 🦊`
      );

      await loadProfile();
    }

    setClaiming((current) => ({
      ...current,
      [post.id]: false,
    }));
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  function scrollToSection(id: string) {
    setMobileOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <main className="site">
      <div className="background-grid" />
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="orb orb-three" />

      {/* NAVBAR */}
      <header className="navbar">
        <div className="nav-inner">
          <a href="/" className="brand" onClick={closeMobileMenu}>
            <div className="brand-mark">
              <div className="brand-ring" />
              <span>✦</span>
            </div>

            <div className="brand-text">
              <strong>NOVA</strong>
              <small>COMMUNITY</small>
            </div>
          </a>

          <nav className={`nav-links ${mobileOpen ? "mobile-show" : ""}`}>
            <a href="/" onClick={closeMobileMenu}>
              Home
            </a>

            <a href="/tasks" onClick={closeMobileMenu}>
              Tasks
            </a>

            <a href="/social" onClick={closeMobileMenu}>
              Social
            </a>

            <a href="/roadmap" onClick={closeMobileMenu}>
              Roadmap
            </a>

            <a href="/launch" className="launch-nav" onClick={closeMobileMenu}>
              <span>🚀</span>
              Launch
            </a>

            {profile && (
              <a href="/profile" onClick={closeMobileMenu}>
                Profile
              </a>
            )}
          </nav>

          <div className="nav-actions">
            <a
              href="https://t.me/NOVAFOX18"
              target="_blank"
              rel="noreferrer"
              className="social-button telegram"
              aria-label="NOVA Telegram"
            >
              <span>✈</span>
              <b>Telegram</b>
            </a>

            <a
              href="https://x.com/NOVAverse12"
              target="_blank"
              rel="noreferrer"
              className="social-button x-button"
              aria-label="NOVA X"
            >
              <span>𝕏</span>
            </a>

            {profile && (
              <button className="logout-button" onClick={logout}>
                Logout
              </button>
            )}
          </div>

          <button
            className={`menu-button ${mobileOpen ? "active" : ""}`}
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="status-pill">
            <span className="status-dot" />
            NOVA ECOSYSTEM · ONLINE
          </div>

          <div className="hero-title">
            <span className="title-small">WELCOME TO</span>
            <h1>NOVA</h1>
            <div className="title-line">
              <span>Build.</span>
              <span>Connect.</span>
              <span>Earn.</span>
            </div>
          </div>

          <p className="hero-description">
            Join the next-generation NOVA community. Complete social
            activities, collect NOVA Points and grow with the ecosystem.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-button"
              onClick={() =>
                profile
                  ? scrollToSection("activities")
                  : scrollToSection("auth")
              }
            >
              <span>
                {profile ? "Explore Tasks" : "Join NOVA"}
              </span>
              <strong>↗</strong>
            </button>

            <a href="/roadmap" className="secondary-button">
              <span>View Roadmap</span>
              <strong>→</strong>
            </a>
          </div>

          <div className="hero-mini-stats">
            <div>
              <strong>24/7</strong>
              <span>ECOSYSTEM</span>
            </div>

            <div className="stat-divider" />

            <div>
              <strong>{posts.length || "∞"}</strong>
              <span>ACTIVITIES</span>
            </div>

            <div className="stat-divider" />

            <div>
              <strong>30s</strong>
              <span>REWARD LOOP</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-orbit orbit-a" />
          <div className="visual-orbit orbit-b" />
          <div className="visual-orbit orbit-c" />

          <div className="visual-glow" />

          <div className="fox-core">
            <div className="fox-face">
              <div className="fox-ear left-ear" />
              <div className="fox-ear right-ear" />

              <div className="fox-head">
                <div className="fox-eye eye-left" />
                <div className="fox-eye eye-right" />
                <div className="fox-nose" />
              </div>
            </div>

            <div className="fox-core-text">
              <span>NOVA</span>
              <small>POINT SYSTEM</small>
            </div>
          </div>

          <div className="floating-card card-top">
            <span>✦</span>
            <div>
              <small>COMMUNITY</small>
              <strong>ACTIVE</strong>
            </div>
          </div>

          <div className="floating-card card-bottom">
            <span>◈</span>
            <div>
              <small>REWARD</small>
              <strong>+POINTS</strong>
            </div>
          </div>
        </div>
      </section>

      {/* PROFILE */}
      {profile && (
        <section className="profile-section">
          <div className="profile-card">
            <div className="profile-avatar">
              {(profile.username || "N").charAt(0).toUpperCase()}
            </div>

            <div className="profile-info">
              <span>YOUR NOVA IDENTITY</span>
              <h2>{profile.username || "NOVA User"}</h2>
              <p>{profile.email || "Connected member"}</p>
            </div>

            <div className="profile-points">
              <span>NOVA POINTS</span>
              <strong>{profile.points.toLocaleString()}</strong>
              <small>AVAILABLE BALANCE</small>
            </div>

            <a href="/profile" className="profile-arrow">
              →
            </a>
          </div>
        </section>
      )}

      {/* MESSAGE */}
      {message && (
        <div className="message-wrap">
          <div className="message">
            <span className="message-icon">✦</span>
            <span>{message}</span>
            <button onClick={() => setMessage("")}>×</button>
          </div>
        </div>
      )}

      {/* AUTH */}
      {!profile && (
        <section className="auth-section" id="auth">
          <div className="section-heading">
            <span>01 / ACCESS</span>
            <h2>Enter the NOVA universe.</h2>
            <p>
              Create your account or continue your journey with NOVA.
            </p>
          </div>

          <div className="auth-card">
            <div className="auth-decoration">
              <div className="auth-ring ring-one" />
              <div className="auth-ring ring-two" />
              <div className="auth-symbol">✦</div>
            </div>

            <div className="auth-content">
              <div className="auth-tabs">
                <button
                  className={mode === "login" ? "active" : ""}
                  onClick={() => {
                    setMode("login");
                    setMessage("");
                  }}
                >
                  Login
                </button>

                <button
                  className={mode === "signup" ? "active" : ""}
                  onClick={() => {
                    setMode("signup");
                    setMessage("");
                  }}
                >
                  Register
                </button>
              </div>

              <div className="auth-title">
                <h3>
                  {mode === "login"
                    ? "Welcome back."
                    : "Create your NOVA account."}
                </h3>

                <p>
                  {mode === "login"
                    ? "Access your points and community tasks."
                    : "Start collecting points and enter the ecosystem."}
                </p>
              </div>

              <form onSubmit={handleAuth} className="auth-form">
                {mode === "signup" && (
                  <label>
                    <span>USERNAME</span>
                    <input
                      type="text"
                      placeholder="nova_user"
                      value={username}
                      onChange={(event) =>
                        setUsername(event.target.value)
                      }
                    />
                  </label>
                )}

                <label>
                  <span>EMAIL</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </label>

                <label>
                  <span>PASSWORD</span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >
                  <span>
                    {loading
                      ? "PROCESSING..."
                      : mode === "login"
                      ? "ENTER NOVA"
                      : "CREATE ACCOUNT"}
                  </span>
                  <strong>↗</strong>
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* DAILY CHECK IN */}
      {profile && (
        <section className="daily-section">
          <div className="section-heading">
            <span>02 / DAILY</span>
            <h2>Keep your streak alive.</h2>
            <p>Check in every day and collect your NOVA reward.</p>
          </div>

          <div className="daily-card">
            <div className="daily-icon">
              <span>✦</span>
            </div>

            <div className="daily-content">
              <div className="daily-label">DAILY CHECK-IN</div>
              <h3>
                {dailyClaimed
                  ? "Today's reward is secured."
                  : "Your daily reward is waiting."}
              </h3>

              <p>
                {dailyClaimed
                  ? "Come back tomorrow for another reward."
                  : "One click. One reward. Keep building your NOVA streak."}
              </p>
            </div>

            <div className="daily-reward">
              <span>REWARD</span>
              <strong>+100</strong>
              <small>NOVA POINTS</small>
            </div>

            <button
              className={`daily-button ${
                dailyClaimed ? "completed" : ""
              }`}
              onClick={claimDailyCheckin}
              disabled={dailyClaimed || dailyLoading}
            >
              {dailyLoading
                ? "CLAIMING..."
                : dailyClaimed
                ? "✓ CLAIMED"
                : "CLAIM +100"}
            </button>
          </div>
        </section>
      )}

      {/* ACTIVITIES */}
      <section className="activities-section" id="activities">
        <div className="section-heading activities-heading">
          <div>
            <span>03 / SOCIAL MISSIONS</span>
            <h2>Complete. Engage. Earn.</h2>
            <p>
              Interact with NOVA social activities and unlock points.
            </p>
          </div>

          <div className="activity-counter">
            <strong>{posts.length}</strong>
            <span>MISSIONS</span>
          </div>
        </div>

        <div className="activity-grid">
          {posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✦</div>
              <h3>No missions available</h3>
              <p>
                New NOVA activities will appear here when they are
                published.
              </p>
            </div>
          ) : (
            posts.map((post, index) => {
              const timer = timers[post.id];
              const isClaimed = claimed[post.id];
              const isClaiming = claiming[post.id];

              return (
                <article
                  key={post.id}
                  className={`activity-card ${
                    isClaimed ? "is-claimed" : ""
                  }`}
                >
                  <div className="activity-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="activity-top">
                    <div className="activity-icon">
                      {index % 3 === 0
                        ? "𝕏"
                        : index % 3 === 1
                        ? "✦"
                        : "◈"}
                    </div>

                    <div className="activity-reward">
                      <span>REWARD</span>
                      <strong>+{post.points}</strong>
                    </div>
                  </div>

                  <div className="activity-body">
                    <span className="activity-tag">
                      NOVA SOCIAL MISSION
                    </span>

                    <h3>{post.title}</h3>

                    <p>{post.content}</p>
                  </div>

                  <div className="activity-footer">
                    {timer !== undefined && timer > 0 ? (
                      <div className="timer-box">
                        <div className="timer-circle">
                          <span>{timer}</span>
                        </div>

                        <div>
                          <strong>MISSION ACTIVE</strong>
                          <small>
                            Stay on X for {timer}s...
                          </small>
                        </div>
                      </div>
                    ) : isClaimed ? (
                      <div className="claimed-box">
                        <span>✓</span>
                        <div>
                          <strong>REWARD CLAIMED</strong>
                          <small>NOVA Points added</small>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="activity-button"
                        onClick={() => startActivity(post)}
                        disabled={isClaiming}
                      >
                        <span>OPEN X</span>
                        <strong>↗</strong>
                      </button>
                    )}

                    {timer === 0 && !isClaimed && (
                      <button
                        className="claim-button"
                        onClick={() => claimPoints(post)}
                        disabled={isClaiming}
                      >
                        {isClaiming
                          ? "CLAIMING..."
                          : `CLAIM +${post.points}`}
                      </button>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="ecosystem-section">
        <div className="ecosystem-card">
          <div className="ecosystem-glow" />

          <div className="ecosystem-content">
            <span>THE NOVA ECOSYSTEM</span>
            <h2>
              More than points.
              <br />
              <em>A community in motion.</em>
            </h2>

            <p>
              Follow the roadmap, complete missions, connect with the
              community and be ready for what's next.
            </p>

            <div className="ecosystem-actions">
              <a href="/roadmap" className="eco-button">
                Roadmap <strong>→</strong>
              </a>

              <a href="/launch" className="eco-button outline">
                Launch <strong>↗</strong>
              </a>
            </div>
          </div>

          <div className="ecosystem-visual">
            <div className="eco-orbit eco-orbit-one" />
            <div className="eco-orbit eco-orbit-two" />
            <div className="eco-core">
              <span>✦</span>
            </div>

            <div className="eco-node node-one">01</div>
            <div className="eco-node node-two">02</div>
            <div className="eco-node node-three">03</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-brand">
          <div className="brand-mark small">
            <div className="brand-ring" />
            <span>✦</span>
          </div>

          <div>
            <strong>NOVA</strong>
            <span>COMMUNITY ECOSYSTEM</span>
          </div>
        </div>

        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/tasks">Tasks</a>
          <a href="/social">Social</a>
          <a href="/roadmap">Roadmap</a>
          <a href="/launch">Launch</a>
          {profile && <a href="/profile">Profile</a>}
        </div>

        <div className="footer-socials">
          <a
            href="https://t.me/NOVAFOX18"
            target="_blank"
            rel="noreferrer"
          >
            Telegram
          </a>

          <a
            href="https://x.com/NOVAverse12"
            target="_blank"
            rel="noreferrer"
          >
            𝕏
          </a>
        </div>

        <div className="footer-bottom">
          <span>© 2026 NOVA</span>
          <span>BUILDING THE NEXT WAVE ✦</span>
        </div>
      </footer>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #03030a;
          color: #ffffff;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        button,
        input {
          font: inherit;
        }

        button,
        a {
          -webkit-tap-highlight-color: transparent;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .site {
          min-height: 100vh;
          overflow: hidden;
          position: relative;
          background:
            radial-gradient(
              circle at 15% 5%,
              rgba(120, 70, 255, 0.14),
              transparent 28%
            ),
            radial-gradient(
              circle at 85% 18%,
              rgba(0, 210, 255, 0.1),
              transparent 25%
            ),
            linear-gradient(135deg, #020207 0%, #05050f 50%, #020207 100%);
        }

        .background-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.28;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.025) 1px,
              transparent 1px
            );
          background-size: 55px 55px;
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 85%
          );
        }

        .orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(70px);
          opacity: 0.18;
          animation: floatOrb 10s ease-in-out infinite;
        }

        .orb-one {
          width: 300px;
          height: 300px;
          background: #6d3cff;
          left: -150px;
          top: 35%;
        }

        .orb-two {
          width: 260px;
          height: 260px;
          background: #00d9ff;
          right: -130px;
          top: 15%;
          animation-delay: -3s;
        }

        .orb-three {
          width: 220px;
          height: 220px;
          background: #a855f7;
          right: 20%;
          bottom: -120px;
          animation-delay: -6s;
        }

        @keyframes floatOrb {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -35px, 0);
          }
        }

        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 18px 24px;
          background: rgba(3, 3, 10, 0.68);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .nav-inner {
          width: min(1420px, 100%);
          margin: 0 auto;
          min-height: 68px;
          padding: 8px 10px 8px 16px;
          display: flex;
          align-items: center;
          gap: 20px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 24px;
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.075),
              rgba(255, 255, 255, 0.025)
            ),
            rgba(5, 5, 15, 0.7);
          box-shadow:
            0 20px 70px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: max-content;
        }

        .brand-mark {
          width: 44px;
          height: 44px;
          position: relative;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background:
            linear-gradient(
              145deg,
              rgba(164, 105, 255, 0.35),
              rgba(26, 214, 255, 0.1)
            ),
            #090915;
          border: 1px solid rgba(180, 120, 255, 0.35);
          box-shadow:
            0 0 30px rgba(122, 76, 255, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transform: perspective(300px) rotateX(5deg);
        }

        .brand-mark span {
          font-size: 23px;
          position: relative;
          z-index: 2;
          text-shadow: 0 0 18px rgba(135, 85, 255, 0.95);
        }

        .brand-ring {
          position: absolute;
          inset: 5px;
          border: 1px solid rgba(0, 220, 255, 0.3);
          border-radius: 10px;
          transform: rotate(45deg);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .brand-text strong {
          font-size: 20px;
          letter-spacing: 0.18em;
        }

        .brand-text small {
          margin-top: 5px;
          color: #85859d;
          font-size: 8px;
          letter-spacing: 0.25em;
        }

        .nav-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          flex: 1;
        }

        .nav-links a {
          position: relative;
          padding: 11px 13px;
          border-radius: 12px;
          color: #9090a5;
          font-size: 13px;
          font-weight: 600;
          transition:
            color 0.25s ease,
            background 0.25s ease,
            transform 0.25s ease;
        }

        .nav-links a:hover {
          color: white;
          background: rgba(255, 255, 255, 0.06);
          transform: translateY(-2px);
        }

        .nav-links .launch-nav {
          color: white;
          margin-left: 4px;
          padding: 10px 15px;
          border: 1px solid rgba(137, 88, 255, 0.4);
          background:
            linear-gradient(
              135deg,
              rgba(116, 67, 255, 0.24),
              rgba(0, 217, 255, 0.08)
            );
          box-shadow: 0 0 22px rgba(105, 65, 255, 0.12);
        }

        .launch-nav span {
          margin-right: 5px;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .social-button {
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 0 13px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.035);
          color: #c9c9d7;
          font-size: 12px;
          transition: 0.25s ease;
        }

        .social-button:hover {
          color: white;
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.16);
        }

        .telegram span {
          color: #37bdf8;
          font-size: 16px;
        }

        .x-button {
          width: 42px;
          padding: 0;
          font-size: 17px;
        }

        .logout-button {
          min-height: 40px;
          padding: 0 13px;
          border: 1px solid rgba(255, 100, 150, 0.15);
          border-radius: 12px;
          background: rgba(255, 80, 130, 0.06);
          color: #e4a2b8;
          cursor: pointer;
          font-size: 11px;
          transition: 0.25s ease;
        }

        .logout-button:hover {
          background: rgba(255, 80, 130, 0.12);
          transform: translateY(-2px);
        }

        .menu-button {
          display: none;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          cursor: pointer;
        }

        .menu-button span {
          display: block;
          width: 18px;
          height: 2px;
          margin: 4px auto;
          border-radius: 5px;
          background: white;
          transition: 0.25s ease;
        }

        .menu-button.active span:nth-child(1) {
          transform: translateY(6px) rotate(45deg);
        }

        .menu-button.active span:nth-child(2) {
          opacity: 0;
        }

        .menu-button.active span:nth-child(3) {
          transform: translateY(-6px) rotate(-45deg);
        }

        .hero {
          width: min(1420px, calc(100% - 48px));
          min-height: 710px;
          margin: 0 auto;
          padding: 95px 20px 75px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          gap: 50px;
          position: relative;
        }

        .hero-left {
          position: relative;
          z-index: 2;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 12px;
          border: 1px solid rgba(0, 220, 255, 0.18);
          border-radius: 999px;
          background: rgba(0, 220, 255, 0.045);
          color: #8c9bae;
          font-size: 9px;
          letter-spacing: 0.18em;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #57f0b1;
          box-shadow: 0 0 12px #57f0b1;
          animation: pulse 1.8s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }

          50% {
            opacity: 0.4;
            transform: scale(0.7);
          }
        }

        .hero-title {
          margin-top: 28px;
        }

        .title-small {
          display: block;
          color: #8a8aa0;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.35em;
        }

        .hero-title h1 {
          margin: 2px 0 0;
          font-size: clamp(90px, 14vw, 190px);
          line-height: 0.82;
          letter-spacing: -0.08em;
          font-weight: 900;
          background:
            linear-gradient(
              135deg,
              #ffffff 15%,
              #bba2ff 47%,
              #6ce9ff 85%
            );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 80px rgba(130, 80, 255, 0.18);
        }

        .title-line {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
        }

        .title-line span {
          padding: 8px 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.025);
          color: #aaaabd;
          font-size: 12px;
          letter-spacing: 0.08em;
        }

        .title-line span:nth-child(2) {
          border-color: rgba(0, 220, 255, 0.15);
          color: #89dff0;
        }

        .title-line span:nth-child(3) {
          border-color: rgba(158, 98, 255, 0.2);
          color: #bd9dff;
        }

        .hero-description {
          max-width: 620px;
          margin: 25px 0 0;
          color: #858599;
          font-size: 16px;
          line-height: 1.8;
        }

        .hero-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .primary-button,
        .secondary-button {
          min-height: 54px;
          padding: 0 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          border-radius: 15px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.04em;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border 0.25s ease;
        }

        .primary-button {
          color: white;
          border: 1px solid rgba(158, 111, 255, 0.55);
          background:
            linear-gradient(
              135deg,
              rgba(119, 65, 255, 0.8),
              rgba(55, 112, 255, 0.58)
            );
          box-shadow:
            0 16px 45px rgba(103, 55, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }

        .primary-button strong,
        .secondary-button strong {
          font-size: 18px;
        }

        .secondary-button {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.035);
          color: #c8c8d4;
        }

        .primary-button:hover,
        .secondary-button:hover {
          transform: translateY(-4px) perspective(400px) rotateX(3deg);
        }

        .primary-button:hover {
          box-shadow:
            0 22px 55px rgba(103, 55, 255, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .secondary-button:hover {
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
        }

        .hero-mini-stats {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-top: 50px;
        }

        .hero-mini-stats div:not(.stat-divider) {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .hero-mini-stats strong {
          font-size: 19px;
          letter-spacing: 0.04em;
        }

        .hero-mini-stats span {
          color: #646477;
          font-size: 8px;
          letter-spacing: 0.16em;
        }

        .stat-divider {
          width: 1px;
          height: 30px;
          background: rgba(255, 255, 255, 0.1);
        }

        .hero-visual {
          height: 600px;
          position: relative;
          display: grid;
          place-items: center;
          perspective: 1200px;
        }

        .visual-glow {
          width: 360px;
          height: 360px;
          position: absolute;
          border-radius: 50%;
          background: rgba(117, 69, 255, 0.16);
          filter: blur(80px);
        }

        .visual-orbit {
          position: absolute;
          border: 1px solid rgba(150, 105, 255, 0.18);
          border-radius: 50%;
          transform: rotateX(68deg) rotateZ(25deg);
        }

        .orbit-a {
          width: 470px;
          height: 470px;
          animation: orbitSpin 15s linear infinite;
        }

        .orbit-b {
          width: 390px;
          height: 390px;
          transform: rotateX(68deg) rotateZ(-40deg);
          border-color: rgba(0, 220, 255, 0.14);
          animation: orbitSpinReverse 11s linear infinite;
        }

        .orbit-c {
          width: 540px;
          height: 280px;
          border-color: rgba(255, 255, 255, 0.08);
          transform: rotateX(72deg) rotateZ(5deg);
          animation: orbitSpin 19s linear infinite;
        }

        @keyframes orbitSpin {
          from {
            transform: rotateX(68deg) rotateZ(0deg);
          }

          to {
            transform: rotateX(68deg) rotateZ(360deg);
          }
        }

        @keyframes orbitSpinReverse {
          from {
            transform: rotateX(68deg) rotateZ(360deg);
          }

          to {
            transform: rotateX(68deg) rotateZ(0deg);
          }
        }

        .fox-core {
          width: 270px;
          height: 330px;
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 48% 48% 42% 42%;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background:
            radial-gradient(
              circle at 50% 35%,
              rgba(150, 90, 255, 0.2),
              transparent 40%
            ),
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.09),
              rgba(255, 255, 255, 0.025)
            );
          box-shadow:
            0 35px 100px rgba(0, 0, 0, 0.55),
            0 0 90px rgba(107, 67, 255, 0.17),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transform: rotateY(-8deg) rotateX(4deg);
          animation: coreFloat 5s ease-in-out infinite;
        }

        @keyframes coreFloat {
          0%,
          100% {
            transform: rotateY(-8deg) rotateX(4deg) translateY(0);
          }

          50% {
            transform: rotateY(-8deg) rotateX(4deg) translateY(-12px);
          }
        }

        .fox-face {
          position: relative;
          width: 150px;
          height: 150px;
        }

        .fox-head {
          width: 130px;
          height: 125px;
          position: absolute;
          left: 10px;
          top: 20px;
          border-radius: 48% 48% 42% 42%;
          background:
            linear-gradient(
              145deg,
              #d7c8ff,
              #8f6aff 45%,
              #5c38c8 100%
            );
          box-shadow:
            0 15px 45px rgba(108, 66, 255, 0.38),
            inset 0 2px 3px rgba(255, 255, 255, 0.35);
        }

        .fox-ear {
          width: 58px;
          height: 75px;
          position: absolute;
          top: 0;
          background: linear-gradient(145deg, #b69cff, #6840dc);
          clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
          filter: drop-shadow(0 10px 20px rgba(92, 52, 220, 0.25));
        }

        .left-ear {
          left: 2px;
          transform: rotate(-14deg);
        }

        .right-ear {
          right: 2px;
          transform: rotate(14deg);
        }

        .fox-eye {
          width: 12px;
          height: 7px;
          position: absolute;
          top: 58px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 13px rgba(255, 255, 255, 0.9);
        }

        .eye-left {
          left: 32px;
        }

        .eye-right {
          right: 32px;
        }

        .fox-nose {
          width: 14px;
          height: 11px;
          position: absolute;
          left: 58px;
          top: 79px;
          border-radius: 50% 50% 60% 60%;
          background: #17121f;
        }

        .fox-core-text {
          margin-top: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .fox-core-text span {
          font-size: 25px;
          font-weight: 900;
          letter-spacing: 0.25em;
          margin-left: 0.25em;
        }

        .fox-core-text small {
          margin-top: 7px;
          color: #78788f;
          font-size: 7px;
          letter-spacing: 0.25em;
        }

        .floating-card {
          position: absolute;
          z-index: 5;
          min-width: 150px;
          padding: 13px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 16px;
          background: rgba(9, 9, 20, 0.72);
          backdrop-filter: blur(18px);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.32);
        }

        .floating-card > span {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(127, 74, 255, 0.15);
          color: #bb9cff;
        }

        .floating-card div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .floating-card small {
          color: #66667b;
          font-size: 7px;
          letter-spacing: 0.16em;
        }

        .floating-card strong {
          font-size: 11px;
          letter-spacing: 0.08em;
        }

        .card-top {
          top: 110px;
          right: 2%;
          animation: floatCard 5s ease-in-out infinite;
        }

        .card-bottom {
          bottom: 105px;
          left: 2%;
          animation: floatCard 6s ease-in-out infinite reverse;
        }

        @keyframes floatCard {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-12px);
          }
        }

        .profile-section,
        .auth-section,
        .daily-section,
        .activities-section,
        .ecosystem-section {
          width: min(1200px, calc(100% - 48px));
          margin: 0 auto;
        }

        .profile-section {
          padding-bottom: 70px;
        }

        .profile-card {
          min-height: 100px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 17px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 23px;
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.07),
              rgba(255, 255, 255, 0.025)
            ),
            rgba(7, 7, 17, 0.78);
          box-shadow:
            0 25px 70px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .profile-avatar {
          width: 60px;
          height: 60px;
          flex: 0 0 60px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          font-size: 22px;
          font-weight: 900;
          background:
            linear-gradient(
              135deg,
              rgba(125, 70, 255, 0.7),
              rgba(0, 207, 255, 0.35)
            );
          box-shadow: 0 10px 30px rgba(101, 58, 255, 0.2);
        }

        .profile-info {
          flex: 1;
          min-width: 0;
        }

        .profile-info span,
        .profile-points span {
          color: #68687e;
          font-size: 8px;
          letter-spacing: 0.18em;
        }

        .profile-info h2 {
          margin: 5px 0 2px;
          font-size: 17px;
        }

        .profile-info p {
          margin: 0;
          color: #77778c;
          font-size: 11px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .profile-points {
          padding: 5px 25px;
          text-align: right;
          border-left: 1px solid rgba(255, 255, 255, 0.08);
        }

        .profile-points strong {
          display: block;
          margin: 3px 0;
          font-size: 25px;
          background: linear-gradient(90deg, #ffffff, #9e83ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .profile-points small {
          color: #505064;
          font-size: 7px;
          letter-spacing: 0.15em;
        }

        .profile-arrow {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.04);
          color: #aaaabe;
          font-size: 20px;
          transition: 0.25s ease;
        }

        .profile-arrow:hover {
          background: rgba(129, 76, 255, 0.15);
          color: white;
          transform: translateX(3px);
        }

        .message-wrap {
          width: min(1000px, calc(100% - 48px));
          margin: 0 auto 45px;
        }

        .message {
          min-height: 54px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 11px;
          border: 1px solid rgba(115, 77, 255, 0.2);
          border-radius: 15px;
          background: rgba(111, 65, 255, 0.07);
          color: #c5bddc;
          font-size: 12px;
        }

        .message-icon {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: rgba(129, 79, 255, 0.16);
          color: #ba9cff;
        }

        .message button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: #77778d;
          font-size: 19px;
          cursor: pointer;
        }

        .section-heading {
          margin-bottom: 28px;
        }

        .section-heading > span,
        .section-heading span:first-child {
          color: #73738b;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .section-heading h2 {
          margin: 8px 0 7px;
          font-size: clamp(27px, 4vw, 42px);
          letter-spacing: -0.035em;
        }

        .section-heading p {
          margin: 0;
          color: #707085;
          font-size: 13px;
          line-height: 1.7;
        }

        .auth-section {
          padding: 60px 0 100px;
        }

        .auth-card {
          min-height: 500px;
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: 0.7fr 1.3fr;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 30px;
          background:
            radial-gradient(
              circle at 15% 50%,
              rgba(121, 69, 255, 0.15),
              transparent 35%
            ),
            rgba(7, 7, 17, 0.78);
          box-shadow:
            0 30px 90px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.07);
        }

        .auth-decoration {
          position: relative;
          overflow: hidden;
          min-height: 100%;
          background:
            radial-gradient(
              circle,
              rgba(112, 64, 255, 0.22),
              transparent 55%
            ),
            rgba(255, 255, 255, 0.015);
          border-right: 1px solid rgba(255, 255, 255, 0.06);
        }

        .auth-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(157, 103, 255, 0.2);
        }

        .ring-one {
          width: 330px;
          height: 330px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .ring-two {
          width: 220px;
          height: 220px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) rotate(30deg);
          border-color: rgba(0, 219, 255, 0.15);
        }

        .auth-symbol {
          width: 100px;
          height: 100px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: grid;
          place-items: center;
          border-radius: 28px;
          font-size: 48px;
          background:
            linear-gradient(
              145deg,
              rgba(143, 87, 255, 0.32),
              rgba(0, 210, 255, 0.08)
            );
          border: 1px solid rgba(170, 110, 255, 0.3);
          box-shadow: 0 0 70px rgba(116, 69, 255, 0.25);
          transform-style: preserve-3d;
          animation: symbolFloat 4s ease-in-out infinite;
        }

        @keyframes symbolFloat {
          0%,
          100% {
            transform: translate(-50%, -50%) rotateY(0deg);
          }

          50% {
            transform: translate(-50%, -54%) rotateY(12deg);
          }
        }

        .auth-content {
          padding: 45px;
        }

        .auth-tabs {
          display: flex;
          gap: 4px;
          padding: 4px;
          width: max-content;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.025);
        }

        .auth-tabs button {
          min-width: 90px;
          padding: 10px 15px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #73738a;
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
        }

        .auth-tabs button.active {
          color: white;
          background: rgba(133, 78, 255, 0.22);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .auth-title {
          margin: 35px 0 25px;
        }

        .auth-title h3 {
          margin: 0 0 8px;
          font-size: 25px;
        }

        .auth-title p {
          margin: 0;
          color: #6d6d82;
          font-size: 12px;
        }

        .auth-form {
          display: grid;
          gap: 15px;
        }

        .auth-form label {
          display: grid;
          gap: 8px;
        }

        .auth-form label span {
          color: #66667a;
          font-size: 8px;
          letter-spacing: 0.18em;
        }

        .auth-form input {
          width: 100%;
          height: 50px;
          padding: 0 15px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          outline: none;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.035);
          color: white;
          transition: 0.25s ease;
        }

        .auth-form input::placeholder {
          color: #4d4d60;
        }

        .auth-form input:focus {
          border-color: rgba(131, 78, 255, 0.55);
          box-shadow: 0 0 0 3px rgba(118, 66, 255, 0.08);
          background: rgba(255, 255, 255, 0.05);
        }

        .auth-submit {
          height: 53px;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 17px 0 19px;
          border: 1px solid rgba(143, 91, 255, 0.4);
          border-radius: 13px;
          background:
            linear-gradient(
              135deg,
              rgba(116, 64, 255, 0.65),
              rgba(49, 113, 255, 0.48)
            );
          color: white;
          cursor: pointer;
          font-size: 11px;
          font-weight: 800;
          transition: 0.25s ease;
        }

        .auth-submit:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(96, 54, 255, 0.2);
        }

        .auth-submit:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        .auth-submit strong {
          font-size: 18px;
        }

        .daily-section {
          padding: 35px 0 95px;
        }

        .daily-card {
          min-height: 150px;
          padding: 22px;
          display: flex;
          align-items: center;
          gap: 18px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 24px;
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.065),
              rgba(255, 255, 255, 0.02)
            ),
            rgba(7, 7, 17, 0.78);
          box-shadow: 0 25px 65px rgba(0, 0, 0, 0.25);
        }

        .daily-icon {
          width: 65px;
          height: 65px;
          flex: 0 0 65px;
          display: grid;
          place-items: center;
          border-radius: 20px;
          background:
            linear-gradient(
              145deg,
              rgba(129, 74, 255, 0.25),
              rgba(0, 215, 255, 0.08)
            );
          border: 1px solid rgba(145, 90, 255, 0.2);
          font-size: 25px;
          box-shadow: 0 0 35px rgba(112, 66, 255, 0.13);
        }

        .daily-content {
          flex: 1;
        }

        .daily-label {
          color: #77778c;
          font-size: 8px;
          letter-spacing: 0.18em;
        }

        .daily-content h3 {
          margin: 7px 0 5px;
          font-size: 18px;
        }

        .daily-content p {
          margin: 0;
          color: #6b6b80;
          font-size: 11px;
        }

        .daily-reward {
          padding: 0 25px;
          text-align: right;
          border-left: 1px solid rgba(255, 255, 255, 0.07);
        }

        .daily-reward span,
        .daily-reward small {
          display: block;
          color: #646478;
          font-size: 7px;
          letter-spacing: 0.17em;
        }

        .daily-reward strong {
          display: block;
          margin: 5px 0;
          font-size: 29px;
          color: #b9a0ff;
        }

        .daily-button {
          min-width: 130px;
          height: 46px;
          padding: 0 15px;
          border: 1px solid rgba(134, 79, 255, 0.4);
          border-radius: 12px;
          background: rgba(118, 67, 255, 0.16);
          color: white;
          cursor: pointer;
          font-size: 10px;
          font-weight: 800;
          transition: 0.25s ease;
        }

        .daily-button:hover:not(:disabled) {
          transform: translateY(-3px);
          background: rgba(118, 67, 255, 0.28);
          box-shadow: 0 14px 30px rgba(105, 61, 255, 0.16);
        }

        .daily-button.completed {
          border-color: rgba(75, 230, 169, 0.2);
          background: rgba(75, 230, 169, 0.07);
          color: #6ce3b1;
        }

        .daily-button:disabled {
          cursor: default;
        }

        .activities-section {
          padding: 30px 0 100px;
        }

        .activities-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }

        .activity-counter {
          min-width: 100px;
          padding: 12px 15px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.025);
          text-align: right;
        }

        .activity-counter strong {
          display: block;
          font-size: 20px;
        }

        .activity-counter span {
          color: #626276;
          font-size: 7px;
          letter-spacing: 0.15em;
        }

        .activity-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .activity-card {
          min-width: 0;
          position: relative;
          padding: 22px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 23px;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(111, 63, 255, 0.1),
              transparent 35%
            ),
            rgba(7, 7, 17, 0.76);
          transition:
            transform 0.3s ease,
            border 0.3s ease,
            box-shadow 0.3s ease;
        }

        .activity-card:hover {
          transform: translateY(-6px) perspective(800px) rotateX(1deg);
          border-color: rgba(137, 86, 255, 0.2);
          box-shadow: 0 25px 65px rgba(0, 0, 0, 0.32);
        }

        .activity-card.is-claimed {
          border-color: rgba(77, 223, 165, 0.16);
        }

        .activity-number {
          position: absolute;
          top: 16px;
          right: 18px;
          color: #38384a;
          font-size: 9px;
          letter-spacing: 0.12em;
        }

        .activity-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .activity-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background:
            linear-gradient(
              145deg,
              rgba(133, 77, 255, 0.2),
              rgba(0, 208, 255, 0.06)
            );
          border: 1px solid rgba(139, 84, 255, 0.16);
          font-size: 19px;
        }

        .activity-reward {
          text-align: right;
        }

        .activity-reward span {
          display: block;
          color: #555568;
          font-size: 7px;
          letter-spacing: 0.16em;
        }

        .activity-reward strong {
          color: #ad91ff;
          font-size: 17px;
        }

        .activity-body {
          padding: 25px 0;
        }

        .activity-tag {
          color: #6c6c82;
          font-size: 7px;
          letter-spacing: 0.17em;
        }

        .activity-body h3 {
          margin: 8px 0 8px;
          font-size: 18px;
        }

        .activity-body p {
          min-height: 48px;
          margin: 0;
          color: #707084;
          font-size: 11px;
          line-height: 1.65;
        }

        .activity-footer {
          min-height: 55px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .activity-button,
        .claim-button {
          height: 43px;
          border-radius: 11px;
          cursor: pointer;
          font-size: 9px;
          font-weight: 800;
          transition: 0.25s ease;
        }

        .activity-button {
          flex: 1;
          padding: 0 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: rgba(255, 255, 255, 0.04);
          color: #c7c7d5;
        }

        .activity-button:hover:not(:disabled) {
          color: white;
          border-color: rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.07);
          transform: translateY(-2px);
        }

        .activity-button strong {
          font-size: 16px;
        }

        .claim-button {
          padding: 0 15px;
          border: 1px solid rgba(132, 77, 255, 0.28);
          background: rgba(116, 65, 255, 0.13);
          color: #b9a0ff;
        }

        .claim-button:hover:not(:disabled) {
          transform: translateY(-2px);
          background: rgba(116, 65, 255, 0.22);
        }

        .timer-box,
        .claimed-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .timer-circle {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          flex: 0 0 42px;
          border: 1px solid rgba(128, 76, 255, 0.28);
          border-radius: 50%;
          background: rgba(117, 67, 255, 0.1);
          color: #c0a7ff;
          font-size: 11px;
          font-weight: 800;
        }

        .timer-box div:last-child,
        .claimed-box div:last-child {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .timer-box strong,
        .claimed-box strong {
          font-size: 8px;
          letter-spacing: 0.12em;
        }

        .timer-box small,
        .claimed-box small {
          color: #5f5f73;
          font-size: 8px;
        }

        .claimed-box > span {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: rgba(73, 224, 163, 0.09);
          border: 1px solid rgba(73, 224, 163, 0.18);
          color: #67dfae;
        }

        .empty-state {
          grid-column: 1 / -1;
          padding: 70px 30px;
          text-align: center;
          border: 1px dashed rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.015);
        }

        .empty-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 15px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          background: rgba(123, 72, 255, 0.1);
          color: #a889ff;
          font-size: 25px;
        }

        .empty-state h3 {
          margin: 0 0 7px;
          font-size: 17px;
        }

        .empty-state p {
          margin: 0;
          color: #66667a;
          font-size: 11px;
        }

        .ecosystem-section {
          padding: 20px 0 110px;
        }

        .ecosystem-card {
          min-height: 470px;
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 32px;
          background:
            radial-gradient(
              circle at 25% 50%,
              rgba(115, 66, 255, 0.18),
              transparent 45%
            ),
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.06),
              rgba(255, 255, 255, 0.015)
            );
          box-shadow: 0 35px 90px rgba(0, 0, 0, 0.3);
        }

        .ecosystem-content {
          position: relative;
          z-index: 2;
          padding: 60px;
        }

        .ecosystem-content > span {
          color: #7a7a91;
          font-size: 8px;
          letter-spacing: 0.22em;
        }

        .ecosystem-content h2 {
          margin: 13px 0 18px;
          font-size: clamp(32px, 5vw, 54px);
          line-height: 1.05;
          letter-spacing: -0.045em;
        }

        .ecosystem-content h2 em {
          font-style: normal;
          color: #aa91ff;
        }

        .ecosystem-content p {
          max-width: 500px;
          margin: 0;
          color: #77778b;
          font-size: 13px;
          line-height: 1.8;
        }

        .ecosystem-actions {
          display: flex;
          gap: 10px;
          margin-top: 28px;
        }

        .eco-button {
          min-height: 46px;
          padding: 0 17px;
          display: inline-flex;
          align-items: center;
          gap: 20px;
          border: 1px solid rgba(133, 78, 255, 0.32);
          border-radius: 12px;
          background: rgba(118, 67, 255, 0.13);
          font-size: 10px;
          font-weight: 800;
          transition: 0.25s ease;
        }

        .eco-button.outline {
          border-color: rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          color: #b0b0c1;
        }

        .eco-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(91, 52, 255, 0.16);
        }

        .ecosystem-visual {
          min-height: 470px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .eco-orbit {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(137, 82, 255, 0.22);
          transform: rotateX(70deg) rotateZ(25deg);
          animation: orbitSpin 13s linear infinite;
        }

        .eco-orbit-one {
          width: 310px;
          height: 310px;
        }

        .eco-orbit-two {
          width: 220px;
          height: 220px;
          border-color: rgba(0, 214, 255, 0.16);
          animation-duration: 9s;
          animation-direction: reverse;
        }

        .eco-core {
          width: 110px;
          height: 110px;
          z-index: 2;
          display: grid;
          place-items: center;
          border-radius: 30px;
          border: 1px solid rgba(157, 100, 255, 0.35);
          background:
            linear-gradient(
              145deg,
              rgba(126, 71, 255, 0.35),
              rgba(0, 205, 255, 0.08)
            ),
            rgba(10, 10, 25, 0.8);
          box-shadow:
            0 0 80px rgba(109, 64, 255, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          font-size: 45px;
          animation: coreFloat 5s ease-in-out infinite;
        }

        .eco-node {
          width: 34px;
          height: 34px;
          position: absolute;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.13);
          background: rgba(7, 7, 18, 0.85);
          color: #8c8ca1;
          font-size: 7px;
        }

        .node-one {
          top: 25%;
          right: 20%;
        }

        .node-two {
          bottom: 24%;
          left: 20%;
        }

        .node-three {
          top: 48%;
          right: 7%;
        }

        .footer {
          width: min(1420px, calc(100% - 48px));
          margin: 0 auto;
          padding: 25px 0 30px;
          display: grid;
          grid-template-columns: 1fr auto auto;
          align-items: center;
          gap: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-mark.small {
          width: 36px;
          height: 36px;
          border-radius: 11px;
        }

        .brand-mark.small span {
          font-size: 18px;
        }

        .footer-brand > div:last-child {
          display: flex;
          flex-direction: column;
        }

        .footer-brand strong {
          font-size: 13px;
          letter-spacing: 0.15em;
        }

        .footer-brand span {
          margin-top: 3px;
          color: #555568;
          font-size: 7px;
          letter-spacing: 0.16em;
        }

        .footer-links {
          display: flex;
          gap: 18px;
        }

        .footer-links a,
        .footer-socials a {
          color: #626277;
          font-size: 9px;
          transition: 0.2s ease;
        }

        .footer-links a:hover,
        .footer-socials a:hover {
          color: white;
        }

        .footer-socials {
          display: flex;
          gap: 13px;
        }

        .footer-bottom {
          grid-column: 1 / -1;
          padding-top: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          color: #454556;
          font-size: 7px;
          letter-spacing: 0.13em;
        }

        @media (max-width: 1050px) {
          .nav-links {
            gap: 0;
          }

          .nav-links a {
            padding-left: 9px;
            padding-right: 9px;
            font-size: 11px;
          }

          .telegram b {
            display: none;
          }

          .hero {
            grid-template-columns: 1fr;
            padding-top: 65px;
          }

          .hero-left {
            text-align: center;
          }

          .status-pill,
          .hero-mini-stats {
            justify-content: center;
          }

          .hero-description {
            margin-left: auto;
            margin-right: auto;
          }

          .hero-buttons {
            justify-content: center;
          }

          .hero-visual {
            height: 500px;
          }

          .ecosystem-card {
            grid-template-columns: 1fr;
          }

          .ecosystem-content {
            padding-bottom: 20px;
          }

          .ecosystem-visual {
            min-height: 380px;
          }
        }

        @media (max-width: 800px) {
          .navbar {
            padding: 10px 12px;
          }

          .nav-inner {
            min-height: 58px;
            border-radius: 18px;
            padding-left: 10px;
          }

          .nav-actions {
            margin-left: auto;
          }

          .nav-links {
            position: absolute;
            top: calc(100% + 8px);
            left: 12px;
            right: 12px;
            display: none;
            flex-direction: column;
            align-items: stretch;
            padding: 10px;
            border: 1px solid rgba(255, 255, 255, 0.09);
            border-radius: 20px;
            background: rgba(6, 6, 16, 0.94);
            backdrop-filter: blur(25px);
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5);
          }

          .nav-links.mobile-show {
            display: flex;
          }

          .nav-links a {
            padding: 14px;
          }

          .nav-links .launch-nav {
            margin: 0;
          }

          .menu-button {
            display: block;
          }

          .nav-actions .social-button {
            display: none;
          }

          .logout-button {
            display: none;
          }

          .brand-text small {
            display: none;
          }

          .brand-mark {
            width: 40px;
            height: 40px;
          }

          .brand-text strong {
            font-size: 18px;
          }

          .hero,
          .profile-section,
          .auth-section,
          .daily-section,
          .activities-section,
          .ecosystem-section {
            width: min(100% - 28px, 1200px);
          }

          .hero {
            min-height: auto;
            padding: 60px 0 40px;
          }

          .hero-title h1 {
            font-size: clamp(80px, 25vw, 150px);
          }

          .hero-description {
            font-size: 14px;
          }

          .hero-visual {
            height: 450px;
          }

          .orbit-a {
            width: 370px;
            height: 370px;
          }

          .orbit-b {
            width: 300px;
            height: 300px;
          }

          .orbit-c {
            width: 400px;
            height: 220px;
          }

          .fox-core {
            width: 225px;
            height: 285px;
          }

          .card-top {
            right: 0;
            top: 60px;
          }

          .card-bottom {
            left: 0;
            bottom: 55px;
          }

          .profile-card {
            flex-wrap: wrap;
          }

          .profile-points {
            width: 100%;
            padding: 15px 0 0;
            border-left: 0;
            border-top: 1px solid rgba(255, 255, 255, 0.07);
            text-align: left;
          }

          .profile-points strong {
            display: inline-block;
            margin-right: 8px;
          }

          .profile-arrow {
            margin-left: auto;
          }

          .auth-card {
            grid-template-columns: 1fr;
          }

          .auth-decoration {
            min-height: 170px;
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          }

          .ring-one {
            width: 220px;
            height: 220px;
          }

          .ring-two {
            width: 150px;
            height: 150px;
          }

          .auth-symbol {
            width: 70px;
            height: 70px;
            font-size: 32px;
          }

          .auth-content {
            padding: 28px 22px;
          }

          .daily-card {
            flex-wrap: wrap;
          }

          .daily-content {
            min-width: calc(100% - 85px);
          }

          .daily-reward {
            width: 100%;
            padding: 14px 0 0;
            text-align: left;
            border-left: 0;
            border-top: 1px solid rgba(255, 255, 255, 0.07);
          }

          .daily-reward strong {
            display: inline-block;
            margin-right: 7px;
          }

          .daily-button {
            width: 100%;
          }

          .activity-grid {
            grid-template-columns: 1fr;
          }

          .activities-heading {
            align-items: flex-start;
            gap: 18px;
          }

          .activity-counter {
            min-width: 75px;
          }

          .ecosystem-content {
            padding: 40px 25px 15px;
          }

          .ecosystem-visual {
            min-height: 330px;
          }

          .footer {
            width: calc(100% - 28px);
            grid-template-columns: 1fr auto;
          }

          .footer-links {
            grid-column: 1 / -1;
            order: 3;
            flex-wrap: wrap;
          }

          .footer-bottom {
            order: 4;
          }
        }

        @media (max-width: 500px) {
          .hero-mini-stats {
            gap: 13px;
          }

          .hero-mini-stats strong {
            font-size: 15px;
          }

          .hero-mini-stats span {
            font-size: 6px;
          }

          .stat-divider {
            height: 25px;
          }

          .hero-buttons {
            flex-direction: column;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
          }

          .hero-visual {
            height: 390px;
          }

          .fox-core {
            width: 195px;
            height: 250px;
          }

          .fox-face {
            transform: scale(0.85);
          }

          .orbit-a {
            width: 300px;
            height: 300px;
          }

          .orbit-b {
            width: 245px;
            height: 245px;
          }

          .orbit-c {
            width: 330px;
            height: 180px;
          }

          .floating-card {
            min-width: 125px;
            padding: 9px;
          }

          .floating-card > span {
            width: 27px;
            height: 27px;
          }

          .card-top {
            top: 30px;
          }

          .card-bottom {
            bottom: 35px;
          }

          .activity-footer {
            flex-wrap: wrap;
          }

          .activity-button {
            min-width: 100%;
          }

          .claim-button {
            width: 100%;
          }

          .timer-box,
          .claimed-box {
            width: 100%;
          }

          .ecosystem-actions {
            flex-direction: column;
          }

          .eco-button {
            justify-content: space-between;
          }

          .ecosystem-visual {
            transform: scale(0.85);
          }

          .footer {
            padding-bottom: 25px;
          }

          .footer-socials {
            justify-content: flex-end;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </main>
  );
}