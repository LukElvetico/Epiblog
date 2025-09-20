// src/components/HomePage.jsx
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Importa Link

function HomePage({ posts }) {
    return (
        <Container className="mt-5">
            <h1 className="mb-4 text-center">Tutti i Post</h1>
            <Row>
                {posts.length > 0 ? (
                    posts.map(post => (
                        <Col md={6} lg={4} className="mb-4" key={post._id}>
                            <Link to={`/posts/${post._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{post.name}</Card.Title>
                                        <Card.Text>{post.content}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                    ))
                ) : (
                    <p className="text-center">Nessun post disponibile.</p>
                )}
            </Row>
        </Container>
    );
}

export default HomePage;