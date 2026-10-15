const logotext = "PRINCELY";
const meta = {
    title: "Princely Oseji",
    description: "I’m Princely Oseji, a Data Scientist and Machine Learning Engineer currently pursuing MSc. Computer Science at Boston University. Specializing in predictive modeling, time series forecasting, and scalable ML systems.",
};

const introdata = {
    title: "I’m Princely Oseji",
    animated: {
        first: "I build ML models",
        second: "I analyze data at scale",
        third: "I solve complex problems",
    },
    description: "Data Scientist and ML Engineer passionate about transforming data into actionable insights. Currently pursuing MSc. Computer Science at Boston University with expertise in predictive modeling, time series forecasting, and scalable machine learning systems.",
    your_img_url: require("./assets/images/IMG_0765.jpg"),
};

const dataabout = {
    title: "About myself",
    aboutme: "I'm a Data Scientist and Machine Learning Engineer with a strong foundation in both engineering and computer science. Currently pursuing my MSc. in Computer Science at Boston University, I bring a unique perspective combining mechanical engineering principles with advanced data science techniques. My experience spans from optimizing transformer-based forecasting models at Schneider Electric to conducting cutting-edge research in human-machine interaction at BU's Human-2-Everything Lab. I'm passionate about building scalable ML systems, conducting rigorous data analysis, and translating complex technical insights into business value. With expertise in Python, PySpark, TensorFlow, and cloud platforms, I thrive on solving challenging problems at the intersection of data, machine learning, and real-world applications.",
};
const worktimeline = [{
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

const skills = [{
        name: "Python",
        value: 95,
    },
    {
        name: "PySpark",
        value: 85,
    },
    {
        name: "TensorFlow",
        value: 85,
    },
    {
        name: "SQL",
        value: 90,
    },
    {
        name: "R",
        value: 80,
    },
    {
        name: "MATLAB",
        value: 85,
    },
    {
        name: "Java",
        value: 75,
    },
    {
        name: "Databricks",
        value: 85,
    },
    {
        name: "AWS",
        value: 80,
    },
    {
        name: "Machine Learning",
        value: 90,
    },
];

const services = [{
        title: "Data Science & Analytics",
        description: "Expertise in building scalable ETL pipelines, conducting exploratory data analysis, and transforming millions of records into actionable business insights. Experience with PySpark, Databricks, and cloud platforms.",
    },
    {
        title: "Machine Learning Engineering",
        description: "Specialized in developing and optimizing ML models including transformer-based time series forecasting, deep learning for computer vision, and sequential recommendation systems. Proficient in TensorFlow and model deployment.",
    },
    {
        title: "Research & Development",
        description: "Conducting cutting-edge research in human-machine interaction, developing simulation environments for ML model testing, and contributing to academic publications in data-driven estimation and predictive modeling.",
    },
];

const dataportfolio = [    {
        name: "Hand OA Severity Classification",
        img: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=1200&h=675&fit=crop",
        description: "Hand OA Severity Classification - Built a reproducible patient-level data and manifest pipeline for hand osteoarthritis severity grading from finger-joint X-ray ROIs, supporting KL and multitask (KL+JSN+OP) computer vision experiments.",
        link: "/portfolio/hand-oa-severity-classification",
    },
    {
        name: "NeRF-based 3D Avatar",
        img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=400&fit=crop",
        description: "NeRF-based 3D Avatar - Built an end-to-end Nerfstudio pipeline that reconstructs a personal 3D avatar from multi-view images and exports a Blender-ready mesh via Poisson surface reconstruction.",
        link: "/portfolio/nerf-based-3d-avatar",
    },
    {
        name: "Self-refining LLM Agent",
        img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=400&fit=crop",
        description: "Self-refining LLM Agent - Built a local LangGraph + Ollama research agent that plans web searches, cites sources, and iteratively critiques and revises answers until quality thresholds are met.",
        link: "/portfolio/self-refining-llm-agent",
    },
    {
        name: "WinChangeMonitor",
        img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=400&fit=crop",
        description: "WinChangeMonitor - Designed a Windows desktop tool that baselines filesystem, registry, and services, then diffs post-execution changes into HTML/JSON reports for analyzing third-party software.",
        link: "/portfolio/winchangemonitor",
    },
    {
        name: "Predictive Modelling of Battery Degradation",
        img: require("./assets/images/batter.jpg"),
        description: "Predictive Modelling of Battery Degradation - Developed a data-driven SoH estimation framework for lithium-ion batteries using deep learning sequence models and tree-based ensemble regressors, achieving RMSE of 0.295.",
        link: "/portfolio/predictive-modelling-battery-degradation",
    },
    {
        name: "Neural Sequential Recommender for Book Discovery",
        img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
        description: "Neural Sequential Recommender for Book Discovery - Built a large-scale recommendation system on Goodreads dataset (876K users, 2.3M books) using SASRec and Word2Vec embeddings for personalized book suggestions.",
        link: "/portfolio/neural-sequential-recommender-book-discovery",
    },
    {
        name: "Large Scale Text Processing and Classification",
        img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop",
        description: "Large Scale Text Processing and Classification - Developed a text retrieval pipeline over 1M+ Wikipedia documents using PySpark, achieving 3x improvement in processing efficiency with sub-second inference time.",
        link: "/portfolio/large-scale-text-processing-classification",
    },
    {
        name: "Diabetic Retinopathy Detection",
        img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop",
        description: "Diabetic Retinopathy Detection - Designed and trained a 34-layer CNN with Residual Blocks achieving 92% accuracy on 88,000+ retinal images, supporting early diagnosis for millions at risk.",
        link: "/portfolio/diabetic-retinopathy-detection",
    },
    {
        name: "Two-Layered Portfolio Optimization",
        img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop",
        description: "Two-Layered Portfolio Optimization - Classified 500+ S&P 500 stocks and optimized weights using convex optimization, achieving +28.75% total return in 2024, outperforming S&P 500 by +3.75%.",
        link: "/portfolio/two-layered-portfolio-optimization",
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
        name: "Financial Modeling with CAPM",
        description: "Developed CAPM implementation using Python to evaluate risk-return relationships, achieving ±1.5% deviation from historical performance with R > 0.85.",
        link: "https://github.com/pco30/Capital-Asset-Pricing-Model",
    },
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
    skills,
    services,
    introdata,
    contactConfig,
    socialprofils,
    logotext,
    otherProjects,
};