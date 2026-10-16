const logotext = "PRINCELY";
const meta = {
    title: "Princely Oseji",
    description: "I’m Princely Oseji, a Software Engineer, Data Scientist, and Machine Learning Engineer currently pursuing MSc. Computer Science at Boston University. I build production software alongside predictive models, data systems, and scalable ML applications.",
};

const introdata = {
    title: "I’m Princely Oseji",
    animated: {
        first: "I build ML models",
        second: "I analyze data at scale",
        third: "I build software",
    },
    description: "Software Engineer, Data Scientist, and ML Engineer passionate about shipping reliable systems and turning data into actionable insights. Currently pursuing MSc. Computer Science at Boston University, with experience across full-stack tooling, backend services, predictive modeling, and scalable machine learning.",
    your_img_url: require("./assets/images/home-portrait.jpg"),
};

const dataabout = {
    title: "About myself",
    aboutme: "I'm a Software Engineer, Data Scientist, and Machine Learning Engineer with a strong foundation in engineering and computer science. Currently pursuing my MSc. in Computer Science at Boston University, I build end-to-end software—from APIs and desktop tools to data pipelines and ML systems—while applying rigorous analysis to real-world problems. My experience spans optimizing transformer-based forecasting models at Schneider Electric, conducting research in human-machine interaction at BU's Human-2-Everything Lab, and shipping production-minded applications such as system monitoring tools and agentic workflows. I'm passionate about writing clean, maintainable code, building scalable systems, and translating complex technical work into clear business value at the intersection of software, data, and machine learning.",
};
const worktimeline = [{
        jobtitle: "Research Scientist",
        where: "Boston University",
        date: "Aug 2026 - Present",
    },
    {
        jobtitle: "Research Assistant",
        where: "Human-2-Everything Lab BU",
        date: "Jan 2025 - Present",
    },
    {
        jobtitle: "Data Science Intern (Global Finance)",
        where: "Schneider Electric",
        date: "Jun 2025 - Aug 2025",
    },
    {
        jobtitle: "Quantitative Research Intern",
        where: "Level2 (ABN AMRO + Techstars 23)",
        date: "Jul 2024 - Dec 2024",
    },
    {
        jobtitle: "Intern (Project Assistant)",
        where: "Nadeem Group (SED Limited)",
        date: "Jun 2023 - Sep 2023",
    },
];

const skillsCategories = [
    {
        category: "Programming Languages & Scripting",
        items: ["Python", "Java", "SQL", "R", "MATLAB", "Bash"],
    },
    {
        category: "Software Development & Tools",
        items: [
            "Git",
            "Linux",
            "WSL",
            "HTML",
            "CSS",
            "JSON",
            "YAML",
            "pytest",
            "Claude Code",
            "Cursor",
        ],
    },
    {
        category: "Cloud, DevOps & Backend",
        items: [
            "AWS",
            "GCP",
            "Kubernetes",
            "Jenkins",
            "Kafka",
            "FastAPI",
            "REST APIs",
        ],
    },
    {
        category: "ML & Data Engineering",
        items: [
            "NumPy",
            "pandas",
            "PySpark",
            "PyTorch",
            "TensorFlow",
            "Hugging Face",
            "MLflow",
            "OpenCV",
            "Distributed Training",
            "Model Evaluation",
        ],
    },
    {
        category: "LLM, Gen AI & Visualization",
        items: [
            "LangChain",
            "LangGraph",
            "vLLM",
            "Ollama",
            "Prompt Engineering",
            "Matplotlib",
            "Streamlit",
            "Power BI",
            "Tableau",
        ],
    },
];

const services = [{
        title: "Software Engineering",
        description: "Designing and building reliable applications, APIs, and tooling with strong attention to architecture, testing, and maintainability. Experience delivering desktop and backend systems, developer workflows, and production-ready software across the stack.",
    },
    {
        title: "Data Science & Analytics",
        description: "Expertise in building scalable ETL pipelines, conducting exploratory data analysis, and transforming millions of records into actionable business insights. Experience with PySpark, Databricks, and cloud platforms.",
    },
    {
        title: "Machine Learning Engineering",
        description: "Specialized in developing and optimizing ML models including transformer-based time series forecasting, deep learning for computer vision, and sequential recommendation systems. Proficient in TensorFlow, PyTorch, and model deployment.",
    },
    {
        title: "Research & Development",
        description: "Conducting research in human-machine interaction, developing simulation environments for ML model testing, and contributing to academic work in data-driven estimation and predictive modeling.",
    },
];

