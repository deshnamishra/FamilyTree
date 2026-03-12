// src/components/TreeNode.js
import React from 'react';
import MemberCard from './MemberCard';
import './TreeNode.css';

function TreeNode({ node, onSelect }) {
  // Defensive check to avoid crashing if node or node.person is undefined
  if (!node || !node.person) return null;

  return (
    <div className="tree-node">
      <MemberCard 
        person={node.person} 
        onClick={() => onSelect(node.person)}
      />
      
      {/* Render children recursively if they exist */}
      {node.children && node.children.length > 0 && (
        <div className="children">
          {node.children.map(child => (
            <TreeNode 
              key={child.person?.id || Math.random()} // fallback key if person is missing
              node={child} 
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TreeNode;
