import React, { useEffect, useMemo } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const members = [
  'AEDEN', 'MISO', 'ZERO', 'HYUK', 'LUNA', 'RIKU', 'NANA', 'JUNO', 'KAEL', 'YURI',
  'SAGE', 'NOVA', 'DUSK', 'ECHO', 'FLUX', 'ONYX', 'PYRE', 'VALE', 'WREN', 'ZION'
];

const games = [
  ['01', 'Valorant', 'Main Battlefield', 'linear-gradient(145deg,#ff4655,#0f1923,#ece8e1)'],
  ['02', 'League of Legends', 'Classic Chaos', 'linear-gradient(145deg,#091428,#0a1428,#0bc4e2)'],
  ['03', 'Minecraft', 'Creative Therapy', 'linear-gradient(145deg,#3e8948,#8b6914,#5b3a29)'],
  ['04', 'Overwatch 2', 'Team Fights', 'linear-gradient(145deg,#fa9c1e,#1a1a2e,#e7e7e7)'],
  ['05', 'Lethal Company', 'Horror Nights', 'linear-gradient(145deg,#0a0a0a,#1a0505,#440000)'],
  ['06', '그 외...', 'Whatever Hits', 'linear-gradient(145deg,#141414,#222,#444)']
];

const rules = [
  ['01', '서로를 존중할 것', '디스코드 너머에도 사람이 있다. 장난은 OK, 선 넘기는 NO.', 'peace'],
  ['02', '초대제로만 운영', '아무나 올 수 없다. 기존 멤버의 추천이 필요하다.', 'lock'],
  ['03', '잠수는 이해하지만, 소통은 해줘', '바쁜 건 안다. 그래도 가끔 한마디는 남겨달라.', 'chat'],
  ['04', '게임은 진지하게, 분위기는 가볍게', '이기고 싶지만, 지더라도 재밌으면 그만이다.', 'game'],
  ['05', 'NOTHING의 정신을 지킬 것', '쓸데없는 규칙은 없다. 자유롭되, 배려하자.', 'nothing']
];

function splitChars(el) {
  if (!el || el.dataset.split === 'true') return;
  const text = el.textContent;
  el.innerHTML = '';
  el.setAttribute('aria-label', text);
  el.dataset.split = 'true';

  [...text].forEach((char) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    el.appendChild(span);
  });
}

function bindHover(el, cursor, trail) {
  if (!el || !cursor || !trail) return () => {};
  const enter = () => {
    cursor.classList.add('hover');
    trail.classList.add('hover');
  };
  const leave = () => {
    cursor.classList.remove('hover');
    trail.classList.remove('hover');
  };
  el.addEventListener('mouseenter', enter);
  el.addEventListener('mouseleave', leave);

  return () => {
    el.removeEventListener('mouseenter', enter);
    el.removeEventListener('mouseleave', leave);
  };
}

