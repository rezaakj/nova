"use client";

import { useEffect, useMemo, useState } from "react";

const TOTAL_SUPPLY = 1_000_000_000;
const NOVA_PRICE = 0.000001;
const LAUNCH_DATE = Date.now() + 40 * 24 * 60 * 60 * 1000;

const X_URL = "https://x.com/NOVAverse12";
const TELEGRAM_URL = "https://t.me/NOVAFOX18";

const faqs = [
  {
    q: "When will NOVA launch?",
    a: "NOVA is currently in the pre-launch phase. The countdown shows the planned launch window.",
  },
  {
    q: "Can I buy NOVA now?",
    a: "The current Swap is a demo interface. Real purchases are disabled.",
  },
  {
    q: "Which wallet can I use?",
    a: "The demo detects compatible browser wallets such as MetaMask when available.",
  },
  {
    q: "Will there be a presale?",
    a: "The presale interface is currently in demo mode and does not process real payments.",
  },
  {
    q: "Is NOVA audited?",
    a: "Audit information will be published here if and when an independent audit is completed.",
  },
  {
    q: "What is NOVA?",
    a: "NOVA is a community-focused space-themed crypto concept built around the NOVAFOX mascot.",
  },
];

function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className={`logo ${small ? "smallLogo" : ""}`}>
      <div className="logoMark">✦</div>
      <span>NOVA</span>
    </div>
  );
}

