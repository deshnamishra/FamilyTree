import React from 'react';
import { motion } from 'framer-motion';

const PersonCard = ({ person, isSelected, onClick, onEdit, isMobile, style }) => {
  const hasChildren = person.children && person.children.length > 0;
  const initials = person.name.split(' ').map(n => n[0]).slice(0, 2).join('');
  const reportCount = (person.children || []).length;
  const cardWidth = isMobile ? 120 : 160;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onClick={(e) => { e.stopPropagation(); onClick(person.id); }}
      style={{
        position: 'absolute',
        cursor: 'pointer',
        zIndex: isSelected ? 15 : 10,
        ...style,
      }}
    >
      <motion.div
        whileHover={{ y: -3, boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}
        transition={{ duration: 0.2 }}
        style={{
          width: `${cardWidth}px`,
          background: '#fff',
          borderRadius: '10px',
          border: isSelected ? '2px solid #2563eb' : '1px solid #e5e7eb',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Edit Button */}
        <motion.button
          whileHover={{ scale: 1.1, background: '#f3f4f6' }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(person);
          }}
          style={{
            position: 'absolute', top: '6px', right: '6px',
            width: '24px', height: '24px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.8)', border: '1px solid #e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 5, color: '#6b7280', fontSize: '12px'
          }}
          title="Edit Member"
        >
          ✎
        </motion.button>

        {/* Top accent */}
        <div style={{ height: '3px', background: '#2563eb' }} />

        <div style={{
          padding: '14px 10px 10px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
        }}>
          {/* Avatar */}
          <div style={{ position: 'relative', marginBottom: '2px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              overflow: 'hidden', border: '1.5px solid #e5e7eb',
              background: '#f3f4f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {person.photo ? (
                <img src={person.photo} alt={person.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <span style={{ fontSize: '16px', color: '#2563eb', fontWeight: 700 }}>{initials}</span>
              )}
            </div>
            {reportCount > 0 && (
              <div style={{
                position: 'absolute', top: '-2px', right: '-5px',
                background: '#2563eb', color: '#fff',
                borderRadius: '50%', width: '18px', height: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '9px', fontWeight: 700, border: '2px solid #fff',
              }}>{reportCount}</div>
            )}
          </div>

          {/* Name */}
          <p style={{
            margin: 0, textAlign: 'center',
            color: '#2563eb', fontWeight: 600, fontSize: '12px', lineHeight: 1.3,
          }}>{person.name}</p>

          {/* Occupation */}
          {person.occupation && (
            <p style={{
              margin: 0, textAlign: 'center', color: '#6b7280',
              fontSize: '10px', lineHeight: 1.3,
              maxWidth: '140px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
            }}>{person.occupation}</p>
          )}

          {/* Year */}
          <p style={{ margin: 0, color: '#9ca3af', fontSize: '9.5px' }}>
            {person.birthYear}{person.deathYear ? ` – ${person.deathYear}` : ''}
          </p>
        </div>

        {/* Expand chevron */}
        {hasChildren && (
          <div style={{
            borderTop: '1px solid #f3f4f6', padding: '4px 0',
            display: 'flex', justifyContent: 'center', color: '#9ca3af', fontSize: '12px',
          }}>▾</div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PersonCard;
