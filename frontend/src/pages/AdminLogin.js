import React, { useState } from 'react';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminLogin() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(credentials);
      navigate('/admin');
    } catch (error) {
      setError('Email ou mot de passe incorrect');
    }

    setLoading(false);
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Connexion Admin</h2>
            
            {error && (
              <Alert variant="danger" onClose={() => setError('')} dismissible>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({
                    ...credentials,
                    email: e.target.value
                  })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({
                    ...credentials,
                    password: e.target.value
                  })}
                  required
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-100"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default AdminLogin;
