import React, { useState, useEffect } from 'react';
import { Container, Nav, Tab, Form, Button, Table, Modal } from 'react-bootstrap';
import { annonceService } from '../services/api';
import Statistics from '../components/Statistics';
import EmergencyAlert from '../components/EmergencyAlert';
import SupervisorManagement from '../components/SupervisorManagement';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const { user } = useAuth();
  const [annonces, setAnnonces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAnnonce, setCurrentAnnonce] = useState({
    titre: '',
    contenu: '',
    categorie: 'Général',
    date: new Date().toISOString().split('T')[0]
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    try {
      const response = await annonceService.getAll();
      setAnnonces(response.data.annonces);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await annonceService.update(currentAnnonce._id, currentAnnonce);
      } else {
        await annonceService.create(currentAnnonce);
      }
      handleCloseModal();
      fetchAnnonces();
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        await annonceService.delete(id);
        fetchAnnonces();
      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
    }
  };

  const handleEdit = (annonce) => {
    setCurrentAnnonce(annonce);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentAnnonce({
      titre: '',
      contenu: '',
      categorie: 'Général',
      date: new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <Container>
      <h2 className="mb-4">Panneau d'Administration</h2>
      <Tab.Container id="admin-tabs" defaultActiveKey="annonces">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="annonces">Gestion des Annonces</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="statistics">Statistiques</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="emergency">Alerte d'Urgence</Nav.Link>
          </Nav.Item>
          {user?.role === 'admin' && (
            <Nav.Item>
              <Nav.Link eventKey="supervisors">Gestion des Superviseurs</Nav.Link>
            </Nav.Item>
          )}
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="annonces">
            <div className="d-flex justify-content-end mb-3">
              <Button onClick={() => setShowModal(true)}>Nouvelle Annonce</Button>
            </div>

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Catégorie</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {annonces.map((annonce) => (
                  <tr key={annonce._id}>
                    <td>{annonce.titre}</td>
                    <td>{annonce.categorie}</td>
                    <td>{new Date(annonce.date).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(annonce)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(annonce._id)}
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab.Pane>
          <Tab.Pane eventKey="statistics">
            <Statistics annonces={annonces} />
          </Tab.Pane>
          <Tab.Pane eventKey="emergency">
            <EmergencyAlert />
          </Tab.Pane>
          {user?.role === 'admin' && (
            <Tab.Pane eventKey="supervisors">
              <SupervisorManagement />
            </Tab.Pane>
          )}
        </Tab.Content>
      </Tab.Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Titre</Form.Label>
              <Form.Control
                type="text"
                value={currentAnnonce.titre}
                onChange={(e) =>
                  setCurrentAnnonce({ ...currentAnnonce, titre: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contenu</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentAnnonce.contenu}
                onChange={(e) =>
                  setCurrentAnnonce({ ...currentAnnonce, contenu: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Catégorie</Form.Label>
              <Form.Select
                value={currentAnnonce.categorie}
                onChange={(e) =>
                  setCurrentAnnonce({
                    ...currentAnnonce,
                    categorie: e.target.value
                  })
                }
              >
                <option value="Général">Général</option>
                <option value="Événement">Événement</option>
                <option value="Urgence">Urgence</option>
                <option value="Information">Information</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={currentAnnonce.date}
                onChange={(e) =>
                  setCurrentAnnonce({ ...currentAnnonce, date: e.target.value })
                }
                required
              />
            </Form.Group>

            <div className="text-end">
              <Button variant="secondary" className="me-2" onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                {isEditing ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminDashboard;
