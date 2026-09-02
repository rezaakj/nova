"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  username: string | null;
  email: string | null;
  points: number;
};

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: "⌂",
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: "✦",
  },
  {
    href: "/profile",
    label: "Profile",
    icon: "◉",
  },
  {
    href: "/social",
    label: "Social",
    icon: "◎",
  },
  {
    href: "/roadmap",
    label: "Roadmap",
    icon: "◈",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const supabase = createClient();

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [menuOpen, setMenuOpen] =
    useState(false);

  useEffect(() => {
    loadProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
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
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("username,email,points")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile(data);
    }
  }

  async function logout() {
    await supabase.auth.signOut();

    setProfile(null);

    window.location.href = "/";
  }

  const username =
    profile?.username ||
    profile?.email?.split("@")[0] ||
    "NOVA User";

  const points = Number(
    profile?.points || 0
  );

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href;
  };

  return (
    <>
      <nav className="navbar">
        <div className="navGlow navGlowOne" />
        <div className="navGlow navGlowTwo" />

        <div className="gridBackground" />

        <div className="scanLine" />

        <div className="navInner">

          {/* LOGO */}

          <Link href="/" className="logo">
            <div className="logoOrb">
              <div className="logoOrbRing" />

              <div className="logoCore">
                ✦
              </div>
            </div>

            <div className="logoText">
              <strong>NOVA</strong>

              <span>
                FOX ECOSYSTEM
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}

          <div className="desktopLinks">
            {navItems.map((item) => {
              const active =
                isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`navItem ${
                    active
                      ? "active"
                      : ""
                  }`}
                >
                  <span className="activeGlow" />

                  <span className="navIcon">
                    {item.icon}
                  </span>

                  <span className="navLabel">
                    {item.label}
                  </span>

                  {active && (
                    <span className="activeDot" />
                  )}
                </Link>
              );
            })}

            {/* LAUNCH */}

            <Link
              href="/launch"
              className={`launchButton ${
                pathname === "/launch"
                  ? "activeLaunch"
                  : ""
              }`}
            >
              <span className="launchShine" />

              <span className="launchIcon">
                🚀
              </span>

              <span>
                Launch
              </span>

              <span className="launchArrow">
                ↗
              </span>
            </Link>
          </div>

          {/* ACCOUNT */}

          <div className="desktopAccount">
            {profile ? (
              <>
                <Link
                  href="/profile"
                  className={`profileCard ${
                    pathname === "/profile"
                      ? "profileActive"
                      : ""
                  }`}
                >
                  <div className="profileAvatar">
                    🦊
                  </div>

                  <div className="profileInfo">
                    <strong>
                      {username}
                    </strong>

                    <span>
                      <b>◆</b>{" "}
                      {points.toLocaleString()}{" "}
                      POINTS
                    </span>
                  </div>

                  <div className="profileArrow">
                    ›
                  </div>
                </Link>

                <button
                  onClick={logout}
                  className="logoutButton"
                  aria-label="Logout"
                >
                  <span>↪</span>
                </button>
              </>
            ) : (
              <Link
                href="/"
                className="loginButton"
              >
                <span>
                  Login
                </span>

                <span>
                  ↗
                </span>
              </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}

          <button
            className={`mobileMenuButton ${
              menuOpen
                ? "active"
                : ""
            }`}
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* MOBILE MENU */}

        <div
          className={`mobileMenu ${
            menuOpen
              ? "mobileMenuOpen"
              : ""
          }`}
        >
          <div className="mobileMenuGlow" />

          <div className="mobileMenuHeader">
            <span>
              NOVA NAVIGATION
            </span>

            <b>
              {pathname === "/"
                ? "HOME"
                : pathname
                    .replace("/", "")
                    .toUpperCase()}
            </b>
          </div>

          {navItems.map((item, index) => {
            const active =
              isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() =>
                  setMenuOpen(false)
                }
                className={`mobileNavItem ${
                  active
                    ? "activeMobile"
                    : ""
                }`}
              >
                <div className="mobileIcon">
                  {item.icon}
                </div>

                <div className="mobileNavText">
                  <strong>
                    {item.label}
                  </strong>

                  <span>
                    {active
                      ? "CURRENT PAGE"
                      : "NOVA MODULE"}
                  </span>
                </div>

                <small>
                  0{index + 1}
                </small>

                <b>
                  →
                </b>
              </Link>
            );
          })}

          {/* MOBILE LAUNCH */}

          <Link
            href="/launch"
            onClick={() =>
              setMenuOpen(false)
            }
            className={`mobileLaunch ${
              pathname === "/launch"
                ? "activeMobileLaunch"
                : ""
            }`}
          >
            <span className="mobileLaunchIcon">
              🚀
            </span>

            <div>
              <strong>
                Launch
              </strong>

              <small>
                TOKEN MILESTONE
              </small>
            </div>

            <span className="mobileLaunchArrow">
              ↗
            </span>
          </Link>

          {/* MOBILE ACCOUNT */}

          {profile ? (
            <div className="mobileAccount">
              <div className="mobileProfile">
                <div className="profileAvatar">
                  🦊
                </div>

                <div className="mobileProfileInfo">
                  <strong>
                    {username}
                  </strong>

                  <span>
                    ◆{" "}
                    {points.toLocaleString()}{" "}
                    POINTS
                  </span>
                </div>

                <Link
                  href="/profile"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="mobileProfileArrow"
                >
                  ↗
                </Link>
              </div>

              <button
                onClick={logout}
                className="mobileLogout"
              >
                <span>↪</span>
                Logout from NOVA
              </button>
            </div>
          ) : (
            <Link
              href="/"
              onClick={() =>
                setMenuOpen(false)
              }
              className="mobileLogin"
            >
              <span>
                Login / Register
              </span>

              <b>
                ↗
              </b>
            </Link>
          )}
        </div>
      </nav>

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        /* =========================
           NAVBAR
        ========================= */

        .navbar {
          position: sticky;
          top: 0;
          z-index: 9999;

          width: 100%;
          height: 86px;

          border-bottom: 1px solid
            rgba(167, 139, 250, 0.13);

          background:
            linear-gradient(
              180deg,
              rgba(5, 6, 15, 0.97),
              rgba(5, 6, 15, 0.9)
            );

          backdrop-filter:
            blur(28px)
            saturate(140%);

          box-shadow:
            0 12px 50px
              rgba(0, 0, 0, 0.4),

            inset 0 -1px 0
              rgba(255, 255, 255, 0.025);
        }

        /* =========================
           GRID
        ========================= */

        .gridBackground {
          position: absolute;
          inset: 0;

          opacity: 0.18;

          background-image:
            linear-gradient(
              rgba(124, 58, 237, 0.08)
              1px,
              transparent 1px
            ),

            linear-gradient(
              90deg,
              rgba(124, 58, 237, 0.08)
              1px,
              transparent 1px
            );

          background-size: 34px 34px;

          mask-image:
            linear-gradient(
              to bottom,
              black,
              transparent
            );

          pointer-events: none;
        }

        /* =========================
           GLOWS
        ========================= */

        .navGlow {
          position: absolute;

          pointer-events: none;

          filter: blur(30px);

          border-radius: 50%;
        }

        .navGlowOne {
          width: 420px;
          height: 160px;

          top: -115px;
          left: 42%;

          background:
            radial-gradient(
              ellipse,
              rgba(124, 58, 237, 0.23),
              transparent 70%
            );
        }

        .navGlowTwo {
          width: 250px;
          height: 120px;

          right: 3%;
          top: -90px;

          background:
            radial-gradient(
              ellipse,
              rgba(6, 182, 212, 0.12),
              transparent 70%
            );
        }

        /* =========================
           SCAN LINE
        ========================= */

        .scanLine {
          position: absolute;

          left: 0;
          top: 0;

          width: 100%;
          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(124, 58, 237, 0.5),
              rgba(103, 232, 249, 0.5),
              transparent
            );

          opacity: 0.5;

          animation:
            scan 5s linear infinite;
        }

        @keyframes scan {
          0% {
            transform:
              translateX(-100%);
          }

          100% {
            transform:
              translateX(100%);
          }
        }

        /* =========================
           INNER
        ========================= */

        .navInner {
          position: relative;
          z-index: 5;

          max-width: 1450px;

          height: 86px;

          margin: auto;

          padding: 0 28px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 30px;
        }

        /* =========================
           LOGO
        ========================= */

        .logo {
          display: flex;
          align-items: center;

          gap: 12px;

          min-width: 190px;

          color: white;

          text-decoration: none;

          perspective: 700px;
        }

        .logoOrb {
          position: relative;

          width: 48px;
          height: 48px;

          display: grid;
          place-items: center;

          border-radius: 16px;

          background:
            linear-gradient(
              145deg,
              rgba(124, 58, 237, 0.95),
              rgba(37, 99, 235, 0.9)
            );

          box-shadow:
            0 0 20px
              rgba(124, 58, 237, 0.42),

            0 10px 25px
              rgba(0, 0, 0, 0.3),

            inset 0 1px 1px
              rgba(255, 255, 255, 0.38);

          transform:
            perspective(600px)
            rotateX(8deg);

          transition:
            transform 0.35s,
            box-shadow 0.35s;
        }

        .logoOrb::before {
          content: "";

          position: absolute;

          inset: 2px;

          border-radius: 14px;

          border: 1px solid
            rgba(255, 255, 255, 0.2);
        }

        .logoOrb::after {
          content: "";

          position: absolute;

          width: 75px;
          height: 75px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(103, 232, 249, 0.18),
              transparent 70%
            );

          filter: blur(8px);

          animation:
            logoPulse 3s infinite;
        }

        .logo:hover .logoOrb {
          transform:
            perspective(600px)
            rotateX(16deg)
            rotateY(-14deg)
            translateY(-4px)
            scale(1.06);

          box-shadow:
            0 0 30px
              rgba(124, 58, 237, 0.55),

            0 15px 35px
              rgba(0, 0, 0, 0.4),

            inset 0 1px 1px
              rgba(255, 255, 255, 0.45);
        }

        .logoOrbRing {
          position: absolute;

          width: 34px;
          height: 34px;

          border-radius: 50%;

          border: 1px solid
            rgba(255, 255, 255, 0.25);

          animation:
            orbit 4s linear infinite;
        }

        @keyframes orbit {
          0% {
            transform:
              rotate(0deg)
              scale(0.9);
          }

          50% {
            transform:
              rotate(180deg)
              scale(1.08);
          }

          100% {
            transform:
              rotate(360deg)
              scale(0.9);
          }
        }

        .logoCore {
          position: relative;

          z-index: 3;

          font-size: 22px;

          color: white;

          text-shadow:
            0 0 15px
              rgba(255, 255, 255, 0.9);
        }

        .logoText strong {
          display: block;

          font-size: 21px;

          letter-spacing: 5px;

          line-height: 1;
        }

        .logoText span {
          display: block;

          margin-top: 6px;

          color: #666;

          font-size: 7px;

          letter-spacing: 3px;
        }

        /* =========================
           DESKTOP LINKS
        ========================= */

        .desktopLinks {
          display: flex;
          align-items: center;

          gap: 7px;

          padding: 7px;

          border-radius: 18px;

          border: 1px solid
            rgba(255, 255, 255, 0.06);

          background:
            rgba(255, 255, 255, 0.025);

          box-shadow:
            inset 0 1px 0
              rgba(255, 255, 255, 0.04),

            0 15px 35px
              rgba(0, 0, 0, 0.18);

          transform:
            perspective(900px)
            rotateX(1deg);
        }

        /* =========================
           NAV ITEM
        ========================= */

        .navItem {
          position: relative;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 7px;

          min-width: 78px;
          height: 44px;

          padding: 0 13px;

          border-radius: 12px;

          color: #777;

          text-decoration: none;

          font-size: 10px;
          font-weight: 700;

          overflow: visible;

          transition:
            transform 0.28s,
            color 0.28s,
            background 0.28s,
            border 0.28s,
            box-shadow 0.28s;

          transform-style: preserve-3d;
        }

        .navItem::before {
          content: "";

          position: absolute;

          inset: 0;

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              rgba(124, 58, 237, 0.18),
              rgba(6, 182, 212, 0.08)
            );

          opacity: 0;

          transition: 0.28s;

          pointer-events: none;
        }

        .navItem:hover {
          color: white;

          transform:
            translateY(-3px)
            translateZ(10px);

          background:
            rgba(255, 255, 255, 0.055);

          box-shadow:
            0 10px 25px
              rgba(124, 58, 237, 0.14);
        }

        .navItem:hover::before {
          opacity: 1;
        }

        /* =========================
           ACTIVE NAV
        ========================= */

        .navItem.active {
          color: white;

          background:
            linear-gradient(
              135deg,
              rgba(124, 58, 237, 0.23),
              rgba(6, 182, 212, 0.09)
            );

          border: 1px solid
            rgba(139, 92, 246, 0.28);

          box-shadow:
            0 0 18px
              rgba(124, 58, 237, 0.16),

            0 8px 25px
              rgba(0, 0, 0, 0.2),

            inset 0 1px 0
              rgba(255, 255, 255, 0.08);

          transform:
            translateY(-2px);
        }

        .navItem.active::before {
          opacity: 1;
        }

        .activeGlow {
          position: absolute;

          left: 15%;
          right: 15%;

          bottom: -8px;

          height: 7px;

          border-radius: 50%;

          background:
            radial-gradient(
              ellipse,
              rgba(124, 58, 237, 0.65),
              transparent 70%
            );

          filter: blur(5px);

          opacity: 0;

          pointer-events: none;
        }

        .navItem.active .activeGlow {
          opacity: 1;
        }

        .navItem.active::after {
          content: "";

          position: absolute;

          left: 18%;
          right: 18%;

          bottom: -5px;

          height: 2px;

          border-radius: 999px;

          background:
            linear-gradient(
              90deg,
              transparent,
              #8b5cf6,
              #67e8f9,
              transparent
            );

          box-shadow:
            0 0 9px
              rgba(139, 92, 246, 0.9),

            0 0 18px
              rgba(103, 232, 249, 0.35);
        }

        .activeDot {
          position: absolute;

          top: 5px;
          right: 6px;

          width: 4px;
          height: 4px;

          border-radius: 50%;

          background: #67e8f9;

          box-shadow:
            0 0 7px
              rgba(103, 232, 249, 0.9);
        }

        .navIcon {
          position: relative;

          z-index: 2;

          color: #8b7cff;

          font-size: 13px;

          transition:
            color 0.25s,
            transform 0.25s,
            text-shadow 0.25s;
        }

        .navItem:hover .navIcon {
          color: #67e8f9;

          transform:
            scale(1.15);
        }

        .navItem.active .navIcon {
          color: #67e8f9;

          transform:
            scale(1.18);

          text-shadow:
            0 0 10px
              rgba(103, 232, 249, 0.85);
        }

        .navLabel {
          position: relative;

          z-index: 2;
        }

        /* =========================
           LAUNCH
        ========================= */

        .launchButton {
          position: relative;

          display: flex;
          align-items: center;

          gap: 8px;

          height: 44px;

          margin-left: 5px;

          padding: 0 15px;

          border-radius: 12px;

          overflow: hidden;

          color: white;

          text-decoration: none;

          font-size: 10px;
          font-weight: 800;

          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #2563eb
            );

          box-shadow:
            0 8px 25px
              rgba(124, 58, 237, 0.28),

            inset 0 1px 0
              rgba(255, 255, 255, 0.25);

          transition:
            transform 0.3s,
            box-shadow 0.3s;
        }

        .launchButton:hover {
          transform:
            translateY(-4px)
            rotateX(5deg);

          box-shadow:
            0 15px 38px
              rgba(124, 58, 237, 0.45),

            0 0 30px
              rgba(37, 99, 235, 0.2);
        }

        .activeLaunch {
          box-shadow:
            0 0 25px
              rgba(124, 58, 237, 0.5),

            0 12px 35px
              rgba(37, 99, 235, 0.3),

            inset 0 1px 0
              rgba(255, 255, 255, 0.3);
        }

        .activeLaunch::after {
          content: "";

          position: absolute;

          inset: 2px;

          border-radius: 10px;

          border: 1px solid
            rgba(255, 255, 255, 0.18);

          pointer-events: none;
        }

        .launchShine {
          position: absolute;

          top: 0;
          left: -100%;

          width: 70%;
          height: 100%;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.25),
              transparent
            );

          transform:
            skewX(-20deg);

          animation:
            shine 3.5s infinite;
        }

        .launchIcon,
        .launchArrow {
          position: relative;
          z-index: 2;
        }

        .launchArrow {
          opacity: 0.75;

          font-size: 13px;
        }

        @keyframes shine {
          0% {
            left: -100%;
          }

          35%,
          100% {
            left: 150%;
          }
        }

        /* =========================
           ACCOUNT
        ========================= */

        .desktopAccount {
          display: flex;
          align-items: center;

          gap: 9px;

          min-width: 210px;

          justify-content: flex-end;
        }

        .profileCard {
          display: flex;
          align-items: center;

          gap: 9px;

          padding: 6px 9px 6px 6px;

          border-radius: 15px;

          border: 1px solid
            rgba(255, 255, 255, 0.07);

          background:
            linear-gradient(
              135deg,
              rgba(124, 58, 237, 0.1),
              rgba(255, 255, 255, 0.025)
            );

          color: white;

          text-decoration: none;

          transition: 0.3s;

          box-shadow:
            inset 0 1px 0
              rgba(255, 255, 255, 0.05);
        }

        .profileCard:hover {
          transform:
            translateY(-3px)
            perspective(500px)
            rotateX(3deg);

          border-color:
            rgba(124, 58, 237, 0.35);

          box-shadow:
            0 10px 30px
              rgba(124, 58, 237, 0.16);
        }

        .profileActive {
          border-color:
            rgba(103, 232, 249, 0.28);

          box-shadow:
            0 0 20px
              rgba(124, 58, 237, 0.18);
        }

        .profileAvatar {
          width: 38px;
          height: 38px;

          display: grid;
          place-items: center;

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #06b6d4
            );

          box-shadow:
            0 0 18px
              rgba(124, 58, 237, 0.28),

            inset 0 1px 1px
              rgba(255, 255, 255, 0.25);

          font-size: 19px;
        }

        .profileInfo {
          min-width: 75px;
        }

        .profileInfo strong {
          display: block;

          max-width: 90px;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

          font-size: 10px;
        }

        .profileInfo span {
          display: block;

          margin-top: 4px;

          color: #8b7cff;

          font-size: 7px;

          letter-spacing: 1px;
        }

        .profileInfo b {
          color: #67e8f9;
        }

        .profileArrow {
          color: #555;

          font-size: 20px;

          transition: 0.25s;
        }

        .profileCard:hover .profileArrow {
          color: #67e8f9;

          transform:
            translateX(3px);
        }

        .logoutButton {
          width: 36px;
          height: 36px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          border: 1px solid
            rgba(255, 255, 255, 0.07);

          background:
            rgba(255, 255, 255, 0.025);

          color: #777;

          cursor: pointer;

          transition: 0.25s;
        }

        .logoutButton:hover {
          color: white;

          border-color:
            rgba(248, 113, 113, 0.3);

          background:
            rgba(248, 113, 113, 0.08);

          transform:
            translateY(-2px);
        }

        .loginButton {
          display: flex;
          align-items: center;

          gap: 8px;

          padding: 11px 16px;

          border-radius: 12px;

          color: white;

          text-decoration: none;

          font-size: 10px;
          font-weight: 800;

          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #2563eb
            );

          box-shadow:
            0 8px 25px
              rgba(124, 58, 237, 0.25);

          transition: 0.3s;
        }

        .loginButton:hover {
          transform:
            translateY(-3px);

          box-shadow:
            0 12px 35px
              rgba(124, 58, 237, 0.4);
        }

        /* =========================
           MOBILE BUTTON
        ========================= */

        .mobileMenuButton {
          display: none;

          position: relative;

          width: 45px;
          height: 45px;

          border:
            1px solid
            rgba(255, 255, 255, 0.08);

          border-radius: 13px;

          background:
            rgba(255, 255, 255, 0.035);

          cursor: pointer;

          transition: 0.3s;
        }

        .mobileMenuButton:hover {
          border-color:
            rgba(124, 58, 237, 0.35);

          box-shadow:
            0 0 20px
              rgba(124, 58, 237, 0.15);
        }

        .mobileMenuButton span {
          position: absolute;

          left: 12px;

          width: 20px;
          height: 2px;

          border-radius: 5px;

          background: white;

          transition: 0.3s;
        }

        .mobileMenuButton span:nth-child(1) {
          top: 14px;
        }

        .mobileMenuButton span:nth-child(2) {
          top: 21px;
        }

        .mobileMenuButton span:nth-child(3) {
          top: 28px;
        }

        .mobileMenuButton.active {
          background:
            rgba(124, 58, 237, 0.1);

          border-color:
            rgba(124, 58, 237, 0.35);
        }

        .mobileMenuButton.active span:nth-child(1) {
          top: 21px;

          transform:
            rotate(45deg);
        }

        .mobileMenuButton.active span:nth-child(2) {
          opacity: 0;
        }

        .mobileMenuButton.active span:nth-child(3) {
          top: 21px;

          transform:
            rotate(-45deg);
        }

        /* =========================
           MOBILE MENU
        ========================= */

        .mobileMenu {
          position: absolute;

          top: 75px;

          left: 0;
          right: 0;

          display: flex;

          flex-direction: column;

          padding: 15px;

          gap: 8px;

          background:
            rgba(5, 6, 15, 0.985);

          border-bottom:
            1px solid
            rgba(124, 58, 237, 0.2);

          box-shadow:
            0 30px 70px
              rgba(0, 0, 0, 0.6);

          transform:
            translateY(-15px);

          opacity: 0;

          visibility: hidden;

          transition:
            transform 0.3s,
            opacity 0.3s,
            visibility 0.3s;

          overflow: hidden;
        }

        .mobileMenuOpen {
          transform:
            translateY(0);

          opacity: 1;

          visibility: visible;
        }

        .mobileMenuGlow {
          position: absolute;

          width: 350px;
          height: 180px;

          top: -90px;
          left: 50%;

          transform:
            translateX(-50%);

          background:
            radial-gradient(
              circle,
              rgba(124, 58, 237, 0.18),
              transparent 70%
            );

          filter: blur(25px);

          pointer-events: none;
        }

        .mobileMenuHeader {
          position: relative;

          display: flex;
          justify-content: space-between;
          align-items: center;

          padding: 5px 5px 10px;

          color: #555;

          font-size: 8px;

          letter-spacing: 2px;
        }

        .mobileMenuHeader b {
          color: #8b7cff;

          font-size: 7px;

          letter-spacing: 1px;
        }

        .mobileNavItem {
          position: relative;

          display: flex;
          align-items: center;

          min-height: 58px;

          padding: 8px 13px;

          gap: 12px;

          border-radius: 15px;

          border: 1px solid
            rgba(255, 255, 255, 0.055);

          background:
            rgba(255, 255, 255, 0.025);

          color: #999;

          text-decoration: none;

          transition: 0.25s;

          overflow: hidden;
        }

        .mobileNavItem:hover {
          transform:
            translateX(4px);

          border-color:
            rgba(124, 58, 237, 0.25);

          background:
            rgba(124, 58, 237, 0.08);
        }

        .mobileIcon {
          width: 38px;
          height: 38px;

          display: grid;
          place-items: center;

          flex-shrink: 0;

          border-radius: 11px;

          color: #8b7cff;

          background:
            rgba(124, 58, 237, 0.08);

          border: 1px solid
            rgba(124, 58, 237, 0.12);

          font-size: 16px;

          transition: 0.25s;
        }

        .mobileNavText {
          min-width: 0;
        }

        .mobileNavText strong {
          display: block;

          color: #bbb;

          font-size: 12px;
        }

        .mobileNavText span {
          display: block;

          margin-top: 4px;

          color: #444;

          font-size: 7px;

          letter-spacing: 1.5px;
        }

        .mobileNavItem small {
          margin-left: auto;

          color: #444;

          font-size: 8px;

          letter-spacing: 2px;
        }

        .mobileNavItem > b {
          color: #444;

          font-size: 15px;

          transition: 0.25s;
        }

        /* ACTIVE MOBILE */

        .mobileNavItem.activeMobile {
          border-color:
            rgba(124, 58, 237, 0.32);

          background:
            linear-gradient(
              135deg,
              rgba(124, 58, 237, 0.16),
              rgba(6, 182, 212, 0.06)
            );

          box-shadow:
            0 0 25px
              rgba(124, 58, 237, 0.1),

            inset 0 1px 0
              rgba(255, 255, 255, 0.06);
        }

        .mobileNavItem.activeMobile
          .mobileIcon {
          color: #67e8f9;

          background:
            linear-gradient(
              135deg,
              rgba(124, 58, 237, 0.3),
              rgba(6, 182, 212, 0.16)
            );

          box-shadow:
            0 0 18px
              rgba(124, 58, 237, 0.2);
        }

        .mobileNavItem.activeMobile
          .mobileNavText strong {
          color: white;
        }

        .mobileNavItem.activeMobile
          .mobileNavText span {
          color: #8b7cff;
        }

        .mobileNavItem.activeMobile
          > b {
          color: #67e8f9;

          transform:
            translateX(3px);
        }

        /* =========================
           MOBILE LAUNCH
        ========================= */

        .mobileLaunch {
          position: relative;

          display: flex;
          align-items: center;

          min-height: 62px;

          gap: 12px;

          margin-top: 3px;

          padding: 10px 14px;

          border-radius: 15px;

          color: white;

          text-decoration: none;

          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #2563eb
            );

          box-shadow:
            0 12px 35px
              rgba(124, 58, 237, 0.25);

          overflow: hidden;
        }

        .mobileLaunchIcon {
          width: 40px;
          height: 40px;

          display: grid;
          place-items: center;

          border-radius: 12px;

          background:
            rgba(255, 255, 255, 0.1);

          font-size: 18px;
        }

        .mobileLaunch strong {
          display: block;

          font-size: 12px;
        }

        .mobileLaunch small {
          display: block;

          margin-top: 4px;

          color:
            rgba(255, 255, 255, 0.6);

          font-size: 7px;

          letter-spacing: 1.5px;
        }

        .mobileLaunchArrow {
          margin-left: auto;

          font-size: 18px;
        }

        .activeMobileLaunch {
          box-shadow:
            0 0 30px
              rgba(124, 58, 237, 0.45),

            0 12px 35px
              rgba(37, 99, 235, 0.25);
        }

        /* =========================
           MOBILE ACCOUNT
        ========================= */

        .mobileAccount {
          margin-top: 6px;

          padding-top: 12px;

          border-top:
            1px solid
            rgba(255, 255, 255, 0.06);
        }

        .mobileProfile {
          display: flex;
          align-items: center;

          gap: 11px;

          padding: 12px;

          border-radius: 15px;

          background:
            rgba(124, 58, 237, 0.08);

          border:
            1px solid
            rgba(124, 58, 237, 0.1);
        }

        .mobileProfileInfo {
          min-width: 0;
        }

        .mobileProfileInfo strong {
          display: block;

          max-width: 170px;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

          font-size: 12px;
        }

        .mobileProfileInfo span {
          display: block;

          margin-top: 5px;

          color: #8b7cff;

          font-size: 8px;

          letter-spacing: 1px;
        }

        .mobileProfileArrow {
          margin-left: auto;

          color: #67e8f9;

          text-decoration: none;

          font-size: 16px;
        }

        .mobileLogout {
          width: 100%;

          margin-top: 7px;

          height: 43px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          border:
            1px solid
            rgba(255, 255, 255, 0.07);

          border-radius: 11px;

          background:
            rgba(255, 255, 255, 0.025);

          color: #777;

          cursor: pointer;

          transition: 0.25s;
        }

        .mobileLogout:hover {
          color: white;

          border-color:
            rgba(248, 113, 113, 0.3);

          background:
            rgba(248, 113, 113, 0.08);
        }

        .mobileLogin {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 10px;

          margin-top: 7px;

          padding: 14px;

          border-radius: 12px;

          color: white;

          text-decoration: none;

          font-size: 11px;

          font-weight: bold;

          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #2563eb
            );
        }

        .mobileLogin b {
          font-size: 15px;
        }

        /* =========================
           LOGO ANIMATION
        ========================= */

        @keyframes logoPulse {
          0%,
          100% {
            opacity: 0.4;

            transform:
              scale(0.9);
          }

          50% {
            opacity: 1;

            transform:
              scale(1.1);
          }
        }

        /* =========================
           TABLET
        ========================= */

        @media (max-width: 1150px) {
          .navInner {
            gap: 15px;
          }

          .logo {
            min-width: 160px;
          }

          .desktopLinks {
            gap: 3px;
          }

          .navItem {
            min-width: 65px;

            padding: 0 8px;
          }

          .navItem .navLabel {
            font-size: 9px;
          }

          .desktopAccount {
            min-width: 175px;
          }
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 900px) {
          .navbar {
            height: 75px;
          }

          .navInner {
            height: 75px;

            padding: 0 18px;
          }

          .desktopLinks,
          .desktopAccount {
            display: none;
          }

          .mobileMenuButton {
            display: block;
          }

          .logo {
            min-width: auto;
          }

          .logoOrb {
            width: 42px;
            height: 42px;

            border-radius: 13px;
          }

          .logoText strong {
            font-size: 18px;
          }

          .logoText span {
            font-size: 6px;
          }
        }

        /* =========================
           SMALL MOBILE
        ========================= */

        @media (max-width: 450px) {
          .navInner {
            padding: 0 13px;
          }

          .logoText span {
            display: none;
          }

          .logoText strong {
            font-size: 17px;
          }

          .mobileMenu {
            padding: 12px;
          }
        }

      `}</style>
    </>
  );
}