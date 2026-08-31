import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

export interface SelectOption<T = string | number> {
  value: T;
  label: string;
  subLabel?: string;
  badge?: string;
  group?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps<T = string | number> {
  id?: string;
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function CustomSelect<T extends string | number>({
  id,
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  className = '',
  disabled = false,
  size = 'md'
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Calculate and update portal position
  const updatePosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownEstimatedHeight = 260;
    const showAbove = spaceBelow < dropdownEstimatedHeight && spaceAbove > spaceBelow;

    setDropdownStyle({
      position: 'fixed',
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      top: showAbove ? undefined : `${rect.bottom + 4}px`,
      bottom: showAbove ? `${window.innerHeight - rect.top + 4}px` : undefined,
      zIndex: 9999
    });
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen]);

  // Update position on window resize and any parent scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (optValue: T) => {
    onChange(optValue);
    setIsOpen(false);
  };

  // Group options if any option has a group property
  const hasGroups = options.some((opt) => opt.group);
  const groupedOptions = hasGroups
    ? options.reduce<Record<string, SelectOption<T>[]>>((acc, opt) => {
        const group = opt.group || 'Other';
        if (!acc[group]) acc[group] = [];
        acc[group].push(opt);
        return acc;
      }, {})
    : null;

  const dropdownMenu = (
    <div
      ref={dropdownRef}
      style={dropdownStyle}
      className={`custom-select-dropdown ${className}`}
      role="listbox"
    >
      {groupedOptions ? (
        Object.entries(groupedOptions).map(([groupName, groupItems]) => (
          <div key={groupName} className="dropdown-group">
            <div className="dropdown-group-header">{groupName}</div>
            {groupItems.map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                className={`dropdown-option ${opt.value === value ? 'selected' : ''}`}
                onClick={() => handleSelect(opt.value)}
                role="option"
                aria-selected={opt.value === value}
              >
                <div className="option-main">
                  {opt.icon && <span className="option-icon">{opt.icon}</span>}
                  <span className="option-label">{opt.label}</span>
                  {opt.badge && <span className="option-badge">{opt.badge}</span>}
                </div>
                {opt.subLabel && <span className="option-sublabel">{opt.subLabel}</span>}
                {opt.value === value && (
                  <span className="option-checkmark">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        ))
      ) : (
        options.map((opt) => (
          <button
            key={String(opt.value)}
            type="button"
            className={`dropdown-option ${opt.value === value ? 'selected' : ''}`}
            onClick={() => handleSelect(opt.value)}
            role="option"
            aria-selected={opt.value === value}
          >
            <div className="option-main">
              {opt.icon && <span className="option-icon">{opt.icon}</span>}
              <span className="option-label">{opt.label}</span>
              {opt.badge && <span className="option-badge">{opt.badge}</span>}
            </div>
            {opt.subLabel && <span className="option-sublabel">{opt.subLabel}</span>}
            {opt.value === value && (
              <span className="option-checkmark">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
          </button>
        ))
      )}
    </div>
  );

  return (
    <div
      ref={containerRef}
      id={id}
      className={`custom-select-container size-${size} ${isOpen ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}
    >
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="trigger-content">
          {selectedOption ? (
            <>
              {selectedOption.icon && <span className="option-icon">{selectedOption.icon}</span>}
              <span className="trigger-label">{selectedOption.label}</span>
              {selectedOption.badge && <span className="option-badge">{selectedOption.badge}</span>}
            </>
          ) : (
            <span className="trigger-placeholder">{placeholder}</span>
          )}
        </div>

        <span className="trigger-chevron">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {isOpen && createPortal(dropdownMenu, document.body)}
    </div>
  );
}
