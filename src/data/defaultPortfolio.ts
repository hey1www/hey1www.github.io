import type { LocaleText, Portfolio } from "../types/portfolio";
import {
  CANVAS_CARD_SIZE,
  CANVAS_COMPACT_CARD_SIZE,
  CANVAS_DENSE_CARD_SIZE,
  CANVAS_LANE_Y,
  CANVAS_PRIMARY_CARD_SIZE,
  CANVAS_PROFILE_SIZE,
} from "../config/canvasLayout";

const text = (en: string, zhHans: string, zhHant: string): LocaleText => ({ en, zhHans, zhHant });

const DETAIL_TITLES = {
  overview: text("Project Overview", "项目概述", "專案概述"),
  problem: text("Problem", "解决的问题", "解決的問題"),
  role: text("My Role", "我的职责", "我的職責"),
  engineering: text("Key Engineering Decisions", "关键工程设计", "關鍵工程設計"),
  evidence: text("Results & Evidence", "结果与证据", "結果與證據"),
  stack: text("Tech Stack & Links", "技术栈与链接", "技術棧與連結"),
} as const;

/**
 * The single source of truth for the public-facing portfolio.
 * Text is taken from the PDF résumé master (中 / EN, 2026-05-31).
 * Sidebar / detail UI labels are inlined into the data so we can stay
 * data-driven.
 */
