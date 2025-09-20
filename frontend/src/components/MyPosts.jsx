import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Card, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function MyPosts({ onPostCreated }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const BASE_URL = import.meta.env.VITE_API_URL; 

    const fetchMyPosts = async () => {
        setLoadingPosts(true);
        setError(null);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Devi essere loggato per vedere i tuoi post.');
                setLoadingPosts(false);
                return;
            }
            
            
            const response = await fetch(`${BASE_URL}/api/v1/recipes/my-posts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) {
                throw new Error('Impossibile caricare i tuoi post.');
            }
            const data = await response.json();
            setPosts(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingPosts(false);
        }
    };

    useEffect(() => {
        fetchMyPosts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('Devi essere autenticato per creare un post.');
            return;
        }

        try {
           
            const response = await fetch(`${BASE_URL}/api/v1/recipes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name: title, content }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.message || JSON.stringify(data) || 'Errore sconosciuto nella creazione del post.';
                throw new Error(errorMessage);
            }

            setSuccess('Post creato con successo!');
            setTitle('');
            setContent('');
            
            fetchMyPosts();
            if (onPostCreated) {
                onPostCreated();
            }

        } catch (err) {
            setError(err.message || 'Si è verificato un errore inaspettato.');
        }
    };

    const handleDelete = async (postId) => {
        const confirmDelete = window.confirm("Sei sicuro di voler cancellare questo post?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('authToken');
            // CORREZIONE 3: Sostituito localhost:4000 con la variabile d'ambiente
            const response = await fetch(`${BASE_URL}/api/v1/recipes/${postId}`, { // <--- CORREZIONE QUI
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Errore nella cancellazione del post.');
            }
            setSuccess('Post cancellato con successo!');
            fetchMyPosts();
            if (onPostCreated) {
                onPostCreated();
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center">Crea un nuovo Post</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit} className="mb-5">
                <Form.Group className="mb-3">
                    <Form.Label>Titolo</Form.Label>
                    <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Contenuto</Form.Label>
                    <Form.Control as="textarea" rows={5} value={content} onChange={(e) => setContent(e.target.value)} required />
                </Form.Group>
                <div className="d-grid gap-2">
                    <Button variant="primary" type="submit">Pubblica Post</Button>
                </div>
            </Form>

            <hr className="my-5" />

            <h2 className="text-center mb-4">I miei Post esistenti</h2>
            {loadingPosts && <Spinner animation="border" role="status" className="d-block m-auto" />}
            {error && !loadingPosts && <Alert variant="danger">{error}</Alert>}
            {!loadingPosts && !error && posts.length === 0 && <p className="text-center">Non hai ancora creato nessun post.</p>}
            
            <Row>
                {posts.length > 0 && posts.map(post => (
                    <Col md={6} lg={4} className="mb-4" key={post._id}>
                        <Card>
                            <Link to={`/posts/${post._id}`} className="text-decoration-none text-dark">
                                <Card.Body>
                                    {post.user && (
                                        <Card.Subtitle className="mb-2 text-muted">
                                            {post.user.firstName} {post.user.lastName}
                                        </Card.Subtitle>
                                    )}
                                    <Card.Title>{post.name}</Card.Title>
                                    <Card.Text>{post.content}</Card.Text>
                                </Card.Body>
                            </Link>
                            <Card.Footer>
                                <Button 
                                    variant="danger" 
                                    onClick={() => handleDelete(post._id)}
                                >
                                    Cancella
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default MyPosts;
