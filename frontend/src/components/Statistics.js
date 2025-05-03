import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Statistics({ annonces }) {
  // Prepare data for category distribution
  const categoryData = {
    labels: ['Général', 'Événement', 'Urgence', 'Information'],
    datasets: [
      {
        label: 'Annonces par catégorie',
        data: [
          annonces.filter(a => a.categorie === 'Général').length,
          annonces.filter(a => a.categorie === 'Événement').length,
          annonces.filter(a => a.categorie === 'Urgence').length,
          annonces.filter(a => a.categorie === 'Information').length,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for monthly distribution
  const monthlyData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Annonces par mois',
        data: Array.from({ length: 12 }, (_, i) => 
          annonces.filter(a => new Date(a.date).getMonth() === i).length
        ),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="statistics-container">
      <h3 className="mb-4">Statistiques</h3>
      
      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Total des Annonces</Card.Title>
              <div className="d-flex align-items-center justify-content-center h-100">
                <h2>{annonces.length}</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Événements à venir</Card.Title>
              <div className="d-flex align-items-center justify-content-center h-100">
                <h2>
                  {annonces.filter(a => 
                    a.categorie === 'Événement' && 
                    new Date(a.date) > new Date()
                  ).length}
                </h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Alertes Urgentes Actives</Card.Title>
              <div className="d-flex align-items-center justify-content-center h-100">
                <h2>
                  {annonces.filter(a => 
                    a.categorie === 'Urgence' && 
                    new Date(a.date) > new Date()
                  ).length}
                </h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Distribution par Catégorie</Card.Title>
              <div style={{ height: '300px' }}>
                <Pie
                  data={categoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Distribution Mensuelle</Card.Title>
              <div style={{ height: '300px' }}>
                <Bar
                  data={monthlyData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Statistics;
