/**
 * api.js — Frontend API service layer.
 * Handles trees and family members with field mapping.
 */
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const api = axios.create({ baseURL: API_BASE, timeout: 10000 });

// ── Field mappers ────────────────────────────────────────────────────────────

function toFrontend(doc) {
    if (!doc) return null;
    return {
        id: doc._id,
        name: doc.name,
        gender: doc.gender,
        birthYear: doc.birthYear || (doc.birthDate ? new Date(doc.birthDate).getFullYear() : null),
        deathYear: doc.deathYear || null,
        occupation: doc.occupation || null,
        photo: doc.photo || null,
        spouse: doc.partner?._id || doc.partner || null,
        parents: (doc.parents || []).map(p => (typeof p === 'object' ? p._id : p)),
        children: (doc.children || []).map(c => (typeof c === 'object' ? c._id : c)),
        treeId: doc.treeId || null,
    };
}

function toBackend(data) {
    const body = { name: data.name, gender: data.gender };
    if (data.treeId) body.treeId = data.treeId;
    if (data.birthYear) body.birthYear = parseInt(data.birthYear);
    if (data.deathYear) body.deathYear = parseInt(data.deathYear);
    if (data.occupation) body.occupation = data.occupation;
    if (data.photo) body.photo = data.photo;
    if (data.spouse) body.partner = data.spouse;
    if (data.parents?.length > 0) body.parents = data.parents;
    if (data.children?.length > 0) body.children = data.children;
    return body;
}

// ── Trees API ────────────────────────────────────────────────────────────────

export async function fetchAllTrees() {
    const res = await api.get('/api/trees');
    return res.data || [];
}

export async function createTree(name, description = '') {
    const res = await api.post('/api/trees', { name, description });
    return res.data;
}

export async function deleteTree(id) {
    await api.delete(`/api/trees/${id}`);
}

// ── Members API ──────────────────────────────────────────────────────────────

export async function fetchAllMembers(treeId) {
    const params = { limit: 500 };
    if (treeId) params.treeId = treeId;
    const res = await api.get('/api/family', { params });
    const docs = res.data.data || res.data || [];
    return docs.map(toFrontend);
}

export async function createMember(data) {
    let body;
    let config = {};
    if (data.photoFile) {
        body = new FormData();
        const apiData = toBackend(data);
        for (const key in apiData) {
            if (Array.isArray(apiData[key])) {
                body.append(key, JSON.stringify(apiData[key]));
            } else if (apiData[key] !== null && apiData[key] !== undefined) {
                body.append(key, apiData[key]);
            }
        }
        body.append('photoFile', data.photoFile);
        config.headers = { 'Content-Type': 'multipart/form-data' };
    } else {
        body = toBackend(data);
    }
    const res = await api.post('/api/family', body, config);
    return toFrontend(res.data);
}

export async function updateMember(id, data) {
    let body;
    let config = {};
    if (data.photoFile) {
        body = new FormData();
        const apiData = toBackend(data);
        for (const key in apiData) {
            if (Array.isArray(apiData[key])) {
                body.append(key, JSON.stringify(apiData[key]));
            } else if (apiData[key] !== null && apiData[key] !== undefined) {
                body.append(key, apiData[key]);
            }
        }
        body.append('photoFile', data.photoFile);
        config.headers = { 'Content-Type': 'multipart/form-data' };
    } else {
        body = toBackend(data);
    }
    const res = await api.put(`/api/family/${id}`, body, config);
    return toFrontend(res.data);
}

export async function deleteMember(id) {
    await api.delete(`/api/family/${id}`);
}

export async function healthCheck() {
    const res = await api.get('/api/health');
    return res.data;
}

export default { fetchAllTrees, createTree, deleteTree, fetchAllMembers, createMember, updateMember, deleteMember, healthCheck };
