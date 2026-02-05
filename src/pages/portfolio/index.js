import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { dataportfolio, meta, otherProjects, socialprofils } from "../../content_option";

export const Portfolio = () => {
  return (
    <HelmetProvider>
      <Container className="About-header">
        <Helmet>
          <meta charSet="utf-8" />
          <title> Portfolio | {meta.title} </title>{" "}
          <meta name="description" content={meta.description} />
        </Helmet>
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4"> Portfolio </h1>{" "}
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>
        <div className="mb-5 po_items_ho">
          {dataportfolio.map((data, i) => {
            return (
              <Link key={i} to={data.link} className="po_item-link">
                <div className="po_item">
                  <h4 className="project-name">{data.name}</h4>
                  <img src={data.img} alt={data.name} />
                  <div className="content">
                    <span className="view-project-link">view project</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <Row className="sec_sp">
          <Col lg="12">
            <h3 className="color_sec py-4">Other Projects</h3>
            <div className="other-projects">
              {otherProjects.map((project, i) => {
                return (
                  <a 
                    key={i} 
                    href={project.link || socialprofils.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="other-project-item-link"
                  >
                    <div className="other-project-item">
                      <h5 className="other-project-name">{project.name}</h5>
                      <p className="other-project-description">{project.description}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </Col>
        </Row>
        
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
