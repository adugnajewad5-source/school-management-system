import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * ChildSelector Component
 * Allows parents with multiple children to switch between them
 * Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5
 */
const ChildSelector = ({ children, selectedChild, onSelectChild }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Persist selected child in sessionStorage
  useEffect(() => {
    if (selectedChild) {
      sessionStorage.setItem('selectedChildId', selectedChild.id);
    }
  }, [selectedChild]);

  // Auto-select single child and hide dropdown
  useEffect(() => {
    if (children.length === 1 && !selectedChild) {
      onSelectChild(children[0]);
    }
  }, [children, selectedChild, onSelectChild]);

  // Hide dropdown if only one child
  if (children.length <= 1) {
    return null;
  }

  const handleSelectChild = (child) => {
    onSelectChild(child);
    setIsOpen(false);
  };

  return (
    <div className="child-selector">
      <button
        className="selector-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Select a child"
      >
        <span className="selector-label">
          {selectedChild ? selectedChild.name : 'Select Child'}
        </span>
        <ChevronDown
          size={20}
          className={`selector-icon ${isOpen ? 'open' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="selector-dropdown">
          {children.map(child => (
            <button
              key={child.id}
              className={`selector-option ${selectedChild?.id === child.id ? 'active' : ''}`}
              onClick={() => handleSelectChild(child)}
            >
              <span className="option-name">{child.name}</span>
              <span className="option-class">{child.class}</span>
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .child-selector {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .selector-button {
          width: 100%;
          padding: 0.75rem 1rem;
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-size: 1rem;
          color: var(--text-primary);
          transition: all 0.3s ease;
        }

        .selector-button:hover {
          border-color: var(--primary-color);
          background: var(--bg-primary);
        }

        .selector-label {
          font-weight: 500;
        }

        .selector-icon {
          transition: transform 0.3s ease;
        }

        .selector-icon.open {
          transform: rotate(180deg);
        }

        .selector-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-top: none;
          border-radius: 0 0 8px 8px;
          margin-top: -2px;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .selector-option {
          width: 100%;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s ease;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .selector-option:hover {
          background: var(--bg-primary);
        }

        .selector-option.active {
          background: var(--primary-color);
          color: white;
          font-weight: 600;
        }

        .option-name {
          font-weight: 500;
        }

        .option-class {
          font-size: 0.85rem;
          opacity: 0.7;
          margin-left: 0.5rem;
        }

        .selector-option.active .option-class {
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .selector-button {
            padding: 0.6rem 0.8rem;
            font-size: 0.95rem;
          }

          .selector-option {
            padding: 0.6rem 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ChildSelector;
