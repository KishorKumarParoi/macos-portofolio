# 🍎 macOS Sonoma Interactive Engineering Portfolio

<div align="center">

![macOS Portfolio Banner](public/macbook.png)

### **Executive Portfolio & Interactive Operating System**
*Crafted for Principal AI Systems Architects, Distributed Systems Leaders & High-Scale Engineers*

[![Live Platform](https://img.shields.io/badge/Live%20Platform-macos--portofolio.vercel.app-0071e3?style=for-the-badge&logo=apple&logoColor=white)](https://macos-portofolio.vercel.app/)
[![Download Resume](https://img.shields.io/badge/📄%20Executive%20Resume-Download%20PDF-641C26?style=for-the-badge&logo=adobeacrobatreader&logoColor=white)](https://macos-portofolio.vercel.app/files/resume.pdf)
[![React 19](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Rolldown Vite](https://img.shields.io/badge/Bundler-Rolldown%20Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.1-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

---

### [🚀 Launch Live macOS Desktop Environment](https://macos-portofolio.vercel.app/) &nbsp;•&nbsp; [📄 Direct Resume PDF](https://macos-portofolio.vercel.app/files/resume.pdf) &nbsp;•&nbsp; [📑 Detailed ATS Resume](https://macos-portofolio.vercel.app/files/resume_single_column.pdf)

</div>

---

## 📄 Featured Executive Resumes & Dossiers

This portfolio features direct access to Kishor Kumar Paroi's verified technical credentials, academic background (**RUET CSE**), competitive programming track record (**Codeforces Blue, 5★ CodeChef**), and 11 end-to-end production AI/MLOps architectures.

| Format | Document | Target Audience | Direct Download Link |
| :--- | :--- | :--- | :--- |
| **Academic / Executive** | `resume.pdf` | Executive Leadership, Staff/Principal AI Architects | [📥 **Download 1-Page A4 PDF**](https://macos-portofolio.vercel.app/files/resume.pdf) |
| **Comprehensive ATS** | `resume_single_column.pdf` | Enterprise ATS Screening, Deep Systems Due-Diligence | [📥 **Download Detailed ATS PDF**](https://macos-portofolio.vercel.app/files/resume_single_column.pdf) |
| **Interactive In-App** | `Resume.app` | Interactive Web Previewers & Recruiters | *Click the "Resume" icon on the macOS Desktop or Dock* |

> [!TIP]
> **Built-in Desktop PDF Viewer:** Click the **Resume** icon directly on the desktop to launch the native macOS PDF Viewer window powered by `@react-pdf`. Switch seamlessly between the **1-Page Academic Split layout** and the **Comprehensive ATS format** with live zoom and instant download controls.

---

## ✨ Key Portfolio Highlights

- **🍎 Pixel-Perfect macOS Sonoma Experience:** Interactive Apple menu, draggable & resizable multi-window manager, glassmorphic blur materials (`backdrop-blur-md`), dynamic control center, and fluid dock magnification.
- **📄 Native PDF Resume Viewer:** Built-in PDF reader with smooth dual-mode switching (`resume.pdf` vs. `resume_single_column.pdf`), pinch/button zoom, and high-DPI font rendering.
- **💻 Sandboxed Interactive Terminal (`Terminal.app`):** Fully operational bash-like terminal supporting `help`, `cat`, `projects`, `skills`, `curl`, and quick-deploy execution.
- **📂 Finder & System Explorer (`Finder.app`):** Explore project case studies, file hierarchies, and media assets in a native three-column column-view or icon-grid layout.
- **♟️ Embedded Chess Engine (`Chess.app`):** Play against a custom chess AI directly inside the desktop window workspace.
- **⚡ Next-Gen Frontend Tooling:** Powered by **React 19.2**, **Rolldown Vite** compiler, and **Tailwind CSS v4** with hardware-accelerated animations via **GSAP 3.13**.

---

## 🛠️ Architecture & Technology Stack

```
macos-portfolio/
├── public/
│   ├── files/
│   │   ├── resume.pdf                <-- Master 1-Page Academic Split PDF (691 KB)
│   │   └── resume_single_column.pdf  <-- Master Comprehensive ATS PDF (1.5 MB)
│   ├── icons/                        <-- High-resolution macOS application icons
│   └── images/                       <-- System wallpapers & project previews
├── src/
│   ├── components/                   <-- WindowControls, Dock, MenuBar, Toolbars
│   ├── windows/
│   │   ├── Resume.jsx                <-- Native PDF Viewer with multi-resume switcher
│   │   ├── Terminal.jsx              <-- Interactive POSIX CLI with commands
│   │   ├── Finder.jsx                <-- File explorer & architecture inspector
│   │   ├── Chess.jsx                 <-- Canvas-based AI chess window
│   │   ├── Contact.jsx               <-- Direct secure communication modal
│   │   └── Safari.jsx                <-- Embedded browser frame
│   ├── store/                        <-- Zustand global window state & z-index stacking
│   └── constants/                    <-- Project metadata, career timeline & skills
└── vite.config.js                    <-- Rolldown Vite fast-refresh configuration
```

| Layer | Technologies |
| :--- | :--- |
| **UI Framework** | React 19.2, Tailwind CSS v4, Lucide React Icons |
| **Animation Core** | GSAP 3.13 (`@gsap/react`), CSS Backdrop Filters |
| **State Management**| Zustand 5.0 (Multi-window z-ordering, position persistence, minimize/maximize) |
| **Document Engine** | React-PDF 10.2 + PDF.js Worker for vector-crisp PDF rendering |
| **Build & Tooling** | Rolldown Vite, ESLint 9, Vercel Edge Network |

---

## 🚀 Local Development Quickstart

### Prerequisites
- Node.js >= 18.0.0
- npm or pnpm

### 1. Clone the repository
```bash
git clone https://github.com/KishorKumarParoi/macos-portofolio.git
cd macos-portofolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Launch local development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
npm run preview
```

---

## ☁️ Deployment Reference

This repository is optimized for zero-configuration continuous deployment on the **Vercel Edge Network**:

- **Edge CDN Caching:** Static assets in `public/files/*.pdf` are served with global edge replication for sub-100ms cold document delivery.
- **Single-Command Deploy:**
  ```bash
  npx vercel --prod
  ```

---

## 👤 Author & Architecture Inquiries

**Kishor Kumar Paroi**  
*Principal AI Systems Architect | Enterprise Platform & Distributed Systems Leader*  
- 🌐 **macOS Portfolio:** [macos-portofolio.vercel.app](https://macos-portofolio-virid.vercel.app/)  
- 🚀 **3D Interactive Portfolio:** [re-invent-rust.vercel.app](https://re-invent-rust.vercel.app/)  
- 💼 **LinkedIn:** [linkedin.com/in/kishor-kumar-paroi-b06344166](https://www.linkedin.com/in/kishor-kumar-paroi-b06344166/)  
- 🐙 **GitHub:** [github.com/KishorKumarParoi](https://github.com/KishorKumarParoi)  
- 📧 **Email:** [1703053@student.ruet.ac.bd](mailto:1703053@student.ruet.ac.bd) | [kishor.ruet.cse@gmail.com](mailto:kishor.ruet.cse@gmail.com)  

---
*Licensed under the [MIT License](LICENSE).*
