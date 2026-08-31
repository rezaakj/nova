"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const TOTAL_SUPPLY = "1,000,000,000";

// 40 days from August 31, 2026
const LAUNCH_DATE = new Date("2026-10-10T20:00:00+03:30").getTime();

const faqs = [
  {
    q: "When will NOVA launch?",
    a: "NOVA is currently preparing for launch. Follow the official channels for announcements.",
  },
  {
    q: "How can I buy NOVA?",
    a: "Official purchase information will only be published after the project launch details are finalized.",
  },
  {
    q: "Which wallet can I use?",
    a: "A compatible browser wallet can be connected to the website.",
  },
  {
    q: "Will there be a presale?",
    a: "Official presale information will be announced through NOVA channels.",
  },
  {
    q: "Is NOVA audited?",
    a: "Audit information will be published if and when an independent audit is completed.",
  },
  {
    q: "Is this a long-term project?",
    a: "NOVA is a community-focused concept with a roadmap that may evolve over time.",
  },
];

function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className={`logo ${small ? "logoSmall" : ""}`}>
      <div className="logoMark">
        <span>✦</span>
      </div>
      <span className="logoText">NOVA</span>
    </div>
  );
}

function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 90 }).map((_, i) => ({
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
      {stars.map((s) => (
        <span
          key={s.id}
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [notify, setNotify] = useState("");

  const [time, setTime] = useState({
    days: 0,
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

    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, []);

  const showNotify = (message: string) => {
    setNotify(message);

    setTimeout(() => {
      setNotify("");
    }, 3000);
  };

  const connectWallet = () => {
    if (isConnected) {
      disconnect();
      showNotify("Wallet disconnected.");
      return;
    }

    if (!connectors.length) {
      showNotify("No compatible wallet detected.");
      return;
    }

    connect(
      {
        connector: connectors[0],
      },
      {
        onSuccess() {
          showNotify("Wallet connected successfully ✓");
        },
        onError() {
          showNotify("Wallet connection was cancelled.");
        },
      }
    );
  };

  const copyContract = async () => {
    const contract = "TBA — Official contract not released";

    try {
      await navigator.clipboard.writeText(contract);
      setCopied(true);
      showNotify("Contract status copied!");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      showNotify("Copy failed.");
    }
  };

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      showNotify("Please enter a valid email.");
      return;
    }

    setSubscribed(true);
    setEmail("");

    showNotify("You're on the NOVA notification list 🚀");
  };

  const walletText = isPending
    ? "Connecting..."
    : isConnected && address
      ? `${address.slice(0, 6)}...${address.slice(-4)} ✓`
      : "Connect Wallet";

  return (
    <main>
      <div className="pageGlow glowOne" />
      <div className="pageGlow glowTwo" />

      <Stars />

      {notify && <div className="toast">{notify}</div>}

      {/* NAVBAR */}

      <header className="navWrap">
        <nav className="navbar">
          <a href="#home" onClick={() => setMenuOpen(false)}>
            <Logo />
          </a>

          <div className={`navLinks ${menuOpen ? "mobileOpen" : ""}`}>
            <a href="#home" onClick={() => setMenuOpen(false)}>
              Home
            </a>

            <a href="#about" onClick={() => setMenuOpen(false)}>
              About
            </a>

            <a href="#tokenomics" onClick={() => setMenuOpen(false)}>
              Tokenomics
            </a>

            <a href="#roadmap" onClick={() => setMenuOpen(false)}>
              Roadmap
            </a>

            <a href="#faq" onClick={() => setMenuOpen(false)}>
              FAQ
            </a>

            <a href="#community" onClick={() => setMenuOpen(false)}>
              Community
            </a>
          </div>

          <div className="navRight">
            <a
              className="socialMini"
              href="https://x.com/NOVAverse12"
              target="_blank"
              rel="noreferrer"
            >
              𝕏
            </a>

            <a
              className="socialMini"
              href="https://t.me/NOVAFOX18"
              target="_blank"
              rel="noreferrer"
            >
              ✈
            </a>

            <button
              className="themeBtn"
              onClick={() => showNotify("NOVA mode is already active ✦")}
            >
              ☼
            </button>

            <button className="walletBtn" onClick={connectWallet}>
              {walletText}
            </button>

            <button
              className="hamburger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              ☰
            </button>
          </div>
        </nav>
      </header>

      {/* HERO */}

      <section className="hero section" id="home">
        <div className="heroContent">
          <div className="launchBadge">
            <span className="pulseDot" />
            🚀 LAUNCHING SOON
          </div>

          <h1>
            <span className="dollar">$</span>N
            <span className="orbitO">O</span>VA
          </h1>

          <h2>
            THE NEXT <span>MEME IN ORBIT.</span>
          </h2>

          <p className="heroText">
            Born on the internet. Built for the community.
            <br />
            More than a token — it&apos;s a movement.
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
              <small>MINUTES</small>
            </div>

            <div>
              <strong>{String(time.seconds).padStart(2, "0")}</strong>
              <small>SECONDS</small>
            </div>
          </div>

          <div className="heroButtons">
            <button
              className="primaryBtn"
              onClick={() =>
                showNotify(
                  "Official NOVA launch information will appear here."
                )
              }
            >
              🚀 NOVA INFO <span>→</span>
            </button>

            <a
              className="secondaryBtn"
              href="https://x.com/NOVAverse12"
              target="_blank"
              rel="noreferrer"
            >
              𝕏 FOLLOW ON X
            </a>
          </div>

          <div className="communityRow">
            <span>Join the Community:</span>

            <a
              href="https://x.com/NOVAverse12"
              target="_blank"
              rel="noreferrer"
            >
              𝕏
            </a>

            <a
              href="https://t.me/NOVAFOX18"
              target="_blank"
              rel="noreferrer"
            >
              ✈
            </a>

            <a href="#community">◈</a>
            <a href="#community">↗</a>
          </div>

          {isConnected && address && (
            <div className="connectedBox">
              <span>WALLET CONNECTED</span>
              <strong>{address}</strong>
            </div>
          )}
        </div>

        <div className="heroVisual">
          <div className="planet planetMain" />
          <div className="planet planetSmall" />

          <div className="orbitRing ringOne" />
          <div className="orbitRing ringTwo" />

          <div className="comet cometOne" />
          <div className="comet cometTwo" />

          <div className="fox">
            <div className="foxGlow" />

            <div className="helmet">
              <div className="ear leftEar">▲</div>
              <div className="ear rightEar">▲</div>

              <div className="visor">
                <div className="visorReflection" />

                <div className="face">
                  <div className="eye eyeL" />
                  <div className="eye eyeR" />
                  <div className="nose" />
                  <div className="mouth">⌣</div>
                </div>
              </div>

              <div className="helmetBand">NOVA</div>
            </div>

            <div className="spaceBody">
              <div className="chest">✦</div>
              <div className="arm armL" />
              <div className="arm armR" />
            </div>
          </div>

          <div className="rocket">🚀</div>

          <div className="heroQuote">
            <span>★</span>
            We&apos;re not going to the moon...
            <b>We&apos;re building a new orbit.</b>
          </div>
        </div>
      </section>

      {/* TOKEN OVERVIEW */}

      <section className="section">
        <div className="sectionHeader">
          <div>
            <span className="eyebrow">NOVA / TOKEN</span>

            <h2>
              Token Overview <span>$NOVA</span>
            </h2>

            <p>Simple. Transparent. Community focused.</p>
          </div>
        </div>

        <div className="overviewGrid">
          <div className="statCard">
            <div className="statIcon">◈</div>

            <small>Total Supply</small>

            <strong>{TOTAL_SUPPLY}</strong>

            <span>NOVA</span>
          </div>

          <div className="statCard">
            <div className="statIcon">⌁</div>

            <small>Chain</small>

            <strong>TBA</strong>

            <span>Official chain</span>
          </div>

          <div className="statCard">
            <div className="statIcon">🚀</div>

            <small>Status</small>

            <strong>Coming Soon</strong>

            <span>Pre-Launch</span>
          </div>

          <button
            className="statCard contractCard"
            onClick={copyContract}
          >
            <div className="statIcon">▣</div>

            <small>Contract</small>

            <strong>{copied ? "COPIED!" : "TBA"}</strong>

            <span>Official contract not released</span>
          </button>

          <div className="priceCard">
            <div className="priceTop">
              <span>$ NOVA</span>
              <b>TBA</b>
            </div>

            <div className="fakeChart">
              <svg viewBox="0 0 500 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    x2="1"
                  >
                    <stop offset="0%" stopColor="#2acfff" />
                    <stop offset="100%" stopColor="#a34cff" />
                  </linearGradient>
                </defs>

                <path
                  d="M0 150 C60 135 65 145 110 120 C150 100 160 125 205 90 C245 58 265 100 300 76 C340 48 350 70 380 35 C415 0 440 50 500 8"
                  fill="none"
                  stroke="url(#chartGradient)"
                  strokeWidth="7"
                />
              </svg>
            </div>

            <small>Price will appear after official launch.</small>
          </div>
        </div>
      </section>

      {/* ABOUT */}

      <section className="section aboutSection" id="about">
        <div className="aboutVisual">
          <div className="miniPlanet" />

          <div className="aboutFox">🦊</div>

          <div
            className="playButton"
            onClick={() =>
              showNotify("NOVA intro video coming soon!")
            }
          >
            ▶
          </div>
        </div>

        <div className="aboutText">
          <span className="eyebrow">WHO IS NOVA?</span>

          <h2>
            About <span>NOVA</span>
          </h2>

          <h3>Not just a token. A movement.</h3>

          <p>
            NOVA is a community-focused meme project inspired by
            internet culture, space and the unstoppable energy of
            online communities.
          </p>

          <p>
            The mission is simple: build a recognizable internet
            brand, create a strong community and develop transparently.
          </p>

          <div className="pills">
            <span>✦ Community First</span>
            <span>⌁ Transparent</span>
            <span>🚀 No Fake Promises</span>
            <span>∞ 100% Vibes</span>
          </div>
        </div>
      </section>

      {/* TOKENOMICS */}

      <section className="section" id="tokenomics">
        <div className="sectionTitle">
          <span className="eyebrow">THE NUMBERS</span>

          <h2>Tokenomics</h2>

          <p>Preliminary concept allocation.</p>
        </div>

        <div className="tokenomicsGrid">
          <div className="donutCard">
            <div className="donut">
              <div className="donutCenter">
                <strong>1B</strong>
                <span>Total Supply</span>
              </div>
            </div>
          </div>

          <div className="allocationCard">
            <div className="allocationRow">
              <div>
                <i className="dot purple" />
                Community
              </div>

              <strong>70%</strong>
            </div>

            <div className="bar">
              <span style={{ width: "70%" }} />
            </div>

            <div className="allocationRow">
              <div>
                <i className="dot pink" />
                Liquidity
              </div>

              <strong>20%</strong>
            </div>

            <div className="bar">
              <span style={{ width: "20%" }} />
            </div>

            <div className="allocationRow">
              <div>
                <i className="dot orange" />
                Marketing
              </div>

              <strong>10%</strong>
            </div>

            <div className="bar">
              <span style={{ width: "10%" }} />
            </div>

            <p className="smallNote">
              These are preliminary concept allocations and may be
              changed before any official launch.
            </p>
          </div>
        </div>
      </section>

      {/* ROADMAP */}

      <section className="section" id="roadmap">
        <div className="sectionTitle">
          <span className="eyebrow">MISSION CONTROL</span>

          <h2>Roadmap</h2>

          <p>From ignition to supernova.</p>
        </div>

        <div className="roadmap">
          <div className="roadCard active">
            <span className="phase">PHASE 01</span>

            <h3>IGNITION</h3>

            <ul>
              <li>✓ Website Launch</li>
              <li>✓ Community Building</li>
              <li>✓ X Launch</li>
              <li>✓ Meme Factory</li>
            </ul>
          </div>

          <div className="roadArrow">»</div>

          <div className="roadCard blue">
            <span className="phase">PHASE 02</span>

            <h3>ORBIT</h3>

            <ul>
              <li>✓ Community Growth</li>
              <li>✓ Creator Campaigns</li>
              <li>✓ Community Events</li>
              <li>✓ Ecosystem Ideas</li>
            </ul>
          </div>

          <div className="roadArrow">»</div>

          <div className="roadCard orange">
            <span className="phase">PHASE 03</span>

            <h3>SUPERNOVA</h3>

            <ul>
              <li>✓ Partnerships</li>
              <li>✓ Ecosystem Expansion</li>
              <li>✓ Community Growth</li>
              <li>✓ Bigger Ideas</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}

      <section className="section faqSection" id="faq">
        <div className="sectionTitle">
          <span className="eyebrow">QUESTIONS?</span>

          <h2>FAQ</h2>

          <p>Your questions, answered.</p>
        </div>

        <div className="faqGrid">
          <div>
            {faqs.slice(0, 3).map((faq, index) => (
              <div className="faqItem" key={faq.q}>
                <button
                  onClick={() =>
                    setOpenFaq(
                      openFaq === index ? null : index
                    )
                  }
                >
                  <span>{faq.q}</span>

                  <b>
                    {openFaq === index ? "−" : "+"}
                  </b>
                </button>

                {openFaq === index && (
                  <div className="faqAnswer">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div>
            {faqs.slice(3).map((faq, index) => {
              const realIndex = index + 3;

              return (
                <div className="faqItem" key={faq.q}>
                  <button
                    onClick={() =>
                      setOpenFaq(
                        openFaq === realIndex
                          ? null
                          : realIndex
                      )
                    }
                  >
                    <span>{faq.q}</span>

                    <b>
                      {openFaq === realIndex ? "−" : "+"}
                    </b>
                  </button>

                  {openFaq === realIndex && (
                    <div className="faqAnswer">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMMUNITY */}

      <section
        className="section communitySection"
        id="community"
      >
        <div className="communityBox">
          <div className="communityPlanet" />

          <div className="communityContent">
            <span className="eyebrow">JOIN THE CREW</span>

            <h2>
              The future is <span>community.</span>
            </h2>

            <p>
              Follow NOVA and be there when the countdown reaches
              zero.
            </p>

            <div className="communityButtons">
              <a
                href="https://x.com/NOVAverse12"
                target="_blank"
                rel="noreferrer"
                className="whiteBtn"
              >
                𝕏 Follow on X
              </a>

              <a
                href="https://t.me/NOVAFOX18"
                target="_blank"
                rel="noreferrer"
                className="blueBtn"
              >
                ✈ Join Telegram
              </a>

              <button
                className="purpleBtn"
                onClick={() =>
                  showNotify(
                    "Discord community coming soon!"
                  )
                }
              >
                ◈ Join Discord
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NOTIFY */}

      <section className="section notifySection">
        <div>
          <span className="eyebrow">STAY IN ORBIT</span>

          <h2>The Future is Community.</h2>

          <p>
            Don&apos;t miss the launch. Stay connected.
          </p>
        </div>

        {subscribed ? (
          <div className="subscribed">
            🚀 You&apos;re on the list!
          </div>
        ) : (
          <form onSubmit={subscribe}>
            <input
              type="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <button type="submit">
              🔔 Notify Me
            </button>
          </form>
        )}
      </section>

      {/* FOOTER */}

      <footer>
        <div className="footerInner">
          <div>
            <Logo small />

            <p>
              Born on the internet. Built for the community.
            </p>
          </div>

          <div className="footerSocials">
            <a
              href="https://x.com/NOVAverse12"
              target="_blank"
              rel="noreferrer"
            >
              𝕏
            </a>

            <a
              href="https://t.me/NOVAFOX18"
              target="_blank"
              rel="noreferrer"
            >
              ✈
            </a>

            <a href="#community">◈</a>

            <a href="#home">↗</a>
          </div>

          <div className="copyright">
            © 2026 NOVA. Concept website.
            <br />
            <span>Built for dreamers. 🚀</span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap");

        :root {
          --bg: #020611;
          --line: rgba(108, 132, 255, 0.24);
          --text: #f7f8ff;
          --muted: #a7b1ca;
        }

        * {
          box-sizing: border-box;
          scroll-behavior: smooth;
        }

        html {
          background: var(--bg);
        }

        body {
          margin: 0;
          color: var(--text);
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(100, 45, 255, 0.22),
              transparent 35%
            ),
            radial-gradient(
              circle at 100% 40%,
              rgba(0, 183, 255, 0.1),
              transparent 30%
            ),
            var(--bg);
          font-family: Inter, Arial, sans-serif;
          overflow-x: hidden;
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

        .pageGlow {
          position: fixed;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: -2;
        }

        .glowOne {
          background: rgba(125, 41, 255, 0.14);
          top: 5%;
          left: -250px;
        }

        .glowTwo {
          background: rgba(0, 178, 255, 0.1);
          top: 50%;
          right: -250px;
        }

        .stars {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: -1;
          overflow: hidden;
        }

        .stars span {
          position: absolute;
          background: white;
          border-radius: 50%;
          opacity: 0.55;
          animation: twinkle infinite ease-in-out;
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.15;
            transform: scale(0.7);
          }

          50% {
            opacity: 0.9;
            transform: scale(1.5);
          }
        }

        .navWrap {
          position: fixed;
          top: 18px;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 0 20px;
        }

        .navbar {
          max-width: 1180px;
          margin: auto;
          min-height: 66px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 25px;
          border: 1px solid rgba(98, 120, 255, 0.28);
          border-radius: 20px;
          background: rgba(3, 9, 25, 0.78);
          backdrop-filter: blur(25px);
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.35);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 23px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .logoMark {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            #9b4dff,
            #24c9ff
          );
          box-shadow: 0 0 25px rgba(143, 70, 255, 0.55);
          color: white;
          transform: rotate(-8deg);
        }

        .logoMark span {
          transform: rotate(8deg);
        }

        .logoText {
          background: linear-gradient(
            90deg,
            white,
            #caa4ff,
            #55dfff
          );
          -webkit-background-clip: text;
          color: transparent;
        }

        .navLinks {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 25px;
          flex: 1;
        }

        .navLinks a {
          font-size: 13px;
          color: #bac3da;
          transition: 0.2s;
        }

        .navLinks a:hover {
          color: white;
          text-shadow: 0 0 18px #9c4cff;
        }

        .navRight {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .socialMini,
        .themeBtn {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #d8def0;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.14);
          cursor: pointer;
        }

        .walletBtn {
          border: 0;
          color: white;
          font-size: 12px;
          font-weight: 800;
          padding: 12px 19px;
          border-radius: 30px;
          cursor: pointer;
          background: linear-gradient(
            90deg,
            #26cfff,
            #9b43ff
          );
          box-shadow: 0 0 28px rgba(130, 65, 255, 0.38);
          transition: 0.2s;
          min-width: 130px;
        }

        .walletBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 35px rgba(120, 75, 255, 0.65);
        }

        .hamburger {
          display: none;
          border: 0;
          color: white;
          background: transparent;
          font-size: 26px;
          cursor: pointer;
        }

        .section {
          width: min(1160px, calc(100% - 40px));
          margin: auto;
          padding: 105px 0;
          position: relative;
        }

        .hero {
          min-height: 830px;
          padding-top: 170px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          align-items: center;
          gap: 10px;
        }

        .launchBadge {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 15px;
          border: 1px solid rgba(106, 128, 255, 0.4);
          border-radius: 999px;
          background: rgba(20, 31, 70, 0.48);
          color: #cfd7ff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .pulseDot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #40d5ff;
          box-shadow: 0 0 12px #40d5ff;
          animation: pulse 1.4s infinite;
        }

        @keyframes pulse {
          50% {
            transform: scale(1.8);
            opacity: 0.5;
          }
        }

        .hero h1 {
          margin: 22px 0 0;
          font-size: clamp(75px, 10vw, 138px);
          line-height: 0.9;
          letter-spacing: -8px;
          font-weight: 900;
          background: linear-gradient(
            180deg,
            #fff 10%,
            #e9e7ff 40%,
            #9551ff 100%
          );
          -webkit-background-clip: text;
          color: transparent;
          filter: drop-shadow(
            0 0 30px rgba(145, 70, 255, 0.4)
          );
        }

        .dollar {
          color: white;
          -webkit-text-fill-color: white;
        }

        .hero h2 {
          margin: 18px 0 15px;
          font-size: clamp(23px, 3vw, 38px);
          line-height: 1;
          font-weight: 900;
        }

        .hero h2 span,
        .sectionTitle h2 span,
        .aboutText h2 span,
        .communityContent h2 span {
          background: linear-gradient(
            90deg,
            #a348ff,
            #38ccff
          );
          -webkit-background-clip: text;
          color: transparent;
        }

        .heroText {
          color: var(--muted);
          line-height: 1.8;
          font-size: 15px;
        }

        .countdown {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin: 30px 0;
          max-width: 430px;
        }

        .countdown div {
          min-height: 76px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(111, 134, 255, 0.28);
          background: rgba(8, 18, 42, 0.7);
          border-radius: 11px;
        }

        .countdown strong {
          font-size: 22px;
        }

        .countdown small {
          margin-top: 4px;
          font-size: 8px;
          color: #8d9bb9;
          letter-spacing: 1px;
        }

        .heroButtons {
          display: flex;
          gap: 12px;
        }

        .primaryBtn,
        .secondaryBtn {
          min-height: 48px;
          padding: 0 25px;
          border-radius: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          cursor: pointer;
          font-weight: 900;
          font-size: 12px;
        }

        .primaryBtn {
          color: white;
          border: 0;
          background: linear-gradient(
            90deg,
            #27cfff,
            #a643ff
          );
          box-shadow: 0 0 25px rgba(100, 80, 255, 0.45);
        }

        .secondaryBtn {
          border: 1px solid rgba(110, 131, 255, 0.4);
          background: rgba(3, 10, 28, 0.7);
          color: white;
        }

        .communityRow {
          margin-top: 25px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #8e9bb7;
          font-size: 11px;
        }

        .communityRow a {
          width: 31px;
          height: 31px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          border: 1px solid rgba(150, 150, 255, 0.35);
          background: rgba(255, 255, 255, 0.03);
        }

        .connectedBox {
          margin-top: 18px;
          max-width: 430px;
          padding: 12px 15px;
          border-radius: 12px;
          border: 1px solid rgba(54, 213, 255, 0.25);
          background: rgba(20, 120, 160, 0.08);
        }

        .connectedBox span {
          display: block;
          font-size: 8px;
          color: #41d5ff;
          letter-spacing: 2px;
          margin-bottom: 5px;
        }

        .connectedBox strong {
          display: block;
          font-size: 10px;
          word-break: break-all;
          color: #c7d4f5;
        }

        .heroVisual {
          height: 600px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .planet {
          position: absolute;
          border-radius: 50%;
        }

        .planetMain {
          width: 480px;
          height: 480px;
          right: -20px;
          top: 80px;
          background:
            radial-gradient(
              circle at 35% 30%,
              #55e0ff 0%,
              #174a9e 25%,
              #08123a 60%,
              #01030e 72%
            );
          box-shadow:
            inset -50px -40px 100px #01020b,
            0 0 70px rgba(50, 150, 255, 0.3);
        }

        .planetSmall {
          width: 75px;
          height: 75px;
          right: 5px;
          top: 10px;
          background: radial-gradient(
            circle at 30% 30%,
            #b7a7c8,
            #24243e
          );
        }

        .orbitRing {
          position: absolute;
          width: 560px;
          height: 170px;
          border: 1px solid rgba(118, 88, 255, 0.4);
          border-radius: 50%;
          transform: rotate(-16deg);
        }

        .ringTwo {
          transform: rotate(20deg);
          border-color: rgba(45, 197, 255, 0.25);
        }

        .comet {
          position: absolute;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 20px 6px #6d6bff;
        }

        .comet::before {
          content: "";
          position: absolute;
          width: 100px;
          height: 2px;
          right: 5px;
          top: 4px;
          background: linear-gradient(
            90deg,
            transparent,
            #a45cff
          );
          transform: rotate(-25deg);
          transform-origin: right;
        }

        .cometOne {
          left: 10%;
          top: 15%;
        }

        .cometTwo {
          right: 10%;
          top: 50%;
        }

        .fox {
          position: absolute;
          z-index: 5;
          top: 65px;
          left: 23%;
          width: 270px;
          height: 400px;
          animation: float 5s ease-in-out infinite;
          filter: drop-shadow(
            0 25px 30px rgba(0, 0, 0, 0.6)
          );
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(-1deg);
          }

          50% {
            transform: translateY(-17px) rotate(1deg);
          }
        }

        .foxGlow {
          position: absolute;
          inset: 50px 10px;
          background: rgba(152, 65, 255, 0.35);
          filter: blur(70px);
          z-index: -1;
        }

        .helmet {
          width: 250px;
          height: 250px;
          position: relative;
          margin: auto;
          border-radius: 48%;
          background: linear-gradient(
            135deg,
            #7e83a9,
            #202544 55%,
            #0c1027
          );
          border: 8px solid #aab4e4;
          box-shadow:
            inset 0 0 30px #000,
            0 0 35px rgba(91, 64, 255, 0.55);
        }

        .visor {
          position: absolute;
          inset: 28px;
          border-radius: 45%;
          overflow: hidden;
          background: linear-gradient(
            135deg,
            #191b3d,
            #02040d
          );
          border: 6px solid #59618d;
          box-shadow: inset 0 0 40px rgba(69, 58, 255, 0.45);
        }

        .visorReflection {
          position: absolute;
          width: 100px;
          height: 20px;
          top: 35px;
          left: 25px;
          transform: rotate(-30deg);
          background: rgba(255, 255, 255, 0.14);
          filter: blur(5px);
        }

        .face {
          position: absolute;
          inset: 50px 32px 25px;
          border-radius: 45%;
          background: linear-gradient(
            145deg,
            #ffac3b,
            #c65c1d 55%,
            #873416
          );
        }

        .face::before,
        .face::after {
          content: "";
          position: absolute;
          top: -22px;
          width: 55px;
          height: 55px;
          background: #e47a23;
          clip-path: polygon(
            50% 0,
            100% 100%,
            0 100%
          );
        }

        .face::before {
          left: 8px;
        }

        .face::after {
          right: 8px;
        }

        .eye {
          position: absolute;
          width: 34px;
          height: 15px;
          background: #070812;
          top: 65px;
          border-radius: 50%;
        }

        .eyeL {
          left: 18px;
          transform: rotate(10deg);
        }

        .eyeR {
          right: 18px;
          transform: rotate(-10deg);
        }

        .nose {
          position: absolute;
          left: 50%;
          top: 94px;
          transform: translateX(-50%);
          width: 17px;
          height: 13px;
          border-radius: 50%;
          background: #111;
        }

        .mouth {
          position: absolute;
          top: 106px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 28px;
          color: #111;
        }

        .helmetBand {
          position: absolute;
          bottom: -16px;
          left: 50%;
          transform: translateX(-50%);
          padding: 5px 25px;
          border-radius: 30px;
          background: #181d43;
          border: 1px solid #6873a7;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 3px;
        }

        .ear {
          position: absolute;
          top: -30px;
          color: #e88836;
          font-size: 55px;
          z-index: -1;
        }

        .leftEar {
          left: 20px;
          transform: rotate(-25deg);
        }

        .rightEar {
          right: 20px;
          transform: rotate(25deg);
        }

        .spaceBody {
          width: 180px;
          height: 155px;
          margin: -3px auto 0;
          border-radius: 50px 50px 25px 25px;
          background: linear-gradient(
            145deg,
            #252a4c,
            #090c1e
          );
          border: 5px solid #575f8d;
          position: relative;
        }

        .chest {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          position: absolute;
          left: 50%;
          top: 35px;
          transform: translateX(-50%);
          border-radius: 12px;
          color: #a95cff;
          border: 1px solid #7181ff;
          background: #080c21;
        }

        .arm {
          width: 60px;
          height: 115px;
          position: absolute;
          top: 15px;
          border-radius: 30px;
          background: linear-gradient(
            #31365b,
            #0b0e20
          );
          border: 5px solid #515a87;
        }

        .armL {
          left: -55px;
          transform: rotate(25deg);
        }

        .armR {
          right: -55px;
          transform: rotate(-25deg);
        }

        .rocket {
          position: absolute;
          right: 10%;
          top: 0;
          font-size: 70px;
          transform: rotate(-20deg);
          filter: drop-shadow(
            0 0 25px #a24fff
          );
          animation: rocketFloat 3s ease-in-out infinite;
        }

        @keyframes rocketFloat {
          50% {
            transform: translateY(-15px) rotate(-20deg);
          }
        }

        .heroQuote {
          position: absolute;
          right: 0;
          bottom: 60px;
          width: 290px;
          padding: 16px;
          border: 1px solid rgba(88, 125, 255, 0.4);
          border-radius: 15px;
          background: rgba(4, 13, 31, 0.75);
          backdrop-filter: blur(15px);
          color: #d7def3;
          font-size: 11px;
          line-height: 1.6;
        }

        .heroQuote span {
          color: #ffc34d;
          margin-right: 6px;
        }

        .heroQuote b {
          display: block;
          color: #ffb13c;
        }

        .sectionHeader,
        .sectionTitle {
          margin-bottom: 35px;
        }

        .eyebrow {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 3px;
          color: #8795bb;
        }

        .sectionHeader h2,
        .sectionTitle h2,
        .aboutText h2,
        .communityContent h2 {
          margin: 7px 0;
          font-size: clamp(32px, 5vw, 48px);
          line-height: 1;
          letter-spacing: -2px;
        }

        .sectionHeader p,
        .sectionTitle p,
        .communityContent p {
          color: var(--muted);
        }

        .overviewGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr) 1.5fr;
          gap: 12px;
        }

        .statCard,
        .priceCard,
        .donutCard,
        .allocationCard {
          min-height: 190px;
          padding: 20px;
          border: 1px solid var(--line);
          border-radius: 18px;
          background: linear-gradient(
            145deg,
            rgba(8, 20, 47, 0.88),
            rgba(2, 9, 25, 0.85)
          );
        }

        .statCard {
          text-align: left;
          cursor: default;
        }

        button.statCard {
          color: white;
          font: inherit;
        }

        .contractCard {
          cursor: pointer !important;
          transition: 0.2s;
        }

        .contractCard:hover {
          transform: translateY(-4px);
          border-color: #8655ff;
        }

        .statIcon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: rgba(119, 74, 255, 0.13);
          color: #8f75ff;
          font-size: 21px;
          margin-bottom: 22px;
        }

        .statCard small {
          display: block;
          color: #8996b2;
          font-size: 10px;
          margin-bottom: 7px;
        }

        .statCard strong {
          display: block;
          font-size: 17px;
        }

        .statCard > span {
          display: block;
          color: #75839f;
          font-size: 9px;
          margin-top: 5px;
        }

        .priceCard {
          overflow: hidden;
          position: relative;
        }

        .priceTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .priceTop b {
          font-size: 30px;
        }

        .fakeChart {
          height: 100px;
          margin: 12px -20px 5px;
        }

        .fakeChart svg {
          width: 100%;
          height: 100%;
        }

        .aboutSection {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 50px;
          align-items: center;
        }

        .aboutVisual {
          height: 350px;
          border-radius: 22px;
          border: 1px solid var(--line);
          overflow: hidden;
          position: relative;
          display: grid;
          place-items: center;
          background:
            radial-gradient(
              circle at 60% 50%,
              rgba(103, 67, 255, 0.55),
              transparent 25%
            ),
            linear-gradient(
              135deg,
              #050d25,
              #030717
            );
        }

        .miniPlanet {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(
            circle at 30% 30%,
            #36cfff,
            #102a6a 35%,
            #020817 70%
          );
        }

        .aboutFox {
          position: relative;
          z-index: 2;
          font-size: 150px;
          filter: drop-shadow(
            0 0 35px rgba(160, 70, 255, 0.7)
          );
          animation: float 4s ease-in-out infinite;
        }

        .playButton {
          position: absolute;
          z-index: 3;
          width: 65px;
          height: 65px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: white;
          background: linear-gradient(
            135deg,
            #25caff,
            #9348ff
          );
          box-shadow: 0 0 30px rgba(132, 69, 255, 0.65);
          cursor: pointer;
        }

        .aboutText h3 {
          font-size: 20px;
        }

        .aboutText p {
          color: #9aa6c0;
          line-height: 1.8;
          max-width: 650px;
        }

        .pills {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 22px;
        }

        .pills span {
          padding: 8px 12px;
          border-radius: 30px;
          border: 1px solid rgba(111, 133, 255, 0.25);
          color: #b9c4de;
          font-size: 10px;
          background: rgba(255, 255, 255, 0.025);
        }

        .tokenomicsGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .donutCard,
        .allocationCard {
          min-height: 400px;
        }

        .donutCard {
          display: grid;
          place-items: center;
        }

        .donut {
          width: 270px;
          height: 270px;
          border-radius: 50%;
          background: conic-gradient(
            #8d45ff 0 70%,
            #d557bc 70% 90%,
            #ff9b36 90% 100%
          );
          display: grid;
          place-items: center;
        }

        .donut::before {
          content: "";
          position: absolute;
          width: 190px;
          height: 190px;
          border-radius: 50%;
          background: #061026;
        }

        .donutCenter {
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .donutCenter strong {
          display: block;
          font-size: 43px;
        }

        .donutCenter span {
          color: #8995b0;
          font-size: 10px;
        }

        .allocationCard {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 10px;
        }

        .allocationRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #d8def0;
        }

        .allocationRow div {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .dot {
          width: 10px;
          height: 10px;
          display: inline-block;
          border-radius: 50%;
        }

        .purple {
          background: #8d45ff;
        }

        .pink {
          background: #d557bc;
        }

        .orange {
          background: #ff9b36;
        }

        .bar {
          height: 7px;
          margin-bottom: 14px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          overflow: hidden;
        }

        .bar span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #8644ff,
            #36c9ff
          );
        }

        .smallNote {
          color: #6f7c99;
          font-size: 10px;
          line-height: 1.7;
          margin-top: 10px;
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
          border-radius: 18px;
          border: 1px solid rgba(142, 72, 255, 0.4);
          background: linear-gradient(
            145deg,
            rgba(55, 25, 94, 0.5),
            rgba(4, 12, 30, 0.9)
          );
        }

        .roadCard.blue {
          border-color: rgba(41, 196, 255, 0.35);
        }

        .roadCard.orange {
          border-color: rgba(255, 159, 58, 0.35);
        }

        .phase {
          font-size: 9px;
          font-weight: 900;
          color: #9f72ff;
          letter-spacing: 2px;
        }

        .roadCard.blue .phase {
          color: #3bd1ff;
        }

        .roadCard.orange .phase {
          color: #ffab42;
        }

        .roadCard h3 {
          font-size: 23px;
          margin: 7px 0 25px;
        }

        .roadCard ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 14px;
          color: #b7c1d7;
          font-size: 11px;
        }

        .roadArrow {
          font-size: 30px;
          color: #677392;
        }

        .faqGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px;
        }

        .faqItem {
          margin-bottom: 10px;
          border: 1px solid rgba(110, 131, 255, 0.22);
          border-radius: 13px;
          overflow: hidden;
          background: rgba(6, 16, 37, 0.65);
        }

        .faqItem button {
          width: 100%;
          padding: 17px;
          display: flex;
          justify-content: space-between;
          gap: 15px;
          border: 0;
          background: transparent;
          color: #e8ecf8;
          text-align: left;
          cursor: pointer;
          font-size: 11px;
        }

        .faqItem button b {
          color: #9471ff;
          font-size: 18px;
        }

        .faqAnswer {
          padding: 0 17px 17px;
          color: #8e9ab5;
          line-height: 1.7;
          font-size: 11px;
        }

        .communityBox {
          min-height: 330px;
          padding: 50px;
          border-radius: 25px;
          border: 1px solid rgba(96, 130, 255, 0.32);
          overflow: hidden;
          position: relative;
          background:
            radial-gradient(
              circle at 85% 50%,
              rgba(59, 116, 255, 0.32),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              rgba(8, 24, 57, 0.9),
              rgba(24, 8, 58, 0.8)
            );
        }

        .communityPlanet {
          position: absolute;
          width: 270px;
          height: 270px;
          border-radius: 50%;
          right: 50px;
          top: 30px;
          background: radial-gradient(
            circle at 30% 30%,
            #43caff,
            #18366e 35%,
            #040b20 70%
          );
          opacity: 0.85;
        }

        .communityContent {
          position: relative;
          z-index: 2;
          max-width: 650px;
        }

        .communityContent h2 {
          max-width: 550px;
        }

        .communityButtons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 25px;
        }

        .communityButtons a,
        .communityButtons button {
          padding: 13px 20px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          font-size: 11px;
          font-weight: 800;
        }

        .whiteBtn {
          background: white;
          color: #090b18;
        }

        .blueBtn {
          background: #27aef1;
          color: white;
        }

        .purpleBtn {
          background: linear-gradient(
            90deg,
            #7137ff,
            #a747ff
          );
          color: white;
        }

        .notifySection {
          padding: 32px;
          border: 1px solid rgba(102, 127, 255, 0.3);
          border-radius: 20px;
          background:
            radial-gradient(
              circle at 70% 20%,
              rgba(127, 54, 255, 0.2),
              transparent 35%
            ),
            linear-gradient(
              90deg,
              rgba(6, 19, 43, 0.9),
              rgba(29, 9, 51, 0.8)
            );
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }

        .notifySection h2 {
          margin: 5px 0;
          font-size: 25px;
        }

        .notifySection p {
          color: #8996b2;
          font-size: 12px;
          margin: 0;
        }

        .notifySection form {
          min-width: 400px;
          display: flex;
          padding: 5px;
          border: 1px solid rgba(120, 139, 255, 0.25);
          border-radius: 40px;
          background: rgba(0, 0, 0, 0.2);
        }

        .notifySection input {
          min-width: 0;
          flex: 1;
          padding: 12px 16px;
          border: 0;
          outline: 0;
          background: transparent;
          color: white;
          font-size: 11px;
        }

        .notifySection button {
          border: 0;
          padding: 0 20px;
          border-radius: 30px;
          background: linear-gradient(
            90deg,
            #27cfff,
            #9b43ff
          );
          color: white;
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .subscribed {
          padding: 15px 22px;
          border-radius: 30px;
          background: rgba(100, 65, 255, 0.18);
          border: 1px solid rgba(150, 90, 255, 0.35);
          font-size: 12px;
        }

        footer {
          border-top: 1px solid rgba(100, 120, 255, 0.15);
          margin-top: 50px;
        }

        .footerInner {
          width: min(1160px, calc(100% - 40px));
          margin: auto;
          padding: 35px 0;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 25px;
        }

        .logoSmall .logoMark {
          width: 32px;
          height: 32px;
          font-size: 13px;
        }

        .logoSmall {
          font-size: 18px;
        }

        .footerInner p {
          color: #697791;
          font-size: 10px;
          margin: 8px 0 0;
        }

        .footerSocials {
          display: flex;
          gap: 9px;
        }

        .footerSocials a {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(130, 140, 190, 0.3);
          background: rgba(255, 255, 255, 0.025);
        }

        .copyright {
          text-align: right;
          color: #697791;
          font-size: 9px;
          line-height: 1.8;
        }

        .copyright span {
          color: #909bb3;
        }

        .toast {
          position: fixed;
          left: 50%;
          bottom: 25px;
          transform: translateX(-50%);
          z-index: 999;
          padding: 13px 20px;
          border-radius: 30px;
          background: rgba(11, 18, 42, 0.94);
          border: 1px solid rgba(116, 91, 255, 0.55);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          font-size: 11px;
        }

        @media (max-width: 1000px) {
          .navLinks {
            gap: 14px;
          }

          .overviewGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .priceCard {
            grid-column: span 2;
          }

          .hero {
            grid-template-columns: 1fr;
          }

          .heroVisual {
            margin-top: 20px;
          }
        }

        @media (max-width: 760px) {
          .navWrap {
            padding: 0 10px;
          }

          .navbar {
            border-radius: 16px;
          }

          .navLinks {
            position: absolute;
            top: 75px;
            left: 10px;
            right: 10px;
            padding: 15px;
            display: none;
            flex-direction: column;
            align-items: stretch;
            border: 1px solid rgba(110, 130, 255, 0.25);
            border-radius: 16px;
            background: rgba(4, 10, 27, 0.97);
            backdrop-filter: blur(20px);
          }

          .navLinks.mobileOpen {
            display: flex;
          }

          .navLinks a {
            padding: 12px;
          }

          .themeBtn,
          .socialMini {
            display: none;
          }

          .hamburger {
            display: block;
          }

          .walletBtn {
            padding: 10px 13px;
            font-size: 10px;
            min-width: 110px;
          }

          .section {
            width: min(100% - 24px, 1160px);
            padding: 70px 0;
          }

          .hero {
            min-height: auto;
            padding-top: 130px;
          }

          .hero h1 {
            font-size: clamp(65px, 20vw, 100px);
            letter-spacing: -5px;
          }

          .heroButtons {
            flex-direction: column;
          }

          .primaryBtn,
          .secondaryBtn {
            width: 100%;
          }

          .heroVisual {
            height: 430px;
            transform: scale(0.85);
            margin-left: -30px;
            margin-right: -30px;
          }

          .planetMain {
            width: 350px;
            height: 350px;
          }

          .fox {
            left: 17%;
            transform: scale(0.8);
          }

          .heroQuote {
            right: 0;
            bottom: 15px;
          }

          .overviewGrid {
            grid-template-columns: 1fr 1fr;
          }

          .priceCard {
            grid-column: span 2;
          }

          .aboutSection,
          .tokenomicsGrid {
            grid-template-columns: 1fr;
          }

          .roadmap {
            grid-template-columns: 1fr;
          }

          .roadArrow {
            display: none;
          }

          .faqGrid {
            grid-template-columns: 1fr;
          }

          .communityBox {
            padding: 30px;
          }

          .communityPlanet {
            opacity: 0.25;
            right: -50px;
          }

          .notifySection {
            flex-direction: column;
            align-items: stretch;
          }

          .notifySection form {
            min-width: 0;
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
          .overviewGrid {
            grid-template-columns: 1fr;
          }

          .priceCard {
            grid-column: auto;
          }

          .countdown {
            gap: 5px;
          }

          .countdown div {
            padding: 8px 3px;
          }

          .countdown strong {
            font-size: 18px;
          }

          .heroVisual {
            transform: scale(0.7);
            margin-top: -20px;
            margin-bottom: -50px;
          }

          .notifySection form {
            flex-direction: column;
            border-radius: 15px;
            gap: 5px;
          }

          .notifySection button {
            min-height: 40px;
          }
        }
      `}</style>
    </main>
  );
}