function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * 3 + 1}px`,
        delay: `${Math.random() * 5}s`,
        duration: `${Math.random() * 4 + 3}s`,
      })),
    []
  );

  return (
    <div className="stars">
      {stars.map((star) => (
        <span
          key={star.id}
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [amount, setAmount] = useState("");
  const [novaAmount, setNovaAmount] = useState("0");
  const [demoBalance, setDemoBalance] = useState(0);
  const [transactions, setTransactions] = useState<string[]>([]);
  const [notify, setNotify] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [time, setTime] = useState({
    days: 40,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, LAUNCH_DATE - Date.now());

      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, []);

  const toast = (message: string) => {
    setNotify(message);

    setTimeout(() => {
      setNotify("");
    }, 3000);
  };

  const connectWallet = async () => {
    try {
      setConnecting(true);

      const ethereum = (window as any).ethereum;

      if (!ethereum) {
        toast("No browser wallet detected. Install a compatible wallet.");
        setConnecting(false);
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts?.[0]) {
        setWallet(accounts[0]);
        toast("Wallet connected successfully 🚀");
      }
    } catch {
      toast("Wallet connection cancelled.");
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWallet("");
    toast("Wallet disconnected.");
  };

  const calculateNova = (value: string) => {
    setAmount(value);

    const number = Number(value);

    if (!number || number <= 0) {
      setNovaAmount("0");
      return;
    }

    setNovaAmount((number / NOVA_PRICE).toLocaleString());
  };

  const demoSwap = () => {
    const number = Number(amount);

    if (!wallet) {
      toast("Connect your wallet first.");
      return;
    }

    if (!number || number <= 0) {
      toast("Enter an amount first.");
      return;
    }

    const received = number / NOVA_PRICE;

    setDemoBalance((prev) => prev + received);

    setTransactions((prev) => [
      `Demo Swap • ${received.toLocaleString()} NOVA`,
      ...prev,
    ]);

    setAmount("");
    setNovaAmount("0");

    toast("Demo swap completed — no real funds moved.");
  };

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      toast("Enter a valid email.");
      return;
    }

    setSubscribed(true);
    setEmail("");

    toast("You're on the NOVA list 🚀");
  };

  return (
    <main>
      <Stars />

      {notify && <div className="toast">{notify}</div>}

      {/* NAVBAR */}

      <header className="nav">
        <nav>
          <a href="#home">
            <Logo />
          </a>

          <div className="links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#swap">Swap</a>
            <a href="#tokenomics">Tokenomics</a>
            <a href="#roadmap">Roadmap</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="navActions">
            <a href={X_URL} target="_blank" rel="noreferrer">
              𝕏
            </a>

            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
              ✈
            </a>

            <button onClick={wallet ? disconnectWallet : connectWallet}>
              {connecting
                ? "Connecting..."
                : wallet
                ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
                : "Connect Wallet"}
            </button>
          </div>
        </nav>
      </header>

      {/* HERO */}

      <section className="hero section" id="home">
        <div className="heroText">
          <div className="badge">🚀 LAUNCHING IN 40 DAYS</div>

          <h1>
            $<span>N</span>OVA
          </h1>

          <h2>
            THE NEXT <span>MEME IN ORBIT.</span>
          </h2>

          <p>
            Born on the internet.
            <br />
            Built for the community.
          </p>

          <div className="countdown">
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
              <small>MIN</small>
            </div>

            <div>
              <strong>{String(time.seconds).padStart(2, "0")}</strong>
              <small>SEC</small>
            </div>
          </div>

          <div className="heroButtons">
            <a href="#swap" className="primary">
              🚀 ENTER NOVA
            </a>

            <a
              href={X_URL}
              target="_blank"
              rel="noreferrer"
              className="secondary"
            >
              𝕏 FOLLOW ON X
            </a>
          </div>

          <div className="socialRow">
            <span>Join the crew:</span>

            <a href={X_URL} target="_blank" rel="noreferrer">
              𝕏
            </a>

            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
              ✈
            </a>
          </div>
        </div>

        <div className="heroVisual">
          <div className="planet" />

          <div className="orbit orbit1" />
          <div className="orbit orbit2" />

          <div className="fox">
            <div className="helmet">
              <div className="ears">
                <span>▲</span>
                <span>▲</span>
              </div>

              <div className="visor">
                <div className="foxFace">
                  <div className="eyes">
                    <i />
                    <i />
                  </div>

                  <div className="nose" />

                  <div className="mouth">⌣</div>
                </div>
              </div>

              <div className="helmetName">NOVA</div>
            </div>

            <div className="body">
              <div className="chest">✦</div>
            </div>
          </div>

          <div className="rocket">🚀</div>
        </div>
      </section>

      {/* SWAP */}

      <section className="section swapSection" id="swap">
        <div className="sectionTitle">
          <span>MISSION CONTROL</span>
          <h2>NOVA Swap</h2>
          <p>
            Test the NOVA experience before launch.
          </p>
        </div>

        <div className="swapGrid">
          <div className="swapCard">
            <div className="swapHeader">
              <div>
                <small>DEMO MODE</small>
                <h3>Get NOVA</h3>
              </div>

              <div className="novaIcon">✦</div>
            </div>

            <div className="inputBox">
              <div>
                <span>Amount</span>
                <span>Demo</span>
              </div>

              <input
                type="number"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => calculateNova(e.target.value)}
              />

              <b>USDC</b>
            </div>

            <div className="swapArrow">↓</div>

            <div className="inputBox">
              <div>
                <span>You receive</span>
                <span>NOVA</span>
              </div>

              <input
                value={novaAmount}
                readOnly
              />

              <b>✦</b>
            </div>

            <div className="rate">
              <span>Demo rate</span>
              <strong>1 USDC = 1,000,000 NOVA</strong>
            </div>

            <button className="swapButton" onClick={demoSwap}>
              {wallet ? "SIMULATE SWAP →" : "CONNECT WALLET"}
            </button>

            <p className="warning">
              ⚠ Demo only — no real cryptocurrency is transferred.
            </p>
          </div>

          <div className="dashboardCard">
            <div className="dashboardTop">
              <div>
                <small>YOUR NOVA</small>
                <h3>{demoBalance.toLocaleString()}</h3>
              </div>

              <div className="live">
                <i />
                DEMO
              </div>
            </div>

            <div className="dashStats">
              <div>
                <span>Wallet</span>
                <strong>
                  {wallet
                    ? `${wallet.slice(0, 8)}...`
                    : "Not connected"}
                </strong>
              </div>

              <div>
                <span>Allocation</span>
                <strong>{demoBalance.toLocaleString()} NOVA</strong>
              </div>

              <div>
                <span>Claim status</span>
                <strong>Not available</strong>
              </div>
            </div>

            <h4>Activity</h4>

            <div className="activity">
              {transactions.length === 0 ? (
                <div className="empty">
                  No demo swaps yet.
                </div>
              ) : (
                transactions.map((tx, index) => (
                  <div className="transaction" key={index}>
                    <span>✓</span>
                    <div>
                      <strong>{tx}</strong>
                      <small>Demo transaction</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TOKEN */}

      <section className="section" id="tokenomics">
        <div className="sectionTitle">
          <span>NOVA / TOKEN</span>
          <h2>Token Overview</h2>
          <p>Simple. Transparent. Community-focused.</p>
        </div>

        <div className="stats">
          <div>
            <span>Total Supply</span>
            <strong>1B</strong>
            <small>NOVA</small>
          </div>

          <div>
            <span>Chain</span>
            <strong>TBA</strong>
            <small>Official chain</small>
          </div>

          <div>
            <span>Status</span>
            <strong>PRE-LAUNCH</strong>
            <small>Coming soon</small>
          </div>

          <div>
            <span>Contract</span>
            <strong>TBA</strong>
            <small>Not released</small>
          </div>
        </div>
      </section>

      {/* ABOUT */}

      <section className="section about" id="about">
        <div className="aboutVisual">
          <div className="bigPlanet" />
          <div className="aboutFox">🦊</div>
        </div>

        <div>
          <span className="eyebrow">WHO IS NOVA?</span>

          <h2>
            Not just a token.
            <br />
            A <span>movement.</span>
          </h2>

          <p>
            NOVA is a space-themed community concept built around an
            internet-native mascot, futuristic visuals and a strong
            community identity.
          </p>

          <div className="pills">
            <span>✦ Community First</span>
            <span>🚀 Fair Launch</span>
            <span>🌌 Space Culture</span>
            <span>🦊 NOVAFOX</span>
          </div>
        </div>
      </section>

      {/* TOKENOMICS */}

      <section className="section">
        <div className="sectionTitle">
          <span>THE NUMBERS</span>
          <h2>Tokenomics</h2>
        </div>

        <div className="tokenGrid">
          <div className="donut">
            <div>
              <strong>1B</strong>
              <span>Total Supply</span>
            </div>
          </div>

          <div className="allocation">
            <div>
              <span>🟣 Community</span>
              <b>70%</b>
            </div>

            <div className="bar">
              <i style={{ width: "70%" }} />
            </div>

            <div>
              <span>🔵 Liquidity</span>
              <b>20%</b>
            </div>

            <div className="bar">
              <i style={{ width: "20%" }} />
            </div>

            <div>
              <span>🟠 Marketing</span>
              <b>10%</b>
            </div>

            <div className="bar">
              <i style={{ width: "10%" }} />
            </div>

            <p>
              Preliminary concept allocation. Final tokenomics should
              be confirmed before any public launch.
            </p>
          </div>
        </div>
      </section>

      {/* ROADMAP */}

      <section className="section" id="roadmap">
        <div className="sectionTitle">
          <span>MISSION CONTROL</span>
          <h2>Roadmap</h2>
        </div>

        <div className="roadmap">
          <div className="roadCard">
            <small>PHASE 01</small>
            <h3>IGNITION</h3>
            <p>✓ Website</p>
            <p>✓ X Community</p>
            <p>✓ Telegram</p>
            <p>✓ Meme Factory</p>
          </div>

          <div className="roadCard blue">
            <small>PHASE 02</small>
            <h3>ORBIT</h3>
            <p>◉ Token Launch</p>
            <p>◉ DEX Listing</p>
            <p>◉ Community Events</p>
            <p>◉ Creator Campaigns</p>
          </div>

          <div className="roadCard orange">
            <small>PHASE 03</small>
            <h3>SUPERNOVA</h3>
            <p>◉ Partnerships</p>
            <p>◉ Ecosystem</p>
            <p>◉ Global Community</p>
            <p>◉ Bigger Ideas</p>
          </div>
        </div>
      </section>

      {/* FAQ */}

      <section className="section" id="faq">
        <div className="sectionTitle">
          <span>QUESTIONS?</span>
          <h2>FAQ</h2>
        </div>

        <div className="faq">
          {faqs.map((item, index) => (
            <div key={item.q} className="faqItem">
              <button
                onClick={() =>
                  setOpenFaq(openFaq === index ? null : index)
                }
              >
                <span>{item.q}</span>
                <b>{openFaq === index ? "−" : "+"}</b>
              </button>

              {openFaq === index && (
                <p>{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* COMMUNITY */}

      <section className="section community">
        <div>
          <span>JOIN THE CREW</span>

          <h2>
            The future is
            <br />
            <strong>community.</strong>
          </h2>

          <p>
            Follow NOVA and watch the countdown.
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

        <div className="communityPlanet">
          🦊
        </div>
      </section>

      {/* EMAIL */}

      <section className="section notify">
        <div>
          <span>STAY IN ORBIT</span>
          <h2>Don't miss the launch.</h2>
        </div>

        {subscribed ? (
          <div className="success">
            🚀 You&apos;re on the list!
          </div>
        ) : (
          <form onSubmit={subscribe}>
            <input
              type="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button>
              Notify Me
            </button>
          </form>
        )}
      </section>

      {/* FOOTER */}

      <footer>
        <Logo small />

        <p>
          Born on the internet. Built for the community.
        </p>

        <div>
          <a href={X_URL} target="_blank" rel="noreferrer">
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

        <small>
          © 2026 NOVA — Concept website.
        </small>
      </footer>

      <style jsx global>{`
        * {
          box-sizing: border-box;
          scroll-behavior: smooth;
        }

        html {
          background: #02030a;
        }

        body {
          margin: 0;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(118, 48, 255, 0.28),
              transparent 38%
            ),
            radial-gradient(
              circle at 100% 50%,
              rgba(0, 191, 255, 0.12),
              transparent 30%
            ),
            #02030a;
          color: white;
          font-family:
            Inter,
            Arial,
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

        .stars {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: -1;
        }

        .stars span {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle infinite ease-in-out;
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.15;
          }

          50% {
            opacity: 0.9;
          }
        }

        .nav {
          position: fixed;
          top: 15px;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 0 20px;
        }

        nav {
          max-width: 1180px;
          margin: auto;
          min-height: 66px;
          padding: 10px 15px;
          display: flex;
          align-items: center;
          gap: 25px;
          border: 1px solid rgba(130, 100, 255, 0.3);
          border-radius: 20px;
          background: rgba(3, 7, 20, 0.78);
          backdrop-filter: blur(25px);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .logoMark {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            #a344ff,
            #21cfff
          );
          box-shadow:
            0 0 30px rgba(140, 60, 255, 0.6);
        }

        .smallLogo {
          font-size: 18px;
        }

        .links {
          flex: 1;
          display: flex;
          justify-content: center;
          gap: 25px;
        }

        .links a {
          color: #9da8c4;
          font-size: 12px;
          transition: 0.2s;
        }

        .links a:hover {
          color: white;
        }

        .navActions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .navActions > a {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .navActions button {
          border: 0;
          color: white;
          padding: 11px 18px;
          border-radius: 30px;
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
          background: linear-gradient(
            90deg,
            #21cfff,
            #9743ff
          );
          box-shadow:
            0 0 25px rgba(130, 65, 255, 0.4);
        }

        .section {
          width: min(1160px, calc(100% - 40px));
          margin: auto;
          padding: 105px 0;
        }

        .hero {
          min-height: 850px;
          padding-top: 165px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          align-items: center;
        }

        .badge {
          display: inline-block;
          padding: 9px 15px;
          border-radius: 30px;
          border: 1px solid rgba(111, 130, 255, 0.4);
          color: #cfd5ff;
          background: rgba(50, 40, 110, 0.25);
          font-size: 10px;
          font-weight: 900;
        }

        .heroText h1 {
          margin: 20px 0 5px;
          font-size: clamp(80px, 11vw, 145px);
          line-height: 0.9;
          letter-spacing: -9px;
          background: linear-gradient(
            180deg,
            white,
            #cdbdff 45%,
            #8743ff
          );
          -webkit-background-clip: text;
          color: transparent;
          filter:
            drop-shadow(
              0 0 30px rgba(125, 50, 255, 0.4)
            );
        }

        .heroText h1 span {
          background: linear-gradient(
            180deg,
            white,
            #38d1ff
          );
          -webkit-background-clip: text;
          color: transparent;
        }

        .heroText h2 {
          font-size: clamp(24px, 3vw, 38px);
          margin: 20px 0 10px;
        }

        .heroText h2 span,
        .about h2 span {
          background: linear-gradient(
            90deg,
            #a64aff,
            #32d0ff
          );
          -webkit-background-clip: text;
          color: transparent;
        }

        .heroText p {
          color: #a2acc4;
          line-height: 1.8;
        }

        .countdown {
          display: grid;
          grid-template-columns: repeat(4, 85px);
          gap: 8px;
          margin: 30px 0;
        }

        .countdown div {
          padding: 13px 5px;
          text-align: center;
          border-radius: 12px;
          border: 1px solid rgba(100, 125, 255, 0.25);
          background: rgba(8, 18, 43, 0.7);
        }

        .countdown strong {
          display: block;
          font-size: 22px;
        }

        .countdown small {
          color: #74819e;
          font-size: 8px;
        }

        .heroButtons {
          display: flex;
          gap: 10px;
        }

        .primary,
        .secondary {
          min-height: 48px;
          padding: 0 23px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 30px;
          font-size: 11px;
          font-weight: 900;
        }

        .primary {
          background: linear-gradient(
            90deg,
            #25cfff,
            #9a43ff
          );
          box-shadow:
            0 0 30px rgba(125, 65, 255, 0.45);
        }

        .secondary {
          border: 1px solid rgba(110, 130, 255, 0.4);
        }

        .socialRow {
          margin-top: 25px;
          display: flex;
          align-items: center;
          gap: 9px;
          color: #77839e;
          font-size: 10px;
        }

        .socialRow a {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(120, 130, 190, 0.3);
          border-radius: 50%;
        }

        .heroVisual {
          height: 600px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .planet {
          position: absolute;
          width: 470px;
          height: 470px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 30% 25%,
              #55e2ff,
              #1b4895 25%,
              #071133 60%,
              #010208 75%
            );
          box-shadow:
            inset -50px -40px 90px black,
            0 0 80px rgba(40, 170, 255, 0.3);
        }

        .orbit {
          position: absolute;
          width: 560px;
          height: 180px;
          border: 1px solid rgba(130, 70, 255, 0.4);
          border-radius: 50%;
        }

        .orbit1 {
          transform: rotate(-18deg);
        }

        .orbit2 {
          transform: rotate(20deg);
          border-color: rgba(40, 200, 255, 0.25);
        }

        .fox {
          position: relative;
          z-index: 5;
          animation: float 5s ease-in-out infinite;
        }

        @keyframes float {
          50% {
            transform: translateY(-18px);
          }
        }

        .helmet {
          width: 245px;
          height: 245px;
          position: relative;
          border-radius: 48%;
          background: linear-gradient(
            135deg,
            #858bad,
            #252944 55%,
            #0a0d20
          );
          border: 8px solid #aeb8e6;
          box-shadow:
            inset 0 0 35px black,
            0 0 40px rgba(100, 60, 255, 0.6);
        }

        .visor {
          position: absolute;
          inset: 28px;
          overflow: hidden;
          border-radius: 45%;
          border: 6px solid #5b648e;
          background: linear-gradient(
            135deg,
            #1b1d40,
            #02040e
          );
        }

        .ears {
          position: absolute;
          top: -50px;
          left: 35px;
          right: 35px;
          display: flex;
          justify-content: space-between;
          color: #e9822a;
          font-size: 58px;
          z-index: -1;
        }

        .foxFace {
          position: absolute;
          inset: 55px 30px 25px;
          border-radius: 45%;
          background: linear-gradient(
            145deg,
            #ffae3b,
            #c75d1b
          );
        }

        .eyes {
          position: absolute;
          top: 55px;
          left: 15px;
          right: 15px;
          display: flex;
          justify-content: space-between;
        }

        .eyes i {
          width: 34px;
          height: 15px;
          border-radius: 50%;
          background: #05060b;
        }

        .nose {
          position: absolute;
          top: 90px;
          left: 50%;
          transform: translateX(-50%);
          width: 17px;
          height: 13px;
          border-radius: 50%;
          background: black;
        }

        .mouth {
          position: absolute;
          top: 100px;
          left: 50%;
          transform: translateX(-50%);
          color: black;
          font-size: 25px;
        }

        .helmetName {
          position: absolute;
          bottom: -17px;
          left: 50%;
          transform: translateX(-50%);
          padding: 5px 24px;
          border-radius: 30px;
          background: #151a3a;
          border: 1px solid #6b75a8;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 3px;
        }

        .body {
          width: 175px;
          height: 145px;
          margin: -3px auto;
          border-radius: 45px 45px 25px 25px;
          border: 5px solid #555e8c;
          background: linear-gradient(
            145deg,
            #292e51,
            #090c1d
          );
        }

        .chest {
          width: 48px;
          height: 48px;
          margin: 35px auto;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: #b35aff;
          border: 1px solid #7180ff;
        }

        .rocket {
          position: absolute;
          right: 8%;
          top: 5%;
          font-size: 65px;
          filter:
            drop-shadow(
              0 0 25px #a54dff
            );
          animation: rocket 3s infinite ease-in-out;
        }

        @keyframes rocket {
          50% {
            transform: translateY(-15px) rotate(-10deg);
          }
        }

        .sectionTitle {
          margin-bottom: 30px;
        }

        .sectionTitle > span,
        .eyebrow,
        .community > div > span,
        .notify > div > span {
          color: #8995b6;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 3px;
        }

        .sectionTitle h2,
        .about h2 {
          font-size: clamp(32px, 5vw, 50px);
          margin: 8px 0;
        }

        .sectionTitle p {
          color: #8995b6;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .stats > div {
          padding: 25px;
          min-height: 170px;
          border: 1px solid rgba(110, 130, 255, 0.23);
          border-radius: 18px;
          background: rgba(5, 15, 36, 0.75);
        }

        .stats span,
        .stats small {
          display: block;
          color: #7f8ca9;
          font-size: 10px;
        }

        .stats strong {
          display: block;
          margin: 30px 0 5px;
          font-size: 19px;
        }

        /* SWAP */

        .swapSection {
          padding-top: 50px;
        }

        .swapGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .swapCard,
        .dashboardCard {
          padding: 27px;
          border: 1px solid rgba(125, 91, 255, 0.35);
          border-radius: 22px;
          background:
            linear-gradient(
              145deg,
              rgba(22, 18, 60, 0.85),
              rgba(4, 10, 27, 0.9)
            );
        }

        .swapHeader,
        .dashboardTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .swapHeader small,
        .dashboardTop small {
          color: #8b94b0;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .swapHeader h3 {
          margin: 5px 0 20px;
          font-size: 25px;
        }

        .novaIcon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: linear-gradient(
            135deg,
            #8c45ff,
            #29cfff
          );
          box-shadow:
            0 0 25px rgba(130, 70, 255, 0.5);
        }

        .inputBox {
          padding: 16px;
          border: 1px solid rgba(110, 130, 255, 0.2);
          border-radius: 15px;
          background: rgba(0, 0, 0, 0.22);
        }

        .inputBox > div {
          display: flex;
          justify-content: space-between;
          color: #75829f;
          font-size: 9px;
        }

        .inputBox input {
          width: calc(100% - 60px);
          margin-top: 12px;
          border: 0;
          outline: 0;
          background: transparent;
          color: white;
          font-size: 27px;
          font-weight: 800;
        }

        .inputBox b {
          color: #a858ff;
          font-size: 11px;
        }

        .swapArrow {
          width: 35px;
          height: 35px;
          margin: -3px auto;
          position: relative;
          z-index: 2;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #141a39;
          border: 1px solid #6976a9;
        }

        .rate {
          display: flex;
          justify-content: space-between;
          padding: 15px 0;
          color: #7c88a4;
          font-size: 10px;
        }

        .rate strong {
          color: #c7cce0;
        }

        .swapButton {
          width: 100%;
          padding: 16px;
          border: 0;
          border-radius: 14px;
          color: white;
          background: linear-gradient(
            90deg,
            #24cfff,
            #9743ff
          );
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .warning {
          margin-bottom: 0;
          color: #777f98;
          text-align: center;
          font-size: 9px;
        }

        .dashboardTop h3 {
          margin: 8px 0;
          font-size: 35px;
        }

        .live {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 6px 10px;
          border: 1px solid rgba(70, 220, 255, 0.25);
          border-radius: 30px;
          color: #59dfff;
          font-size: 8px;
        }

        .live i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #48e3ff;
          box-shadow: 0 0 10px #48e3ff;
        }

        .dashStats {
          margin: 25px 0;
          display: grid;
          gap: 8px;
        }

        .dashStats div {
          display: flex;
          justify-content: space-between;
          padding: 13px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.025);
        }

        .dashStats span,
        .dashStats strong {
          font-size: 10px;
        }

        .dashStats span {
          color: #737f9c;
        }

        .activity {
          min-height: 100px;
        }

        .empty {
          padding: 30px;
          text-align: center;
          color: #68748e;
          font-size: 10px;
          border: 1px dashed rgba(110, 130, 255, 0.2);
          border-radius: 12px;
        }

        .transaction {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.025);
        }

        .transaction > span {
          color: #49dcff;
        }

        .transaction strong,
        .transaction small {
          display: block;
        }

        .transaction strong {
          font-size: 10px;
        }

        .transaction small {
          margin-top: 4px;
          color: #68748f;
          font-size: 8px;
        }

        .about {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .aboutVisual {
          height: 360px;
          display: grid;
          place-items: center;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(100, 125, 255, 0.25);
          border-radius: 22px;
          background: #050a20;
        }

        .bigPlanet {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(
            circle at 30% 30%,
            #48d8ff,
            #152e75,
            #02040e
          );
        }

        .aboutFox {
          position: relative;
          z-index: 2;
          font-size: 150px;
          filter:
            drop-shadow(
              0 0 30px rgba(155, 65, 255, 0.7)
            );
        }

        .about p {
          max-width: 600px;
          color: #96a1ba;
          line-height: 1.9;
        }

        .pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 25px;
        }

        .pills span {
          padding: 9px 13px;
          border: 1px solid rgba(110, 130, 255, 0.23);
          border-radius: 30px;
          color: #abb5ce;
          font-size: 9px;
        }

        .tokenGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .donut,
        .allocation {
          min-height: 390px;
          padding: 30px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(110, 130, 255, 0.23);
          border-radius: 20px;
          background: rgba(5, 15, 36, 0.75);
        }

        .donut > div {
          width: 260px;
          height: 260px;
          display: grid;
          place-items: center;
          text-align: center;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              #071127 0 45%,
              transparent 46%
            ),
            conic-gradient(
              #9147ff 0 70%,
              #d858bd 70% 90%,
              #ff9b39 90% 100%
            );
        }

        .donut strong {
          display: block;
          font-size: 43px;
        }

        .donut span {
          color: #8490ab;
          font-size: 9px;
        }

        .allocation {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .allocation > div {
          width: 100%;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
        }

        .bar {
          width: 100%;
          height: 7px;
          overflow: hidden;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          margin-bottom: 15px;
        }

        .bar i {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #8644ff,
            #36c9ff
          );
        }

        .allocation p {
          color: #68748e;
          font-size: 9px;
          line-height: 1.7;
        }

        .roadmap {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 13px;
        }

        .roadCard {
          min-height: 280px;
          padding: 28px;
          border: 1px solid rgba(145, 70, 255, 0.35);
          border-radius: 20px;
          background: rgba(35, 15, 65, 0.55);
        }

        .roadCard.blue {
          border-color: rgba(35, 200, 255, 0.35);
          background: rgba(8, 35, 58, 0.55);
        }

        .roadCard.orange {
          border-color: rgba(255, 155, 50, 0.35);
          background: rgba(60, 34, 8, 0.45);
        }

        .roadCard small {
          color: #a066ff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .roadCard.blue small {
          color: #42d3ff;
        }

        .roadCard.orange small {
          color: #ffac48;
        }

        .roadCard h3 {
          font-size: 24px;
        }

        .roadCard p {
          color: #9ca7c0;
          font-size: 11px;
        }

        .faq {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .faqItem {
          border: 1px solid rgba(110, 130, 255, 0.2);
          border-radius: 13px;
          overflow: hidden;
          background: rgba(5, 15, 36, 0.65);
        }

        .faqItem button {
          width: 100%;
          padding: 17px;
          display: flex;
          justify-content: space-between;
          border: 0;
          color: white;
          background: transparent;
          cursor: pointer;
          text-align: left;
          font-size: 10px;
        }

        .faqItem button b {
          color: #a65cff;
          font-size: 17px;
        }

        .faqItem p {
          padding: 0 17px 17px;
          color: #7f8ba7;
          font-size: 10px;
          line-height: 1.7;
        }

        .community {
          min-height: 350px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          overflow: hidden;
          padding: 55px;
          border: 1px solid rgba(100, 125, 255, 0.3);
          border-radius: 25px;
          background:
            radial-gradient(
              circle at 80% 50%,
              rgba(50, 180, 255, 0.2),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #081735,
              #1a0737
            );
        }

        .community h2 {
          font-size: 45px;
          margin: 10px 0;
        }

        .community h2 strong {
          background: linear-gradient(
            90deg,
            #9e4cff,
            #31d1ff
          );
          -webkit-background-clip: text;
          color: transparent;
        }

        .community p {
          color: #8e9ab4;
        }

        .communityButtons {
          display: flex;
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
          color: #05070d;
          background: white;
        }

        .communityButtons a:last-child {
          background: #25aef1;
        }

        .communityPlanet {
          width: 250px;
          height: 250px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          font-size: 110px;
          background: radial-gradient(
            circle at 30% 30%,
            #43d5ff,
            #182e70,
            #030615
          );
          box-shadow:
            0 0 80px rgba(40, 170, 255, 0.3);
        }

        .notify {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 30px;
          border: 1px solid rgba(110, 130, 255, 0.25);
          border-radius: 20px;
          background: rgba(8, 18, 42, 0.7);
        }

        .notify h2 {
          margin: 7px 0 0;
        }

        .notify form {
          min-width: 400px;
          display: flex;
          padding: 5px;
          border-radius: 30px;
          border: 1px solid rgba(110, 130, 255, 0.2);
        }

        .notify input {
          min-width: 0;
          flex: 1;
          padding: 12px 15px;
          outline: 0;
          border: 0;
          color: white;
          background: transparent;
          font-size: 10px;
        }

        .notify button {
          padding: 0 20px;
          border: 0;
          border-radius: 30px;
          color: white;
          background: linear-gradient(
            90deg,
            #28cfff,
            #9843ff
          );
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
        }

        .success {
          padding: 14px 20px;
          border-radius: 30px;
          background: rgba(100, 60, 255, 0.18);
          font-size: 10px;
        }

        footer {
          width: min(1160px, calc(100% - 40px));
          margin: 40px auto 0;
          padding: 35px 0;
          border-top: 1px solid rgba(100, 120, 255, 0.15);
          text-align: center;
        }

        footer p {
          color: #6d7893;
          font-size: 10px;
        }

        footer > div {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin: 15px 0;
        }

        footer > div a {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(120, 130, 190, 0.3);
        }

        footer small {
          color: #56617a;
          font-size: 8px;
        }

        .toast {
          position: fixed;
          left: 50%;
          bottom: 25px;
          z-index: 9999;
          transform: translateX(-50%);
          padding: 14px 20px;
          border-radius: 30px;
          border: 1px solid rgba(140, 80, 255, 0.5);
          background: rgba(7, 12, 28, 0.95);
          box-shadow: 0 15px 50px black;
          font-size: 10px;
        }

        @media (max-width: 900px) {
          .links {
            display: none;
          }

          .hero,
          .about,
          .swapGrid,
          .tokenGrid {
            grid-template-columns: 1fr;
          }

          .heroVisual {
            margin-top: 20px;
          }

          .stats {
            grid-template-columns: 1fr 1fr;
          }

          .roadmap {
            grid-template-columns: 1fr;
          }

          .faq {
            grid-template-columns: 1fr;
          }

          .community {
            flex-direction: column;
            align-items: flex-start;
            gap: 30px;
          }

          .notify {
            flex-direction: column;
            align-items: stretch;
          }

          .notify form {
            min-width: 0;
          }
        }

        @media (max-width: 600px) {
          .section {
            width: calc(100% - 24px);
            padding: 70px 0;
          }

          .nav {
            padding: 0 8px;
          }

          nav {
            padding: 8px;
          }

          .navActions > a {
            display: none;
          }

          .hero {
            padding-top: 130px;
          }

          .heroText h1 {
            font-size: 75px;
          }

          .countdown {
            grid-template-columns: repeat(4, 1fr);
          }

          .heroButtons {
            flex-direction: column;
          }

          .planet {
            width: 350px;
            height: 350px;
          }

          .fox {
            transform: scale(0.8);
          }

          .community {
            padding: 30px;
          }

          .communityPlanet {
            width: 190px;
            height: 190px;
            font-size: 80px;
          }

          .stats {
            grid-template-columns: 1fr;
          }

          .notify form {
            flex-direction: column;
            border-radius: 15px;
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