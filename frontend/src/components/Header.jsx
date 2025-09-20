import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Form, FormControl, Dropdown } from 'react-bootstrap';

function Header({ isAuthenticated, onLogout }) {
    // DICHIARIAMO useNavigate
    const navigate = useNavigate();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchTerm.length > 2) {
                setIsSearching(true);
                try {
                    const response = await fetch(`http://localhost:4000/api/v1/recipes/search?q=${searchTerm}`);
                    const data = await response.json();
                    setSearchResults(data.data);
                } catch (error) {
                    console.error('Errore nella ricerca:', error);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setIsSearching(false);
            }
        };

        const debounceSearch = setTimeout(fetchSearchResults, 300); // Debounce di 300ms
        return () => clearTimeout(debounceSearch);
    }, [searchTerm]);

    // NUOVA FUNZIONE WRAPPER PER IL LOGOUT
    const handleLogout = () => {
        // 1. Esegui la logica di logout passata da App.jsx
        onLogout();
        
        // 2. REINDIRIZZAMENTO ALLA HOME PAGE (/)
        navigate('/');
    };

    return (
        <Navbar bg="light" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/">EpiBlog</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    
                    {/* Barra di ricerca con anteprima */}
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
                                        onClick={() => setSearchTerm('')}
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
                                <Nav.Link as={Link} to="/my-posts">I miei Post</Nav.Link>
                                <Nav.Link as={Link} to="/account">Account</Nav.Link>
                                {/* COLLEGA LA NUOVA FUNZIONE WRAPPER */}
                                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Accedi</Nav.Link>
                                <Nav.Link as={Link} to="/register">Registrati</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
