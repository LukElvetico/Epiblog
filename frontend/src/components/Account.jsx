import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Account({ onLogout }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await fetch('http://localhost:4000/api/v1/users/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setEmail(data.email);
          setFirstName(data.firstName);
        } else {
          throw new Error(data.message || 'Errore nel recupero dei dati utente.');
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch('http://localhost:4000/api/v1/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email, firstName }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Dati aggiornati con successo!');
      } else {
        throw new Error(data.message || 'Errore nell\'aggiornamento dei dati.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    const confirmation = window.confirm('Sei sicuro di voler cancellare il tuo account? Questa azione è irreversibile.');
    if (!confirmation) return;

    setError(null);
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch('http://localhost:4000/api/v1/users/me', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        onLogout();
        navigate('/');
      } else {
        throw new Error('Errore nella cancellazione dell\'account.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Il mio Account</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Card className="p-4 mt-3">
        <Form onSubmit={handleUpdate}>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">Aggiorna Dati</Button>
        </Form>
        <div className="d-grid mt-3">
          <Button variant="danger" onClick={handleDelete}>Elimina Account</Button>
        </div>
      </Card>
    </Container>
  );
}

export default Account;
