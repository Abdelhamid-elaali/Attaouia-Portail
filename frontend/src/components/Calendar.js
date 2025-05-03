import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

function Calendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/annonces?categorie=Événement');
      const formattedEvents = response.data.annonces.map(event => ({
        id: event._id,
        title: event.titre,
        start: event.date,
        extendedProps: {
          description: event.contenu,
          category: event.categorie
        }
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  return (
    <div>
      <h2 className="mb-4">Calendrier des Événements</h2>
      
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          height="auto"
          locale="fr"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
          }}
        />
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedEvent?.extendedProps?.description}</p>
          <p className="text-muted">
            Date: {selectedEvent?.start.toLocaleDateString()}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Calendar;