export const defaultPortfolio: Portfolio = {
  meta: {
    name: {
      en: "WANG Zouheyi",
      zhHans: "王邹鹤仪",
      zhHant: "王鄒鶴儀",
    },
    displayName: {
      en: "WANG Zouheyi",
      zhHans: "王邹鹤仪",
      zhHant: "王鄒鶴儀",
    },
    tagline: {
      en: "WANG Zouheyi",
      zhHans: "王邹鹤仪\nWANG Zouheyi",
      zhHant: "王鄒鶴儀\nWANG Zouheyi",
    },
    defaultLocale: "en",
  },

  profile: {
    email: "heyi.acct@outlook.com",
    github: "https://github.com/hey1www",
    linkedin: "https://www.linkedin.com/in/hey1www/",
    cvUrl: "mailto:heyi.acct@outlook.com",
    location: {
      en: "Hong Kong · Open to relocate",
      zhHans: "香港 · 可考虑异地",
      zhHant: "香港 · 可考慮異地",
    },
  },

  skillTracks: [
    {
      id: "llm-ai",
      label: text("LLM & AI Engineering", "LLM 与 AI 工程", "LLM 與 AI 工程"),
      keywords: [
        "RAG",
        "Prompt Engineering",
        "Multimodal LLM",
        "Context Management",
        "AI Coding",
        "LLM Evaluation",
      ].map((value) => text(value, value, value)),
    },
    {
      id: "ai-vision",
      label: text("AI, Vision & Intelligent Systems", "AI、视觉与智能系统", "AI、視覺與智能系統"),
      keywords: [
        "PyTorch",
        "YOLOv5",
        "OpenCV",
        "Reinforcement Learning",
        "Imitation Learning",
        "Point Cloud",
      ].map((value) => text(value, value, value)),
    },
    {
      id: "software-data",
      label: text("Software & Data Systems", "软件与数据系统", "軟體與資料系統"),
      keywords: [
        "Python",
        "TypeScript",
        "FastAPI",
        "Vue 3",
        "REST API",
        "SQLite",
        "SQLAlchemy",
        "Data Pipeline",
        "Docker",
      ].map((value) => text(value, value, value)),
    },
    {
      id: "iot-device",
      label: text("IoT & Devices", "物联网与设备", "物聯網與裝置"),
      keywords: [
        "ESP8266",
        "MQTT",
        "Jetson",
        "UART",
        "Arduino C++",
        "Embedded Systems",
      ].map((value) => text(value, value, value)),
    },
  ],

  skills: [
    { id: "python", label: { en: "Python", zhHans: "Python", zhHant: "Python" }, category: "language" },
    { id: "java", label: { en: "Java", zhHans: "Java", zhHant: "Java" }, category: "language" },
    { id: "typescript", label: { en: "TypeScript", zhHans: "TypeScript", zhHant: "TypeScript" }, category: "language" },
    { id: "javascript", label: { en: "JavaScript", zhHans: "JavaScript", zhHant: "JavaScript" }, category: "language" },
    { id: "swift", label: { en: "Swift", zhHans: "Swift", zhHant: "Swift" }, category: "language" },
    { id: "cpp", label: { en: "C/C++", zhHans: "C/C++", zhHant: "C/C++" }, category: "language" },
    { id: "sql", label: { en: "SQL", zhHans: "SQL", zhHant: "SQL" }, category: "language" },
    { id: "liquid", label: { en: "Liquid", zhHans: "Liquid", zhHant: "Liquid" }, category: "language" },
    { id: "html-css", label: { en: "HTML/CSS", zhHans: "HTML/CSS", zhHant: "HTML/CSS" }, category: "language" },

    { id: "pytorch", label: { en: "PyTorch", zhHans: "PyTorch", zhHant: "PyTorch" }, category: "ai" },
    { id: "llm", label: { en: "LLM Integration", zhHans: "LLM 集成", zhHant: "LLM 整合" }, category: "ai" },
    { id: "prompt", label: { en: "Prompt Engineering", zhHans: "提示词工程", zhHant: "提示詞工程" }, category: "ai" },
    { id: "rag", label: { en: "RAG Workflow", zhHans: "RAG 工作流", zhHant: "RAG 工作流" }, category: "ai" },
    { id: "imitation", label: { en: "Imitation Learning", zhHans: "模仿学习", zhHant: "模仿學習" }, category: "ml" },
    { id: "rl", label: { en: "Reinforcement Learning", zhHans: "强化学习", zhHant: "強化學習" }, category: "ml" },
    { id: "graph-policy", label: { en: "Graph Policy", zhHans: "图级策略", zhHant: "圖級策略" }, category: "ml" },
    { id: "yolov5", label: { en: "YOLOv5", zhHans: "YOLOv5", zhHant: "YOLOv5" }, category: "ml" },
    { id: "cv", label: { en: "OpenCV", zhHans: "OpenCV", zhHant: "OpenCV" }, category: "ml" },
    { id: "pointcloud", label: { en: "Point Cloud", zhHans: "点云处理", zhHant: "點雲處理" }, category: "ml" },

    { id: "react", label: { en: "React", zhHans: "React", zhHant: "React" }, category: "web" },
    { id: "vue", label: { en: "Vue 3", zhHans: "Vue 3", zhHant: "Vue 3" }, category: "web" },
    { id: "vite", label: { en: "Vite", zhHans: "Vite", zhHant: "Vite" }, category: "web" },
    { id: "fastapi", label: { en: "FastAPI", zhHans: "FastAPI", zhHant: "FastAPI" }, category: "web" },
    { id: "django", label: { en: "Django", zhHans: "Django", zhHant: "Django" }, category: "web" },
    { id: "shopify", label: { en: "Shopify", zhHans: "Shopify", zhHant: "Shopify" }, category: "web" },
    { id: "echarts", label: { en: "ECharts", zhHans: "ECharts", zhHant: "ECharts" }, category: "web" },
    { id: "node", label: { en: "Node.js", zhHans: "Node.js", zhHant: "Node.js" }, category: "web" },
    { id: "mongodb", label: { en: "MongoDB", zhHans: "MongoDB", zhHant: "MongoDB" }, category: "web" },
    { id: "rn", label: { en: "React Native", zhHans: "React Native", zhHant: "React Native" }, category: "web" },
    { id: "wxapp", label: { en: "WeChat Mini Program", zhHans: "微信小程序", zhHant: "微信小程式" }, category: "web" },
    { id: "rest-api", label: { en: "REST API", zhHans: "REST API", zhHant: "REST API" }, category: "web" },
    { id: "tailwind", label: { en: "Tailwind CSS", zhHans: "Tailwind CSS", zhHant: "Tailwind CSS" }, category: "web" },

    { id: "numpy", label: { en: "NumPy", zhHans: "NumPy", zhHant: "NumPy" }, category: "data" },
    { id: "networkx", label: { en: "NetworkX", zhHans: "NetworkX", zhHant: "NetworkX" }, category: "data" },
    { id: "cvxpy", label: { en: "CVXPY", zhHans: "CVXPY", zhHant: "CVXPY" }, category: "data" },
    { id: "matplotlib", label: { en: "Matplotlib", zhHans: "Matplotlib", zhHant: "Matplotlib" }, category: "data" },
    { id: "sqlite", label: { en: "SQLite", zhHans: "SQLite", zhHant: "SQLite" }, category: "data" },
    { id: "sqlalchemy", label: { en: "SQLAlchemy", zhHans: "SQLAlchemy", zhHant: "SQLAlchemy" }, category: "data" },
    { id: "jupyter", label: { en: "Jupyter Notebook", zhHans: "Jupyter Notebook", zhHant: "Jupyter Notebook" }, category: "data" },
    { id: "apscheduler", label: { en: "APScheduler", zhHans: "APScheduler", zhHant: "APScheduler" }, category: "data" },
    { id: "blender-python", label: { en: "Blender Python", zhHans: "Blender Python", zhHant: "Blender Python" }, category: "data" },
    { id: "data-pipeline", label: { en: "Data Pipeline", zhHans: "数据管线", zhHant: "資料管線" }, category: "data" },

    { id: "uart", label: { en: "UART/PWM", zhHans: "UART/PWM", zhHant: "UART/PWM" }, category: "robotics" },
    { id: "jetson", label: { en: "Jetson Orin Nano", zhHans: "Jetson Orin Nano", zhHant: "Jetson Orin Nano" }, category: "robotics" },
    { id: "raspberrypi", label: { en: "Raspberry Pi", zhHans: "Raspberry Pi", zhHant: "Raspberry Pi" }, category: "robotics" },
    { id: "robot-vision", label: { en: "Robot Vision", zhHans: "机器人视觉", zhHant: "機器人視覺" }, category: "robotics" },
    { id: "control-logic", label: { en: "Control Logic", zhHans: "控制逻辑", zhHant: "控制邏輯" }, category: "robotics" },

    { id: "esp8266", label: { en: "ESP8266", zhHans: "ESP8266", zhHant: "ESP8266" }, category: "iot" },
    { id: "arduino-c", label: { en: "Arduino C/C++", zhHans: "Arduino C/C++", zhHant: "Arduino C/C++" }, category: "iot" },
    { id: "mqtt", label: { en: "MQTT", zhHans: "MQTT", zhHant: "MQTT" }, category: "iot" },
    { id: "json-iot", label: { en: "JSON", zhHans: "JSON", zhHant: "JSON" }, category: "iot" },
    { id: "led-mat", label: { en: "8×8 LED Matrix", zhHans: "8×8 LED 点阵", zhHant: "8×8 LED 點陣" }, category: "iot" },
    { id: "rgb-led", label: { en: "RGB LED", zhHans: "RGB LED", zhHant: "RGB LED" }, category: "iot" },
    { id: "embedded-systems", label: { en: "Embedded Systems", zhHans: "嵌入式系统", zhHant: "嵌入式系統" }, category: "iot" },

    { id: "swiftui", label: { en: "SwiftUI", zhHans: "SwiftUI", zhHant: "SwiftUI" }, category: "tool" },
    { id: "mvvm", label: { en: "MVVM", zhHans: "MVVM", zhHant: "MVVM" }, category: "tool" },
    { id: "xcode", label: { en: "Xcode", zhHans: "Xcode", zhHant: "Xcode" }, category: "tool" },
    { id: "roboflow", label: { en: "Roboflow", zhHans: "Roboflow", zhHant: "Roboflow" }, category: "tool" },
    { id: "pyserial", label: { en: "PySerial", zhHans: "PySerial", zhHant: "PySerial" }, category: "tool" },
    { id: "github-actions", label: { en: "GitHub Actions", zhHans: "GitHub Actions", zhHant: "GitHub Actions" }, category: "tool" },
    { id: "perf", label: { en: "Performance Optimization", zhHans: "网页性能优化", zhHant: "網頁效能優化" }, category: "tool" },
    { id: "git", label: { en: "Git", zhHans: "Git", zhHant: "Git" }, category: "tool" },
    { id: "docker", label: { en: "Docker", zhHans: "Docker", zhHant: "Docker" }, category: "tool" },
    { id: "matlab", label: { en: "MATLAB", zhHans: "MATLAB", zhHant: "MATLAB" }, category: "tool" },
    { id: "codex", label: { en: "Codex", zhHans: "Codex", zhHant: "Codex" }, category: "tool" },
    { id: "linux", label: { en: "Linux", zhHans: "Linux", zhHant: "Linux" }, category: "tool" },
    { id: "jetpack", label: { en: "JetPack/CUDA", zhHans: "JetPack/CUDA", zhHant: "JetPack/CUDA" }, category: "tool" },

    { id: "industry-research", label: { en: "Industry Research", zhHans: "行业研究", zhHant: "行業研究" }, category: "business" },
    { id: "data-support", label: { en: "Data Support", zhHans: "数据支持", zhHant: "數據支援" }, category: "business" },
    { id: "documentation", label: { en: "Documentation", zhHans: "文档撰写", zhHant: "文件撰寫" }, category: "business" },
    { id: "api-workflow", label: { en: "API Workflow", zhHans: "API 工作流", zhHant: "API 工作流" }, category: "business" },
    { id: "workflow-test", label: { en: "Workflow Testing", zhHans: "工作流测试", zhHant: "工作流測試" }, category: "business" },
    { id: "knowledge-base", label: { en: "Knowledge Base", zhHans: "知识库", zhHant: "知識庫" }, category: "business" },

    { id: "management", label: { en: "Management & Innovation", zhHans: "管理与创新", zhHant: "管理與創新" }, category: "communication" },
    { id: "cross-cultural", label: { en: "Cross-cultural Communication", zhHans: "跨文化沟通", zhHant: "跨文化溝通" }, category: "communication" },
    { id: "french", label: { en: "French", zhHans: "法语作为外语", zhHant: "法語作為外語" }, category: "communication" },
    { id: "video-script", label: { en: "Video Script", zhHans: "视频脚本", zhHant: "影片腳本" }, category: "communication" },
  ],

  cards: [
    // ---------- Profile ----------
    {
      id: "profile-main",
      group: "profile",
      title: {
        en: "WANG ZOUHEYI",
        zhHans: "王邹鹤仪",
        zhHant: "王鄒鶴儀",
      },
      subtitle: {
        en: "WANG Zouheyi",
        zhHans: "WANG Zouheyi",
        zhHant: "WANG Zouheyi",
      },
      role: {
        en: "AI & Software Engineer | LLM Workflows, Automation & Data Systems",
        zhHans: "AI 与软件工程师｜LLM 工作流、智能自动化与数据系统",
        zhHant: "AI 與軟體工程師｜LLM 工作流程、智能自動化與資料系統",
      },
      timeLabel: {
        en: "Personal Information",
        zhHans: "个人信息",
        zhHant: "個人資訊",
      },
      summary: {
        en: "2026 graduate of The Hong Kong Polytechnic University in Artificial Intelligence and Information Engineering, focused on LLM applications, AI automation, data systems, and intelligent devices. Experienced across the full project lifecycle, from requirements analysis and prototyping to model or rule-based logic, frontend and backend development, evaluation, and deployment.",
        zhHans: "2026 届香港理工大学人工智能与资讯工程毕业生，关注 LLM 应用、AI 自动化、数据系统与智能设备。具备从需求拆解、原型设计、模型或规则逻辑，到前后端开发、评测和部署的完整项目经验。",
        zhHant: "2026 屆香港理工大學人工智能與資訊工程畢業生，關注 LLM 應用、AI 自動化、資料系統與智能裝置。具備從需求拆解、原型設計、模型或規則邏輯，到前後端開發、評測與部署的完整專案經驗。",
      },
      details: {
        overview: {
          en: "My projects span AI, full-stack software, computer vision, robotics, IoT, and data engineering.",
          zhHans: "我的项目横跨 AI、全栈软件、计算机视觉、机器人、物联网和数据工程。",
          zhHant: "我的專案橫跨 AI、全端軟體、電腦視覺、機器人、物聯網與資料工程。",
        },
        whatIDid: [],
        sections: [
          {
            id: "profile",
            title: text("Professional Profile", "个人简介", "個人簡介"),
            paragraphs: [
              text(
                "My projects span AI, full-stack software, computer vision, robotics, IoT, and data engineering. Rather than focusing solely on model training, I am most interested in connecting models, data, APIs, user interfaces, and business workflows into systems that work in practice.",
                "我的项目横跨 AI、全栈软件、计算机视觉、机器人、物联网和数据工程。相比单独训练模型，我更关注如何把模型、数据、API、用户界面和业务流程连接成能够实际运行的系统。",
                "我的專案橫跨 AI、全端軟體、電腦視覺、機器人、物聯網與資料工程。相比單獨訓練模型，我更關注如何將模型、資料、API、使用者介面與業務流程串接成可實際運作的系統。"
              ),
              text(
                "I have built a RAG customer-service workflow, a communication-aware UAV path-planning system, a real-time robot-vision control system, a restaurant queue data platform, and an AI coding assistant that understands screenshots and surrounding context. I use AI coding tools extensively for requirements breakdown, code generation, refactoring, testing, and debugging, while retaining control over system architecture, code logic, and engineering decisions.",
                "我曾开发 RAG 客服工作流、通信感知无人机路径规划系统、实时机器人视觉控制系统、餐厅排队数据平台，以及基于截图和上下文理解的 AI Coding 助手。日常开发中广泛使用 AI 编程工具进行需求拆解、代码生成、重构、测试和问题定位，同时保留对系统架构、代码逻辑与工程决策的控制。",
                "我曾開發 RAG 客服工作流程、通訊感知無人機路徑規劃系統、即時機器人視覺控制系統、餐廳排隊資料平台，以及基於螢幕截圖與上下文理解的 AI Coding 助手。日常開發中廣泛使用 AI 編程工具進行需求拆解、程式碼生成、重構、測試與問題定位，同時保留對系統架構、程式碼邏輯與工程決策的控制。"
              ),
            ],
          },
          {
            id: "capabilities",
            title: text("Core Capabilities", "核心能力", "核心能力"),
            paragraphs: [
              text(
                "LLM Application · AI Automation · Python · TypeScript · FastAPI · Vue · PyTorch · Computer Vision · Data Pipeline · Docker",
                "LLM Application · AI Automation · Python · TypeScript · FastAPI · Vue · PyTorch · Computer Vision · Data Pipeline · Docker",
                "LLM Application · AI Automation · Python · TypeScript · FastAPI · Vue · PyTorch · Computer Vision · Data Pipeline · Docker"
              ),
            ],
          },
          {
            id: "foundation",
            title: text("Interdisciplinary Foundation", "交叉背景", "跨領域背景"),
            paragraphs: [
              text(
                "My undergraduate studies covered AI, data structures, databases, web and mobile development, computer vision, deep learning, IoT, and communication systems, giving me a broad interdisciplinary foundation across AI and software engineering.",
                "我的本科阶段覆盖 AI、数据结构、数据库、Web、移动开发、计算机视觉、深度学习、物联网和通信系统等课程，拥有较完整的 AI 与软件工程交叉背景。",
                "我的本科階段涵蓋 AI、資料結構、資料庫、Web、行動開發、電腦視覺、深度學習、物聯網與通訊系統等課程，具備較完整的 AI 與軟體工程跨領域背景。"
              ),
            ],
          },
        ],
        links: [
          { label: { en: "Email", zhHans: "邮箱", zhHant: "郵箱" }, url: "mailto:heyi.acct@outlook.com" },
          { label: { en: "GitHub", zhHans: "GitHub", zhHant: "GitHub" }, url: "https://github.com/hey1www" },
          { label: { en: "LinkedIn", zhHans: "LinkedIn", zhHant: "LinkedIn" }, url: "https://www.linkedin.com/in/hey1www/" },
        ],
      },
      skills: [],
      trackIds: [],
      position: { x: 0, y: CANVAS_LANE_Y.profile },
      size: { ...CANVAS_PROFILE_SIZE },
      emphasis: "primary",
    },

    // ---------- Education ----------
    {
      id: "edu-polyu",
      group: "education",
      title: {
        en: "The Hong Kong Polytechnic University",
        zhHans: "香港理工大学",
        zhHant: "香港理工大學",
      },
      subtitle: {
        en: "BSc (Hons) Artificial Intelligence and Information Engineering, 2026",
        zhHans: "人工智能与资讯工程学理学士（荣誉），2022–2026",
        zhHant: "人工智能與資訊工程學理學士（榮譽），2022–2026",
      },
      timeLabel: {
        en: "August 2022 – July 2026",
        zhHans: "2022 年 8 月 – 2026 年 7 月",
        zhHant: "2022 年 8 月 – 2026 年 7 月",
      },
      startDate: "2022-08",
      endDate: "2026-07",
      summary: {
        en: "Systematic training in artificial intelligence, software engineering, databases, web systems, computer vision, deep learning, IoT, and communications, reinforced through hands-on robotics, UAV, and data-platform projects.",
        zhHans: "系统学习人工智能、软件工程、数据库、Web、计算机视觉、深度学习、物联网及通信系统，并通过机器人、无人机和数据平台项目完成工程实践。",
        zhHant: "系統學習人工智能、軟體工程、資料庫、Web、電腦視覺、深度學習、物聯網與通訊系統，並透過機器人、無人機及資料平台專案完成工程實踐。",
      },
      details: {
        overview: {
          en: "Selected Coursework:",
          zhHans: "相关课程:",
          zhHant: "相關課程:",
        },
        whatIDid: [
          {
            en: "AI / Data: Computer Vision and Pattern Recognition; Deep Learning and Deep Neural Networks; Machine Learning in Cyber-Security; Big Data Analytics.",
            zhHans: "AI / 数据:计算机视觉与模式识别;深度学习与深度神经网络;网络安全中的机器学习;大数据分析。",
            zhHant: "AI / 數據:計算機視覺與模式識別;深度學習與深度神經網路;網路安全中的機器學習;大數據分析。",
          },
          {
            en: "Software / Systems: Data Structures; Object-Oriented Design and Programming; Database Systems; Web Systems and Technologies; Mobile Systems and Application Development; Computer Systems Principles.",
            zhHans: "软件 / 系统:数据结构;面向对象设计与编程;数据库系统;Web 系统与技术;移动系统与应用开发;计算机系统原理。",
            zhHant: "軟體 / 系統:資料結構;物件導向設計與程式設計;資料庫系統;Web 系統與技術;行動系統與應用開發;計算機系統原理。",
          },
          {
            en: "IoT / Networking: Internet of Things; Data and Computer Communications.",
            zhHans: "物联网 / 网络:物联网;数据与计算机通信。",
            zhHant: "物聯網 / 網路:物聯網;資料與電腦通訊。",
          },
        ],
        sections: [
          {
            id: "degree",
            title: text("Degree", "学位", "學位"),
            paragraphs: [
              text(
                "BSc (Hons) in Artificial Intelligence and Information Engineering, 2022–2026.",
                "人工智能与资讯工程学理学士（荣誉），2022–2026。",
                "人工智能與資訊工程學理學士（榮譽），2022–2026。"
              ),
            ],
          },
          {
            id: "study",
            title: text("Areas of Study", "学习方向", "學習方向"),
            paragraphs: [
              text(
                "Coursework covered foundations of artificial intelligence, machine learning, deep learning, computer vision, machine learning in cybersecurity, big data analytics, data structures, object-oriented programming, databases, web systems, mobile applications, computer systems, the Internet of Things, and data communications.",
                "课程覆盖人工智能基础、机器学习、深度学习、计算机视觉、网络安全中的机器学习、大数据分析、数据结构、面向对象编程、数据库、Web 系统、移动应用、计算机系统、物联网与数据通信。",
                "課程涵蓋人工智能基礎、機器學習、深度學習、電腦視覺、網路安全中的機器學習、大數據分析、資料結構、物件導向程式設計、資料庫、Web 系統、行動應用、電腦系統、物聯網與資料通訊。"
              ),
            ],
          },
          {
            id: "capability",
            title: text("Capability Framework", "能力结构", "能力結構"),
            paragraphs: [text("My undergraduate training enables me to understand:", "本科训练使我能够同时理解：", "本科訓練使我能夠同時理解：")],
            items: [
              text("How AI models are trained and evaluated.", "AI 模型如何训练和评估。", "AI 模型如何訓練與評估。"),
              text("How software systems organise data, interfaces, and business logic.", "软件系统如何组织数据、接口与业务逻辑。", "軟體系統如何組織資料、介面與業務邏輯。"),
              text("How intelligent devices combine sensors, communication protocols, and control logic into complete systems.", "智能设备如何通过传感器、通信协议和控制逻辑形成完整系统。", "智能裝置如何透過感測器、通訊協定與控制邏輯形成完整系統。"),
              text("How research prototypes can become testable and demonstrable engineering implementations.", "研究原型如何进一步转化为可测试、可演示的工程实现。", "研究原型如何進一步轉化為可測試、可展示的工程實作。"),
            ],
          },
          {
            id: "practice",
            title: text("Representative Work", "代表性实践", "代表性實踐"),
            paragraphs: [
              text(
                "My final-year project focused on communication-aware UAV path planning; an integrated project delivered an autonomous robot car based on YOLOv5 and Jetson; coursework covered MQTT IoT monitoring, SwiftUI mobile applications, and web data systems.",
                "毕业设计聚焦通信连接质量感知的无人机路径规划；综合项目完成基于 YOLOv5 和 Jetson 平台的自主智能小车；课程项目覆盖 MQTT 物联网监测、SwiftUI 移动应用和 Web 数据系统。",
                "畢業設計聚焦通訊連線品質感知的無人機路徑規劃；綜合專案完成基於 YOLOv5 與 Jetson 平台的自主智能小車；課程專案涵蓋 MQTT 物聯網監測、SwiftUI 行動應用與 Web 資料系統。"
              ),
            ],
          },
        ],
      },
      skills: [],
      trackIds: [],
      position: { x: 0, y: CANVAS_LANE_Y.education },
      size: { ...CANVAS_CARD_SIZE },
    },
    {
      id: "edu-insa",
      group: "education",
      title: {
        en: "National Institute of Applied Sciences of Lyon",
        zhHans: "法国里昂国立应用科学学院",
        zhHant: "法國里昂國立應用科學學院",
      },
      subtitle: {
        en: "INNOV @ INSA Exchange Program",
        zhHans: "INNOV @ INSA 交换项目",
        zhHant: "INNOV @ INSA 交換專案",
      },
      timeLabel: {
        en: "May – June 2025",
        zhHans: "2025 年 5 月 – 2025 年 6 月",
        zhHant: "2025 年 5 月 – 2025 年 6 月",
      },
      startDate: "2025-05",
      endDate: "2025-06",
      summary: {
        en: "Joined the INNOV @ INSA international exchange programme, studying innovation management, design thinking, and international collaboration in a cross-cultural team environment.",
        zhHans: "参加 INNOV @ INSA 国际交换项目，在跨文化团队环境中学习创新管理、设计思维与国际协作。",
        zhHant: "參加 INNOV @ INSA 國際交換專案，在跨文化團隊環境中學習創新管理、設計思維與國際協作。",
      },
      details: {
        overview: {
          en: "Short exchange program covering management, innovation, cross-cultural communication and French.",
          zhHans: "短期交换项目,涵盖管理、创新、跨文化沟通与法语。",
          zhHant: "短期交換專案,涵蓋管理、創新、跨文化溝通與法語。",
        },
        whatIDid: [
          {
            en: "Collaborated with international teams on innovation case studies.",
            zhHans: "与国际团队协作完成创新案例研究。",
            zhHant: "與國際團隊協作完成創新案例研究。",
          },
          {
            en: "Improved cross-cultural communication and basic French.",
            zhHans: "提升跨文化沟通能力与基础法语。",
            zhHant: "提升跨文化溝通能力與基礎法語。",
          },
        ],
        sections: [
          {
            id: "exchange",
            title: text("Exchange Experience", "交换经历", "交換經歷"),
            paragraphs: [
              text(
                "I participated in the INNOV @ INSA programme at the National Institute of Applied Sciences of Lyon from May to June 2025.",
                "2025 年 5 月至 6 月参加法国里昂国立应用科学学院的 INNOV @ INSA 项目。",
                "2025 年 5 月至 6 月參加法國里昂國立應用科學學院的 INNOV @ INSA 專案。"
              ),
              text(
                "The programme covered management and innovation, cross-cultural communication, and French language study. It broadened my understanding beyond technology to include product definition, team collaboration, and innovation processes, while requiring me to discuss, present, and work effectively in a multicultural environment.",
                "项目内容涵盖管理与创新、跨文化沟通及法语学习。该经历拓展了我在技术之外对产品定义、团队协作和创新流程的理解，也让我在多文化环境中完成讨论、展示和协作任务。",
                "專案內容涵蓋管理與創新、跨文化溝通及法語學習。這段經歷拓展了我在技術之外對產品定義、團隊協作與創新流程的理解，也讓我在多文化環境中完成討論、展示與協作任務。"
              ),
            ],
          },
          {
            id: "perspective",
            title: text("Engineering Perspective", "工程视角", "工程視角"),
            paragraphs: [
              text(
                "The experience gave me a more complete engineering perspective: technical solutions must also account for user needs, communication costs, implementation constraints, and the way the final result will be delivered.",
                "这段经历帮助我形成了更完整的工程视角：技术方案需要同时考虑用户需求、沟通成本、实施条件和最终交付方式。",
                "這段經歷幫助我形成更完整的工程視角：技術方案亦需同時考慮使用者需求、溝通成本、實施條件與最終交付方式。"
              ),
            ],
          },
        ],
      },
      skills: [],
      trackIds: [],
      position: { x: 520, y: CANVAS_LANE_Y.education + 30 },
      size: { ...CANVAS_COMPACT_CARD_SIZE },
    },

    // ---------- Internships ----------
    {
      id: "intern-ddiin",
      group: "internship",
      title: {
        en: "Ddiin Concept",
        zhHans: "Ddiin Concept",
        zhHant: "Ddiin Concept",
      },
      subtitle: {
        en: "Web Programmer Intern · Hong Kong",
        zhHans: "网页开发实习生 · 香港",
        zhHant: "網頁開發實習生 · 香港",
      },
      timeLabel: {
        en: "July – August 2025",
        zhHans: "2025 年 7 月 – 2025 年 8 月",
        zhHant: "2025 年 7 月 – 2025 年 8 月",
      },
      startDate: "2025-07",
      endDate: "2025-08",
      summary: {
        en: "Shopify / Liquid front-end, web performance, and RAG-driven LLM customer-service automation.",
        zhHans: "Shopify / Liquid 前端开发、网页性能优化与基于 RAG 的 LLM 客服自动化。",
        zhHant: "Shopify / Liquid 前端開發、網頁效能優化與基於 RAG 的 LLM 客服自動化。",
      },
      details: {
        overview: {
          en: "Joined Ddiin Concept as a web programmer intern focused on Shopify theme customisation, performance, and an LLM-backed customer service workflow.",
          zhHans: "在 Ddiin Concept 担任网页开发实习生,聚焦 Shopify 主题定制、网页性能优化与 LLM 客服工作流。",
          zhHant: "在 Ddiin Concept 擔任網頁開發實習生,聚焦 Shopify 主題客製、網頁效能優化與 LLM 客服工作流。",
        },
        whatIDid: [
          {
            en: "Shopify / Liquid Front-end Development: Customised Shopify theme components using Liquid, HTML/CSS, and JavaScript, including a homepage video carousel and an Instagram-style video feed to improve product presentation and page flexibility.",
            zhHans: "Shopify / Liquid 前端开发:使用 Liquid、HTML/CSS 和 JavaScript 定制 Shopify 主题组件,包括首页视频轮播和类似 Instagram 的视频流展示模块,以提升商品展示效果和页面灵活性。",
            zhHant: "Shopify / Liquid 前端開發:使用 Liquid、HTML/CSS 與 JavaScript 客製 Shopify 主題元件,包含首頁影片輪播與 Instagram 風格影片流模組,以提升商品展示效果與頁面靈活性。",
          },
          {
            en: "Web Performance Optimization: Improved website loading speed by compressing media files, adjusting loading logic, using lazy loading, and optimising image/video delivery; reduced observed page loading time from 3s to 0.5s.",
            zhHans: "网页性能优化:通过压缩媒体文件、调整加载逻辑、使用懒加载,以及优化图片和视频资源加载方式,提升网站加载速度;观察到的页面加载时间从约 3 秒降低至 0.5 秒。",
            zhHant: "網頁效能優化:透過壓縮媒體檔案、調整載入邏輯、延遲載入,以及優化圖片與影片資源載入方式,提升網站載入速度;觀察到的頁面載入時間從約 3 秒降低至 0.5 秒。",
          },
          {
            en: "LLM Customer Service Automation: Designed a RAG-driven LLM workflow for the store's customer service chat by constructing a vector product knowledge base for accurate context retrieval. Managed API logic, prompt engineering, and backend testing; authored a maintenance guide enabling non-technical staff to update the RAG document pipeline after deployment.",
            zhHans: "LLM 客服自动化:为商店客服设计基于 RAG 的 LLM 工作流,构建向量商品知识库以实现精准的上下文检索;负责提示词设计、API 交互和后台测试,并撰写手册,方便非技术人员在部署后管理 RAG 文档管线。",
            zhHant: "LLM 客服自動化:為商店客服設計基於 RAG 的 LLM 工作流,建構向量商品知識庫以實現精準的上下文檢索;負責提示詞設計、API 互動與後台測試,並撰寫手冊,方便非技術人員在部署後管理 RAG 文件管線。",
          },
        ],
        tech: {
          en: "Shopify, Liquid, HTML/CSS, JavaScript, LLM, RAG, Prompt Engineering, API Workflow, Knowledge Base, Performance Optimization",
          zhHans: "Shopify、Liquid、HTML/CSS、JavaScript、LLM、RAG、提示词工程、API 工作流、知识库、性能优化",
          zhHant: "Shopify、Liquid、HTML/CSS、JavaScript、LLM、RAG、提示詞工程、API 工作流、知識庫、效能優化",
        },
        sections: [
          { id: "overview", title: DETAIL_TITLES.overview, paragraphs: [text("Web engineering internship spanning Shopify front-end work, performance optimisation, and a RAG-based customer-service workflow.", "涵盖 Shopify 前端开发、性能优化与 RAG 客服工作流的网页工程实习。", "涵蓋 Shopify 前端開發、效能優化與 RAG 客服工作流程的網頁工程實習。")] },
          { id: "problem", title: DETAIL_TITLES.problem, paragraphs: [text("The storefront needed more flexible media presentation, faster page delivery, and a maintainable way to answer product questions with grounded context.", "商店需要更灵活的媒体展示、更快的页面加载，以及能够基于可靠商品上下文回答问题的可维护客服方案。", "商店需要更靈活的媒體展示、更快的頁面載入，以及能夠基於可靠商品上下文回答問題的可維護客服方案。")] },
          { id: "role", title: DETAIL_TITLES.role, items: [text("Built Shopify/Liquid interface components.", "开发 Shopify/Liquid 界面组件。", "開發 Shopify/Liquid 介面元件。"), text("Optimised image and video delivery.", "优化图片与视频资源加载。", "優化圖片與影片資源載入。"), text("Designed and tested the RAG customer-service workflow.", "设计并测试 RAG 客服工作流。", "設計並測試 RAG 客服工作流程。") ] },
          { id: "engineering", title: DETAIL_TITLES.engineering, items: [text("Combined media compression, lazy loading, and loading-logic changes.", "结合媒体压缩、懒加载和加载逻辑调整。", "結合媒體壓縮、延遲載入與載入邏輯調整。"), text("Used a vector product knowledge base, prompt engineering, and API logic to ground LLM responses.", "通过向量商品知识库、提示词工程与 API 逻辑约束 LLM 回答。", "透過向量商品知識庫、提示詞工程與 API 邏輯約束 LLM 回答。") ] },
          { id: "evidence", title: DETAIL_TITLES.evidence, metrics: [text("Observed page load time: approximately 3 s → 0.5 s", "观察到的页面加载时间：约 3 秒 → 0.5 秒", "觀察到的頁面載入時間：約 3 秒 → 0.5 秒"), text("Delivered a maintenance guide for non-technical staff", "交付供非技术人员维护 RAG 文档管线的操作手册", "交付供非技術人員維護 RAG 文件管線的操作手冊") ] },
          { id: "stack", title: DETAIL_TITLES.stack, paragraphs: [text("Shopify · Liquid · HTML/CSS · JavaScript · LLM · RAG · Prompt Engineering · API Workflow · Knowledge Base", "Shopify · Liquid · HTML/CSS · JavaScript · LLM · RAG · 提示词工程 · API 工作流 · 知识库", "Shopify · Liquid · HTML/CSS · JavaScript · LLM · RAG · 提示詞工程 · API 工作流 · 知識庫") ] },
        ],
      },
      skills: ["shopify", "liquid", "html-css", "javascript", "perf", "llm", "prompt", "rag", "api-workflow", "knowledge-base"],
      trackIds: ["llm-ai", "software-data"],
      position: { x: 0, y: CANVAS_LANE_Y.internship },
      size: { ...CANVAS_DENSE_CARD_SIZE },
    },
    {
      id: "intern-huatai",
      group: "internship",
      title: {
        en: "Huatai Securities",
        zhHans: "华泰证券",
        zhHant: "華泰證券",
      },
      subtitle: {
        en: "Research Intern · Nanjing",
        zhHans: "行业研究实习生 · 南京",
        zhHant: "行業研究實習生 · 南京",
      },
      timeLabel: {
        en: "June – July 2024",
        zhHans: "2024 年 6 月 – 2024 年 7 月",
        zhHant: "2024 年 6 月 – 2024 年 7 月",
      },
      startDate: "2024-06",
      endDate: "2024-07",
      summary: {
        en: "Client data support, industry research, and AI-assisted investor education content.",
        zhHans: "客户数据支持、行业研究支持与 AI 辅助内容制作。",
        zhHant: "客戶資料支援、行業研究支援與 AI 輔助內容製作。",
      },
      details: {
        overview: {
          en: "Joined Huatai Securities as a research intern supporting equity analysts with materials, documentation and AI-assisted content.",
          zhHans: "在华泰证券担任行业研究实习生,协助股票分析师完成材料、文档与 AI 辅助内容。",
          zhHant: "在華泰證券擔任行業研究實習生,協助股票分析師完成材料、文件與 AI 輔助內容。",
        },
        whatIDid: [
          {
            en: "Client Data Support: Maintained and updated client information records, helped organise service-related data, and supported daily team operations with basic data checking and documentation work.",
            zhHans: "客户数据支持:维护并更新客户信息记录,协助整理服务相关数据,并支持团队日常运营中的基础数据核对和文档整理工作。",
            zhHant: "客戶資料支援:維護並更新客戶資訊記錄,協助整理服務相關資料,並支援團隊日常營運中的基礎資料核對與文件整理工作。",
          },
          {
            en: "Industry Research Support: Collected and organised listed company information, market news, and sector-related materials to support analysts in preparing investment research and value assessment reports.",
            zhHans: "行业研究支持:收集并整理上市公司资料、市场新闻和行业相关材料,协助分析师准备投资研究和价值评估报告。",
            zhHant: "行業研究支援:收集並整理上市公司資料、市場新聞與行業相關材料,協助分析師準備投資研究與價值評估報告。",
          },
          {
            en: "AI-assisted Content Production: Supported investor education content production by preparing scripts and using an AI digital-human workflow to generate presenter-style video and audio materials; also assisted with editing, subtitle preparation, and updates for the company's media channels.",
            zhHans: "AI 辅助内容制作:参与投资者教育内容制作,包括撰写视频脚本,并使用 AI 数字人工作流生成讲解型视频和音频材料;同时协助视频剪辑、字幕制作和公司媒体渠道内容更新。",
            zhHant: "AI 輔助內容製作:參與投資者教育內容製作,包含撰寫影片腳本,並使用 AI 數位人工作流程生成講解型影片與音訊材料;同時協助影片剪輯、字幕製作與公司媒體管道內容更新。",
          },
        ],
        sections: [
          { id: "overview", title: DETAIL_TITLES.overview, paragraphs: [text("Research internship supporting equity analysts with data, industry materials, documentation, and AI-assisted investor education content.", "协助股票分析师处理数据、行业材料、文档与 AI 辅助投资者教育内容的研究实习。", "協助股票分析師處理資料、行業材料、文件與 AI 輔助投資者教育內容的研究實習。")] },
          { id: "problem", title: DETAIL_TITLES.problem, paragraphs: [text("Analyst workflows required accurate source organisation, routine data checks, and clear content production across research and media channels.", "分析工作需要准确整理资料、完成日常数据核对，并在研究和媒体渠道中制作清晰内容。", "分析工作需要準確整理資料、完成日常資料核對，並在研究與媒體渠道中製作清晰內容。")] },
          { id: "role", title: DETAIL_TITLES.role, items: [text("Maintained client information and service data.", "维护客户信息与服务数据。", "維護客戶資訊與服務資料。"), text("Collected listed-company, market, and sector materials.", "收集上市公司、市场和行业资料。", "收集上市公司、市場與行業資料。"), text("Prepared scripts and AI-assisted presenter content.", "撰写脚本并制作 AI 辅助讲解内容。", "撰寫腳本並製作 AI 輔助講解內容。") ] },
          { id: "engineering", title: DETAIL_TITLES.engineering, paragraphs: [text("Used structured source organisation and documentation for research support, then combined scripts, an AI digital-human workflow, editing, and subtitles for media delivery.", "以结构化资料整理和文档支持研究，并结合脚本、AI 数字人工作流、剪辑与字幕完成媒体交付。", "以結構化資料整理與文件支援研究，並結合腳本、AI 數位人工作流程、剪輯與字幕完成媒體交付。")] },
          { id: "evidence", title: DETAIL_TITLES.evidence, items: [text("Supported investment-research and valuation-report preparation.", "支持投资研究与价值评估报告准备。", "支援投資研究與價值評估報告準備。"), text("Produced presenter-style video and audio materials for investor education.", "制作投资者教育讲解型视频与音频材料。", "製作投資者教育講解型影片與音訊材料。") ] },
          { id: "stack", title: DETAIL_TITLES.stack, paragraphs: [text("Industry Research · Data Support · Documentation · Video Scripting · AI-assisted Content", "行业研究 · 数据支持 · 文档撰写 · 视频脚本 · AI 辅助内容", "行業研究 · 資料支援 · 文件撰寫 · 影片腳本 · AI 輔助內容") ] },
        ],
      },
      skills: ["industry-research", "data-support", "documentation", "video-script"],
      trackIds: [],
      position: { x: 520, y: CANVAS_LANE_Y.internship + 30 },
      size: { ...CANVAS_COMPACT_CARD_SIZE },
    },
    {
      id: "intern-polyu-3d",
      group: "internship",
      title: {
        en: "Autonomous Driving Radar Data Processing",
        zhHans: "自动驾驶项目雷达数据处理",
        zhHant: "自動駕駛項目雷達資料處理",
      },
      subtitle: {
        en: "Student Assistant · Hong Kong",
        zhHans: "学生助理 · 香港",
        zhHant: "學生助理 · 香港",
      },
      timeLabel: {
        en: "April – May 2023",
        zhHans: "2023 年 4 月 – 2023 年 5 月",
        zhHant: "2023 年 4 月 – 2023 年 5 月",
      },
      startDate: "2023-04",
      endDate: "2023-05",
      summary: {
        en: "3D scene data prep, Blender-Python export automation, and point cloud preprocessing.",
        zhHans: "3D 场景数据准备、Blender Python 数据导出自动化与点云预处理。",
        zhHant: "3D 場景資料準備、Blender Python 資料匯出自動化與點雲預處理。",
      },
      details: {
        overview: {
          en: "Worked with a PolyU research group on data preparation for a 3D perception project aimed at autonomous driving scenarios.",
          zhHans: "在理大研究组中负责 3D 感知项目的数据准备工作,服务自动驾驶场景研究。",
          zhHant: "在理大研究組中負責 3D 感知專案的資料準備工作,服務自動駕駛場景研究。",
        },
        whatIDid: [
          {
            en: "3D Scene Data Preparation: Processed planar surfaces in Blender-based 3D models to prepare structured raw data for autonomous driving perception research.",
            zhHans: "3D 场景数据准备:在基于 Blender 的 3D 模型中处理平面结构,为自动驾驶感知研究准备结构化原始数据。",
            zhHant: "3D 場景資料準備:在基於 Blender 的 3D 模型中處理平面結構,為自動駕駛感知研究準備結構化原始資料。",
          },
          {
            en: "Data Export Automation: Wrote Python scripts in Blender to automate model data export, making the data preparation workflow more repeatable and less dependent on manual operations.",
            zhHans: "数据导出自动化:在 Blender 中编写 Python 脚本,自动化模型数据导出流程,使数据准备过程更可重复,并减少对手动操作的依赖。",
            zhHant: "資料匯出自動化:在 Blender 中撰寫 Python 腳本,自動化模型資料匯出流程,使資料準備過程更可重複,並減少對手動操作的依賴。",
          },
          {
            en: "Point Cloud Preprocessing: Used automated scripts to clean and process point cloud data for downstream perception tasks, including 3D object detection experiment preparation.",
            zhHans: "点云预处理:使用自动化脚本清洗并处理点云数据,为后续感知任务和 3D 目标检测实验做准备。",
            zhHant: "點雲預處理:使用自動化腳本清洗並處理點雲資料,為後續感知任務與 3D 目標偵測實驗做準備。",
          },
        ],
        sections: [
          { id: "overview", title: DETAIL_TITLES.overview, paragraphs: [text("Research-assistant work preparing 3D scene and point-cloud data for autonomous-driving perception experiments.", "为自动驾驶感知实验准备 3D 场景与点云数据的研究助理工作。", "為自動駕駛感知實驗準備 3D 場景與點雲資料的研究助理工作。")] },
          { id: "problem", title: DETAIL_TITLES.problem, paragraphs: [text("Perception experiments required structured, repeatable data preparation instead of manual model export and point-cloud cleanup.", "感知实验需要结构化、可重复的数据准备流程，以替代手动模型导出和点云清理。", "感知實驗需要結構化、可重複的資料準備流程，以取代手動模型匯出與點雲清理。")] },
          { id: "role", title: DETAIL_TITLES.role, items: [text("Processed planar structures in Blender models.", "处理 Blender 模型中的平面结构。", "處理 Blender 模型中的平面結構。"), text("Automated model-data export with Blender Python.", "使用 Blender Python 自动化模型数据导出。", "使用 Blender Python 自動化模型資料匯出。"), text("Cleaned and preprocessed point clouds.", "清洗并预处理点云。", "清洗並預處理點雲。") ] },
          { id: "engineering", title: DETAIL_TITLES.engineering, paragraphs: [text("Converted manual preparation steps into Python scripts so exports and preprocessing could be repeated consistently for downstream 3D detection work.", "将手动准备步骤转化为 Python 脚本，使导出和预处理可以为后续 3D 检测工作稳定复现。", "將手動準備步驟轉化為 Python 腳本，使匯出與預處理可以為後續 3D 偵測工作穩定重現。")] },
          { id: "evidence", title: DETAIL_TITLES.evidence, items: [text("Delivered structured scene data and repeatable export scripts for downstream perception experiments.", "交付结构化场景数据与可重复执行的导出脚本，供后续感知实验使用。", "交付結構化場景資料與可重複執行的匯出腳本，供後續感知實驗使用。") ] },
          { id: "stack", title: DETAIL_TITLES.stack, paragraphs: [text("Python · Blender Python · Point-cloud Processing · Data Preparation", "Python · Blender Python · 点云处理 · 数据准备", "Python · Blender Python · 點雲處理 · 資料準備") ] },
        ],
      },
      skills: ["python", "blender-python", "pointcloud", "data-support"],
      trackIds: ["ai-vision"],
      position: { x: 1040, y: CANVAS_LANE_Y.internship + 10 },
      size: { ...CANVAS_COMPACT_CARD_SIZE },
    },

    // ---------- Projects ----------
    {
      id: "project-career-portal",
      group: "project",
      title: text(
        "Interactive Multilingual Career Portal",
        "交互式多语言个人门户",
        "互動式多語言個人門戶"
      ),
      subtitle: text("Personal Portfolio System", "个人作品集系统", "個人作品集系統"),
      timeLabel: text("2026", "2026", "2026"),
      startDate: "2026",
      summary: text(
        "A React and TypeScript career canvas with multilingual data, desktop and mobile views, skill filtering, detail drawers, local editing, and static export.",
        "开发基于 React、TypeScript 与 Vite 的交互式多语言履历画布，支持桌面画布导航、移动端列表、技能筛选、详情抽屉、编辑模式和静态导出。",
        "開發基於 React、TypeScript 與 Vite 的互動式多語言履歷畫布，支援桌面畫布導覽、行動端列表、技能篩選、詳情抽屜、編輯模式與靜態匯出。"
      ),
      details: {
        overview: text(
          "A multilingual portfolio system that presents career information as an interactive canvas instead of a conventional static resume page.",
          "以交互式画布取代传统静态简历页面的多语言个人作品集系统。",
          "以互動畫布取代傳統靜態履歷頁面的多語言個人作品集系統。"
        ),
        whatIDid: [],
        sections: [
          { id: "overview", title: DETAIL_TITLES.overview, paragraphs: [text("Designed and built a multilingual career portal with a navigable desktop canvas, a mobile card flow, skill-based filtering, and structured detail drawers.", "设计并开发多语言个人门户，包含可导航的桌面画布、移动端卡片流、技能筛选和结构化详情抽屉。", "設計並開發多語言個人門戶，包含可導覽的桌面畫布、行動端卡片流、技能篩選與結構化詳情抽屜。") ] },
          { id: "problem", title: DETAIL_TITLES.problem, paragraphs: [text("A conventional resume makes it difficult to show relationships among education, internships, projects, and technical strengths while remaining usable on both desktop and mobile.", "传统简历难以同时展示教育、实习、项目和技术能力之间的关系，也难以兼顾桌面端与移动端的浏览体验。", "傳統履歷難以同時展示教育、實習、專案與技術能力之間的關係，也難以兼顧桌面端與行動端的瀏覽體驗。") ] },
          { id: "role", title: DETAIL_TITLES.role, items: [text("Defined the information architecture and multilingual content model.", "定义信息架构与多语言内容模型。", "定義資訊架構與多語言內容模型。"), text("Implemented the canvas, minimap, responsive list, filters, drawers, and editor workflow.", "实现画布、缩略图、响应式列表、筛选、抽屉和编辑工作流。", "實作畫布、縮略圖、響應式列表、篩選、抽屜與編輯工作流程。"), text("Built validation and normal/single-file static export paths.", "构建数据校验与普通/单文件静态导出流程。", "建構資料驗證與普通／單檔靜態匯出流程。") ] },
          { id: "engineering", title: DETAIL_TITLES.engineering, items: [text("Used stable IDs and a data-driven three-locale schema so presentation text never controls application state.", "使用稳定 ID 与数据驱动的三语结构，避免显示文字参与应用状态。", "使用穩定 ID 與資料驅動的三語結構，避免顯示文字參與應用狀態。"), text("Separated viewer and editor builds and provided cancellable animated canvas navigation.", "分离查看器与编辑器构建，并提供可取消的画布导航动画。", "分離檢視器與編輯器建置，並提供可取消的畫布導覽動畫。"), text("Kept exports portable with relative assets, embedded-data fallback, and system fonts.", "通过相对资源路径、内嵌数据回退与系统字体保持导出可移植性。", "透過相對資源路徑、內嵌資料回退與系統字體保持匯出可移植性。") ] },
          { id: "evidence", title: DETAIL_TITLES.evidence, metrics: [text("Three complete interface locales", "三种完整界面语言", "三種完整介面語言"), text("Desktop canvas and mobile list experiences", "桌面画布与移动端列表两套体验", "桌面畫布與行動端列表兩套體驗"), text("Normal directory export and single-file export", "普通目录导出与单文件导出", "普通目錄匯出與單檔匯出") ], media: [{ src: "./media/portal-overview.jpg", alt: text("Desktop view of the interactive multilingual career portal", "交互式多语言个人门户桌面视图", "互動式多語言個人門戶桌面視圖") }] },
          { id: "stack", title: DETAIL_TITLES.stack, paragraphs: [text("React · TypeScript · Vite · Tailwind CSS · SVG · Local Editor · Static Export", "React · TypeScript · Vite · Tailwind CSS · SVG · 本地编辑器 · 静态导出", "React · TypeScript · Vite · Tailwind CSS · SVG · 本地編輯器 · 靜態匯出") ] },
        ],
      },
      skills: ["react", "typescript", "vite", "tailwind", "git"],
      trackIds: ["software-data"],
      position: { x: 0, y: CANVAS_LANE_Y.project + 28 },
      size: { ...CANVAS_CARD_SIZE },
      emphasis: "secondary",
    },
    {
      id: "project-uav-fyp",
      group: "project",
      title: {
        en: "Communication-Aware UAV Path Planning",
        zhHans: "通信感知型无人机路径规划",
        zhHant: "通訊感知型無人機路徑規劃",
      },
      subtitle: {
        en: "Final Year Project",
        zhHans: "毕业设计",
        zhHant: "畢業設計",
      },
      timeLabel: {
        en: "September 2025 – April 2026",
        zhHans: "2025 年 9 月 – 2026 年 4 月",
        zhHant: "2025 年 9 月 – 2026 年 4 月",
      },
      startDate: "2025-09",
      endDate: "2026-04",
      summary: {
        en: "Built a UAV path-planning system that balances flight efficiency and cellular connectivity, covering data generation, baseline algorithms, imitation learning, graph-level reinforcement learning, safety mechanisms, and deployment evaluation.",
        zhHans: "构建同时考虑飞行效率与蜂窝网络连接质量的无人机路径规划系统，覆盖数据生成、基线算法、模仿学习、图级强化学习、安全机制和部署评测。",
        zhHant: "建構同時考慮飛行效率與蜂巢網路連線品質的無人機路徑規劃系統，涵蓋資料生成、基線演算法、模仿學習、圖級強化學習、安全機制與部署評測。",
      },
      details: {
        overview: {
          en: "A research-style FYP that uses learning-based planners to keep UAVs connected to cellular base stations while reaching their goal.",
          zhHans: "一项研究型毕业设计,使用学习型规划器让无人机在到达目标的同时保持与基站连接。",
          zhHant: "一項研究型畢業設計,使用學習型規劃器讓無人機在到達目標的同時保持與基地台連線。",
        },
        whatIDid: [
          {
            en: "Project Goal: Developed a UAV path planning system that balances route efficiency and cellular connectivity, since the shortest path may pass through weak-coverage areas.",
            zhHans: "项目目标:开发一个无人机路径规划系统,在规划路径时同时考虑飞行效率和蜂窝网络连接质量,因为最短路径可能会经过弱覆盖区域。",
            zhHant: "專案目標:開發一個無人機路徑規劃系統,在規劃路徑時同時考慮飛行效率與蜂巢網路連線品質,因為最短路徑可能會經過弱覆蓋區域。",
          },
          {
            en: "Simulation and Dataset Pipeline: Built a Python-based simulation pipeline with 100 simulated 10 km × 10 km maps, 10 ground base stations per map, and 600 hard-case expert trajectories for training and evaluation.",
            zhHans: "仿真与数据集流程:搭建基于 Python 的仿真流程,包含 100 个 10 km × 10 km 模拟地图,每个地图包含 10 个地面基站,并生成 600 条高难度专家轨迹用于训练和评估。",
            zhHant: "模擬與資料集流程:搭建基於 Python 的模擬流程,包含 100 個 10 km × 10 km 模擬地圖,每個地圖包含 10 個地面基地台,並生成 600 條高難度專家軌跡用於訓練與評估。",
          },
          {
            en: "AI Planning Methods: Compared grid/graph planning baselines with imitation learning and graph-level reinforcement learning, then shifted the main RL design from low-level heading control to higher-level handover decisions.",
            zhHans: "AI 路径规划方法:比较 grid/graph 规划 baseline、模仿学习和图级强化学习方法,并将主要 RL 设计从低层飞行方向控制调整为更高层的基站切换决策。",
            zhHant: "AI 路徑規劃方法:比較 grid/graph 規劃 baseline、模仿學習與圖級強化學習方法,並將主要 RL 設計從低層飛行方向控制調整為更高層的基地台切換決策。",
          },
          {
            en: "Evaluation and Demo: Added feasibility masks, SmartShield, fallback logic, and benchmark scripts for success rate, robustness, radio replay, and latency; the final graph policy achieved 0.9290 audit robust score, 93.75% budget-3 success, and 0.244 ms p95 deploy latency.",
            zhHans: "评估与 Demo:加入可行性 mask、SmartShield、fallback 逻辑,以及用于 success rate、robustness、radio replay 和 latency 的 benchmark 脚本;最终 graph policy 达到 0.9290 audit robust score、93.75% budget-3 success 和 0.244 ms p95 deploy latency。",
            zhHant: "評估與 Demo:加入可行性 mask、SmartShield、fallback 邏輯,以及用於 success rate、robustness、radio replay 與 latency 的 benchmark 腳本;最終 graph policy 達到 0.9290 audit robust score、93.75% budget-3 success 與 0.244 ms p95 deploy latency。",
          },
        ],
        outcomes: [
          { en: "0.9290 audit robust score", zhHans: "0.9290 audit robust score", zhHant: "0.9290 audit robust score" },
          { en: "93.75% budget-3 success rate", zhHans: "93.75% budget-3 success", zhHant: "93.75% budget-3 success" },
          { en: "0.244 ms p95 deploy latency", zhHans: "0.244 ms p95 deploy latency", zhHant: "0.244 ms p95 deploy latency" },
        ],
        tech: {
          en: "PyTorch, imitation learning, graph-level reinforcement learning, feasibility mask, SmartShield, Python, NumPy, NetworkX, CVXPY, Matplotlib, Jupyter Notebook, JSON/CSV metrics, HTML/JavaScript demo",
          zhHans: "PyTorch、模仿学习、图级强化学习、可行性掩码、SmartShield、Python、NumPy、NetworkX、CVXPY、Matplotlib、Jupyter Notebook、JSON/CSV 指标、HTML/JavaScript 演示",
          zhHant: "PyTorch、模仿學習、圖級強化學習、可行性遮罩、SmartShield、Python、NumPy、NetworkX、CVXPY、Matplotlib、Jupyter Notebook、JSON/CSV 指標、HTML/JavaScript 展示",
        },
        sections: [
          { id: "overview", title: DETAIL_TITLES.overview, paragraphs: [text("A communication-aware UAV path-planning system that brings route efficiency, cellular connectivity, handover cost, and safety constraints into one planning workflow.", "本项目将路径效率、通信连接质量、切换成本和安全约束纳入统一规划流程。", "本專案將路徑效率、通訊連線品質、切換成本與安全約束納入統一規劃流程。") ] },
          { id: "problem", title: DETAIL_TITLES.problem, paragraphs: [text("Traditional shortest-path algorithms optimise distance or flight cost alone, so generated routes may cross weak cellular coverage and disrupt telemetry, control, or data return.", "传统最短路径算法只考虑距离或飞行成本，生成的路径可能穿过蜂窝信号较弱区域，影响无人机遥测、控制和数据回传。", "傳統最短路徑演算法只考慮距離或飛行成本，生成的路徑可能穿過蜂巢訊號較弱區域，影響無人機遙測、控制與資料回傳。") ] },
          { id: "role", title: DETAIL_TITLES.role, paragraphs: [text("Built the Python simulation and reproducible training, validation, and test pipeline, then compared planning and learning approaches end to end.", "搭建 Python 仿真环境和可复现的训练、验证与测试流程，并端到端比较规划与学习方法。", "搭建 Python 模擬環境與可重現的訓練、驗證及測試流程，並端到端比較規劃與學習方法。") ], items: [text("100 simulated 10 km × 10 km maps", "100 个 10 km × 10 km 模拟地图", "100 個 10 km × 10 km 模擬地圖"), text("10 ground base stations per map", "每张地图 10 个地面基站", "每張地圖 10 個地面基地台"), text("600 hard-case expert trajectories", "600 条高难度专家轨迹", "600 條高難度專家軌跡") ] },
          { id: "engineering", title: DETAIL_TITLES.engineering, paragraphs: [text("Compared grid and graph baselines, imitation learning, and graph-level reinforcement learning. The RL design moved from low-level heading control to higher-level base-station handover decisions, reducing action-space complexity and improving interpretability.", "项目比较了 grid baseline、graph baseline、模仿学习和图级强化学习。强化学习设计随后从低层飞行方向控制调整为更高层的基站切换决策，降低动作空间复杂度并提高决策可解释性。", "專案比較了 grid baseline、graph baseline、模仿學習與圖級強化學習。強化學習設計其後從低層飛行方向控制調整為更高層的基地台切換決策，降低動作空間複雜度並提高決策可解釋性。"), text("Added a feasibility mask, SmartShield, and fallback logic to reject clearly infeasible actions and revert to deterministic planning when policy output was risky.", "加入 feasibility mask、SmartShield 和 fallback 逻辑，用于阻止明显不可行的动作，并在策略输出风险较高时回退到确定性规划方案。", "加入 feasibility mask、SmartShield 與 fallback 邏輯，用於阻止明顯不可行的動作，並在策略輸出風險較高時回退至確定性規劃方案。") ] },
          { id: "evidence", title: DETAIL_TITLES.evidence, paragraphs: [text("Built benchmark scripts for success rate, audit robustness, radio replay, and inference latency, plus a local HTML/JavaScript comparison demo.", "建立用于 success rate、audit robustness、radio replay 和推理延迟的 benchmark 脚本，并开发本地 HTML/JavaScript 演示页面用于对比不同算法生成的路线。", "建立用於 success rate、audit robustness、radio replay 與推理延遲的 benchmark 腳本，並開發本地 HTML/JavaScript 展示頁面以比較不同演算法生成的路線。") ], metrics: [text("0.9290 audit robust score", "0.9290 audit robust score", "0.9290 audit robust score"), text("93.75% budget-3 success rate", "93.75% budget-3 success rate", "93.75% budget-3 success rate"), text("0.244 ms p95 deployment latency", "0.244 ms p95 deployment latency", "0.244 ms p95 deployment latency") ] },
          { id: "stack", title: DETAIL_TITLES.stack, paragraphs: [text("PyTorch · Imitation Learning · Graph-level Reinforcement Learning · Feasibility Mask · SmartShield · Python · NumPy · NetworkX · CVXPY · Matplotlib · Jupyter Notebook · HTML/JavaScript", "PyTorch · 模仿学习 · 图级强化学习 · 可行性掩码 · SmartShield · Python · NumPy · NetworkX · CVXPY · Matplotlib · Jupyter Notebook · HTML/JavaScript", "PyTorch · 模仿學習 · 圖級強化學習 · 可行性遮罩 · SmartShield · Python · NumPy · NetworkX · CVXPY · Matplotlib · Jupyter Notebook · HTML/JavaScript") ] },
        ],
      },
      skills: ["python", "pytorch", "numpy", "networkx", "cvxpy", "matplotlib", "jupyter", "imitation", "rl", "graph-policy"],
      trackIds: ["ai-vision"],
      position: { x: 520, y: CANVAS_LANE_Y.project },
      size: { ...CANVAS_PRIMARY_CARD_SIZE },
      emphasis: "primary",
    },
    {
      id: "project-robot-car",
      group: "project",
      title: {
        en: "Machine Vision-Based Autonomous Robot Car",
        zhHans: "基于机器视觉的自主智能小车",
        zhHant: "基於機器視覺的自主智能小車",
      },
      subtitle: {
        en: "Integrated Project",
        zhHans: "综合项目",
        zhHant: "綜合項目",
      },
      timeLabel: {
        en: "February – April 2025",
        zhHans: "2025 年 2 月 – 2025 年 4 月",
        zhHant: "2025 年 2 月 – 2025 年 4 月",
      },
      startDate: "2025-02",
      endDate: "2025-04",
      summary: {
        en: "Integrated YOLOv5, OpenCV, and UART motor control on a Jetson platform for object detection, visual decision-making, and robot-car motion control; the best model reached 0.969 mAP@0.5.",
        zhHans: "在 Jetson 平台上集成 YOLOv5、OpenCV 和 UART 电机控制，实现目标检测、视觉决策与小车运动控制，最佳模型达到 0.969 mAP@0.5。",
        zhHant: "在 Jetson 平台上整合 YOLOv5、OpenCV 與 UART 馬達控制，實現目標偵測、視覺決策與小車運動控制，最佳模型達到 0.969 mAP@0.5。",
      },
      details: {
        overview: {
          en: "An integrated robotics project that combines computer vision, edge inference and motor control for an autonomous car platform.",
          zhHans: "一个综合机器人项目,结合计算机视觉、边缘推理与电机控制,应用于自主小车平台。",
          zhHant: "一個整合機器人專案,結合計算機視覺、邊緣推論與馬達控制,應用於自主小車平台。",
        },
        whatIDid: [
          {
            en: "Real-time Robot Vision: Integrated a YOLOv5 object-detection pipeline with OpenCV webcam capture to detect balls, gates, stop cards, and markers during robot-car navigation tests.",
            zhHans: "实时机器人视觉:将 YOLOv5 目标检测流程与 OpenCV 摄像头采集集成,用于在小车导航测试中检测球、门、停止牌和标记物。",
            zhHant: "即時機器人視覺:將 YOLOv5 目標偵測流程與 OpenCV 攝影機擷取整合,用於在小車導航測試中偵測球、門、停止牌與標記物。",
          },
          {
            en: "Vision-to-Control Logic: Built Python control logic that converted object position, size, and confidence threshold outputs into UART motor commands for left, right, forward, and stop actions.",
            zhHans: "视觉到控制逻辑:编写 Python 控制逻辑,将目标位置、尺寸和置信度阈值输出转换为 UART 电机指令,实现左转、右转、前进和停止等动作。",
            zhHant: "視覺到控制邏輯:撰寫 Python 控制邏輯,將目標位置、尺寸與置信度閾值輸出轉換為 UART 馬達指令,實現左轉、右轉、前進與停止等動作。",
          },
          {
            en: "Model Training and Evaluation: Contributed to Roboflow data collection, annotation, dataset preparation, and YOLOv5 retraining; the best local training run reached 0.969 mAP@0.5 after 50 epochs.",
            zhHans: "模型训练与评估:参与 Roboflow 数据收集、标注、数据集准备和 YOLOv5 重新训练;本地最佳训练结果在 50 个 epoch 后达到 0.969 mAP@0.5。",
            zhHant: "模型訓練與評估:參與 Roboflow 資料蒐集、標註、資料集準備與 YOLOv5 重新訓練;本地最佳訓練結果在 50 個 epoch 後達到 0.969 mAP@0.5。",
          },
          {
            en: "Field Debugging and Integration: Tuned confidence thresholds, stopping behaviour, firmware support, wheel calibration, and detection logic after observing motion blur, wheel vibration, camera angle issues, and detection loss during ground tests.",
            zhHans: "现场调试与集成:针对实地测试中出现的运动模糊、车轮震动、摄像头角度问题和检测丢失,调整置信度阈值、停止行为、固件支持、车轮校准和检测逻辑。",
            zhHant: "現場調試與整合:針對實地測試中出現的運動模糊、車輪震動、攝影機角度問題與偵測丟失,調整置信度閾值、停止行為、韌體支援、車輪校正與偵測邏輯。",
          },
        ],
        tech: {
          en: "Python, PyTorch, YOLOv5, OpenCV, Roboflow, UART, PySerial, Jetson-class onboard computer",
          zhHans: "Python、PyTorch、YOLOv5、OpenCV、Roboflow、UART、PySerial、NVIDIA Jetson 计算平台",
          zhHant: "Python、PyTorch、YOLOv5、OpenCV、Roboflow、UART、PySerial、NVIDIA Jetson 計算平台",
        },
        sections: [
          { id: "overview", title: DETAIL_TITLES.overview, paragraphs: [text("An autonomous robot car that recognises balls, goals, stop signs, and field markers, then turns visual detections into forward, steering, and stop actions.", "开发能够识别球、门、停止牌和场地标记的自主小车，并根据目标位置和检测结果完成前进、转向和停止。", "開發能夠辨識球、球門、停止牌與場地標記的自主小車，並根據目標位置與偵測結果完成前進、轉向及停止。") ] },
          { id: "problem", title: DETAIL_TITLES.problem, paragraphs: [text("Reliable ground operation required more than model accuracy: vision, camera placement, mechanical error, real-time control, and temporary detection loss all interacted.", "可靠的实地运行不仅取决于模型精度，还受到视觉输入、摄像头位置、机械误差、实时控制和短暂检测丢失之间耦合的影响。", "可靠的實地運行不僅取決於模型精度，亦受到視覺輸入、攝影機位置、機械誤差、即時控制與短暫偵測丟失之間耦合的影響。") ] },
          { id: "role", title: DETAIL_TITLES.role, items: [text("Contributed to Roboflow data collection, annotation, dataset preparation, and YOLOv5 retraining.", "参与 Roboflow 数据采集、图片标注、数据集整理和 YOLOv5 重新训练。", "參與 Roboflow 資料蒐集、圖片標註、資料集整理與 YOLOv5 重新訓練。"), text("Built the OpenCV capture and vision-to-control logic.", "开发 OpenCV 实时采集与视觉到控制逻辑。", "開發 OpenCV 即時擷取與視覺到控制邏輯。"), text("Integrated PySerial UART commands with the lower-level controller.", "通过 PySerial 向底层控制器发送 UART 指令。", "透過 PySerial 向底層控制器傳送 UART 指令。") ] },
          { id: "engineering", title: DETAIL_TITLES.engineering, paragraphs: [text("Converted target class, centre position, size, and confidence into control conditions. Field testing exposed motion blur, wheel vibration, camera-angle deviation, and temporary detection loss; confidence thresholds, stop conditions, wheel calibration, and detection logic were tuned to improve stability.", "使用 OpenCV 获取实时摄像头画面，将目标类别、中心位置、尺寸和置信度转换为控制条件。实地运行中针对运动模糊、车轮震动、摄像头角度偏差和短暂检测丢失，调整置信度阈值、停止条件、车轮校准和检测逻辑以改善稳定性。", "使用 OpenCV 取得即時攝影機畫面，將目標類別、中心位置、尺寸與置信度轉換為控制條件。實地運行中針對運動模糊、車輪震動、攝影機角度偏差與短暫偵測丟失，調整置信度閾值、停止條件、車輪校準與偵測邏輯以改善穩定性。") ] },
          { id: "evidence", title: DETAIL_TITLES.evidence, paragraphs: [text("The project provided end-to-end experience with robotics issues beyond model accuracy, including sensor noise, mechanical error, real-time constraints, and control coupling.", "项目让我完整经历了模型精度之外的机器人问题，包括传感器噪声、机械误差、实时性和控制逻辑之间的耦合。", "專案讓我完整經歷模型精度之外的機器人問題，包括感測器雜訊、機械誤差、即時性與控制邏輯之間的耦合。") ], metrics: [text("0.969 mAP@0.5 after 50 epochs", "50 个 epoch 后达到 0.969 mAP@0.5", "50 個 epoch 後達到 0.969 mAP@0.5") ] },
          { id: "stack", title: DETAIL_TITLES.stack, paragraphs: [text("Python · PyTorch · YOLOv5 · OpenCV · Roboflow · Jetson · UART · PySerial", "Python · PyTorch · YOLOv5 · OpenCV · Roboflow · Jetson · UART · PySerial", "Python · PyTorch · YOLOv5 · OpenCV · Roboflow · Jetson · UART · PySerial") ] },
        ],
      },
      skills: ["python", "pytorch", "yolov5", "cv", "roboflow", "uart", "pyserial", "jetson", "robot-vision", "control-logic", "embedded-systems"],
      trackIds: ["ai-vision", "iot-device"],
      position: { x: 1040, y: CANVAS_LANE_Y.project + 38 },
      size: { ...CANVAS_DENSE_CARD_SIZE },
    },
    {
      id: "project-sushiro",
      group: "project",
      title: {
        en: "Sushiro Hong Kong Queue Prediction and Analytics System",
        zhHans: "Sushiro 香港排队预测与分析系统",
        zhHant: "Sushiro 香港排隊預測與分析系統",
      },
      subtitle: {
        en: "Full-stack Queue Dashboard · Personal Project",
        zhHans: "全栈排队看板 · 个人项目",
        zhHant: "全端排隊看板 · 個人項目",
      },
      timeLabel: {
        en: "2023 – 2025",
        zhHans: "2023 – 2025",
        zhHant: "2023 – 2025",
      },
      summary: {
        en: "Built a Vue 3 and FastAPI full-stack data platform that collects Hong Kong store queue data on a schedule and provides historical trends, rule-based ETA estimates, and store recommendations.",
        zhHans: "开发 Vue 3 与 FastAPI 全栈数据平台，定时采集香港门店排队数据，提供历史趋势、规则化 ETA 和门店推荐。",
        zhHant: "開發 Vue 3 與 FastAPI 全端資料平台，定時採集香港門市排隊資料，提供歷史趨勢、規則化 ETA 與門市推薦。",
      },
      details: {
        overview: {
          en: "A personal full-stack product: live queue dashboard for Sushiro Hong Kong with history, ETA estimation and store recommendations.",
          zhHans: "个人全栈产品:Sushiro 香港实时排队看板,带历史、ETA 估算与门店推荐。",
          zhHant: "個人全端產品:Sushiro 香港即時排隊看板,含歷史、ETA 估算與門市推薦。",
        },
        whatIDid: [
          {
            en: "Full-stack Queue Dashboard: Built a Vue 3 + TypeScript frontend and FastAPI backend for checking Sushiro Hong Kong store queues, wait times, ticketing status, store details, and queue history.",
            zhHans: "全栈排队看板:开发 Vue 3 + TypeScript 前端和 FastAPI 后端,用于查看香港 Sushiro 门店排队情况、等待时间、取票状态、门店详情和排队历史。",
            zhHant: "全端排隊看板:開發 Vue 3 + TypeScript 前端與 FastAPI 後端,用於查看香港 Sushiro 門市排隊情況、等候時間、取票狀態、門市詳情與排隊歷史。",
          },
          {
            en: "Scheduled Data Pipeline: Integrated Sushiro public APIs, normalised queue payloads, stored timestamped store and queue snapshots in SQLite, and refreshed data through APScheduler jobs.",
            zhHans: "定时数据管线:接入 Sushiro 公开 API,规范化排队数据,将带时间戳的门店和队列快照存储到 SQLite,并通过 APScheduler 定时刷新数据。",
            zhHant: "排程資料管線:接入 Sushiro 公開 API,規範化排隊資料,將帶時戳的門市與排隊快照儲存到 SQLite,並透過 APScheduler 排程刷新資料。",
          },
          {
            en: "Rule-based ETA and Recommendation Logic: Combined current waiting groups, recent queue progression, historical time-slot profiles, and upstream wait values to estimate ETA and recommend faster store options.",
            zhHans: "基于规则的 ETA 与推荐逻辑:结合当前等待组数、近期队列推进速度、历史时段特征和上游等待时间,估算 ETA 并推荐等待时间更短的门店选择。",
            zhHant: "基於規則的 ETA 與推薦邏輯:結合目前等待組數、近期佇列推進速度、歷史時段特徵與上游等候時間,估算 ETA 並推薦等候時間更短的門市選擇。",
          },
          {
            en: "Frontend Analytics: Developed dashboard, store detail, and analytics pages with filtering, sorting, auto-refresh, ECharts trend visualisations, and route-based page navigation.",
            zhHans: "前端分析功能:开发 dashboard、门店详情页和分析页,支持筛选、排序、自动刷新、ECharts 趋势可视化和基于路由的页面导航。",
            zhHant: "前端分析功能:開發 dashboard、門市詳情頁與分析頁,支援篩選、排序、自動刷新、ECharts 趨勢視覺化與基於路由的頁面導航。",
          },
        ],
        tech: {
          en: "Vue 3, TypeScript, Vite, Vue Router, ECharts, Python, FastAPI, SQLAlchemy, SQLite, APScheduler, REST APIs, GitHub Actions",
          zhHans: "Vue 3、TypeScript、Vite、Vue Router、ECharts、Python、FastAPI、SQLAlchemy、SQLite、APScheduler、REST APIs、GitHub Actions",
          zhHant: "Vue 3、TypeScript、Vite、Vue Router、ECharts、Python、FastAPI、SQLAlchemy、SQLite、APScheduler、REST APIs、GitHub Actions",
        },
        links: [
          { label: { en: "GitHub Page", zhHans: "GitHub Page", zhHant: "GitHub Page" }, url: "https://hey1www.github.io/SushiroQueuePrediction/#/" },
          { label: { en: "Repository", zhHans: "前端仓库", zhHant: "前端倉庫" }, url: "https://github.com/hey1www/SushiroQueuePrediction" },
        ],
        sections: [
          { id: "overview", title: DETAIL_TITLES.overview, paragraphs: [text("A full-stack data system for comparing live Sushiro Hong Kong queue conditions, historical trends, rule-based waiting-time estimates, and alternative stores.", "面向香港寿司郎门店的全栈数据系统，用于比较实时排队状态、历史趋势、规则化等待时间估算和候选门店。", "面向香港壽司郎門市的全端資料系統，用於比較即時排隊狀態、歷史趨勢、規則化等候時間估算與候選門市。") ] },
          { id: "problem", title: DETAIL_TITLES.problem, paragraphs: [text("Peak-hour waits differ substantially across Hong Kong stores, while the official interface mainly shows current status and lacks cross-store comparison, historical trends, and waiting-time analysis.", "香港寿司郎门店在高峰期等待时间差异明显，官方界面主要显示当前状态，缺少跨门店比较、历史趋势和等待时间分析。", "香港壽司郎門市在高峰期等候時間差異明顯，官方介面主要顯示目前狀態，缺少跨門市比較、歷史趨勢與等候時間分析。") ] },
          { id: "role", title: DETAIL_TITLES.role, items: [text("Built the Vue 3 and TypeScript frontend with overview, store detail, analytics, filtering, sorting, auto-refresh, and responsive navigation.", "开发 Vue 3 与 TypeScript 前端，实现门店总览、详情、趋势分析、筛选排序、自动刷新和响应式导航。", "開發 Vue 3 與 TypeScript 前端，實作門市總覽、詳情、趨勢分析、篩選排序、自動刷新與響應式導覽。"), text("Built the FastAPI, SQLAlchemy, and SQLite backend and normalised public queue payloads.", "开发 FastAPI、SQLAlchemy 与 SQLite 后端，并规范化公开排队数据。", "開發 FastAPI、SQLAlchemy 與 SQLite 後端，並規範化公開排隊資料。") ] },
          { id: "engineering", title: DETAIL_TITLES.engineering, paragraphs: [text("APScheduler refreshes data and stores timestamped queue snapshots. The rule-based ETA combines current waiting groups, recent queue progression, historical time-slot characteristics, and upstream wait values, preserving the product's position as a data system rather than a machine-learning predictor.", "通过 APScheduler 定期刷新数据并保存带时间戳的队列快照。规则化 ETA 将当前等待组数、近期队列推进速度、历史时段特征和上游等待值组合起来，保持项目作为数据系统而非机器学习预测器的准确定位。", "透過 APScheduler 定期刷新資料並保存帶時間戳的隊列快照。規則化 ETA 將目前等候組數、近期佇列推進速度、歷史時段特徵與上游等候值組合起來，保持專案作為資料系統而非機器學習預測器的準確定位。") ] },
          { id: "evidence", title: DETAIL_TITLES.evidence, items: [text("Persistent historical queue snapshots across stores and time slots.", "持续记录不同门店和时段的历史队列快照。", "持續記錄不同門市與時段的歷史佇列快照。"), text("Live overview, store detail, trend analysis, filters, sorting, and recommendations.", "交付实时总览、门店详情、趋势分析、筛选排序和门店推荐。", "交付即時總覽、門市詳情、趨勢分析、篩選排序與門市推薦。") ] },
          { id: "stack", title: DETAIL_TITLES.stack, paragraphs: [text("Vue 3 · TypeScript · Vite · Vue Router · ECharts · Python · FastAPI · SQLAlchemy · SQLite · APScheduler · REST API", "Vue 3 · TypeScript · Vite · Vue Router · ECharts · Python · FastAPI · SQLAlchemy · SQLite · APScheduler · REST API", "Vue 3 · TypeScript · Vite · Vue Router · ECharts · Python · FastAPI · SQLAlchemy · SQLite · APScheduler · REST API") ], links: [
            { label: text("Live Site", "在线页面", "線上頁面"), url: "https://hey1www.github.io/SushiroQueuePrediction/#/" },
            { label: text("Repository", "前端仓库", "前端倉庫"), url: "https://github.com/hey1www/SushiroQueuePrediction" },
          ] },
        ],
      },
      skills: ["vue", "typescript", "vite", "echarts", "python", "fastapi", "sqlalchemy", "sqlite", "apscheduler", "github-actions", "rest-api", "data-pipeline"],
      trackIds: ["software-data"],
      position: { x: 1560, y: CANVAS_LANE_Y.project + 14 },
      size: { ...CANVAS_DENSE_CARD_SIZE },
    },
    {
      id: "project-iot-monitoring",
      group: "project",
      title: {
        en: "IoT Environmental Monitoring System",
        zhHans: "物联网环境监测系统",
        zhHant: "物聯網環境監測系統",
      },
      subtitle: {
        en: "Course Project",
        zhHans: "课程项目",
        zhHant: "課程項目",
      },
      timeLabel: {
        en: "June – July 2023",
        zhHans: "2023 年 6 月 – 2023 年 7 月",
        zhHant: "2023 年 6 月 – 2023 年 7 月",
      },
      startDate: "2023-06",
      endDate: "2023-07",
      summary: {
        en: "Built an end-to-end environmental monitoring system with ESP8266, MQTT, and Django, covering multi-sensor collection, LED display, threshold alerts, and a real-time web dashboard.",
        zhHans: "开发基于 ESP8266、MQTT 和 Django 的端到端环境监测系统，实现多传感器数据采集、LED 显示、阈值告警和实时 Web 看板。",
        zhHant: "開發基於 ESP8266、MQTT 與 Django 的端到端環境監測系統，實現多感測器資料採集、LED 顯示、閾值警報與即時 Web 儀表板。",
      },
      details: {
        overview: {
          en: "End-to-end IoT monitoring stack — from microcontroller to web dashboard.",
          zhHans: "端到端物联网系统,从单片机到 Web 看板。",
          zhHant: "端到端物聯網系統,從單晶片到 Web 儀表板。",
        },
        whatIDid: [
          {
            en: "End-to-End IoT System: Contributed to a group IoT monitoring system that collected temperature, humidity, sound, and light data through MQTT and displayed readings through a web dashboard.",
            zhHans: "端到端物联网系统:参与小组物联网监测系统开发,通过 MQTT 采集温度、湿度、声音和光照数据,并通过 Web 看板展示读数。",
            zhHant: "端到端物聯網系統:參與小組物聯網監測系統開發,透過 MQTT 採集溫度、濕度、聲音和光照資料,並透過 Web 看板展示讀數。",
          },
          {
            en: "ESP8266 Display Terminal: Built the WeMos D1 Mini terminal logic in Arduino C++ to subscribe to MQTT JSON messages, filter readings by node ID, and display sensor values on an 8×8 LED matrix.",
            zhHans: "ESP8266 显示终端:使用 Arduino C++ 编写 WeMos D1 Mini 终端逻辑,订阅 MQTT JSON 消息,根据 node ID 过滤读数,并在 8×8 LED 点阵上显示传感器数据。",
            zhHant: "ESP8266 顯示終端:使用 Arduino C++ 編寫 WeMos D1 Mini 終端邏輯,訂閱 MQTT JSON 訊息,根據 node ID 過濾讀數,並在 8×8 LED 點陣上顯示感測器資料。",
          },
          {
            en: "Alert and Dashboard Logic: Implemented button-controlled display modes and threshold-based RGB/LED warning behaviour, and worked with the team on a Django/SQLite dashboard with MQTT ingestion, JSON endpoints, and real-time charts.",
            zhHans: "告警与看板逻辑:实现按键控制的显示模式和基于阈值的 RGB/LED 告警行为,并与团队共同完成 Django/SQLite 看板,包括 MQTT 数据接入、JSON endpoint 和实时图表。",
            zhHant: "告警與看板邏輯:實作按鍵控制的顯示模式與基於閾值的 RGB/LED 告警行為,並與團隊共同完成 Django/SQLite 看板,包含 MQTT 資料接入、JSON endpoint 與即時圖表。",
          },
        ],
        tech: {
          en: "ESP8266, Arduino C/C++, MQTT, JSON, Django, SQLite, Bootstrap, RGB LED, 8×8 LED Matrix",
          zhHans: "ESP8266、Arduino C/C++、MQTT、JSON、Django、SQLite、Bootstrap、RGB LED、8×8 LED 点阵",
          zhHant: "ESP8266、Arduino C/C++、MQTT、JSON、Django、SQLite、Bootstrap、RGB LED、8×8 LED 點陣",
        },
        sections: [
          { id: "overview", title: DETAIL_TITLES.overview, paragraphs: [text("An end-to-end IoT system that collects temperature, humidity, sound, and light data and carries JSON messages between devices and the server over MQTT.", "系统采集温度、湿度、声音和光照数据，并通过 MQTT 在设备与服务端之间传递 JSON 消息。", "系統採集溫度、濕度、聲音與光照資料，並透過 MQTT 在裝置與服務端之間傳遞 JSON 訊息。") ] },
          { id: "problem", title: DETAIL_TITLES.problem, paragraphs: [text("The system needed to connect sensing, local display and alerts, message transport, storage, and web visualisation into one observable data path.", "系统需要把传感器采集、本地显示与告警、消息传输、数据存储和 Web 可视化连接成一条可观察的数据链路。", "系統需要把感測器採集、本地顯示與警報、訊息傳輸、資料儲存及 Web 視覺化連接成一條可觀察的資料鏈路。") ] },
          { id: "role", title: DETAIL_TITLES.role, items: [text("Built the WeMos D1 Mini display-terminal logic in Arduino C++.", "使用 Arduino C++ 编写 WeMos D1 Mini 显示终端逻辑。", "使用 Arduino C++ 編寫 WeMos D1 Mini 顯示終端邏輯。"), text("Subscribed to MQTT JSON messages, filtered readings by node ID, and displayed values on an 8×8 LED matrix.", "订阅 MQTT JSON 消息，根据 node ID 筛选读数，并在 8×8 LED 点阵上显示数据。", "訂閱 MQTT JSON 訊息，根據 node ID 篩選讀數，並在 8×8 LED 點陣上顯示資料。"), text("Contributed to the Django, SQLite, and Bootstrap dashboard.", "参与 Django、SQLite 与 Bootstrap 看板开发。", "參與 Django、SQLite 與 Bootstrap 儀表板開發。") ] },
          { id: "engineering", title: DETAIL_TITLES.engineering, paragraphs: [text("Implemented button-controlled display modes and threshold-based RGB/LED alerts, while the web side handled MQTT ingestion, JSON endpoints, storage, and real-time charts.", "实现按键切换显示模式、基于阈值的 RGB/LED 告警；Web 端负责 MQTT 数据接入、JSON endpoint、数据存储和实时图表。", "實作按鍵切換顯示模式、基於閾值的 RGB/LED 警報；Web 端負責 MQTT 資料接入、JSON endpoint、資料儲存與即時圖表。") ] },
          { id: "evidence", title: DETAIL_TITLES.evidence, paragraphs: [text("The project demonstrated the complete IoT data path from sensors and embedded terminals through messaging and backend storage to a web interface.", "项目让我理解了从传感器、嵌入式终端、消息协议、后端数据库到 Web 界面的完整 IoT 数据链路。", "專案讓我理解從感測器、嵌入式終端、訊息協定、後端資料庫到 Web 介面的完整 IoT 資料鏈路。") ] },
          { id: "stack", title: DETAIL_TITLES.stack, paragraphs: [text("ESP8266 · Arduino C/C++ · MQTT · JSON · Django · SQLite · Bootstrap · RGB LED · 8×8 LED Matrix", "ESP8266 · Arduino C/C++ · MQTT · JSON · Django · SQLite · Bootstrap · RGB LED · 8×8 LED 点阵", "ESP8266 · Arduino C/C++ · MQTT · JSON · Django · SQLite · Bootstrap · RGB LED · 8×8 LED 點陣") ] },
        ],
      },
      skills: ["esp8266", "arduino-c", "mqtt", "json-iot", "django", "sqlite", "led-mat", "rgb-led", "embedded-systems"],
      trackIds: ["iot-device"],
      position: { x: 2080, y: CANVAS_LANE_Y.project + 45 },
      size: { ...CANVAS_DENSE_CARD_SIZE },
    },
    {
      id: "project-swiftui-calculator",
      group: "project",
      title: {
        en: "SwiftUI Calculator and Cross-platform Apps",
        zhHans: "SwiftUI 计算器与跨平台应用",
        zhHant: "SwiftUI 計算機與跨平台應用",
      },
      subtitle: {
        en: "Mobile App Coursework Portfolio",
        zhHans: "移动应用课程项目集",
        zhHant: "行動應用課程專案集",
      },
      timeLabel: {
        en: "Coursework",
        zhHans: "课程作业",
        zhHant: "課程作業",
      },
      summary: {
        en: "SwiftUI/MVVM iOS calculator supporting DEC, BIN, and HEX modes with input validation and responsive layouts.",
        zhHans: "SwiftUI/MVVM iOS 计算器,支持 DEC、BIN、HEX 模式、输入校验、表达式优先级与横竖屏自适应布局。",
        zhHant: "SwiftUI/MVVM iOS 計算機,支援 DEC、BIN、HEX 模式、輸入校驗、運算優先級與橫豎屏自適應佈局。",
      },
      details: {
        overview: {
          en: "Built a SwiftUI/MVVM iOS calculator supporting DEC, BIN, and HEX modes, input validation, expression precedence handling, and orientation-aware layouts using GeometryReader and LazyVGrid.",
          zhHans: "开发 SwiftUI/MVVM iOS 计算器,支持 DEC、BIN 和 HEX 模式、输入校验、表达式优先级处理,以及基于 GeometryReader 和 LazyVGrid 的横竖屏自适应布局。",
          zhHant: "開發 SwiftUI/MVVM iOS 計算機,支援 DEC、BIN 與 HEX 模式、輸入校驗、運算優先級處理,以及基於 GeometryReader 與 LazyVGrid 的橫豎屏自適應佈局。",
        },
        whatIDid: [],
        tech: {
          en: "Swift, SwiftUI, MVVM, ObservableObject, GeometryReader, LazyVGrid, Xcode",
          zhHans: "Swift、SwiftUI、MVVM、ObservableObject、GeometryReader、LazyVGrid、Xcode",
          zhHant: "Swift、SwiftUI、MVVM、ObservableObject、GeometryReader、LazyVGrid、Xcode",
        },
        sections: [
          { id: "overview", title: DETAIL_TITLES.overview, paragraphs: [text("A SwiftUI/MVVM calculator supporting decimal, binary, and hexadecimal modes with responsive portrait and landscape layouts.", "基于 SwiftUI/MVVM 的计算器，支持十进制、二进制和十六进制模式，以及横竖屏响应式布局。", "基於 SwiftUI/MVVM 的計算機，支援十進位、二進位與十六進位模式，以及橫豎屏響應式佈局。") ] },
          { id: "problem", title: DETAIL_TITLES.problem, paragraphs: [text("The interface needed consistent expression handling, input validation, precedence, and mode-specific controls across changing device orientations.", "界面需要在不同设备方向下保持一致的表达式处理、输入校验、运算优先级和模式化控件。", "介面需要在不同裝置方向下保持一致的表達式處理、輸入驗證、運算優先級與模式化控制項。") ] },
          { id: "role", title: DETAIL_TITLES.role, items: [text("Implemented the calculator logic and validation rules.", "实现计算逻辑与输入校验规则。", "實作計算邏輯與輸入驗證規則。"), text("Structured view state with MVVM and ObservableObject.", "使用 MVVM 与 ObservableObject 组织视图状态。", "使用 MVVM 與 ObservableObject 組織視圖狀態。"), text("Built orientation-aware grids with GeometryReader and LazyVGrid.", "使用 GeometryReader 与 LazyVGrid 构建方向自适应网格。", "使用 GeometryReader 與 LazyVGrid 建構方向自適應網格。") ] },
          { id: "engineering", title: DETAIL_TITLES.engineering, paragraphs: [text("Separated presentation and calculator state through MVVM, then used geometry-driven layouts to adapt control density without duplicating the calculation model.", "通过 MVVM 分离界面和计算状态，再使用几何驱动布局调整控件密度，避免重复计算模型。", "透過 MVVM 分離介面與計算狀態，再使用幾何驅動佈局調整控制項密度，避免重複計算模型。") ] },
          { id: "evidence", title: DETAIL_TITLES.evidence, items: [text("DEC, BIN, and HEX calculation modes", "DEC、BIN 与 HEX 三种计算模式", "DEC、BIN 與 HEX 三種計算模式"), text("Input validation and expression-precedence handling", "输入校验与表达式优先级处理", "輸入驗證與表達式優先級處理"), text("Portrait and landscape adaptive layouts", "横竖屏自适应布局", "橫豎屏自適應佈局") ] },
          { id: "stack", title: DETAIL_TITLES.stack, paragraphs: [text("Swift · SwiftUI · MVVM · ObservableObject · GeometryReader · LazyVGrid · Xcode", "Swift · SwiftUI · MVVM · ObservableObject · GeometryReader · LazyVGrid · Xcode", "Swift · SwiftUI · MVVM · ObservableObject · GeometryReader · LazyVGrid · Xcode") ] },
        ],
      },
      skills: ["swift", "swiftui", "mvvm", "xcode"],
      trackIds: ["software-data"],
      position: { x: 2600, y: CANVAS_LANE_Y.project + 22 },
      size: { ...CANVAS_COMPACT_CARD_SIZE },
      emphasis: "secondary",
    },
  ],

  connections: [
    // Profile → education
    { id: "c-profile-edu", from: "profile-main", to: "edu-polyu", type: "profile-to-group" },
    { id: "c-profile-edu-2", from: "profile-main", to: "edu-insa", type: "profile-to-group" },

    // Primary degree → exchange program
    { id: "c-edu-1", from: "edu-polyu", to: "edu-insa", type: "sequence" },

    // Internship sequence (newer on the left → older on the right)
    { id: "c-intern-1", from: "intern-ddiin", to: "intern-huatai", type: "sequence" },
    { id: "c-intern-2", from: "intern-huatai", to: "intern-polyu-3d", type: "sequence" },

    // Project sequence (left to right)
    { id: "c-project-1", from: "project-career-portal", to: "project-uav-fyp", type: "project-sequence" },
    { id: "c-project-2", from: "project-uav-fyp", to: "project-robot-car", type: "project-sequence" },
    { id: "c-project-3", from: "project-robot-car", to: "project-sushiro", type: "project-sequence" },
    { id: "c-project-4", from: "project-sushiro", to: "project-iot-monitoring", type: "project-sequence" },
    { id: "c-project-5", from: "project-iot-monitoring", to: "project-swiftui-calculator", type: "project-sequence" },

    // FYP line from PolyU to FYP
    { id: "c-edu-fyp", from: "edu-polyu", to: "project-uav-fyp", type: "fyp" },
  ],
};
