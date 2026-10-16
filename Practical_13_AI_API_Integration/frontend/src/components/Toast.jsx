import React from 'react';

export default function Toast({ message, type }) {
  if (!message) return null;
  return <div className={`toast toast-${type}`}>{message}</div>;
}
