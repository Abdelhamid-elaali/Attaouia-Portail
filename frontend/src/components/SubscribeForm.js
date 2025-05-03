import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { subscriptionService } from '../services/api';

function SubscribeForm() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    notificationPreference: 'email' // 'email' or 'sms'
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await subscriptionService.subscribe(formData);
      setStatus({
        type: 'success',
        message: 'Inscription réussie ! Vous recevrez nos notifications.'
      });
      setFormData({ email: '', phone: '', notificationPreference: 'email' });
    } catch (error) {
      setStatus({
        type: 'danger',
        message: 'Erreur lors de l\'inscription. Veuillez réessayer.'
      });
    }
    setLoading(false);
  };

  return (
    <div className="subscribe-form p-4 bg-light rounded">
      <h3 className="mb-4">S'abonner aux Alertes</h3>
      
      {status.message && (
        <Alert variant={status.type} onClose={() => setStatus({ type: '', message: '' })} dismissible>
          {status.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Préférence de notification</Form.Label>
          <Form.Select
            value={formData.notificationPreference}
            onChange={(e) => setFormData({
              ...formData,
              notificationPreference: e.target.value
            })}
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </Form.Select>
        </Form.Group>

        {formData.notificationPreference === 'email' ? (
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </Form.Group>
        ) : (
          <Form.Group className="mb-3">
            <Form.Label>Numéro de téléphone</Form.Label>
            <Form.Control
              type="tel"
              placeholder="+33 6 12 34 56 78"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Form.Text className="text-muted">
              Format: +33 6 XX XX XX XX
            </Form.Text>
          </Form.Group>
        )}

        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="w-100"
        >
          {loading ? 'Inscription en cours...' : 'S\'abonner'}
        </Button>
      </Form>
    </div>
  );
}

export default SubscribeForm;
