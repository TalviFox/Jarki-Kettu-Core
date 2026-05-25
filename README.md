# 🦊 Järki Kettu Core (The Clever Fox)
**Advanced Server-Side HVAC Auto-Switcher for Home Assistant**

*In Finnish folklore, the fox outsmarts larger, stronger animals not through brute force, but through patience, agility, and using the environment to its advantage. Your HVAC should do the same.*

Most "smart" HVAC automations aren't actually smart, they are purely reactive and often fundamentally flawed. Standard thermostat logic usually falls into one of two extremes: keeping the unit off for as long as possible until absolutely necessary, or short-cycling constantly so the temperature never shifts. Both approaches are objectively terrible for your HVAC equipment and work directly against how modern systems (especially heat pumps) were designed to operate, which rely on long, predictable cycles. Järki Kettu Core is more than just an auto-switcher; it actively evaluates indoor physics against outdoor conditions to keep your thermostat in the optimal mode, enforcing healthy, efficient runtimes.

*Created by Talvi Fox / Talvi's Den*

---

## 🚀 Features (Core Module)
- **Dynamic Coast Zones:** System rests comfortably between wide deadbands.
- **Deep Soaks:** Dynamically stretches the physical wall unit's setpoint to force the compressor to run long enough to actually condition the house.
- **Heat Pump Optimized:** Includes a "Setpoint Walker" option to prevent Heat Pumps from panicking and triggering expensive Aux/Emergency Heat strips.
- **Graceful Degradation:** Defaults back to the thermostat's internal logic if your Home Assistant sensors go offline or reboot.

## 🧠 The Paradigm Shift: Set a Range, Ignore the Number
Because Järki Kettu relies on wide deadbands and long runtimes to maximize efficiency, you have to break the habit of staring at your physical thermostat's display. The old "set it and forget it" mentality becomes **"set a range, and don't look at the number"** (unless, of course, there is an extreme error).

Your home's temperature will intentionally fluctuate within this "Coast Zone" depending on the active mode and outdoor weather. It might feel strange at first to see the temperature drift a degree or two, but this is the system executing deep, efficient thermal soaks.

**Crucial rule:** Do *not* set your Target Heat and Target Cool limits to the same number! You need to give the system a wide gap to coast in. It takes a few tries to find your personal "zone," and you really need to watch how your home reacts over a few days before you settle on your final temperatures. But once you dial it in, you'll find you are actually comfortable throughout the entire house instead of just the hallway.

## 🔬 The Science (Why Your Thermostat is Lying to You)
Most residential smart thermostats are incredibly primitive - they react exclusively to air temperature using extremely tight "deadbands" (usually ±0.5°F). Järki Kettu fundamentally breaks this mold by mimicking the logic of a commercial Building Management System (BMS). Here is the actual building physics behind why this works, and why the big brands refuse to do it.

### 1. Thermal Mass vs. Air Temperature
Air changes temperature very quickly, while your walls, floors, and furniture take much longer to absorb or release thermal energy. When a standard thermostat short-cycles, it mostly just conditions the *air*. The second the unit turns off, your physical structure transfers its stored thermal energy back into the room, causing the air temperature to bounce right back.
By enforcing wide deadbands and **Deep Soaks**, Järki Kettu forces the system to run long enough to condition the physical *structure* of the house. Once the thermal mass is properly soaked, the house can coast for much longer without the HVAC needing to turn back on.

### 2. Latent Heat (Dehumidification)
Air conditioning is about removing heat *and* moisture. An AC evaporator coil needs to run for about 10-15 minutes just to get cold enough to start pulling water out of the air. If your thermostat short-cycles to keep the air exactly at 72°F, it rarely runs long enough to dehumidify. You end up with a house that is 72°F but 60% humidity, a cold, clammy swamp. Long cycles extract massive amounts of latent moisture.

### 3. If This is Better, Why Doesn't Honeywell/Nest Do It?
**Customer Psychology.** People treat thermostats like a volume dial. If a homeowner sets their thermostat to 72°F, and the temperature naturally drifts to 74°F before the AC kicks on, they immediately call a technician and say their unit is broken. 
To prevent customer support nightmares, smart thermostat brands use razor-thin deadbands to keep the number perfectly still on the screen. In doing so, they are actively ignoring the actual HVAC hardware manufacturer's engineering specs, which explicitly demand long, steady-state cycles for proper compressor oil return and electrical efficiency. They intentionally sacrifice your equipment's lifespan and your actual thermal comfort just to give you the psychological comfort of seeing a static number on a screen.

### 4. The Comfort Trade-Off
The only trade-off to the Järki Kettu approach is that you must accept a 3-5 degree fluctuation in your home's air temperature. However, human comfort isn't just about air temperature; it is heavily dictated by **Mean Radiant Temperature (MRT)** and humidity. 

Because this system deeply soaks the physical walls and aggressively strips out absolute humidity, a room at 75°F under Järki Kettu logic will physically feel vastly more comfortable and breathable than a short-cycled room at 72°F under native thermostat logic. You lose the static number on the wall, but you gain profound, whole-house physical comfort and significantly prolonged equipment life.

