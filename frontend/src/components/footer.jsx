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
              &copy; {currentYear} EpiBlog | Progetto di sviluppo web.
            </p>
          </Col>

          <Col md={6}>
            <a 
              href="https://github.com/LukElvetico/"
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white mx-3"
              aria-label="GitHub Repository"
            >
            </a>
            <a 
              href="mailto:Weber.ltm@gmail.com" // Sostituisci con la tua email
              className="text-white mx-3"
              aria-label="Contattami via Email"
            >
    
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
