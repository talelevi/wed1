import React from 'react';
import Cosmic from './Cosmic.jsx';
import ClassicStatic from './ClassicStatic.jsx';
import Botanical from './Botanical.jsx';
import Editorial from './Editorial.jsx';
import ArtDeco from './ArtDeco.jsx';
import Minimalist from './Minimalist.jsx';
import Mediterranean from './Mediterranean.jsx';
import Watercolor from './Watercolor.jsx';
import Greenery from './Greenery.jsx';
import Wreath from './Wreath.jsx';
import OliveMinimal from './OliveMinimal.jsx';
import Wildflowers from './Wildflowers.jsx';

const REGISTRY = {
  greenery: Greenery,
  wreath: Wreath,
  olive: OliveMinimal,
  wildflowers: Wildflowers,
  cosmos: Cosmic,
  classic: ClassicStatic,
  botanical: Botanical,
  editorial: Editorial,
  artdeco: ArtDeco,
  minimalist: Minimalist,
  mediterranean: Mediterranean,
  watercolor: Watercolor,
};

export default function StyleRenderer({ state, compact = false }) {
  const Comp = REGISTRY[state.style] || REGISTRY.cosmos;
  return <Comp state={state} compact={compact} />;
}

export { REGISTRY };
