# AI School (آکادمی هوش مصنوعی) - Implementation Plan

An enterprise-grade educational platform and digital package marketplace for AI video masterclasses (~3 hours per module), featuring one-time purchase models, a secure browser-based video player with dynamic anti-leak watermarking and tokenized access, simulated dual-currency checkout (IRR / USD via Stripe & Rial gateways), an automated invoice/receipt generator, a user learning library ("کتابخانه من"), and an administrative control panel.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following choices were confirmed in Phase 1 clarification and govern the implementation:

- **Language & Direction**: Bilingual system with an instant top-level toggle between Persian (RTL with Persian typography and numerals) and English (LTR).
- **Payment & Checkout Simulation**: Fully interactive simulated gateways for both Iranian Rial (Shetab/ZarinPal style with card credentials and dynamic OTP simulation) and US Dollar (Stripe checkout simulation with card elements, auto-conversion, and instant downloadable/email-viewable PDF/HTML tax-compliant invoices).
- **Secure Player Watermark**: Dynamic, floating watermark displaying the authenticated user's email, session hash, and real-time changing timestamp drifting across random coordinates at dynamic intervals (e.g., every 8–12 seconds) to deter screen capture and leak attribution without obstructing pedagogical diagrams.
- **Access Control & DRM Strategy**: Token-based streaming simulation with short-lived session tickets (15-minute rotation), preventing hotlinking and direct MP4 downloads, accompanied by full DRM architecture documentation (Widevine/FairPlay key exchange model) in the system view.

---

## 1. Overview & Core Concept

- **What It Does**: AI School provides a complete end-to-end learning commerce experience:
  1. **Course Catalog & Packages**: Browse comprehensive AI deep-dives (e.g., "Mastering LLMs & Agentic Workflows", "Generative Vision & Diffusion Architectures", "Fullstack AI Systems Engineering"), featuring course syllabi, ~3-hour video chapters, downloadable resources, and package bundles.
  2. **Dual-Currency Purchase Flow**: One-time checkout supporting Toman/Rial and USD ($) with currency auto-switching, tax estimation, coupon validation, and simulated payment processing.
  3. **Protected Learning Library ("کتابخانه من")**: User portal listing enrolled courses, playback resume markers, completion percentages, certificate previews, and access to the video classroom.
  4. **Hardened Web Video Player**: Custom HTML5 media engine with floating anti-leak watermarking, keyboard shortcuts, playback speed controls (0.75x–2.0x), chapter markers, picture-in-picture, token health indicators, and disabled context menus/hotlink inspection.
  5. **Admin Management Console**: Dedicated dashboard to manage courses and digital packages, inspect orders and revenue analytics (split by Rial/USD), review registered learners, grant or revoke course access, and audit player session tokens.
- **Target Audience / Persona**: B2C software engineers, data scientists, designers, and tech enthusiasts seeking rigorous 3-hour masterclasses in modern AI engineering.
- **Key Value**: Premium, trusted educational experience bridging domestic (Rial) and international (USD) learners with uncompromised content security and high pedagogical clarity.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Discovery & Exploration**:
   - Learner visits catalog landing page -> filters by track (LLMs, Computer Vision, Agentic Workflows, Digital Bundles) -> views pricing in selected currency (IRR / USD).
   - Learner inspects course syllabus: 3-hour runtime breakdown into logical 15–30 min modules, instructor credentials, preview teaser, and included downloadable assets.
2. **Checkout & Purchase Flow**:
   - Learner clicks "Enroll Now / ثبت‌نام در دوره" -> enters guest/account details.
   - Selects Gateway: **Iranian Gateway (شاپرک / زرین‌پال)** or **International Gateway (Stripe / دلاری‌شو)**.
   - Submits payment in the interactive gateway modal with live validation -> redirected to Order Confirmation with order ID, instant invoice view, and "Go to My Library" action.
3. **Classroom & Protected Player Flow**:
   - Enrolled user opens "My Library" -> clicks "Continue Watching / ادامه یادگیری".
   - Classroom loads video player with rotating token. A translucent watermark containing user email (`farzadmahjor1386@gmail.com`), IP hash, and timestamp smoothly transitions across viewport coordinates.
   - User navigates chapters, notes key takeaways, marks modules complete, and resumes playback where they left off.
