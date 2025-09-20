import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Form, FormControl, Dropdown } from 'react-bootstrap';

function Header({ isAuthenticated, onLogout }) {
    const navigate = useNavigate();
    
    const [isNavExpanded, setIsNavExpanded] = useState(false); 
    
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const BASE_URL = import.meta.env.VITE_API_URL;
    const handleNavLinkClick = () => {
        setIsNavExpanded(false); 
    };

    const handleLogout = () => {
        setIsNavExpanded(false);
        onLogout();
        navigate('/');
    };

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchTerm.length > 2) {
                setIsSearching(true);
                try {
                    const response = await fetch(`${BASE_URL}/api/v1/recipes/search?q=${searchTerm}`);
                    
                    if (!response.ok) {
                        const errorText = await response.text(); 
                        console.error('API Search Error Response:', errorText);
                        throw new Error(`Errore (${response.status}) durante la ricerca.`);
                    }

                    const data = await response.json();
                    setSearchResults(data.data);
                } catch (error) {
                    console.error('Errore nella ricerca:', error.message); 
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setIsSearching(false);
            }
        };

        const debounceSearch = setTimeout(fetchSearchResults, 300); 
        return () => clearTimeout(debounceSearch);
    }, [searchTerm, BASE_URL]); 

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-3" sticky="top" expanded={isNavExpanded} onToggle={setIsNavExpanded} >
            <Container>
                <Navbar.Brand as={Link} to="/" onClick={handleNavLinkClick}>
                    EpiBlog
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
    
                    <div className="mx-auto my-2 my-lg-0 position-relative">
                        <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                            <FormControl
                                type="search"
                                placeholder="Cerca un post..."
                                className="me-2"
                                aria-label="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Form>
                        
    
                        {isSearching && searchTerm.length > 2 && (
                            <div className="position-absolute bg-white border rounded shadow mt-1 p-2 w-100" style={{ zIndex: 1000 }}>
                                <p className="text-center text-muted m-0">Caricamento...</p>
                            </div>
                        )}
                        {!isSearching && searchResults.length > 0 && (
                            <div className="position-absolute bg-white border rounded shadow mt-1 w-100" style={{ zIndex: 1000 }}>
                                {searchResults.map(post => (
                                    <Dropdown.Item 
                                        as={Link} 
                                        to={`/posts/${post._id}`} 
                                        key={post._id}
                                       
                                        onClick={() => { setSearchTerm(''); handleNavLinkClick(); }} 
                                    >
                                        {post.name}
                                    </Dropdown.Item>
                                ))}
                            </div>
                        )}
                        {!isSearching && searchTerm.length > 2 && searchResults.length === 0 && (
                            <div className="position-absolute bg-white border rounded shadow mt-1 p-2 w-100" style={{ zIndex: 1000 }}>
                                <p className="text-center text-muted m-0">Nessun risultato trovato.</p>
                            </div>
                        )}
                    </div>
                    
                    <Nav>
                        {isAuthenticated ? (
                            <>
            
                                <Nav.Link as={Link} to="/my-posts" onClick={handleNavLinkClick}>I miei Post</Nav.Link>
                                <Nav.Link as={Link} to="/account" onClick={handleNavLinkClick}>Account</Nav.Link>
                                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                            </>
                        ) : (
                            <>
        
                                <Nav.Link as={Link} to="/login" onClick={handleNavLinkClick}>Accedi</Nav.Link>
                                <Nav.Link as={Link} to="/register" onClick={handleNavLinkClick}>Registrati</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
