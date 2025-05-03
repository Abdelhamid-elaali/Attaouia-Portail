import React from 'react';
import { Card, Badge } from 'react-bootstrap';

function AnnonceCard({ annonce }) {
  const getCategoryColor = (categorie) => {
    switch (categorie) {
      case 'Urgence':
        return 'danger';
      case 'Événement':
        return 'success';
      case 'Information':
        return 'info';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="h-100 shadow-sm">
      {annonce.image && (
        <Card.Img
          variant="top"
          src={annonce.image}
          style={{ height: '200px', objectFit: 'cover' }}
        />
      )}
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge bg={getCategoryColor(annonce.categorie)}>
            {annonce.categorie}
          </Badge>
          <small className="text-muted">
            {new Date(annonce.date).toLocaleDateString()}
          </small>
        </div>
        <Card.Title>{annonce.titre}</Card.Title>
        <Card.Text>
          {annonce.contenu.length > 150
            ? `${annonce.contenu.substring(0, 150)}...`
            : annonce.contenu}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default AnnonceCard;
