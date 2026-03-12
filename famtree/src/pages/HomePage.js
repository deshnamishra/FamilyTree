import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fetchAllTrees, createTree, deleteTree } from '../services/api';

function HomePage() {
  const navigate = useNavigate();
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    loadTrees();
  }, []);

  async function loadTrees() {
    setLoading(true);
    try {
      const data = await fetchAllTrees();
      setTrees(data);
    } catch (err) {
      console.error('Failed to load trees:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await createTree(newName.trim(), newDesc.trim());
      setNewName(''); setNewDesc(''); setShowCreate(false);
      loadTrees();
    } catch (err) {
      alert('Failed to create tree');
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteTree(id);
      loadTrees();
    } catch (err) {
      alert('Failed to delete tree');
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#fafafa',
      fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column',
    }}>

      {/* Header */}
      <nav style={{
        background: '#fff', borderBottom: '1px solid #e5e7eb',
        padding: '0 32px', height: '52px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>🌳</span>
          <span style={{ fontWeight: 700, fontSize: '16px', color: '#111' }}>FamTree</span>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowCreate(true)}
          style={{
            background: '#2563eb', border: 'none', borderRadius: '8px',
            color: '#fff', fontSize: '12px', fontWeight: 600,
            padding: '8px 16px', cursor: 'pointer',
          }}>+ New Tree</motion.button>
      </nav>

      {/* Main */}
      <div style={{ flex: 1, maxWidth: '800px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>

        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111', marginBottom: '4px' }}>Your Family Trees</h1>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>Select a tree to explore or create a new one.</p>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              style={{ width: '28px', height: '28px', border: '3px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', margin: '0 auto' }} />
          </div>
        )}

        {/* Empty state */}
        {!loading && trees.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center', padding: '48px 24px',
              background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px',
            }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌱</div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>No trees yet</h3>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>Create your first family tree to get started.</p>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowCreate(true)}
              style={{
                background: '#2563eb', border: 'none', borderRadius: '8px',
                color: '#fff', fontSize: '12px', fontWeight: 600, padding: '8px 18px', cursor: 'pointer',
              }}>+ Create Tree</motion.button>
          </motion.div>
        )}

        {/* Tree list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <AnimatePresence>
            {trees.map((tree, i) => (
              <motion.div key={tree._id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.05 }}
              >
                <motion.div whileHover={{ y: -2 }}
                  style={{
                    background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px',
                    padding: '16px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/tree/${tree._id}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '20px',
                    }}>🌳</div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#111' }}>{tree.name}</h3>
                      {tree.description && (
                        <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#9ca3af' }}>{tree.description}</p>
                      )}
                      <p style={{ margin: '2px 0 0', fontSize: '10px', color: '#d1d5db' }}>
                        Created {new Date(tree.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation(); navigate(`/tree/${tree._id}`); }}
                      style={{
                        background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px',
                        color: '#2563eb', fontSize: '11px', fontWeight: 600, padding: '5px 12px', cursor: 'pointer',
                      }}>Open</motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation(); handleDelete(tree._id, tree.name); }}
                      style={{
                        background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px',
                        color: '#dc2626', fontSize: '11px', fontWeight: 600, padding: '5px 10px', cursor: 'pointer',
                      }}>✕</motion.button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Create Tree Modal */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCreate(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 200 }} />
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                zIndex: 201, width: '90%', maxWidth: '380px',
                background: '#fff', borderRadius: '12px', padding: '24px',
                border: '1px solid #e5e7eb',
              }}
            >
              <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#111' }}>
                Create New Tree
              </h2>
              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>
                    Tree Name *
                  </label>
                  <input
                    value={newName} onChange={e => setNewName(e.target.value)} required
                    placeholder="e.g. Johnson Family"
                    style={{
                      width: '100%', padding: '8px 12px', borderRadius: '8px',
                      border: '1px solid #e5e7eb', background: '#fafafa',
                      fontSize: '13px', color: '#333', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>
                    Description
                  </label>
                  <input
                    value={newDesc} onChange={e => setNewDesc(e.target.value)}
                    placeholder="Optional description"
                    style={{
                      width: '100%', padding: '8px 12px', borderRadius: '8px',
                      border: '1px solid #e5e7eb', background: '#fafafa',
                      fontSize: '13px', color: '#333', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <motion.button type="button" whileTap={{ scale: 0.97 }}
                    onClick={() => setShowCreate(false)}
                    style={{
                      flex: 1, padding: '9px', borderRadius: '8px',
                      background: '#fff', border: '1px solid #d1d5db',
                      color: '#374151', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    }}>Cancel</motion.button>
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    style={{
                      flex: 1, padding: '9px', borderRadius: '8px',
                      background: '#2563eb', border: 'none',
                      color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    }}>Create</motion.button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid #e5e7eb', padding: '14px 32px',
        textAlign: 'center', fontSize: '11px', color: '#9ca3af',
      }}>FamTree — Built with React & MongoDB</div>
    </div>
  );
}

export default HomePage;