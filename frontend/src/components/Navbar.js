import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          Attaouia Portail
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              active={location.pathname === '/'}
            >
              Accueil
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/calendar"
              active={location.pathname === '/calendar'}
            >
              Calendrier
            </Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/admin"
                  active={location.pathname.startsWith('/admin')}
                >
                  Administration
                </Nav.Link>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                  className="ms-2"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              location.pathname !== '/admin/login' && (
                <Nav.Link
                  as={Link}
                  to="/admin/login"
                >
                  Connexion Admin
                </Nav.Link>
              )
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
