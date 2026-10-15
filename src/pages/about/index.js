import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  dataabout,
  meta,
  worktimeline,
  skillsCategories,
  services,
} from "../../content_option";
import profileImage from "../../assets/images/IMG_he.PNG";
import badgeImage from "../../assets/images/badge.png";

export const About = () => {
  return (
    <HelmetProvider>
      <Container className="About-header">
        <Helmet>
          <meta charSet="utf-8" />
          <title> About | {meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4">About me</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">{dataabout.title}</h3>
            <div className="profile-image-container">
              <img 
                src={profileImage} 
                alt="Profile" 
                className="profile-image-circle"
              />
            </div>
          </Col>
          <Col lg="7" className="d-flex align-items-center">
            <div>
              <p>{dataabout.aboutme}</p>
            </div>
          </Col>
        </Row>
        <Row className=" sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Work Timeline</h3>
          </Col>
          <Col lg="7">
            <table className="table caption-top">
              <tbody>
                {worktimeline.map((data, i) => {
                  return (
                    <tr key={i}>
                      <th scope="row">{data.jobtitle}</th>
                      <td>{data.where}</td>
                      <td>{data.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Skills</h3>
          </Col>
          <Col lg="7">
            <div className="skills-categories">
              {skillsCategories.map((group, i) => {
                return (
                  <div className="skill-category" key={i}>
                    <h4 className="skill-category-title">{group.category}</h4>
                    <p className="skill-category-items">{group.items.join(", ")}</p>
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lang="5">
            <h3 className="color_sec py-4">services</h3>
          </Col>
          <Col lg="7">
            {services.map((data, i) => {
              return (
                <div className="service_ py-4" key={i}>
                  <h5 className="service__title">{data.title}</h5>
                  <p className="service_desc">{data.description}</p>
                </div>
              );
            })}
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Certifications</h3>
          </Col>
          <Col lg="7">
            <div className="d-flex align-items-start gap-4 flex-wrap">
              <div className="certification-content">
                <div className="service_ py-4">
                  <h5 className="service__title">Professional Certifications</h5>
                  <p className="service_desc">
                    PRINCE2 Foundation in Project Management
                  </p>
                </div>
              </div>
              <div className="certification-image-container">
                <img 
                  src={badgeImage} 
                  alt="Certification Badge" 
                  className="certification-badge"
                />
              </div>
            </div>
          </Col>
        </Row>
        <div style={{ marginBottom: '3rem', paddingBottom: '2rem' }}></div>
        
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
