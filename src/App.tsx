import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initHeroCanvas } from './webgl/heroCanvas';
import { initSpecsCanvas } from './webgl/specsCanvas';
import {
  ALL_WASHER_MODELS,
  BRAND_SECTIONS,
  BrandId,
  BudgetFilter,
  COMPARE_SCROLL_STAGES,
  DELIVERY_ZONES,
  EMI_TENURES,
  FamilySizeFilter,
  FINISH_META,
  FinishId,
  formatNpr,
  JEC_WHATSAPP_NUMBER,
  KATHMANDU_FAQS,
  LOCAL_TESTIMONIALS,
  MEDIA_ASSETS,
  SAMSUNG_MODELS,
  SHOWCASE_STAGES,
  TRADE_IN_TIERS,
  WasherCategory,
  WasherModel,
} from './data/washersCatalog';

gsap.registerPlugin(ScrollTrigger);

interface BagItem {
  modelId: string;
  brandLabel: string;
  sku: string;
  name: string;
  capacity: string;
  finish: FinishId;
  mrpNpr: number;
  discountPct: number;
  unitPrice: number;
  tradeInLabel: string;
  tradeInDiscount: number;
  emiLabel: string;
  image: string;
  qty: number;
}

interface OrderReceipt {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  zoneName: string;
  paymentMethod: string;
  totalNpr: number;
  itemCount: number;
}

const SAMSUNG_CATEGORIES: ('All' | WasherCategory)[] = [
  'All',
  'Front Load',
  'Washer Dryer',
  'Top Load',
  'Semi-Automatic',
];

