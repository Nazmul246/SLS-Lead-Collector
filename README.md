# Shopify Lead Collector System

> **Status:** 🚧 Work in Progress

A private lead collection system focused on gathering Shopify-related business leads from multiple sources through a unified dashboard.

This project is intentionally kept **minimal in public details** and is not intended as an open-source or free-to-use system.

---

## 🔍 Project Purpose

The goal of this system is to streamline lead collection by providing separate modules for different data sources, all accessible from a single interface.

Currently, the system focuses on:

* Collecting leads from **Google Maps**
* Actively developing the **Shopify Directory** scraping module

---

## 🧭 Application Flow

* A **top navigation bar** allows switching between different lead collection sections
* Each section handles a specific data source
* Users can input targets (URLs, keywords, locations)
* Scraping progress and collected leads are displayed in the UI
* Leads can be reviewed and exported for internal use

---

## 🧑‍💻 Tech Stack (High-Level)

### Frontend

* React.js
* Next.js

### Backend

* Node.js
* Express.js
* Puppeteer (headless scraping)

---

## ⚙️ System Responsibilities

### Frontend

* User inputs for lead sources
* Progress & status visualization
* Display of collected lead data
* Export functionality (Excel)

### Backend

* Scraping orchestration
* CORS handling
* Rate limiting & request control
* Data extraction & formatting

---

## 🔒 Project Notes

* Shopify Directory scraping is **under active development**
* Implementation details are intentionally abstracted
* This system is built for **private/internal commercial use**
* Redistribution or public deployment is not intended

---

## 📌 Disclaimer

This project is designed for controlled usage. Ensure compliance with applicable laws, platform terms, and ethical data usage practices.

---

**More modules and optimizations will be added as development progresses.**
