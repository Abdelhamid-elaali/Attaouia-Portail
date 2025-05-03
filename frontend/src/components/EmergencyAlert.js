import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { emergencyService } from '../services/api';

function EmergencyAlert() {
  const [alertData, setAlertData] = useState({
    title: '',
    message: '',
    notificationType: 'both', // 'email', 'sms', or 'both'
    priority: 'high'
  });
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (preview) {
      setPreview(false);
      return;
    }

    setLoading(true);
    try {
      await emergencyService.sendAlert(alertData);
      setStatus({
        type: 'success',
        message: 'Alerte envoyée avec succès !'
      });
      setAlertData({
        title: '',
        message: '',
        notificationType: 'both',
        priority: 'high'
      });
    } catch (error) {
      setStatus({
        type: 'danger',
        message: 'Erreur lors de l\'envoi de l\'alerte.'
      });
    }
    setLoading(false);
  };

  return (
    <Card>
      <Card.Body>
        <h3 className="mb-4">Envoyer une Alerte d'Urgence</h3>

        {status.message && (
          <Alert
            variant={status.type}
            onClose={() => setStatus({ type: '', message: '' })}
            dismissible
          >
            {status.message}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Titre de l'alerte</Form.Label>
            <Form.Control
              type="text"
              value={alertData.title}
              onChange={(e) => setAlertData({ ...alertData, title: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={alertData.message}
              onChange={(e) => setAlertData({ ...alertData, message: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type de notification</Form.Label>
            <Form.Select
              value={alertData.notificationType}
              onChange={(e) => setAlertData({
                ...alertData,
                notificationType: e.target.value
              })}
            >
              <option value="both">Email et SMS</option>
              <option value="email">Email uniquement</option>
              <option value="sms">SMS uniquement</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Priorité</Form.Label>
            <Form.Select
              value={alertData.priority}
              onChange={(e) => setAlertData({
                ...alertData,
                priority: e.target.value
              })}
            >
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </Form.Select>
          </Form.Group>

          {preview ? (
            <div className="preview-section mb-4">
              <h4>Prévisualisation</h4>
              <Card className="bg-light">
                <Card.Body>
                  <h5>{alertData.title}</h5>
                  <p>{alertData.message}</p>
                  <small className="text-muted">
                    Envoi par: {alertData.notificationType === 'both'
                      ? 'Email et SMS'
                      : alertData.notificationType === 'email'
                        ? 'Email'
                        : 'SMS'}
                  </small>
                </Card.Body>
              </Card>
            </div>
          ) : null}

          <div className="d-flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setPreview(!preview)}
              disabled={loading}
            >
              {preview ? 'Modifier' : 'Prévisualiser'}
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer l\'alerte'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default EmergencyAlert;
