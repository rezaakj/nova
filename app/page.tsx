```tsx
"use client";

import { useState } from "react";

const NOVA_PER_DOLLAR = 10000;

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState("1");
  const [showWallet, setShowWallet] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [approved, setApproved] = useState(false);
  const [message, setMessage] = useState("");

  const novaAmount =
    (Number(amount) || 0) * NOVA_PER_DOLLAR;

  function connectDemoWallet() {
    setWallet("0x7A4F...92F1");
    setShowWallet(false);
    setMessage("Demo wallet connected successfully.");
  }

  function approveDemo() {
    setApproved(true);
    setShowApproval(false);
    setMessage("Demo approval confirmed — no real transaction was made.");
  }

  return (
    <main className="page">
      <nav className="nav">
        <a href="#home" className="logo">
          ✦ <span>NOVA</span>
        </a>

        <div className="links">
          <a href="#about">About</a>
          <a href="#tokenomics">Tokenomics</a>
          <a href="#swap">Swap</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#community">Community</a>
        </div>

        <button
          className="connect"
          onClick={() =>
            wallet ? setWallet("") : setShowWallet(true)
          }
        >
          {wallet ? `${wallet} ✓` : "Connect Wallet"}
        </button>
      </nav>

      <section className="hero" id="home">
        <div className="heroText">
          <div className="badge">🚀 NOVA DEMO IS LIVE</div>

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

          <div className="buttons">
            <a href="#swap" className="primary">
              🚀 Explore NOVA
            </a>

            <a
              href="https://x.com/NOVAverse12"
              target="_blank"
              rel="noreferrer"
              className="secondary"
            >
              𝕏 Follow on X
            </a>
          </div>
        </div>

        <div className="space">
          <div className="planet" />
          <div className="orbit orbit1" />
          <div className="orbit orbit2" />

          <div className="fox">
            🦊
            <div className="helmet">NOVA</div>
          </div>

          <div className="rocket">🚀</div>
        </div>
      </section>

      <section className="section" id="swap">
        <div className="demoWarning">
          ⚠️ DEMO MODE — NO REAL TRANSACTION
        </div>

        <div className="sectionTitle">
          <small>NOVA / DEMO SWAP</small>
          <h2>Get your NOVA</h2>
          <p>
            Demo rate:
            <strong> 1 USD = 10,000 NOVA</strong>
          </p>
        </div>

        <div className="swapCard">
          <div className="walletStatus">
            <div>
              <small>Wallet</small>
              <strong>
                {wallet || "Not connected"}
              </strong>
            </div>

            <button
              onClick={() =>
                wallet
                  ? setWallet("")
                  : setShowWallet(true)
              }
            >
              {wallet ? "Disconnect" : "Connect"}
            </button>
          </div>

          <div className="swapBox">
            <div className="swapLabel">
              <span>You provide</span>
              <b>USD</b>
            </div>

            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1"
            />
          </div>

          <div className="arrow">↓</div>

          <div className="swapBox novaBox">
            <div className="swapLabel">
              <span>You receive</span>
              <b>✦ NOVA</b>
            </div>

            <div className="novaAmount">
              {novaAmount.toLocaleString()}
            </div>
          </div>

          <div className="rate">
            <span>Exchange Rate</span>
            <strong>1 USD = 10,000 NOVA</strong>
          </div>

          {!approved ? (
            <button
              className="approve"
              onClick={() => {
                if (!wallet) {
                  setShowWallet(true);
                  return;
                }

                setShowApproval(true);
              }}
            >
              {wallet
                ? "🔐 Approve NOVA — DEMO"
                : "🔗 Connect Wallet"}
            </button>
          ) : (
            <div className="approved">
              ✓ DEMO APPROVED
              <span>No real transaction was made.</span>
            </div>
          )}

          <p className="demoText">
            This interface is a demonstration only.
            No funds are transferred and no blockchain
            transaction is submitted.
          </p>
        </div>
      </section>

      <section className="section" id="about">
        <div className="sectionTitle">
          <small>WHO IS NOVA?</small>
          <h2>Not just a token.</h2>
          <p>
            A futuristic community concept built around
            internet culture, memes and space.
          </p>
        </div>

        <div className="cards">
          <div className="card">
            <span>🦊</span>
            <h3>Space Fox</h3>
            <p>
              The NOVA mascot — ready for the next orbit.
            </p>
          </div>

          <div className="card">
            <span>🌌</span>
            <h3>Community</h3>
            <p>
              Built around creativity and internet culture.
            </p>
          </div>

          <div className="card">
            <span>🚀</span>
            <h3>Future</h3>
            <p>
              A concept that grows with its community.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="tokenomics">
        <div className="sectionTitle">
          <small>THE NUMBERS</small>
          <h2>Tokenomics</h2>
        </div>

        <div className="tokenGrid">
          <div className="tokenCard">
            <strong>1B</strong>
            <span>Total Supply</span>
          </div>

          <div className="tokenCard">
            <strong>70%</strong>
            <span>Community</span>
          </div>

          <div className="tokenCard">
            <strong>20%</strong>
            <span>Liquidity Concept</span>
          </div>

          <div className="tokenCard">
            <strong>10%</strong>
            <span>Marketing Concept</span>
          </div>
        </div>

        <p className="note">
          Preliminary concept allocation. Final token
          details should only be published after they are
          officially determined.
        </p>
      </section>

      <section className="section" id="roadmap">
        <div className="sectionTitle">
          <small>MISSION CONTROL</small>
          <h2>Roadmap</h2>
        </div>

        <div className="roadmap">
          <div className="phase">
            <small>PHASE 01</small>
            <h3>IGNITION</h3>
            <p>Website • X • Community • Memes</p>
          </div>

          <div className="phase">
            <small>PHASE 02</small>
            <h3>ORBIT</h3>
            <p>Launch concept • DEX concept • Events</p>
          </div>

          <div className="phase">
            <small>PHASE 03</small>
            <h3>SUPERNOVA</h3>
            <p>Partnerships • Expansion • Bigger ideas</p>
          </div>
        </div>
      </section>

      <section className="section community" id="community">
        <div>
          <small>JOIN THE CREW</small>
          <h2>
            The future is <b>community.</b>
          </h2>

          <p>
            Follow NOVA and join the journey.
          </p>

          <div className="buttons">
            <a
              href="https://x.com/NOVAverse12"
              target="_blank"
              rel="noreferrer"
              className="primary"
            >
              𝕏 Follow X
            </a>

            <a
              href="https://t.me/NOVAFOX18"
              target="_blank"
              rel="noreferrer"
              className="secondary"
            >
              ✈ Join Telegram
            </a>
          </div>
        </div>

        <div className="bigFox">🦊</div>
      </section>

      <footer>
        <div className="logo">
          ✦ <span>NOVA</span>
        </div>

        <p>
          Born on the internet. Built for the community.
        </p>

        <div>
          <a
            href="https://x.com/NOVAverse12"
            target="_blank"
            rel="noreferrer"
          >
            𝕏
          </a>

          {"  "}

          <a
            href="https://t.me/NOVAFOX18"
            target="_blank"
            rel="noreferrer"
          >
            ✈
          </a>
        </div>

        <small>
          © 2026 NOVA — DEMO PROJECT
        </small>
      </footer>

      {showWallet && (
        <div
          className="modalBackdrop"
          onClick={() => setShowWallet(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close"
              onClick={() => setShowWallet(false)}
            >
              ×
            </button>

            <div className="modalIcon">🦊</div>

            <h2>Connect Wallet</h2>

            <p>
              Select a wallet to continue with the NOVA
              demo.
            </p>

            <button
              className="walletOption"
              onClick={connectDemoWallet}
            >
              🦊 NOVA Demo Wallet
              <span>Demo</span>
            </button>

            <button
              className="walletOption disabled"
              onClick={() =>
                setMessage(
                  "Real wallet connection is disabled in this demo."
                )
              }
            >
              🔗 Browser Wallet
              <span>Demo only</span>
            </button>

            <small className="modalNote">
              No real wallet connection or blockchain
              signature is requested.
            </small>
          </div>
        </div>
      )}

      {showApproval && (
        <div
          className="modalBackdrop"
          onClick={() => setShowApproval(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close"
              onClick={() => setShowApproval(false)}
            >
              ×
            </button>

            <div className="modalIcon">🔐</div>

            <h2>Approve NOVA</h2>

            <div className="approvalInfo">
              <div>
                <span>Wallet</span>
                <b>{wallet}</b>
              </div>

              <div>
                <span>Amount</span>
                <b>
                  {novaAmount.toLocaleString()} NOVA
                </b>
              </div>

              <div>
                <span>Rate</span>
                <b>1 USD = 10,000 NOVA</b>
              </div>
            </div>

            <div className="demoNotice">
              DEMO APPROVAL
              <small>
                This button only changes the demo state.
                No signature, payment or blockchain
                transaction will occur.
              </small>
            </div>

            <button
              className="approve"
              onClick={approveDemo}
            >
              ✓ Approve Demo
            </button>
          </div>
        </div>
      )}

      {message && (
        <div
          className="toast"
          onClick={() => setMessage("")}
        >
          {message}
        </div>
      )}

      <style jsx global>{`
        * {
          box-sizing: border-box;
          scroll-behavior: smooth;
        }

        html {
          background: #02040d;
        }

        body {
          margin: 0;
          background:
            radial-gradient(
              circle at 20% 10%,
              rgba(125, 40, 255, 0.2),
              transparent 30%
            ),
            radial-gradient(
              circle at 80% 30%,
              rgba(0, 190, 255, 0.12),
              transparent 30%
            ),
            #02040d;
          color: white;
          font-family: Arial, sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button,
        input {
          font: inherit;
        }

        .page {
          min-height: 100vh;
          overflow: hidden;
        }

        .nav {
          position: fixed;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          width: min(1150px, calc(100% - 30px));
          padding: 12px 15px;
          display: flex;
          align-items: center;
          gap: 25px;
          border: 1px solid rgba(120, 100, 255, 0.3);
          border-radius: 18px;
          background: rgba(3, 7, 22, 0.8);
          backdrop-filter: blur(20px);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 23px;
          font-weight: 900;
        }

        .logo span {
          background: linear-gradient(
            90deg,
            #fff,
            #b96cff,
            #3edaff
          );
          -webkit-background-clip: text;
          color: transparent;
        }

        .links {
          display: flex;
          justify-content: center;
          gap: 25px;
          flex: 1;
        }

        .links a {
          color: #9ba6c5;
          font-size: 12px;
        }

        .links a:hover {
          color: white;
        }

        .connect,
        .primary,
        .approve {
          border: 0;
          border-radius: 30px;
          padding: 12px 20px;
          color: white;
          font-weight: 800;
          cursor: pointer;
          background: linear-gradient(
            90deg,
            #20cfff,
            #9347ff
          );
          box-shadow: 0 0 25px rgba(117, 64, 255, 0.35);
        }

        .hero {
          width: min(1150px, calc(100% - 30px));
          min-height: 850px;
          margin: auto;
          padding-top: 150px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
        }

        .badge,
        .demoWarning {
          display: inline-block;
          padding: 9px 15px;
          border: 1px solid rgba(110, 100, 255, 0.35);
          border-radius: 30px;
          background: rgba(50, 30, 100, 0.3);
          color: #b9c8ff;
          font-size: 11px;
          font-weight: 800;
        }

        .hero h1 {
          margin: 25px 0 10px;
          font-size: clamp(80px, 12vw, 145px);
          line-height: 0.9;
          letter-spacing: -8px;
          background: linear-gradient(
            180deg,
            white,
            #d6d0ff 40%,
            #8a40ff
          );
          -webkit-background-clip: text;
          color: transparent;
        }

        .hero h1 span {
          color: white;
          -webkit-text-fill-color: white;
        }

        .hero h2 {
          font-size: clamp(25px, 4vw, 40px);
          margin: 20px 0;
        }

        .hero h2 b,
        .community h2 b {
          background: linear-gradient(
            90deg,
            #9c45ff,
            #35d4ff
          );
          -webkit-background-clip: text;
          color: transparent;
        }

        .hero p,
        .sectionTitle p,
        .community p {
          color: #9aa6c3;
          line-height: 1.8;
        }

        .buttons {
          display: flex;
          gap: 10px;
          margin-top: 25px;
          flex-wrap: wrap;
        }

        .secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 22px;
          border: 1px solid rgba(100, 130, 255, 0.35);
          border-radius: 30px;
          background: rgba(255,255,255,.03);
          font-weight: 800;
          font-size: 12px;
        }

        .space {
          height: 600px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .planet {
          width: 430px;
          height: 430px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 30% 25%,
              #57ddff,
              #18418e 30%,
              #070d2b 65%,
              #01030b
            );
          box-shadow: 0 0 100px rgba(40, 150, 255, .25);
        }

        .orbit {
          position: absolute;
          width: 540px;
          height: 180px;
          border: 1px solid rgba(150, 75, 255, .5);
          border-radius: 50%;
        }

        .orbit1 {
          transform: rotate(-20deg);
        }

        .orbit2 {
          transform: rotate(20deg);
          border-color: rgba(30, 200, 255, .3);
        }

        .fox {
          position: absolute;
          font-size: 175px;
          filter: drop-shadow(0 0 35px #8b43ff);
          animation: float 4s ease-in-out infinite;
        }

        .helmet {
          position: absolute;
          left: 50%;
          bottom: -5px;
          transform: translateX(-50%);
          padding: 5px 18px;
          border: 1px solid #6672a8;
          border-radius: 20px;
          background: #131936;
          font-size: 10px;
          letter-spacing: 3px;
          font-weight: 900;
        }

        .rocket {
          position: absolute;
          right: 5%;
          top: 5%;
          font-size: 65px;
          animation: rocket 3s ease-in-out infinite;
        }

        @keyframes float {
          50% {
            transform: translateY(-18px);
          }
        }

        @keyframes rocket {
          50% {
            transform: translateY(-15px) rotate(-8deg);
          }
        }

        .section {
          width: min(1150px, calc(100% - 30px));
          margin: auto;
          padding: 100px 0;
        }

        .sectionTitle {
          margin: 25px 0 35px;
        }

        .sectionTitle small,
        .community small {
          color: #9a7aff;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 3px;
        }

        .sectionTitle h2,
        .community h2 {
          font-size: clamp(35px, 5vw, 55px);
          margin: 10px 0;
        }

        .swapCard {
          max-width: 600px;
          margin: auto;
          padding: 25px;
          border: 1px solid rgba(120, 100, 255, .3);
          border-radius: 25px;
          background: rgba(5, 13, 35, .85);
          box-shadow: 0 30px 100px rgba(0,0,0,.3);
        }

        .walletStatus {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 15px;
          background: rgba(255,255,255,.035);
        }

        .walletStatus small,
        .walletStatus strong {
          display: block;
        }

        .walletStatus small {
          color: #75819c;
          font-size: 10px;
          margin-bottom: 5px;
        }

        .walletStatus strong {
          font-size: 12px;
        }

        .walletStatus button {
          border: 1px solid rgba(120,130,255,.3);
          background: rgba(255,255,255,.04);
          color: white;
          border-radius: 20px;
          padding: 8px 15px;
          cursor: pointer;
        }

        .swapBox {
          padding: 18px;
          border: 1px solid rgba(100,120,255,.22);
          border-radius: 17px;
          background: rgba(255,255,255,.025);
        }

        .swapLabel {
          display: flex;
          justify-content: space-between;
          color: #8490ad;
          font-size: 11px;
        }

        .swapLabel b {
          color: white;
        }

        .swapBox input,
        .novaAmount {
          width: 100%;
          margin-top: 12px;
          border: 0;
          outline: 0;
          background: transparent;
          color: white;
          font-size: 32px;
          font-weight: 900;
        }

        .novaAmount {
          color: #b66aff;
        }

        .arrow {
          width: 40px;
          height: 40px;
          margin: -5px auto;
          position: relative;
          z-index: 2;
          display: grid;
          place-items: center;
          border: 1px solid rgba(120,100,255,.4);
          border-radius: 50%;
          background: #080d25;
        }

        .rate {
          display: flex;
          justify-content: space-between;
          margin: 15px 0;
          padding: 13px;
          border-radius: 12px;
          background: rgba(60,40,120,.15);
          color: #8f9ab5;
          font-size: 11px;
        }

        .rate strong {
          color: #b76bff;
        }

        .approve {
          width: 100%;
          margin-top: 5px;
        }

        .approved {
          padding: 15px;
          text-align: center;
          border-radius: 15px;
          background: rgba(40,220,160,.08);
          border: 1px solid rgba(40,220,160,.3);
          color: #54e7b0;
          font-weight: 900;
        }

        .approved span {
          display: block;
          margin-top: 5px;
          color: #779b90;
          font-size: 9px;
          font-weight: 400;
        }

        .demoText,
        .note {
          color: #687592;
          font-size: 10px;
          line-height: 1.7;
          text-align: center;
        }

        .cards,
        .tokenGrid,
        .roadmap {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .card,
        .tokenCard,
        .phase {
          padding: 30px;
          border: 1px solid rgba(100,120,255,.22);
          border-radius: 20px;
          background: rgba(7,16,40,.7);
        }

        .card span {
          font-size: 45px;
        }

        .card p,
        .phase p {
          color: #8995b0;
          line-height: 1.7;
          font-size: 12px;
        }

        .tokenCard strong {
          display: block;
          font-size: 40px;
          background: linear-gradient(90deg,#9a45ff,#35d4ff);
          -webkit-background-clip: text;
          color: transparent;
        }

        .tokenCard span {
          color: #8995b0;
        }

        .phase small {
          color: #a05cff;
          font-weight: 900;
        }

        .phase h3 {
          font-size: 25px;
        }

        .community {
          min-height: 350px;
          padding: 50px;
          border: 1px solid rgba(100,120,255,.3);
          border-radius: 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
          background:
            radial-gradient(circle at 85% 50%,rgba(80,60,255,.3),transparent 30%),
            rgba(8,16,40,.8);
        }

        .bigFox {
          font-size: 180px;
          filter: drop-shadow(0 0 50px #8745ff);
        }

        footer {
          padding: 45px 20px;
          text-align: center;
          border-top: 1px solid rgba(100,120,255,.15);
          color: #697590;
        }

        footer p {
          font-size: 11px;
        }

        footer small {
          display: block;
          margin-top: 15px;
          font-size: 9px;
        }

        .modalBackdrop {
          position: fixed;
          inset: 0;
          z-index: 999;
          display: grid;
          place-items: center;
          padding: 20px;
          background: rgba(0,0,0,.72);
          backdrop-filter: blur(12px);
        }

        .modal {
          width: min(430px,100%);
          position: relative;
          padding: 30px;
          border: 1px solid rgba(130,100,255,.4);
          border-radius: 24px;
          background: #071027;
          box-shadow: 0 30px 100px #000;
        }

        .close {
          position: absolute;
          right: 18px;
          top: 14px;
          border: 0;
          background: transparent;
          color: #8995b0;
          font-size: 25px;
          cursor: pointer;
        }

        .modalIcon {
          font-size: 45px;
        }

        .modal h2 {
          margin-bottom: 8px;
        }

        .modal p {
          color: #8995b0;
          font-size: 12px;
          line-height: 1.7;
        }

        .walletOption {
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 16px;
          margin-top: 10px;
          border: 1px solid rgba(110,120,255,.25);
          border-radius: 14px;
          background: rgba(255,255,255,.04);
          color: white;
          cursor: pointer;
        }

        .walletOption span {
          color: #a866ff;
          font-size: 10px;
        }

        .walletOption.disabled {
          opacity: .5;
        }

        .modalNote {
          display: block;
          margin-top: 18px;
          color: #65718b;
          font-size: 9px;
          line-height: 1.6;
        }

        .approvalInfo {
          margin: 20px 0;
          display: grid;
          gap: 8px;
        }

        .approvalInfo div {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          border-radius: 10px;
          background: rgba(255,255,255,.035);
        }

        .approvalInfo span {
          color: #77839d;
          font-size: 10px;
        }

        .approvalInfo b {
          font-size: 10px;
        }

        .demoNotice {
          padding: 15px;
          margin-bottom: 15px;
          border: 1px solid rgba(255,180,60,.25);
          border-radius: 12px;
          background: rgba(255,160,30,.07);
          color: #ffbd58;
          font-weight: 900;
          font-size: 11px;
        }

        .demoNotice small {
          display: block;
          margin-top: 6px;
          color: #9b896d;
          font-weight: 400;
          line-height: 1.5;
        }

        .toast {
          position: fixed;
          left: 50%;
          bottom: 25px;
          transform: translateX(-50%);
          z-index: 2000;
          padding: 13px 20px;
          border: 1px solid rgba(120,100,255,.4);
          border-radius: 30px;
          background: #0b1430;
          box-shadow: 0 15px 50px #000;
          font-size: 11px;
        }

        @media(max-width:800px) {
          .links {
            display: none;
          }

          .hero {
            grid-template-columns: 1fr;
            padding-top: 130px;
          }

          .space {
            height: 430px;
          }

          .planet {
            width: 320px;
            height: 320px;
          }

          .orbit {
            width: 390px;
          }

          .cards,
          .tokenGrid,
          .roadmap {
            grid-template-columns: 1fr;
          }

          .community {
            flex-direction: column;
            align-items: flex-start;
          }

          .bigFox {
            font-size: 110px;
            align-self: center;
          }
        }

        @media(max-width:500px) {
          .nav {
            width: calc(100% - 16px);
          }

          .connect {
            padding: 10px 13px;
            font-size: 10px;
          }

          .hero h1 {
            font-size: 75px;
          }

          .space {
            transform: scale(.8);
            margin: -30px;
          }

          .community {
            padding: 30px;
          }

          .rate {
            flex-direction: column;
            gap: 7px;
          }
        }
      `}</style>
    </main>
  );
}
```
