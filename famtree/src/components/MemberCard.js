// src/components/MemberCard.js
import React from 'react';
import './PersonCard.css';

function MemberCard({ person, onClick }) {
  return (
    <div className="person-card" onClick={onClick}>
      <div className="person-name">{person.name}</div>
      <div className="person-details">
        {person.birthYear} - {person.deathYear || 'Present'}
      </div>
    </div>
  );
}

export default MemberCard;