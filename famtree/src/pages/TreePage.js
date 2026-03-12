import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { familyTrees as fallbackData, createFamilyMap } from '../data/familyTrees';
import { computeFocusedLayout } from '../components/TreeLayout';
import PersonCard from '../components/PersonCard';
import ConnectionLines from '../components/ConnectionLines';
import AddMemberModal from '../components/AddMemberModal';
import EditMemberModal from '../components/EditMemberModal';
import { fetchAllMembers, createMember, updateMember } from '../services/api';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
  return width;
}

function TreePage() {
  const { treeId } = useParams();
  const navigate = useNavigate();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;
  const CANVAS_W = isMobile ? Math.max(windowWidth * 2, 800) : 1800;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const familyMap = useMemo(() => createFamilyMap(members), [members]);

  const [focusedId, setFocusedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  // ── Fetch data ─────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true); setError(null);
      try {
        const data = await fetchAllMembers(treeId);
        if (!cancelled) {
          if (data.length > 0) {
            setMembers(data); setUsingFallback(false);
            const root = data.find(m => !m.parents || m.parents.length === 0) || data[0];
            setFocusedId(root.id);
          } else {
            // Tree has no members yet
            setMembers([]); setUsingFallback(false); setFocusedId(null);
          }
        }
      } catch (err) {
        if (!cancelled) {
          if (!treeId) {
            setMembers(fallbackData); setUsingFallback(true); setFocusedId('c1');
            setError('Backend unavailable — showing demo data');
          } else {
            setMembers([]); setUsingFallback(false); setError('Failed to load tree data');
          }
        }
      } finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [treeId]);

  const layout = useMemo(
    () => focusedId ? computeFocusedLayout(focusedId, familyMap, CANVAS_W) : { positions: {}, edges: [], visibleIds: [], parentOfFocused: null },
    [focusedId, familyMap]
  );
  const focusedPerson = focusedId ? familyMap.get(focusedId) : null;

  const navigateTo = useCallback((id) => { if (id !== focusedId) setFocusedId(id); }, [focusedId]);
  const navigateUp = useCallback(() => { if (layout.parentOfFocused) setFocusedId(layout.parentOfFocused); }, [layout.parentOfFocused]);

  const breadcrumbPath = useMemo(() => {
    if (!focusedId) return [];
    const path = []; let cur = focusedId; const visited = new Set();
    while (cur && !visited.has(cur)) {
      visited.add(cur);
      const p = familyMap.get(cur); if (!p) break;
      path.unshift({ id: cur, name: p.name });
      cur = (p.parents || [])[0] || null;
    }
    return path;
  }, [focusedId, familyMap]);

  const searchResults = searchQuery.trim()
    ? members.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8) : [];

  const handleAddMember = useCallback(async (data) => {
    if (usingFallback) {
      const id = 'u_' + Date.now();
      const nm = { ...data, id };
      setMembers(prev => {
        let u = [...prev, nm];
        if (nm.spouse) u = u.map(m => m.id === nm.spouse && !m.spouse ? { ...m, spouse: id } : m);
        nm.parents.forEach(pid => { u = u.map(m => m.id === pid ? { ...m, children: [...(m.children || []), id] } : m); });
        (nm.children || []).forEach(cid => { u = u.map(m => m.id === cid ? { ...m, parents: [...(m.parents || []), id] } : m); });
        return u;
      });
      if (!focusedId) setFocusedId(id);
      return;
    }
    try {
      // Add treeId to the data
      const memberData = { ...data, treeId };
      const created = await createMember(memberData);
      const refreshed = await fetchAllMembers(treeId);
      setMembers(refreshed);
      if (created?.id) setFocusedId(created.id);
    } catch (err) {
      console.error('Failed to add member:', err);
      alert('Failed to add member.');
    }
  }, [usingFallback, treeId, focusedId]);

  const handleUpdateMember = useCallback(async (id, data) => {
    if (usingFallback) {
      setMembers(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
      setShowEditModal(false);
      return;
    }
    try {
      await updateMember(id, { ...data, treeId });
      const refreshed = await fetchAllMembers(treeId);
      setMembers(refreshed);
      setShowEditModal(false);
    } catch (err) {
      console.error('Failed to update member:', err);
      alert('Failed to update member.');
    }
  }, [usingFallback, treeId]);

  const openEdit = useCallback((person) => {
    setEditingMember(person);
    setShowEditModal(true);
  }, []);

  // ── Loading ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', fontFamily: "'Inter',sans-serif" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
          style={{ width: '36px', height: '36px', border: '3px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%' }} />
      </div>
    );
  }

  // ── Empty tree ─────────────────────────────────────────────────────────
  if (members.length === 0 && !usingFallback) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#fafafa', fontFamily: "'Inter',sans-serif", display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', height: '52px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            style={{ background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontSize: '12px', color: '#374151' }}>← Back</motion.button>
          <span style={{ fontWeight: 700, fontSize: '15px', color: '#111' }}>🌳 Family Tree</span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>👤</div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>No members yet</h2>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>Add your first family member to start building.</p>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowModal(true)}
              style={{ background: '#2563eb', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 600, padding: '10px 20px', cursor: 'pointer' }}>
              + Add First Member
            </motion.button>
          </motion.div>
        </div>
        <AddMemberModal isOpen={showModal} onClose={() => setShowModal(false)} onAdd={handleAddMember} allMembers={members} />
        {editingMember && <EditMemberModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} onUpdate={handleUpdateMember} person={editingMember} allMembers={members} />}
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#fafafa', display: 'flex', flexDirection: 'column', fontFamily: "'Inter',sans-serif", overflow: 'hidden' }}>

      {/* Header */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e5e7eb',
        padding: isMobile ? '8px 12px' : '0 24px', height: 'auto', minHeight: '52px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 100,
        flexWrap: isMobile ? 'wrap' : 'nowrap', gap: isMobile ? '6px' : '0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '10px' }}>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            style={{ background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontSize: '12px', color: '#374151' }}>← Back</motion.button>
          <span style={{ fontSize: isMobile ? '16px' : '20px' }}>🌳</span>
          <span style={{ fontWeight: 700, fontSize: isMobile ? '13px' : '15px', color: '#111' }}>Family Tree</span>
          <span style={{
            padding: '2px 8px', borderRadius: '8px', fontSize: '9px', fontWeight: 600,
            background: usingFallback ? '#fef3c7' : '#d1fae5',
            color: usingFallback ? '#b45309' : '#065f46',
          }}>{usingFallback ? 'Demo' : 'Live'}</span>
        </div>

        {/* Search - hidden on mobile, shown as icon */}
        {!isMobile && (
          <div style={{ position: 'relative', width: '280px' }}>
            <input placeholder="Search members..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
              style={{
                width: '100%', padding: '7px 14px', borderRadius: '8px',
                border: '1px solid #e5e7eb', background: '#fafafa',
                fontSize: '13px', color: '#333', outline: 'none',
              }}
            />
            {searchOpen && searchResults.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                background: '#fff', borderRadius: '8px', marginTop: '4px', padding: '4px',
                border: '1px solid #e5e7eb', zIndex: 200, maxHeight: '200px', overflowY: 'auto',
              }}>
                {searchResults.map(p => (
                  <div key={p.id}
                    onMouseDown={() => { navigateTo(p.id); setSearchQuery(''); setSearchOpen(false); }}
                    style={{ padding: '7px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#333' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontWeight: 600, color: '#2563eb' }}>{p.name}</span>
                    {p.occupation && <span style={{ color: '#9ca3af', marginLeft: '8px' }}>{p.occupation}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '12px' }}>
          {focusedPerson && !isMobile && (
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              Viewing: <strong style={{ color: '#111' }}>{focusedPerson.name}</strong>
            </span>
          )}
          {focusedPerson && isMobile && (
            <span style={{ fontSize: '10px', color: '#6b7280' }}>
              <strong style={{ color: '#111' }}>{focusedPerson.name}</strong>
            </span>
          )}
          {isMobile && (
            <motion.button whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontSize: '12px', color: '#374151' }}>
              ☰
            </motion.button>
          )}
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => setShowModal(true)}
            style={{ background: '#2563eb', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 600, padding: '7px 14px', cursor: 'pointer' }}>
            + Add
          </motion.button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#fef3c7', borderBottom: '1px solid #fde68a', padding: '5px 24px', fontSize: '11px', color: '#92400e', display: 'flex', alignItems: 'center' }}>
          ⚠️ {error}
          <button onClick={() => setError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#92400e', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* Mobile search bar */}
      {isMobile && (
        <div style={{ padding: '6px 12px', background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
          <input placeholder="Search members..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            style={{
              width: '100%', padding: '7px 12px', borderRadius: '8px',
              border: '1px solid #e5e7eb', background: '#fafafa',
              fontSize: '13px', color: '#333', outline: 'none',
            }}
          />
          {searchOpen && searchResults.length > 0 && (
            <div style={{
              position: 'absolute', left: '12px', right: '12px',
              background: '#fff', borderRadius: '8px', marginTop: '4px', padding: '4px',
              border: '1px solid #e5e7eb', zIndex: 200, maxHeight: '200px', overflowY: 'auto',
            }}>
              {searchResults.map(p => (
                <div key={p.id}
                  onMouseDown={() => { navigateTo(p.id); setSearchQuery(''); setSearchOpen(false); }}
                  style={{ padding: '7px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#333' }}
                >
                  <span style={{ fontWeight: 600, color: '#2563eb' }}>{p.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        <div style={{ flex: 1, overflow: 'auto', position: 'relative', background: '#fafafa', WebkitOverflowScrolling: 'touch' }}>
          {layout.parentOfFocused && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ position: 'sticky', top: '10px', zIndex: 50, display: 'flex', justifyContent: 'center' }}>
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }}
                onClick={navigateUp}
                style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff', border: '1px solid #d1d5db', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#6b7280' }}
                title={`Go up to ${familyMap.get(layout.parentOfFocused)?.name}`}>▴</motion.button>
            </motion.div>
          )}
          <div style={{ width: `${CANVAS_W}px`, minHeight: isMobile ? '400px' : '600px', position: 'relative', margin: '0 auto', paddingTop: '16px', paddingBottom: '80px' }}>
            <ConnectionLines edges={layout.edges} positions={layout.positions} familyMap={familyMap} />
            <AnimatePresence mode="popLayout">
              {layout.visibleIds.map(id => {
                const person = familyMap.get(id);
                const pos = layout.positions[id];
                if (!person || !pos) return null;
                return <PersonCard key={id} person={person} isSelected={id === focusedId} onClick={navigateTo} onEdit={openEdit} isMobile={isMobile} style={{ left: `${pos.x}px`, top: `${pos.y}px` }} />;
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar - overlay on mobile, fixed on desktop */}
        {(!isMobile || sidebarOpen) && (
          <div style={{
            width: isMobile ? '240px' : '200px',
            flexShrink: 0,
            background: '#fff',
            borderLeft: '1px solid #e5e7eb',
            padding: '16px 14px',
            overflowY: 'auto',
            ...(isMobile ? {
              position: 'absolute', top: 0, right: 0, bottom: 0,
              zIndex: 150, boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
            } : {}),
          }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(false)}
                style={{ float: 'right', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#6b7280', marginBottom: '8px' }}>✕</button>
            )}
            <h3 style={{ margin: '0 0 14px', fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hierarchy</h3>
            {breadcrumbPath.map((item, i) => (
              <div key={item.id} style={{ marginBottom: '3px' }}>
                {i > 0 && <div style={{ borderLeft: '1.5px solid #e5e7eb', marginLeft: `${(i - 1) * 10 + 5}px`, height: '12px' }} />}
                <div onClick={() => { navigateTo(item.id); if (isMobile) setSidebarOpen(false); }} style={{ paddingLeft: `${i * 10}px`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: item.id === focusedId ? '#2563eb' : '#d1d5db', flexShrink: 0 }} />
                  <span style={{ color: item.id === focusedId ? '#2563eb' : '#6b7280', fontSize: '11px', fontWeight: item.id === focusedId ? 700 : 500 }}>{item.name}</span>
                </div>
              </div>
            ))}
            {(focusedPerson?.children || []).length > 0 && (
              <>
                <div style={{ borderLeft: '1.5px solid #e5e7eb', marginLeft: `${(breadcrumbPath.length - 1) * 10 + 5}px`, height: '12px' }} />
                {focusedPerson.children.map(cid => {
                  const child = familyMap.get(cid);
                  if (!child) return null;
                  return (
                    <div key={cid} style={{ marginBottom: '3px' }}>
                      <div onClick={() => { navigateTo(cid); if (isMobile) setSidebarOpen(false); }} style={{ paddingLeft: `${breadcrumbPath.length * 10}px`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#d1d5db', flexShrink: 0 }} />
                        <span style={{ color: '#2563eb', fontSize: '10px', fontWeight: 500 }}>{child.name}</span>
                      </div>
                    </div>
                  );
                })}
                <div style={{ marginTop: '12px', padding: '6px', background: '#f9fafb', borderRadius: '6px', textAlign: 'center' }}>
                  <span style={{ color: '#6b7280', fontSize: '10px' }}>{focusedPerson.children.length} children</span>
                </div>
              </>
            )}
          </div>
        )}
        {/* Sidebar overlay backdrop on mobile */}
        {isMobile && sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 140 }} />
        )}
      </div>

      <AddMemberModal isOpen={showModal} onClose={() => setShowModal(false)} onAdd={handleAddMember} allMembers={members} />
      {editingMember && <EditMemberModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} onUpdate={handleUpdateMember} person={editingMember} allMembers={members} />}
    </div>
  );
}

export default TreePage;
