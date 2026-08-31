"use client";

import { useEffect, useState } from "react";

const NOVA_PER_USD = 10000;

const TELEGRAM_URL = "https://t.me/NOVAFOX18";
const X_URL = "https://x.com/NOVAverse12";

const LAUNCH_DATE = new Date(
  Date.now() + 40 * 24 * 60 * 60 * 1000
).getTime();

const faqs = [
  {
    q: "What is NOVA?",
    a: "NOVA is a community-focused space-themed meme token concept.",
  },
  {
    q: "When will NOVA launch?",
    a: "The current website countdown is set to 40 days as a demo launch timer.",
  },
  {
    q: "How many NOVA do I get for $1?",
    a: "The current demo rate is 1 USD = 10,000 NOVA.",
  },
  {
    q: "Can I buy NOVA now?",
    a: "The current purchase and swap system is a demonstration only. No real transaction is processed.",
  },
  {
    q: "Is the wallet connection real?",
    a: "The wallet connection shown on this demo is simulated and does not request access to funds.",
  },
  {
    q: "Where can I follow NOVA?",
    a: "Follow NOVA on X and join the Telegram community using the official links on this page.",
  },
];

function Logo() {
  return (
    <div className="logo">
      <div className="logoIcon">✦</div>
      <span>NOVA</span>
    </div>
  );
}