4. **Admin Operations**:
   - Admin switches to "Admin Console / پنل مدیریت" -> views high-level metrics (Total Revenue in IRR & USD, Active Learners, Video Streaming Hours).
   - Creates/edits courses and video packages (titles, descriptions, pricing in both currencies, chapter lists, access status).
   - Audits order ledger and manually manages learner enrollments.

### Visual Identity & Theme

- **Aesthetic Direction**: Modern technical editorial / high-performance educational workspace. Crisp dark-slate canvas paired with subtle slate surface contrast, hairline borders, and cyan/indigo focal accents.
- **Color Palette (60-30-10 discipline)**:
  - *Canvas (60%)*: Deep Obsidian Slate (`#090D16` / `#0F172A`) for dark mode classroom, and crisp clinical off-white (`#F8FAFC`) in light mode.
  - *Structural Surfaces (30%)*: Hairline bordered cards (`#1E293B` / `#E2E8F0`), flat single-elevation panels, subtle divider lines.
  - *Focal Accents (10%)*: Electric Cobalt (`#3B82F6`) & Cyan (`#06B6D4`) for active primary actions and playback scrubber, with Emerald (`#10B981`) for completed badges/paid receipts and Amber (`#F59E0B`) for session security alerts.
- **Typography & Font Strategy**:
  - *Persian (RTL)*: `Vazirmatn` / system Persian sans-serif with proper typographic ligatures and Persian numerals (`۱۲۳۴۵۶۷۸۹۰`) in Persian mode.
  - *Latin (LTR)*: `Plus Jakarta Sans` for display headlines and interface labels, paired with `JetBrains Mono` / tabular numerals (`tabular-nums`) for currency amounts, runtimes, timestamps, and order IDs.
  - *Anti-Slop Discipline*: Zero decorative pill tags on cards; clean unboxed inline metadata (`3.2 hrs · 8 Modules · Intermediate`); strict 3-zone top bar contract.

### Interactive Feedback & Motion

- Fluid chapter transitions with instant playback seek.
- Drifting watermark animation utilizing subtle cubic-bezier easing (`opacity-25` to `opacity-40`) to remain tamper-evident without distracting the student.
- Currency toggle with smooth state updates across all product cards and cart calculations.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Modular Client-Side Store with LocalStorage Persistence**:
  - *Chosen Approach*: Implement a centralized, modular reactive store (Courses, User/Auth, Orders/Payments, and DRM/Tokens) persisted to `localStorage` with rich preloaded seed data.
  - *Why*: Enables instant zero-latency demonstration of all user roles (learner purchase, library playback, admin course creation, order reconciliation) in the AI Studio environment without requiring external database provisioning upfront.
  - *Alternatives Considered*: Cloud SQL or Firestore was considered; however, client-first architecture allows immediate testing while remaining 100% architecturally modular for PostgreSQL export.
- **Decision 2: Player Security Simulation & Watermarking**:
  - *Chosen Approach*: Custom video engine overlaying dynamic canvas/SVG floating coordinates with encrypted session tokens, disabled right-click context menu, disabled keyboard shortcuts for inspect/save, and HLS/DASH manifest simulator.
  - *Why*: While browser-level DRM (Widevine/FairPlay) requires licensed CDM server modules, a dynamic forensic watermark combined with short-lived token rotation is the industry standard for deterring unauthorized redistribution and screen recording.
- **Decision 3: Dual-Currency Architecture**:
  - *Chosen Approach*: Store fixed canonical prices in both Toman/IRR and USD for each course/package, supporting custom localized discount codes and tax rules per gateway.
  - *Why*: Prevents volatile FX swings from mispricing courses in either domestic or foreign markets.

---

## 4. Technical Architecture & Data Strategy

### System Architecture & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              AI School App                             │
│                  (RTL/LTR Provider & Language Switcher)                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                                                               ▼
┌──────────────────────────────┐              ┌─────────────────────────────────┐
│     Learner Storefront       │              │     Admin Operations Console    │
│  - TopBar (3-Zone Contract)  │              │  - Analytics & Revenue Overview │
│  - Hero Masterclass Spotlight│              │  - Course & Bundle Manager      │
│  - Course Grid & Track Filter│              │  - Order Ledger & Audit Log     │
│  - Course Detail & Syllabus  │              │  - User Enrollment Permissions  │
└──────────────┬───────────────┘              └─────────────────────────────────┘
               │
    ┌──────────┴───────────────────────────────┐
    ▼                                          ▼
