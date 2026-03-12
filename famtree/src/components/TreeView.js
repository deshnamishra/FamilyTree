// src/components/TreeView.js
import React from 'react';
import TreeNode from './Treenode';
import './TreeView.css';

function TreeView({ treeData, onSelectPerson }) {
  return (
    <div className="tree-view">
      <TreeNode 
        node={treeData.root} 
        onSelect={onSelectPerson} 
      />
    </div>
  );
}

export default TreeView;