import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Form, Modal } from 'react-bootstrap';
import { annonceService } from '../services/api';
import AnnonceCard from '../components/AnnonceCard';
import SubscribeForm from '../components/SubscribeForm';

function Home() {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categorie, setCategorie] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);

  const fetchAnnonces = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 9
      });

      if (search) params.append('search', search);
      if (categorie) params.append('categorie', categorie);

      const response = await annonceService.getAll(params);
      setAnnonces(response.data.annonces);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setLoading(false);
    }
  }, [search, categorie, currentPage]);

  useEffect(() => {
    fetchAnnonces();
  }, [fetchAnnonces]);



  const handleAnnonceClick = (annonce) => {
    setSelectedAnnonce(annonce);
  };

  return (
    <div>
      <Row className="mb-4">
        <Col md={8}>
          <h1 className="mb-4">Annonces Publiques</h1>
          
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Select
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value)}
                >
                  <option value="">Toutes les catégories</option>
                  <option value="Général">Général</option>
                  <option value="Événement">Événement</option>
                  <option value="Urgence">Urgence</option>
                  <option value="Information">Information</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {loading ? (
            <p>Chargement...</p>
          ) : (
            <Row>
              {annonces.map((annonce) => (
                <Col key={annonce._id} md={6} lg={4} className="mb-4">
                  <div onClick={() => handleAnnonceClick(annonce)} style={{ cursor: 'pointer' }}>
                    <AnnonceCard annonce={annonce} />
                  </div>
                </Col>
              ))}
            </Row>
          )}

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </Col>
        
        <Col md={4}>
          <SubscribeForm />
        </Col>
      </Row>

      {/* Modal for full annonce view */}
      <Modal
        show={!!selectedAnnonce}
        onHide={() => setSelectedAnnonce(null)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedAnnonce?.titre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAnnonce?.image && (
            <img
              src={selectedAnnonce.image}
              alt={selectedAnnonce.titre}
              className="img-fluid mb-3"
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            />
          )}
          <p className="text-muted">
            Publié le {new Date(selectedAnnonce?.date).toLocaleDateString()}
          </p>
          <p>{selectedAnnonce?.contenu}</p>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Home;
