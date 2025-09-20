import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate, Link } from 'react-router-dom';

function AuthForm({ onLoginSuccess }) {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [firstName, setFirstName] = useState('');
 

 const [statusMessage, setStatusMessage] = useState(null); 
 const [isSuccess, setIsSuccess] = useState(false);

 const location = useLocation();
 const navigate = useNavigate();
 const isRegisterMode = location.pathname === '/register';

 const handleSubmit = async (e) => {
  e.preventDefault();
  setStatusMessage(null); 
  setIsSuccess(false);

  //SE VA SU 4000 SI ROMPE, SE VA SU VITE-TUTTO-OK
  // Sostituito l'indirizzo 'http://localhost:4000' con la variabile d'ambiente di Vite
  const endpoint = isRegisterMode
   ? `${import.meta.env.VITE_API_URL}/api/v1/register`
   : `${import.meta.env.VITE_API_URL}/api/v1/login`;
 

  const body = isRegisterMode
   ? { firstName, email, password }
   : { email, password };

  try {
   const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
   });

   const data = await response.json();

   if (!response.ok) {
    setStatusMessage(data.message || 'Errore di autenticazione. Verifica i dati.');
    return; 
   }
   
   
   if (isRegisterMode) {
    setStatusMessage(data.message); 
    setIsSuccess(true);
    setTimeout(() => {
     navigate('/login');
    }, 3000);

   } else if (data.token) {
    localStorage.setItem('authToken', data.token);
    onLoginSuccess();
    navigate('/');
   }

  } catch (err) {
   setStatusMessage('Impossibile connettersi al server. Riprova più tardi.');
  }
 };

 return (
  <div className="d-flex justify-content-center">
   <div className="w-50">
    <h2 className="text-center mb-4">
     {isRegisterMode ? 'Registrati' : 'Accedi'}
    </h2>
    
    {/* MESSAGGIO DI STATO (Successo or Errore) */}
    {statusMessage && (
     <Alert variant={isSuccess ? 'success' : 'danger'}>
      {statusMessage}
     </Alert>
    )}
    
    {!(isRegisterMode && isSuccess) && (
     <Form onSubmit={handleSubmit}>
      {isRegisterMode && (
       <Form.Group className="mb-3">
           <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
       </Form.Group>
      )}
        <Form.Group className="mb-3">
<Form.Label>Email</Form.Label>
<Form.Control
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
required
/>
</Form.Group>
<Form.Group className="mb-3">
 <Form.Label>Password</Form.Label>
<Form.Control
 type="password"
 value={password}
onChange={(e) => setPassword(e.target.value)}
 required
 />
 </Form.Group>
<Button variant="primary" type="submit" className="w-100">
 {isRegisterMode ? 'Registrati' : 'Accedi'}
 </Button>
 </Form>
 )}

 <div className="text-center mt-3">
{isRegisterMode ? (
 <p>
Hai già un account? <Link to="/login">Accedi qui</Link>
</p>
 ) : (
      <p>
       Non hai un account? <Link to="/register">Registrati qui</Link>
      </p>
      )}
     </div>
    </div>
  </div>
 );
}

export default AuthForm;