function Stars() {
  const stars = Array.from({ length: 70 });

  return (
    <div className="stars">
      {stars.map((_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 61) % 100}%`,
            animationDelay: `${(i % 7) * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [walletOpen, setWalletOpen] = useState(false);
  const [usd, setUsd] = useState("1");
  const [nova, setNova] = useState("10000");
  const [swapStatus, setSwapStatus] = useState("");
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [time, setTime] = useState({
    days: 40,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateTimer = () => {
      const diff = Math.max(0, LAUNCH_DATE - Date.now());

      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateTimer();

    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateNova = (value: string) => {
    setUsd(value);

    const amount = Number(value);

    if (!Number.isFinite(amount) || amount < 0) {
      setNova("0");
      return;
    }

    setNova((amount * NOVA_PER_USD).toLocaleString("en-US"));
  };

  const calculateUsd = (value: string) => {
    setNova(value);

    const amount = Number(value.replace(/,/g, ""));

    if (!Number.isFinite(amount) || amount < 0) {
      setUsd("0");
      return;
    }

    setUsd((amount / NOVA_PER_USD).toString());
  };

  const connectWallet = () => {
    if (wallet) {
      setWallet("");
      setWalletOpen(false);
      return;
    }

    setWalletOpen(true);
  };

  const selectWallet = (name: string) => {
    setWallet(`${name} 0x7A...91F2`);
    setWalletOpen(false);
  };

  const demoSwap = () => {
    if (!usd || Number(usd) <= 0) {
      setSwapStatus("Enter an amount first.");
      return;
    }

    setSwapStatus(
      `Demo swap ready: $${usd} → ${nova} NOVA`
    );
  };

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setEmailStatus("Please enter a valid email.");
      return;
    }

    setEmailStatus("🚀 You're on the NOVA notification list!");
    setEmail("");
  };

  return (
    <main>
      <Stars />

      <div className="glow glow1" />
      <div className="glow glow2" />

      {/* NAVBAR */}

      <header className="navbarWrap">
        <nav className="navbar">
          <a href="#home">
            <Logo />
          </a>

          <div className="navLinks">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#tokenomics">Tokenomics</a>
            <a href="#swap">Swap</a>
            <a href="#roadmap">Roadmap</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="navActions">
            <a
              href={X_URL}
              target="_blank"
              rel="noreferrer"
              className="social"
            >
              𝕏
            </a>

            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="social"
            >
              ✈
            </a>

            <button className="walletButton" onClick={connectWallet}>
              {wallet ? `${wallet} ✓` : "Connect Wallet"}
            </button>
          </div>
        </nav>
      </header>

      {/* WALLET MODAL */}

      {walletOpen && (
        <div className="modalOverlay" onClick={() => setWalletOpen(false)}>
          <div
            className="walletModal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="closeModal"
              onClick={() => setWalletOpen(false)}
            >
              ×
            </button>

            <div className="modalIcon">🔐</div>

            <h3>Connect Wallet</h3>

            <p>
              Choose a wallet to continue with the NOVA demo.
            </p>

            <button
              className="walletOption"
              onClick={() => selectWallet("MetaMask")}
            >
              🦊 MetaMask
              <span>→</span>
            </button>

            <button
              className="walletOption"
              onClick={() => selectWallet("Phantom")}
            >
              👻 Phantom
              <span>→</span>
            </button>

            <button
              className="walletOption"
              onClick={() => selectWallet("WalletConnect")}
            >
              🔗 WalletConnect
              <span>→</span>
            </button>

            <small>
              Demo connection only — no funds are requested.
            </small>
          </div>
        </div>
      )}

      {/* HERO */}

      <section className="hero section" id="home">
        <div className="heroContent">
          <div className="badge">
            <span />
            🚀 LAUNCHING IN 40 DAYS
          </div>

          <h1>
            <span>$</span>NOVA
          </h1>

          <h2>
            THE NEXT <b>MEME IN ORBIT.</b>
          </h2>

          <p>
            Born on the internet.
            <br />
            Built for the community.
          </p>

          <div className="timer">
            <div>
              <strong>{String(time.days).padStart(2, "0")}</strong>
              <small>DAYS</small>
            </div>

            <div>
              <strong>{String(time.hours).padStart(2, "0")}</strong>
              <small>HOURS</small>
            </div>

            <div>
              <strong>{String(time.minutes).padStart(2, "0")}</strong>
              <small>MINUTES</small>
            </div>

            <div>
              <strong>{String(time.seconds).padStart(2, "0")}</strong>
              <small>SECONDS</small>
            </div>
          </div>

          <div className="heroButtons">
            <a href="#swap" className="primaryButton">
              🚀 GET NOVA
            </a>

            <a
              href={X_URL}
              target="_blank"
              rel="noreferrer"
              className="secondaryButton"
            >
              𝕏 FOLLOW ON X
            </a>
          </div>

          <div className="heroSocial">
            <span>Join the crew:</span>

            <a
              href={X_URL}
              target="_blank"
              rel="noreferrer"
            >
              𝕏
            </a>

            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer"
            >
              ✈
            </a>
          </div>
        </div>

        <div className="heroVisual">
          <div className="planet" />

          <div className="orbit orbit1" />
          <div className="orbit orbit2" />

          <div className="moon" />

          <div className="fox">
            🦊
          </div>

          <div className="astronaut">
            👨‍🚀
          </div>

          <div className="rocket">
            🚀
          </div>

          <div className="quote">
            ✦ We're not going to the moon...
            <b>We're building a new orbit.</b>
          </div>
        </div>
      </section>

      {/* TOKEN OVERVIEW */}

      <section className="section" id="about">
        <div className="sectionHeading">
          <span>THE NOVA NETWORK</span>
          <h2>
            Built for the <b>community.</b>
          </h2>

          <p>
            NOVA is a space-themed internet culture project
            focused on community, creativity and transparency.
          </p>
        </div>

        <div className="stats">
          <div className="card">
            <span>◈</span>
            <small>TOTAL SUPPLY</small>
            <strong>1,000,000,000</strong>
            <em>NOVA</em>
          </div>

          <div className="card">
            <span>🚀</span>
            <small>STATUS</small>
            <strong>COMING SOON</strong>
            <em>Pre-Launch</em>
          </div>

          <div className="card">
            <span>⌁</span>
            <small>NETWORK</small>
            <strong>TBA</strong>
            <em>Official chain</em>
          </div>

          <div className="card">
            <span>💎</span>
            <small>DEMO RATE</small>
            <strong>10,000</strong>
            <em>NOVA / $1</em>
          </div>
        </div>
      </section>

      {/* SWAP */}

      <section className="section swapSection" id="swap">
        <div className="sectionHeading center">
          <span>DEMO EXCHANGE</span>

          <h2>
            Get <b>$NOVA</b>
          </h2>

          <p>
            Preview the NOVA swap experience before launch.
          </p>
        </div>

        <div className="swapCard">
          <div className="swapHeader">
            <span>Swap</span>
            <span className="demoTag">DEMO</span>
          </div>

          <div className="inputBox">
            <div>
              <span>YOU PAY</span>

              <input
                value={usd}
                onChange={(e) => calculateNova(e.target.value)}
                inputMode="decimal"
                placeholder="0"
              />
            </div>

            <strong>USD</strong>
          </div>

          <div className="swapArrow">↓</div>

          <div className="inputBox">
            <div>
              <span>YOU RECEIVE</span>

              <input
                value={nova}
                onChange={(e) => calculateUsd(e.target.value)}
                inputMode="numeric"
                placeholder="0"
              />
            </div>

            <strong>$NOVA</strong>
          </div>

          <div className="rate">
            <span>Current demo rate</span>
            <strong>1 USD = 10,000 NOVA</strong>
          </div>

          <button className="swapButton" onClick={demoSwap}>
            🚀 PREVIEW SWAP
          </button>

          {swapStatus && (
            <div className="status">
              {swapStatus}
            </div>
          )}

          <small className="warning">
            Demo only. No real transaction or payment is processed.
          </small>
        </div>
      </section>

      {/* ABOUT */}

      <section className="section about">
        <div className="aboutVisual">
          <div className="aboutPlanet" />
          <div className="bigFox">🦊</div>
        </div>

        <div className="aboutText">
          <span>WHO IS NOVA?</span>

          <h2>
            Not just a token.
            <br />
            <b>A movement.</b>
          </h2>

          <p>
            NOVA combines internet culture, meme energy and
            futuristic space aesthetics into one community-driven
            identity.
          </p>

          <div className="pills">
            <span>✦ Community First</span>
            <span>🚀 Fair Launch</span>
            <span>🌌 Space Culture</span>
            <span>∞ Internet Energy</span>
          </div>
        </div>
      </section>

      {/* TOKENOMICS */}

      <section className="section" id="tokenomics">
        <div className="sectionHeading center">
          <span>THE NUMBERS</span>

          <h2>Tokenomics</h2>

          <p>
            Preliminary concept allocation.
          </p>
        </div>

        <div className="tokenGrid">
          <div className="donutCard">
            <div className="donut">
              <div>
                <strong>1B</strong>
                <span>NOVA</span>
              </div>
            </div>
          </div>

          <div className="allocation">
            <div className="allocationItem">
              <div>
                <i className="purpleDot" />
                Community
              </div>

              <strong>70%</strong>
            </div>

            <div className="bar">
              <span style={{ width: "70%" }} />
            </div>

            <div className="allocationItem">
              <div>
                <i className="blueDot" />
                Liquidity
              </div>

              <strong>20%</strong>
            </div>

            <div className="bar">
              <span style={{ width: "20%" }} />
            </div>

            <div className="allocationItem">
              <div>
                <i className="orangeDot" />
                Marketing
              </div>

              <strong>10%</strong>
            </div>

            <div className="bar">
              <span style={{ width: "10%" }} />
            </div>

            <p>
              These allocations are preliminary and should be
              finalized before any public token launch.
            </p>
          </div>
        </div>
      </section>

      {/* ROADMAP */}

      <section className="section" id="roadmap">
        <div className="sectionHeading center">
          <span>MISSION CONTROL</span>

          <h2>Roadmap</h2>

          <p>From ignition to supernova.</p>
        </div>

        <div className="roadmap">
          <div className="roadCard">
            <span>PHASE 01</span>
            <h3>IGNITION</h3>

            <ul>
              <li>✓ Website launch</li>
              <li>✓ X community</li>
              <li>✓ Telegram community</li>
              <li>✓ Meme campaign</li>
            </ul>
          </div>

          <div className="roadArrow">→</div>

          <div className="roadCard blue">
            <span>PHASE 02</span>
            <h3>ORBIT</h3>

            <ul>
              <li>✓ Token launch</li>
              <li>✓ DEX listing</li>
              <li>✓ Community events</li>
              <li>✓ Creator campaigns</li>
            </ul>
          </div>

          <div className="roadArrow">→</div>

          <div className="roadCard orange">
            <span>PHASE 03</span>
            <h3>SUPERNOVA</h3>

            <ul>
              <li>✓ Partnerships</li>
              <li>✓ Ecosystem expansion</li>
              <li>✓ Community growth</li>
              <li>✓ Bigger ideas</li>
            </ul>
          </div>
        </div>
      </section>

      {/* COMMUNITY */}

      <section className="section">
        <div className="community">
          <div>
            <span>JOIN THE CREW</span>

            <h2>
              The future is
              <b> community.</b>
            </h2>

            <p>
              Follow NOVA and be there when the countdown reaches zero.
            </p>

            <div className="communityButtons">
              <a
                href={X_URL}
                target="_blank"
                rel="noreferrer"
              >
                𝕏 Follow on X
              </a>

              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noreferrer"
              >
                ✈ Join Telegram
              </a>
            </div>
          </div>

          <div className="communityFox">🦊</div>
        </div>
      </section>

      {/* FAQ */}

      <section className="section" id="faq">
        <div className="sectionHeading center">
          <span>QUESTIONS?</span>
          <h2>FAQ</h2>
        </div>

        <div className="faq">
          {faqs.map((faq, index) => (
            <div className="faqItem" key={faq.q}>
              <button
                onClick={() =>
                  setOpenFaq(openFaq === index ? null : index)
                }
              >
                <span>{faq.q}</span>
                <b>{openFaq === index ? "−" : "+"}</b>
              </button>

              {openFaq === index && (
                <p>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* NOTIFY */}

      <section className="section">
        <div className="notify">
          <div>
            <span>STAY IN ORBIT</span>

            <h2>Don't miss the launch.</h2>

            <p>Stay connected with NOVA.</p>
          </div>

          <form onSubmit={subscribe}>
            <input
              type="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button type="submit">
              Notify Me
            </button>
          </form>
        </div>

        {emailStatus && (
          <div className="emailStatus">
            {emailStatus}
          </div>
        )}
      </section>

      {/* FOOTER */}

      <footer>
        <div className="footerInner">
          <div>
            <Logo />

            <p>
              Born on the internet.
              <br />
              Built for the community.
            </p>
          </div>

          <div className="footerLinks">
            <a
              href={X_URL}
              target="_blank"
              rel="noreferrer"
            >
              𝕏
            </a>

            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer"
            >
              ✈
            </a>
          </div>

          <div className="copyright">
            © 2026 NOVA
            <br />
            Built for dreamers. 🚀
          </div>
        </div>
      </footer>

      <style jsx global>{`
        * {
          box-sizing: border-box;
          scroll-behavior: smooth;
        }

        :root {
          --bg: #020611;
          --card: rgba(7, 16, 38, 0.82);
          --purple: #9b4dff;
          --blue: #29caff;
          --pink: #d65cff;
          --orange: #ff9d3d;
          --text: #f8f9ff;
          --muted: #9ca8c3;
          --line: rgba(110, 135, 255, 0.25);
        }

        html {
          background: var(--bg);
        }

        body {
          margin: 0;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(111, 43, 255, 0.23),
              transparent 35%
            ),
            radial-gradient(
              circle at 100% 50%,
              rgba(0, 190, 255, 0.08),
              transparent 30%
            ),
            var(--bg);
          color: var(--text);
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          overflow-x: hidden;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button,
        input {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .stars {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: -5;
        }

        .stars span {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: white;
          opacity: 0.5;
          animation: twinkle 3s infinite;
        }

        @keyframes twinkle {
          50% {
            opacity: 1;
            transform: scale(1.8);
          }
        }

        .glow {
          position: fixed;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: -4;
        }

        .glow1 {
          left: -300px;
          top: 20%;
          background: rgba(133, 48, 255, 0.14);
        }

        .glow2 {
          right: -300px;
          top: 60%;
          background: rgba(0, 191, 255, 0.1);
        }

        .navbarWrap {
          position: fixed;
          top: 18px;
          left: 0;
          right: 0;
          padding: 0 20px;
          z-index: 100;
        }

        .navbar {
          width: min(1180px, 100%);
          margin: auto;
          min-height: 68px;
          padding: 10px 15px;
          display: flex;
          align-items: center;
          gap: 25px;
          border: 1px solid var(--line);
          border-radius: 20px;
          background: rgba(3, 9, 25, 0.82);
          backdrop-filter: blur(22px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .logoIcon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            var(--purple),
            var(--blue)
          );
          box-shadow: 0 0 25px rgba(139, 67, 255, 0.5);
        }

        .logo span {
          background: linear-gradient(
            90deg,
            white,
            #caa3ff,
            #58ddff
          );
          -webkit-background-clip: text;
          color: transparent;
        }

        .navLinks {
          display: flex;
          justify-content: center;
          gap: 23px;
          flex: 1;
        }

        .navLinks a {
          color: #aeb8d0;
          font-size: 12px;
          transition: 0.2s;
        }

        .navLinks a:hover {
          color: white;
        }

        .navActions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .social {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border: 1px solid var(--line);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
        }

        .walletButton {
          border: 0;
          border-radius: 30px;
          padding: 12px 18px;
          color: white;
          font-size: 11px;
          font-weight: 800;
          background: linear-gradient(
            90deg,
            var(--blue),
            var(--purple)
          );
          box-shadow: 0 0 25px rgba(113, 64, 255, 0.35);
        }

        .section {
          width: min(1160px, calc(100% - 40px));
          margin: auto;
          padding: 100px 0;
        }

        .hero {
          min-height: 850px;
          padding-top: 170px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          align-items: center;
          gap: 30px;
        }

        .badge {
          width: fit-content;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 14px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: #d5dcf3;
          background: rgba(20, 31, 70, 0.5);
          font-size: 10px;
          font-weight: 800;
        }

        .badge span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--blue);
          box-shadow: 0 0 12px var(--blue);
        }

        .hero h1 {
          margin: 25px 0 10px;
          font-size: clamp(80px, 11vw, 145px);
          line-height: 0.9;
          letter-spacing: -9px;
          font-weight: 900;
          background: linear-gradient(
            180deg,
            white,
            #e9e5ff 40%,
            #9149ff
          );
          -webkit-background-clip: text;
          color: transparent;
          filter: drop-shadow(
            0 0 30px rgba(139, 67, 255, 0.35)
          );
        }

        .hero h1 span {
          color: white;
          -webkit-text-fill-color: white;
        }

        .hero h2 {
          margin: 20px 0 15px;
          font-size: clamp(23px, 3vw, 38px);
          font-weight: 900;
        }

        .hero h2 b,
        .sectionHeading b,
        .aboutText b,
        .community b {
          background: linear-gradient(
            90deg,
            var(--purple),
            var(--blue)
          );
          -webkit-background-clip: text;
          color: transparent;
        }

        .heroContent > p {
          color: var(--muted);
          line-height: 1.8;
        }

        .timer {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          max-width: 450px;
          gap: 8px;
          margin: 30px 0;
        }

        .timer div {
          padding: 13px 7px;
          text-align: center;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: rgba(6, 17, 40, 0.75);
        }

        .timer strong {
          display: block;
          font-size: 23px;
        }

        .timer small {
          color: #7f8ca8;
          font-size: 8px;
        }

        .heroButtons {
          display: flex;
          gap: 10px;
        }

        .primaryButton,
        .secondaryButton {
          min-height: 48px;
          padding: 0 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 30px;
          font-size: 11px;
          font-weight: 900;
        }

        .primaryButton {
          background: linear-gradient(
            90deg,
            var(--blue),
            var(--purple)
          );
          box-shadow: 0 0 28px rgba(107, 63, 255, 0.4);
        }

        .secondaryButton {
          border: 1px solid var(--line);
          background: rgba(5, 12, 30, 0.7);
        }

        .heroSocial {
          margin-top: 25px;
          display: flex;
          align-items: center;
          gap: 9px;
          color: #7f8ba5;
          font-size: 10px;
        }

        .heroSocial a {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border: 1px solid var(--line);
          border-radius: 50%;
        }

        .heroVisual {
          height: 600px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .planet {
          width: 480px;
          height: 480px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 30% 25%,
              #57e2ff,
              #17479a 28%,
              #081238 58%,
              #01030c 75%
            );
          box-shadow:
            inset -60px -50px 100px #01020b,
            0 0 80px rgba(45, 157, 255, 0.25);
        }

        .orbit {
          position: absolute;
          width: 560px;
          height: 170px;
          border: 1px solid rgba(140, 83, 255, 0.4);
          border-radius: 50%;
        }

        .orbit1 {
          transform: rotate(-17deg);
        }

        .orbit2 {
          transform: rotate(20deg);
          border-color: rgba(44, 202, 255, 0.25);
        }

        .moon {
          position: absolute;
          width: 70px;
          height: 70px;
          right: 5%;
          top: 5%;
          border-radius: 50%;
          background: radial-gradient(
            circle at 30% 30%,
            #d8d4e6,
            #2b2b47
          );
        }

        .fox {
          position: absolute;
          z-index: 3;
          font-size: 210px;
          top: 130px;
          left: 23%;
          filter: drop-shadow(
            0 0 30px rgba(160, 70, 255, 0.8)
          );
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float {
          50% {
            transform: translateY(-18px) rotate(2deg);
          }
        }

        .astronaut {
          position: absolute;
          right: 7%;
          top: 5%;
          font-size: 55px;
          animation: float 3s ease-in-out infinite;
        }

        .rocket {
          position: absolute;
          right: 8%;
          bottom: 20%;
          font-size: 60px;
          transform: rotate(-20deg);
          filter: drop-shadow(0 0 20px #a84fff);
          animation: rocket 3s ease-in-out infinite;
        }

        @keyframes rocket {
          50% {
            transform: translateY(-14px) rotate(-20deg);
          }
        }

        .quote {
          position: absolute;
          right: 0;
          bottom: 30px;
          width: 290px;
          padding: 16px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(4, 13, 31, 0.82);
          color: #cbd4ea;
          font-size: 10px;
          line-height: 1.7;
        }

        .quote b {
          display: block;
          color: #ffb43e;
        }

        .sectionHeading {
          margin-bottom: 35px;
        }

        .sectionHeading > span,
        .aboutText > span,
        .community > div > span {
          color: #8996b5;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 3px;
        }

        .sectionHeading h2,
        .aboutText h2,
        .community h2 {
          margin: 9px 0;
          font-size: clamp(32px, 5vw, 50px);
          line-height: 1;
        }

        .sectionHeading p,
        .aboutText p,
        .community p {
          max-width: 650px;
          color: var(--muted);
          line-height: 1.8;
        }

        .center {
          text-align: center;
        }

        .center p {
          margin-left: auto;
          margin-right: auto;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .card {
          min-height: 190px;
          padding: 20px;
          border: 1px solid var(--line);
          border-radius: 18px;
          background: var(--card);
        }

        .card > span {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          margin-bottom: 25px;
          border-radius: 12px;
          background: rgba(121, 69, 255, 0.13);
          color: #a271ff;
        }

        .card small {
          display: block;
          color: #7f8ba5;
          font-size: 9px;
          margin-bottom: 7px;
        }

        .card strong {
          display: block;
          font-size: 18px;
        }

        .card em {
          display: block;
          margin-top: 5px;
          color: #707d99;
          font-style: normal;
          font-size: 9px;
        }

        .swapSection {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .swapCard {
          width: min(470px, 100%);
          padding: 20px;
          border: 1px solid rgba(120, 90, 255, 0.35);
          border-radius: 22px;
          background:
            linear-gradient(
              145deg,
              rgba(14, 28, 65, 0.9),
              rgba(6, 10, 28, 0.95)
            );
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.35);
        }

        .swapHeader {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          font-weight: 800;
        }

        .demoTag {
          padding: 5px 9px;
          border-radius: 20px;
          color: #56dfff;
          background: rgba(50, 200, 255, 0.08);
          font-size: 8px;
        }

        .inputBox {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 17px;
          border: 1px solid rgba(110, 130, 255, 0.2);
          border-radius: 15px;
          background: rgba(0, 0, 0, 0.2);
        }

        .inputBox div {
          flex: 1;
        }

        .inputBox span {
          display: block;
          color: #74819e;
          font-size: 8px;
          margin-bottom: 7px;
        }

        .inputBox input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: white;
          font-size: 25px;
          font-weight: 800;
        }

        .inputBox strong {
          color: #a878ff;
        }

        .swapArrow {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          margin: -4px auto;
          position: relative;
          z-index: 2;
          border: 1px solid var(--line);
          border-radius: 50%;
          background: #07112b;
          color: #a873ff;
        }

        .rate {
          display: flex;
          justify-content: space-between;
          margin: 17px 0;
          color: #7785a2;
          font-size: 9px;
        }

        .rate strong {
          color: #dce2f3;
        }

        .swapButton {
          width: 100%;
          min-height: 50px;
          border: 0;
          border-radius: 13px;
          color: white;
          font-weight: 900;
          background: linear-gradient(
            90deg,
            var(--blue),
            var(--purple)
          );
        }

        .status {
          margin-top: 12px;
          padding: 12px;
          border: 1px solid rgba(50, 220, 255, 0.2);
          border-radius: 10px;
          color: #62ddff;
          background: rgba(30, 190, 255, 0.06);
          text-align: center;
          font-size: 10px;
        }

        .warning {
          display: block;
          margin-top: 12px;
          color: #687690;
          text-align: center;
          font-size: 8px;
        }

        .about {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 55px;
        }

        .aboutVisual {
          height: 350px;
          position: relative;
          display: grid;
          place-items: center;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 22px;
          background: #050c22;
        }

        .aboutPlanet {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(
            circle at 30% 30%,
            #44d6ff,
            #18336e 40%,
            #020716 72%
          );
        }

        .bigFox {
          position: absolute;
          font-size: 150px;
          filter: drop-shadow(
            0 0 35px rgba(145, 65, 255, 0.75)
          );
          animation: float 4s infinite ease-in-out;
        }

        .pills {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 25px;
        }

        .pills span {
          padding: 9px 13px;
          border: 1px solid var(--line);
          border-radius: 30px;
          color: #b9c4dc;
          font-size: 9px;
        }

        .tokenGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .donutCard,
        .allocation {
          min-height: 400px;
          padding: 30px;
          border: 1px solid var(--line);
          border-radius: 20px;
          background: var(--card);
        }

        .donutCard {
          display: grid;
          place-items: center;
        }

        .donut {
          width: 270px;
          height: 270px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: conic-gradient(
            var(--purple) 0 70%,
            #d65cbc 70% 90%,
            var(--orange) 90% 100%
          );
          box-shadow: 0 0 60px rgba(130, 70, 255, 0.2);
        }

        .donut::before {
          content: "";
          position: absolute;
          width: 190px;
          height: 190px;
          border-radius: 50%;
          background: #061026;
        }

        .donut div {
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .donut strong {
          display: block;
          font-size: 42px;
        }

        .donut span {
          color: #8490aa;
          font-size: 10px;
        }

        .allocation {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .allocationItem {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 15px;
        }

        .allocationItem div {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .allocationItem i {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .purpleDot {
          background: var(--purple);
        }

        .blueDot {
          background: var(--blue);
        }

        .orangeDot {
          background: var(--orange);
        }

        .bar {
          height: 7px;
          margin: 9px 0;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          overflow: hidden;
        }

        .bar span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            var(--purple),
            var(--blue)
          );
        }

        .allocation p {
          color: #6e7b96;
          font-size: 9px;
          line-height: 1.7;
          margin-top: 20px;
        }

        .roadmap {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr;
          gap: 12px;
          align-items: center;
        }

        .roadCard {
          min-height: 280px;
          padding: 27px;
          border: 1px solid rgba(150, 75, 255, 0.35);
          border-radius: 18px;
          background: rgba(30, 13, 55, 0.55);
        }

        .roadCard.blue {
          border-color: rgba(40, 200, 255, 0.3);
        }

        .roadCard.orange {
          border-color: rgba(255, 160, 60, 0.3);
        }

        .roadCard > span {
          color: #a879ff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .roadCard.blue > span {
          color: var(--blue);
        }

        .roadCard.orange > span {
          color: var(--orange);
        }

        .roadCard h3 {
          margin: 8px 0 25px;
        }

        .roadCard ul {
          display: grid;
          gap: 14px;
          padding: 0;
          margin: 0;
          list-style: none;
          color: #b5bfd5;
          font-size: 10px;
        }

        .roadArrow {
          color: #687592;
          font-size: 28px;
        }

        .community {
          min-height: 320px;
          padding: 50px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          border: 1px solid var(--line);
          border-radius: 25px;
          background:
            radial-gradient(
              circle at 85% 50%,
              rgba(42, 154, 255, 0.25),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              rgba(9, 26, 60, 0.9),
              rgba(30, 8, 57, 0.9)
            );
        }

        .communityFox {
          position: absolute;
          right: 10%;
          font-size: 170px;
          filter: drop-shadow(
            0 0 35px rgba(145, 70, 255, 0.6)
          );
          animation: float 4s infinite ease-in-out;
        }

        .communityButtons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 25px;
        }

        .communityButtons a {
          padding: 13px 20px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 900;
        }

        .communityButtons a:first-child {
          background: white;
          color: #070b19;
        }

        .communityButtons a:last-child {
          background: #229bd3;
        }

        .faq {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .faqItem {
          border: 1px solid var(--line);
          border-radius: 13px;
          overflow: hidden;
          background: rgba(6, 16, 37, 0.65);
        }

        .faqItem button {
          width: 100%;
          padding: 17px;
          display: flex;
          justify-content: space-between;
          border: 0;
          background: transparent;
          color: white;
          text-align: left;
          font-size: 10px;
        }

        .faqItem button b {
          color: #a06cff;
          font-size: 18px;
        }

        .faqItem p {
          margin: 0;
          padding: 0 17px 17px;
          color: #8490aa;
          line-height: 1.7;
          font-size: 10px;
        }

        .notify {
          padding: 35px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          border: 1px solid var(--line);
          border-radius: 20px;
          background: rgba(7, 18, 42, 0.8);
        }

        .notify h2 {
          margin: 7px 0;
        }

        .notify p {
          margin: 0;
          color: #7e8ba5;
          font-size: 11px;
        }

        .notify form {
          width: min(430px, 100%);
          display: flex;
          padding: 5px;
          border: 1px solid var(--line);
          border-radius: 40px;
        }

        .notify input {
          min-width: 0;
          flex: 1;
          padding: 12px 15px;
          border: 0;
          outline: 0;
          background: transparent;
          color: white;
          font-size: 10px;
        }

        .notify button {
          padding: 0 20px;
          border: 0;
          border-radius: 30px;
          background: linear-gradient(
            90deg,
            var(--blue),
            var(--purple)
          );
          color: white;
          font-size: 10px;
          font-weight: 900;
        }

        .emailStatus {
          margin-top: 10px;
          color: #5edfff;
          text-align: center;
          font-size: 10px;
        }

        footer {
          border-top: 1px solid rgba(110, 130, 255, 0.15);
        }

        .footerInner {
          width: min(1160px, calc(100% - 40px));
          margin: auto;
          padding: 40px 0;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 25px;
        }

        .footerInner p {
          color: #697792;
          font-size: 9px;
          line-height: 1.7;
        }

        .footerLinks {
          display: flex;
          gap: 10px;
        }

        .footerLinks a {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          border: 1px solid var(--line);
          border-radius: 50%;
        }

        .copyright {
          text-align: right;
          color: #697792;
          font-size: 9px;
          line-height: 1.8;
        }

        .modalOverlay {
          position: fixed;
          inset: 0;
          z-index: 500;
          display: grid;
          place-items: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(10px);
        }

        .walletModal {
          width: min(410px, 100%);
          position: relative;
          padding: 30px;
          border: 1px solid rgba(130, 90, 255, 0.45);
          border-radius: 22px;
          background:
            linear-gradient(
              145deg,
              #0b1738,
              #050916
            );
          box-shadow: 0 30px 100px rgba(0, 0, 0, 0.7);
        }

        .closeModal {
          position: absolute;
          right: 15px;
          top: 12px;
          border: 0;
          background: transparent;
          color: #8794af;
          font-size: 25px;
        }

        .modalIcon {
          width: 55px;
          height: 55px;
          display: grid;
          place-items: center;
          margin-bottom: 15px;
          border-radius: 15px;
          background: rgba(130, 70, 255, 0.15);
          font-size: 25px;
        }

        .walletModal h3 {
          margin: 0 0 8px;
          font-size: 22px;
        }

        .walletModal > p {
          color: #8490aa;
          font-size: 10px;
          line-height: 1.6;
        }

        .walletOption {
          width: 100%;
          margin-top: 10px;
          padding: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          color: white;
          font-size: 11px;
          text-align: left;
        }

        .walletOption:hover {
          border-color: #995cff;
          background: rgba(140, 70, 255, 0.08);
        }

        .walletModal small {
          display: block;
          margin-top: 18px;
          color: #65728d;
          text-align: center;
          font-size: 8px;
        }

        @media (max-width: 1000px) {
          .hero {
            grid-template-columns: 1fr;
          }

          .heroVisual {
            margin-top: 20px;
          }

          .stats {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 760px) {
          .navbarWrap {
            padding: 0 10px;
          }

          .navbar {
            gap: 10px;
          }

          .navLinks {
            display: none;
          }

          .social {
            display: none;
          }

          .walletButton {
            padding: 10px 12px;
            font-size: 9px;
          }

          .section {
            width: calc(100% - 24px);
            padding: 70px 0;
          }

          .hero {
            padding-top: 130px;
          }

          .heroButtons {
            flex-direction: column;
          }

          .heroButtons a {
            width: 100%;
          }

          .heroVisual {
            height: 430px;
            transform: scale(0.78);
            margin: -30px;
          }

          .planet {
            width: 350px;
            height: 350px;
          }

          .fox {
            font-size: 150px;
            left: 20%;
            top: 120px;
          }

          .quote {
            bottom: 0;
          }

          .about,
          .tokenGrid {
            grid-template-columns: 1fr;
          }

          .roadmap {
            grid-template-columns: 1fr;
          }

          .roadArrow {
            display: none;
          }

          .faq {
            grid-template-columns: 1fr;
          }

          .community {
            padding: 30px;
          }

          .communityFox {
            opacity: 0.2;
            right: -20px;
          }

          .notify {
            flex-direction: column;
            align-items: stretch;
          }

          .notify form {
            width: 100%;
          }

          .footerInner {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .footerInner > div {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .copyright {
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .stats {
            grid-template-columns: 1fr;
          }

          .timer {
            gap: 4px;
          }

          .timer strong {
            font-size: 18px;
          }

          .hero h1 {
            font-size: 70px;
            letter-spacing: -5px;
          }

          .notify form {
            flex-direction: column;
            border-radius: 14px;
            gap: 5px;
          }

          .notify button {
            min-height: 40px;
          }
        }
      `}</style>
    </main>
  );
}