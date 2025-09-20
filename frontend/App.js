import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import AuthForm from './src/components/AuthForm';
import HomePage from './src/components/HomePage';
import AccountPage from './src/components/AccountPage';
import MyPostsPage from './src/components/MyPostsPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const onLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const onLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">Epizafferano</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
            </Nav>
            <Nav>
              {isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to="/my-posts">I miei Post</Nav.Link>
                  <Nav.Link as={Link} to="/account">Account</Nav.Link>
                  <Nav.Link onClick={onLogout}>Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link as={Link} to="/auth">Accedi / Registrati</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/auth" element={<AuthForm onLoginSuccess={onLoginSuccess} />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/my-posts" element={<MyPostsPage />} />
        <Route path="/account" element={<AccountPage onLogout={onLogout} />} />
      </Routes>
    </Router>
  );
}

export default App;