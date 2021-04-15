import { useState, useEffect } from 'react';

/** @return {'up' | 'down'} */
export default function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState('up');

  useEffect(() => {
    let isScrollingUp = true;
    let prevScroll = window.scrollY;

    function onScroll() {
      if (prevScroll > window.scrollY && !isScrollingUp) {
        isScrollingUp = true;
        setScrollDirection('up');
      } else if (prevScroll <= window.scrollY && isScrollingUp) {
        isScrollingUp = false;
        setScrollDirection('down');
      }

      prevScroll = window.scrollY;
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    return function cleanup() {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // @ts-ignore
  return scrollDirection;
}
