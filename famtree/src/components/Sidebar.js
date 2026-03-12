// src/components/Sidebar.js
import React from 'react';
import PersonCard from './PersonCard';
import './Sidebar.css';

function Sidebar({ person }) {
  if (!person) return null;

  return (
    <div className="sidebar">
      <PersonCard person={person} expanded={true} />
      <div className="person-details">
        <h3>Details</h3>
        <p>Occupation: {person.occupation}</p>
        {/* More details here */}
      </div>
    </div>
  );
}

export default Sidebar;