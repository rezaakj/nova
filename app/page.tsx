"use client";

import { useState } from "react";
import {
  WagmiProvider,
  createConfig,
  http,
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const config = createConfig({
  chains: [mainnet],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

const TELEGRAM = "https://t.me/NOVAFOX18";
const TWITTER = "https://x.com/NOVAverse12";

function shortenAddress(address?: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const [message, setMessage] = useState("");

  const handleWallet = async () => {
    if (isConnected) {
      disconnect();
      setMessage("Wallet disconnected.");
      return;
    }

    try {
      setMessage("");

      connect(
        { connector: injected() },
        {
          onSuccess: () => {
            setMessage("Wallet connected successfully ✓");
          },
          onError: (error) => {
            setMessage(error.message || "Wallet connection failed.");
          },
        }
      );
    } catch {
      setMessage("Could not connect wallet.");
    }
  };

  return (
    <div className="walletArea">
      <button className="walletBtn" onClick={handleWallet}>
        {isPending
          ? "Connecting..."
          : isConnected
            ? `${shortenAddress(address)} ✓`
            : "Connect Wallet"}
      </button>

      {isConnected && (
        <div className="walletInfo">
          <div>
            <span>Wallet</span>
            <strong>{shortenAddress(address)}</strong>
          </div>

          <div>
            <span>Network</span>
            <strong>
              {chainId === mainnet.id ? "Ethereum Mainnet" : `Chain ${chainId}`}
            </strong>
          </div>
        </div>
      )}

      {message && <div className="walletMessage">{message}</div>}
    </div>
  );
}

function Logo() {
  return (
    <div className="logo">
      <div className="logoMark">✦</div>
      <span>NOVA</span>
    </div>
  );
}

function Stars() {
  return (
    <div className="stars">
      {Array.from({ length: 70 }).map((_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 61) % 100}%`,
            animationDelay: `${(i % 8) * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}

function NovaSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [notify, setNotify] = useState("");

  const faqs = [
    {
      q: "When will NOVA launch?",
      a: "The official launch date will be announced through NOVA's official channels.",
    },
    {
      q: "How can I buy NOVA?",
      a: "NOVA purchase functionality will only be enabled after the official launch details are finalized.",
    },
    {
      q: "Which wallet can I use?",
      a: "Compatible browser wallets can connect to the website through the standard wallet connection interface.",
    },
    {
      q: "Will there be a presale?",
      a: "Official presale information will be published through NOVA's verified channels.",
    },
    {
      q: "Is NOVA audited?",
      a: "Audit information will be published if and when an independent audit is completed.",
    },
    {
      q: "Is this a long-term project?",
      a: "NOVA is being developed as a community-focused internet brand.",
    },
  ];

  const showNotify = (text: string) => {
    setNotify(text);
    setTimeout(() => setNotify(""), 3000);
  };

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      showNotify("Please enter a valid email.");
      return;
    }

    setSubscribed(true);
    setEmail("");
    showNotify("You're on the NOVA notification list 🚀");
  };

  return (
    <main>
      <Stars />

      {notify && <div className="toast">{notify}</div>}

      <header className="navbarWrap">
        <nav className="navbar">
          <a href="#home">
            <Logo />
          </a>

          <div className={`navLinks ${menuOpen ? "open" : ""}`}>
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
              className="social"
              href={TWITTER}
              target="_blank"
              rel="noreferrer"
            >
              𝕏
            </a>

            <a
              className="social"
              href={TELEGRAM}
              target="_blank"
              rel="noreferrer"
            >
              ✈
            </a>

            <WalletButton />

            <button
              className="hamburger"
              onClick={() => setMenuOpen((v) => !v)}
            >
              ☰
            </button>
          </div>
        </nav>
      </header>

      <section className="hero section" id="home">
        <div className="heroText">
          <div className="badge">
            <span />
            🚀 LAUNCHING SOON
          </div>

          <h1>
            $N<span>O</span>VA
          </h1>

          <h2>
            THE NEXT <b>MEME IN ORBIT.</b>
          </h2>

          <p>
            Born on the internet.
            <br />
            Built for the community.
          </p>

          <div className="countdown">
            <div>
              <strong>40</strong>
              <small>DAYS</small>
            </div>
            <div>
              <strong>00</strong>
              <small>HOURS</small>
            </div>
            <div>
              <strong>00</strong>
              <small>MINUTES</small>
            </div>
            <div>
              <strong>00</strong>
              <small>SECONDS</small>
            </div>
          </div>

          <div className="buttons">
            <button
              className="primary"
              onClick={() =>
                showNotify("NOVA launch is not live yet 🚀")
              }
            >
              🚀 BUY NOVA
            </button>

            <a
              className="secondary"
              href={TWITTER}
              target="_blank"
              rel="noreferrer"
            >
              𝕏 FOLLOW ON X
            </a>
          </div>

          <div className="communityLinks">
            <span>Join the Community:</span>
            <a href={TWITTER} target="_blank" rel="noreferrer">
              𝕏
            </a>
            <a href={TELEGRAM} target="_blank" rel="noreferrer">
              ✈
            </a>
          </div>
        </div>

        <div className="heroVisual">
          <div className="planet" />

          <div className="orbit orbit1" />
          <div className="orbit orbit2" />

          <div className="fox">
            🦊
          </div>

          <div className="rocket">🚀</div>

          <div className="quote">
            ★ We're not going to the moon...
            <b>We're building a new orbit.</b>
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="title">
          <span>WHO IS NOVA?</span>
          <h2>
            About <b>NOVA</b>
          </h2>
          <p>Not just a token. A movement.</p>
        </div>

        <div className="aboutGrid">
          <div className="aboutCard">
            <div className="bigFox">🦊</div>
          </div>

          <div className="aboutContent">
            <h3>Born on the internet.</h3>

            <p>
              NOVA is a community-focused meme token concept inspired by
              internet culture, space and the unstoppable energy of crypto.
            </p>

            <p>
              The mission is simple: build a recognizable brand, create a fun
              community and develop transparently.
            </p>

            <div className="pills">
              <span>✦ Community First</span>
              <span>⌁ Fair Launch</span>
              <span>🚀 No Fake Promises</span>
              <span>∞ 100% Vibes</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="tokenomics">
        <div className="title">
          <span>THE NUMBERS</span>
          <h2>Tokenomics</h2>
          <p>Preliminary concept allocation.</p>
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
            <Allocation name="Community" value="70%" width="70%" />
            <Allocation name="Liquidity" value="20%" width="20%" />
            <Allocation name="Marketing" value="10%" width="10%" />

            <p>
              These allocations are preliminary and should be finalized before
              any public token launch.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="roadmap">
        <div className="title">
          <span>MISSION CONTROL</span>
          <h2>Roadmap</h2>
          <p>From ignition to supernova.</p>
        </div>

        <div className="roadmap">
          <Road
            phase="PHASE 01"
            title="IGNITION"
            items={[
              "Website Launch",
              "Community Building",
              "X Launch",
              "Meme Factory",
            ]}
          />

          <div className="arrow">»</div>

          <Road
            phase="PHASE 02"
            title="ORBIT"
            items={[
              "Token Launch",
              "DEX Listing",
              "Community Events",
              "Creator Campaigns",
            ]}
          />

          <div className="arrow">»</div>

          <Road
            phase="PHASE 03"
            title="SUPERNOVA"
            items={[
              "Partnerships",
              "Ecosystem Expansion",
              "Community Growth",
              "Bigger Ideas",
            ]}
          />
        </div>
      </section>

      <section className="section" id="faq">
        <div className="title">
          <span>QUESTIONS?</span>
          <h2>FAQ</h2>
          <p>Your questions, answered.</p>
        </div>

        <div className="faq">
          {faqs.map((item, index) => (
            <div className="faqItem" key={item.q}>
              <button
                onClick={() =>
                  setOpenFaq(openFaq === index ? null : index)
                }
              >
                {item.q}
                <b>{openFaq === index ? "−" : "+"}</b>
              </button>

              {openFaq === index && (
                <p>{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="section community" id="community">
        <div className="communityBox">
          <div>
            <span>JOIN THE CREW</span>

            <h2>
              The future is <b>community.</b>
            </h2>

            <p>
              Follow NOVA and be there when the countdown reaches zero.
            </p>

            <div className="communityButtons">
              <a
                href={TWITTER}
                target="_blank"
                rel="noreferrer"
              >
                𝕏 Follow on X
              </a>

              <a
                href={TELEGRAM}
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

      <section className="section notifySection">
        <div>
          <span>STAY IN ORBIT</span>
          <h2>Don&apos;t miss NOVA.</h2>
          <p>Stay connected for launch updates.</p>
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
              onChange={(e) => setEmail(e.target.value)}
            />

            <button>Notify Me</button>
          </form>
        )}
      </section>

      <footer>
        <Logo />

        <p>Born on the internet. Built for the community.</p>

        <div>
          <a href={TWITTER} target="_blank" rel="noreferrer">
            𝕏
          </a>

          <a href={TELEGRAM} target="_blank" rel="noreferrer">
            ✈
          </a>
        </div>

        <small>© 2026 NOVA. Concept website.</small>
      </footer>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          background: #020611;
        }

        body {
          margin: 0;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(100, 40, 255, 0.25),
              transparent 35%
            ),
            #020611;
          color: white;
          font-family: Arial, sans-serif;
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
          z-index: -1;
          pointer-events: none;
        }

        .stars span {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          opacity: 0.5;
          animation: twinkle 3s infinite;
        }

        @keyframes twinkle {
          50% {
            opacity: 1;
            transform: scale(1.7);
          }
        }

        .navbarWrap {
          position: fixed;
          top: 18px;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 0 20px;
        }

        .navbar {
          max-width: 1180px;
          min-height: 65px;
          margin: auto;
          padding: 10px 15px;
          display: flex;
          align-items: center;
          gap: 25px;
          border: 1px solid rgba(100, 120, 255, 0.3);
          border-radius: 20px;
          background: rgba(3, 9, 25, 0.85);
          backdrop-filter: blur(20px);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 23px;
          font-weight: 900;
        }

        .logoMark {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: linear-gradient(135deg, #9b4dff, #24c9ff);
          box-shadow: 0 0 25px rgba(143, 70, 255, 0.5);
        }

        .navLinks {
          flex: 1;
          display: flex;
          justify-content: center;
          gap: 25px;
        }

        .navLinks a {
          color: #aeb9d4;
          font-size: 13px;
        }

        .navLinks a:hover {
          color: white;
        }

        .navRight {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .social {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.04);
        }

        .walletBtn {
          border: 0;
          padding: 12px 18px;
          border-radius: 30px;
          color: white;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          background: linear-gradient(90deg, #27cfff, #9b43ff);
          box-shadow: 0 0 25px rgba(120, 70, 255, 0.4);
        }

        .walletArea {
          position: relative;
        }

        .walletInfo {
          position: absolute;
          top: 52px;
          right: 0;
          width: 240px;
          padding: 15px;
          border: 1px solid rgba(100, 130, 255, 0.3);
          border-radius: 15px;
          background: rgba(4, 10, 28, 0.97);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
        }

        .walletInfo div {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 8px;
        }

        .walletInfo div:last-child {
          margin-bottom: 0;
        }

        .walletInfo span {
          color: #71809d;
          font-size: 10px;
        }

        .walletInfo strong {
          color: #dce3f5;
          font-size: 10px;
        }

        .walletMessage {
          position: absolute;
          top: 55px;
          right: 0;
          white-space: nowrap;
          color: #92a0bd;
          font-size: 10px;
        }

        .hamburger {
          display: none;
          border: 0;
          background: transparent;
          color: white;
          font-size: 25px;
        }

        .section {
          width: min(1160px, calc(100% - 40px));
          margin: auto;
          padding: 110px 0;
        }

        .hero {
          min-height: 850px;
          padding-top: 170px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          align-items: center;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 15px;
          border-radius: 30px;
          border: 1px solid rgba(100, 130, 255, 0.35);
          color: #cbd5f5;
          font-size: 11px;
          font-weight: 800;
        }

        .badge span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #3fd7ff;
          box-shadow: 0 0 15px #3fd7ff;
        }

        .hero h1 {
          margin: 20px 0;
          font-size: clamp(75px, 10vw, 135px);
          line-height: 0.9;
          letter-spacing: -8px;
          background: linear-gradient(#fff, #eee, #8e4bff);
          -webkit-background-clip: text;
          color: transparent;
        }

        .hero h1 span {
          background: linear-gradient(90deg, #a14bff, #35caff);
          -webkit-background-clip: text;
          color: transparent;
        }

        .hero h2 {
          font-size: clamp(23px, 3vw, 37px);
        }

        .hero h2 b {
          background: linear-gradient(90deg, #a44dff, #38caff);
          -webkit-background-clip: text;
          color: transparent;
        }

        .heroText > p {
          color: #9aa7c2;
          line-height: 1.8;
        }

        .countdown {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          max-width: 430px;
          margin: 30px 0;
        }

        .countdown div {
          padding: 13px 5px;
          text-align: center;
          border: 1px solid rgba(110, 135, 255, 0.25);
          border-radius: 12px;
          background: rgba(8, 18, 42, 0.75);
        }

        .countdown strong {
          display: block;
          font-size: 23px;
        }

        .countdown small {
          color: #7e8ba8;
          font-size: 8px;
        }

        .buttons {
          display: flex;
          gap: 10px;
        }

        .primary,
        .secondary {
          min-height: 48px;
          padding: 0 24px;
          border-radius: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .primary {
          border: 0;
          color: white;
          background: linear-gradient(90deg, #27cfff, #9b43ff);
          box-shadow: 0 0 25px rgba(120, 70, 255, 0.4);
        }

        .secondary {
          border: 1px solid rgba(110, 135, 255, 0.35);
          background: rgba(5, 12, 30, 0.7);
        }

        .communityLinks {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 25px;
          color: #7f8ca8;
          font-size: 11px;
        }

        .communityLinks a {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(120, 140, 255, 0.3);
        }

        .heroVisual {
          height: 600px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .planet {
          width: 470px;
          height: 470px;
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 30%, #55e0ff, #174a9e 25%, #08123a 60%, #01030e 72%);
          box-shadow: 0 0 90px rgba(50, 150, 255, 0.25);
        }

        .orbit {
          position: absolute;
          width: 570px;
          height: 180px;
          border: 1px solid rgba(130, 80, 255, 0.45);
          border-radius: 50%;
        }

        .orbit1 {
          transform: rotate(-20deg);
        }

        .orbit2 {
          transform: rotate(20deg);
          border-color: rgba(40, 200, 255, 0.3);
        }

        .fox {
          position: absolute;
          z-index: 5;
          font-size: 220px;
          filter: drop-shadow(0 0 35px rgba(170, 70, 255, 0.7));
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float {
          50% {
            transform: translateY(-18px);
          }
        }

        .rocket {
          position: absolute;
          right: 10%;
          top: 5%;
          font-size: 65px;
          animation: rocket 3s infinite ease-in-out;
        }

        @keyframes rocket {
          50% {
            transform: translateY(-15px) rotate(-10deg);
          }
        }

        .quote {
          position: absolute;
          right: 0;
          bottom: 30px;
          width: 290px;
          padding: 15px;
          border: 1px solid rgba(100, 130, 255, 0.3);
          border-radius: 15px;
          background: rgba(4, 13, 31, 0.8);
          color: #c9d1e6;
          font-size: 11px;
          line-height: 1.6;
        }

        .quote b {
          display: block;
          color: #ffb23d;
        }

        .title {
          margin-bottom: 35px;
        }

        .title > span {
          color: #8996b5;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 3px;
        }

        .title h2 {
          font-size: 45px;
          margin: 8px 0;
        }

        .title h2 b {
          background: linear-gradient(90deg, #a34cff, #35caff);
          -webkit-background-clip: text;
          color: transparent;
        }

        .title p {
          color: #8996b5;
        }

        .aboutGrid,
        .tokenGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .aboutCard,
        .donutCard,
        .allocation {
          min-height: 350px;
          padding: 30px;
          border: 1px solid rgba(100, 125, 255, 0.25);
          border-radius: 20px;
          background: rgba(6, 16, 37, 0.75);
        }

        .aboutCard {
          display: grid;
          place-items: center;
          background:
            radial-gradient(circle, rgba(100, 60, 255, 0.3), transparent 45%),
            rgba(6, 16, 37, 0.75);
        }

        .bigFox {
          font-size: 160px;
          filter: drop-shadow(0 0 35px rgba(150, 70, 255, 0.7));
        }

        .aboutContent {
          padding: 25px;
        }

        .aboutContent h3 {
          font-size: 25px;
        }

        .aboutContent p {
          color: #96a2bd;
          line-height: 1.8;
        }

        .pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 25px;
        }

        .pills span {
          padding: 9px 12px;
          border: 1px solid rgba(100, 125, 255, 0.25);
          border-radius: 20px;
          color: #b8c3dc;
          font-size: 10px;
        }

        .donutCard {
          display: grid;
          place-items: center;
        }

        .donut {
          width: 260px;
          height: 260px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: conic-gradient(
            #8d45ff 0 70%,
            #d557bc 70% 90%,
            #ff9b36 90% 100%
          );
        }

        .donut > div {
          width: 175px;
          height: 175px;
          display: grid;
          place-items: center;
          align-content: center;
          border-radius: 50%;
          background: #061026;
        }

        .donut strong {
          font-size: 40px;
        }

        .donut span {
          color: #7d8aa6;
          font-size: 10px;
        }

        .allocation {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 8px;
        }

        .allocationRow {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }

        .bar {
          height: 7px;
          margin-bottom: 10px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          overflow: hidden;
        }

        .bar span {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, #8d45ff, #35caff);
        }

        .allocation p {
          color: #697792;
          font-size: 10px;
          line-height: 1.7;
        }

        .roadmap {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr;
          align-items: center;
          gap: 10px;
        }

        .roadCard {
          min-height: 260px;
          padding: 25px;
          border: 1px solid rgba(140, 70, 255, 0.35);
          border-radius: 18px;
          background: rgba(40, 15, 70, 0.4);
        }

        .roadCard h3 {
          margin: 10px 0 25px;
        }

        .roadCard li {
          margin: 12px 0;
          color: #b3bdd4;
          font-size: 11px;
        }

        .phase {
          color: #a875ff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .arrow {
          font-size: 30px;
          color: #687492;
        }

        .faq {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .faqItem {
          border: 1px solid rgba(100, 125, 255, 0.22);
          border-radius: 13px;
          background: rgba(6, 16, 37, 0.65);
          overflow: hidden;
        }

        .faqItem button {
          width: 100%;
          padding: 18px;
          display: flex;
          justify-content: space-between;
          border: 0;
          background: transparent;
          color: white;
          cursor: pointer;
          text-align: left;
          font-size: 11px;
        }

        .faqItem button b {
          color: #9c69ff;
          font-size: 18px;
        }

        .faqItem p {
          padding: 0 18px 18px;
          color: #8996b2;
          font-size: 11px;
          line-height: 1.7;
        }

        .communityBox {
          min-height: 320px;
          padding: 50px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(100, 125, 255, 0.3);
          border-radius: 25px;
          background:
            radial-gradient(circle at 80%, rgba(70, 120, 255, 0.3), transparent 35%),
            rgba(8, 20, 48, 0.8);
        }

        .communityBox > div:first-child {
          position: relative;
          z-index: 2;
        }

        .communityBox span {
          color: #8b98b5;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 3px;
        }

        .communityBox h2 {
          font-size: 43px;
        }

        .communityBox h2 b {
          color: #3bcaff;
        }

        .communityBox p {
          color: #96a3bf;
        }

        .communityButtons {
          display: flex;
          gap: 10px;
          margin-top: 25px;
        }

        .communityButtons a {
          padding: 13px 20px;
          border-radius: 12px;
          background: white;
          color: #050817;
          font-size: 11px;
          font-weight: 900;
        }

        .communityButtons a + a {
          background: #27aef1;
          color: white;
        }

        .communityFox {
          position: absolute;
          right: 10%;
          top: 35px;
          font-size: 210px;
          filter: drop-shadow(0 0 35px rgba(120, 70, 255, 0.6));
        }

        .notifySection {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          padding: 30px;
          border: 1px solid rgba(100, 125, 255, 0.25);
          border-radius: 20px;
          background: rgba(7, 18, 42, 0.75);
        }

        .notifySection > div > span {
          color: #8996b5;
          font-size: 10px;
          letter-spacing: 3px;
          font-weight: 900;
        }

        .notifySection h2 {
          margin: 7px 0;
        }

        .notifySection p {
          color: #7886a3;
          font-size: 11px;
        }

        .notifySection form {
          min-width: 400px;
          display: flex;
          padding: 5px;
          border: 1px solid rgba(110, 130, 255, 0.25);
          border-radius: 40px;
        }

        .notifySection input {
          flex: 1;
          min-width: 0;
          padding: 12px 15px;
          border: 0;
          outline: 0;
          background: transparent;
          color: white;
        }

        .notifySection button {
          border: 0;
          padding: 0 20px;
          border-radius: 30px;
          color: white;
          background: linear-gradient(90deg, #27cfff, #9b43ff);
          cursor: pointer;
        }

        .subscribed {
          padding: 14px 20px;
          border-radius: 30px;
          background: rgba(120, 70, 255, 0.2);
        }

        footer {
          padding: 40px 20px;
          text-align: center;
          border-top: 1px solid rgba(100, 125, 255, 0.15);
        }

        footer .logo {
          justify-content: center;
        }

        footer p,
        footer small {
          color: #697792;
          font-size: 10px;
        }

        footer > div:last-of-type {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin: 20px 0;
        }

        footer a {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(120, 140, 190, 0.3);
          border-radius: 50%;
        }

        .toast {
          position: fixed;
          left: 50%;
          bottom: 25px;
          transform: translateX(-50%);
          z-index: 999;
          padding: 13px 20px;
          border: 1px solid rgba(120, 90, 255, 0.5);
          border-radius: 30px;
          background: rgba(10, 18, 40, 0.95);
          font-size: 11px;
        }

        @media (max-width: 900px) {
          .hero,
          .aboutGrid,
          .tokenGrid {
            grid-template-columns: 1fr;
          }

          .heroVisual {
            margin-top: 30px;
          }

          .overviewGrid {
            grid-template-columns: 1fr 1fr;
          }

          .roadmap {
            grid-template-columns: 1fr;
          }

          .arrow {
            display: none;
          }

          .communityFox {
            opacity: 0.25;
          }

          .notifySection {
            flex-direction: column;
            align-items: stretch;
          }

          .notifySection form {
            min-width: 0;
          }
        }

        @media (max-width: 700px) {
          .navbarWrap {
            padding: 0 10px;
          }

          .navLinks {
            display: none;
            position: absolute;
            top: 75px;
            left: 10px;
            right: 10px;
            padding: 15px;
            flex-direction: column;
            background: rgba(4, 10, 27, 0.98);
            border: 1px solid rgba(100, 125, 255, 0.25);
            border-radius: 15px;
          }

          .navLinks.open {
            display: flex;
          }

          .social {
            display: none;
          }

          .hamburger {
            display: block;
          }

          .walletBtn {
            padding: 10px 12px;
            font-size: 10px;
          }

          .section {
            width: calc(100% - 24px);
            padding: 75px 0;
          }

          .hero {
            padding-top: 130px;
          }

          .hero h1 {
            font-size: 80px;
          }

          .heroVisual {
            height: 430px;
          }

          .planet {
            width: 330px;
            height: 330px;
          }

          .fox {
            font-size: 150px;
          }

          .orbit {
            width: 390px;
          }

          .faq {
            grid-template-columns: 1fr;
          }

          .communityBox {
            padding: 30px;
          }

          .communityBox h2 {
            font-size: 32px;
          }

          .communityButtons {
            flex-direction: column;
          }

          .communityButtons a {
            text-align: center;
          }

          .communityFox {
            right: -30px;
            font-size: 150px;
          }

          .walletInfo {
            right: -40px;
          }
        }
      `}</style>
    </main>
  );
}

function Allocation({
  name,
  value,
  width,
}: {
  name: string;
  value: string;
  width: string;
}) {
  return (
    <>
      <div className="allocationRow">
        <span>{name}</span>
        <strong>{value}</strong>
      </div>

      <div className="bar">
        <span style={{ width }} />
      </div>
    </>
  );
}

function Road({
  phase,
  title,
  items,
}: {
  phase: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="roadCard">
      <span className="phase">{phase}</span>
      <h3>{title}</h3>

      <ul>
        {items.map((item) => (
          <li key={item}>✓ {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <NovaSite />
      </QueryClientProvider>
    </WagmiProvider>
  );
}