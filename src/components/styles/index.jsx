import React from 'react';
import Cosmic from './Cosmic.jsx';
import ClassicStatic from './ClassicStatic.jsx';
import Botanical from './Botanical.jsx';
import Editorial from './Editorial.jsx';
import ArtDeco from './ArtDeco.jsx';
import Minimalist from './Minimalist.jsx';
import Mediterranean from './Mediterranean.jsx';
import Watercolor from './Watercolor.jsx';

const REGISTRY = {
  cosmos: Cosmic,
  classic: ClassicStatic,
  botanical: Botanical,
  editorial: Editorial,
  artdeco: ArtDeco,
  minimalist: Minimalist,
  mediterranean: Mediterranean,
  watercolor: Watercolor,
};

export default function StyleRenderer({ state }) {
  const Comp = REGISTRY[state.style] || REGISTRY.cosmos;
  return <Comp state={state} />;
}

export { REGISTRY };
