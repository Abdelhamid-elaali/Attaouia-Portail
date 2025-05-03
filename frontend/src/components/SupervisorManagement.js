import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Table, Alert } from 'react-bootstrap';
import { userService } from '../services/api';

const SupervisorManagement = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  // Load supervisors on component mount
  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    try {
      const response = await userService.getSupervisors();
      setSupervisors(response.data);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching supervisors:', err);
      setError(err.response?.data?.message || 'Erreur lors de la récupération des superviseurs');
      setSupervisors([]);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess('');

    // Basic validation
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Format d\'email invalide');
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      console.log('Submitting form data:', { ...formData, password: '[HIDDEN]' });
      const response = await userService.createSupervisor(formData);
      
      if (response?.data) {
        console.log('Supervisor created successfully');
        setSuccess('Compte superviseur créé avec succès');
        setFormData({ email: '', password: '', fullName: '' });
        await fetchSupervisors(); // Refresh the list
      }
    } catch (err) {
      console.error('Error in form submission:', err);
      const errorMessage = err.response?.data?.message || 'Erreur lors de la création du compte';
      console.error('Error message:', errorMessage);
      setError(errorMessage);
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="supervisor-management">
      <Card className="mb-4">
        <Card.Header as="h5">Ajouter un nouveau superviseur</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nom complet</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                placeholder="Entrez le nom complet"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Entrez l'adresse email"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Entrez le mot de passe"
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Créer le compte
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header as="h5">Liste des superviseurs</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nom complet</th>
                <th>Email</th>
                <th>Date de création</th>
              </tr>
            </thead>
            <tbody>
              {supervisors.map((supervisor) => (
                <tr key={supervisor._id}>
                  <td>{supervisor.fullName}</td>
                  <td>{supervisor.email}</td>
                  <td>{new Date(supervisor.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SupervisorManagement;
