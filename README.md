# 🎓 AI School

**A modular online learning platform designed for secure course delivery, video streaming, and scalable growth.**

AI School is an educational platform project focused on providing a structured learning experience, from user registration and course discovery to purchasing courses and watching lessons.

The project is being designed with a modular architecture so new features can be introduced without rewriting the entire application.

> **Project status:** MVP planning and early development. The architecture and technologies described below represent the proposed direction and are not claims that all features have been implemented.

## 📌 Project Goals

* Provide a clear and responsive learning experience.
* Support user registration, authentication, and account management.
* Organize courses into sections and lessons.
* Support course purchases and payment verification.
* Restrict course content to authorized users.
* Deliver videos through private, controlled streaming.
* Track lesson progress and viewing sessions.
* Provide an administrative dashboard for managing the platform.
* Maintain a modular foundation for future features such as subscriptions, discounts, and advanced analytics.

## ✨ Planned Features

### 👤 User Experience

* User registration and login
* Course catalog and course details
* Course purchasing
* User dashboard
* Purchased courses and learning history
* Video lesson player
* Watch progress and resume playback

### ⚙️ Backend and API

* Authentication and session management
* User and role management
* Course, section, and lesson management
* Order and payment processing
* Course enrollment and access control
* Secure playback authorization
* Viewing progress and session tracking
* Administrative APIs

**Security principle:** Authorization must be enforced on the server. Hiding a button or page in the frontend is not sufficient to protect course content.

### 🎬 Video Delivery

The planned video system will use private storage and controlled streaming rather than exposing permanent public video URLs.

Planned capabilities include:

* HLS or MPEG-DASH adaptive streaming
* Multiple video resolutions
* Video processing with FFmpeg or a managed video service
* Short-lived playback tokens
* Server-side entitlement checks before playback
* Private-content-compatible CDN delivery
* User-specific, potentially moving watermarks
* Concurrent-session limits and suspicious-session revocation
* Optional DRM integration, depending on the selected provider and platform requirements

No web-based video platform can guarantee complete prevention of copying or screen recording. The goal is to reduce unauthorized access and redistribution, not to promise perfect copy protection.

## 🏗️ Proposed Architecture

AI School will use a **modular monolithic backend** for the initial architecture.

Instead of splitting the system into microservices from the beginning, related responsibilities will live in separate backend modules within a single application. This keeps development and deployment simpler while preserving clear boundaries between features.

### High-Level Request Flow

```text
User
  |
  v
Next.js Frontend
  |
  v
Backend API
  |
  +---- Authentication & Users
  +---- Courses & Lessons
  +---- Orders & Payments
  +---- Enrollment & Access Control
  +---- Video & Playback
  +---- Administration
  |
  +---- PostgreSQL
  +---- Redis (cache / queues)
  +---- Private Object Storage
              |
              v
       Video Processing
              |
              v
       Private Video Streaming
```

### Frontend

**Proposed technology:** Next.js, React, and TypeScript.

Main pages:

* Home and course catalog
* Registration and login
* Course details
* Checkout and purchase status
* User dashboard
* Purchased courses
* Video lesson player
* Administrative dashboard

The frontend is responsible for presentation and user interaction. Sensitive authorization decisions remain on the backend.

### Backend

**Proposed options:** NestJS or Laravel. The final framework is not yet selected.

Planned modules:

| Module         | Responsibility                                            |
| -------------- | --------------------------------------------------------- |
| Authentication | Login, registration, sessions, and identity               |
| Users          | User profiles and account management                      |
| Courses        | Courses, sections, and lessons                            |
| Orders         | Purchase lifecycle and order status                       |
| Payments       | Payment initiation and transaction verification           |
| Access Control | Enrollment and lesson permissions                         |
| Video          | Assets, playback authorization, and streaming integration |
| Progress       | Watch progress and resume position                        |
| Administration | Content management, users, reports, and audit logs        |

Modules should have clear responsibilities and communicate through defined interfaces. Microservices are not required for the MVP.

## 🗄️ Database Design

**Proposed database:** PostgreSQL.

The initial data model will separate user accounts, financial transactions, course access, and video assets.

| Table / Entity   | Purpose                                              |
| ---------------- | ---------------------------------------------------- |
| `Users`          | User accounts and profile data                       |
| `Courses`        | Course information and publication status            |
| `CourseSections` | Course chapters or sections                          |
| `Lessons`        | Individual lessons and their order                   |
| `Orders`         | Purchase records and order status                    |
| `Payments`       | Payment attempts and transaction references          |
| `Enrollments`    | Users' access to purchased courses                   |
| `VideoAssets`    | Private video asset and processing metadata          |
| `WatchProgress`  | Lesson progress and resume position                  |
| `Sessions`       | Active login or viewing sessions                     |
| `Admins`         | Administrative accounts, if kept separate from users |
| `Roles`          | Administrative and other permission roles            |

