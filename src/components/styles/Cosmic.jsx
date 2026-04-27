// Cosmic style: re-uses the original cinematic 3D-tilt invitation card.
// The component lives at src/components/InvitationPreview.jsx and continues
// to receive the full state directly.
import React from 'react';
import InvitationPreview from '../InvitationPreview.jsx';

export default function Cosmic({ state, compact = false }) {
  return <InvitationPreview state={state} compact={compact} />;
}