### 5. The "Static Temperature Saves Money" Half-Truth
You might have heard the old advice: *"Just leave your thermostat at one temperature; it's cheaper than letting it fluctuate and forcing the system to catch up."* 

This isn't actually a myth, it's just an incomplete answer. It is absolutely true that massive, 10-degree temperature setbacks waste a ton of energy during the recovery phase (especially for heat pumps, which might panic and trigger expensive auxiliary heat). Holding a static temperature *does* keep your monthly electric bill predictable. 

But you are trading your electric bill for the lifespan of a $15,000+ piece of hardware.

When you force a thermostat to hold a single, unyielding number, you are abusing the machine with constant 5-minute short-cycles. You are subjecting the compressor to massive start-up amperage spikes and terrible moisture-extraction efficiency. Järki Kettu takes this a step further by finding the perfect middle ground. It doesn't use massive, expensive setbacks, but it also doesn't hold a static number. By introducing a controlled **Coast Zone** of just a few degrees, it avoids the energy-wasting recovery spikes *while also* eliminating the hardware-destroying short-cycles. You take care of the equipment, and the equipment takes far better care of you.

## � Origin Story (Why I Built This)
After abruptly leaving the Ecobee ecosystem in search of something that crashed less, I bought into the Honeywell ecosystem and was immediately disappointed to find out they barely supported their flagship T9 thermostat. Frustrated, I pulled the unit into Home Assistant to try and fix it myself, but eventually hit a wall and shelved the project.

Months later, a coworker showed off their own Home Assistant setup, which completely reignited my motivation. I spent the next six months straight coding my ideas through pure trial and error. I built the fan controller from scratch and literally lived through a freezing winter of bugs, waking up to the system stuck in the wrong modes, until I finally ironed out the math.

Because no good deed goes unpunished, my outdoor HVAC unit recently got crushed by a falling tree. It hasn't been replaced yet, but it is somehow still limping along. I am fully convinced that the only reason it hasn't completely died is because this exact logic increased its efficiency and stopped it from running itself to death!

## 🏆 Validation & Special Thanks
I have to give a massive shoutout to everyone who patiently listened to me ramble about boring thermal physics that I barely understood at the time, as well as the AI tools that helped me untangle the math and build this out.

What finally motivated me to clean this project up and push it online was getting validation from actual professionals. An HVAC installer took a look at the system and pointed out that I had successfully solved a notoriously difficult floor-temperature split issue using what is effectively "virtual zoning." Shortly after, an in-law who literally teaches HVAC saw the dashboard and instantly recognized that the backend was actively manipulating real building science.

But you don't just have to take my (or their) word for it. I literally live with this automation running my home every single day.

I built this for me, and it will keep running my house regardless of whether anyone else downloads it. But if you are tired of your thermostat short-cycling and want to see if this logic works for your home too, welcome to the Den.

## 📊 The Data Challenge (For the Graph Nerds & Creators)
If you run a smart home YouTube channel, a blog, or just love staring at Grafana dashboards, this project was built for you. 

Don't just take my word for it, prove the physics with your own data. I highly encourage you to set up History Stats to track your compressor's **average cycle time** and **total daily runtime** for a week *before* installing Järki Kettu. Then, compare it to the data 30 days later. 

You will see the erratic short-cycling disappear entirely, replaced by massive, highly efficient, deep-soaking runs. If you make a video, write a blog post, or just want to show off your Grafana charts comparing the "Before and After," please let me know! I love seeing this logic optimized for different environments and hardware.

## �️ Why Trust a Sysadmin with Your HVAC?
I am not a licensed HVAC technician. I'm a Systems Administrator. But if you think about it, a house is just a giant server chassis, and your HVAC unit is a massive cooling fan. Standard smart thermostats run on logic that feels like a BIOS from 1995: *"It got hot. Turn on fan."* 

As a sysadmin, I look at the world through telemetry, feedback loops, root cause analysis, and uptime efficiency. When a thermostat short-cycles, an HVAC tech might see a hardware quirk; I see a flawed logic loop and poor resource allocation. I didn't approach this like a mechanic fixing a machine; I approached it like an IT engineer optimizing a data center. The result is a mathematically sound, telemetry-driven orchestration engine that treats your home's thermal dynamics with the exact same respect as a production server environment.

## � Hardware Compatibility
This module is designed to work with almost any modern 24V Home Assistant-compatible smart thermostat. While it was built and extensively tested using a **Honeywell T9** (and some default temperature stretches/delays are tuned to its specific staging nuances), the logic lives entirely inside Home Assistant. It is **not** locked into the Honeywell ecosystem, and you can easily tweak the variables to fit your specific equipment.

*Fun fact: This project originally started specifically to work around the T9's biggest annoyances. However, the deeper I got into the code, the more I realized that completely overriding the thermostat and replacing its internal brain was the only real answer! While there are no plans to drop support for the T9, the project will definitely be moving toward more open-API hardware platforms in the not-so-distant future.*