const dataportfolio = [
    // Row 1 — strongest ML / research / quantitative signal
    {
        name: "Predictive Modelling of Battery Degradation",
        img: require("./assets/images/batter.jpg"),
        description: "Predictive Modelling of Battery Degradation - Developed a data-driven SoH estimation framework for lithium-ion batteries using deep learning sequence models and tree-based ensemble regressors, achieving RMSE of 0.295.",
        link: "/portfolio/predictive-modelling-battery-degradation",
    },
    {
        name: "Self-refining LLM Agent",
        img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=400&fit=crop",
        description: "Self-refining LLM Agent - Built a local LangGraph + Ollama research agent that plans web searches, cites sources, and iteratively critiques and revises answers until quality thresholds are met.",
        link: "/portfolio/self-refining-llm-agent",
    },
    {
        name: "Hand OA Severity Classification",
        img: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400&h=400&fit=crop",
        description: "Hand OA Severity Classification - Built a reproducible patient-level data and manifest pipeline for hand osteoarthritis severity grading from finger-joint X-ray ROIs, supporting KL and multitask (KL+JSN+OP) computer vision experiments.",
        link: "/portfolio/hand-oa-severity-classification",
    },
    {
        name: "Two-Layered Portfolio Optimization",
        img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop",
        description: "Two-Layered Portfolio Optimization - Classified 500+ S&P 500 stocks and optimized weights using convex optimization, achieving +28.75% total return in 2024, outperforming S&P 500 by +3.75%.",
        link: "/portfolio/two-layered-portfolio-optimization",
    },
    // Row 2 — deep learning / large-scale systems
    {
        name: "Neural Sequential Recommender for Book Discovery",
        img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
        description: "Neural Sequential Recommender for Book Discovery - Built a large-scale recommendation system on Goodreads dataset (876K users, 2.3M books) using SASRec and Word2Vec embeddings for personalized book suggestions.",
        link: "/portfolio/neural-sequential-recommender-book-discovery",
    },
    {
        name: "Diabetic Retinopathy Detection",
        img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop",
        description: "Diabetic Retinopathy Detection - Designed and trained a 34-layer CNN with Residual Blocks achieving 92% accuracy on 88,000+ retinal images, supporting early diagnosis for millions at risk.",
        link: "/portfolio/diabetic-retinopathy-detection",
    },
    {
        name: "Large Scale Text Processing and Classification",
        img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop",
        description: "Large Scale Text Processing and Classification - Developed a text retrieval pipeline over 1M+ Wikipedia documents using PySpark, achieving 3x improvement in processing efficiency with sub-second inference time.",
        link: "/portfolio/large-scale-text-processing-classification",
    },
    {
        name: "NeRF-based 3D Avatar",
        img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=400&fit=crop",
        description: "NeRF-based 3D Avatar - Built an end-to-end Nerfstudio pipeline that reconstructs a personal 3D avatar from multi-view images and exports a Blender-ready mesh via Poisson surface reconstruction.",
        link: "/portfolio/nerf-based-3d-avatar",
    },
    // Row 3 — applied modeling / systems / foundational projects
    {
        name: "Financial Modeling with CAPM",
        img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=400&fit=crop",
        description: "Financial Modeling with CAPM - Implemented the Capital Asset Pricing Model in Python to estimate stock betas versus the S&P 500 and evaluate expected risk-return relationships, achieving ±1.5% deviation from historical performance with R > 0.85.",
        link: "/portfolio/financial-modeling-capm",
    },
    {
        name: "WinChangeMonitor",
        img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=400&fit=crop",
        description: "WinChangeMonitor - Designed a Windows desktop tool that baselines filesystem, registry, and services, then diffs post-execution changes into HTML/JSON reports for analyzing third-party software.",
        link: "/portfolio/winchangemonitor",
    },
    {
        name: "Sentiment Analysis Using NLP",
        img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop",
        description: "Sentiment Analysis Using NLP - Trained Naive Bayes classifier on 10,000+ Amazon Echo reviews achieving 85% accuracy in predicting customer sentiment with actionable insights extraction.",
        link: "/portfolio/sentiment-analysis-nlp",
    },
    {
        name: "Hospital ER Simulation",
        img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=400&fit=crop",
        description: "Hospital ER Simulation - Built Java-based discrete-event simulation engine modeling end-to-end ER flow with priority-based scheduling, tracking throughput and utilization metrics.",
        link: "/portfolio/hospital-er-simulation",
    },
];

const otherProjects = [
    {
        name: "Trajectory Modelling",
        description: "Designed MATLAB code for trajectory optimization of 25,000 kg space shuttle projectile using shooting method and Runge-Kutta 4, reducing errors by 5% with 3D Earth rotation model.",
        link: "https://github.com/pco30/Trajectory-modelling",
    },
    {
        name: "Modelling Space Shuttle Heat Tiles",
        description: "Developed computational models to simulate thermal behavior and heat transfer in space shuttle heat tiles during re-entry, analyzing temperature distribution and material performance under extreme conditions.",
        link: "https://github.com/pco30/Modelling-space-shuttle-heat-tiles-on-re-entry",
    },
];

const contactConfig = {
    YOUR_EMAIL: "pco30@bu.edu",
    YOUR_FONE: "(857) 961-6539",
    description: "I'm always open to discussing new opportunities, collaborations, or interesting projects. Whether you're looking for a data scientist, ML engineer, or research collaborator, feel free to reach out. Let's connect and explore how we can work together to solve complex problems with data-driven solutions.",
    // creat an emailjs.com account 
    // check out this tutorial https://www.emailjs.com/docs/examples/reactjs/
    YOUR_SERVICE_ID: "service_qbo9x3o",
    YOUR_TEMPLATE_ID: "template_sy39peb",
    YOUR_USER_ID: "SotkRVp379mkik_S4",
};

const socialprofils = {
    github: "https://github.com/pco30",
    linkedin: "https://linkedin.com/in/princely-oseji",
    twitter: "https://twitter.com",
};
export {
    meta,
    dataabout,
    dataportfolio,
    worktimeline,
    skillsCategories,
    services,
    introdata,
    contactConfig,
    socialprofils,
    logotext,
    otherProjects,
};