The final schema may change during implementation. Relationships, unique constraints, indexes, transaction boundaries, and permission checks must be defined before the corresponding features are released.

Separating orders, payments, and enrollments will make it easier to support subscriptions, discounts, refunds, and additional purchase models later.

## 🔐 Security and Content Protection

Security will be designed into the application rather than added as a final step.

### Authentication and Authorization

* Validate permissions on every protected backend operation.
* Verify course enrollment before granting lesson access.
* Never trust frontend state as proof of payment or ownership.
* Store session credentials and secrets securely.
* Apply rate limits to sensitive endpoints.
* Record relevant security events and administrative actions.

### Payment Verification

The backend must independently verify payment results with the payment provider before granting course access.

A browser redirect or a client-side success message is not sufficient evidence of a successful payment. Payment callbacks and retries must be handled safely to avoid duplicate transactions or duplicate enrollment records.

### Video Security

* Store original videos in private object storage.
* Avoid permanent public video URLs.
* Issue short-lived playback authorization.
* Validate access before issuing playback credentials.
* Use a CDN and signed requests or tokens supported by the chosen provider.
* Track viewing sessions and support revocation where technically possible.
* Consider moving watermarks and DRM for higher-value content.

HLS and MPEG-DASH segment encryption, signed delivery, watermarks, and DRM have different security properties. The final implementation will depend on the selected streaming infrastructure and compatibility requirements.

## 🔄 Planned Purchase-to-Playback Flow

1. A user registers or logs in.
2. The user browses courses and opens a course details page.
3. The user starts a purchase.
4. The backend creates an order and initiates payment.
5. The payment provider returns a result or sends a callback.
6. The backend verifies the transaction independently.
7. After successful verification, course access is granted.
8. The user opens a lesson.
9. The backend checks authentication and course permissions.
10. The backend issues short-lived playback authorization.
11. The player retrieves the video through the configured streaming service.
12. Watch progress and relevant session information are recorded.
13. Expired tokens or revoked permissions prevent subsequent authorized playback requests.

## 🛠️ Proposed Technology Stack

| Layer                | Proposed Technology                              |
| -------------------- | ------------------------------------------------ |
| Frontend             | Next.js, React, TypeScript                       |
| Backend              | NestJS or Laravel — decision pending             |
| Database             | PostgreSQL                                       |
| Cache and job queues | Redis, when required                             |
| Video processing     | FFmpeg or a managed video service                |
| Video storage        | Private object storage                           |
| Streaming            | HLS or MPEG-DASH                                 |
| Player               | Video.js or Shaka Player                         |
| Delivery             | Compatible CDN and signed playback authorization |
| Deployment           | Docker                                           |
| Automation           | CI/CD pipeline                                   |

These are proposed technologies, not a finalized implementation. Provider selection, operating costs, hosting constraints, and integration requirements will inform the final decisions.

## 🖥️ Administration

The planned admin panel will support:

* Course, section, and lesson management
* Video uploads and processing status
* User and enrollment management
* Order and payment inspection
* Sales reporting
* Access revocation
* Suspicious activity review
* Security and administrative audit logs

Administrative actions must be protected by server-side role and permission checks.

## 🚀 Development Roadmap

The work will be divided into incremental milestones:

1. **Architecture and foundations** — repository structure, framework selection, configuration, and database design.
2. **Authentication and users** — registration, login, sessions, and authorization foundations.
3. **Course management** — courses, sections, lessons, and catalog pages.
4. **Orders and payments** — order lifecycle, payment verification, and enrollment.
5. **Video delivery** — private storage, processing, playback authorization, and the player.
6. **Learning experience** — purchased courses, progress tracking, and resume playback.
7. **Administration** — content management, reporting, and audit logs.
8. **Production readiness** — automated tests, security review, monitoring, backups, deployment, and CI/CD.

Each milestone should deliver a testable result before the next layer is added. Features will be marked complete only after implementation and verification.

## 🤝 Contributing

Contributions, suggestions, and constructive feedback are welcome.

Before contributing:

1. Review the project documentation.
2. Discuss significant architectural changes before implementing them.
3. Keep modules focused on their defined responsibilities.
4. Include tests for important business rules and security-sensitive behavior.
5. Never commit passwords, API keys, payment secrets, or other credentials.

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 👥 Our Team

<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/knowmebyfarzad">
        <img src="https://github.com/knowmebyfarzad.png" width="120" alt="Farzad Mahjour" />
        <br />
        <strong>Farzad Mahjour</strong>
      </a>
      <br />
      <a href="https://t.me/knowmebyfarzad">Telegram</a>
    </td>
    <td align="center">
      <a href="https://github.com/iliaxp">
        <img src="https://github.com/iliaxp.png" width="120" alt="Mahdi Zare" />
        <br />
        <strong>Mahdi Zare</strong>
      </a>
      <br />
      <a href="https://t.me/ilidark">Telegram</a>
    </td>
  </tr>
</table>

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
