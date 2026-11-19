export interface HardwareModule {
  id: string;
  name: string;
  part: string;
  shortPart: string;
  role: string;
  supply: string;
  detail: string;
  spec: string;
  image: string;
  datasheetNames: string[];
  pins: { pin: string; net: string; note: string }[];
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

export interface ElectricalNet {
  id: string;
  name: string;
  shortLabel: string;
  group: "power" | "i2c" | "spi" | "adc";
  color: string;
  voltage: string;
  protocol: string;
  direction: string;
  source: string;
  dest: string;
  note: string;
  from: string;
  to: string[];
  needsSwitchOn?: boolean;
}

export const modules: HardwareModule[] = [
  {
    id: "BT1",
    name: "Portable 6 V battery supply",
    part: "4× 1.5 V AA Battery Pack (6.0 V)",
    shortPart: "4×AA Battery (6.0V)",
    role: "Primary Power Source",
    supply: "6.0 V DC (4 × 1.5 V in series)",
    detail:
      "Four standard 1.5 V AA alkaline cells wired in series deliver 6.0 V total into the main power switch before step-down regulation.",
    spec: "+ → SW1 IN (BAT_6V) · − → Common GND",
    image: "/images/parts/bt1-battery-4xaa.png",
    datasheetNames: [],
    pins: [
      { pin: "+", net: "BAT_6V", note: "6.0 V positive output to power switch SW1" },
      { pin: "−", net: "GND", note: "Connected to shared common ground rail" },
    ],
    x: 590,
    y: 360,
    w: 108,
    h: 92,
    color: "#355440",
  },
  {
    id: "SW1",
    name: "Physical main power cutoff",
    part: "SPST Rocker Power Switch",
    shortPart: "Power Switch (SPST)",
    role: "Manual 6 V Isolation Switch",
    supply: "6.0 V DC series cutoff",
    detail:
      "Single-pole single-throw switch wired directly between the 4×AA battery pack positive terminal and the DD4012SA regulator input for safe peripheral shutoff.",
    spec: "IN ← BT1 (+) · OUT → U2 VI+ (SW_6V)",
    image: "/images/parts/sw1-power-switch.png",
    datasheetNames: [],
    pins: [
      { pin: "IN", net: "BAT_6V", note: "6.0 V input from 4×AA battery pack" },
      { pin: "OUT", net: "SW_6V", note: "Switched 6.0 V output to DD4012SA VI+" },
    ],
    x: 595,
    y: 266,
    w: 92,
    h: 64,
    color: "#3b4c42",
  },
  {
    id: "U2",
    name: "One clean regulated 3.3 V rail",
    part: "DD4012SA 3.3 V Buck Converter",
    shortPart: "DD4012SA 3.3V Buck",
    role: "Step-Down Voltage Regulator",
    supply: "6.0 V In → Regulated +3.30 V Out",
    detail:
      "Fixed 3.3 V step-down buck converter (4.75–40 V input range) supplying a stable 3.3 V output to all sensors and both TFT displays—isolated from the ESP32-C3 USB-C rail.",
    spec: "VI+ ← SW1 OUT · VO → +3V3 (Peripherals Only) · GND → GND",
    image: "/images/parts/u2-dd4012sa-buck.png",
    datasheetNames: [],
    pins: [
      { pin: "VI+", net: "SW_6V", note: "Switched 6.0 V DC input from SW1" },
      { pin: "VO", net: "+3V3", note: "Regulated 3.3 V output to B1, B2, B3, DS1, DS2" },
      { pin: "GND", net: "GND", note: "Bonded to shared common ground rail" },
    ],
    x: 592,
    y: 162,
    w: 100,
    h: 72,
    color: "#40733e",
  },
  {
    id: "U1",
    name: "The brain of Garden Buddy",
    part: "ESP32-C3 SuperMini",
    shortPart: "ESP32-C3 SuperMini",
    role: "32-Bit RISC-V Microcontroller",
    supply: "USB-C 5 V (Onboard 3.3 V LDO · Isolated from U2)",
    detail:
      "160 MHz RISC-V controller powered separately via USB-C during prototyping while sharing a common ground with all modules. Polls all four metrics every 2 seconds, calculates the 0–100% score out of 4, and drives both SPI screens.",
    spec: "I²C: GPIO2/9 · SPI: GPIO4/5/10 + DC/CS · Soil ADC: GPIO0 · Common GND",
    image: "/images/parts/u1-esp32-c3.png",
    datasheetNames: ["ESP32-C3", "ESP32-C3-MINI-1"],
    pins: [
      { pin: "GPIO0", net: "GPIO0 (SOIL)", note: "ADC1_CH0 analog input from Soil Sensor v2.0" },
      { pin: "GPIO2", net: "GPIO2 (SDA)", note: "Shared I²C SDA (AHT20, BMP280, BH1750)" },
      { pin: "GPIO9", net: "GPIO9 (SCL)", note: "Shared I²C SCL (AHT20, BMP280, BH1750)" },
      { pin: "GPIO4", net: "GPIO4 (SCK)", note: "Shared SPI clock to GC9A01 & ST7789" },
      { pin: "GPIO5", net: "GPIO5 (MOSI)", note: "Shared SPI data to GC9A01 & ST7789" },
      { pin: "GPIO10", net: "GPIO10 (RST)", note: "Shared hardware reset to both TFT screens" },
      { pin: "GPIO6", net: "GPIO6 (RND_DC)", note: "Round GC9A01 Data/Command select" },
      { pin: "GPIO7", net: "GPIO7 (RND_CS)", note: "Round GC9A01 Chip Select" },
      { pin: "GPIO1", net: "GPIO1 (RECT_DC)", note: "2.0″ ST7789 Data/Command select" },
      { pin: "GPIO3", net: "GPIO3 (RECT_CS)", note: "2.0″ ST7789 Chip Select" },
      { pin: "GND", net: "GND", note: "Common 0 V signal reference (USB-C powered)" },
    ],
    x: 425,
    y: 205,
    w: 84,
    h: 126,
    color: "#222926",
  },
  {
    id: "B1",
    name: "Sense beneath the surface",
    part: "Capacitive Soil Moisture Sensor v2.0",
    shortPart: "Capacitive Soil v2.0",
    role: "Dielectric Root-Zone Moisture Probe",
    supply: "+3V3 Buck Rail · Common GND",
    detail:
      "Corrosion-resistant v2.0 capacitive blade probe with onboard TLC555 oscillator. Measures dielectric moisture changes without exposed resistive electrodes—stopping blind overwatering.",
    spec: "AOUT → GPIO0 (ADC1_CH0) · VCC → +3V3 · GND → GND",
    image: "/images/parts/b1-soil-v2.png",
    datasheetNames: ["TLC555"],
    pins: [
      { pin: "VCC", net: "+3V3", note: "3.3 V supply from DD4012SA regulator" },
      { pin: "GND", net: "GND", note: "Common ground return" },
      { pin: "AOUT", net: "GPIO0 (SOIL)", note: "Analog moisture voltage into ESP32-C3 GPIO0" },
    ],
    x: 96,
    y: 385,
    w: 66,
    h: 162,
    color: "#252a28",
  },
  {
    id: "B2",
    name: "A window into the microclimate",
    part: "AHT20 + BMP280 Combo Module",
    shortPart: "AHT20 + BMP280",
    role: "Temperature, Humidity & Pressure",
    supply: "+3V3 Buck Rail · Common GND",
    detail:
      "Dual-sensor I²C breakout combining ASAIR AHT20 (temperature ±0.3 °C, relative humidity ±2 %RH at 0x38) and Bosch BMP280 (barometric pressure ±1 hPa at 0x76/0x77).",
    spec: "GPIO2 SDA · GPIO9 SCL · I²C 0x38 + 0x76/0x77",
    image: "/images/parts/b2-aht20-bmp280.png",
    datasheetNames: ["AHT20", "BMP280"],
    pins: [
      { pin: "VDD", net: "+3V3", note: "3.3 V supply (BMP280 abs max 4.25 V)" },
      { pin: "GND", net: "GND", note: "Common ground return" },
      { pin: "SDA", net: "GPIO2 (SDA)", note: "Shared I²C data line" },
      { pin: "SCL", net: "GPIO9 (SCL)", note: "Shared I²C clock line" },
    ],
    x: 422,
    y: 405,
    w: 88,
    h: 68,
    color: "#785294",
  },
  {
    id: "B3",
    name: "Find the right light",
    part: "BH1750 / GY-302 Light Sensor",
    shortPart: "BH1750 (GY-302)",
    role: "Digital Ambient Illuminance",
    supply: "+3V3 Buck Rail · Common GND",
    detail:
      "ROHM BH1750FVI digital ambient light sensor measuring 1–65,535 lux—covering the full 10,000–50,000 lux bright indirect orchid light band. ADDR tied to GND sets I²C address 0x23.",
    spec: "GPIO2 SDA · GPIO9 SCL · ADDR → GND (0x23)",
    image: "/images/parts/b3-bh1750.png",
    datasheetNames: ["BH1750FVI", "GY-302"],
    pins: [
      { pin: "VCC", net: "+3V3", note: "3.3 V supply from DD4012SA regulator" },
      { pin: "ADDR", net: "GND", note: "Tied LOW to select I²C address 0x23" },
      { pin: "GND", net: "GND", note: "Common ground return" },
      { pin: "SDA", net: "GPIO2 (SDA)", note: "Shared I²C data line" },
      { pin: "SCL", net: "GPIO9 (SCL)", note: "Shared I²C clock line" },
    ],
    x: 422,
    y: 78,
    w: 86,
    h: 66,
    color: "#1e6fa3",
  },
  {
    id: "DS1",
    name: "The face of plant care",
    part: "1.28″ Round GC9A01 SPI TFT",
    shortPart: "1.28″ Round GC9A01",
    role: "Top Affective Expression Screen",
    supply: "+3V3 Buck Rail · Common GND",
    detail:
      "240 × 240 round IPS color TFT driven over SPI. Draws Happy (≥75%), Neutral (50–74%), Sad (1–49%), or Error (0%) expressions so plant stress is diagnosed in under 2 seconds.",
    spec: "SCK GPIO4 · MOSI GPIO5 · RST GPIO10 · DC GPIO6 · CS GPIO7",
    image: "/images/parts/ds1-gc9a01.png",
    datasheetNames: ["GC9A01"],
    pins: [
      { pin: "SCL", net: "GPIO4 (SCK)", note: "Shared SPI clock from ESP32-C3" },
      { pin: "SDA", net: "GPIO5 (MOSI)", note: "Shared SPI MOSI data" },
      { pin: "RST", net: "GPIO10 (RST)", note: "Shared display hardware reset" },
      { pin: "DC", net: "GPIO6 (RND_DC)", note: "Dedicated Round TFT Data/Command" },
      { pin: "CS", net: "GPIO7 (RND_CS)", note: "Dedicated Round TFT Chip Select" },
      { pin: "VCC", net: "+3V3", note: "3.3 V supply from DD4012SA" },
      { pin: "GND", net: "GND", note: "Common ground return" },
    ],
    x: 196,
    y: 96,
    w: 114,
    h: 114,
    color: "#267659",
  },
  {
    id: "DS2",
    name: "Every reading, at a glance",
    part: "2.0″ Rect ST7789 SPI TFT (GMT020-02-8P v1.21)",
    shortPart: "2.0″ ST7789 TFT",
    role: "Bottom Live Telemetry & Score Screen",
    supply: "+3V3 Buck Rail (VCC + BLK) · Common GND",
    detail:
      "240 × 320 full-color 8-pin SPI TFT (GMT020-02-8P ver 1.21) displaying live soil moisture, illuminance, temperature, humidity, and health score out of 4. Shares SCK/MOSI/RST with DS1.",
    spec: "SCK GPIO4 · MOSI GPIO5 · RST GPIO10 · DC GPIO1 · CS GPIO3 · BLK +3V3",
    image: "/images/parts/ds2-st7789.png",
    datasheetNames: ["ST7789V", "SSD1306"],
    pins: [
      { pin: "SCL", net: "GPIO4 (SCK)", note: "Shared SPI clock from ESP32-C3" },
      { pin: "SDA", net: "GPIO5 (MOSI)", note: "Shared SPI MOSI data" },
      { pin: "RST", net: "GPIO10 (RST)", note: "Shared display hardware reset" },
      { pin: "DC", net: "GPIO1 (RECT_DC)", note: "Dedicated 2.0″ TFT Data/Command" },
      { pin: "CS", net: "GPIO3 (RECT_CS)", note: "Dedicated 2.0″ TFT Chip Select" },
      { pin: "VCC", net: "+3V3", note: "3.3 V display logic supply" },
      { pin: "BLK", net: "+3V3", note: "Backlight tied HIGH to +3V3 rail" },
      { pin: "GND", net: "GND", note: "Common ground return" },
    ],
    x: 192,
    y: 268,
    w: 120,
    h: 86,
    color: "#1e5582",
  },
];

export const nets: ElectricalNet[] = [
  {
    id: "BAT_6V",
    name: "BAT_6V",
    shortLabel: "BAT_6V",
    group: "power",
    color: "#ea580c",
    voltage: "6.0 V DC",
    protocol: "Unregulated Battery Feed",
    direction: "BT1 (+) → SW1 (IN)",
    source: "BT1 (+)",
    dest: "SW1 IN",
    note: "Raw 6.0 V output from four 1.5 V AA batteries in series feeding the main cutoff switch.",
    from: "BT1",
    to: ["SW1"],
    needsSwitchOn: false,
  },
  {
    id: "SW_6V",
    name: "SW_6V",
    shortLabel: "SW_6V",
    group: "power",
    color: "#d97706",
    voltage: "6.0 V DC (Switched)",
    protocol: "Switched Regulator Input",
    direction: "SW1 (OUT) → U2 (VI+)",
    source: "SW1 OUT",
    dest: "U2 VI+",
    note: "Switched 6.0 V rail powering the DD4012SA buck converter only when SW1 is closed.",
    from: "SW1",
    to: ["U2"],
    needsSwitchOn: true,
  },
  {
    id: "+3V3",
    name: "+3V3",
    shortLabel: "+3V3",
    group: "power",
    color: "#dc2626",
    voltage: "+3.30 V DC Regulated",
    protocol: "Peripheral Power Rail (Isolated from U1)",
    direction: "U2 (VO) → B1, B2, B3, DS1, DS2 (VCC & BLK)",
    source: "U2 VO",
    dest: "B1 VCC; B2 VDD; B3 VCC; DS1 VCC; DS2 VCC & BLK (NOT U1)",
    note: "Supplies stable 3.3 V to all sensors and both TFT displays while staying isolated from ESP32-C3's USB-C rail.",
    from: "U2",
    to: ["B1", "B2", "B3", "DS1", "DS2"],
    needsSwitchOn: true,
  },
  {
    id: "GND",
    name: "GND",
    shortLabel: "GND",
    group: "power",
    color: "#475569",
    voltage: "0 V Reference",
    protocol: "Common Return Ground",
    direction: "All 9 Modules + B3 ADDR → BT1 (−)",
    source: "BT1 (−) / U2 GND",
    dest: "U1, B1, B2, B3 GND & ADDR, DS1, DS2 GND",
    note: "Single unified ground plane connecting the USB-C MCU and battery-powered peripherals so SPI, I²C, and ADC share one 0 V reference.",
    from: "U2",
    to: ["BT1", "U1", "B1", "B2", "B3", "DS1", "DS2"],
    needsSwitchOn: false,
  },
  {
    id: "GPIO0",
    name: "GPIO0 (SOIL)",
    shortLabel: "GPIO0 (SOIL)",
    group: "adc",
    color: "#059669",
    voltage: "0 – 2.5 V Analog",
    protocol: "ESP32-C3 ADC1_CH0",
    direction: "B1 (AOUT) → U1 (GPIO0)",
    source: "B1 AOUT",
    dest: "U1 GPIO0",
    note: "Continuous analog soil moisture signal from Capacitive Soil Sensor v2.0 sampled by ESP32-C3 ADC1.",
    from: "B1",
    to: ["U1"],
    needsSwitchOn: true,
  },
  {
    id: "GPIO2",
    name: "GPIO2 (SDA)",
    shortLabel: "GPIO2 (SDA)",
    group: "i2c",
    color: "#0284c7",
    voltage: "3.3 V Logic",
    protocol: "Shared I²C Data (100 kHz)",
    direction: "B2 (SDA) & B3 (SDA) ↔ U1 (GPIO2)",
    source: "U1 GPIO2",
    dest: "B2 SDA (0x38/0x76); B3 SDA (0x23)",
    note: "Bidirectional I²C data bus polling AHT20, BMP280, and BH1750 with zero address collision.",
    from: "U1",
    to: ["B2", "B3"],
    needsSwitchOn: true,
  },
  {
    id: "GPIO9",
    name: "GPIO9 (SCL)",
    shortLabel: "GPIO9 (SCL)",
    group: "i2c",
    color: "#2563eb",
    voltage: "3.3 V Logic",
    protocol: "Shared I²C Clock (100 kHz)",
    direction: "U1 (GPIO9) → B2 (SCL) & B3 (SCL)",
    source: "U1 GPIO9",
    dest: "B2 SCL; B3 SCL",
    note: "I²C serial clock line synchronized across temperature, humidity, pressure, and ambient light sensors.",
    from: "U1",
    to: ["B2", "B3"],
    needsSwitchOn: true,
  },
  {
    id: "GPIO4",
    name: "GPIO4 (SCK)",
    shortLabel: "GPIO4 (SCK)",
    group: "spi",
    color: "#7c3aed",
    voltage: "3.3 V Logic",
    protocol: "Shared High-Speed SPI Clock",
    direction: "U1 (GPIO4) → DS1 (SCL) & DS2 (SCL)",
    source: "U1 GPIO4",
    dest: "DS1 SCL (Round); DS2 SCL (2.0″ Rect)",
    note: "Hardware SPI clock shared cleanly by both color TFT displays.",
    from: "U1",
    to: ["DS1", "DS2"],
    needsSwitchOn: true,
  },
  {
    id: "GPIO5",
    name: "GPIO5 (MOSI)",
    shortLabel: "GPIO5 (MOSI)",
    group: "spi",
    color: "#9333ea",
    voltage: "3.3 V Logic",
    protocol: "Shared High-Speed SPI Data",
    direction: "U1 (GPIO5) → DS1 (SDA) & DS2 (SDA)",
    source: "U1 GPIO5",
    dest: "DS1 SDA (Round); DS2 SDA (2.0″ Rect)",
    note: "SPI Master-Out Slave-In pixel & command stream feeding both GC9A01 and ST7789 displays.",
    from: "U1",
    to: ["DS1", "DS2"],
    needsSwitchOn: true,
  },
  {
    id: "GPIO10",
    name: "GPIO10 (RST)",
    shortLabel: "GPIO10 (RST)",
    group: "spi",
    color: "#4f46e5",
    voltage: "3.3 V Logic",
    protocol: "Shared Display Reset",
    direction: "U1 (GPIO10) → DS1 (RST) & DS2 (RST)",
    source: "U1 GPIO10",
    dest: "DS1 RST; DS2 RST",
    note: "Synchronized hardware reset line initializing both TFT controllers cleanly at boot.",
    from: "U1",
    to: ["DS1", "DS2"],
    needsSwitchOn: true,
  },
  {
    id: "GPIO6",
    name: "GPIO6 (RND_DC)",
    shortLabel: "GPIO6 (RND_DC)",
    group: "spi",
    color: "#0d9488",
    voltage: "3.3 V Logic",
    protocol: "Round TFT Data / Command",
    direction: "U1 (GPIO6) → DS1 (DC)",
    source: "U1 GPIO6",
    dest: "DS1 DC (Round GC9A01)",
    note: "Switches the top round GC9A01 controller between register commands and pixel frame data.",
    from: "U1",
    to: ["DS1"],
    needsSwitchOn: true,
  },
  {
    id: "GPIO7",
    name: "GPIO7 (RND_CS)",
    shortLabel: "GPIO7 (RND_CS)",
    group: "spi",
    color: "#14b8a6",
    voltage: "3.3 V Logic",
    protocol: "Round TFT Chip Select",
    direction: "U1 (GPIO7) → DS1 (CS)",
    source: "U1 GPIO7",
    dest: "DS1 CS (Round GC9A01)",
    note: "Active-LOW chip select targeting the round facial expression screen on the shared SPI bus.",
    from: "U1",
    to: ["DS1"],
    needsSwitchOn: true,
  },
  {
    id: "GPIO1",
    name: "GPIO1 (RECT_DC)",
    shortLabel: "GPIO1 (RECT_DC)",
    group: "spi",
    color: "#db2777",
    voltage: "3.3 V Logic",
    protocol: "Rect TFT Data / Command",
    direction: "U1 (GPIO1) → DS2 (DC)",
    source: "U1 GPIO1",
    dest: "DS2 DC (2.0″ ST7789)",
    note: "Switches the bottom 2.0″ ST7789 rectangular telemetry display between commands and pixel data.",
    from: "U1",
    to: ["DS2"],
    needsSwitchOn: true,
  },
  {
    id: "GPIO3",
    name: "GPIO3 (RECT_CS)",
    shortLabel: "GPIO3 (RECT_CS)",
    group: "spi",
    color: "#e11d48",
    voltage: "3.3 V Logic",
    protocol: "Rect TFT Chip Select",
    direction: "U1 (GPIO3) → DS2 (CS)",
    source: "U1 GPIO3",
    dest: "DS2 CS (2.0″ ST7789)",
    note: "Active-LOW chip select targeting the 2.0″ ST7789 live readings & health-score display.",
    from: "U1",
    to: ["DS2"],
    needsSwitchOn: true,
  },
];

export const orchidThresholds = [
  {
    param: "Temperature",
    range: "19 °C – 29 °C",
    note: "Preferred growth band",
    citation: "Orchid Web, n.d.",
    url: "https://www.orchidweb.com/care/general-orchid-growing-conditions",
  },
  {
    param: "Humidity",
    range: "40% – 60% RH",
    note: "Ideal ambient air moisture",
    citation: "Orchid Web, n.d.",
    url: "https://www.orchidweb.com/care/general-orchid-growing-conditions",
  },
  {
    param: "Light",
    range: "10,000 – 50,000 lux",
    note: "Bright indirect light",
    citation: "American Orchid Society, n.d.",
    url: "https://www.aos.org/orchid-care/principles-of-light",
  },
  {
    param: "Watering",
    range: "Near-dry bark",
    note: "Allow bark to approach dryness; alert to water once dry",
    citation: "Orchid Web, n.d.",
    url: "https://www.orchidweb.com/care/general-orchid-growing-conditions",
  },
];

export const drawings = [
  {
    title: "Hardware schematic & real modules",
    tab: "01 / Schematic",
    image: "/images/schematic.png",
    svgDownload: "/images/schematic.svg",
    cleanSvgDownload: "/images/schematic-clean.svg",
    download: "/images/schematic.png",
    desc: "Nine modules. Fourteen nets. Zero ERC errors and zero warnings.",
    meta: "KiCad 10 native schematic · single-node dual-TFT architecture",
    facts: ["9 real modules", "14 verified nets", "0 ERC errors / 0 warnings"],
    note: "Interactive version above lets you hover or tap any component or wire, trace animated current flow, and toggle the SW1 power switch live.",
  },
];

// All original 9 hardware datasheets preserved + ST7789V added for the 2.0" rectangular TFT
export const datasheets: [string, string, string][] = [
  [
    "ESP32-C3",
    "Espressif · chip datasheet",
    "https://documentation.espressif.com/esp32-c3_datasheet_en.pdf",
  ],
  [
    "ESP32-C3-MINI-1",
    "Espressif · module reference¹",
    "https://documentation.espressif.com/esp32-c3-mini-1_datasheet_en.pdf",
  ],
  [
    "BMP280",
    "Bosch Sensortec · datasheet",
    "https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bmp280-ds001.pdf",
  ],
  [
    "AHT20",
    "ASAIR / Aosong · datasheet",
    "https://www.aosong.com/userfiles/files/media/Data%20Sheet%20AHT20.pdf",
  ],
  [
    "BH1750FVI",
    "ROHM datasheet · distributor mirror",
    "https://www.mouser.com/datasheet/2/348/bh1750fvi-e-186247.pdf",
  ],
  [
    "GY-302",
    "Handson Technology · module guide²",
    "https://www.handsontec.com/dataspecs/sensor/BH1750%20Light%20Sensor.pdf",
  ],
  [
    "GC9A01",
    "GalaxyCore datasheet · display-vendor mirror",
    "https://www.buydisplay.com/download/ic/GC9A01A.pdf",
  ],
  [
    "ST7789V",
    "Sitronix · 2.0″ TFT driver datasheet (GMT020-02-8P)",
    "https://www.waveshare.com/w/upload/a/ae/ST7789_Datasheet.pdf",
  ],
  [
    "SSD1306",
    "Solomon Systech datasheet · Adafruit mirror (early prototype)",
    "https://cdn-shop.adafruit.com/datasheets/SSD1306.pdf",
  ],
  ["TLC555", "Texas Instruments · datasheet", "https://www.ti.com/lit/ds/symlink/tlc555.pdf"],
];

export interface ReferenceItem {
  category: "research" | "care" | "policy" | "ai";
  shortCite: string;
  text: string;
  url: string;
  utilization: string;
}

// Exact 14 Harvard-style references matching the team's final reference document & submitted poster
export const references: ReferenceItem[] = [
  {
    category: "care",
    shortCite: "American Orchid Society (n.d.)",
    text: "American Orchid Society (n.d.) Principles of Light. Available at: https://www.aos.org/orchid-care/principles-of-light (Accessed: 19 November 2026).",
    url: "https://www.aos.org/orchid-care/principles-of-light",
    utilization:
      "Used to define the 10,000–50,000 lux bright indirect light target window evaluated by the BH1750 sensor in the Garden Buddy firmware.",
  },
  {
    category: "policy",
    shortCite: "Bahrain Ministry of Municipalities (2025)",
    text: "Bahrain Ministry of Municipalities Affairs & Agriculture (2025) National Afforestation Strategy 2035. Kingdom of Bahrain.",
    url: "https://www.mun.gov.bh/newportal/en/municipal-affairs/projects/national-afforestation-strategy-aims-double-number-trees-bahrain-2035-0",
    utilization:
      "Grounds our local impact narrative in Bahrain’s official target of doubling tree count from 1.8 million to 3.6 million trees by 2035.",
  },
  {
    category: "ai",
    shortCite: "ChatGPT (2026)",
    text: "ChatGPT (2026) AI Language Model Consultation. OpenAI. Available at: https://chatgpt.com (Accessed: 19 November 2026).",
    url: "https://chatgpt.com",
    utilization:
      "Consulted during brainstorming, editorial wording checks, and drafting clarity across project documentation.",
  },
  {
    category: "care",
    shortCite: "Del Castillo, I. (2022)",
    text: "Del Castillo, I. (2022) Dead Houseplants: Average Millennial Has Killed 7 Houseplants, Apartment Therapy. Available at: https://www.apartmenttherapy.com/dead-houseplants-average-37076429 (Accessed: 19 November 2026).",
    url: "https://www.apartmenttherapy.com/dead-houseplants-average-37076429",
    utilization:
      "Provides the opening problem statistics motivating Garden Buddy: 60% worry about proper sunlight, 56% about watering, and 48% about keeping plants alive.",
  },
  {
    category: "research",
    shortCite: "Gaia Project (2026)",
    text: "Gaia Project (2026) ‘From Decoration to Companion: Expressive Affective Face and Numeric Telemetry’, SN Computer Science.",
    url: "https://doi.org/10.1007/s42979-026-05123-0",
    utilization:
      "Informed our dual-screen concept pairing an expressive face with numeric telemetry directly on the plant—without requiring a separate mobile app.",
  },
  {
    category: "ai",
    shortCite: "Gemini AI Assistant (2026)",
    text: "Gemini AI Assistant (2026) AI Assistant Consultation for Project Formatting and Logbook Structuring. Google.",
    url: "https://gemini.google.com",
    utilization:
      "Used for project formatting, reference structuring, and logbook organization throughout the E1110 workflow.",
  },
  {
    category: "research",
    shortCite: "Internet of Plants (IoP) (2026)",
    text: "Internet of Plants (IoP) (2026) ‘Environmental Monitoring Platform’, IoT (MDPI).",
    url: "https://www.mdpi.com/2624-831x/7/3/62",
    utilization:
      "Provided comparative multi-parameter environmental monitoring context for evaluating moisture, light, temperature, and humidity together.",
  },
  {
    category: "policy",
    shortCite: "Kingdom of Bahrain (2025–2026)",
    text: "Kingdom of Bahrain (2025–2026) Zero Neutrality 2060 & Bahrain Voluntary National Review (VNR) Report. Available at: https://sdgs.gov.bh.",
    url: "https://sdgs.gov.bh",
    utilization:
      "Connects standalone moisture-guided watering to Bahrain’s National Water Strategy 2030, Net-Zero 2060 commitment, and national SDG tracking portal.",
  },
  {
    category: "policy",
    shortCite: "NIAD (2021)",
    text: "National Initiative for Agricultural Development (NIAD) (2021) Forever Green (“Dawman Khadra”) Campaign. Kingdom of Bahrain.",
    url: "https://niadbh.com/forever-green/?lang=en",
    utilization:
      "Anchors Garden Buddy’s household and school greening role within Bahrain’s Forever Green national planting campaign.",
  },
  {
    category: "research",
    shortCite: "Nramat et al. (2026)",
    text: "Nramat et al. (2026) ‘IoT-Based Sensor Monitoring and Automated Irrigation Control’, Sustainability.",
    url: "https://doi.org/10.3390/su18115753",
    utilization:
      "Supported ESP32-based sensor integration and threshold-driven plant health monitoring to avoid blind overwatering.",
  },
  {
    category: "care",
    shortCite: "Orchid Web (n.d.)",
    text: "Orchid Web (n.d.) General Orchid Growing Conditions. Available at: https://www.orchidweb.com/care/general-orchid-growing-conditions (Accessed: 19 November 2026).",
    url: "https://www.orchidweb.com/care/general-orchid-growing-conditions",
    utilization:
      "Supplied the calibrated preferred plant ranges programmed into Garden Buddy: 19–29 °C temperature, 40–60% RH humidity, and near-dry bark watering cues.",
  },
  {
    category: "research",
    shortCite: "Placidi, P. et al. (2020)",
    text: "Placidi, P. et al. (2020) ‘Characterization of Low-Cost Capacitive Soil Sensors for IoT Networks’, Sensors.",
    url: "https://doi.org/10.3390/s20123585",
    utilization:
      "Justified selecting the Capacitive Soil Moisture Sensor v2.0 (TLC555) over corrosive resistive probes and calibrating dry/wet output voltage to soil moisture.",
  },
  {
    category: "research",
    shortCite: "Talking Plant Project (2026)",
    text: "Talking Plant Project (2026) ‘Care or Curiosity?: Threshold-Departure Wellbeing Logic’, Proceedings of ACM SUI.",
    url: "https://doi.org/10.1145/3822518.3830051",
    utilization:
      "Guided the threshold-departure scoring logic that maps the count of healthy parameters out of 4 directly onto Happy, Neutral, and Sad expressions.",
  },
  {
    category: "policy",
    shortCite: "United Nations (2015)",
    text: "United Nations (2015) Transforming our world: the 2030 Agenda for Sustainable Development. UN General Assembly.",
    url: "https://sdgs.un.org/2030agenda",
    utilization:
      "Maps Garden Buddy’s water-saving and urban-greening outcomes to UN Sustainable Development Goals 6, 11, 12, 13, and 15.",
  },
];

export const sdgItems = [
  {
    num: 6,
    title: "Clean Water & Sanitation",
    desc: "Stops blind overwatering and saves scarce desalinated water",
    img: "/images/sdgs/sdg-6.png",
    url: "https://sdgs.gov.bh",
    unUrl: "https://sdgs.un.org/goals/goal6",
  },
  {
    num: 11,
    title: "Sustainable Cities & Communities",
    desc: "Encourages everyday urban greening in homes and schools",
    img: "/images/sdgs/sdg-11.png",
    url: "https://sdgs.gov.bh",
    unUrl: "https://sdgs.un.org/goals/goal11",
  },
  {
    num: 12,
    title: "Responsible Consumption & Production",
    desc: "Replaces guesswork with measured moisture and light care",
    img: "/images/sdgs/sdg-12.png",
    url: "https://sdgs.gov.bh",
    unUrl: "https://sdgs.un.org/goals/goal12",
  },
  {
    num: 13,
    title: "Climate Action",
    desc: "Supports Bahrain’s Net-Zero 2060 and low-energy micro-greenery",
    img: "/images/sdgs/sdg-13.png",
    url: "https://sdgs.gov.bh",
    unUrl: "https://sdgs.un.org/goals/goal13",
  },
  {
    num: 15,
    title: "Life on Land",
    desc: "Improves plant survival for NIAD Forever Green & 2035 Afforestation",
    img: "/images/sdgs/sdg-15.png",
    url: "https://sdgs.gov.bh",
    unUrl: "https://sdgs.un.org/goals/goal15",
  },
];

export const team: [string, string][] = [
  ["Bader Alrayes", "bader.alrayes.2026@uni.strath.ac.uk"],
  ["Ahmed Habib", "ahmed.habib.2026@uni.strath.ac.uk"],
  ["Hamza Majed", "hamza.abdelhadi.2026@uni.strath.ac.uk"],
  ["Ahmed Younes", "ahmed.younes.2026@uni.strath.ac.uk"],
];
