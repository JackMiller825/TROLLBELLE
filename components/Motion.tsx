'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { onToast } from '@/lib/toast';

const WORDS = ['troll!', 'problem?', 'grin!', 'boop', '♪', 'chaos!', 'hey!'];

function pick<T>(arr: T[]) {
  return arr[(Math.random() * arr.length) | 0];
}
function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export default function Motion() {
  useEffect(() => {
    let destroy = () => {};
    const params = new URLSearchParams(window.location.search);
    const compare = params.get('compare') === '1';
    const reduce = params.get('reduce') === '1' || compare
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) document.documentElement.classList.add('reduce');

    if (reduce) {
      document.body.classList.remove('is-loading');
      const loader = document.getElementById('loader');
      if (loader) loader.style.display = 'none';
      const off = onToast((message) => flashToast(message));
      return () => off();
    }

    const skipIntro = sessionStorage.getItem('tb_ready') === '1';
    if (skipIntro) {
      document.body.classList.remove('is-loading');
      const loader = document.getElementById('loader');
      if (loader) loader.style.display = 'none';
    }

    destroy = mountMotion(gsap, ScrollTrigger, Lenis, skipIntro);

    return () => {
      destroy();
    };
  }, []);

  return (
    <>
      <svg className="motion-defs" aria-hidden="true">
        <filter id="boil">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="1" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" />
        </filter>
        <filter id="boil-strong">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" />
        </filter>
      </svg>
      <div className="loader" id="loader" role="status" aria-live="polite">
        <div className="loader__inner">
          <div className="loader__mouth-wrap" aria-hidden="true">
            <div className="loader__mouth-pivot">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="loader__mouth-img"
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/trollbelle-mouth.png?v=4`}
                alt=""
                width={1774}
                height={887}
                decoding="async"
              />
            </div>
          </div>
          <div className="loader__word" aria-hidden="true">
            {'trollbelle'.split('').map((letter, index) => <span key={`l-${index}`}>{letter}</span>)}
          </div>
          <p className="sr-only">Loading Trollbelle</p>
          <svg className="loader__bar" viewBox="0 0 320 28" aria-hidden="true">
            <path className="lb-outline" d="M6 14h308" />
            <path className="lb-fill" d="M10 14h300" />
          </svg>
          <div className="loader__pct"><span id="loader-pct">0</span>%</div>
          <p className="loader__hint">warming up the grin…</p>
        </div>
      </div>
      <canvas className="ink" id="ink" aria-hidden="true" />
      <div className="cursor" id="cursor" aria-hidden="true">
        <div className="cursor__dot" />
        <div className="cursor__ring"><span className="cursor__label">troll!</span></div>
      </div>
      <div className="fx" id="fx" aria-hidden="true" />
      <div className="toast" id="toast" role="status" />
    </>
  );
}

function flashToast(message: string) {
  const toastEl = document.getElementById('toast');
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('is-show');
  window.setTimeout(() => toastEl.classList.remove('is-show'), 2200);
}

function mountMotion(
  gsap: typeof import('gsap').default,
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger,
  Lenis: typeof import('lenis').default,
  skipIntro = false,
) {
  gsap.registerPlugin(ScrollTrigger);
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);

  const cleanups: Array<() => void> = [];
  const ctx = gsap.context(() => {
    const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector(sel) as T | null;
    const $$ = (sel: string) => Array.from(document.querySelectorAll(sel));

    const noise = [
      document.querySelector('#boil feTurbulence'),
      document.querySelector('#boil-strong feTurbulence'),
    ];
    let boilSeed = 1;
    const boilTimer = window.setInterval(() => {
      boilSeed = (boilSeed % 3) + 1;
      noise.forEach((node, index) => node?.setAttribute('seed', String(boilSeed + index * 3)));
    }, 220);
    cleanups.push(() => window.clearInterval(boilTimer));
    const onHide = () => {
      if (document.hidden) window.clearInterval(boilTimer);
    };
    document.addEventListener('visibilitychange', onHide);
    cleanups.push(() => document.removeEventListener('visibilitychange', onHide));

    let lenis: InstanceType<typeof Lenis> | null = null;
    lenis = new Lenis({
      autoRaf: false,
      duration: 1.15,
      smoothWheel: true,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      prevent: (node: HTMLElement) => {
        if (node.closest('.story.is-static')) return true;
        const steps = node.closest('.steps') as HTMLElement | null;
        return Boolean(steps && steps.scrollWidth > steps.clientWidth + 8);
      },
    });
    lenis.on('scroll', ScrollTrigger.update);
    const ticker = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    cleanups.push(() => {
      gsap.ticker.remove(ticker);
      lenis?.destroy();
    });

    const header = document.querySelector('.header');
    let lastY = 0;
    const onScrollNav = (y: number) => {
      if (!header) return;
      const menuOpen = document.querySelector('.nav-center')?.classList.contains('shown');
      if (menuOpen || y < 80 || y < lastY - 4) header.classList.remove('is-hidden');
      else if (y > 160 && y > lastY + 4) header.classList.add('is-hidden');
      lastY = y;
    };
    const offScroll = lenis.on('scroll', (instance) => onScrollNav(instance.scroll));
    cleanups.push(offScroll);

    $$('a[href^="#"]').forEach((anchor) => {
      const onClick = (event: Event) => {
        const id = anchor.getAttribute('href') || '';
        const target = id.length > 1 ? document.querySelector(id) : document.getElementById('top');
        if (!target) return;
        event.preventDefault();
        if (lenis) lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.2 });
        else target.scrollIntoView({ behavior: 'smooth' });
      };
      anchor.addEventListener('click', onClick);
      cleanups.push(() => anchor.removeEventListener('click', onClick));
    });

    const soonClick = (event: Event) => {
      const button = (event.target as HTMLElement | null)?.closest('[data-soon]');
      if (!button) return;
      flashToast(button.getAttribute('data-soon') || 'drops at launch');
    };
    document.addEventListener('click', soonClick);
    cleanups.push(() => document.removeEventListener('click', soonClick));
    const offToast = onToast(flashToast);
    cleanups.push(offToast);

    const liveWiggle = () => {
      gsap.fromTo('.stats-panel', { rotation: 0 }, { rotation: 1.4, duration: 0.12, yoyo: true, repeat: 5, ease: 'power1.inOut' });
    };
    window.addEventListener('troll-live', liveWiggle);
    cleanups.push(() => window.removeEventListener('troll-live', liveWiggle));

    const barFill = $('.lb-fill') as SVGPathElement | null;
    if (barFill) {
      barFill.setAttribute('pathLength', '1');
      barFill.style.strokeDasharray = '1 1';
      barFill.style.strokeDashoffset = '1';
    }
    gsap.set('.loader__word span', { opacity: 0, y: 36, rotate: -8 });
    gsap.set('.loader__mouth-pivot', { scale: 0.55, opacity: 0, transformOrigin: '50% 55%' });
    gsap.set('.loader__mouth-img', { scale: 1, rotation: 0 });

    const loader = $('#loader');
    const pctEl = $('#loader-pct');
    const progress = { target: 0, shown: 0 };
    const bump = () => { progress.target = Math.min(1, progress.target + 0.25); };
    if (document.fonts) document.fonts.ready.then(bump).catch(bump);
    const mouthSrc = document.querySelector<HTMLImageElement>('.loader__mouth-img')?.src;
    const heroSrc = document.querySelector<HTMLImageElement>('.mascot-img')?.currentSrc
      || document.querySelector<HTMLImageElement>('.mascot-img')?.src;
    [mouthSrc, heroSrc].filter(Boolean).forEach((src) => {
      const preload = new Image();
      preload.onload = preload.onerror = bump;
      preload.src = src as string;
    });
    if (!mouthSrc && !heroSrc) bump();
    if (document.readyState === 'complete') bump();
    else window.addEventListener('load', bump, { once: true });
    const dwell = window.setTimeout(bump, 180);
    const safety = window.setTimeout(() => { progress.target = 1; }, 2800);
    cleanups.push(() => { window.clearTimeout(dwell); window.clearTimeout(safety); });

    let loaderFinished = false;

    const intro = gsap.timeline();
    intro
      .to('.loader__mouth-pivot', { scale: 1, opacity: 1, duration: 0.62, ease: 'back.out(2.6)' })
      .to('.loader__word span', { opacity: 1, y: 0, rotate: 0, duration: 0.55, ease: 'back.out(2.4)', stagger: 0.032 }, 0.12);

    const pulseMouthLaugh = (target: string) => {
      gsap.timeline()
        .to(target, { scale: 1.06, duration: 0.14, ease: 'sine.in', transformOrigin: '50% 55%', overwrite: 'auto' })
        .to(target, { scale: 1, duration: 0.16, ease: 'sine.out' });
    };
    const beatLoaderLaugh = () => { pulseMouthLaugh('.loader__mouth-pivot'); };
    const loaderLaughTimer = window.setInterval(beatLoaderLaugh, 1000);
    window.setTimeout(beatLoaderLaugh, 550);
    cleanups.push(() => window.clearInterval(loaderLaughTimer));
    const wordBounce = gsap.to('.loader__word span', {
      y: -8, duration: 0.38, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: 0.06, from: 'start' }, delay: 0.75,
    });

    const finishLoader = () => {
      if (loaderFinished) return;
      loaderFinished = true;
      const hide = () => {
        if (loader) loader.style.display = 'none';
        document.body.classList.remove('is-loading');
        try { sessionStorage.setItem('tb_ready', '1'); } catch { /* private mode */ }
        try { lenis?.start(); } catch { /* already started */ }
        window.requestAnimationFrame(() => ScrollTrigger.refresh());
      };
      const hideTimer = window.setTimeout(hide, 480);
      cleanups.push(() => window.clearTimeout(hideTimer));
      try {
        if (!location.hash) {
          window.scrollTo(0, 0);
          lenis?.scrollTo(0, { immediate: true, force: true });
        }
      } catch { /* keep the reveal moving */ }
      window.clearInterval(loaderLaughTimer);
      wordBounce.kill();
      const tl = gsap.timeline({ onComplete: hide });
      tl.to('.loader__word span', { y: -18, opacity: 0, duration: 0.2, stagger: 0.012, ease: 'power2.in' }, 0)
        .to('.loader__bar, .loader__pct, .loader__hint', { opacity: 0, y: 12, duration: 0.2 }, '<')
        .to('.loader__mouth-wrap', { scale: 1.14, duration: 0.22, ease: 'back.in(2)' }, '<0.04')
        .to(loader, { clipPath: 'circle(0% at 50% 42%)', duration: 0.45, ease: 'power2.inOut' }, '-=0.04')
        .call(heroIntro, undefined, '-=0.28');
    };

    const skipLoader = () => {
      progress.target = 1;
      progress.shown = 1;
      if (pctEl) pctEl.textContent = '100';
      if (barFill) barFill.style.strokeDashoffset = '0';
      finishLoader();
    };
    if (loader) {
      loader.addEventListener('click', skipLoader, { once: true });
      cleanups.push(() => loader.removeEventListener('click', skipLoader));
    }

    const started = performance.now();
    const tick = () => {
      const timed = Math.min(1, (performance.now() - started) / 480);
      progress.target = Math.max(progress.target, timed);
      const catchUp = progress.target >= 1 ? 0.42 : 0.2;
      progress.shown += (Math.min(1, progress.target) - progress.shown) * catchUp;
      if (progress.target >= 0.999 && progress.shown > 0.97) progress.shown = 1;
      if (pctEl) pctEl.textContent = String(Math.round(progress.shown * 100));
      if (barFill) barFill.style.strokeDashoffset = String(1 - progress.shown);
      if (progress.shown >= 1) {
        gsap.ticker.remove(tick);
        finishLoader();
      }
    };
    if (!skipIntro) {
      gsap.ticker.add(tick);
      cleanups.push(() => gsap.ticker.remove(tick));
    }

    const heroLetters = '.hero-title-letter';
    gsap.set(heroLetters, { y: 50, scale: 0.86, opacity: 0, transformOrigin: '50% 100%' });
    gsap.set('#mascot', { scale: 0.55, rotation: -16, opacity: 0, transformOrigin: '50% 90%' });
    gsap.set('.troll-mouth', { scale: 0.4, opacity: 0, transformOrigin: '50% 65%' });
    gsap.set('.hero-subtitle, .contract-box, .hero__cta, .bubble', { y: 28, opacity: 0 });
    gsap.set('.left-doodle', { rotation: -12, scale: 0, opacity: 0 });
    gsap.set('.right-doodle', { rotation: -11, scale: 0, opacity: 0 });
    gsap.set('.scroll-hint', { opacity: 0, y: 12 });

    function heroIntro() {
      const tl = gsap.timeline();
      tl.to(heroLetters, {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.05,
        ease: 'elastic.out(1, 0.55)',
        stagger: 0.06,
      })
        .to('#mascot', { scale: 1, rotation: 0, opacity: 1, duration: 1.15, ease: 'elastic.out(1, 0.5)' }, 0.08)
        .to('.troll-mouth', { scale: 1, opacity: 1, duration: 0.75, ease: 'back.out(2.8)' }, 0.2)
        .to('.hero-subtitle, .contract-box, .hero__cta, .bubble', { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08 }, 0.35)
        .to('.left-doodle, .right-doodle', { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2.6)', stagger: 0.08 }, 0.45)
        .to('.scroll-hint', { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.7)
        .add(heroIdle, 0.9);
    }

    function heroIdle() {
      const beatHeroLaugh = () => { pulseMouthLaugh('.troll-mouth__pivot'); };
      beatHeroLaugh();
      const heroLaughTimer = window.setInterval(beatHeroLaugh, 1000);
      cleanups.push(() => window.clearInterval(heroLaughTimer));
      gsap.to('.mascot-img', { y: -12, rotation: 1.4, duration: 2.1, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to('.left-doodle', { y: -8, rotation: -16, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to('.right-doodle', { y: -10, rotation: -6, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to('.sticker--dark', { y: -8, rotation: 8, duration: 1.9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to('.note', { y: -8, rotation: 10, duration: 1.5, stagger: 0.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to('.scroll-hint', { y: 8, duration: 0.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.utils.toArray<HTMLElement>('.hero-title-letter').forEach((el, i) => {
        gsap.to(el, {
          y: -8,
          duration: 0.55,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.09,
        });
      });
      const bubble = document.querySelector('.bubble');
      const lines = ['psst… hey', 'problem, darling?', 'troll!', 'good trolls only', 'wanna scroll?'];
      let line = 0;
      if (bubble) {
        const cycle = window.setInterval(() => {
          line = (line + 1) % lines.length;
          gsap.to(bubble, {
            y: -8,
            opacity: 0,
            duration: 0.22,
            onComplete: () => {
              bubble.textContent = lines[line];
              gsap.fromTo(bubble, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'back.out(2)' });
            },
          });
        }, 2800);
        cleanups.push(() => window.clearInterval(cycle));
      }
    }

    if (skipIntro) {
      window.clearInterval(loaderLaughTimer);
      wordBounce.kill();
      intro.kill();
      loaderFinished = true;
      try { lenis?.start(); } catch { /* already started */ }
      gsap.set(heroLetters, { y: 0, scale: 1, opacity: 1 });
      gsap.set('#mascot', { scale: 1, rotation: 0, opacity: 1 });
      gsap.set('.troll-mouth', { scale: 1, opacity: 1 });
      gsap.set('.hero-subtitle, .contract-box, .hero__cta, .bubble', { y: 0, opacity: 1 });
      gsap.set('.left-doodle', { rotation: -12, scale: 1, opacity: 1 });
      gsap.set('.right-doodle', { rotation: -11, scale: 1, opacity: 1 });
      gsap.set('.scroll-hint', { y: 0, opacity: 1 });
      window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        heroIdle();
      });
    }

    gsap.to('.exact-hero-title, .alternate-hero-title', {
      yPercent: -16, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('#mascot-parallax', {
      yPercent: 10, rotation: 3, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    const mascot = $('#mascot');
    if (mascot) {
      gsap.set(mascot, { transformPerspective: 900 });
      const mx = gsap.quickTo(mascot, 'x', { duration: 0.7, ease: 'power3' });
      const my = gsap.quickTo(mascot, 'y', { duration: 0.7, ease: 'power3' });
      const mr = gsap.quickTo(mascot, 'rotationY', { duration: 0.7, ease: 'power3' });
      const onPointer = (event: PointerEvent) => {
        const nx = event.clientX / window.innerWidth - 0.5;
        const ny = event.clientY / window.innerHeight - 0.5;
        mx(nx * 26);
        my(ny * 18);
        mr(nx * 10);
      };
      window.addEventListener('pointermove', onPointer, { passive: true });
      cleanups.push(() => window.removeEventListener('pointermove', onPointer));
    }

    const marquee = $('#marquee');
    if (marquee) {
      const loop = gsap.to(marquee, { xPercent: -50, duration: 22, ease: 'none', repeat: -1 });
      let direction = 1;
      ScrollTrigger.create({
        onUpdate(self) {
          const velocity = self.getVelocity();
          if (Math.abs(velocity) > 5) direction = velocity > 0 ? 1 : -1;
          gsap.to(loop, { timeScale: direction * (1 + Math.min(Math.abs(velocity) / 250, 6)), duration: 0.2, overwrite: true });
          gsap.to(loop, { timeScale: direction, duration: 1.1, delay: 0.22, overwrite: false });
        },
      });
      gsap.fromTo('.marquee', { rotate: -2.4 }, {
        rotate: 0, ease: 'none',
        scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }

    gsap.utils.toArray<HTMLElement>('.section__title, .story-title').forEach((el) => {
      const chars = el.querySelectorAll('.ch');
      if (!chars.length) return;
      gsap.from(chars, {
        yPercent: 120,
        rotate: () => rand(-16, 16),
        stagger: 0.03,
        duration: 0.7,
        ease: 'back.out(2)',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });

    const mm = gsap.matchMedia();
    mm.add('(min-width: 861px)', () => {
      const story = document.querySelector('.story');
      const track = document.querySelector('#story-track') as HTMLElement | null;
      if (!story || !track) return;
      story.classList.remove('is-static');
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 48);
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: story,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    });
    mm.add('(max-width: 860px)', () => {
      document.querySelector('.story')?.classList.add('is-static');
      return () => document.querySelector('.story')?.classList.remove('is-static');
    });
    cleanups.push(() => mm.revert());

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const refreshTimer = window.setTimeout(refresh, 500);
    cleanups.push(() => {
      window.removeEventListener('load', refresh);
      window.clearTimeout(refreshTimer);
    });

    const arrowParts = gsap.utils.toArray<SVGPathElement>('.buy-arrow path');
    if (arrowParts.length) {
      arrowParts.forEach((part) => {
        part.setAttribute('pathLength', '1');
        part.style.strokeDasharray = '1 1';
        part.style.strokeDashoffset = '1';
      });
      const arrowDraw = gsap.timeline({
        scrollTrigger: { trigger: '.buy', start: 'top 62%', toggleActions: 'play none none reverse' },
      });
      arrowDraw
        .to('.buy-arrow__path', { strokeDashoffset: 0, duration: 1.15, ease: 'power2.out' })
        .to('.buy-arrow__head', { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, '-=0.12');
      cleanups.push(() => arrowDraw.kill());
    }
    const pieFill = document.querySelector('.pie__fill') as SVGPathElement | null;
    const piePct = document.querySelector('.pie__pct');
    if (pieFill) {
      pieFill.setAttribute('pathLength', '1');
      pieFill.style.strokeDasharray = '1 1';
      pieFill.style.strokeDashoffset = '1';
      const pieRing = gsap.timeline({
        scrollTrigger: {
          trigger: '.pie',
          start: 'top 80%',
          end: 'center 50%',
          scrub: 1,
        },
      });
      pieRing.to(pieFill, { strokeDashoffset: 0, ease: 'none' }, 0);
      if (piePct) {
        const counter = { value: 0 };
        pieRing.to(
          counter,
          {
            value: 100,
            ease: 'none',
            onUpdate: () => {
              piePct.textContent = String(Math.round(counter.value));
            },
          },
          0,
        );
      }
      cleanups.push(() => pieRing.kill());
      const pieLabelPop = gsap.from('.pie__pct-ticket', {
        scale: 0,
        rotate: -40,
        duration: 1,
        ease: 'elastic.out(1, 0.4)',
        scrollTrigger: { trigger: '.pie', start: 'top 65%', toggleActions: 'play none none reverse' },
      });
      cleanups.push(() => pieLabelPop.kill());
    }
    gsap.from('.outro__big span', {
      yPercent: 120,
      rotate: (i) => (i - 0.5) * 20,
      stagger: 0.12,
      duration: 1.1,
      ease: 'back.out(1.4)',
      scrollTrigger: { trigger: '.outro', start: 'top 75%', toggleActions: 'play none none reverse' },
    });
    gsap.from('.outro__peek', {
      yPercent: 70,
      rotate: -15,
      ease: 'none',
      scrollTrigger: { trigger: '.outro__peek', start: 'top bottom', end: 'top 55%', scrub: 1 },
    });

    const reveal = '.stat.tilt, .step.tilt, .facts .tilt, .phase.tilt, .outro .tilt';
    gsap.set(reveal, { opacity: 0 });
    ScrollTrigger.batch(reveal, {
      start: 'top 92%',
      onEnter: (batch) => gsap.fromTo(batch,
        { y: 64, opacity: 0, rotation: () => rand(-6, 6) },
        { y: 0, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.5)', stagger: 0.07, overwrite: true }),
      onLeaveBack: (batch) => gsap.set(batch, { opacity: 0, y: 40 }),
    });

    if (finePointer) {
      $$('.tilt').forEach((card) => {
        gsap.set(card, { transformPerspective: 800 });
        const rx = gsap.quickTo(card, 'rotationX', { duration: 0.45, ease: 'power3' });
        const ry = gsap.quickTo(card, 'rotationY', { duration: 0.45, ease: 'power3' });
        const move = (event: Event) => {
          const pointer = event as PointerEvent;
          const rect = card.getBoundingClientRect();
          ry(((pointer.clientX - rect.left) / rect.width - 0.5) * 12);
          rx(-((pointer.clientY - rect.top) / rect.height - 0.5) * 12);
        };
        const leave = () => { rx(0); ry(0); };
        card.addEventListener('pointermove', move);
        card.addEventListener('pointerleave', leave);
        cleanups.push(() => {
          card.removeEventListener('pointermove', move);
          card.removeEventListener('pointerleave', leave);
        });
      });

      document.documentElement.classList.add('has-cursor');
      const cursor = $('#cursor');
      const dot = $('.cursor__dot');
      const ring = $('.cursor__ring');
      const label = $('.cursor__label');
      if (cursor && dot && ring && label) {
        const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' });
        const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });
        const rx = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3' });
        const ry = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3' });
        const canvas = $('#ink') as HTMLCanvasElement | null;
        const ink = canvas?.getContext('2d') ?? null;
        let dpr = 1;
        const resize = () => {
          if (!canvas) return;
          dpr = Math.min(2, window.devicePixelRatio || 1);
          canvas.width = window.innerWidth * dpr;
          canvas.height = window.innerHeight * dpr;
        };
        resize();
        window.addEventListener('resize', resize);
        cleanups.push(() => window.removeEventListener('resize', resize));
        const pts: Array<{ x: number; y: number; t: number }> = [];
        const move = (event: PointerEvent) => {
          dx(event.clientX); dy(event.clientY); rx(event.clientX); ry(event.clientY);
          pts.push({ x: event.clientX, y: event.clientY, t: performance.now() });
          cursor.classList.remove('is-hidden');
        };
        window.addEventListener('pointermove', move, { passive: true });
        const leave = () => cursor.classList.add('is-hidden');
        const down = () => cursor.classList.add('is-down');
        const up = () => cursor.classList.remove('is-down');
        document.addEventListener('pointerleave', leave);
        window.addEventListener('pointerdown', down);
        window.addEventListener('pointerup', up);
        cleanups.push(() => {
          window.removeEventListener('pointermove', move);
          document.removeEventListener('pointerleave', leave);
          window.removeEventListener('pointerdown', down);
          window.removeEventListener('pointerup', up);
        });
        let inkActive = false;
        const startInk = () => { inkActive = true; };
        window.setTimeout(startInk, 1200);
        cleanups.push(() => { inkActive = false; });

        const inkTick = () => {
          if (!inkActive || !ink || !canvas) return;
          const now = performance.now();
          while (pts.length && now - pts[0].t > 420) pts.shift();
          ink.setTransform(1, 0, 0, 1, 0, 0);
          ink.clearRect(0, 0, canvas.width, canvas.height);
          if (pts.length < 2) return;
          ink.setTransform(dpr, 0, 0, dpr, 0, 0);
          ink.lineCap = 'round';
          ink.lineJoin = 'round';
          ink.strokeStyle = '#000';
          for (let i = 1; i < pts.length; i += 1) {
            const a = pts[i - 1];
            const b = pts[i];
            const life = 1 - (now - b.t) / 420;
            ink.globalAlpha = Math.max(0, life);
            ink.lineWidth = 1 + life * 6;
            const jitter = (1 - life) * 1.4;
            ink.beginPath();
            ink.moveTo(a.x + rand(-jitter, jitter), a.y + rand(-jitter, jitter));
            ink.lineTo(b.x + rand(-jitter, jitter), b.y + rand(-jitter, jitter));
            ink.stroke();
          }
          ink.globalAlpha = 1;
        };
        gsap.ticker.add(inkTick);
        cleanups.push(() => gsap.ticker.remove(inkTick));

        const labelFor = (el: Element) => {
          if (el.matches('[data-soon]')) return 'soon';
          if (el.matches('.contract-box button')) return 'copy!';
          if (el.matches('a[href^="http"]')) return 'open';
          if (el.matches('a[href^="#"]')) return 'go';
          return 'troll!';
        };
        const over = (event: Event) => {
          const el = (event.target as HTMLElement | null)?.closest('a, button');
          if (!el) return;
          label.textContent = labelFor(el);
          cursor.classList.add('is-hover');
        };
        const out = (event: Event) => {
          const pointer = event as PointerEvent;
          const el = (event.target as HTMLElement | null)?.closest('a, button');
          if (el && !el.contains(pointer.relatedTarget as Node | null)) cursor.classList.remove('is-hover');
        };
        document.addEventListener('pointerover', over);
        document.addEventListener('pointerout', out);
        cleanups.push(() => {
          document.removeEventListener('pointerover', over);
          document.removeEventListener('pointerout', out);
          document.documentElement.classList.remove('has-cursor');
        });
      }
    }

    const fx = $('#fx');
    const svgNs = 'http://www.w3.org/2000/svg';
    const burst = (event: PointerEvent) => {
      if (!fx || event.button > 0) return;
      const x = event.clientX;
      const y = event.clientY;
      const svg = document.createElementNS(svgNs, 'svg');
      svg.setAttribute('viewBox', '-60 -60 120 120');
      svg.setAttribute('class', 'fx__burst');
      svg.style.left = `${x}px`;
      svg.style.top = `${y}px`;
      const lines: SVGPathElement[] = [];
      const offset = rand(0, Math.PI);
      for (let i = 0; i < 8; i += 1) {
        const angle = offset + (i / 8) * Math.PI * 2 + rand(-0.15, 0.15);
        const inner = rand(12, 18);
        const outer = rand(28, 44);
        const path = document.createElementNS(svgNs, 'path');
        path.setAttribute('d', `M${Math.cos(angle) * inner} ${Math.sin(angle) * inner}L${Math.cos(angle) * outer} ${Math.sin(angle) * outer}`);
        path.setAttribute('pathLength', '1');
        path.style.strokeDasharray = '1 1';
        path.style.strokeDashoffset = '1';
        svg.appendChild(path);
        lines.push(path);
      }
      fx.appendChild(svg);
      const ring = document.createElement('div');
      ring.className = 'fx__ring';
      ring.style.left = `${x}px`;
      ring.style.top = `${y}px`;
      fx.appendChild(ring);
      gsap.timeline({ onComplete: () => { svg.remove(); ring.remove(); } })
        .to(lines, { strokeDashoffset: 0, duration: 0.16, ease: 'power2.out' })
        .to(lines, { strokeDashoffset: -1, duration: 0.28, ease: 'power2.in' }, 0.18)
        .fromTo(ring, { scale: 0.2, opacity: 1 }, { scale: 3.2, opacity: 0, rotate: 80, duration: 0.5, ease: 'power2.out' }, 0);
      if (Math.random() < 0.55) {
        const word = document.createElement('div');
        word.className = 'fx__word';
        word.textContent = pick(WORDS);
        word.style.left = `${x}px`;
        word.style.top = `${y}px`;
        fx.appendChild(word);
        gsap.timeline({ onComplete: () => word.remove() })
          .fromTo(word, { xPercent: -50, yPercent: -50, scale: 0, rotate: rand(-24, 24) },
            { scale: 1, y: -54, x: rand(-36, 36), rotate: rand(-12, 12), duration: 0.45, ease: 'back.out(2.6)' })
          .to(word, { y: -100, opacity: 0, duration: 0.4, ease: 'power2.in' }, '+=0.15');
      }
    };
    window.addEventListener('pointerdown', burst);
    cleanups.push(() => window.removeEventListener('pointerdown', burst));
  });

  return () => {
    cleanups.forEach((fn) => fn());
    ctx.revert();
    document.body.classList.remove('is-loading');
    document.documentElement.classList.remove('has-cursor');
  };
}
