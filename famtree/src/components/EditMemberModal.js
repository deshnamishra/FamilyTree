import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GENDERS = ['male', 'female', 'other'];

const EditMemberModal = ({ isOpen, onClose, onUpdate, onDelete, person, allMembers }) => {
    const [form, setForm] = useState({
        name: '', gender: 'other', birthYear: '', occupation: '', photo: '', photoFile: null,
        parents: [], spouse: null, children: []
    });

    useEffect(() => {
        if (person) {
            setForm({
                name: person.name || '',
                gender: person.gender || 'other',
                birthYear: person.birthYear || '',
                occupation: person.occupation || '',
                photo: person.photo || '',
                photoFile: null,
                parents: person.parents || [],
                spouse: person.spouse || null,
                children: person.children || []
            });
        }
    }, [person]);

    const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(person.id, form);
    };

    const handleDelete = () => {
        if (!person?.id) return;
        onDelete?.(person.id);
    };

    const label = { display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' };
    const field = {
        width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb',
        background: '#fafafa', fontSize: '13px', color: '#333', outline: 'none', boxSizing: 'border-box'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 200 }} />
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 201,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '20px', pointerEvents: 'none'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            style={{
                                width: '100%', maxWidth: '440px', maxHeight: '100%',
                                background: '#fff', borderRadius: '12px', padding: '22px',
                                border: '1px solid #e5e7eb', pointerEvents: 'auto',
                                display: 'flex', flexDirection: 'column',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexShrink: 0 }}>
                                <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#111' }}>Edit Family Member</h2>
                                <button onClick={onClose} style={{
                                    background: '#f3f4f6', border: 'none', borderRadius: '50%',
                                    width: '28px', height: '28px', color: '#6b7280', fontSize: '13px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>✕</button>
                            </div>

                            <div style={{ overflowY: 'auto', paddingRight: '4px' }}>
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div><span style={label}>Full Name *</span><input style={field} placeholder="e.g. Sarah Vance" value={form.name} onChange={e => set('name', e.target.value)} required /></div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <div><span style={label}>Gender</span>
                                            <select style={{ ...field, appearance: 'none' }} value={form.gender} onChange={e => set('gender', e.target.value)}>
                                                {GENDERS.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
                                            </select>
                                        </div>
                                        <div><span style={label}>Birth Year</span><input style={field} type="number" min="1800" placeholder="1990" value={form.birthYear} onChange={e => set('birthYear', e.target.value)} /></div>
                                    </div>
                                    <div><span style={label}>Occupation</span><input style={field} placeholder="e.g. Teacher" value={form.occupation} onChange={e => set('occupation', e.target.value)} /></div>
                                    <div><span style={label}>Photo URL</span><input style={field} placeholder="https://..." value={form.photo} onChange={e => set('photo', e.target.value)} /></div>

                                    <Chips label="Parents" options={allMembers.filter(m => m.id !== person.id)} value={form.parents} onChange={v => set('parents', v)} multi />
                                    <Chips label="Spouse" options={allMembers.filter(m => m.id !== person.id)} value={form.spouse} onChange={v => set('spouse', v)} />
                                    <Chips label="Children" options={allMembers.filter(m => m.id !== person.id)} value={form.children} onChange={v => set('children', v)} multi />

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px', marginBottom: '10px' }}>
                                        <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                            onClick={handleDelete}
                                            style={{
                                                padding: '10px', borderRadius: '8px',
                                                background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c',
                                                fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                                            }}>Delete Member</motion.button>
                                        <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                            style={{
                                                padding: '10px', borderRadius: '8px',
                                                background: '#2563eb', border: 'none', color: '#fff',
                                                fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                                            }}>Save Changes</motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

const Chips = ({ label, options, value, onChange, multi = false }) => {
    const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '6px' };

    const toggle = (id) => {
        if (multi) {
            const current = value || [];
            if (current.includes(id)) onChange(current.filter(x => x !== id));
            else onChange([...current, id]);
        } else {
            if (value === id) onChange(null);
            else onChange(id);
        }
    };

    return (
        <div>
            <span style={labelStyle}>{label}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {options.map(opt => {
                    const isSelected = multi ? (value || []).includes(opt.id) : value === opt.id;
                    return (
                        <button key={opt.id} type="button" onClick={() => toggle(opt.id)}
                            style={{
                                padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer',
                                border: '1px solid', transition: 'all 0.2s',
                                background: isSelected ? '#eff6ff' : '#fff',
                                borderColor: isSelected ? '#2563eb' : '#e5e7eb',
                                color: isSelected ? '#2563eb' : '#4b5563',
                                fontWeight: isSelected ? 600 : 400,
                            }}
                        >{opt.name}</button>
                    );
                })}
                {options.length === 0 && <span style={{ fontSize: '11px', color: '#9ca3af', fontStyle: 'italic' }}>No members available</span>}
            </div>
        </div>
    );
};

export default EditMemberModal;
