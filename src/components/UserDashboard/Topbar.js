
import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import calendar CSS

const styles = {
  topbar: {
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.07)',
    padding: '0 25px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  title: {
    margin: 0,
    fontSize: '1.6rem',
    color: '#3a3b45',
    fontWeight: 600,
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#4e73df',
    cursor: 'pointer',
  },
  rightContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    position: 'relative', // Needed for calendar positioning
  },
  iconButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    color: '#858796',
    cursor: 'pointer',
    position: 'relative',
  },
};

const Topbar = ({ activeSection, toggleSidebar }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const calendarRef = useRef(null);

  const getSectionTitle = (section) => {
    return section.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Effect to handle clicks outside the calendar to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarRef]);

  return (
    <header style={styles.topbar}>
      <div style={styles.leftContent}>
        <button onClick={toggleSidebar} style={styles.toggleButton}>
          <i className="fas fa-bars"></i>
        </button>
        <h1 style={styles.title}>{getSectionTitle(activeSection)}</h1>
      </div>
      
      <div style={styles.rightContent}>
        <button style={styles.iconButton} onClick={() => setShowCalendar(!showCalendar)}>
          <i className="fas fa-calendar-alt"></i>
        </button>
        <button style={styles.iconButton}>
          <i className="fas fa-bell"></i>
        </button>

        {/* Conditionally render the calendar popup */}
        {showCalendar && (
          <div className="calendar-popup" ref={calendarRef}>
            <Calendar
              onChange={setCalendarDate}
              value={calendarDate}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;