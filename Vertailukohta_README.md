# 📊 Järki Kettu: Vertailukohta (Benchmark Engine)
**Standalone HVAC Comfort & Efficiency Scoring for Home Assistant**

Vertailukohta ("Reference Point" or "Benchmark" in Finnish) is a standalone diagnostic engine that grades how well your HVAC system is actually performing. 

Most smart thermostats give you a fancy graph of when your AC turned on, but they don't tell you if that runtime was *justified* by the weather, or if your house is actually comfortable. Vertailukohta uses mathematical modeling to give your home a 0-100% grade for both Comfort and Efficiency.

---

## 🧮 How the Math Works

### 1. The Instant Comfort Score
Comfort isn't just about temperature. It's a balance of temperature drift and humidity extremes. The Comfort Score starts at 100% and subtracts penalties based on the following rules:
* **Exponential Temperature Penalty:** `(Temp Drift)² * 2`. 
  * *Why?* Because being 1°F away from your setpoint is barely noticeable (-2% penalty). But being 3°F away means you are actively sweating or shivering (-18% penalty). The further it drifts, the harsher the penalty.
* **High Humidity Penalty:** `-1.5% for every point above 55% RH.` 
  * *Why?* High humidity prevents sweat from evaporating, making the air feel muggy and warmer than it actually is.
* **Low Humidity Penalty:** `-1.0% for every point below 35% RH.` 
  * *Why?* Winter air that is too dry causes static shocks, dry skin, and makes the air feel colder than it is.

### 2. The 24h Efficiency Index
Your HVAC *should* run when it's hot or cold outside. You shouldn't be penalized just because it's winter. The Efficiency Index compares your system's actual workload against the physical Delta-T (the temperature difference between inside and outside).
* **Expected Effort:** `Delta-T * 3.5%`
  * *Why?* As a baseline reference, a standard 2-ton system on a moderately insulated 1,400 sq.ft. home needs to run roughly 3.5% of the hour for every 1°F difference between the indoor and outdoor temperature.
* **The Penalty:** If your system runs *more* than the physics suggest it should, the Efficiency score drops. If your system runs exactly as expected (or less!), you score a 100%.

---

## 🔌 Prerequisites & Credits (HACS)
To get the beautiful, transparent UI cards exactly as they look in my screenshots, you must install **card_mod** via HACS (Home Assistant Community Store). Massive credit to Thomas Lovén for creating `card_mod`. It is the absolute backbone of advanced Home Assistant dashboarding!

**UI Install Checklist:**
- [ ] Install HACS (If you haven't already).
- [ ] Open HACS -> Frontend -> Search for and download **card_mod**.
- [ ] Refresh your browser cache.

---

## 🛠️ Installation

### Step 1: The Backend Logic
1. Download `vertailukohta_logic.yaml` and place it in your Home Assistant `packages/` directory.
2. Open the file in a text editor and perform a **Find & Replace** for your specific sensor entities (Look at the `SETUP INSTRUCTIONS` at the top of the file).
3. Restart Home Assistant to load the new logic.

### Step 2: The Dashboard UI
1. Open your Home Assistant Lovelace Dashboard.
2. Click **Edit Dashboard** -> **Add Card** -> **Manual**.
3. Copy and paste the contents of `vertailukohta_lovelace_ui.yaml`.

---

## 💎 Upgrade to Vertailukohta Pro (Patreon)
Want to know *why* your efficiency score is low? Over on my Patreon, I offer **Vertailukohta Pro**. 

The Pro version tracks physical **Envelope Thermodynamics**. It calculates your home's active **Heat Loss Rate** (°F/h) when the HVAC is off, tracks the **Stack Effect / Thermal Pressure** (Pa) trying to force your conditioned air out of the roof, and penalizes your comfort score if it detects heavy stratification (hot upstairs, freezing downstairs).

---
## ⚠️ Disclaimer
**A personal note:** I fully understand how important your HVAC system is. It is arguably the most critical and expensive piece of hardware in your home. Please do not proceed with this project if you do not fully understand what you are getting into. These systems cost tens of thousands of dollars, and if something goes wrong, I will not be there to help you fix it. 

This configuration controls physical, high-voltage HVAC equipment. It is provided "AS-IS", without warranty of any kind. Local electrical and building codes vary everywhere; if you choose to install any supporting equipment of any voltage rating, you do so entirely at your own risk and without my recommendation. Proceed with extreme caution. You are solely responsible for ensuring your hardware failsafes and compressor delays are active at the equipment level. This code also assumes your system is operating within manufacturer specifications; equipment running out of specification will produce unexpected results.

**The "Bug" Disclaimer:** Just a final bit of CYA (Cover Your Ass). I am surprised you read down this far, but I think it needs to be said: I did not write Home Assistant. While we all know Home Assistant is incredibly reliable, it is not perfect, and I am not a full-time software engineer. Bugs will happen. I will do my absolute best to patch obvious issues when I find them or when they are reported, but this is a one-man passion project and I can only help so much. If you've read this far, you clearly care about your system, and I'm glad you're here.

---
## ⚖️ License
**PolyForm Noncommercial License 1.0.0**  
Provided for personal, non-commercial use only. Commercial redistribution, bundling, or paid client deployment is strictly prohibited without an active Commercial / Installer Exemption via Patreon.