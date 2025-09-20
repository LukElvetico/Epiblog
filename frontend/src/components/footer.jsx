import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-5 p-3">
      <Container>
        <Row className="text-center">
          {/* Created by Lukas for an Epicode School Project 2025 Full Stack */}
          <Col md={6} className="mb-2 mb-md-0">
            <p className="mb-0">
              &copy; {currentYear} EpiBlog | Created by Lukas for an Epicode School Project 2025 Full Stack.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