┌──────────────────────────────┐ ┌──────────────────────────────────────────────┐
│  Dual-Currency Checkout Modal│ │  Secure Classroom & Protected Player         │
│  - Rial Gateway (ZarinPal)   │ │  - Dynamic Floating Watermark (Email/Time)   │
│  - USD Gateway (Stripe UI)   │ │  - Short-Lived Stream Token Validator        │
│  - Automated Invoice/Receipt │ │  - Chapter Navigation & Progress Resume      │
└──────────────┬───────────────┘ │  - Notes & Downloadable Syllabus Attachments │
               │                 └──────────────────────────────────────────────┘
               ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                           Modular Data Store Layer                            │
│  - CourseStore: Modules, 3-hr video metadata, bundles, pricing (IRR/USD)      │
│  - AuthStore: Authenticated learner / Admin role, session key                 │
│  - OrderStore: Order IDs, currency, invoice generator, tax calculator         │
│  - StreamSecurityStore: Token rotation timer (15m), forensic watermark seed   │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & Entities

```typescript
interface Course {
  id: string;
  title: { fa: string; en: string };
  slug: string;
  category: 'llm' | 'vision' | 'agents' | 'infra';
  description: { fa: string; en: string };
  instructor: { name: string; title: string; avatar: string };
  totalDurationSeconds: number; // ~10,800s (3 hours)
  priceIRR: number; // e.g., 2,800,000 Tomans
  priceUSD: number; // e.g., $49
  thumbnail: string;
  chapters: Chapter[];
  isBundle?: boolean;
  includedCourseIds?: string[];
  enrolledUserIds: string[];
}

interface Chapter {
  id: string;
  title: { fa: string; en: string };
  durationSeconds: number;
  videoUrl: string; // Protected stream source
  summary: { fa: string; en: string };
  resources: { name: string; size: string }[];
}

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: { courseId: string; title: string; price: number }[];
  currency: 'IRR' | 'USD';
  subtotal: number;
  tax: number;
  total: number;
  gateway: 'zarinpal' | 'stripe';
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  transactionRef: string;
}

interface SecuritySession {
  userId: string;
  userEmail: string;
  clientIpHash: string;
  sessionToken: string;
  tokenExpiresAt: number;
  watermarkCoords: { x: number; y: number };
}
```

### Component & State Mapping

1. `TopNavigation`: Clean 3-zone header with Brand ("AI School"), Navigation links ("Courses", "Packages", "My Library"), and Currency/Language switchers + Auth CTA.
2. `CourseCatalog`: Filterable track tabs (`All`, `LLMs`, `Vision`, `Agents`, `Bundles`), search input, and course cards with unboxed metadata and dual pricing.
3. `CourseDetailsModal`: Deep-dive into curriculum with full 3-hour breakdown, instructor dossier, and checkout trigger.
4. `CheckoutModal`: Dual-tab gateway simulator (Rial Shetab / Stripe) with simulated card entry, coupon application, validation, and instantaneous receipt generation with printable invoice.
5. `SecureVideoPlayer`: Custom video container with canvas/DOM floating anti-piracy watermark, scrubbing bar, speed toggles, chapter progress tracking, and security status modal.
6. `MyLibraryView`: Shows purchased courses with progress bars, "Resume Chapter" buttons, and completion certificates.
7. `AdminDashboard`: Tabbed manager for Courses (Create/Edit), Orders (Filter & refund), and Users (Grant access).

---

## 5. Verification & Testing Plan

1. **Language & RTL Verification**:
   - Toggle between Persian and English: verify correct text alignment, RTL layout flip, and localized currency symbols (`تومان` vs `$`).
2. **Dual-Currency Payment Checkout**:
   - Test purchasing a course in IRR via the Rial gateway: confirm order creation, stock access grant, and receipt display.
   - Test purchasing a course in USD via Stripe gateway: confirm card validation and currency ledger reflection in the admin panel.
3. **Player Security & Watermarking**:
   - Open any enrolled course in the classroom: verify floating dynamic watermark displays user email, IP, and time, smoothly updating position.
   - Verify right-click is prevented on the player frame.
4. **Admin Operations**:
   - Create a new 3-hour course or bundle: verify it immediately appears in the catalog in both languages and currencies.
   - Inspect Orders tab to confirm real-time accounting of IRR and USD transactions.
5. **Compilation & Build**:
   - Run `compile_applet` to ensure TypeScript types, Tailwind CSS, and React components build cleanly with zero errors.
