# 🛡️ Security Policy — Spidy Calculator

The **Spidy Calculator** team takes the security of our application, mathematical integrity, and user privacy seriously. This policy outlines our supported versions, security architecture, and how to responsibly report vulnerabilities.

---

## 📦 Supported Versions

We actively provide security patches and vulnerability updates for the current production release deployed on the `main` branch.

| Version / Branch | Supported          | Status                                 |
| ---------------- | ------------------ | -------------------------------------- |
| `main` (Latest)  | :white_check_mark: | Actively supported (Continuous Deploy) |
| `< 1.0`          | :x:                | Deprecated / Unsupported               |

---

## 🔒 Security Architecture & Guarantees

Spidy Calculator is engineered with client-side isolation and privacy-first principles:

1. **Zero Server Math (`eval()`-Free)**:
   - All arithmetic, scientific functions, and suite calculations execute purely on the client side using pure TypeScript state machines without `eval()`, `Function()`, or dynamic code execution.
2. **Client-Side Data Isolation**:
   - Calculation history (Case Files) and audio preferences are stored exclusively in the user's browser `localStorage`. No user calculations, form data, or telemetry are collected or transmitted to backend servers.
3. **PWA & Offline Integrity**:
   - The Progressive Web App service worker (`sw.js`) caches only first-party app-shell assets and strictly follows same-origin policies.
4. **Input Sanitization & Overflow Protection**:
   - All inputs across algebraic solvers, fraction engines, and unit converters enforce strict type validation to prevent script injection and numerical overflow vulnerabilities.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or potential threat in Spidy Calculator, **please do not disclose it publicly** through GitHub Issues, public discussions, or social media. Instead, please follow our responsible disclosure process:

### How to Report Privately

1. **GitHub Security Advisory (Recommended)**:
   - Navigate to the [Security Advisories](https://github.com/VARA4u-tech/spidy-calculator/security/advisories) tab on our GitHub repository.
   - Click **"Report a vulnerability"** to submit a private, encrypted vulnerability report directly to the maintainers.

2. **Direct Email Disclosure**:
   - Send an email to the project maintainer:
     📧 **`durgavaraprasadpappuri13@gmail.com`**
   - Subject line: `[SECURITY] Vulnerability Report — Spidy Calculator`.

### What to Include in Your Report

To help us investigate and resolve the issue quickly, please provide:

- A clear description of the vulnerability and its potential impact.
- Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
- The affected environment details (Browser, OS version, Device type).
- Any suggested fixes or mitigation strategies, if known.

---

## ⏱️ Response & Triage Timeline

- **Initial Acknowledgment**: Within **48 hours** of receiving your report.
- **Triage & Assessment**: Within **3 to 5 business days**, confirming whether the vulnerability is accepted or declined with rationale.
- **Patch & Deployment**: Verified fixes are prioritized and immediately deployed to `main` and production at [https://spidy-calculator.vercel.app](https://spidy-calculator.vercel.app).
- **Attribution & Credit**: Upon public release of the fix, we will gladly credit you in release notes and commit logs (unless you request anonymity).

---

## ⚖️ Responsible Disclosure Guidelines

When researching potential vulnerabilities, we kindly ask researchers to:

- Act in good faith to avoid privacy violations, data loss, or disruption to production services.
- Give maintainers reasonable time to remediate the vulnerability before public disclosure.
- Avoid phishing, social engineering, or denial-of-service (DoS) attacks.

Thank you for helping keep Spidy Calculator safe, reliable, and secure for everyone! ❤️

## 🔒 Security Architecture & Guarantees

Spidy Calculator is engineered with client-side isolation and privacy-first principles:

1. **Zero Server Math (`eval()`-Free)**:
   - All arithmetic, scientific functions, and suite calculations execute purely on the client side using pure TypeScript state machines without `eval()`, `Function()`, or dynamic code execution.
2. **Client-Side Data Isolation**:
   - Calculation history (Case Files) and audio preferences are stored exclusively in the user's browser `localStorage`. No user calculations, form data, or telemetry are collected or transmitted to backend servers.
3. **PWA & Offline Integrity**:
   - The Progressive Web App service worker (`sw.js`) caches only first-party app-shell assets and strictly follows same-origin policies.
4. **Input Sanitization & Overflow Protection**:
   - All inputs across algebraic solvers, fraction engines, and unit converters enforce strict type validation to prevent script injection and numerical overflow vulnerabilities.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or potential threat in Spidy Calculator, **please do not disclose it publicly** through GitHub Issues, public discussions, or social media. Instead, please follow our responsible disclosure process:

### How to Report Privately

1. **GitHub Security Advisory (Recommended)**:
   - Navigate to the [Security Advisories](https://github.com/VARA4u-tech/spidy-calculator/security/advisories) tab on our GitHub repository.
   - Click **"Report a vulnerability"** to submit a private, encrypted vulnerability report directly to the maintainers.

2. **Direct Email Disclosure**:
   - Send an email to the project maintainer:
     📧 **`durgavaraprasadpappuri13@gmail.com`**
   - Subject line: `[SECURITY] Vulnerability Report — Spidy Calculator`.

### What to Include in Your Report

To help us investigate and resolve the issue quickly, please provide:
- A clear description of the vulnerability and its potential impact.
- Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
- The affected environment details (Browser, OS version, Device type).
- Any suggested fixes or mitigation strategies, if known.

---

## ⏱️ Response & Triage Timeline

- **Initial Acknowledgment**: Within **48 hours** of receiving your report.
- **Triage & Assessment**: Within **3 to 5 business days**, confirming whether the vulnerability is accepted or declined with rationale.
- **Patch & Deployment**: Verified fixes are prioritized and immediately deployed to `main` and production at [https://spidy-calculator.vercel.app](https://spidy-calculator.vercel.app).
- **Attribution & Credit**: Upon public release of the fix, we will gladly credit you in release notes and commit logs (unless you request anonymity).

---

## ⚖️ Responsible Disclosure Guidelines

When researching potential vulnerabilities, we kindly ask researchers to:
- Act in good faith to avoid privacy violations, data loss, or disruption to production services.
- Give maintainers reasonable time to remediate the vulnerability before public disclosure.
- Avoid phishing, social engineering, or denial-of-service (DoS) attacks.

Thank you for helping keep Spidy Calculator safe, reliable, and secure for everyone! ❤️


<div align="center">
  <a href="#top">
    <img src="https://img.shields.io/badge/▲_SCROLL_TO_TOP-E23636?style=for-the-badge&logoColor=white" alt="Scroll to Top" />
  </a>
  <br />
</div>
