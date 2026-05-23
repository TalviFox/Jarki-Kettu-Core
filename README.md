# 🦊 Järki Kettu Core (The Smart Fox)
**Advanced Server-Side HVAC Auto-Switcher for Home Assistant**

Järki Kettu outsmarts your native thermostat. Standard thermostats rely on a single sensor in a hallway, leading to short-cycling, poor efficiency, and freezing bedrooms. This Core module pulls the logic into Home Assistant, calculating a true house average and executing a "Dynamic Coast Zone" to force deep, efficient thermal soaks.

*Created by Talvi Fox / Talvi's Den*

---

## 🚀 Features (Core Module)
- **Dynamic Coast Zones:** System rests comfortably between wide deadbands.
- **Deep Soaks:** Dynamically stretches the physical wall unit's setpoint to force the compressor to run long enough to actually condition the house.
- **Heat Pump Safe:** Includes a "Setpoint Walker" option to prevent Heat Pumps from panicking and triggering expensive Aux/Emergency Heat strips.
- **Failsafe Design:** Gracefully falls back to the thermostat's internal logic if your Home Assistant sensors go offline or reboot.

## 🛠️ Installation & Setup
1. Ensure you have your thermostat and temperature sensors integrated into Home Assistant. (For thermostats, **HomeKit Controller** integration is highly recommended for instant push-states without the cloud).
2. Download `jarki_kettu_core.yaml` and place it in your Home Assistant `packages/` directory.
3. Open the file and perform a Find & Replace for:
   - `climate.YOUR_THERMOSTAT`
   - `sensor.YOUR_ROOM_SENSOR_1`
4. Download `jarki_kettu_ui_dashboard.yaml`, open your Home Assistant Dashboard, add a "Manual" Lovelace card, and paste the code.
5. **Important:** On your physical wall thermostat, delete all native schedules/timers and set the fan to "Circulate" (if available). Let Järki Kettu drive!

## 💎 Premium Modules (Patreon)
Järki Kettu Core is just the foundation. If you want to unlock the full potential of your smart home, check out the premium modules available on my Patreon: Talvi's Den (Insert Link)

* **💧 Järki Kettu Halla (Moisture Control):** Adds absolute humidity math, dewpoint limits, and automated dehumidifier hardware integration.
* **🌬️ Järki Kettu Vire (Scavenger):** Advanced fan equalization logic. Pushes heat from gaming PCs or hot upstairs rooms around the house to delay compressor usage.
* **🛡️ Järki Kettu Environmental Security:** Window-open failsafes, weather/breeze alerts, and AQI-driven particulate scrubbing.
* **🧠 Järki Kettu Aisti (AI Engine):** Telemetry auditing using local conversation agents.

---

## ⚠️ Disclaimer
This configuration controls physical, high-voltage HVAC equipment. It is provided "AS-IS", without warranty of any kind. You are solely responsible for ensuring your hardware failsafes and compressor delays are active at the equipment level.

## ⚖️ License
**Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)**

Provided for personal, non-commercial use. You may modify and use this in your own home, but commercial redistribution or resale (e.g., smart home installers charging clients for this logic) is strictly prohibited. 