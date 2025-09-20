import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Alert, Spinner, Form, Button } from 'react-bootstrap';

function SinglePost({ isAuthenticated }) {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/recipes/${postId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Impossibile caricare il post.');
                }
                const data = await response.json();
                setPost(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setCommentError(null);
        setSuccess(null);
        const token = localStorage.getItem('authToken');
        if (!token) {
            setCommentError('Devi essere loggato per commentare.');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/recipes/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ text: comment }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Errore nell\'invio del commento.');
            }
            setSuccess('Commento aggiunto con successo!');
            setComment('');
            
            const updatedResponse = await fetch(`http://localhost:4000/api/v1/recipes/${postId}`);
            const updatedData = await updatedResponse.json();
            setPost(updatedData);

        } catch (err) {
            setCommentError(err.message);
        }
    };

    if (loading) {
        return <Spinner animation="border" role="status" className="d-block m-auto mt-5" />;
    }

    if (error) {
        return <Alert variant="danger" className="mt-5 text-center">{error}</Alert>;
    }
    
    if (!post || !post._id) {
        return <Alert variant="info" className="mt-5 text-center">Nessun post trovato.</Alert>;
    }

    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    {/* Aggiungi qui l'autore del post */}
                    {post.user && (
                        <Card.Subtitle className="mb-2 text-muted">
                            Autore: {post.user.firstName} {post.user.lastName}
                        </Card.Subtitle>
                    )}
                    <Card.Title>{post.name}</Card.Title>
                    <Card.Text>{post.content}</Card.Text>
                </Card.Body>
            </Card>
            <h4 className="mt-4">Commenti</h4>
            {success && <Alert variant="success">{success}</Alert>}
            {commentError && <Alert variant="danger">{commentError}</Alert>}
            
            {post.comments && post.comments.length > 0 ? (
                <ul className="list-unstyled">
                    {post.comments.map((c, index) => (
                        <li key={index} className="mb-2">
                            <strong>{c.user ? c.user.firstName : 'Anonimo'}</strong>: {c.text}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nessun commento ancora.</p>
            )}
            
            {isAuthenticated && (
                <Form onSubmit={handleCommentSubmit} className="mt-4">
                    <Form.Group className="mb-3">
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            placeholder="Aggiungi un commento..." 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Commenta
                    </Button>
                </Form>
            )}
        </Container>
    );
}

export default SinglePost;
