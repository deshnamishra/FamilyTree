import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GENDERS = ['male', 'female', 'other'];

const field = {
    width: '100%', background: '#fafafa', border: '1px solid #e5e7eb',
    borderRadius: '8px', color: '#333', padding: '8px 12px', fontSize: '13px',
    outline: 'none', boxSizing: 'border-box',
};

const label = {
    display: 'block', color: '#6b7280', fontSize: '11px',
    marginBottom: '4px', fontWeight: 600,
};

const Chips = ({ label: lbl, options, value, onChange, multi }) => (
    <div>
        <span style={label}>{lbl}</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', maxHeight: '80px', overflowY: 'auto' }}>
            {!multi && (
                <button type="button" onClick={() => onChange(null)}
                    style={{
                        padding: '3px 9px', borderRadius: '14px', fontSize: '10px', cursor: 'pointer',
                        border: !value ? '1.5px solid #2563eb' : '1px solid #e5e7eb',
                        background: !value ? '#eff6ff' : '#fff', color: !value ? '#2563eb' : '#6b7280',
                    }}>None</button>
            )}
            {options.map(p => {
                const sel = multi ? value.includes(p.id) : value === p.id;
                return (
                    <button key={p.id} type="button"
                        onClick={() => multi
                            ? onChange(sel ? value.filter(id => id !== p.id) : [...value, p.id])
                            : onChange(sel ? null : p.id)
                        }
                        style={{
                            padding: '3px 9px', borderRadius: '14px', fontSize: '10px', cursor: 'pointer',
                            border: sel ? '1.5px solid #2563eb' : '1px solid #e5e7eb',
                            background: sel ? '#eff6ff' : '#fff', color: sel ? '#2563eb' : '#6b7280',
                        }}>{p.name}</button>
                );
            })}
        </div>
    </div>
);

const AddMemberModal = ({ isOpen, onClose, onAdd, allMembers }) => {
    const [form, setForm] = useState({
        name: '', gender: 'male', birthYear: '', occupation: '', photo: '', photoFile: null,
        parents: [], spouse: null, children: [],
    });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        onAdd({
            name: form.name.trim(), gender: form.gender,
            birthYear: form.birthYear ? parseInt(form.birthYear) : null,
            occupation: form.occupation.trim() || null,
            photo: form.photo.trim() || (form.photoFile ? '' : `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(form.name)}&backgroundColor=b6e3f4`),
            photoFile: form.photoFile,
            parents: form.parents, spouse: form.spouse, children: form.children,
        });
        setForm({ name: '', gender: 'male', birthYear: '', occupation: '', photo: '', photoFile: null, parents: [], spouse: null, children: [] });
        onClose();
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
                                <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#111' }}>Add Family Member</h2>
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

                                    <div>
                                        <span style={label}>Photo</span>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <input type="file" accept="image/*" onChange={e => {
                                                if (e.target.files[0]) {
                                                    set('photoFile', e.target.files[0]);
                                                    set('photo', ''); // Clear URL if file selected
                                                }
                                            }} style={{ fontSize: '12px', color: '#6b7280' }} />
                                            <span style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center' }}>- OR -</span>
                                            <input style={field} placeholder="Photo URL (e.g. https://...)" value={form.photo} disabled={!!form.photoFile} onChange={e => set('photo', e.target.value)} />
                                        </div>
                                    </div>

                                    <Chips label="Parents" options={allMembers} value={form.parents} onChange={v => set('parents', v)} multi />
                                    <Chips label="Spouse" options={allMembers} value={form.spouse} onChange={v => set('spouse', v)} />
                                    <Chips label="Children" options={allMembers} value={form.children} onChange={v => set('children', v)} multi />
                                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                        style={{
                                            marginTop: '4px', marginBottom: '10px', padding: '10px', borderRadius: '8px',
                                            background: '#2563eb', border: 'none', color: '#fff',
                                            fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                                        }}>Add to Tree</motion.button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddMemberModal;