const HERO_DISPLAY_IDS = [
  'ww12dg6b24abim',
  'wd11tp34dsx',
  'ww90dg6u24axim',
  'wa80bg4545bvim',
  'wt70c3200ll',
];

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  // Cinematic Hero Samsung model
  const [heroModelId, setHeroModelId] = useState<string>(SAMSUNG_MODELS[0].id);

  // Capacity & Budget Quick Finder
  const [familySize, setFamilySize] = useState<FamilySizeFilter>('all');
  const [budgetFilter, setBudgetFilter] = useState<BudgetFilter>('all');

  // Samsung section category filter
  const [samsungCategory, setSamsungCategory] = useState<'All' | WasherCategory>('All');

  // Pinned Showcase stage
  const [activeStage, setActiveStage] = useState<number>(0);
  const [captionBlur, setCaptionBlur] = useState<boolean>(false);

  // Pinned Brand-vs-Brand Scroll Comparison stage
  const [activeCompareIdx, setActiveCompareIdx] = useState<number>(0);
  const [compareBlur, setCompareBlur] = useState<boolean>(false);

  // Interactive Side-by-Side Model Comparator
  const [compareModelAId, setCompareModelAId] = useState<string>('ww90dg6u24axim');
  const [compareModelBId, setCompareModelBId] = useState<string>('himstar-10fbwa2dtk');

  // EcoBubble Cold vs Hygiene Steam Comparison Slider
  const [splitPct, setSplitPct] = useState<number>(50);
  const [splitAnimate, setSplitAnimate] = useState<boolean>(false);

  // Multi-brand Configurator + EMI Tenure + Trade-In Tier + Delivery Zone
  const [configBrand, setConfigBrand] = useState<BrandId>('samsung');
  const [configModelId, setConfigModelId] = useState<string>(SAMSUNG_MODELS[0].id);
  const [configFinish, setConfigFinish] = useState<FinishId>(SAMSUNG_MODELS[0].defaultFinish);
  const [tradeInTierId, setTradeInTierId] = useState<string>('none');
  const [emiMonths, setEmiMonths] = useState<number>(0);
  const [deliveryZoneId, setDeliveryZoneId] = useState<string>('ktm');

  // Persistent Quick-Buy Bar visibility
  const [showQuickBar, setShowQuickBar] = useState<boolean>(false);
  const [quickBarDismissed, setQuickBarDismissed] = useState<boolean>(false);

  // Navigation active state, Bag pulse, & AEO FAQ accordion state
  const [activeNav, setActiveNav] = useState<string>('');
  const [bagPulsing, setBagPulsing] = useState<boolean>(false);
  const [openFaqId, setOpenFaqId] = useState<string>(KATHMANDU_FAQS[0].id);

  // Cart & Sales Checkout state
  const [bag, setBag] = useState<BagItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [checkoutPayment, setCheckoutPayment] = useState<string>('Cash on Delivery');
  const [formError, setFormError] = useState<string>('');
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);

  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const specsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollProgressRef = useRef<HTMLDivElement | null>(null);
  const heroCopyRef = useRef<HTMLDivElement | null>(null);
  const heroStageRef = useRef<HTMLDivElement | null>(null);
  const tiltWrapRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const heroReadoutRef = useRef<HTMLDivElement | null>(null);
  const orderPriceRef = useRef<HTMLSpanElement | null>(null);
  const orderImgRef = useRef<HTMLImageElement | null>(null);
  const showcaseRef = useRef<HTMLElement | null>(null);
  const frameRefs = useRef<(HTMLElement | null)[]>([]);
  const comparePinRef = useRef<HTMLElement | null>(null);
  const compareFrameRefs = useRef<(HTMLElement | null)[]>([]);
  const bentoGridRef = useRef<HTMLDivElement | null>(null);
  const compWrapRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const stageIdxRef = useRef<number>(0);
  const stageTimerRef = useRef<number | null>(null);
  const compareIdxRef = useRef<number>(0);
  const compareTimerRef = useRef<number | null>(null);
  const bagPulseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Dynamic canonical & OpenGraph URL resolution for SPA SEO
  useEffect(() => {
    const currentUrl = window.location.origin + window.location.pathname;
    const canonical = document.getElementById('canonical-link');
    const ogUrl = document.getElementById('og-url-meta');
    if (canonical) canonical.setAttribute('href', currentUrl);
    if (ogUrl) ogUrl.setAttribute('content', currentUrl);
  }, []);

  useEffect(() => {
    const trackedIds = ['compare', 'samsung', 'himstar', 'videocon', 'panasonic', 'faq'];
    const onScroll = () => {
      const y = window.scrollY;
      setShowQuickBar(y > 560);

      if (scrollProgressRef.current) {
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(1, Math.max(0, y / docHeight)) : 0;
        scrollProgressRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
      }

      let currentSection = '';
      for (const id of trackedIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 120) {
            currentSection = id;
            break;
          }
        }
      }
      setActiveNav(currentSection);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const cleanupHeroGl = initHeroCanvas(heroCanvasRef.current);
    const cleanupSpecsGl = initSpecsCanvas(specsCanvasRef.current);

    let lenis: InstanceType<typeof Lenis> | null = null;
    let lenisTicker: ((time: number) => void) | null = null;
    if (!prefersReduced) {
      lenis = new Lenis({
        duration: 1.0,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenis.on('scroll', ScrollTrigger.update);
      lenisTicker = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(lenisTicker);
      gsap.ticker.lagSmoothing(0);
    }

    let targetRotX = 0;
    let targetRotY = 0;
    let curRotX = 0;
    let curRotY = 0;
    let velX = 0;
    let velY = 0;
    let tiltTicker: (() => void) | null = null;

    const heroStage = heroStageRef.current;
    const onHeroMove = (e: PointerEvent) => {
      if (!heroStage) return;
      const rect = heroStage.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = nx * 13;
      targetRotX = -ny * 9;
    };
    const onHeroLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    if (heroStage && tiltWrapRef.current && !prefersReduced) {
      heroStage.addEventListener('pointermove', onHeroMove);
      heroStage.addEventListener('pointerleave', onHeroLeave);
      tiltTicker = () => {
        const ax = (targetRotX - curRotX) * 0.08;
        const ay = (targetRotY - curRotY) * 0.08;
        velX = (velX + ax) * 0.82;
        velY = (velY + ay) * 0.82;
        curRotX += velX;
        curRotY += velY;
        if (tiltWrapRef.current) {
          tiltWrapRef.current.style.transform = `rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg)`;
        }
        if (shadowRef.current) {
          shadowRef.current.style.transform = `translateX(${(-curRotY * 1.4).toFixed(1)}px) scale(${1 - Math.abs(curRotX) * 0.01})`;
        }
      };
      gsap.ticker.add(tiltTicker);
    }

    const gsapCtx = gsap.context(() => {
      if (prefersReduced) return;

      // Hero Entrance Choreography
      if (heroCopyRef.current) {
        gsap.from(heroCopyRef.current.children, {
          y: 22,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        });
      }
      if (heroStageRef.current) {
        gsap.from(heroStageRef.current, {
          scale: 0.94,
          opacity: 0,
          duration: 0.78,
          delay: 0.12,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        });
      }

      // Pinned 4-Stage Environmental Showcase
      const frames = frameRefs.current.filter(
        (el): el is HTMLElement => el !== null
      );
      if (showcaseRef.current && frames.length === 4) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: showcaseRef.current,
            start: 'top top',
            end: '+=240%',
            pin: true,
            anticipatePin: 1,
            scrub: 0.65,
            onUpdate: (self: { progress: number }) => {
              const t = self.progress * 3.5;
              let nextIdx = 0;
              if (t >= 3.07) nextIdx = 3;
              else if (t >= 2.02) nextIdx = 2;
              else if (t >= 0.97) nextIdx = 1;

              if (nextIdx !== stageIdxRef.current) {
                stageIdxRef.current = nextIdx;
                setCaptionBlur(true);
                if (stageTimerRef.current !== null) {
                  window.clearTimeout(stageTimerRef.current);
                }
                stageTimerRef.current = window.setTimeout(() => {
                  stageTimerRef.current = null;
                  setActiveStage(nextIdx);
                  setCaptionBlur(false);
                }, 100);
              }
            },
          },
        });

        const wipeStarts = [0.25, 1.3, 2.35];
        frames.forEach((frame, i) => {
          if (i === 0) return;
          tl.fromTo(
            frame,
            { clipPath: 'inset(0 0 0 100%)' },
            { clipPath: 'inset(0 0 0 0%)', ease: 'none', duration: 0.8 },
            wipeStarts[i - 1]
          );
        });
        tl.set({}, {}, 3.5);
      }

      // Pinned Brand-vs-Brand Scroll Comparison Wipe (Samsung -> Himstar -> Panasonic -> Videocon)
      const cmpFrames = compareFrameRefs.current.filter(
        (el): el is HTMLElement => el !== null
      );
      if (comparePinRef.current && cmpFrames.length === 4) {
        const cmpTl = gsap.timeline({
          scrollTrigger: {
            trigger: comparePinRef.current,
            start: 'top top',
            end: '+=240%',
            pin: true,
            anticipatePin: 1,
            scrub: 0.65,
            onUpdate: (self: { progress: number }) => {
              const t = self.progress * 3.5;
              let nextIdx = 0;
              if (t >= 3.07) nextIdx = 3;
              else if (t >= 2.02) nextIdx = 2;
              else if (t >= 0.97) nextIdx = 1;

              if (nextIdx !== compareIdxRef.current) {
                compareIdxRef.current = nextIdx;
                setCompareBlur(true);
                if (compareTimerRef.current !== null) {
                  window.clearTimeout(compareTimerRef.current);
                }
                compareTimerRef.current = window.setTimeout(() => {
                  compareTimerRef.current = null;
                  setActiveCompareIdx(nextIdx);
                  setCompareBlur(false);
                }, 90);
              }
            },
          },
        });

        const wipeStarts = [0.25, 1.3, 2.35];
        cmpFrames.forEach((frame, i) => {
          if (i === 0) return;
          cmpTl.fromTo(
            frame,
            { clipPath: 'inset(0 0 0 100%)' },
            { clipPath: 'inset(0 0 0 0%)', ease: 'none', duration: 0.8 },
            wipeStarts[i - 1]
          );
        });
        cmpTl.set({}, {}, 3.5);
      }

      if (bentoGridRef.current) {
        gsap.from('.reveal-tile', {
          y: 24,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: bentoGridRef.current,
            start: 'top 84%',
            once: true,
          },
        });
      }

      // Smooth Scroll-Triggered Entrance Motion for Brand Grids, Buyer Proof, & FAQs
      gsap.utils.toArray<HTMLElement>('.brand-section .catalog-grid').forEach((grid) => {
        const cards = grid.querySelectorAll('.product-card');
        if (cards.length > 0) {
          gsap.from(cards, {
            y: 26,
            opacity: 0,
            duration: 0.56,
            stagger: 0.07,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: grid,
              start: 'top 86%',
              once: true,
            },
          });
        }
      });

      const proofCards = document.querySelectorAll('.proof-grid .proof-card');
      if (proofCards.length > 0) {
        gsap.from(proofCards, {
          y: 22,
          opacity: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.proof-grid',
            start: 'top 86%',
            once: true,
          },
        });
      }

      const faqItems = document.querySelectorAll('.faq-list .faq-item');
      if (faqItems.length > 0) {
        gsap.from(faqItems, {
          y: 16,
          opacity: 0,
          duration: 0.45,
          stagger: 0.06,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.faq-list',
            start: 'top 86%',
            once: true,
          },
        });
      }
    });

    return () => {
      if (stageTimerRef.current !== null) {
        window.clearTimeout(stageTimerRef.current);
        stageTimerRef.current = null;
      }
      if (compareTimerRef.current !== null) {
        window.clearTimeout(compareTimerRef.current);
        compareTimerRef.current = null;
      }
      if (bagPulseTimerRef.current !== null) {
        window.clearTimeout(bagPulseTimerRef.current);
        bagPulseTimerRef.current = null;
      }
      cleanupHeroGl();
      cleanupSpecsGl();
      gsapCtx.revert();
      if (tiltTicker) gsap.ticker.remove(tiltTicker);
      if (lenisTicker) gsap.ticker.remove(lenisTicker);
      lenis?.destroy();
      heroStage?.removeEventListener('pointermove', onHeroMove);
      heroStage?.removeEventListener('pointerleave', onHeroLeave);
    };
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [familySize, budgetFilter, samsungCategory]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  const heroDisplayModels = HERO_DISPLAY_IDS.map(
    (id) => SAMSUNG_MODELS.find((m) => m.id === id)!
  ).filter(Boolean);

  const heroModel =
    SAMSUNG_MODELS.find((m) => m.id === heroModelId) ?? SAMSUNG_MODELS[0];

  const triggerCinematicHeroSwitch = (nextModel: WasherModel, direction: 1 | -1 = 1) => {
    if (nextModel.id === heroModelId) return;
    setHeroModelId(nextModel.id);
    selectConfigModel(nextModel);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    if (tiltWrapRef.current) {
      gsap.fromTo(
        tiltWrapRef.current,
        {
          opacity: 0.15,
          scale: 0.9,
          rotateY: direction * 22,
          filter: 'blur(10px)',
        },
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          filter: 'blur(0px)',
          duration: 0.56,
          ease: 'power3.out',
          clearProps: 'filter',
        }
      );
    }

    if (shadowRef.current) {
      gsap.fromTo(
        shadowRef.current,
        { scaleX: 0.72, opacity: 0.25 },
        { scaleX: 1, opacity: 1, duration: 0.52, ease: 'power3.out' }
      );
    }

    if (heroReadoutRef.current) {
      gsap.fromTo(
        heroReadoutRef.current,
        { y: 8, opacity: 0.35 },
        { y: 0, opacity: 1, duration: 0.38, ease: 'power2.out' }
      );
    }
  };

  const stepHeroModel = (delta: 1 | -1) => {
    const curIdx = heroDisplayModels.findIndex((m) => m.id === heroModel.id);
    const nextIdx =
      (curIdx + delta + heroDisplayModels.length) % heroDisplayModels.length;
    triggerCinematicHeroSwitch(heroDisplayModels[nextIdx], delta);
  };

  const selectCompareStage = (idx: number) => {
    compareIdxRef.current = idx;
    setCompareBlur(true);
    if (compareTimerRef.current !== null) {
      window.clearTimeout(compareTimerRef.current);
    }
    compareTimerRef.current = window.setTimeout(() => {
      compareTimerRef.current = null;
      setActiveCompareIdx(idx);
      setCompareBlur(false);
    }, 90);
    compareFrameRefs.current.forEach((frame, i) => {
      if (!frame) return;
      frame.style.clipPath =
        i <= idx ? 'inset(0 0 0 0%)' : 'inset(0 0 0 100%)';
    });
  };

  // Filtered finder results
  const isFinderActive = familySize !== 'all' || budgetFilter !== 'all';
  const finderMatches = ALL_WASHER_MODELS.filter((m) => {
    if (familySize === 'small' && m.capacityKg > 7.5) return false;
    if (familySize === 'medium' && (m.capacityKg < 8 || m.capacityKg > 9.5)) return false;
    if (familySize === 'large' && m.capacityKg < 10) return false;

    if (budgetFilter === 'under35' && m.priceNpr >= 35000) return false;
    if (budgetFilter === '35to80' && (m.priceNpr < 35000 || m.priceNpr > 80000)) return false;
    if (budgetFilter === 'over80' && m.priceNpr <= 80000) return false;
    return true;
  });

  const brandModelsForConfig = ALL_WASHER_MODELS.filter(
    (m) => m.brand === configBrand
  );
  const configModel =
    ALL_WASHER_MODELS.find((m) => m.id === configModelId) ?? SAMSUNG_MODELS[0];

  const activeTradeInTier =
    TRADE_IN_TIERS.find((t) => t.id === tradeInTierId) ?? TRADE_IN_TIERS[0];
  const configuredNetPrice = Math.max(
    0,
    configModel.priceNpr - activeTradeInTier.bonusNpr
  );
  const configuredMonthly =
    emiMonths > 0 ? Math.round(configuredNetPrice / emiMonths) : configuredNetPrice;
  const activeDeliveryZone =
    DELIVERY_ZONES.find((z) => z.id === deliveryZoneId) ?? DELIVERY_ZONES[0];

  const compareModelA =
    ALL_WASHER_MODELS.find((m) => m.id === compareModelAId) ?? ALL_WASHER_MODELS[2];
  const compareModelB =
    ALL_WASHER_MODELS.find((m) => m.id === compareModelBId) ?? ALL_WASHER_MODELS[6];
  const priceDiff = Math.abs(compareModelA.priceNpr - compareModelB.priceNpr);
  const cheaperModel =
    compareModelA.priceNpr <= compareModelB.priceNpr ? compareModelA : compareModelB;

  const selectStage = (idx: number) => {
    stageIdxRef.current = idx;
    setCaptionBlur(true);
    if (stageTimerRef.current !== null) {
      window.clearTimeout(stageTimerRef.current);
    }
    stageTimerRef.current = window.setTimeout(() => {
      stageTimerRef.current = null;
      setActiveStage(idx);
      setCaptionBlur(false);
    }, 100);
    frameRefs.current.forEach((frame, i) => {
      if (!frame) return;
      frame.style.clipPath =
        i <= idx ? 'inset(0 0 0 0%)' : 'inset(0 0 0 100%)';
    });
  };

  const updateSplit = (pct: number, animate: boolean) => {
    const clamped = Math.max(0, Math.min(100, pct));
    setSplitAnimate(animate);
    setSplitPct(clamped);
  };

  const handleCompPointerDown = (e: {
    currentTarget: HTMLDivElement;
    pointerId: number;
    clientX: number;
  }) => {
    isDraggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    updateSplit(((e.clientX - rect.left) / rect.width) * 100, false);
  };

  const handleCompPointerMove = (e: {
    currentTarget: HTMLDivElement;
    clientX: number;
  }) => {
    if (!isDraggingRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    updateSplit(((e.clientX - rect.left) / rect.width) * 100, false);
  };

  const handleCompPointerUp = () => {
    isDraggingRef.current = false;
  };

  const animateConfiguratorFeedback = (withImage: boolean) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (orderPriceRef.current) {
      gsap.fromTo(
        orderPriceRef.current,
        { y: -5, opacity: 0.45 },
        { y: 0, opacity: 1, duration: 0.28, ease: 'power2.out' }
      );
    }
    if (withImage && orderImgRef.current) {
      gsap.fromTo(
        orderImgRef.current,
        { scale: 0.96, opacity: 0.65 },
        { scale: 1, opacity: 1, duration: 0.38, ease: 'power3.out' }
      );
    }
  };

  const selectConfigBrand = (brand: BrandId) => {
    setConfigBrand(brand);
    const firstModel = ALL_WASHER_MODELS.find((m) => m.brand === brand);
    if (firstModel) {
      setConfigModelId(firstModel.id);
      setConfigFinish(firstModel.defaultFinish);
    }
    animateConfiguratorFeedback(true);
  };

  const selectConfigModel = (model: WasherModel) => {
    setConfigBrand(model.brand);
    setConfigModelId(model.id);
    if (!model.availableFinishes.includes(configFinish)) {
      setConfigFinish(model.defaultFinish);
    }
    animateConfiguratorFeedback(true);
  };

  const jumpToConfigure = (model: WasherModel) => {
    selectConfigModel(model);
    const el = document.getElementById('order');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const addModelToBag = (
    model: WasherModel,
    finishId: FinishId,
    tierId: string = 'none',
    selectedEmiMonths: number = 0
  ) => {
    setReceipt(null);
    setFormError('');
    setBagPulsing(true);
    if (bagPulseTimerRef.current !== null) {
      window.clearTimeout(bagPulseTimerRef.current);
    }
    bagPulseTimerRef.current = window.setTimeout(() => {
      bagPulseTimerRef.current = null;
      setBagPulsing(false);
    }, 450);

    const tier = TRADE_IN_TIERS.find((t) => t.id === tierId) ?? TRADE_IN_TIERS[0];
    const unitPrice = Math.max(0, model.priceNpr - tier.bonusNpr);
    const emiLabel =
      selectedEmiMonths > 0
        ? `${selectedEmiMonths}-Mo EMI (${formatNpr(Math.round(unitPrice / selectedEmiMonths))}/mo)`
        : 'Full Payment';
    const tradeInLabel = tier.bonusNpr > 0 ? tier.label : '';

    setBag((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.modelId === model.id &&
          item.finish === finishId &&
          item.tradeInLabel === tradeInLabel &&
          item.emiLabel === emiLabel
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [
        ...prev,
        {
          modelId: model.id,
          brandLabel: model.brandLabel,
          sku: model.sku,
          name: model.name,
          capacity: model.capacity,
          finish: finishId,
          mrpNpr: model.mrpNpr,
          discountPct: model.discountPct,
          unitPrice,
          tradeInLabel,
          tradeInDiscount: tier.bonusNpr,
          emiLabel,
          image: model.image,
          qty: 1,
        },
      ];
    });
    setDrawerOpen(true);
  };

  const updateBagQty = (idx: number, delta: number) => {
    setBag((prev) => {
      const next = [...prev];
      const updatedQty = next[idx].qty + delta;
      if (updatedQty <= 0) {
        next.splice(idx, 1);
      } else {
        next[idx] = { ...next[idx], qty: updatedQty };
      }
      return next;
    });
  };

  const removeBagItem = (idx: number) => {
    setBag((prev) => prev.filter((_, i) => i !== idx));
  };

  const totalQty = bag.reduce((sum, item) => sum + item.qty, 0);
  const totalPayable = bag.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const totalTradeInSaved = bag.reduce(
    (sum, item) => sum + item.tradeInDiscount * item.qty,
    0
  );
  const totalOfferSaved = bag.reduce(
    (sum, item) =>
      sum + Math.max(0, item.mrpNpr - item.unitPrice - item.tradeInDiscount) * item.qty,
    0
  );

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setFormError('Please enter your name, phone number, and delivery address.');
      return;
    }
    setFormError('');
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    setReceipt({
      orderId: `JEC-${randomCode}`,
      customerName: customerName.trim(),
      phone: customerPhone.trim(),
      address: customerAddress.trim(),
      zoneName: activeDeliveryZone.name,
      paymentMethod: checkoutPayment,
      totalNpr: totalPayable,
      itemCount: totalQty,
    });
    setBag([]);
    setCheckoutOpen(false);
  };

  const buildWhatsAppOrderUrl = () => {
    const lines = bag.map(
      (item, i) =>
        `${i + 1}. ${item.name} (${item.sku}) - ${FINISH_META[item.finish].name} x${item.qty} = ${formatNpr(item.unitPrice * item.qty)}`
    );
    const msg = `Namaste Join Electronic Center! I would like to order:\n${lines.join('\n')}\nTotal: ${formatNpr(totalPayable)}\nDelivery Zone: ${activeDeliveryZone.name}`;
    return `https://wa.me/${JEC_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  const renderProductCard = (model: WasherModel) => (
    <article key={model.id} className="product-card">
      <div className="product-card-media">
        <img
          src={model.image}
          alt={`${model.name} (${model.sku})`}
          className="product-card-img"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="product-card-body">
        <div className="product-card-meta">
          <span>{model.brandLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{model.category}</span>
          <span aria-hidden="true">·</span>
          <span>{model.sku}</span>
        </div>

        <h3 className="product-card-title">{model.name}</h3>
        <p className="product-card-desc">{model.tagline}</p>

        <div className="product-card-specs">
          {model.capacity} · {model.spinRpm} · {model.motorWarranty}
        </div>

        <div className="product-card-footer">
          <div className="product-price-row">
            <div className="price-stack">
              <div className="product-offer-line">
                <span className="product-price tabular">{formatNpr(model.priceNpr)}</span>
                <del className="mrp-strike">{formatNpr(model.mrpNpr)}</del>
                <span className="discount-tag">{model.discountPct}% OFF</span>
              </div>
              <span className="product-emi tabular">
                Save {formatNpr(model.mrpNpr - model.priceNpr)} · 0% EMI{' '}
                {formatNpr(model.emiMonthlyNpr)}/mo
              </span>
            </div>
          </div>

          <div className="product-card-actions">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => jumpToConfigure(model)}
            >
              Configure
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => addModelToBag(model, model.defaultFinish, 'none', 0)}
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </article>
  );

  const samsungFiltered =
    samsungCategory === 'All'
      ? SAMSUNG_MODELS
      : SAMSUNG_MODELS.filter((m) => m.category === samsungCategory);

  const activeCompareStage = COMPARE_SCROLL_STAGES[activeCompareIdx];
  const activeCompareModel =
    ALL_WASHER_MODELS.find((m) => m.id === activeCompareStage.modelId) ??
    ALL_WASHER_MODELS[2];

  return (
    <>
      <header className="site-header" id="site-header">
        <div className="container header-inner">
          <a href="#hero" className="brand-lockup" aria-label="Join Electronic Home">
            <svg
              className="brand-mark"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="2"
                width="18"
                height="20"
                rx="3"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="12" cy="13.5" r="4.5" stroke="currentColor" strokeWidth="2" />
              <line x1="7" y1="5.5" x2="17" y2="5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Join Electronic</span>
          </a>

          <nav className="header-nav" aria-label="Brands, comparison, and buying guide">
            <a
              href="#compare"
              className={`nav-link${activeNav === 'compare' ? ' is-active' : ''}`}
            >
              Compare
            </a>
            <a
              href="#samsung"
              className={`nav-link${activeNav === 'samsung' ? ' is-active' : ''}`}
            >
              Samsung
            </a>
            <a
              href="#himstar"
              className={`nav-link${activeNav === 'himstar' ? ' is-active' : ''}`}
            >
              Himstar
            </a>
            <a
              href="#videocon"
              className={`nav-link${activeNav === 'videocon' ? ' is-active' : ''}`}
            >
              Videocon
            </a>
            <a
              href="#panasonic"
              className={`nav-link${activeNav === 'panasonic' ? ' is-active' : ''}`}
            >
              Panasonic
            </a>
            <a
              href="#faq"
              className={`nav-link${activeNav === 'faq' ? ' is-active' : ''}`}
            >
              FAQ
            </a>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="icon-btn"
              id="theme-toggle"
              aria-label="Toggle color theme"
              title="Switch light or dark theme"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <svg
                id="theme-icon-sun"
                width="18"
                height="18"
                viewBox="0 0 256 256"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="128" cy="128" r="56" stroke="currentColor" strokeWidth="18" />
                <line x1="128" y1="24" x2="128" y2="44" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="128" y1="212" x2="128" y2="232" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="24" y1="128" x2="44" y2="128" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="212" y1="128" x2="232" y2="128" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="54" y1="54" x2="68" y2="68" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="188" y1="188" x2="202" y2="202" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="54" y1="202" x2="68" y2="188" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
                <line x1="188" y1="68" x2="202" y2="54" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
              </svg>
              <svg
                id="theme-icon-moon"
                width="18"
                height="18"
                viewBox="0 0 256 256"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M210.69 158.18A96.78 96.78 0 0 1 192 160 96.11 96.11 0 0 1 96 64a96.78 96.78 0 0 1 1.82-18.69A96.04 96.04 0 1 0 210.69 158.18Z"
                  stroke="currentColor"
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              className={`bag-btn${bagPulsing ? ' is-pulsing' : ''}`}
              id="bag-trigger"
              aria-label="Open shopping bag"
              onClick={() => setDrawerOpen(true)}
            >
              <span>Bag</span>
              <span className="bag-count-num" id="bag-count">
                ({totalQty})
              </span>
            </button>
          </div>
        </div>
        <div
          className="scroll-progress-bar"
          ref={scrollProgressRef}
          aria-hidden="true"
        />
      </header>

      <main>
        <nav
          className="mobile-brand-ribbon"
          aria-label="Quick brand and section jump links"
        >
          <a href="#compare" className="mobile-ribbon-link">
            Compare Brands
          </a>
          <a href="#samsung" className="mobile-ribbon-link">
            Samsung
          </a>
          <a href="#himstar" className="mobile-ribbon-link">
            Himstar
          </a>
          <a href="#videocon" className="mobile-ribbon-link">
            Videocon
          </a>
          <a href="#panasonic" className="mobile-ribbon-link">
            Panasonic
          </a>
          <a href="#order" className="mobile-ribbon-link">
            0% EMI &amp; Exchange
          </a>
          <a href="#faq" className="mobile-ribbon-link">
            Nepal FAQ
          </a>
        </nav>

        {/* SECTION 1: Cinematic Floating 3D Samsung Hero Display */}
        <section id="hero" className="hero">
          <canvas
            ref={heroCanvasRef}
            id="hero-gl-canvas"
            className="hero-canvas"
            aria-hidden="true"
          />

          <div className="container hero-grid">
            <div className="hero-copy" ref={heroCopyRef}>
              <div className="hero-meta-line">
                <span>Join Electronic Center</span>
                <span aria-hidden="true">·</span>
                <span>Samakhushi, Kathmandu</span>
                <span aria-hidden="true">·</span>
                <span>0% EMI &amp; Free Valley Delivery</span>
              </div>

              <h1 className="hero-title">Washing Machines in Kathmandu, Built for Nepal.</h1>
              <p className="hero-sub">
                Shop authentic Samsung, Himstar, Videocon, and Panasonic washing machines
                from Rs. 19,990 — with 0% EMI without a credit card, Sata-Pata exchange
                up to Rs. 8,000, and same-day Kathmandu Valley delivery.
              </p>

              <div className="hero-active-readout" ref={heroReadoutRef}>
                <div>
                  <div className="hero-model-name">{heroModel.name}</div>
                  <div className="hero-model-sku">
                    {heroModel.sku} · {heroModel.capacity} · {heroModel.spinRpm}
                  </div>
                </div>
                <div className="hero-price-block">
                  <div className="hero-price tabular">
                    {formatNpr(heroModel.priceNpr)}
                  </div>
                  <div className="hero-mrp-row">
                    <del className="mrp-strike">{formatNpr(heroModel.mrpNpr)}</del>
                    <span className="discount-tag">{heroModel.discountPct}% OFF</span>
                  </div>
                  <div className="hero-emi tabular">
                    Save {formatNpr(heroModel.mrpNpr - heroModel.priceNpr)} · 0% EMI{' '}
                    {formatNpr(heroModel.emiMonthlyNpr)}/mo
                  </div>
                </div>
              </div>

              <div className="hero-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    addModelToBag(heroModel, heroModel.defaultFinish, 'none', 0)
                  }
                >
                  Buy Offer — {formatNpr(heroModel.priceNpr)}
                </button>
                <a href="#compare" className="btn btn-ghost">
                  Compare 4 Brands
                </a>
              </div>
            </div>

            <div className="hero-stage" ref={heroStageRef} id="hero-stage">
              <div className="washer-cinematic-stage">
                <div
                  className="washer-ambient-glow"
                  style={{
                    background: `radial-gradient(circle, ${heroModel.glowTint} 0%, transparent 70%)`,
                  }}
                  aria-hidden="true"
                />
                <div
                  className="washer-tilt-wrap"
                  ref={tiltWrapRef}
                  id="washer-tilt-wrap"
                >
                  <img
                    src={heroModel.image}
                    alt={`${heroModel.name} (${heroModel.sku})`}
                    className="washer-hero-img"
                    id="hero-washer-img"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="washer-shadow" ref={shadowRef} aria-hidden="true" />

              <div className="hero-stage-controls">
                <button
                  type="button"
                  className="stage-arrow-btn"
                  aria-label="Previous Samsung model"
                  onClick={() => stepHeroModel(-1)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <div
                  className="hero-model-switcher"
                  role="radiogroup"
                  aria-label="Select Samsung washing machine model on display"
                >
                  {heroDisplayModels.map((model, idx) => {
                    const isActive = heroModel.id === model.id;
                    const curIdx = heroDisplayModels.findIndex(
                      (m) => m.id === heroModel.id
                    );
                    const dir = idx >= curIdx ? 1 : -1;
                    return (
                      <button
                        key={model.id}
                        type="button"
                        role="radio"
                        className={`model-switch-btn${isActive ? ' is-active' : ''}`}
                        aria-checked={isActive}
                        onClick={() => triggerCinematicHeroSwitch(model, dir)}
                      >
                        <span
                          className="switch-dot"
                          style={{ background: FINISH_META[model.defaultFinish].swatch }}
                        />
                        <span>{model.shortName}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="stage-arrow-btn"
                  aria-label="Next Samsung model"
                  onClick={() => stepHeroModel(1)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Pinned 4-Stage Environmental Showcase */}
        <section id="showcase" ref={showcaseRef} className="showcase-pin">
          <div className="showcase-viewport" id="showcase-viewport">
            <div className="showcase-frames" id="showcase-frames">
              {SHOWCASE_STAGES.map((stage, i) => (
                <figure
                  key={stage.title}
                  ref={(el: HTMLElement | null) => {
                    frameRefs.current[i] = el;
                  }}
                  className={`showcase-frame${i === 0 ? ' is-active' : ''}`}
                  data-index={i}
                >
                  <img
                    src={stage.src}
                    alt={stage.alt}
                    className="showcase-img"
                    referrerPolicy="no-referrer"
                  />
                </figure>
              ))}
            </div>

            <div className="showcase-hud">
              <div
                className={`showcase-caption${captionBlur ? ' is-blurring' : ''}`}
                id="showcase-caption"
              >
                <h2 className="caption-title" id="caption-title">
                  {SHOWCASE_STAGES[activeStage].title}
                </h2>
                <p className="caption-sub" id="caption-sub">
                  {SHOWCASE_STAGES[activeStage].sub}
                </p>
              </div>

              <div
                className="showcase-dots"
                role="tablist"
                aria-label="Showcase views"
              >
                {SHOWCASE_STAGES.map((stage, i) => (
                  <button
                    key={stage.title}
                    type="button"
                    role="tab"
                    aria-selected={activeStage === i}
                    className={`stage-dot${activeStage === i ? ' is-active' : ''}`}
                    aria-label={`View ${i + 1}: ${stage.title}`}
                    onClick={() => selectStage(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Interactive EcoBubble Cold vs Hygiene Steam Comparison */}
        <section id="thermal" className="thermal-section">
          <div className="container thermal-grid">
            <div
              className="comparison-wrap"
              ref={compWrapRef}
              id="comparison-wrap"
              onPointerDown={handleCompPointerDown}
              onPointerMove={handleCompPointerMove}
              onPointerUp={handleCompPointerUp}
              onPointerCancel={handleCompPointerUp}
            >
              <div className="comparison-layer">
                <img
                  src={MEDIA_ASSETS.comparisonSteam}
                  alt="Washing machine drum glowing with Hygiene Steam vapor"
                  className="comparison-img"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div
                className="comparison-layer comparison-cold"
                id="comparison-cold"
                style={{
                  clipPath: `inset(0 ${100 - splitPct}% 0 0)`,
                  transition: splitAnimate
                    ? 'clip-path 360ms var(--ease-out)'
                    : 'none',
                }}
              >
                <img
                  src={MEDIA_ASSETS.comparisonCold}
                  alt="Washing machine drum filled with cool EcoBubble micro-foam"
                  className="comparison-img"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div
                className={`comparison-handle${
                  splitPct <= 2 || splitPct >= 98 ? ' is-edge' : ''
                }`}
                id="comparison-handle"
                role="slider"
                tabIndex={0}
                aria-label="Compare EcoBubble Cold Wash and Hygiene Steam"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(splitPct)}
                style={{
                  left: `clamp(22px, ${splitPct}%, calc(100% - 22px))`,
                  transition: splitAnimate
                    ? 'left 360ms var(--ease-out)'
                    : 'none',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft') updateSplit(splitPct - 8, true);
                  if (e.key === 'ArrowRight') updateSplit(splitPct + 8, true);
                }}
              >
                <div className="handle-line" />
                <div className="handle-knob">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 256 256"
                    fill="none"
                    aria-hidden="true"
                  >
                    <polyline
                      points="176 144 208 176 176 208"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="48"
                      y1="176"
                      x2="208"
                      y2="176"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    <polyline
                      points="80 112 48 80 80 48"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="208"
                      y1="80"
                      x2="48"
                      y2="80"
                      stroke="currentColor"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="thermal-copy">
              <p className="section-kicker">Dual-Action Fabric Care</p>
              <h2 className="section-title">EcoBubble cold or Hygiene Steam.</h2>
              <p className="section-sub">
                EcoBubble turns detergent into deep-penetrating foam even at 25°C,
                while Hygiene Steam releases sanitized vapor from the bottom of the
                drum to eliminate 99.9% of common bacteria and allergens.
              </p>

              <div
                className="segmented-control"
                role="tablist"
                aria-label="Wash mode comparison"
              >
                <button
                  type="button"
                  role="tab"
                  className={`seg-btn${splitPct >= 98 ? ' is-active' : ''}`}
                  aria-selected={splitPct >= 98}
                  onClick={() => updateSplit(100, true)}
                >
                  EcoBubble 25°C
                </button>
                <button
                  type="button"
                  role="tab"
                  className={`seg-btn${splitPct <= 2 ? ' is-active' : ''}`}
                  aria-selected={splitPct <= 2}
                  onClick={() => updateSplit(0, true)}
                >
                  Hygiene Steam 60°C
                </button>
              </div>

              <div className="thermal-metrics">
                <div className="metric-item">
                  <span className="metric-value">99.9%</span>
                  <span className="metric-label">Bacteria sanitized</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">45%</span>
                  <span className="metric-label">Faster fabric penetration</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">20 yr</span>
                  <span className="metric-label">Digital Inverter warranty</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Pinned Brand-vs-Brand Scroll-Effect Comparison */}
        <section id="compare" ref={comparePinRef} className="compare-pin">
          <div className="compare-viewport">
            <div className="compare-copy-pane">
              <div className="compare-brand-kicker">
                Brand Comparison · {activeCompareIdx + 1} of {COMPARE_SCROLL_STAGES.length} ·{' '}
                {activeCompareStage.brand}
              </div>

              <div className={compareBlur ? 'showcase-caption is-blurring' : 'showcase-caption'}>
                <h2 className="compare-stage-title">{activeCompareStage.title}</h2>
                <div className="compare-stage-price tabular">
                  <span>{activeCompareStage.price}</span>{' '}
                  <del className="mrp-strike mrp-strike-dark">
                    {activeCompareStage.mrp}
                  </del>{' '}
                  <span className="discount-tag discount-tag-dark">
                    {activeCompareStage.discountPct}% OFF
                  </span>
                </div>
                <div className="compare-stage-emi tabular">
                  Save {formatNpr(activeCompareModel.mrpNpr - activeCompareModel.priceNpr)} at
                  Showroom · 0% EMI {formatNpr(activeCompareModel.emiMonthlyNpr)}/mo
                </div>
                <p className="compare-stage-sub">{activeCompareStage.sub}</p>
                <div className="compare-stage-edge">
                  Standout Edge: {activeCompareStage.badge}
                </div>
              </div>

              <div
                className="compare-brand-tabs"
                role="tablist"
                aria-label="Compare flagship brands"
              >
                {COMPARE_SCROLL_STAGES.map((st, idx) => (
                  <button
                    key={st.modelId}
                    type="button"
                    role="tab"
                    aria-selected={activeCompareIdx === idx}
                    className={`compare-brand-tab${
                      activeCompareIdx === idx ? ' is-active' : ''
                    }`}
                    onClick={() => selectCompareStage(idx)}
                  >
                    {st.brand}
                  </button>
                ))}
              </div>

              <div className="compare-stage-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    addModelToBag(
                      activeCompareModel,
                      activeCompareModel.defaultFinish,
                      'none',
                      0
                    )
                  }
                >
                  Add {activeCompareStage.brand} to Bag
                </button>
                <a href="#compare-matrix" className="btn btn-ghost">
                  Compare Any 2 Models
                </a>
              </div>
            </div>

            <div className="compare-visual-stack">
              {COMPARE_SCROLL_STAGES.map((st, i) => (
                <figure
                  key={st.modelId}
                  ref={(el: HTMLElement | null) => {
                    compareFrameRefs.current[i] = el;
                  }}
                  className={`compare-frame${i === 0 ? ' is-active' : ''}`}
                >
                  <img
                    src={st.src}
                    alt={st.alt}
                    className="compare-frame-img"
                    referrerPolicy="no-referrer"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4.5: Interactive Side-by-Side Model Matrix */}
        <section id="compare-matrix" className="compare-matrix-section">
          <div className="container">
            <p className="section-kicker">Side-by-Side Specification Matrix</p>
            <h2 className="section-title">Compare any two washing machines.</h2>

            <div className="compare-selectors">
              <div className="compare-pick-card">
                <div className="compare-pick-top">
                  <img
                    src={compareModelA.image}
                    alt={compareModelA.name}
                    className="compare-pick-thumb"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="product-card-meta">
                      <span>Model A</span>
                      <span aria-hidden="true">·</span>
                      <span>{compareModelA.sku}</span>
                    </div>
                    <div className="hero-model-name">{compareModelA.name}</div>
                  </div>
                </div>
                <select
                  aria-label="Select first washing machine to compare"
                  className="compare-select"
                  value={compareModelA.id}
                  onChange={(e) => setCompareModelAId(e.target.value)}
                >
                  {ALL_WASHER_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.brandLabel} — {m.shortName} ({formatNpr(m.priceNpr)} · {m.discountPct}% OFF)
                    </option>
                  ))}
                </select>
              </div>

              <div className="compare-pick-card">
                <div className="compare-pick-top">
                  <img
                    src={compareModelB.image}
                    alt={compareModelB.name}
                    className="compare-pick-thumb"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="product-card-meta">
                      <span>Model B</span>
                      <span aria-hidden="true">·</span>
                      <span>{compareModelB.sku}</span>
                    </div>
                    <div className="hero-model-name">{compareModelB.name}</div>
                  </div>
                </div>
                <select
                  aria-label="Select second washing machine to compare"
                  className="compare-select"
                  value={compareModelB.id}
                  onChange={(e) => setCompareModelBId(e.target.value)}
                >
                  {ALL_WASHER_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.brandLabel} — {m.shortName} ({formatNpr(m.priceNpr)} · {m.discountPct}% OFF)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="compare-table-wrap">
              <table className="compare-table">
                <tbody>
                  <tr>
                    <th>Showroom Offer Price</th>
                    <td>
                      <div className="product-offer-line">
                        <strong>{formatNpr(compareModelA.priceNpr)}</strong>
                        <del className="mrp-strike">{formatNpr(compareModelA.mrpNpr)}</del>
                        <span className="discount-tag">{compareModelA.discountPct}% OFF</span>
                      </div>
                    </td>
                    <td>
                      <div className="product-offer-line">
                        <strong>{formatNpr(compareModelB.priceNpr)}</strong>
                        <del className="mrp-strike">{formatNpr(compareModelB.mrpNpr)}</del>
                        <span className="discount-tag">{compareModelB.discountPct}% OFF</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>0% Monthly EMI (12 mo)</th>
                    <td>{formatNpr(compareModelA.emiMonthlyNpr)}/mo</td>
                    <td>{formatNpr(compareModelB.emiMonthlyNpr)}/mo</td>
                  </tr>
                  <tr>
                    <th>Capacity &amp; Load Type</th>
                    <td>
                      {compareModelA.capacity} · {compareModelA.category}
                    </td>
                    <td>
                      {compareModelB.capacity} · {compareModelB.category}
                    </td>
                  </tr>
                  <tr>
                    <th>Max Spin Speed</th>
                    <td>{compareModelA.spinRpm}</td>
                    <td>{compareModelB.spinRpm}</td>
                  </tr>
                  <tr>
                    <th>Wash / Steam System</th>
                    <td>{compareModelA.steamTech}</td>
                    <td>{compareModelB.steamTech}</td>
                  </tr>
                  <tr>
                    <th>Motor Warranty</th>
                    <td>{compareModelA.motorWarranty}</td>
                    <td>{compareModelB.motorWarranty}</td>
                  </tr>
                  <tr>
                    <th>Standout Advantage</th>
                    <td>{compareModelA.standoutEdge}</td>
                    <td>{compareModelB.standoutEdge}</td>
                  </tr>
                  <tr>
                    <th>Quick Order</th>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          addModelToBag(
                            compareModelA,
                            compareModelA.defaultFinish,
                            'none',
                            0
                          )
                        }
                      >
                        Add {compareModelA.brandLabel}
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          addModelToBag(
                            compareModelB,
                            compareModelB.defaultFinish,
                            'none',
                            0
                          )
                        }
                      >
                        Add {compareModelB.brandLabel}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {priceDiff > 0 && (
              <p className="compare-diff-note">
                Price difference: {cheaperModel.name} is{' '}
                <strong>{formatNpr(priceDiff)}</strong> more affordable.
              </p>
            )}
          </div>
        </section>

        {/* SECTION 5: Capacity & Budget Quick Finder */}
        <section id="finder" className="finder-section">
          <div className="container">
            <p className="section-kicker">Smart Washer Finder · All 16 Showroom Models</p>
            <div className="finder-bar">
              <div className="finder-group">
                <span className="finder-label">Household Size / Drum Capacity</span>
                <div className="finder-pills">
                  {(
                    [
                      { id: 'all', label: 'All Sizes' },
                      { id: 'small', label: '1–2 People (7–7.5 kg)' },
                      { id: 'medium', label: '3–4 People (8–9 kg)' },
                      { id: 'large', label: 'Large Family (10–12 kg)' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`finder-btn${familySize === opt.id ? ' is-active' : ''}`}
                      onClick={() => setFamilySize(opt.id)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="finder-group">
                <span className="finder-label">Showroom Budget</span>
                <div className="finder-pills">
                  {(
                    [
                      { id: 'all', label: 'Any Budget' },
                      { id: 'under35', label: 'Under Rs. 35,000' },
                      { id: '35to80', label: 'Rs. 35k – 80k' },
                      { id: 'over80', label: 'Rs. 80,000+' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`finder-btn${budgetFilter === opt.id ? ' is-active' : ''}`}
                      onClick={() => setBudgetFilter(opt.id)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {isFinderActive && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setFamilySize('all');
                    setBudgetFilter('all');
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>

            {isFinderActive && (
              <div>
                <div className="finder-results-head">
                  <span className="hero-model-name tabular">
                    {finderMatches.length} matching{' '}
                    {finderMatches.length === 1 ? 'model' : 'models'} across all brands
                  </span>
                </div>
                {finderMatches.length === 0 ? (
                  <p className="section-sub">
                    No single machine matches both constraints. Try expanding the budget
                    or capacity filter above.
                  </p>
                ) : (
                  <div className="catalog-grid">
                    {finderMatches.map(renderProductCard)}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 6: Dedicated Brand Section — SAMSUNG */}
        <section id="samsung" className="brand-section brand-section-alt">
          <div className="container">
            <div className="brand-section-header">
              <div className="brand-section-copy">
                <p className="section-kicker">{BRAND_SECTIONS[0].kicker}</p>
                <h2 className="section-title">{BRAND_SECTIONS[0].headline}</h2>
                <p className="section-sub">{BRAND_SECTIONS[0].description}</p>
                <div className="brand-highlights-row">
                  {BRAND_SECTIONS[0].highlights.map((h, i) => (
                    <span key={h}>
                      {i > 0 && <span aria-hidden="true"> · </span>}
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="catalog-filters"
                role="tablist"
                aria-label="Filter Samsung washing machine category"
              >
                {SAMSUNG_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={samsungCategory === cat}
                    className={`filter-tab${samsungCategory === cat ? ' is-active' : ''}`}
                    onClick={() => setSamsungCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="catalog-grid">
              {samsungFiltered.map(renderProductCard)}
            </div>
          </div>
        </section>

        {/* SECTION 7: Dedicated Brand Section — HIMSTAR */}
        <section id="himstar" className="brand-section">
          <div className="container">
            <div className="brand-section-header">
              <div className="brand-section-copy">
                <p className="section-kicker">{BRAND_SECTIONS[1].kicker}</p>
                <h2 className="section-title">{BRAND_SECTIONS[1].headline}</h2>
                <p className="section-sub">{BRAND_SECTIONS[1].description}</p>
                <div className="brand-highlights-row">
                  {BRAND_SECTIONS[1].highlights.map((h, i) => (
                    <span key={h}>
                      {i > 0 && <span aria-hidden="true"> · </span>}
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="catalog-grid">
              {ALL_WASHER_MODELS.filter((m) => m.brand === 'himstar').map(
                renderProductCard
              )}
            </div>
          </div>
        </section>

        {/* SECTION 8: Dedicated Brand Section — VIDEOCON */}
        <section id="videocon" className="brand-section brand-section-alt">
          <div className="container">
            <div className="brand-section-header">
              <div className="brand-section-copy">
                <p className="section-kicker">{BRAND_SECTIONS[2].kicker}</p>
                <h2 className="section-title">{BRAND_SECTIONS[2].headline}</h2>
                <p className="section-sub">{BRAND_SECTIONS[2].description}</p>
                <div className="brand-highlights-row">
                  {BRAND_SECTIONS[2].highlights.map((h, i) => (
                    <span key={h}>
                      {i > 0 && <span aria-hidden="true"> · </span>}
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="catalog-grid">
              {ALL_WASHER_MODELS.filter((m) => m.brand === 'videocon').map(
                renderProductCard
              )}
            </div>
          </div>
        </section>

        {/* SECTION 9: Dedicated Brand Section — PANASONIC */}
        <section id="panasonic" className="brand-section">
          <div className="container">
            <div className="brand-section-header">
              <div className="brand-section-copy">
                <p className="section-kicker">{BRAND_SECTIONS[3].kicker}</p>
                <h2 className="section-title">{BRAND_SECTIONS[3].headline}</h2>
                <p className="section-sub">{BRAND_SECTIONS[3].description}</p>
                <div className="brand-highlights-row">
                  {BRAND_SECTIONS[3].highlights.map((h, i) => (
                    <span key={h}>
                      {i > 0 && <span aria-hidden="true"> · </span>}
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="catalog-grid catalog-grid-two">
              {ALL_WASHER_MODELS.filter((m) => m.brand === 'panasonic').map(
                renderProductCard
              )}
            </div>
          </div>
        </section>

        {/* SECTION 10: Precision Hardware Bento */}
        <section id="craft" className="bento-section brand-section-alt">
          <div className="container">
            <div className="section-header-stack">
              <p className="section-kicker">Precision Hardware</p>
              <h2 className="section-title">Engineered for quiet durability.</h2>
            </div>

            <div className="bento-grid" ref={bentoGridRef}>
              <article className="bento-tile bento-tall reveal-tile">
                <img
                  src={MEDIA_ASSETS.bentoDial}
                  alt="Macro view of metallic rotary AI Control dial and digital cycle timer"
                  className="bento-img"
                  referrerPolicy="no-referrer"
                />
                <div className="bento-footer">
                  <h3 className="bento-title">AI Control Dial</h3>
                  <p className="bento-sub">
                    Remembers your favorite cycles and syncs with SmartThings
                  </p>
                </div>
              </article>

              <article className="bento-tile bento-top reveal-tile">
                <img
                  src={MEDIA_ASSETS.bentoEcoBubble}
                  alt="EcoBubble micro-foam gently cushioning garments inside glass drum"
                  className="bento-img"
                  referrerPolicy="no-referrer"
                />
                <div className="bento-footer">
                  <h3 className="bento-title">EcoBubble &amp; Active Foam</h3>
                  <p className="bento-sub">
                    Protects delicate color and texture while cutting energy draw
                  </p>
                </div>
              </article>

              <article className="bento-tile bento-bottom reveal-tile">
                <canvas
                  ref={specsCanvasRef}
                  id="specs-gl-canvas"
                  className="specs-canvas"
                  aria-hidden="true"
                />
                <div className="bento-footer bento-footer-specs">
                  <div>
                    <h3 className="bento-title">Diamond Drum</h3>
                    <p className="bento-sub">1400 RPM Digital &amp; BLDC Inverter</p>
                  </div>
                  <span className="spec-note">Up to 20-Yr Warranty</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* SECTION 11: Multi-Brand Configurator, EMI Tenure, Trade-In Estimator & Delivery Checker */}
        <section id="order" className="order-section">
          <div className="container order-grid">
            <div className="order-preview" id="order-preview">
              <img
                ref={orderImgRef}
                src={configModel.image}
                alt={`${configModel.name} preview`}
                className="order-washer-img"
                id="order-washer-img"
                data-finish={configFinish}
                referrerPolicy="no-referrer"
              />
              <div className="order-preview-caption">
                <span>
                  {configModel.brandLabel} · {configModel.sku}
                </span>
                <span>{FINISH_META[configFinish].name}</span>
              </div>
            </div>

            <div className="order-panel">
              <p className="section-kicker">Configure, Estimate &amp; Order</p>
              <h2 className="section-title">{configModel.name}</h2>
              <div className="order-price-line">
                <span
                  className="order-price tabular"
                  id="order-price"
                  ref={orderPriceRef}
                >
                  {emiMonths > 0
                    ? `${formatNpr(configuredMonthly)}/mo`
                    : formatNpr(configuredNetPrice)}
                </span>
                <del className="mrp-strike">{formatNpr(configModel.mrpNpr)}</del>
                <span className="discount-tag">
                  {configModel.discountPct}% OFF
                  {activeTradeInTier.bonusNpr > 0 ? ' + Trade-In' : ''}
                </span>
                <span className="order-emi-note tabular">
                  {emiMonths > 0
                    ? `${emiMonths} months · Offer Total ${formatNpr(configuredNetPrice)}`
                    : `Save ${formatNpr(configModel.mrpNpr - configuredNetPrice)} · or 0% EMI from ${formatNpr(Math.round(configuredNetPrice / 12))}/mo`}
                </span>
              </div>

              <div className="config-group">
                <span className="config-label">1. Select Brand</span>
                <div className="option-row">
                  {BRAND_SECTIONS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      className={`select-option${
                        configBrand === b.id ? ' is-active' : ''
                      }`}
                      onClick={() => selectConfigBrand(b.id)}
                    >
                      <span>{b.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="config-group">
                <span className="config-label">
                  2. Select {configModel.brandLabel} Model
                </span>
                <div className="option-row">
                  {brandModelsForConfig.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className={`select-option${
                        configModel.id === m.id ? ' is-active' : ''
                      }`}
                      onClick={() => selectConfigModel(m)}
                    >
                      <span>
                        {m.shortName} · {formatNpr(m.priceNpr)} ({m.discountPct}% OFF)
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="config-group">
                <span className="config-label">3. Cabinet Finish</span>
                <div className="option-row">
                  {configModel.availableFinishes.map((fid) => {
                    const meta = FINISH_META[fid];
                    return (
                      <button
                        key={fid}
                        type="button"
                        className={`select-option${
                          configFinish === fid ? ' is-active' : ''
                        }`}
                        onClick={() => setConfigFinish(fid)}
                      >
                        <span
                          className="dot"
                          style={{ background: meta.swatch }}
                        />
                        <span>{meta.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="config-group">
                <span className="config-label">
                  4. Sata-Pata Old Appliance Exchange Estimator
                </span>
                <div className="option-row">
                  {TRADE_IN_TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      className={`select-option${
                        tradeInTierId === tier.id ? ' is-active' : ''
                      }`}
                      onClick={() => {
                        setTradeInTierId(tier.id);
                        animateConfiguratorFeedback(false);
                      }}
                    >
                      <span>
                        {tier.label}
                        {tier.bonusNpr > 0 ? ` (-${formatNpr(tier.bonusNpr)})` : ''}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="config-group">
                <span className="config-label">5. Payment &amp; 0% EMI Tenure</span>
                <div className="option-row">
                  {EMI_TENURES.map((plan) => (
                    <button
                      key={plan.months}
                      type="button"
                      className={`select-option${
                        emiMonths === plan.months ? ' is-active' : ''
                      }`}
                      onClick={() => {
                        setEmiMonths(plan.months);
                        animateConfiguratorFeedback(false);
                      }}
                    >
                      <span>{plan.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="config-group">
                <span className="config-label">
                  6. Delivery &amp; Installation Zone Checker
                </span>
                <div className="delivery-checker-box">
                  <div className="option-row">
                    {DELIVERY_ZONES.map((z) => (
                      <button
                        key={z.id}
                        type="button"
                        className={`finder-btn${
                          deliveryZoneId === z.id ? ' is-active' : ''
                        }`}
                        onClick={() => setDeliveryZoneId(z.id)}
                      >
                        {z.name}
                      </button>
                    ))}
                  </div>
                  <div className="delivery-meta">
                    <span>{activeDeliveryZone.eta}</span>
                    <span>{activeDeliveryZone.feeLabel}</span>
                  </div>
                  <div className="delivery-sub">
                    {activeDeliveryZone.installationNote}
                  </div>
                </div>
              </div>

              <div className="spec-list">
                <div className="spec-row">
                  <span className="spec-key">Brand &amp; Model</span>
                  <span className="spec-val">
                    {configModel.brandLabel} · {configModel.sku}
                  </span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">Capacity</span>
                  <span className="spec-val">{configModel.capacity}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">Spin Speed</span>
                  <span className="spec-val">{configModel.spinRpm}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">Showroom Offer</span>
                  <span className="spec-val">
                    {configModel.discountPct}% OFF (Save{' '}
                    {formatNpr(configModel.mrpNpr - configModel.priceNpr)})
                  </span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">Warranty</span>
                  <span className="spec-val">
                    Official · {configModel.motorWarranty}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-full"
                id="add-to-bag-btn"
                onClick={() =>
                  addModelToBag(
                    configModel,
                    configFinish,
                    tradeInTierId,
                    emiMonths
                  )
                }
              >
                Add to Bag — {formatNpr(configuredNetPrice)}
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 12: Verified Kathmandu Valley Buyer Proof */}
        <section className="proof-section">
          <div className="container">
            <p className="section-kicker">
              Samakhushi Showroom · Verified Valley Installations
            </p>
            <h2 className="section-title">Trusted by Kathmandu households.</h2>

            <div className="proof-grid">
              {LOCAL_TESTIMONIALS.map((item) => (
                <article key={item.author} className="proof-card">
                  <p className="proof-quote">“{item.quote}”</p>
                  <div>
                    <div className="proof-author">{item.author}</div>
                    <div className="proof-meta">
                      {item.location} · {item.model}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        {/* SECTION 13: Kathmandu & Nepal Washing Machine Buying Guide (AEO FAQ) */}
        <section id="faq" className="faq-section">
          <div className="container faq-layout">
            <div>
              <p className="section-kicker">Nepal &amp; Kathmandu Buyer Guide</p>
              <h2 className="section-title">Washing Machine Answers for Kathmandu.</h2>
              <p className="section-sub">
                Direct answers on hard-water descaling, tanker vs. overhead-tank pressure,
                non-credit-card 0% EMI documents, and free Sata-Pata old appliance pickup.
              </p>
              <div className="faq-side-note">
                Showroom Support: Visit Join Electronic Center at{' '}
                <strong>Samakhushi Chowk (Tokha Road), Kathmandu</strong> (Sun–Fri, 10:00
                AM – 7:30 PM) or message WhatsApp{' '}
                <a
                  href={`https://wa.me/${JEC_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="faq-action-link"
                >
                  +977 9851045662
                </a>
                .
              </div>
            </div>

            <div className="faq-list" role="region" aria-label="Frequently asked washing machine questions in Nepal">
              {KATHMANDU_FAQS.map((item) => {
                const isOpen = openFaqId === item.id;
                return (
                  <article
                    key={item.id}
                    className={`faq-item${isOpen ? ' is-open' : ''}`}
                  >
                    <button
                      type="button"
                      className="faq-trigger"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${item.id}`}
                      onClick={() =>
                        setOpenFaqId((prev) => (prev === item.id ? '' : item.id))
                      }
                    >
                      <span>{item.question}</span>
                      <svg
                        className="faq-chevron"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <div
                      id={`faq-panel-${item.id}`}
                      className="faq-panel"
                    >
                      <div className="faq-panel-inner">
                        <div className="faq-answer">
                          <p>{item.answer}</p>
                          {item.actionLabel && item.actionHref && (
                            <a href={item.actionHref} className="faq-action-link">
                              {item.actionLabel} →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span className="footer-brand">Join Electronic Center</span>
          <span>
            Samakhushi Chowk (Tokha Road), Kathmandu · Samsung, Himstar, Videocon &amp;
            Panasonic
          </span>
          <div className="footer-links">
            <a href="/sitemap.xml">Sitemap</a>
            <span aria-hidden="true">·</span>
            <a href="/llms.txt">llms.txt</a>
            <span aria-hidden="true">·</span>
            <a
              href={`https://wa.me/${JEC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp +977 9851045662
            </a>
          </div>
        </div>
      </footer>

      {/* Persistent Quick-Buy Bar */}
      <div
        className="quick-buy-bar"
        hidden={!showQuickBar || quickBarDismissed || drawerOpen}
      >
        <div className="container quick-buy-inner">
          <div className="quick-buy-info">
            <span className="quick-buy-name">{configModel.name}</span>
            <span className="quick-buy-price">
              {formatNpr(configuredNetPrice)}
            </span>
            <del className="mrp-strike quick-buy-whatsapp">
              {formatNpr(configModel.mrpNpr)}
            </del>
            <span className="discount-tag">{configModel.discountPct}% OFF</span>
          </div>
          <div className="quick-buy-actions">
            <a
              href={`https://wa.me/${JEC_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Namaste Join Electronic Center! I am interested in ${configModel.name} (${configModel.sku}) at ${formatNpr(configuredNetPrice)}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm quick-buy-whatsapp"
            >
              WhatsApp
            </a>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() =>
                addModelToBag(
                  configModel,
                  configFinish,
                  tradeInTierId,
                  emiMonths
                )
              }
            >
              Add to Bag
            </button>
            <button
              type="button"
              className="quick-dismiss-btn"
              aria-label="Hide quick buy bar"
              onClick={() => setQuickBarDismissed(true)}
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* Slide-Over Shopping Bag & Sales Checkout Drawer */}
      <div
        className="drawer-backdrop"
        id="drawer-backdrop"
        hidden={!drawerOpen}
        onClick={() => setDrawerOpen(false)}
      />
      <aside
        className="bag-drawer"
        id="bag-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        hidden={!drawerOpen}
      >
        <div className="drawer-header">
          <h2 id="drawer-title" className="drawer-title">
            Your Order Bag
          </h2>
          <button
            type="button"
            className="icon-btn"
            id="drawer-close"
            aria-label="Close bag"
            onClick={() => setDrawerOpen(false)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 256 256"
              fill="none"
              aria-hidden="true"
            >
              <line
                x1="200"
                y1="56"
                x2="56"
                y2="200"
                stroke="currentColor"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <line
                x1="200"
                y1="200"
                x2="56"
                y2="56"
                stroke="currentColor"
                strokeWidth="20"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="drawer-body" id="drawer-body">
          {receipt ? (
            <div className="order-receipt">
              <div className="receipt-id">{receipt.orderId} · Confirmed</div>
              <h3 className="receipt-title">Thank you, {receipt.customerName}</h3>
              <p className="receipt-detail">
                Your order for {receipt.itemCount} washing{' '}
                {receipt.itemCount === 1 ? 'machine' : 'machines'} totaling{' '}
                <strong>{formatNpr(receipt.totalNpr)}</strong> ({receipt.paymentMethod})
                has been scheduled for dispatch from Join Electronic Center,
                Samakhushi.
              </p>
              <p className="receipt-detail">
                Zone: {receipt.zoneName} · Address: {receipt.address} · Contact:{' '}
                {receipt.phone}
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setReceipt(null);
                  setDrawerOpen(false);
                }}
              >
                Continue Browsing
              </button>
            </div>
          ) : bag.length === 0 ? (
            <div className="drawer-empty" id="drawer-empty">
              <p>Your bag is currently empty.</p>
              <a
                href="#samsung"
                className="btn btn-primary btn-sm"
                onClick={() => setDrawerOpen(false)}
              >
                Browse Washing Machines
              </a>
            </div>
          ) : (
            <>
              <div className="drawer-items" id="drawer-items">
                {bag.map((item, idx) => (
                  <div
                    key={`${item.modelId}-${item.finish}-${item.tradeInLabel}-${item.emiLabel}`}
                    className="bag-item"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="bag-item-thumb"
                      referrerPolicy="no-referrer"
                    />
                    <div className="bag-item-info">
                      <div className="bag-item-name">{item.name}</div>
                      <div className="bag-item-meta">
                        {item.brandLabel} · {item.sku} · {FINISH_META[item.finish].name}
                        {item.tradeInLabel ? ` · ${item.tradeInLabel}` : ''}
                        {` · ${item.emiLabel}`}
                      </div>
                      <div className="bag-item-price tabular">
                        <span>{formatNpr(item.unitPrice * item.qty)}</span>{' '}
                        <del className="mrp-strike">
                          {formatNpr(item.mrpNpr * item.qty)}
                        </del>{' '}
                        <span className="discount-tag">{item.discountPct}% OFF</span>
                      </div>
                      <div className="bag-qty-row">
                        <button
                          type="button"
                          className="qty-btn"
                          aria-label="Decrease quantity"
                          onClick={() => updateBagQty(idx, -1)}
                        >
                          -
                        </button>
                        <span className="bag-qty">{item.qty}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          aria-label="Increase quantity"
                          onClick={() => updateBagQty(idx, 1)}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() => removeBagItem(idx)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {checkoutOpen && (
                <form
                  id="checkout-form"
                  className="checkout-form"
                  onSubmit={handlePlaceOrder}
                >
                  <div className="checkout-heading">Delivery &amp; Verification</div>
                  <label className="field-label">
                    Full Name
                    <input
                      type="text"
                      className="field-input"
                      placeholder="e.g. Aarav Shrestha"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </label>
                  <label className="field-label">
                    Mobile Number
                    <input
                      type="tel"
                      className="field-input"
                      placeholder="+977 98XXXXXXXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </label>
                  <label className="field-label">
                    Delivery Address ({activeDeliveryZone.name})
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Street, Ward, Kathmandu / Lalitpur"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                    />
                  </label>
                  <label className="field-label">
                    Payment Method
                    <select
                      className="field-input"
                      value={checkoutPayment}
                      onChange={(e) => setCheckoutPayment(e.target.value)}
                    >
                      <option value="Cash on Delivery">
                        Cash on Delivery (Kathmandu Valley)
                      </option>
                      <option value="0% EMI Bank Card">0% EMI Bank Installment</option>
                      <option value="Fonepay / Bank Transfer">
                        Fonepay / Bank Transfer
                      </option>
                    </select>
                  </label>
                  {formError && <p className="form-error">{formError}</p>}
                  <button type="submit" className="btn btn-primary btn-full">
                    Confirm Order — {formatNpr(totalPayable)}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {bag.length > 0 && !receipt && (
          <div className="drawer-footer" id="drawer-footer">
            <div className="drawer-summary-rows">
              {totalOfferSaved > 0 && (
                <div className="drawer-summary-row">
                  <span>Showroom Offer Discount</span>
                  <span>-{formatNpr(totalOfferSaved)}</span>
                </div>
              )}
              <div className="drawer-summary-row">
                <span>{activeDeliveryZone.name}</span>
                <span>{activeDeliveryZone.feeLabel}</span>
              </div>
              {totalTradeInSaved > 0 && (
                <div className="drawer-summary-row">
                  <span>Sata-Pata Trade-In Bonus</span>
                  <span>-{formatNpr(totalTradeInSaved)}</span>
                </div>
              )}
              <div className="drawer-summary-row">
                <span>Est. 0% EMI (12 mo)</span>
                <span>{formatNpr(Math.round(totalPayable / 12))}/mo</span>
              </div>
            </div>

            <div className="drawer-total-row">
              <span>Total Payable</span>
              <span className="drawer-total" id="drawer-total">
                {formatNpr(totalPayable)}
              </span>
            </div>

            <div className="drawer-actions-stack">
              {!checkoutOpen && (
                <button
                  type="button"
                  className="btn btn-primary btn-full"
                  id="proceed-checkout-btn"
                  onClick={() => setCheckoutOpen(true)}
                >
                  Proceed to Checkout
                </button>
              )}
              <a
                href={buildWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-full"
              >
                Order via Join Electronic WhatsApp
              </a>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