function App() {
  const memberCards = useMemo(() => {
    const roles = ['Admin', 'Member', 'Member', 'Member', 'Moderator'];
    const tallIndexes = new Set([0, 4, 9, 14, 19]);

    return members.map((name, index) => {
      const hue = (index * 18 + 130) % 360;
      return {
        name,
        tall: tallIndexes.has(index),
        online: index % 5 !== 2,
        role: index === 0 ? 'Founder' : roles[index % roles.length],
        avatarStyle: {
          background: `linear-gradient(135deg,hsl(${hue},50%,48%),hsl(${(hue + 55) % 360},40%,38%))`
        }
      };
    });
  }, []);

  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const trail = document.getElementById('cursorTrail');
    const loader = document.getElementById('loader');
    const counter = document.getElementById('loaderCounter');
    const bar = document.getElementById('loaderBar');
    const cleanups = [];
    let scrollVelocity = 0;
    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let trailX = -100;
    let trailY = -100;
    let cursorFrame = 0;
    let skewFrame = 0;
    let value = 0;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2
    });

    lenis.on('scroll', (event) => {
      scrollVelocity = event.velocity;
      ScrollTrigger.update();
    });

    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const onMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    document.addEventListener('mousemove', onMouseMove);

    const cursorLoop = () => {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      trailX += (mouseX - trailX) * 0.07;
      trailY += (mouseY - trailY) * 0.07;

      if (cursor && trail) {
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        trail.style.left = `${trailX}px`;
        trail.style.top = `${trailY}px`;
      }

      cursorFrame = requestAnimationFrame(cursorLoop);
    };

    const skewLoop = () => {
      const skew = Math.max(-3, Math.min(3, scrollVelocity * 0.015));
      document.querySelectorAll('.velocity-skew').forEach((el) => {
        el.style.transform = `skewY(${skew}deg)`;
      });
      skewFrame = requestAnimationFrame(skewLoop);
    };

    cursorFrame = requestAnimationFrame(cursorLoop);
    skewFrame = requestAnimationFrame(skewLoop);

    const initAll = () => {
      const heroTitle = document.getElementById('heroTitle');
      const manifestoTitle = document.getElementById('manifestoTitle');

      splitChars(heroTitle);
      gsap.to('#heroTitle .char', {
        opacity: 1,
        y: '0%',
        rotateX: 0,
        duration: 1.4,
        stagger: 0.045,
        ease: 'power4.out',
        delay: 0.15
      });
      gsap.to('.hero-meta-item span', {
        y: '0%',
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 1.3
      });

      const hero = document.getElementById('hero');
      const heroMove = (event) => {
        const rx = (event.clientX / window.innerWidth - 0.5) * 2;
        const ry = (event.clientY / window.innerHeight - 0.5) * 2;
        gsap.to('#hShape1', { x: rx * 30, y: ry * 20, duration: 1.5, ease: 'power2.out' });
        gsap.to('#hShape2', { x: rx * -20, y: ry * -15, duration: 1.8, ease: 'power2.out' });
        gsap.to('#hShape3', { x: rx * 25, y: ry * -25, duration: 2, ease: 'power2.out' });
      };
      hero?.addEventListener('mousemove', heroMove);
      cleanups.push(() => hero?.removeEventListener('mousemove', heroMove));

      gsap.to('.hero-content', {
        yPercent: -30,
        scale: 1.05,
        opacity: 0,
        scrollTrigger: { trigger: '#hero', start: '60% top', end: 'bottom top', scrub: 1.5 }
      });

      const initMarquee = (selector, speed, direction) => {
        const inner = document.querySelector(`${selector} .marquee-inner`);
        if (!inner) return;
        const width = inner.scrollWidth / 2;
        gsap.set(inner, { x: direction > 0 ? 0 : -width });
        gsap.to(inner, { x: direction > 0 ? -width : 0, duration: speed, ease: 'none', repeat: -1 });
      };
      initMarquee('#marquee1', 28, 1);
      initMarquee('#marquee2', 32, -1);

      document.querySelectorAll('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 50,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' }
        });
      });

      gsap.from('.about-title .t-accent', {
        opacity: 0,
        x: -30,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about-title', start: 'top 80%' }
      });
      gsap.from('.about-title .t-outline', {
        opacity: 0,
        x: 30,
        duration: 1,
        delay: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about-title', start: 'top 80%' }
      });
      gsap.to('.about-deco', {
        yPercent: -20,
        scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: 2 }
      });

      ScrollTrigger.create({ trigger: '#vibe-wrap', start: 'top top', end: '+=160%', pin: '#vibe', scrub: true });
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: '#vibe-wrap', start: 'top top', end: '+=130%', scrub: 1 }
      });
      document.querySelectorAll('#vibeText .word').forEach((word, index) => {
        timeline.to(word, {
          filter: 'blur(0px)',
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: 'power2.out'
        }, index * 0.12);
      });
      timeline.to('#vibeSub', { opacity: 1, duration: 0.3 }, '>.1');

      gsap.from('.m-card', {
        opacity: 0,
        y: 40,
        scale: 0.92,
        duration: 0.7,
        stagger: { each: 0.035, from: 'random' },
        ease: 'power3.out',
        scrollTrigger: { trigger: '#members', start: 'top 65%' }
      });

      const track = document.getElementById('gamesTrack');
      const cards = track ? Array.from(track.querySelectorAll('.g-card')) : [];
      const totalWidth = cards.reduce((sum, card) => sum + card.offsetWidth + 24, 0) - 24;
      const scrollDistance = Math.max(0, totalWidth - window.innerWidth + 120);
      gsap.to(track, {
        x: -scrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: '#games-wrap',
          start: 'top top',
          end: () => `+=${scrollDistance}`,
          pin: '#games',
          scrub: 1.2,
          invalidateOnRefresh: true
        }
      });

      document.querySelectorAll('[data-rule]').forEach((el, index) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          onEnter() {
            el.classList.add('visible');
            el.style.transitionDelay = `${index * 0.08}s`;
          }
        });
      });

      splitChars(manifestoTitle);
      gsap.from('#manifestoTitle .char', {
        opacity: 0,
        y: 60,
        rotateZ: () => gsap.utils.random(-12, 12),
        scale: () => gsap.utils.random(0.8, 1.2),
        duration: 0.9,
        stagger: 0.025,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#manifestoTitle', start: 'top 80%' }
      });

      gsap.from('.join-title', {
        scale: 0.8,
        opacity: 0,
        filter: 'blur(10px)',
        scrollTrigger: { trigger: '#join', start: 'top 65%', end: 'center center', scrub: 1 }
      });
      gsap.from('.footer-big', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: 'footer', start: 'top 85%' }
      });

      document.querySelectorAll('.nav-link').forEach((anchor) => {
        cleanups.push(bindHover(anchor, cursor, trail));
        const click = (event) => {
          event.preventDefault();
          const target = document.querySelector(anchor.getAttribute('href'));
          if (target) lenis.scrollTo(target);
        };
        anchor.addEventListener('click', click);
        cleanups.push(() => anchor.removeEventListener('click', click));
      });

      document.querySelectorAll('.stat-card,.m-card,.g-card,.vibe-tag,.join-btn').forEach((el) => {
        cleanups.push(bindHover(el, cursor, trail));
      });
      document.querySelectorAll('.marquee-inner').forEach((el) => el.classList.add('velocity-skew'));

      ScrollTrigger.refresh();
    };

    const loaderInterval = setInterval(() => {
      value += Math.floor(Math.random() * 6) + 2;
      if (value > 100) value = 100;
      if (counter) counter.textContent = String(value).padStart(3, '0');
      if (bar) bar.style.width = `${value}%`;

      if (value >= 100) {
        clearInterval(loaderInterval);
        setTimeout(() => {
          gsap.to(loader, {
            yPercent: -100,
            duration: 1,
            ease: 'power4.inOut',
            onComplete() {
              if (loader) loader.style.display = 'none';
              initAll();
            }
          });
        }, 500);
      }
    }, 35);

    return () => {
      clearInterval(loaderInterval);
      cleanups.forEach((cleanup) => cleanup());
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(cursorFrame);
      cancelAnimationFrame(skewFrame);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.globalTimeline.clear();
      lenis.destroy();
    };
  }, []);

  const handleMemberMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <>
      <div className="grain" />
      <div className="cursor" id="cursor" />
      <div className="cursor-trail" id="cursorTrail" />

      <div id="loader">
        <div className="loader-counter" id="loaderCounter">000</div>
        <div className="loader-bar-wrap"><div className="loader-bar" id="loaderBar" /></div>
        <div className="loader-label">loading experience</div>
      </div>

      <nav>
        <div className="logo">NOTHING ⊘</div>
        <ul className="nav-links">
          {['About', 'Crew', 'Games', 'Join'].map((item) => (
            <li key={item}>
              <a className="nav-link" href={item === 'Crew' ? '#members' : item === 'Games' ? '#games-wrap' : `#${item.toLowerCase()}`}>
                <span className="nav-link-text">{item}</span>
                <span className="nav-link-clone">{item}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="hero">
        <div className="hero-bg-shapes">
          <div className="hero-shape hero-shape-1" id="hShape1" />
          <div className="hero-shape hero-shape-2" id="hShape2" />
          <div className="hero-shape hero-shape-3" id="hShape3" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title" id="heroTitle" aria-label="NOTHING">NOTHING</h1>
          <div className="hero-sub-row">
            <span className="hero-outline" data-reveal>DISCORD</span>
            <span className="hero-thin" data-reveal>crew, est. 2026</span>
          </div>
          <div className="hero-meta">
            <div className="hero-meta-item"><span><strong>Dirc.</strong> Aeden</span></div>
            <div className="hero-meta-item"><span><strong>Status</strong> Invite Only</span></div>
            <div className="hero-meta-item"><span><strong>Since</strong> 2026.02.20</span></div>
          </div>
        </div>
        <div className="scroll-hint"><div className="scroll-line" /><span>Scroll</span></div>
      </section>

      <Marquee id="marquee1" mark="⊘" items={['NOTHING IS EVERYTHING', '20 ELITE MEMBERS', 'GAMING & VIBES', 'INVITE ONLY']} />

      <section id="about">
        <div className="about-deco" data-parallax="0.03">N⊘</div>
        <div className="about-grid">
          <div className="about-left">
            <div className="label" data-reveal>(001) About Us</div>
            <h2 className="about-title" data-reveal>
              We are<br />
              <span className="t-accent">NOTHING</span><br />
              <span className="t-outline">...what</span> <span className="t-light">else?</span>
            </h2>
            <p className="about-text" data-reveal>2026년 2월, 아무것도 아닌 곳에서 시작된 우리. 20명의 소수 정예 크루가 모여 게임하고, 웃고, 가끔은 진지한 이야기도 나누는 공간. 거창한 목적 따위 없다. 그냥 함께하는 것 자체가 전부.</p>
          </div>
          <div className="about-right">
            <Stat number="20" label="Elite Members" desc="소수 정예. 양보다 질을 택했다." />
            <Stat number="∞" label="Hours Wasted" desc="새벽 4시의 게임 세션은 기본." />
            <Stat number="⊘" label="Ego Allowed" desc="에고 금지. 모두가 평등한 공간." />
          </div>
        </div>
      </section>

      <div id="vibe-wrap">
        <section id="vibe">
          <div className="vibe-text" id="vibeText">
            <span className="word">NOTHING</span><br />
            <span className="word word-outline">IS</span>
            <span className="word">EVERY</span><br />
            <span className="word word-outline">THING.</span>
          </div>
          <p className="vibe-sub" id="vibeSub">우리에게 "아무것도 아닌 것"은 곧 "전부"를 의미한다.<br />목적 없이 모이지만, 그 속에서 진짜 유대가 생긴다.</p>
          <div className="vibe-tags">
            {['Gaming', 'Late Night Talks', 'Memes', 'No Rules', 'Vibes Only'].map((tag) => (
              <span className="vibe-tag" key={tag}><span>{tag}</span></span>
            ))}
          </div>
        </section>
      </div>

      <Marquee id="marquee2" mark="★" items={['EST. 2026', 'DISCORD CREW', 'INVITE ONLY', '20대 크루']} />

      <section id="members">
        <div className="members-header">
          <div className="members-left">
            <div className="label" data-reveal>(002) The Crew</div>
            <div className="members-count" data-reveal>20</div>
            <div className="members-subtitle" data-reveal>Souls connected.</div>
          </div>
          <div className="members-right">
            <h2 className="members-title" data-reveal>One Server,<br /><span className="t-outline">Zero</span> Strangers.</h2>
          </div>
        </div>
        <div className="m-grid" id="membersGrid">
          {memberCards.map((member) => (
            <div className={`m-card${member.tall ? ' tall' : ''}`} key={member.name} onMouseMove={handleMemberMove}>
              <div className={`m-dot ${member.online ? 'on' : 'off'}`} />
              <div className="m-ava" style={member.avatarStyle}>{member.name[0]}</div>
              <div className="m-name">{member.name}</div>
              <div className="m-role">{member.role}</div>
            </div>
          ))}
        </div>
      </section>

      <div id="games-wrap">
        <section id="games">
          <div className="games-header">
            <div className="label" data-reveal>(003) What We Play</div>
            <h2 className="games-title" data-reveal>우리의 전장.</h2>
            <p className="games-counter" data-reveal>06 Titles & Counting</p>
          </div>
          <div className="games-track" id="gamesTrack">
            {games.map(([number, title, subtitle, background]) => (
              <div className="g-card" key={number}>
                <div className="g-card-num">{number}</div>
                <div className="g-card-bg" style={{ background }} />
                <div className="g-card-overlay" />
                <div className="g-card-content"><h3>{title}</h3><p>{subtitle}</p></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section id="manifesto">
        <div className="manifesto-bg-text">RULES</div>
        <div className="manifesto-inner">
          <div className="manifesto-eyebrow" data-reveal>(004) Manifesto</div>
          <h2 className="manifesto-title" id="manifestoTitle" data-reveal>Our Code.</h2>
          {rules.map(([number, title, desc, icon]) => (
            <div className="rule" data-rule key={number}>
              <div className="rule-n">{number}</div>
              <div><h3>{title}</h3><p>{desc}</p></div>
              <div className="rule-icon">{icon}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="join">
        <div className="join-bg" />
        <div className="join-grid" />
        <h2 className="join-title" data-reveal>
          <span className="strike">EVERY</span><br />NOTHING<br /><span className="strike">MATTERS</span>
        </h2>
        <a href="#" className="join-btn">
          <span className="join-btn-text">Join the Crew</span>
          <span className="arr">-&gt;</span>
        </a>
        <p className="join-note" data-reveal>Invite Only - Ask a Member</p>
      </section>

      <footer>
        <div className="footer-big" data-reveal>
          Let's play<br />
          <span className="t-outline">together</span><br />
          <span className="t-accent">tonight.</span>
        </div>
        <div className="footer-bottom">
          <FooterCol title="Server" items={['NOTHING ⊘', 'Dirc. Aeden']} />
          <FooterCol title="Since" items={['2026.02.20', 'Seoul, Korea']} />
          <div className="footer-col">
            <div className="footer-col-title">Contact</div>
            <a href="#">Discord</a>
            <a href="#">Instagram</a>
          </div>
          <FooterCol title="Status" items={['20 / 20 Members', 'Invite Only']} />
        </div>
        <div className="footer-copy">© 2026 NOTHING - All rights reserved. Nothing is everything.</div>
      </footer>
    </>
  );
}

function Marquee({ id, items, mark }) {
  const repeated = [...items, ...items];
  return (
    <div className="marquee" id={id}>
      <div className="marquee-inner">
        {repeated.map((item, index) => (
          <span key={`${item}-${index}`}>{item}<span className="hi"> {mark}</span></span>
        ))}
      </div>
    </div>
  );
}

function Stat({ number, label, desc }) {
  return (
    <div className="stat-card" data-reveal>
      <div className="stat-num">{number}</div>
      <div className="stat-lbl">{label}</div>
      <div className="stat-desc">{desc}</div>
    </div>
  );
}

function FooterCol({ title, items }) {
  return (
    <div className="footer-col">
      <div className="footer-col-title">{title}</div>
      {items.map((item) => <span key={item}>{item}</span>)}
    </div>
  );
}

export default App;
