import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  title?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  accent?: 'purple' | 'blue' | 'green' | 'red' | 'amber';
  noPadding?: boolean;
}

export default function Card({ title, subtitle, children, className = '', accent, noPadding }: CardProps) {
  return (
    <div className={`${styles.card} ${accent ? styles[`accent_${accent}`] : ''} ${noPadding ? styles.noPadding : ''} ${className}`}>
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      <div className={noPadding ? '' : styles.body}>{children}</div>
    </div>
  );
}
