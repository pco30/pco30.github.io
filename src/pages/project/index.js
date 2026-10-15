import React, { useEffect, useRef, useCallback } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { dataportfolio, meta } from "../../content_option";
import ERImage from "../../assets/images/ER.jpeg";
import SentimentImage from "../../assets/images/sentiment.png";
import PortfolioImage from "../../assets/images/portfolio.jpg";
import DiabeticRetinopathyImage from "../../assets/images/diabetic-retinopathy-stages.jpg";
import BooksImage from "../../assets/images/books.jpg";
import SOHImage from "../../assets/images/soh.png";
import EarlyLifeImage from "../../assets/images/early-life.png";

export const ProjectDetail = () => {
  const { projectId } = useParams();
  const mermaidRef = useRef(null);
  const diagramCodeRef = useRef(null);
  
  // Navigation sections
  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'problem', label: 'Problem/Challenge' },
    { id: 'pipeline', label: 'Model Pipeline' },
    { id: 'results', label: 'Results' },
    { id: 'technologies', label: 'Technologies Used' }
  ];
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Offset for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  // Callback ref to capture diagram code immediately when element renders
  const mermaidCallbackRef = useCallback((node) => {
    mermaidRef.current = node;
    if (node) {
      // Capture code immediately - this runs synchronously when React attaches the ref
      // Try multiple times to ensure we get it before Mermaid processes it
      const captureCode = () => {
        const code = node.textContent || node.innerText;
        if (code && code.trim() && code.includes('graph')) {
          diagramCodeRef.current = code.trim();
          node.setAttribute('data-diagram-code', code.trim());
          return true;
        }
        return false;
      };
      
      // Try immediately
      if (!captureCode()) {
        // If not captured, try again after a microtask
        setTimeout(captureCode, 0);
      }
    }
  }, []);
  
  // Find the project by matching the link
  const project = dataportfolio.find(
    (p) => p.link === `/portfolio/${projectId}`
  );

  // Initialize Mermaid for pipeline diagram
  useEffect(() => {
    const renderMermaid = (diagramCode) => {
      if (!window.mermaid || !mermaidRef.current || !diagramCode) return;
      
      // Get current theme
      const isDarkMode = document.documentElement.getAttribute('data-theme') !== 'light';
      const arrowColor = isDarkMode ? '#fff' : '#000';
      const textColor = isDarkMode ? '#fff' : '#000';
      
      // Check if SVG already exists - if so, just update colors instead of re-rendering
      const existingSVG = mermaidRef.current.querySelector('svg');
      if (existingSVG) {
        // Update colors on existing SVG
        setTimeout(() => {
          const paths = existingSVG.querySelectorAll('.edgePath .path, path[marker-end]');
          const markers = existingSVG.querySelectorAll('marker path, marker polygon, .arrowheadPath');
          const textElements = existingSVG.querySelectorAll('text');
          paths.forEach(path => {
            path.setAttribute('stroke', arrowColor);
            path.style.stroke = arrowColor;
          });
          markers.forEach(marker => {
            marker.setAttribute('fill', arrowColor);
            marker.setAttribute('stroke', arrowColor);
            marker.style.fill = arrowColor;
            marker.style.stroke = arrowColor;
          });
          textElements.forEach(text => {
            text.setAttribute('fill', textColor);
            text.style.fill = textColor;
          });
        }, 50);
        return; // Don't re-render if SVG exists
      }
      
      // Initialize Mermaid with theme-aware colors
      window.mermaid.initialize({ 
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        themeVariables: {
          primaryColor: '#fff',
          primaryTextColor: textColor,
          primaryBorderColor: '#000',
          lineColor: arrowColor,
          secondaryColor: '#000',
          tertiaryColor: '#fff',
          background: 'transparent',
          edgeLabelBackground: 'transparent',
          mainBkg: 'transparent',
          textColor: textColor,
          arrowheadColor: arrowColor
        }
      });
      
      // Clear existing content
      mermaidRef.current.innerHTML = '';
      mermaidRef.current.textContent = diagramCode;
      
      // Render the diagram with retry logic
      const attemptRender = (retries = 3) => {
        window.mermaid.run({
          nodes: [mermaidRef.current],
          suppressErrors: true
        }).then(() => {
          // Verify SVG was created
          setTimeout(() => {
            const svg = mermaidRef.current?.querySelector('svg');
            if (!svg && retries > 0) {
              // Retry if SVG wasn't created
              mermaidRef.current.textContent = diagramCode;
              attemptRender(retries - 1);
              return;
            }
            
            // Force update arrow colors after render
            if (svg) {
              const paths = svg.querySelectorAll('.edgePath .path, path[marker-end]');
              const markers = svg.querySelectorAll('marker path, marker polygon, .arrowheadPath');
              const textElements = svg.querySelectorAll('text');
              paths.forEach(path => {
                path.setAttribute('stroke', arrowColor);
                path.style.stroke = arrowColor;
              });
              markers.forEach(marker => {
                marker.setAttribute('fill', arrowColor);
                marker.setAttribute('stroke', arrowColor);
                marker.style.fill = arrowColor;
                marker.style.stroke = arrowColor;
              });
              textElements.forEach(text => {
                text.setAttribute('fill', textColor);
                text.style.fill = textColor;
              });
            }
          }, 100);
        }).catch(err => {
          console.error('Mermaid render error:', err);
          if (retries > 0) {
            // Retry on error
            mermaidRef.current.textContent = diagramCode;
            setTimeout(() => attemptRender(retries - 1), 200);
          }
        });
      };
      
      attemptRender();
    };

    const captureAndRender = () => {
      if (!window.mermaid || !mermaidRef.current) {
        return false;
      }

      const mermaidElement = mermaidRef.current;
      const hasSVG = mermaidElement.querySelector('svg') !== null;
      
      // If we already have the code stored and SVG is rendered, we're good
      if (hasSVG && diagramCodeRef.current) {
        return true;
      }
      
      // Try to get the diagram code from text content
      // This works because React renders the template literal as text before Mermaid processes it
      let diagramCode = '';
      
      // Method 1: Direct textContent (works before Mermaid renders)
      diagramCode = mermaidElement.textContent || mermaidElement.innerText;
      
      // Method 2: Get from text nodes if direct method didn't work
      if (!diagramCode || !diagramCode.trim()) {
        const textNodes = Array.from(mermaidElement.childNodes)
          .filter(node => node.nodeType === Node.TEXT_NODE)
          .map(node => node.textContent)
          .join('')
          .trim();
        if (textNodes) {
          diagramCode = textNodes;
        }
      }
      
      // Method 3: If SVG exists, try to get code from data attribute or previous text
      if (!diagramCode && hasSVG) {
        // Check if we stored it in a data attribute
        diagramCode = mermaidElement.getAttribute('data-diagram-code') || '';
      }
      
      // Store the diagram code if we found it
      if (diagramCode && diagramCode.trim()) {
        diagramCodeRef.current = diagramCode.trim();
        // Store in data attribute as backup
        mermaidElement.setAttribute('data-diagram-code', diagramCodeRef.current);
        
        // Only render if not already rendered
        if (!hasSVG) {
          renderMermaid(diagramCodeRef.current);
        }
        return true;
      }
      
      return false;
    };

    const initializeMermaid = () => {
      if (!window.mermaid) {
        setTimeout(initializeMermaid, 100);
        return;
      }

      if (!mermaidRef.current) {
        setTimeout(initializeMermaid, 50);
        return;
      }

      // Try to capture and render immediately
      if (!captureAndRender()) {
        // Retry with multiple attempts
        let attempts = 0;
        const retryCapture = () => {
          attempts++;
          if (attempts < 5 && mermaidRef.current && !diagramCodeRef.current) {
            if (!captureAndRender()) {
              setTimeout(retryCapture, 100);
            }
          }
        };
        setTimeout(retryCapture, 100);
      }
    };
    
    // Reset diagram code when project changes
    diagramCodeRef.current = null;
    
    // Watch for when the mermaid element gets content (captures code before Mermaid processes it)
    let elementObserver = null;
    const setupElementObserver = () => {
      if (mermaidRef.current && !elementObserver) {
        elementObserver = new MutationObserver(() => {
          // Only capture if we don't have code yet and there's no SVG
          if (!diagramCodeRef.current && !mermaidRef.current?.querySelector('svg')) {
            const code = mermaidRef.current.textContent || mermaidRef.current.innerText;
            if (code && code.trim() && code.includes('graph')) {
              diagramCodeRef.current = code.trim();
              mermaidRef.current.setAttribute('data-diagram-code', code.trim());
            }
          }
        });
        elementObserver.observe(mermaidRef.current, {
          childList: true,
          subtree: true,
          characterData: true
        });
      }
    };
    
    // Set up element observer immediately
    if (mermaidRef.current) {
      setupElementObserver();
    } else {
      // Wait for element to be available
      const checkElement = setInterval(() => {
        if (mermaidRef.current) {
          setupElementObserver();
          clearInterval(checkElement);
        }
      }, 50);
      setTimeout(() => clearInterval(checkElement), 2000); // Timeout after 2s
    }
    
    // Start initialization with a delay to allow callback ref and observer to capture code
    const timeoutId = setTimeout(initializeMermaid, 250);
    
    // Reinitialize on theme change
    const themeObserver = new MutationObserver(() => {
      if (!mermaidRef.current) return;
      
      // Get code from multiple sources - must have code to re-render
      let code = diagramCodeRef.current || 
                 mermaidRef.current.getAttribute('data-diagram-code');
      
      // If we don't have code stored, try to get it from the element
      if (!code || !code.trim()) {
        // Check if there's text content (shouldn't happen if SVG exists, but just in case)
        const textContent = mermaidRef.current.textContent || mermaidRef.current.innerText;
        if (textContent && textContent.trim() && textContent.includes('graph')) {
          code = textContent.trim();
          diagramCodeRef.current = code;
          mermaidRef.current.setAttribute('data-diagram-code', code);
        }
      }
      
      // Only proceed if we have valid code
      if (code && code.trim() && mermaidRef.current) {
        // renderMermaid will check if SVG exists and just update colors if it does
        renderMermaid(code.trim());
      }
    });
    
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    
    return () => {
      clearTimeout(timeoutId);
      if (elementObserver) elementObserver.disconnect();
      themeObserver.disconnect();
    };
  }, [projectId]); // Re-run when project changes

  if (!project) {
    return (
      <HelmetProvider>
        <Container className="About-header">
          <Helmet>
            <meta charSet="utf-8" />
            <title> Project Not Found | {meta.title} </title>
            <meta name="description" content={meta.description} />
          </Helmet>
          <Row className="mb-5 mt-3 pt-md-3">
            <Col lg="8">
              <h1 className="display-4 mb-4">Project Not Found</h1>
              <hr className="t_border my-4 ml-0 text-left" />
              <p>The project you're looking for doesn't exist.</p>
              <Link to="/portfolio" className="text_2">
                Back to Portfolio
              </Link>
            </Col>
          </Row>
        </Container>
      </HelmetProvider>
    );
  }

  // Special content for Diabetic Retinopathy Detection
  const isDiabeticRetinopathy = project.link === "/portfolio/diabetic-retinopathy-detection";
  const isSentimentAnalysis = project.link === "/portfolio/sentiment-analysis-nlp";
  const isPortfolioOptimization = project.link === "/portfolio/two-layered-portfolio-optimization";
  const isHospitalER = project.link === "/portfolio/hospital-er-simulation";
  const isBookRecommender = project.link === "/portfolio/neural-sequential-recommender-book-discovery";
  const isBatteryDegradation = project.link === "/portfolio/predictive-modelling-battery-degradation";
  const isTextProcessing = project.link === "/portfolio/large-scale-text-processing-classification";
  const isSelfAvatarNerf = project.link === "/portfolio/nerf-based-3d-avatar";
  const isSelfRefiningAgent = project.link === "/portfolio/self-refining-llm-agent";
  const isWinChangeMonitor = project.link === "/portfolio/winchangemonitor";
  const isHandOA = project.link === "/portfolio/hand-oa-severity-classification";

  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title> {project.name} | {meta.title} </title>
        <meta name="description" content={project.description} />
      </Helmet>
      {/* Sticky Back to Portfolio Link */}
      <Link to="/portfolio" className="back-to-portfolio-sticky">
        ← Back to Portfolio
      </Link>
      
      {/* Navigation Sidebar */}
      <nav className="project-nav-sidebar">
        <h3 className="project-nav-header">Contents</h3>
        <ul className="project-nav-list">
          {sections.map((section) => (
            <li key={section.id}>
              <button 
                onClick={() => scrollToSection(section.id)}
                className="project-nav-link"
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <Container className="About-header">
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4">{project.name}</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>
        
        {isDiabeticRetinopathy ? (
          <>
            {/* Project Image */}
            <Row className="sec_sp">
              <Col lg="12">
                <div className="project-image-container mb-4">
                  <img src={DiabeticRetinopathyImage} alt="Diabetic Retinopathy Detection" className="project-image" style={{ maxWidth: '800px', width: '100%', height: 'auto', margin: '0 auto', display: 'block' }} />
                </div>
              </Col>
            </Row>

            {/* Overview Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="overview" className="section-title">Overview</h2>
                <div className="project-description">
                  <p>
                    This project implements a deep learning solution for automated detection and classification of diabetic retinopathy (DR) 
                    from retinal fundus images. Diabetic retinopathy is a leading cause of blindness in adults, affecting millions of people 
                    worldwide. Early detection is crucial for preventing vision loss, but manual screening is time-consuming and requires 
                    specialized expertise.
                  </p>
                  <p>
                    The solution uses a custom 34-layer Convolutional Neural Network (CNN) architecture based on ResNet principles, 
                    achieving 92% accuracy on a dataset of 88,000+ retinal images. The model classifies images into five severity levels: 
                    No DR, Mild, Moderate, Severe, and Proliferative DR.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Problem/Challenge Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="problem" className="section-title">Problem/Challenge</h2>
                <div className="project-description">
                  <p>
                    <strong>Medical Challenge:</strong> Diabetic retinopathy affects over 347 million people globally, making it one of the 
                    most common complications of diabetes. Without timely intervention, it can lead to permanent vision loss.
                  </p>
                  <p>
                    <strong>Technical Challenges:</strong>
                  </p>
                  <ul className="project-list">
                    <li>Class imbalance in medical datasets requiring careful data handling</li>
                    <li>High variability in image quality, lighting, and patient demographics</li>
                    <li>Need for high accuracy and reliability in medical diagnosis</li>
                    <li>Handling large-scale datasets (88,000+ images) efficiently</li>
                  </ul>
                  <p>
                    The goal was to develop an automated system that could assist healthcare professionals in early detection, 
                    enabling timely treatment and preventing vision loss.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Model Pipeline Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="pipeline" className="section-title">Model Pipeline</h2>
                
                {/* Mermaid Graph */}
                <div className="mermaid-container">
                  <div className="mermaid" ref={mermaidCallbackRef}>
                    {`graph TD
    A["Data Loading"] --> B["Data Preprocessing"]
    B --> C["Data Augmentation"]
    C --> D["Custom ResNet Architecture"]
    D --> E["Residual Block Structure"]
    E --> F["Classification Head"]
    F --> G["Training & Optimization"]
    G --> H["Evaluation & Results"]
    
    style A fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style B fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style C fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style D fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style E fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style F fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style G fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style H fill:#fff,stroke:#000,stroke-width:2px,color:#000`}
                  </div>
                </div>

                {/* Pipeline Descriptions */}
                <div className="pipeline-descriptions">
                  <div className="pipeline-description-item">
                    <h4>1. Data Loading</h4>
                    <p>Load retinal images from directory structure organized by class labels. The dataset contains 88,000+ retinal fundus images across 5 severity classes (No DR, Mild, Moderate, Severe, Proliferative DR), organized in a directory-based structure for efficient data management.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>2. Data Preprocessing</h4>
                    <p>Images are resized to 256×256 pixels and normalized to pixel values between 0-1. The dataset is split into training (70%), validation (15%), and test (15%) sets to ensure proper model evaluation and prevent overfitting.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>3. Data Augmentation</h4>
                    <p>Runtime augmentation is applied during training to improve model generalization. Techniques include shear transformation (±20%), vertical flip, and real-time batch generation. This helps the model learn robust features despite variations in image quality and patient demographics.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>4. Custom ResNet Architecture</h4>
                    <p>A 34-layer deep Convolutional Neural Network based on ResNet principles. The architecture begins with an initial convolutional layer (7×7, 64 filters), followed by 4 residual stages with increasing filter depths. Skip connections enable effective gradient flow through the deep network, and batch normalization stabilizes training.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>5. Residual Block Structure</h4>
                    <p>Each residual stage contains a convolutional block (1×1 → 3×3 → 1×1 convolutions) followed by 2 identity blocks. Skip connections allow the network to learn residual mappings, making it easier to train deeper networks. ReLU activations introduce non-linearity throughout the network.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>6. Classification Head</h4>
                    <p>The final layers consist of average pooling to reduce spatial dimensions, a flatten layer to convert 2D features to 1D, a dense layer with 5 output neurons (one for each severity class), and a softmax activation function to produce probability distributions over the classes.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>7. Training & Optimization</h4>
                    <p>The model is trained using the Adam optimizer with categorical crossentropy loss. Early stopping (patience=15) prevents overfitting by monitoring validation loss, and model checkpointing saves the best-performing weights. This ensures optimal model performance while preventing unnecessary training time.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>8. Evaluation & Results</h4>
                    <p>The trained model achieves 92% accuracy on the test set. Performance is assessed using a confusion matrix, classification report (precision, recall, F1-score), and visual predictions. These metrics provide comprehensive insights into the model's ability to correctly classify diabetic retinopathy severity levels.</p>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Results Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="results" className="section-title">Results</h2>
                <div className="project-description">
                  <div className="results-grid">
                    <div className="result-card">
                      <h4>Accuracy</h4>
                      <p className="result-value">92%</p>
                      <p>Test set accuracy on 88,000+ images</p>
                    </div>
                    <div className="result-card">
                      <h4>Classes</h4>
                      <p className="result-value">5</p>
                      <p>Severity levels classified</p>
                    </div>
                    <div className="result-card">
                      <h4>Architecture</h4>
                      <p className="result-value">34 Layers</p>
                      <p>Deep CNN with residual blocks</p>
                    </div>
                    <div className="result-card">
                      <h4>Dataset</h4>
                      <p className="result-value">88,000+</p>
                      <p>Retinal fundus images</p>
                    </div>
                  </div>
                  <p className="mt-4">
                    The model successfully classifies diabetic retinopathy into five severity levels: <strong>No DR</strong>, 
                    <strong> Mild</strong>, <strong>Moderate</strong>, <strong>Severe</strong>, and <strong>Proliferative DR</strong>. 
                    The 92% accuracy demonstrates the model's capability to assist healthcare professionals in early detection, 
                    potentially supporting diagnosis for millions of people at risk globally.
                  </p>
                  <p>
                    Evaluation metrics include precision, recall, F1-score, and confusion matrix analysis, providing comprehensive 
                    insights into the model's performance across all severity classes.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Technologies Used Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="technologies" className="section-title">Technologies Used</h2>
                <div className="technologies-grid">
                  <div className="tech-category">
                    <h4>Deep Learning Framework</h4>
                    <ul className="tech-list">
                      <li>TensorFlow</li>
                      <li>Keras</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Data Processing</h4>
                    <ul className="tech-list">
                      <li>NumPy</li>
                      <li>Pandas</li>
                      <li>PIL (Pillow)</li>
                      <li>scikit-learn</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Visualization</h4>
                    <ul className="tech-list">
                      <li>Matplotlib</li>
                      <li>Seaborn</li>
                      <li>Plotly</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Model Architecture</h4>
                    <ul className="tech-list">
                      <li>Custom ResNet</li>
                      <li>Residual Blocks</li>
                      <li>Batch Normalization</li>
                      <li>ImageDataGenerator</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Training & Optimization</h4>
                    <ul className="tech-list">
                      <li>Adam Optimizer</li>
                      <li>Early Stopping</li>
                      <li>Model Checkpointing</li>
                      <li>Learning Rate Scheduling</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Evaluation Metrics</h4>
                    <ul className="tech-list">
                      <li>Confusion Matrix</li>
                      <li>Classification Report</li>
                      <li>Accuracy Score</li>
                      <li>Precision/Recall/F1-Score</li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        ) : isSentimentAnalysis ? (
          <>
            {/* Project Image */}
            <Row className="sec_sp">
              <Col lg="12">
                <div className="project-image-container mb-4">
                  <img src={SentimentImage} alt="Sentiment Analysis" className="project-image" style={{ maxWidth: '800px', width: '100%', height: 'auto', margin: '0 auto', display: 'block' }} />
                </div>
              </Col>
            </Row>

            {/* Overview Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="overview" className="section-title">Overview</h2>
                <div className="project-description">
                  <p>
                    This project implements a Natural Language Processing (NLP) solution for sentiment analysis of Amazon Echo product reviews. 
                    The goal is to automatically classify customer reviews as positive or negative sentiment, enabling businesses to extract 
                    actionable insights from large volumes of text data.
                  </p>
                  <p>
                    The solution uses traditional machine learning approaches with text preprocessing and feature extraction techniques. 
                    Two classification models were trained and evaluated: Naive Bayes (MultinomialNB) achieving 94% accuracy and Logistic 
                    Regression achieving 93% accuracy on a dataset of 3,150 Amazon Echo reviews.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Problem/Challenge Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="problem" className="section-title">Problem/Challenge</h2>
                <div className="project-description">
                  <p>
                    <strong>Business Challenge:</strong> With thousands of customer reviews generated daily, manually analyzing sentiment 
                    is time-consuming and impractical. Businesses need automated systems to understand customer satisfaction, identify product 
                    issues, and make data-driven decisions.
                  </p>
                  <p>
                    <strong>Technical Challenges:</strong>
                  </p>
                  <ul className="project-list">
                    <li>Converting unstructured text data into numerical features suitable for machine learning</li>
                    <li>Dealing with class imbalance (91.8% positive vs 8.2% negative reviews)</li>
                    <li>Selecting appropriate feature extraction methods for text classification</li>
                    <li>Evaluating model performance using appropriate metrics for imbalanced datasets</li>
                  </ul>
                  <p>
                    The goal was to develop an automated sentiment analysis system that could accurately classify customer reviews, 
                    enabling businesses to quickly understand customer sentiment and extract actionable insights for product improvement.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Model Pipeline Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="pipeline" className="section-title">Model Pipeline</h2>
                
                {/* Mermaid Graph */}
                <div className="mermaid-container">
                  <div className="mermaid" ref={mermaidCallbackRef}>
                    {`graph TD
    A["Data Loading<br/>(amazon_reviews.csv)"] --> B["Exploratory Data Analysis"]
    B --> C["Text Preprocessing<br/>(cleaning function)"]
    C --> D["Feature Extraction<br/>(CountVectorizer)"]
    D --> E["Train-Test Split<br/>(80-20)"]
    E --> F["Model Training"]
    F --> G["Naive Bayes<br/>(MultinomialNB)"]
    F --> H["Logistic Regression"]
    G --> I["Model Evaluation"]
    H --> I
    I --> J["Confusion Matrix"]
    I --> K["Classification Report"]
    
    style A fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style B fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style C fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style D fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style E fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style F fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style G fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style H fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style I fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style J fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style K fill:#fff,stroke:#000,stroke-width:2px,color:#000`}
                  </div>
                </div>

                {/* Pipeline Descriptions */}
                <div className="pipeline-descriptions">
                  <div className="pipeline-description-item">
                    <h4>1. Data Loading</h4>
                    <p>Load Amazon Echo reviews from CSV file containing 3,150 entries with columns: rating, date, variation, verified_reviews, and feedback (target variable: 1 for positive, 0 for negative). The dataset contains customer reviews with ratings ranging from 1 to 5 stars.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>2. Exploratory Data Analysis</h4>
                    <p>Conduct comprehensive EDA including: displaying data head and statistical summary, checking for null values using heatmaps, visualizing rating distribution with count plots, analyzing review length distribution with histograms, and identifying the longest review. This analysis reveals that 91.8% of reviews are positive (feedback=1) and 8.2% are negative (feedback=0), indicating class imbalance.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>3. Text Preprocessing</h4>
                    <p>Define a custom `cleaning` function that removes punctuation using `string.punctuation`, converts text to lowercase, removes English stopwords using `nltk.corpus.stopwords`, and tokenizes the text into individual words. This preprocessing step removes noise and standardizes the text data, making it suitable for feature extraction.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>4. Feature Extraction</h4>
                    <p>Use `sklearn.feature_extraction.text.CountVectorizer` with the custom `cleaning` function as its analyzer to convert preprocessed text into numerical word count vectors. The vectorizer creates a vocabulary from all unique words in the corpus and represents each review as a sparse matrix of word frequencies. This transforms unstructured text into a format suitable for machine learning algorithms.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>5. Train-Test Split</h4>
                    <p>Split the vectorized data into training (80%) and testing (20%) sets using `sklearn.model_selection.train_test_split`. This ensures the model is evaluated on unseen data, providing an unbiased estimate of model performance. The split maintains the class distribution in both training and testing sets.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>6. Model Training</h4>
                    <p>Train two different classification models: <strong>Naive Bayes (MultinomialNB)</strong> and <strong>Logistic Regression</strong>. Both models are trained on the training set using the word count features. Naive Bayes is particularly well-suited for text classification due to its probabilistic approach, while Logistic Regression provides interpretable coefficients and handles binary classification effectively.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>7. Model Evaluation</h4>
                    <p>Evaluate both models on the test set using confusion matrices and classification reports. The classification report provides precision, recall, F1-score, and accuracy metrics for each class. This comprehensive evaluation helps understand model performance across different metrics and identify potential areas for improvement.</p>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Results Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="results" className="section-title">Results</h2>
                <div className="project-description">
                  <div className="results-grid">
                    <div className="result-card">
                      <h4>Naive Bayes Accuracy</h4>
                      <p className="result-value">94%</p>
                      <p>Test set accuracy</p>
                    </div>
                    <div className="result-card">
                      <h4>Logistic Regression Accuracy</h4>
                      <p className="result-value">93%</p>
                      <p>Test set accuracy</p>
                    </div>
                    <div className="result-card">
                      <h4>Dataset Size</h4>
                      <p className="result-value">3,150</p>
                      <p>Amazon Echo reviews</p>
                    </div>
                    <div className="result-card">
                      <h4>Feature Dimensions</h4>
                      <p className="result-value">5,211</p>
                      <p>Unique word features</p>
                    </div>
                  </div>
                  <p className="mt-4">
                    The <strong>Naive Bayes classifier</strong> achieved the highest accuracy of <strong>94%</strong>, demonstrating excellent 
                    performance in classifying customer sentiment. The <strong>Logistic Regression model</strong> achieved <strong>93% accuracy</strong>, 
                    showing that both traditional machine learning approaches are effective for this sentiment analysis task.
                  </p>
                  <p>
                    Both models were evaluated using confusion matrices and classification reports, providing detailed metrics including precision, 
                    recall, and F1-score for both positive and negative classes. The high accuracy rates demonstrate the effectiveness of text preprocessing 
                    and feature extraction techniques in converting unstructured text data into actionable sentiment predictions.
                  </p>
                  <p>
                    The models successfully handle the class imbalance in the dataset (91.8% positive vs 8.2% negative), demonstrating robust 
                    performance across both sentiment classes. This enables businesses to automatically analyze customer feedback at scale, extracting 
                    actionable insights for product improvement and customer satisfaction enhancement.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Technologies Used Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="technologies" className="section-title">Technologies Used</h2>
                <div className="technologies-grid">
                  <div className="tech-category">
                    <h4>Data Processing</h4>
                    <ul className="tech-list">
                      <li>Pandas</li>
                      <li>NumPy</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Natural Language Processing</h4>
                    <ul className="tech-list">
                      <li>NLTK (Natural Language Toolkit)</li>
                      <li>String Processing</li>
                      <li>Text Tokenization</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Feature Extraction</h4>
                    <ul className="tech-list">
                      <li>scikit-learn CountVectorizer</li>
                      <li>Bag-of-Words Model</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Machine Learning</h4>
                    <ul className="tech-list">
                      <li>scikit-learn MultinomialNB</li>
                      <li>scikit-learn LogisticRegression</li>
                      <li>Train-Test Split</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Data Visualization</h4>
                    <ul className="tech-list">
                      <li>Matplotlib</li>
                      <li>Seaborn</li>
                      <li>Heatmaps</li>
                      <li>Count Plots</li>
                      <li>Histograms</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Model Evaluation</h4>
                    <ul className="tech-list">
                      <li>Confusion Matrix</li>
                      <li>Classification Report</li>
                      <li>Precision/Recall/F1-Score</li>
                      <li>Accuracy Score</li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        ) : isPortfolioOptimization ? (
          <>
            {/* Project Image */}
            <Row className="sec_sp">
              <Col lg="12">
                <div className="project-image-container mb-4">
                  <img src={PortfolioImage} alt="Two-Layered Portfolio Optimization" className="project-image" style={{ maxWidth: '800px', width: '100%', height: 'auto', margin: '0 auto', display: 'block' }} />
                </div>
              </Col>
            </Row>

            {/* Overview Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="overview" className="section-title">Overview</h2>
                <div className="project-description">
                  <p>
                    This project implements a sophisticated two-layer portfolio optimization strategy for the S&P 500, combining 
                    sector-level allocation with stock-level selection to create a well-diversified portfolio. The approach uses 
                    convex optimization techniques to maximize returns while maintaining sector weight constraints and equal risk 
                    contribution at the stock level.
                  </p>
                  <p>
                    The strategy achieved a total return of <strong>28.75%</strong> in 2024, outperforming the S&P 500 benchmark by 
                    <strong> 3.75%</strong>. The portfolio consists of 500+ S&P 500 stocks organized into 11 sectors, with sector weights 
                    constrained to stay within ±5% of benchmark weights, and 10 stocks selected per sector using equal risk contribution optimization.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Problem/Challenge Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="problem" className="section-title">Problem/Challenge</h2>
                <div className="project-description">
                  <p>
                    <strong>Investment Challenge:</strong> Traditional portfolio construction often relies on market-cap weighting or 
                    simple equal-weight strategies, which may not optimize for risk-adjusted returns. Investors need systematic approaches 
                    that balance diversification, sector exposure, and risk management while maximizing returns.
                  </p>
                  <p>
                    <strong>Technical Challenges:</strong>
                  </p>
                  <ul className="project-list">
                    <li>Implementing sector-level optimization with strict weight constraints (±5% deviation from benchmark)</li>
                    <li>Applying equal risk contribution optimization to balance portfolio risk</li>
                    <li>Solving complex convex optimization problems efficiently</li>
                    <li>Handling missing data and ensuring data quality across different time periods</li>
                  </ul>
                  <p>
                    The goal was to develop a systematic, two-layer optimization framework that maintains sector balance while optimizing 
                    stock selection and risk distribution, ultimately outperforming the S&P 500 benchmark through intelligent allocation.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Model Pipeline Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="pipeline" className="section-title">Model Pipeline</h2>
                
                {/* Mermaid Graph */}
                <div className="mermaid-container">
                  <div className="mermaid" ref={mermaidCallbackRef}>
                    {`graph TD
    A["Data Scraping<br/>(S&P 500 Constituents)"] --> B["Download Historical Data<br/>(2019-2023)"]
    B --> C["Data Cleaning<br/>(Remove Missing Data)"]
    C --> D["Calculate Returns<br/>(Percentage Change)"]
    D --> E["Sector-Level Optimization<br/>(Convex Optimization)"]
    E --> F["Apply Sector Constraints<br/>(±5% Benchmark Deviation)"]
    F --> G["Stock Selection<br/>(10 Stocks per Sector)"]
    G --> H["Stock-Level Optimization<br/>(Equal Risk Contribution)"]
    H --> I["Portfolio Construction<br/>(Final Weights)"]
    I --> J["Backtesting<br/>(2024 Data)"]
    J --> K["Monthly Rebalancing"]
    K --> L["Performance Evaluation<br/>(vs S&P 500)"]
    
    style A fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style B fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style C fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style D fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style E fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style F fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style G fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style H fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style I fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style J fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style K fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style L fill:#fff,stroke:#000,stroke-width:2px,color:#000`}
                  </div>
                </div>

                {/* Pipeline Descriptions */}
                <div className="pipeline-descriptions">
                  <div className="pipeline-description-item">
                    <h4>1. Data Scraping</h4>
                    <p>Scrape S&P 500 constituent list from Wikipedia, extracting stock symbols and their GICS sector classifications. The dataset includes 11 sectors: Information Technology, Financials, Health Care, Consumer Discretionary, Communication Services, Industrials, Consumer Staples, Energy, Utilities, Real Estate, and Materials. This provides the foundation for sector-based portfolio construction.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>2. Download Historical Data</h4>
                    <p>Download historical stock price data (adjusted closing prices) from Yahoo Finance using the `yfinance` library for the training period (2019-2023). The download process uses batch processing (50 stocks per batch) with retry logic and rate limiting to handle API constraints. This ensures reliable data retrieval for 500+ stocks across a 5-year period.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>3. Data Cleaning</h4>
                    <p>Remove stocks with missing data to ensure data quality and consistency. This step filters out tickers that don't have complete historical data, resulting in a clean dataset suitable for optimization. The filtered ticker list is used for all subsequent optimization steps.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>4. Calculate Returns</h4>
                    <p>Compute percentage change returns from the historical price data. This transforms price data into return series, which are essential for portfolio optimization. Returns are calculated using `pct_change()` and missing values are dropped to create a clean returns matrix for optimization.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>5. Sector-Level Optimization</h4>
                    <p>Apply convex optimization using `cvxpy` to optimize sector weights. The objective is to maximize expected portfolio return at the sector level. Expected returns are calculated as annualized mean returns (multiplied by 252 trading days) for each sector. This creates an optimal sector allocation that maximizes returns while respecting constraints.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>6. Apply Sector Constraints</h4>
                    <p>Enforce sector weight constraints ensuring each sector's weight stays within ±5% of its benchmark weight. For example, if Information Technology has a benchmark weight of 30.7%, its optimized weight must be between 25.7% and 35.7%. This constraint ensures the portfolio maintains sector diversification similar to the S&P 500 while allowing optimization within bounds.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>7. Stock Selection</h4>
                    <p>For each sector, randomly select 10 stocks from the available stocks in that sector. This selection process ensures diversification within each sector while maintaining a manageable portfolio size. The selection is done per sector, ensuring representation across all 11 sectors in the final portfolio.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>8. Stock-Level Optimization</h4>
                    <p>Apply equal risk contribution optimization for stocks within each sector. This approach minimizes portfolio risk by ensuring each stock contributes equally to the overall portfolio risk. The optimization uses the covariance matrix (annualized) to calculate risk contributions and solves for optimal stock weights that balance risk across selected stocks.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>9. Portfolio Construction</h4>
                    <p>Combine sector-level weights with stock-level weights to create final portfolio weights. Each stock's weight is calculated as: (stock weight within sector) × (sector weight). This creates a two-layer allocation where sector allocation is optimized first, then stock allocation within sectors is optimized, resulting in a well-balanced portfolio.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>10. Backtesting</h4>
                    <p>Download 2024 stock data for the selected stocks and simulate portfolio performance. The backtesting period uses out-of-sample data (2024) that was not used during optimization (2019-2023), providing an unbiased evaluation of the strategy's performance.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>11. Monthly Rebalancing</h4>
                    <p>Implement monthly rebalancing by resampling returns to monthly frequency and recalculating portfolio returns. This simulates a realistic trading strategy where the portfolio is rebalanced monthly to maintain target weights. Monthly rebalancing helps capture performance trends while managing transaction costs.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>12. Performance Evaluation</h4>
                    <p>Calculate cumulative portfolio returns and compare against the S&P 500 benchmark return (25.02% in 2024). Compute outperformance metrics to evaluate the strategy's effectiveness. The evaluation provides insights into whether the two-layer optimization approach successfully generates alpha compared to the market benchmark.</p>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Results Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="results" className="section-title">Results</h2>
                <div className="project-description">
                  <div className="results-grid">
                    <div className="result-card">
                      <h4>Total Return (2024)</h4>
                      <p className="result-value">28.75%</p>
                      <p>Portfolio performance</p>
                    </div>
                    <div className="result-card">
                      <h4>Outperformance</h4>
                      <p className="result-value">+3.75%</p>
                      <p>vs S&P 500 benchmark</p>
                    </div>
                    <div className="result-card">
                      <h4>S&P 500 Return</h4>
                      <p className="result-value">25.02%</p>
                      <p>Benchmark performance</p>
                    </div>
                    <div className="result-card">
                      <h4>Portfolio Stocks</h4>
                      <p className="result-value">110</p>
                      <p>10 stocks × 11 sectors</p>
                    </div>
                    <div className="result-card">
                      <h4>Sector Constraints</h4>
                      <p className="result-value">±5%</p>
                      <p>Benchmark deviation limit</p>
                    </div>
                    <div className="result-card">
                      <h4>Training Period</h4>
                      <p className="result-value">5 Years</p>
                      <p>2019-2023 data</p>
                    </div>
                  </div>
                  <p className="mt-4">
                    The two-layer portfolio optimization strategy achieved exceptional results, generating a <strong>28.75% total return</strong> 
                    in 2024, significantly outperforming the S&P 500 benchmark's 25.02% return by <strong>3.75 percentage points</strong>. 
                    This outperformance demonstrates the effectiveness of combining sector-level optimization with stock-level risk management.
                  </p>
                  <p>
                    The strategy successfully maintained sector diversification by constraining sector weights to stay within ±5% of benchmark 
                    weights, ensuring the portfolio remained balanced across all 11 sectors. The equal risk contribution approach at the stock 
                    level helped distribute risk evenly across selected stocks, reducing concentration risk while maintaining exposure to 
                    high-performing sectors.
                  </p>
                  <p>
                    Monthly rebalancing ensured the portfolio maintained its target allocation throughout the year, capturing performance 
                    trends while managing risk. The backtesting results validate the two-layer optimization approach as an effective 
                    strategy for generating alpha in equity markets.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Technologies Used Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="technologies" className="section-title">Technologies Used</h2>
                <div className="technologies-grid">
                  <div className="tech-category">
                    <h4>Data Processing</h4>
                    <ul className="tech-list">
                      <li>Pandas</li>
                      <li>NumPy</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Data Sources</h4>
                    <ul className="tech-list">
                      <li>Wikipedia (S&P 500 constituents)</li>
                      <li>Yahoo Finance (yfinance)</li>
                      <li>Web Scraping (pd.read_html)</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Optimization</h4>
                    <ul className="tech-list">
                      <li>CVXPY (Convex Optimization)</li>
                      <li>Convex Programming</li>
                      <li>Quadratic Programming</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Portfolio Theory</h4>
                    <ul className="tech-list">
                      <li>Equal Risk Contribution</li>
                      <li>Mean-Variance Optimization</li>
                      <li>Covariance Matrix Analysis</li>
                      <li>Risk Parity</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Backtesting</h4>
                    <ul className="tech-list">
                      <li>Monthly Rebalancing</li>
                      <li>Cumulative Returns</li>
                      <li>Performance Metrics</li>
                      <li>Benchmark Comparison</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Data Management</h4>
                    <ul className="tech-list">
                      <li>Batch Processing</li>
                      <li>Rate Limiting</li>
                      <li>Error Handling & Retries</li>
                      <li>Data Cleaning</li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        ) : isHospitalER ? (
          <>
            {/* Project Image */}
            <Row className="sec_sp">
              <Col lg="12">
                <div className="project-image-container mb-4">
                  <img src={ERImage} alt="Hospital ER Simulation" className="project-image" style={{ maxWidth: '800px', width: '100%', height: 'auto', margin: '0 auto', display: 'block' }} />
                </div>
              </Col>
            </Row>

            {/* Overview Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="overview" className="section-title">Overview</h2>
                <div className="project-description">
                  <p>
                    This project implements a discrete-event simulation engine for modeling end-to-end Emergency Room (ER) operations 
                    using Java. The simulation models the complete patient flow from arrival through triage, treatment, and checkout, 
                    incorporating priority-based scheduling, resource constraints, and capacity management.
                  </p>
                  <p>
                    The system uses data structures (stacks and queues) to manage staff resources (nurses, providers, administrative 
                    assistants), room utilization, and patient queues. It implements priority-based scheduling where emergency patients 
                    are served before regular patients, tracks key performance metrics including wait times, throughput, and resource 
                    utilization, and generates detailed operational telemetry for analysis.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Problem/Challenge Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="problem" className="section-title">Problem/Challenge</h2>
                <div className="project-description">
                  <p>
                    <strong>Healthcare Operations Challenge:</strong> Emergency Rooms face constant pressure to balance patient care 
                    quality with operational efficiency. Understanding how resource allocation, staffing levels, and patient arrival patterns 
                    affect wait times and throughput is crucial for improving ER operations and patient satisfaction.
                  </p>
                  <p>
                    <strong>Technical Challenges:</strong>
                  </p>
                  <ul className="project-list">
                    <li>Modeling complex multi-stage patient flow (triage → nurse → provider → checkout)</li>
                    <li>Implementing priority-based scheduling (emergency-first) while maintaining fairness</li>
                    <li>Managing resource pools (staff and rooms) with availability constraints</li>
                    <li>Maintaining state consistency across queues, stacks, and room assignments</li>
                  </ul>
                  <p>
                    The goal was to develop a realistic simulation that could help hospital administrators understand ER bottlenecks, 
                    optimize staffing levels, and evaluate operational changes before implementation, ultimately improving patient care 
                    and operational efficiency.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Model Pipeline Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="pipeline" className="section-title">Model Pipeline</h2>
                
                {/* Mermaid Graph */}
                <div className="mermaid-container">
                  <div className="mermaid" ref={mermaidCallbackRef}>
                    {`graph TD
    A["Initialization<br/>(Staff, Rooms, Queues)"] --> B["Patient Arrival<br/>(Random Interval)"]
    B --> C["Triage Classification<br/>(Emergency vs Regular)"]
    C --> D["Priority Queue Assignment"]
    D --> E["Resource Check<br/>(Nurse, Room Available?)"]
    E --> F["Nurse Assignment<br/>(Stack-based)"]
    F --> G["Room Assignment<br/>(Capacity Management)"]
    G --> H["Service Completion<br/>(Time-based)"]
    H --> I["Provider Assignment<br/>(After Nurse Service)"]
    I --> J["Provider Service Completion"]
    J --> K["Checkout Queue"]
    K --> L["Admin Assistant Processing"]
    L --> M["Patient Departure"]
    M --> N["Resource Deallocation"]
    N --> O["Statistics Tracking<br/>(Wait Time, Utilization)"]
    O --> P["Time Step Advancement"]
    P --> B
    
    style A fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style B fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style C fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style D fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style E fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style F fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style G fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style H fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style I fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style J fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style K fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style L fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style M fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style N fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style O fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style P fill:#fff,stroke:#000,stroke-width:2px,color:#000`}
                  </div>
                </div>

                {/* Pipeline Descriptions */}
                <div className="pipeline-descriptions">
                  <div className="pipeline-description-item">
                    <h4>1. Initialization</h4>
                    <p>Initialize simulation parameters including number of providers, nurses, administrative assistants, and rooms. Create stacks for available staff resources (providers, nurses, admin assistants) and queues for patient management (emergency queue, regular queue, checkout queue). Initialize room array with unoccupied rooms. Set simulation time duration and configure service times for each staff type.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>2. Patient Arrival</h4>
                    <p>Simulate patient arrivals using random intervals (1-5 seconds) to model realistic arrival patterns. At each time step, generate 2 patients with unique arrival times. This stochastic arrival process mimics real-world ER patient flow where arrivals are unpredictable and variable.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>3. Triage Classification</h4>
                    <p>Classify each arriving patient as emergency (20% probability) or regular (80% probability) using random probability generation. Emergency patients are assigned to the priority emergency queue, while regular patients enter the regular queue. This classification determines patient priority for resource allocation.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>4. Priority Queue Assignment</h4>
                    <p>Patients are added to their respective queues based on triage classification. The emergency queue has priority over the regular queue, ensuring critical patients receive immediate attention. Queue data structures maintain FIFO ordering within each priority level.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>5. Resource Check</h4>
                    <p>Before assigning a patient, check resource availability: (1) Verify if patients are waiting in queues, (2) Check if nurses are available in the nurse stack, (3) Verify if rooms are available (not occupied). All three conditions must be met simultaneously to assign a patient to treatment.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>6. Nurse Assignment</h4>
                    <p>When resources are available, retrieve the highest priority patient (emergency first, then regular) and assign an available nurse from the nurse stack. Pop a nurse from the stack, mark as working, and assign to the patient. Record patient service start time and calculate wait time (service start time - arrival time).</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>7. Room Assignment</h4>
                    <p>Assign an available room to the patient-nurse pair. Mark the room as occupied, set the current patient and current person (nurse), and set person type to "Nurse". Track room occupancy time for utilization metrics. Each room can accommodate one patient-staff pair at a time.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>8. Service Completion</h4>
                    <p>Monitor service completion by tracking each staff member's current cycle time. When a staff member's cycle time reaches their service time threshold, mark service as complete. Reset cycle time, mark staff as not working, and return staff to their respective stack (nurse or provider stack). Clear room assignment for that staff member.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>9. Provider Assignment</h4>
                    <p>After nurse service completion, check if a provider is available. If a room is occupied with a nurse-completed patient and no provider is assigned, assign an available provider from the provider stack. Update room person type to "Provider" and mark provider as working. This represents the transition from triage/nursing care to medical treatment.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>10. Provider Service Completion</h4>
                    <p>When provider service completes, remove the patient from the room and mark the room as unoccupied. Clear room assignments (patient, person, person type). Add the patient to the checkout queue, indicating they have completed medical treatment and are ready for administrative processing.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>11. Checkout Queue</h4>
                    <p>Patients who have completed medical treatment enter the checkout queue. This queue represents patients waiting for administrative processing (billing, discharge paperwork, etc.). The queue maintains FIFO ordering to ensure fair processing.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>12. Admin Assistant Processing</h4>
                    <p>Assign available administrative assistants from the admin stack to process checkout queue patients. Admin assistants work in a queue-based system where they process patients sequentially. Track admin assistant working time and service completion. When service completes, return admin assistant to the stack and remove patient from being served queue.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>13. Patient Departure</h4>
                    <p>After administrative processing, patients complete their ER visit and depart the system. This marks the end of the patient journey through the ER workflow. Track total patients served for throughput metrics.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>14. Resource Deallocation</h4>
                    <p>When services complete, properly deallocate resources: return staff to their respective stacks, mark rooms as available, and clear all assignments. This ensures resources are available for the next patients and maintains system state consistency.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>15. Statistics Tracking</h4>
                    <p>Continuously track operational metrics: total wait time (sum of all patient wait times), average wait time (total wait time / patients served), staff utilization (total worked time per staff member), room utilization (total occupied time per room), and throughput (total patients served). These metrics provide insights into ER performance.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>16. Time Step Advancement</h4>
                    <p>Advance simulation time by the current interval (random 1-5 seconds). Update all active timers: increment cycle times for staff in service, increment room occupancy times, and update admin assistant processing times. Sleep for the interval duration to simulate real-time passage. Generate telemetry snapshots and repeat the simulation loop until simulation time expires.</p>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Results Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="results" className="section-title">Results</h2>
                <div className="project-description">
                  <div className="results-grid">
                    <div className="result-card">
                      <h4>Total Patients Served</h4>
                      <p className="result-value">4</p>
                      <p>Completed ER visits</p>
                    </div>
                    <div className="result-card">
                      <h4>Average Wait Time</h4>
                      <p className="result-value">29.25s</p>
                      <p>Time to service start</p>
                    </div>
                    <div className="result-card">
                      <h4>Total Wait Time</h4>
                      <p className="result-value">117s</p>
                      <p>Cumulative wait time</p>
                    </div>
                    <div className="result-card">
                      <h4>Queue Status</h4>
                      <p className="result-value">21 Waiting</p>
                      <p>1 emergency, 20 regular</p>
                    </div>
                    <div className="result-card">
                      <h4>Room Utilization</h4>
                      <p className="result-value">~45s</p>
                      <p>Average per room</p>
                    </div>
                    <div className="result-card">
                      <h4>Staff Utilization</h4>
                      <p className="result-value">Active</p>
                      <p>Nurses: 20-22s, Providers: 19-29s</p>
                    </div>
                  </div>
                  <p className="mt-4">
                    The simulation successfully models end-to-end ER operations with priority-based scheduling, ensuring emergency patients 
                    receive immediate attention while maintaining efficient resource utilization. In a sample simulation run, the system 
                    processed <strong>4 patients</strong> with an <strong>average wait time of 29.25 seconds</strong> and a total wait 
                    time of 117 seconds.
                  </p>
                  <p>
                    <strong>Queue Status:</strong> At the time of snapshot, the system had <strong>1 patient in the emergency queue</strong> 
                    and <strong>20 patients in the regular queue</strong>, demonstrating the priority system's effectiveness in processing 
                    critical cases first. <strong>11 patients</strong> were in the checkout queue awaiting administrative processing.
                  </p>
                  <p>
                    <strong>Resource Utilization:</strong> All three rooms were actively utilized (Room1: 45s, Room2: 45s, Room3: 46s), 
                    with nurses and providers actively serving patients. Nurse work times ranged from 20-22 seconds, while provider work 
                    times ranged from 19-29 seconds, indicating efficient resource allocation and workload distribution.
                  </p>
                  <p>
                    <strong>Operational Metrics:</strong> The simulation tracks comprehensive KPIs including <strong>Total Wait Time</strong> 
                    (sum of all patient wait times from arrival to service start), <strong>Average Wait Time</strong> (total wait time divided 
                    by patients served), <strong>Staff Utilization</strong> (total worked time per nurse, provider, and admin assistant), 
                    <strong> Room Utilization</strong> (total occupied time per room), and <strong>Throughput</strong> (total patients served 
                    during simulation period).
                  </p>
                  <p>
                    The simulation generates detailed telemetry logs at each time step, providing visibility into queue states, resource 
                    availability, room assignments, and operational statistics. This enables hospital administrators to identify bottlenecks, 
                    optimize staffing levels, and evaluate operational changes before real-world implementation, ultimately improving patient 
                    care quality and operational efficiency.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Technologies Used Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="technologies" className="section-title">Technologies Used</h2>
                <div className="technologies-grid">
                  <div className="tech-category">
                    <h4>Programming Language</h4>
                    <ul className="tech-list">
                      <li>Java</li>
                      <li>Object-Oriented Programming</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Data Structures</h4>
                    <ul className="tech-list">
                      <li>Stack (LIFO)</li>
                      <li>Queue (FIFO)</li>
                      <li>Arrays</li>
                      <li>Priority Queues</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Simulation Techniques</h4>
                    <ul className="tech-list">
                      <li>Discrete-Event Simulation</li>
                      <li>Time-Based Simulation</li>
                      <li>Stochastic Processes</li>
                      <li>Resource Pool Management</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>File I/O</h4>
                    <ul className="tech-list">
                      <li>FileWriter</li>
                      <li>BufferedWriter</li>
                      <li>PrintWriter</li>
                      <li>Text File Logging</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>System Design</h4>
                    <ul className="tech-list">
                      <li>Modular Architecture</li>
                      <li>State Management</li>
                      <li>Resource Allocation</li>
                      <li>Concurrency Simulation</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Performance Metrics</h4>
                    <ul className="tech-list">
                      <li>Wait Time Tracking</li>
                      <li>Utilization Metrics</li>
                      <li>Throughput Analysis</li>
                      <li>Operational Telemetry</li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        ) : isBookRecommender ? (
          <>
            {/* Project Image */}
            <Row className="sec_sp">
              <Col lg="12">
                <div className="project-image-container mb-4">
                  <img src={BooksImage} alt="Neural Sequential Recommender for Book Discovery" className="project-image" style={{ maxWidth: '800px', width: '100%', height: 'auto', margin: '0 auto', display: 'block' }} />
                </div>
              </Col>
            </Row>

            {/* Overview Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="overview" className="section-title">Overview</h2>
                <div className="project-description">
                  <p>
                    This project develops an intelligent book recommendation system using the Goodreads dataset, a large-scale corpus 
                    containing user ratings, reviews, and detailed book metadata. The system implements two complementary approaches: 
                    a sequential deep learning model (SASRec) and an embedding-based technique (Word2Vec) to generate personalized 
                    book recommendations.
                  </p>
                  <p>
                    The dataset contains <strong>876,145 users</strong>, <strong>2.3 million books</strong>, and 
                    <strong> 228 million user-book interactions</strong>. The SASRec model achieves <strong>Hit@10 of 0.82</strong> and 
                    <strong> NDCG@10 of 0.59</strong>, while the Word2Vec model achieves <strong>Precision@10 of 20%</strong> and 
                    <strong> Recall@10 of 30%</strong>. The system leverages user behavior sequences and book metadata to learn latent 
                    representations that capture complex user preferences and book characteristics.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Problem/Challenge Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="problem" className="section-title">Problem/Challenge</h2>
                <div className="project-description">
                  <p>
                    <strong>Recommendation Challenge:</strong> With over 2.3 million books published annually and the book market 
                    becoming oversaturated, users need intelligent guidance to discover relevant books. Traditional collaborative filtering 
                    relies solely on user-item interactions, while content-based methods depend only on item features, missing the sequential 
                    patterns in user reading behavior.
                  </p>
                  <p>
                    <strong>Technical Challenges:</strong>
                  </p>
                  <ul className="project-list">
                    <li>Processing massive-scale data (228M interactions, 2.3M books, 876K users)</li>
                    <li>Modeling sequential user behavior and reading order dependencies</li>
                    <li>Handling sparse user-item interaction matrices</li>
                    <li>Scaling deep learning models to large datasets efficiently</li>
                  </ul>
                  <p>
                    The goal was to develop scalable recommendation systems that capture sequential reading patterns, learn meaningful 
                    book representations, and generate accurate personalized recommendations that outperform traditional filtering methods.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Model Pipeline Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="pipeline" className="section-title">Model Pipeline</h2>
                
                {/* Mermaid Graph */}
                <div className="mermaid-container">
                  <div className="mermaid" ref={mermaidCallbackRef}>
                    {`graph TD
    A["Data Loading<br/>(Goodreads Dataset)"] --> B["Data Preprocessing<br/>(K-core Filtering)"]
    B --> C["Model Selection"]
    C --> D["SASRec Model"]
    C --> E["Word2Vec Model"]
    D --> F["Sequence Construction<br/>(Equal Length)"]
    F --> G["Embedding Layer<br/>(Item + Position)"]
    G --> H["Self-Attention Blocks<br/>(Transformer)"]
    H --> I["Prediction Layer"]
    I --> J["Model Evaluation"]
    E --> K["Vocabulary Construction"]
    K --> L["Skip-gram Training<br/>(Negative Sampling)"]
    L --> M["Embedding Learning<br/>(Spark)"]
    M --> N["Similarity Search<br/>(Cosine Similarity)"]
    N --> J
    J --> O["Precision@K<br/>Recall@K<br/>Hit@K<br/>NDCG@K"]
    
    style A fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style B fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style C fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style D fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style E fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style F fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style G fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style H fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style I fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style J fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style K fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style L fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style M fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style N fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style O fill:#fff,stroke:#000,stroke-width:2px,color:#000`}
                  </div>
                </div>

                {/* Pipeline Descriptions */}
                <div className="pipeline-descriptions">
                  <div className="pipeline-description-item">
                    <h4>1. Data Loading</h4>
                    <p>Load the Goodreads dataset containing three main components: (1) User-book interaction data (4.1GB) with user_id, book_id, rating, is_read, is_reviewed; (2) Book metadata (2.3GB) with title, authors, genres, description, average_rating; (3) User reviews. The dataset contains 876,145 users, 2.3 million books, and 228 million interactions, providing a rich foundation for learning user preferences and book characteristics.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>2. Data Preprocessing</h4>
                    <p>Apply k-core filtering to improve data quality: filter books appearing less than 5 times and users with fewer than 5 interactions. For Word2Vec: construct user-level reading sequences by grouping interactions per user, ordering by time, filtering meaningful reading signals (read + positive ratings), and trimming excessively long histories. For SASRec: integrate review and interaction subfiles, construct equal-length input sequences based on timestamps, and prepare sequences for Transformer-based processing.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>3. Model Selection</h4>
                    <p>Two complementary models are implemented: <strong>SASRec</strong> (Self-Attentive Sequential Recommendation) for order-aware sequential modeling using Transformer architecture, and <strong>Word2Vec</strong> for embedding-based item-to-item similarity learning. Users can select either model based on their needs: SASRec for strong sequential patterns and personalization, Word2Vec for simpler architecture and item similarity.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>4. SASRec: Sequence Construction</h4>
                    <p>Transform user action sequences into fixed-length input sequences s=(s₁, s₂, ..., sₙ) of equal length. Each sequence represents a user's reading history ordered by timestamp. Sequences are padded or truncated to ensure uniform length for batch processing. This enables the model to learn from consistent input dimensions while preserving temporal order.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>5. SASRec: Embedding Layer</h4>
                    <p>Create input embeddings E ∈ R^(n×d) as the sum of item embedding matrix M and positional embedding matrix P. Item embeddings represent book characteristics, while positional embeddings enable the model to understand sequence order (since self-attention is order-agnostic). This allows the model to differentiate identical items based on their position within the sequence, capturing temporal dependencies.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>6. SASRec: Self-Attention Blocks</h4>
                    <p>Apply stacked self-attention blocks with causal masking to prevent data leakage. The causal mask ensures that at position i, the model can only attend to positions j ≤ i, preventing future information from influencing current predictions. Self-attention dynamically assigns weights to all previous items, allowing the model to capture both short-term and long-term dependencies. Two self-attention blocks are stacked to increase model capacity.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>7. SASRec: Prediction Layer</h4>
                    <p>Generate next-item predictions by computing similarity between the learned sequence representation and item embeddings. The model uses Binary Cross Entropy loss with Adam optimizer, maximizing log-likelihood of positive targets while minimizing likelihood of negative samples. Automatic Mixed Precision (FP16) is used to improve training efficiency and reduce memory consumption.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>8. Word2Vec: Vocabulary Construction</h4>
                    <p>Build a deterministic vocabulary by exploding all observed book IDs from user reading sequences and assigning contiguous integer indices. This allows embeddings to be stored efficiently as keyed rows in Spark DataFrames. The vocabulary maps each unique book to a unique integer index, enabling efficient lookup and gradient updates during training.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>9. Word2Vec: Skip-gram Training</h4>
                    <p>Generate skip-gram training pairs by sliding a symmetric context window over each user sequence. For each target book, emit all valid target-context index pairs within the window. This creates training examples where the model learns to predict context books given a target book. The process uses mapInPandas to keep sequence-local logic off the Spark driver, enabling distributed processing.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>10. Word2Vec: Negative Sampling</h4>
                    <p>Implement negative sampling following standard Word2Vec approach: estimate token frequencies from indexed sequences, raise to 0.75 power, normalize, and convert into alias tables for constant-time sampling. Broadcast alias structures to executors, and use Pandas UDFs to draw negative samples per training pair. This approximates the SoftMax objective efficiently without computing full vocabulary probabilities.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>11. Word2Vec: Embedding Learning</h4>
                    <p>Train embeddings using Spark with explicit memory management: collect embeddings once per epoch to driver and broadcast back to executors for lightweight lookups. Compute gradients locally using NumPy (dot products, sigmoid activations) for positive pairs and negatives, accumulate gradients per book index, and emit summed gradients back to Spark. Apply updates using broadcast-based SGD with linearly decaying learning rate. Break lineage by writing/reloading Parquet data to avoid deep DAGs and StackOverflowError.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>12. Word2Vec: Similarity Search</h4>
                    <p>Implement similarity search directly in Spark using cosine similarity expressed via higher-order SQL functions over array columns. This enables nearest-neighbor queries without relying on Spark MLlib. Given a user's reading history, retrieve top-K most similar books using learned embeddings, where similarity is measured by cosine distance in the embedding space.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>13. Model Evaluation</h4>
                    <p>Evaluate both models using offline accuracy metrics: <strong>Precision@K</strong> (percentage of relevant items in top-K recommendations), <strong>Recall@K</strong> (percentage of relevant items retrieved from all relevant items), <strong>Hit@K</strong> (fraction of times ground-truth item exists in top-K), and <strong>NDCG@K</strong> (normalized discounted cumulative gain, position-aware ranking quality). Hide 20% of each user's interactions as ground truth, generate recommendations, and compare predictions with hidden interactions.</p>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Results Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="results" className="section-title">Results</h2>
                <div className="project-description">
                  <div className="results-grid">
                    <div className="result-card">
                      <h4>SASRec Hit@10</h4>
                      <p className="result-value">0.82</p>
                      <p>Ground truth in top-10</p>
                    </div>
                    <div className="result-card">
                      <h4>SASRec NDCG@10</h4>
                      <p className="result-value">0.59</p>
                      <p>Position-aware ranking</p>
                    </div>
                    <div className="result-card">
                      <h4>Word2Vec Precision@10</h4>
                      <p className="result-value">20%</p>
                      <p>Relevant in top-10</p>
                    </div>
                    <div className="result-card">
                      <h4>Word2Vec Recall@10</h4>
                      <p className="result-value">30%</p>
                      <p>Relevant items retrieved</p>
                    </div>
                    <div className="result-card">
                      <h4>Dataset Scale</h4>
                      <p className="result-value">228M</p>
                      <p>User-book interactions</p>
                    </div>
                    <div className="result-card">
                      <h4>Books</h4>
                      <p className="result-value">2.3M</p>
                      <p>Total books in dataset</p>
                    </div>
                  </div>
                  <p className="mt-4">
                    The <strong>SASRec model</strong> achieved exceptional performance with <strong>Hit@10 of 0.82</strong> and 
                    <strong> NDCG@10 of 0.59</strong>, demonstrating that the recommended books are located at higher positions in the 
                    ground truth ranking. The model's self-attention mechanism successfully captures both short-term and long-term dependencies 
                    in user reading sequences, enabling accurate next-book predictions.
                  </p>
                  <p>
                    The <strong>Word2Vec model</strong> achieved <strong>Precision@10 of 20%</strong> and <strong>Recall@10 of 30%</strong>, 
                    indicating that on average, two out of the top ten recommendations were relevant to a user's reading history, and 
                    around one-third of all relevant books appeared in the top ten recommendations. Qualitative evaluation showed that 
                    retrieved books typically belonged to the same author, genre, and theme, demonstrating the model's ability to capture 
                    co-occurrence patterns in reading histories.
                  </p>
                  <p>
                    <strong>Model Comparison:</strong> SASRec outperformed Word2Vec due to its order-aware architecture that captures 
                    sequential patterns, recency effects, and position dependencies. SASRec's attention mechanism enables dynamic weighting 
                    of historical items, making it superior at capturing semantic meaning and generating personalized recommendations. 
                    Word2Vec, being order-agnostic, provides decent item-item similarity but weaker personalization. However, Word2Vec offers 
                    simpler architecture and faster training, making it suitable for scenarios where computational efficiency is prioritized.
                  </p>
                  <p>
                    Both models successfully scale to the massive Goodreads dataset (876K users, 2.3M books, 228M interactions), demonstrating 
                    practical applicability for large-scale recommendation systems. The models support future book predictions and 
                    similarity-driven discovery, providing flexibility in recommendation style, performance, and system complexity.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Technologies Used Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="technologies" className="section-title">Technologies Used</h2>
                <div className="technologies-grid">
                  <div className="tech-category">
                    <h4>Deep Learning Framework</h4>
                    <ul className="tech-list">
                      <li>PyTorch</li>
                      <li>Transformer Architecture</li>
                      <li>Self-Attention Mechanism</li>
                      <li>Automatic Mixed Precision (FP16)</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Big Data Processing</h4>
                    <ul className="tech-list">
                      <li>Apache Spark</li>
                      <li>PySpark</li>
                      <li>Spark DataFrames</li>
                      <li>Distributed Computing</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Embedding Models</h4>
                    <ul className="tech-list">
                      <li>Word2Vec (Skip-gram)</li>
                      <li>Negative Sampling</li>
                      <li>Item Embeddings</li>
                      <li>Position Embeddings</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Sequential Models</h4>
                    <ul className="tech-list">
                      <li>SASRec (Self-Attentive Sequential)</li>
                      <li>Causal Masking</li>
                      <li>Sequence Modeling</li>
                      <li>Temporal Dependencies</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Optimization</h4>
                    <ul className="tech-list">
                      <li>Adam Optimizer</li>
                      <li>Binary Cross Entropy Loss</li>
                      <li>Stochastic Gradient Descent</li>
                      <li>Learning Rate Scheduling</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Evaluation Metrics</h4>
                    <ul className="tech-list">
                      <li>Precision@K</li>
                      <li>Recall@K</li>
                      <li>Hit@K</li>
                      <li>NDCG@K (Normalized DCG)</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Data Processing</h4>
                    <ul className="tech-list">
                      <li>K-core Filtering</li>
                      <li>Sequence Construction</li>
                      <li>Data Preprocessing</li>
                      <li>Metadata Integration</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Similarity Search</h4>
                    <ul className="tech-list">
                      <li>Cosine Similarity</li>
                      <li>Nearest Neighbor Search</li>
                      <li>Top-K Retrieval</li>
                      <li>Embedding-based Search</li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        ) : isBatteryDegradation ? (
          <>
            {/* Overview Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="overview" className="section-title">Overview</h2>
                <div className="project-description">
                  <p>
                    This project develops data-driven machine learning models to predict the State of Health (SoH) of lithium-ion batteries, 
                    a critical component for electric vehicle sustainability. The framework incorporates comprehensive feature engineering, 
                    preprocessing, and stability-driven feature selection to extract degradation-relevant health indicators including resistance, 
                    efficiency, and incremental capacity features.
                  </p>
                  <p>
                    Using the CALCE dataset with <strong>8 lithium-ion cells</strong> and <strong>over 3,900 charge-discharge cycles</strong>, 
                    a stacked ensemble model achieves an average <strong>RMSE of 0.427</strong> and <strong>MAE of 0.296</strong> for 
                    constant-discharge batteries, outperforming single-model baselines. The study demonstrates that compact, degradation-focused 
                    feature sets improve predictive accuracy over high-dimensional representations, providing a robust framework for battery 
                    health estimation in battery management systems.
                  </p>
                </div>
              </Col>
            </Row>

            {/* SoH Image */}
            <Row className="sec_sp">
              <Col lg="12">
                <div className="project-image-container mb-4">
                  <img src={SOHImage} alt="State of Health (SoH)" className="project-image" style={{ maxWidth: '800px', width: '100%', height: 'auto', margin: '0 auto', display: 'block' }} />
                </div>
              </Col>
            </Row>

            {/* Problem/Challenge Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="problem" className="section-title">Problem/Challenge</h2>
                <div className="project-description">
                  <p>
                    <strong>Battery Management Challenge:</strong> With increasing demand for electric vehicles and ambitious net-zero targets, 
                    accurate battery State of Health (SoH) prediction is crucial for optimizing battery life and performance. When a battery 
                    reaches 70-80% of its maximum capacity, it reaches end-of-life (EOL) and is no longer suitable for EV applications, 
                    requiring accurate prediction for effective battery management and second-life applications.
                  </p>
                  <p>
                    <strong>Technical Challenges:</strong>
                  </p>
                  <ul className="project-list">
                    <li>Extracting meaningful degradation-relevant features from raw time-series battery cycling data</li>
                    <li>Handling protocol-induced distribution shifts between constant and variable discharge protocols</li>
                    <li>Ensuring model generalization to unseen batteries through proper validation strategies</li>
                    <li>Dealing with aleatoric uncertainty (inherent noise) and epistemic uncertainty (limited training data)</li>
                  </ul>
                  <p>
                    The goal was to develop a robust data-driven framework that accurately predicts battery SoH using cycle-level features, 
                    generalizes to unseen batteries, and provides practical insights for battery management systems to increase the longevity 
                    and effectiveness of lithium-ion batteries.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Model Pipeline Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="pipeline" className="section-title">Model Pipeline</h2>
                
                {/* Mermaid Graph */}
                <div className="mermaid-container">
                  <div className="mermaid" ref={mermaidCallbackRef}>
                    {`graph TD
    A["Data Acquisition<br/>(CALCE Dataset)"] --> B["Data Consolidation<br/>(Time-Series Logs)"]
    B --> C["SoH Label Creation<br/>(Current Integration)"]
    C --> D["Feature Engineering<br/>(109 Cycle-Level Features)"]
    D --> E["Data Cleaning<br/>(EOL Filtering)"]
    E --> F["Feature Selection<br/>(Correlation Pruning)"]
    F --> G["Stability Selection<br/>(Grouped CV)"]
    G --> H["Final Feature Set<br/>(9 Degradation Features)"]
    H --> I["Model Training"]
    I --> J["Stacked Ensemble"]
    I --> K["Single Baseline"]
    J --> L["Base Learners<br/>(XGBoost, LightGBM, RF)"]
    L --> M["Meta-Learner<br/>(Ridge Regression)"]
    K --> N["HistGradientBoosting"]
    M --> O["Model Evaluation"]
    N --> O
    O --> P["Battery Holdout Validation"]
    O --> Q["Early-Life Evaluation"]
    
    style A fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style B fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style C fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style D fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style E fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style F fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style G fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style H fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style I fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style J fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style K fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style L fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style M fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style N fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style O fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style P fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style Q fill:#fff,stroke:#000,stroke-width:2px,color:#000`}
                  </div>
                </div>

                {/* Pipeline Descriptions */}
                <div className="pipeline-descriptions">
                  <div className="pipeline-description-item">
                    <h4>1. Data Acquisition</h4>
                    <p>Obtain battery cycling data from CALCE (Center for Advanced Life Cycle Engineering) at University of Maryland. The dataset contains CS2 prismatic cells with time-series logs stored across multiple Excel files per cell. Data includes voltage, current, test time, step index, and internal resistance measurements across charge-discharge cycles under both constant and variable discharge protocols.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>2. Data Consolidation</h4>
                    <p>Import Excel files in chronological order sorted by file creation date to maintain continuous aging trajectory. Concatenate relevant sheets and offset cycle counters to ensure monotonically increasing cycle indices per cell. Create battery_id column as primary key derived from folder names. This consolidation process ensures data continuity when tests span multiple files.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>3. SoH Label Creation</h4>
                    <p>Define SoH on a per-cycle basis from discharge segments using current integration. For constant discharge: compute discharge capacity Q_dis = Σ(I_dis × Δt), then normalize by first-cycle capacity: SoH = (Q_dis / Q_ref) × 100. For variable discharge: normalize by maximum observed cycle capacity within the cell. SoH represents battery health as percentage of original capacity.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>4. Feature Engineering</h4>
                    <p>Transform raw time-series into cycle-level dataset with 109 engineered features capturing degradation-relevant electrical signatures. Categories include: (1) Differential and resistance-proxy features (dV/dt, dynamic resistance), (2) Charge/discharge integral features (cumulative capacity, energy, duration, voltage/current statistics), (3) Efficiency metrics (coulombic efficiency η_Q, energy efficiency η_E), (4) Step-specific diagnostics (CC charge, CV charge, CC discharge features), (5) Incremental capacity (IC) curve features with peak analysis. Features inspired by MATLAB's batteryTestFeatureExtractor module.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>5. Data Cleaning</h4>
                    <p>Filter cycles beyond EOL threshold (SoH &lt; 70%) as defined by automotive industry standards. For variable discharge cells: remove cycles with SoH spikes deviating by more than 5 percentage points from adjacent cycles. For constant discharge cells: filter cycles with charge duration less than 2 hours to remove incomplete or abnormal cycles. This cleaning ensures data quality and focuses analysis on early- to mid-life degradation.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>6. Feature Selection: Correlation Pruning</h4>
                    <p>Remove highly redundant features using absolute Spearman correlation pruning with threshold |r| > 0.95. This eliminates multicollinearity and reduces feature space dimensionality. Correlation pruning is performed only on training data to prevent data leakage, ensuring feature selection generalizes to held-out batteries.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>7. Stability Selection</h4>
                    <p>Implement stability selection using grouped cross-validation by battery_id (GroupKFold, K=5) to ensure features generalize across different batteries. Calculate permutation importance (n_repeats=10) on validation folds using HistGradientBoostingRegressor. Retain features appearing in top-ranked variables in at least 70% of folds. If no feature meets this threshold, retain strongest features by mean permutation importance.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>8. Final Feature Set</h4>
                    <p>Converge to 9 stable degradation-focused features: Internal_Resistance_max, median_abs_dVdt_over_I, Charge_cumulativeCapacity, Charge_duration, Discharge_duration, Coulombic_Efficiency, Energy_Efficiency, Charge_Step2_IC_areaVoltage, Charge_Step2_IC_peakProminence. These features span complementary degradation categories: resistance (impedance growth), capacity fade, efficiency losses, and electrochemical state changes. Progressive restriction demonstrates that compact feature sets outperform high-dimensional representations.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>9. Stacked Ensemble Model</h4>
                    <p>Train three base learners (XGBoost, LightGBM, Random Forest) on median-imputed, standardized feature set. Use out-of-fold predictions from grouped cross-validation to construct meta-features, preventing data leakage. Input meta-features to Ridge regression meta-learner (α=5.0). Base learners use different hyperparameters: XGBoost (n_estimators=600, learning_rate=0.03), LightGBM (n_estimators=1200, learning_rate=0.02), Random Forest (n_estimators=600, max_depth=14). Ensemble combines strengths of multiple algorithms for improved generalization.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>10. Single Baseline Model</h4>
                    <p>Train HistGradientBoostingRegressor with median imputation, early stopping, and L2 regularization (l2_regularization=0.1). Hyperparameters: learning_rate=0.05, max_iter=5000, max_depth=7, min_samples_leaf=10, validation_fraction=0.15, n_iter_no_change=80. This serves as baseline comparison to demonstrate ensemble benefits.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>11. Battery Holdout Validation</h4>
                    <p>Implement strict battery holdout evaluation: hold out one cell entirely for testing, use all remaining cells for training. Feature selection performed only on training cells, selected feature set applied unchanged to held-out cell. Use round-robin implementation to evaluate each battery. This strategy ensures true generalization to unseen batteries and prevents data leakage.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>12. Early-Life Evaluation</h4>
                    <p>For each cell, use first 30% of cycles for training and remaining cycles for testing. Append normalized cycle progression variable (cycle-frac) and cycle index to feature set to capture early-life position within aging trajectory. This evaluates model's capacity to forecast degradation from limited early-life data, though higher errors are expected due to weak degradation signals in early stages.</p>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Results Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="results" className="section-title">Results</h2>
                <div className="project-description">
                  <div className="results-grid">
                    <div className="result-card">
                      <h4>Stacked RMSE</h4>
                      <p className="result-value">0.427</p>
                      <p>Constant discharge</p>
                    </div>
                    <div className="result-card">
                      <h4>Stacked MAE</h4>
                      <p className="result-value">0.296</p>
                      <p>Constant discharge</p>
                    </div>
                    <div className="result-card">
                      <h4>Baseline RMSE</h4>
                      <p className="result-value">0.658</p>
                      <p>Single model</p>
                    </div>
                    <div className="result-card">
                      <h4>Baseline MAE</h4>
                      <p className="result-value">0.441</p>
                      <p>Single model</p>
                    </div>
                    <div className="result-card">
                      <h4>Dataset Size</h4>
                      <p className="result-value">3,912</p>
                      <p>Total cycles</p>
                    </div>
                    <div className="result-card">
                      <h4>Final Features</h4>
                      <p className="result-value">9</p>
                      <p>Degradation-focused</p>
                    </div>
                  </div>
                  <p className="mt-4">
                    The <strong>stacked ensemble model</strong> achieved exceptional performance with <strong>RMSE of 0.427</strong> and 
                    <strong> MAE of 0.296</strong> for constant-discharge batteries, significantly outperforming the single-model baseline 
                    (RMSE=0.658, MAE=0.441). This represents a <strong>35% reduction in RMSE</strong> and <strong>33% reduction in MAE</strong>, 
                    demonstrating improved generalization through model ensembling.
                  </p>
                  <p>
                    <strong>Feature Selection Impact:</strong> Progressive feature restriction reduced the stacked model's average RMSE from 
                    0.616 to 0.427 for constant discharge (31% improvement) and from 5.338 to 4.524 for variable discharge (15% improvement). 
                    This demonstrates that compact, degradation-focused feature sets generalize more effectively than high-dimensional 
                    representations, confirming that adding more features does not consistently improve predictive ability.
                  </p>
                  <p>
                    <strong>Protocol Performance:</strong> For constant-discharge protocol cells (n=6), the stacked ensemble consistently 
                    outperforms the baseline across all batteries. For variable-discharge cells (n=2), higher errors are observed 
                    (RMSE=3.415, MAE=1.543) due to protocol-induced distribution shifts and limited training data. However, model performance 
                    remains relatively consistent, suggesting that including additional variable-discharge data could further improve generalization.
                  </p>
                  <p>
                    <strong>Early-Life Prediction:</strong> Higher RMSEs (>5) were observed in early-life evaluation, especially in early stages 
                    when degradation signals are dominated by transitory electrochemical effects rather than monotonic aging. Prediction uncertainty 
                    increases because features from capacity fade, increasing resistance, and efficiency losses are weak and not yet clearly 
                    separable from short-term variability. This highlights the challenge of predicting degradation from limited early-life data.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Early-Life Image */}
            <Row className="sec_sp">
              <Col lg="12">
                <div className="project-image-container mb-4">
                  <img src={EarlyLifeImage} alt="Early-Life Prediction" className="project-image" style={{ maxWidth: '800px', width: '100%', height: 'auto', margin: '0 auto', display: 'block' }} />
                </div>
              </Col>
            </Row>

            {/* Technologies Used Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="technologies" className="section-title">Technologies Used</h2>
                <div className="technologies-grid">
                  <div className="tech-category">
                    <h4>Machine Learning</h4>
                    <ul className="tech-list">
                      <li>XGBoost</li>
                      <li>LightGBM</li>
                      <li>Random Forest</li>
                      <li>HistGradientBoostingRegressor</li>
                      <li>Ridge Regression</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Ensemble Methods</h4>
                    <ul className="tech-list">
                      <li>Stacked Ensemble</li>
                      <li>Out-of-Fold Predictions</li>
                      <li>Meta-Learning</li>
                      <li>Model Averaging</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Feature Engineering</h4>
                    <ul className="tech-list">
                      <li>Differential Features (dV/dt)</li>
                      <li>Resistance Proxies</li>
                      <li>Incremental Capacity Analysis</li>
                      <li>Efficiency Metrics</li>
                      <li>Step-Specific Diagnostics</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Feature Selection</h4>
                    <ul className="tech-list">
                      <li>Spearman Correlation Pruning</li>
                      <li>Stability Selection</li>
                      <li>Permutation Importance</li>
                      <li>Grouped Cross-Validation</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Data Processing</h4>
                    <ul className="tech-list">
                      <li>Pandas</li>
                      <li>NumPy</li>
                      <li>Time-Series Analysis</li>
                      <li>Current Integration</li>
                      <li>Data Cleaning</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Evaluation Metrics</h4>
                    <ul className="tech-list">
                      <li>RMSE (Root Mean Squared Error)</li>
                      <li>MAE (Mean Absolute Error)</li>
                      <li>Battery Holdout Validation</li>
                      <li>Early-Life Evaluation</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Validation Strategies</h4>
                    <ul className="tech-list">
                      <li>GroupKFold Cross-Validation</li>
                      <li>Battery Holdout</li>
                      <li>Round-Robin Evaluation</li>
                      <li>Stratified Validation</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Optimization</h4>
                    <ul className="tech-list">
                      <li>Hyperparameter Tuning</li>
                      <li>Early Stopping</li>
                      <li>L2 Regularization</li>
                      <li>Learning Rate Scheduling</li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        ) : isTextProcessing ? (
          <>
            {/* Overview Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="overview" className="section-title">Overview</h2>
                <div className="project-description">
                  <p>
                    This project implements a large-scale text retrieval and classification pipeline over <strong>1M+ Wikipedia documents</strong> 
                    (2.2 GB) using PySpark DataFrames and RDDs, enabling distributed computation of TF-IDF vectors and efficient cosine similarity 
                    search. The system builds a <strong>20K term dynamic vocabulary</strong> and implements a K Nearest Neighbor (k-NN) classifier to 
                    predict document categories and retrieve the top K most similar pages for any query with <strong>sub-second inference time</strong>.
                  </p>
                  <p>
                    The pipeline processes unstructured Wikipedia text data, extracts features using TF-IDF vectorization, and enables both document 
                    retrieval (finding similar documents) and category prediction (classifying documents into Wikipedia categories). The system 
                    demonstrates a <strong>3x improvement in processing efficiency</strong> when comparing DataFrame versus RDD execution, 
                    showcasing the benefits of Spark's optimized execution engine for large-scale text analytics.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Problem/Challenge Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="problem" className="section-title">Problem/Challenge</h2>
                <div className="project-description">
                  <p>
                    <strong>Big Data Challenge:</strong> Processing and analyzing massive text corpora like Wikipedia requires scalable distributed 
                    computing frameworks. Traditional single-machine approaches cannot handle datasets of this scale (1M+ documents, 2.2GB), 
                    necessitating distributed processing across multiple nodes to achieve reasonable processing times.
                  </p>
                  <p>
                    <strong>Technical Challenges:</strong>
                  </p>
                  <ul className="project-list">
                    <li>Processing 1M+ Wikipedia documents (2.2 GB) efficiently in distributed environment</li>
                    <li>Computing TF-IDF vectors at scale with memory-efficient operations</li>
                    <li>Implementing efficient similarity search over high-dimensional sparse vectors</li>
                    <li>Enabling sub-second inference for real-time query processing</li>
                  </ul>
                  <p>
                    The goal was to develop a scalable text processing pipeline that can handle massive document collections, enable fast 
                    similarity search and classification, and demonstrate practical applications in building data-driven insights, user behavior 
                    models, and decision support dashboards.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Model Pipeline Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="pipeline" className="section-title">Model Pipeline</h2>
                
                {/* Mermaid Graph */}
                <div className="mermaid-container">
                  <div className="mermaid" ref={mermaidCallbackRef}>
                    {`graph TD
    A["Data Loading<br/>(Wikipedia Pages)"] --> B["Text Extraction<br/>(DocID, Text)"]
    B --> C["Tokenization<br/>(Letters Only)"]
    C --> D["Vocabulary Construction<br/>(Top 20K Terms)"]
    D --> E["Word-to-Index Mapping"]
    E --> F["Term Frequency<br/>(TF) Calculation"]
    F --> G["Document Frequency<br/>(DF) Calculation"]
    G --> H["Inverse Document Frequency<br/>(IDF) Calculation"]
    H --> I["TF-IDF Vectorization"]
    I --> J["Document Vectors<br/>(Sparse Representation)"]
    J --> K["Category Integration"]
    K --> L["Query Processing"]
    L --> M["Query TF-IDF Vector"]
    M --> N["Cosine Similarity<br/>(Dot Product)"]
    N --> O["Top-K Retrieval"]
    O --> P["Category Prediction<br/>(k-NN Voting)"]
    
    style A fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style B fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style C fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style D fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style E fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style F fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style G fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style H fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style I fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style J fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style K fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style L fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style M fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style N fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style O fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style P fill:#fff,stroke:#000,stroke-width:2px,color:#000`}
                  </div>
                </div>

                {/* Pipeline Descriptions */}
                <div className="pipeline-descriptions">
                  <div className="pipeline-description-item">
                    <h4>1. Data Loading</h4>
                    <p>Load Wikipedia pages from Google Cloud Storage (GCS) using PySpark. Each line contains one document with XML-like structure: id="..." url=... followed by document text. The system reads from distributed storage (gs:// paths) leveraging Spark's distributed file reading capabilities. Data is partitioned across cluster nodes for parallel processing.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>2. Text Extraction</h4>
                    <p>Extract document ID and text content from raw input lines. Use regex patterns to extract docID from id="..." attribute and text content between '&quot;&gt;' and '&lt;/doc&gt;' tags. Filter valid lines containing both id and url attributes. This preprocessing step transforms raw XML-like format into structured (docID, text) pairs suitable for downstream processing.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>3. Tokenization</h4>
                    <p>Tokenize text by converting to lowercase and extracting only alphabetic characters. Remove all non-letter characters using regex substitution, normalize whitespace, and split into word tokens. This cleaning step ensures consistent token representation and removes punctuation, numbers, and special characters that don't contribute to semantic meaning.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>4. Vocabulary Construction</h4>
                    <p>Build a dynamic vocabulary of the top 20,000 most frequent terms across the entire corpus. Count word frequencies using distributed reduce operations, order by frequency (descending), and assign contiguous integer indices (0-19,999) to each vocabulary term. This vocabulary serves as the feature space for TF-IDF vectorization, balancing representation quality with computational efficiency.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>5. Word-to-Index Mapping</h4>
                    <p>Map each word token in documents to its corresponding vocabulary index. For each document, create (docID, dict_index) pairs where dict_index is the vocabulary position of the word. This mapping enables efficient sparse vector representation where only present vocabulary terms are stored, reducing memory requirements for high-dimensional feature spaces.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>6. Term Frequency (TF) Calculation</h4>
                    <p>Compute term frequency for each (docID, dict_index) pair by counting occurrences of each vocabulary term within each document. Normalize by document length to obtain relative frequencies: TF(term, doc) = count(term in doc) / total_terms_in_doc. This normalization ensures longer documents don't dominate similarity calculations purely due to word count.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>7. Document Frequency (DF) Calculation</h4>
                    <p>Calculate document frequency for each vocabulary term: count how many documents contain each term. This is computed by grouping (docID, dict_index) pairs by dict_index and counting distinct docIDs. DF measures term commonality across the corpus, with common terms having high DF and rare terms having low DF.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>8. Inverse Document Frequency (IDF) Calculation</h4>
                    <p>Compute IDF for each vocabulary term using the formula: IDF(term) = log(N / (DF(term) + 1)), where N is the total number of documents. The +1 prevents division by zero for terms appearing in all documents. IDF assigns higher weights to rare terms that are more discriminative, and lower weights to common terms that appear in many documents.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>9. TF-IDF Vectorization</h4>
                    <p>Combine TF and IDF to create TF-IDF vectors: TF-IDF(term, doc) = TF(term, doc) × IDF(term). Each document is represented as a sparse vector of length 20,000, where each dimension corresponds to a vocabulary term. Most dimensions are zero (sparse representation), storing only non-zero TF-IDF values for efficiency. This vectorization captures both term importance within documents (TF) and term discriminativeness across corpus (IDF).</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>10. Document Vectors</h4>
                    <p>Store TF-IDF vectors as sparse representations, either as Spark MLlib DenseVector objects or as (dict_index, tfidf_value) pairs. Compute document norms for cosine similarity normalization. Cache vectors in memory for efficient repeated access during query processing. The sparse representation enables efficient storage and computation for high-dimensional vectors where most values are zero.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>11. Category Integration</h4>
                    <p>Load Wikipedia category links from CSV file, mapping document IDs to their associated categories. Join category information with document vectors to create (category, tfidf_vector) pairs. This enables category-based retrieval and classification. Some documents may have multiple categories, creating multiple (category, vector) pairs per document for comprehensive category coverage.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>12. Query Processing</h4>
                    <p>For incoming text queries, apply the same preprocessing pipeline: tokenize query text, map tokens to vocabulary indices, compute query TF, multiply by pre-computed IDF values to get query TF-IDF vector. Normalize query vector for cosine similarity computation. This enables real-time query processing with sub-second inference time.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>13. Cosine Similarity</h4>
                    <p>Compute cosine similarity between query vector and all document vectors using dot product: similarity = (query · doc) / (||query|| × ||doc||). The dot product is computed efficiently using Spark joins on shared vocabulary indices, then aggregated per document. Document and query norms are pre-computed for efficient normalization. Cosine similarity measures angle between vectors, making it suitable for high-dimensional sparse data.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>14. Top-K Retrieval</h4>
                    <p>Retrieve the top K documents with highest cosine similarity scores. Sort documents by similarity (descending) and take the top K results. This enables finding the most similar documents to a query, useful for search, recommendation, and information retrieval applications. Results are returned with document IDs and similarity scores for ranking.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>15. Category Prediction (k-NN Voting)</h4>
                    <p>Predict query category using k-NN classifier: retrieve top K similar documents, extract their categories, and vote by category frequency. Categories appearing in more similar documents receive higher votes. Return top categories sorted by vote count. This classification approach leverages the "wisdom of neighbors" - if similar documents share categories, the query likely belongs to those categories too.</p>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Results Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="results" className="section-title">Results</h2>
                <div className="project-description">
                  <div className="results-grid">
                    <div className="result-card">
                      <h4>Dataset Scale</h4>
                      <p className="result-value">1M+</p>
                      <p>Wikipedia documents</p>
                    </div>
                    <div className="result-card">
                      <h4>Vocabulary Size</h4>
                      <p className="result-value">20K</p>
                      <p>Dynamic terms</p>
                    </div>
                    <div className="result-card">
                      <h4>Inference Time</h4>
                      <p className="result-value">&lt;1s</p>
                      <p>Sub-second queries</p>
                    </div>
                    <div className="result-card">
                      <h4>Processing Efficiency</h4>
                      <p className="result-value">3x</p>
                      <p>DataFrame vs RDD</p>
                    </div>
                    <div className="result-card">
                      <h4>Data Size</h4>
                      <p className="result-value">2.2 GB</p>
                      <p>Total corpus</p>
                    </div>
                    <div className="result-card">
                      <h4>Feature Space</h4>
                      <p className="result-value">20K</p>
                      <p>TF-IDF dimensions</p>
                    </div>
                  </div>
                  <p className="mt-4">
                    The pipeline successfully processes <strong>1M+ Wikipedia documents</strong> (2.2 GB) using distributed Spark computation, 
                    building a <strong>20K term vocabulary</strong> and computing TF-IDF vectors efficiently across the cluster. The system 
                    achieves <strong>sub-second inference time</strong> for query processing, enabling real-time document retrieval and 
                    category prediction.
                  </p>
                  <p>
                    <strong>Performance Optimization:</strong> The implementation demonstrates a <strong>3x improvement in processing efficiency</strong> 
                    when using Spark DataFrames compared to RDDs. This improvement comes from Spark's Catalyst optimizer, which optimizes query 
                    plans, reduces shuffle costs through intelligent join strategies, and minimizes memory overhead through columnar storage and 
                    predicate pushdown. DataFrame operations leverage Spark's optimized execution engine, resulting in faster processing and 
                    lower resource consumption.
                  </p>
                  <p>
                    <strong>Scalability:</strong> The system scales horizontally across cluster nodes, processing data in parallel partitions. 
                    Adaptive execution features (dynamic allocation, shuffle tracking, partition coalescing) optimize resource utilization and 
                    adapt to data characteristics. The sparse TF-IDF representation (most dimensions are zero) enables efficient storage and 
                    computation, allowing the system to handle high-dimensional feature spaces (20K dimensions) without excessive memory requirements.
                  </p>
                  <p>
                    <strong>Applications:</strong> The pipeline enables practical applications including document search (finding similar Wikipedia 
                    pages), category prediction (classifying documents into Wikipedia categories), and similarity-driven discovery (recommending 
                    related content). The k-NN classifier provides interpretable predictions based on document similarity, making it suitable for 
                    building data-driven insights, user behavior models, and decision support dashboards.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Technologies Used Section */}
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="technologies" className="section-title">Technologies Used</h2>
                <div className="technologies-grid">
                  <div className="tech-category">
                    <h4>Big Data Framework</h4>
                    <ul className="tech-list">
                      <li>Apache Spark</li>
                      <li>PySpark</li>
                      <li>Spark DataFrames</li>
                      <li>Spark RDDs</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Cloud Platform</h4>
                    <ul className="tech-list">
                      <li>Google Cloud Dataproc</li>
                      <li>Google Cloud Storage (GCS)</li>
                      <li>Distributed Computing</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Text Processing</h4>
                    <ul className="tech-list">
                      <li>Tokenization</li>
                      <li>Text Cleaning</li>
                      <li>Vocabulary Construction</li>
                      <li>Regex Processing</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Feature Extraction</h4>
                    <ul className="tech-list">
                      <li>TF-IDF Vectorization</li>
                      <li>Term Frequency (TF)</li>
                      <li>Inverse Document Frequency (IDF)</li>
                      <li>Sparse Vector Representation</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Machine Learning</h4>
                    <ul className="tech-list">
                      <li>K Nearest Neighbors (k-NN)</li>
                      <li>Cosine Similarity</li>
                      <li>Document Classification</li>
                      <li>Similarity Search</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Data Structures</h4>
                    <ul className="tech-list">
                      <li>Spark MLlib Vectors</li>
                      <li>DenseVector</li>
                      <li>Sparse Matrices</li>
                      <li>Distributed Collections</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Optimization</h4>
                    <ul className="tech-list">
                      <li>Catalyst Optimizer</li>
                      <li>Adaptive Execution</li>
                      <li>Dynamic Allocation</li>
                      <li>Shuffle Optimization</li>
                      <li>Partition Coalescing</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Data Formats</h4>
                    <ul className="tech-list">
                      <li>Parquet</li>
                      <li>JSON</li>
                      <li>CSV</li>
                      <li>Text Files</li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        ) : isHandOA ? (
          <>
            <Row className="sec_sp">
              <Col lg="12">
                <div className="project-image-container mb-4">
                  <img
                    src={project.img}
                    alt="Hand X-ray for osteoarthritis severity classification"
                    className="project-image"
                    style={{ maxWidth: '480px', width: '100%', height: 'auto', margin: '0 auto', display: 'block' }}
                  />
                </div>
              </Col>
            </Row>

            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="overview" className="section-title">Overview</h2>
                <div className="project-description">
                  <p>
                    This project focuses on <strong>hand osteoarthritis (HOA) severity classification</strong> from finger-joint X-ray
                    region-of-interest (ROI) images. It builds a reproducible data foundation by cleaning clinical labels, analyzing class
                    imbalance, and freezing patient-level train/validation/test manifests for downstream deep learning.
                  </p>
                  <p>
                    The pipeline targets visit <strong>V00</strong> and <strong>12 ROI joints</strong> (DIP2–5, PIP2–5, MCP2–5), with labels for
                    Kellgren–Lawrence grade (<strong>KL</strong>) plus secondary radiographic scores such as joint-space narrowing (<strong>JSN</strong>)
                    and osteophytes (<strong>OP</strong>). Outputs support both image-only KL baselines and multitask KL+JSN+OP experiments on a
                    shared, leakage-safe patient split.
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="problem" className="section-title">Problem/Challenge</h2>
                <div className="project-description">
                  <p>
                    <strong>Clinical Challenge:</strong> Hand osteoarthritis severity is graded from radiographs using ordinal scales such as
                    Kellgren–Lawrence. Manual grading is time-consuming and subject to variability, so computer vision models that can classify
                    joint-level severity from ROI images are clinically valuable.
                  </p>
                  <p>
                    <strong>Technical Challenges:</strong>
                  </p>
                  <ul className="project-list">
                    <li>Severe KL class imbalance that directly affects model strategy and evaluation</li>
                    <li>Preventing patient leakage by splitting at the patient/group level rather than by individual joint images</li>
                    <li>Aligning clinical CSV labels with available ROI image files across 12 joints</li>
                    <li>Producing frozen, versioned manifests suitable for training and fair baseline vs multitask comparisons</li>
                  </ul>
                  <p>
                    The goal was to establish a validated, reproducible dataset package before model training: statistical EDA, patient-stratified
                    splits, and trainable manifests for KL-only and multitask learning.
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="pipeline" className="section-title">Model Pipeline</h2>

                <div className="mermaid-container">
                  <div className="mermaid" ref={mermaidCallbackRef}>
                    {`graph TD
    A["Clinical CSV<br/>(hand.csv)"] --> B["Schema Checks<br/>+ Deduplication"]
    C["ROI Image Corpus<br/>(dir or file list)"] --> D["Parse Joint Filenames<br/>(12 ROIs)"]
    B --> E["Statistical EDA<br/>(KL / JSN / OP)"]
    B --> F["Patient-Level Split<br/>(70/15/15, seed 42)"]
    D --> F
    E --> F
    F --> G["All-row Manifest"]
    F --> H["KL-trainable Manifest"]
    F --> I["Multitask Manifest<br/>(KL+JSN+OP)"]
    G --> J["Validation<br/>(no patient overlap)"]
    H --> J
    I --> J
    J --> K["Downstream CV Training"]

    style A fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style B fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style C fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style D fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style E fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style F fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style G fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style H fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style I fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style J fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style K fill:#fff,stroke:#000,stroke-width:2px,color:#000`}
                  </div>
                </div>

                <div className="pipeline-descriptions">
                  <div className="pipeline-description-item">
                    <h4>1. Clinical Data + Image Alignment</h4>
                    <p>Load `hand.csv` with V00 joint scores (KL, JSN, OP, and related fields), verify required columns, and reconcile patient `id` with image folder metadata. Deduplicate exact duplicate patient rows while rejecting conflicting duplicates. Collect ROI images from a directory or filename list and parse joint names (DIP/PIP/MCP 2–5).</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>2. Statistical Analysis</h4>
                    <p>Week-1 notebooks quantify KL class imbalance, secondary score distributions (JSN/OP/ER), per-joint patterns, and correlations among radiographic scores. These findings guide modeling choices such as class weighting, ordinal losses, and multitask targets.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>3. Patient-Level Stratified Split</h4>
                    <p>Freeze a single source-of-truth patient split using `duryeaid` grouping, 70/15/15 ratios, seed 42, and stratification by each patient’s max available V00 KL among image-present joints. This prevents the same patient from appearing across train/val/test.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>4. Manifest Package</h4>
                    <p>Emit versioned artifacts: patient split CSV, all-row joint manifest (including missing images for QA), KL-trainable rows (image + KL present), and multitask-trainable rows (image + KL + JSN + OP). A validator checks split integrity and reports patient counts with zero overlap.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>5. Training-Ready Packaging</h4>
                    <p>Shell examples run the builder and validator end-to-end, writing manifests to a shared project space so computer-vision model training can start from a frozen, validated dataset package.</p>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="results" className="section-title">Results</h2>
                <div className="project-description">
                  <div className="results-grid">
                    <div className="result-card">
                      <h4>ROI Joints</h4>
                      <p className="result-value">12</p>
                      <p>DIP / PIP / MCP 2–5</p>
                    </div>
                    <div className="result-card">
                      <h4>Split Protocol</h4>
                      <p className="result-value">70/15/15</p>
                      <p>Patient-level, seed 42</p>
                    </div>
                    <div className="result-card">
                      <h4>Label Tracks</h4>
                      <p className="result-value">KL + MT</p>
                      <p>KL-only and KL+JSN+OP</p>
                    </div>
                    <div className="result-card">
                      <h4>Visit Scope</h4>
                      <p className="result-value">V00</p>
                      <p>Frozen baseline cohort</p>
                    </div>
                  </div>
                  <p>
                    The repository delivers cleaned joint-level datasets, exploratory analysis notebooks, and a validated manifest builder that
                    freezes leakage-safe splits for HOA severity modeling. Source repository: <a href="https://github.com/nr8283/CS790-Term-Project-2026" target="_blank" rel="noopener noreferrer">github.com/nr8283/CS790-Term-Project-2026</a>.
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="technologies" className="section-title">Technologies Used</h2>
                <div className="technologies-grid">
                  <div className="tech-category">
                    <h4>Data & Stats</h4>
                    <ul className="tech-list">
                      <li>Python</li>
                      <li>pandas / NumPy</li>
                      <li>scikit-learn splits</li>
                      <li>Jupyter Notebooks</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Medical Imaging Labels</h4>
                    <ul className="tech-list">
                      <li>Kellgren–Lawrence (KL)</li>
                      <li>Joint Space Narrowing (JSN)</li>
                      <li>Osteophytes (OP)</li>
                      <li>Hand X-ray ROIs</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>ML Ops / Reproducibility</h4>
                    <ul className="tech-list">
                      <li>Frozen Manifest CSVs</li>
                      <li>Patient-level Stratification</li>
                      <li>Manifest Validation CLI</li>
                      <li>Versioned Split Seeds</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Compute</h4>
                    <ul className="tech-list">
                      <li>HPC / cluster workflows</li>
                      <li>Conda / PyTorch</li>
                      <li>Bash orchestration</li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        ) : isSelfAvatarNerf ? (
          <>
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="overview" className="section-title">Overview</h2>
                <div className="project-description">
                  <p>
                    This project reconstructs a personal 3D avatar from multi-view images using an existing Neural Radiance Field (NeRF)
                    framework, then exports the result as a standard mesh for visualization in Blender. Rather than training a NeRF
                    architecture from scratch, the pipeline orchestrates <strong>Nerfstudio</strong> tooling end-to-end: data preparation,
                    training, Poisson mesh export, and Blender import.
                  </p>
                  <p>
                    The system is configured through a YAML project config and scripted so the same workflow can run locally or on a GPU
                    environment such as Google Colab. Recommended capture uses <strong>80–200 images</strong> with full 360° coverage,
                    stable lighting, and a still subject. The trained model and exported mesh are written under dedicated output directories
                    for reuse and rendering.
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="problem" className="section-title">Problem/Challenge</h2>
                <div className="project-description">
                  <p>
                    <strong>Application Challenge:</strong> Creating a high-quality personal 3D avatar traditionally requires specialized
                    scanning hardware, manual mesh cleanup, or artist-driven modeling. A practical software pipeline should turn ordinary
                    multi-view photos into a usable 3D asset that can be opened in standard tools like Blender.
                  </p>
                  <p>
                    <strong>Technical Challenges:</strong>
                  </p>
                  <ul className="project-list">
                    <li>Capturing sufficient multi-view coverage so geometry and appearance reconstruct cleanly</li>
                    <li>Integrating COLMAP-based pose estimation with Nerfstudio training and export</li>
                    <li>Choosing reconstruction and export settings that balance detail against mesh complexity</li>
                    <li>Making the workflow reproducible across local machines and Colab GPU runtimes</li>
                  </ul>
                  <p>
                    The goal was to assemble a reliable capture-to-mesh pipeline that produces a Blender-ready avatar without reinventing
                    NeRF training internals.
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="pipeline" className="section-title">Model Pipeline</h2>

                <div className="mermaid-container">
                  <div className="mermaid" ref={mermaidCallbackRef}>
                    {`graph TD
    A["Multi-view Capture<br/>(Images / Video)"] --> B["Optional Frame Extraction<br/>(ffmpeg)"]
    B --> C["Data Processing<br/>(ns-process-data / COLMAP)"]
    C --> D["NeRF Training<br/>(ns-train nerfacto)"]
    D --> E["Find Latest Config<br/>(config.yml)"]
    E --> F["Mesh Export<br/>(ns-export poisson)"]
    F --> G["OBJ + Materials"]
    G --> H["Blender Import<br/>(Visualization)"]

    style A fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style B fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style C fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style D fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style E fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style F fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style G fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style H fill:#fff,stroke:#000,stroke-width:2px,color:#000`}
                  </div>
                </div>

                <div className="pipeline-descriptions">
                  <div className="pipeline-description-item">
                    <h4>1. Multi-view Capture</h4>
                    <p>Capture a dense set of still images (or a video) around the subject. Recommended practice is 80–200 frames with full 360° coverage, consistent lighting, and minimal subject motion so camera poses and radiance fields converge reliably.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>2. Optional Frame Extraction</h4>
                    <p>When starting from video, extract frames with ffmpeg at a controlled FPS (default 3) into the image directory. This converts continuous footage into a multi-view image set suitable for reconstruction.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>3. Data Processing</h4>
                    <p>Run Nerfstudio data processing (`ns-process-data`) so COLMAP estimates camera poses and prepares a NeRF-ready dataset. On the local orchestration path, images are pointed to the configured data directory; the Colab script makes this step explicit.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>4. NeRF Training</h4>
                    <p>Train with `ns-train nerfacto` using project settings from `configs/project.yaml`. Default training runs for 30,000 iterations and writes checkpoints and run metadata under `outputs/nerf_model/`.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>5. Mesh Export</h4>
                    <p>Locate the latest Nerfstudio `config.yml`, then export a surface mesh with `ns-export poisson`. Export parameters target approximately 50,000 faces with Poisson depth 9, producing a standard `.obj` plus materials for downstream use.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>6. Blender Visualization</h4>
                    <p>Import the exported OBJ into Blender (via CLI or a small Blender Python helper) to inspect geometry, materials, and presentation quality of the reconstructed avatar.</p>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="results" className="section-title">Results</h2>
                <div className="project-description">
                  <div className="results-grid">
                    <div className="result-card">
                      <h4>Reconstruction Method</h4>
                      <p className="result-value">nerfacto</p>
                      <p>Nerfstudio NeRF method</p>
                    </div>
                    <div className="result-card">
                      <h4>Training Budget</h4>
                      <p className="result-value">30k iters</p>
                      <p>Configurable in YAML</p>
                    </div>
                    <div className="result-card">
                      <h4>Mesh Target</h4>
                      <p className="result-value">~50k faces</p>
                      <p>Poisson export setting</p>
                    </div>
                    <div className="result-card">
                      <h4>Deliverable</h4>
                      <p className="result-value">.obj mesh</p>
                      <p>Blender-ready avatar</p>
                    </div>
                  </div>
                  <p>
                    The pipeline successfully produces a trained NeRF run and an exported mesh asset that can be opened directly in Blender.
                    Supporting scripts also enable Colab GPU execution and zip packaging of mesh outputs for easy download and sharing.
                    Source repository: <a href="https://github.com/pco30/3D-avatar" target="_blank" rel="noopener noreferrer">github.com/pco30/3D-avatar</a>.
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="technologies" className="section-title">Technologies Used</h2>
                <div className="technologies-grid">
                  <div className="tech-category">
                    <h4>3D / NeRF</h4>
                    <ul className="tech-list">
                      <li>Nerfstudio</li>
                      <li>nerfacto</li>
                      <li>ns-train / ns-export</li>
                      <li>Poisson Surface Reconstruction</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Geometry & Capture</h4>
                    <ul className="tech-list">
                      <li>COLMAP</li>
                      <li>Multi-view Imaging</li>
                      <li>ffmpeg</li>
                      <li>OBJ Mesh Export</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Visualization</h4>
                    <ul className="tech-list">
                      <li>Blender</li>
                      <li>Blender Python API</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Orchestration</h4>
                    <ul className="tech-list">
                      <li>Python 3.10+</li>
                      <li>PyYAML</li>
                      <li>Typer</li>
                      <li>Google Colab (GPU path)</li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        ) : isSelfRefiningAgent ? (
          <>
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="overview" className="section-title">Overview</h2>
                <div className="project-description">
                  <p>
                    This project implements a <strong>local, web-grounded question-answering agent</strong> built with LangGraph and Ollama.
                    Given a user question, the agent plans search queries, retrieves and extracts web sources, drafts a cited answer,
                    critiques that draft, and iteratively revises until quality is acceptable or a revision limit is reached.
                  </p>
                  <p>
                    All LLM calls run through a local Ollama model (default <strong>llama3.2:3b</strong>), so the workflow does not depend on
                    cloud LLM APIs. Web retrieval uses DuckDuckGo search plus page fetching with httpx and BeautifulSoup, with search-snippet
                    fallback when extraction fails.
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="problem" className="section-title">Problem/Challenge</h2>
                <div className="project-description">
                  <p>
                    <strong>Research Challenge:</strong> Single-pass LLM answers often hallucinate, omit citations, or stop short of
                    verifying claims against external evidence. Users need an agent that actively gathers sources and improves its own draft
                    before returning a final answer.
                  </p>
                  <p>
                    <strong>Technical Challenges:</strong>
                  </p>
                  <ul className="project-list">
                    <li>Turning a free-form question into high-yield web search queries</li>
                    <li>Grounding answers strictly in retrieved sources with inline citations</li>
                    <li>Evaluating draft quality automatically and deciding when revision is needed</li>
                    <li>Running the full loop locally with Ollama while remaining resilient to failed page fetches</li>
                  </ul>
                  <p>
                    The goal was to build a transparent agentic QA loop that prefers grounded, cited answers over one-shot generation.
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="pipeline" className="section-title">Model Pipeline</h2>

                <div className="mermaid-container">
                  <div className="mermaid" ref={mermaidCallbackRef}>
                    {`graph TD
    A["User Question"] --> B["Planner<br/>(Search Queries JSON)"]
    B --> C["Web Search<br/>(DuckDuckGo)"]
    C --> D["Fetch + Extract<br/>(httpx / BeautifulSoup)"]
    D --> E["Synthesizer<br/>(Cited Draft)"]
    E --> F["Critic<br/>(Score 0-10)"]
    F --> G{"Needs Revision<br/>and under max?"}
    G -->|Yes| H["Reviser<br/>(Fix Issues)"]
    H --> F
    G -->|No| I["Finalize Answer"]

    style A fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style B fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style C fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style D fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style E fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style F fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style G fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style H fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style I fill:#fff,stroke:#000,stroke-width:2px,color:#000`}
                  </div>
                </div>

                <div className="pipeline-descriptions">
                  <div className="pipeline-description-item">
                    <h4>1. Planner</h4>
                    <p>An LLM research planner proposes 3–6 web queries plus must-have facts and pitfalls to avoid. Output is parsed as JSON with fallbacks when the model wraps JSON in prose. Queries are capped at six.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>2. Search & Extraction</h4>
                    <p>Each query is searched via DuckDuckGo. Candidate URLs are fetched and cleaned (scripts/styles/nav removed), truncated to readable excerpts, and de-duplicated. Up to 10 sources are retained for synthesis. If a page fetch fails, the search snippet is used as fallback context.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>3. Synthesizer</h4>
                    <p>Using only retrieved sources, the synthesizer writes a concise answer with `[n]` citations. It is instructed to note conflicts, avoid unsupported claims, and call out missing evidence when sources are insufficient.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>4. Critic</h4>
                    <p>A critic scores the draft 0–10 on groundedness, completeness, clarity, citation quality, and hallucination risk. It returns structured issues/fixes and a `needs_revision` flag (defaulting to true when score &lt; 8).</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>5. Reviser's Loop</h4>
                    <p>If revision is needed and the revision count is below `--max-revisions` (default 2), a reviser rewrites the draft to address critic issues using only the sources. The updated draft returns to the critic until exit criteria are met, then finalize emits the final answer.</p>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="results" className="section-title">Results</h2>
                <div className="project-description">
                  <div className="results-grid">
                    <div className="result-card">
                      <h4>Agent Framework</h4>
                      <p className="result-value">LangGraph</p>
                      <p>Stateful multi-node graph</p>
                    </div>
                    <div className="result-card">
                      <h4>Default Model</h4>
                      <p className="result-value">llama3.2:3b</p>
                      <p>Local via Ollama</p>
                    </div>
                    <div className="result-card">
                      <h4>Revision Cap</h4>
                      <p className="result-value">2 loops</p>
                      <p>Configurable CLI flag</p>
                    </div>
                    <div className="result-card">
                      <h4>Source Cap</h4>
                      <p className="result-value">10 pages</p>
                      <p>De-duplicated web evidence</p>
                    </div>
                  </div>
                  <p>
                    The agent produces cited answers that improve through an explicit critique-and-revision loop rather than a single generation
                    pass. Because inference stays local, the design supports privacy-sensitive research workflows while still grounding claims
                    in live web evidence. Source repository: <a href="https://github.com/pco30/Self-refining_LLM_Agent" target="_blank" rel="noopener noreferrer">github.com/pco30/Self-refining_LLM_Agent</a>.
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="technologies" className="section-title">Technologies Used</h2>
                <div className="technologies-grid">
                  <div className="tech-category">
                    <h4>Agent Stack</h4>
                    <ul className="tech-list">
                      <li>LangGraph</li>
                      <li>LangChain</li>
                      <li>langchain-ollama</li>
                      <li>Ollama</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Retrieval</h4>
                    <ul className="tech-list">
                      <li>DuckDuckGo Search</li>
                      <li>httpx</li>
                      <li>BeautifulSoup</li>
                      <li>lxml</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>LLM Behavior</h4>
                    <ul className="tech-list">
                      <li>Planner / Critic / Reviser Prompts</li>
                      <li>Citation-grounded Synthesis</li>
                      <li>JSON Response Parsing</li>
                      <li>Iterative Self-refinement</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Runtime</h4>
                    <ul className="tech-list">
                      <li>Python 3.10+</li>
                      <li>CLI Interface</li>
                      <li>Local Inference</li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        ) : isWinChangeMonitor ? (
          <>
            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="overview" className="section-title">Overview</h2>
                <div className="project-description">
                  <p>
                    <strong>WinChangeMonitor</strong> is a Windows desktop application that helps users understand what a third-party
                    executable or script changes on a machine. It captures a baseline inventory, lets the user run the target program,
                    captures a post-execution inventory, and generates a diff report of <strong>added / modified / deleted</strong> changes.
                  </p>
                  <p>
                    The tool monitors configurable domains — <strong>filesystem</strong>, <strong>Windows Registry</strong>, and
                    <strong> Windows Services</strong> — and exports human-readable HTML reports plus structured JSON. It was developed as a
                    software engineering course product (MET CS 673) with companion documentation, installer packaging, and a TestFramework
                    that simulates installer-like system changes for demos and validation.
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="problem" className="section-title">Problem/Challenge</h2>
                <div className="project-description">
                  <p>
                    <strong>Security / Ops Challenge:</strong> Developers, administrators, and security-minded users often need to run
                    unverified, legacy, closed-source, or “mystery” software. Without transparent change detection, it is difficult to know
                    which files, registry values, or services were created, altered, or removed.
                  </p>
                  <p>
                    <strong>Technical Challenges:</strong>
                  </p>
                  <ul className="project-list">
                    <li>Inventories that can span large folder trees, nested registry keys, and service configurations</li>
                    <li>Persisting large baseline inventories efficiently between pre- and post-scans</li>
                    <li>Diffing three heterogeneous domains into a single actionable report</li>
                    <li>Providing a usable WinForms UI, installer, and reproducible demo harness</li>
                  </ul>
                  <p>
                    The goal was to deliver a repeatable baseline → execute → post-scan → report workflow for transparent Windows change analysis.
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="pipeline" className="section-title">Model Pipeline</h2>

                <div className="mermaid-container">
                  <div className="mermaid" ref={mermaidCallbackRef}>
                    {`graph TD
    A["Configure Monitors<br/>(File / Registry / Services)"] --> B["Select Targets<br/>(Folders / Keys / Services)"]
    B --> C["Pre-Install Inventory<br/>(Baseline Scan)"]
    C --> D["Persist Inventory<br/>(MessagePack .bin)"]
    D --> E["Run Third-party Software"]
    E --> F["Post-Install Inventory<br/>(Second Scan)"]
    F --> G["Difference Analysis<br/>(Added / Modified / Deleted)"]
    G --> H["HTML Report + JSON Export"]

    style A fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style B fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style C fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style D fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style E fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style F fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style G fill:#fff,stroke:#000,stroke-width:2px,color:#000
    style H fill:#fff,stroke:#000,stroke-width:2px,color:#000`}
                  </div>
                </div>

                <div className="pipeline-descriptions">
                  <div className="pipeline-description-item">
                    <h4>1. Configure Monitors</h4>
                    <p>Enable any combination of File System, Registry, and Services monitors from the main WinForms UI. Each monitor can be toggled independently so scans stay focused on the domains of interest.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>2. Select Targets</h4>
                    <p>Add folders and registry keys to track, optionally including subfolders/subkeys. Services monitoring captures service configuration state. Some registry/service operations may require Administrator privileges.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>3. Pre-Install Inventory</h4>
                    <p>Perform a baseline scan that recursively inventories selected filesystem paths, registry trees, and services. Work runs on background workers so the UI remains responsive during long scans.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>4. Persist Baseline</h4>
                    <p>Serialize inventories and tracked settings with MessagePack into local `.bin` files beside the executable. On relaunch, retained settings and inventories can be reloaded with splash-screen progress feedback.</p>
                  </div>

                  <div className="pipeline-description-item">
                    <h4>5. Post-Install Diff & Reporting</h4>
                    <p>After the target program runs, a second inventory is captured and compared against the baseline. Changes are bucketed as added, modified, or deleted per domain, then exported as an HTML report and optional JSON for further analysis. A companion TestFramework executable can simulate installer-like changes for demos and testing.</p>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="results" className="section-title">Results</h2>
                <div className="project-description">
                  <div className="results-grid">
                    <div className="result-card">
                      <h4>Monitored Domains</h4>
                      <p className="result-value">3</p>
                      <p>Files, Registry, Services</p>
                    </div>
                    <div className="result-card">
                      <h4>Change Types</h4>
                      <p className="result-value">Add / Mod / Del</p>
                      <p>Per monitored section</p>
                    </div>
                    <div className="result-card">
                      <h4>Report Formats</h4>
                      <p className="result-value">HTML + JSON</p>
                      <p>Human + machine readable</p>
                    </div>
                    <div className="result-card">
                      <h4>Platform</h4>
                      <p className="result-value">WinForms</p>
                      <p>.NET Framework 4.8</p>
                    </div>
                  </div>
                  <p>
                    WinChangeMonitor delivers a complete product surface: desktop UI, persistent inventories, installer packaging, visual user
                    guide, and a TestFramework demo harness. Course artifacts (proposal, SRS, SDD, SCMP/SPMP) document the engineering process
                    behind the tool. Source repository: <a href="https://github.com/pco30/WinChangeMonitor" target="_blank" rel="noopener noreferrer">github.com/pco30/WinChangeMonitor</a>.
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="sec_sp">
              <Col lg="12">
                <h2 id="technologies" className="section-title">Technologies Used</h2>
                <div className="technologies-grid">
                  <div className="tech-category">
                    <h4>Application</h4>
                    <ul className="tech-list">
                      <li>C# / WinForms</li>
                      <li>.NET Framework 4.8</li>
                      <li>Visual Studio</li>
                      <li>Windows Installer Package</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Windows APIs</h4>
                    <ul className="tech-list">
                      <li>Filesystem Enumeration</li>
                      <li>Microsoft.Win32 Registry</li>
                      <li>ServiceController</li>
                      <li>BackgroundWorker</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>Persistence & Export</h4>
                    <ul className="tech-list">
                      <li>MessagePack</li>
                      <li>System.Text.Json</li>
                      <li>HTML Report Generation</li>
                    </ul>
                  </div>
                  <div className="tech-category">
                    <h4>UI Components</h4>
                    <ul className="tech-list">
                      <li>ObjectListView</li>
                      <li>WinFormsToggleSwitch</li>
                      <li>Custom Registry Browser</li>
                      <li>HTML Preview Form</li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        ) : (
          <Row className="sec_sp">
            <Col lg="12">
              <div className="project-image-container mb-4">
                <img src={project.img} alt={project.name} className="project-image" />
              </div>
              <div className="project-description">
                <p>{project.description}</p>
              </div>
            </Col>
          </Row>
        )}
        
        {/* Contact Me Footer */}
        <Row className="mt-5 mb-4">
          <Col lg="12" className="text-center">
            <Link to="/contact" className="contact-me-footer">
              Contact Me
            </Link>
          </Col>
        </Row>
      </Container>
    </HelmetProvider>
  );
};