## �️ Installation & Setup
1. Ensure you have your thermostat and temperature sensors integrated into Home Assistant. (I use the Homekit Integration)
2. Download `jarki_kettu_core.yaml` and place it in your Home Assistant `packages/` directory.
3. Open the file and perform a Find & Replace for:
   - `climate.YOUR_THERMOSTAT`
   - `sensor.YOUR_ROOM_SENSOR_1` etc...
4. Download `jarki_kettu_ui_dashboard.yaml`, open your Home Assistant Dashboard, add a "Manual" Lovelace card, and paste the code.
5. **Important:** On your physical wall thermostat, delete all native schedules/timers and set the fan to "Circulate" (if available). Let Järki Kettu drive!

## 💎 Järki Kettu Pro & Elite Access (Patreon)
Järki Kettu Core is just the foundation. Over on my Patreon (Talvi's Den), I offer structured tiers to help you take your system to the next level. 

### ⚡ Järki Kettu Pro
*(Want just one specific feature? You can grab individual modules a-la-carte from my Ko-fi Shop!)*

The definitive upgrade for your smart home. This tier gives you access to my entire suite of premium standalone modules, allowing you to build out a complete, professional-grade HVAC ecosystem:
* **💧 Kuivatta (Moisture Control):** Advanced psychrometric math (Absolute Humidity & Dewpoint) to optimally control a dehumidifier via a smart relay, preventing short-cycles and fighting your AC.
* **🌬️ Kierrättää (Scavenger Engine):** Intelligent fan equalization logic. Detects thermal anomalies (like a hot gaming PC or a sun-baked upstairs) and runs the HVAC fan to distribute the heat, delaying expensive compressor cycles.
* **📊 Vertailukohta PRO (Envelope Analytics):** Upgrades the free benchmark engine to track physical Heat Loss Rate, Thermal Pressure (Stack Effect), and Room Imbalance Penalties.
* **🛡️ Kilpi (Environmental Security):** Adds window-open proxy failsafes, cross-breeze weather alerts, and AQI-driven particulate scrubbing.

### 🦊 The Elite Tier: "How the Sausage is Made"
For extreme power users and developers who want it all. This premium tier grants access to my **fully sanitized, monolithic production configuration**. This is the exact 4,000+ line backend YAML and Lovelace Dashboard code that runs my own home. It is designed as a raw, unfiltered masterclass in advanced Jinja templating, trigger-based sensors, and massive-scale smart home architecture. If you want to see exactly how a high-end, automated ecosystem is built and interconnected from the ground up, this is it.

### 👑 Root Access ($2,000)
*So you've seen the Fox Den, and now you want to talk about it.* Every project needs a crazy tier. If you are actually wild enough to purchase this, I will personally get on a 1-on-1 call with you. We will talk through exactly how I implemented this system, review your specific home's floor plan and HVAC setup, and I will make custom architecture recommendations for your environment. I don't expect anyone to ever click this, but if you do, we're going to nerd out and build something awesome together. *(A friend joked that I should add a $10,000 "You Get Nothing" tier, but I figured I should at least offer a consulting call!)*

## 🤖 Development Transparency (AI-Assisted)
To manage the sheer scale of a massive smart home architecture, I utilize AI coding assistants as a development co-pilot. While AI helps accelerate the writing of heavy YAML and complex Jinja templates, **the core logic, psychrometric math, and fallback mechanisms are meticulously designed, rigorously tested, and actively lived-in by me.** This isn't raw AI output; it's a handcrafted ecosystem, supercharged by modern developer tools.
---

## ⚠️ Disclaimer
**A personal note:** I fully understand how important your HVAC system is. It is arguably the most critical and expensive piece of hardware in your home. Please do not proceed with this project if you do not fully understand what you are getting into. These systems cost tens of thousands of dollars, and if something goes wrong, I will not be there to help you fix it. 

This configuration controls physical, high-voltage HVAC equipment. It is provided "AS-IS", without warranty of any kind. Local electrical and building codes vary everywhere; if you choose to install any supporting equipment of any voltage rating, you do so entirely at your own risk and without my recommendation. Proceed with extreme caution. You are solely responsible for ensuring your hardware failsafes and compressor delays are active at the equipment level. This code also assumes your system is operating within manufacturer specifications; equipment running out of specification will produce unexpected results.

**The "Bug" Disclaimer:** Just a final bit of CYA (Cover Your Ass). I am surprised you read down this far, but I think it needs to be said: I did not write Home Assistant. While we all know Home Assistant is incredibly reliable, it is not perfect, and I am not a full-time software engineer. Bugs will happen. I will do my absolute best to patch obvious issues when I find them or when they are reported, but this is a one-man passion project and I can only help so much. If you've read this far, you clearly care about your system, and I'm glad you're here.

## ⚖️ License
**Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)**

Provided for personal, non-commercial use. You may modify and use this in your own home, but commercial redistribution or resale (e.g., smart home installers charging clients for this logic) is strictly prohibited under the base license. 

**💼 Commercial / Installer Licensing:** If you are a professional smart home integrator wishing to deploy Järki Kettu in client builds, you must purchase a Commercial License Exemption via Patreon. This tier grants the legal right to use the code commercially. *Note: Commercial tiers are for licensing rights only. They do not include technical support, an SLA, or liability assumption. You assume all risks for your client deployments.*
