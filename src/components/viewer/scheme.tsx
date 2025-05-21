import { FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import level9 from '../../level9.svg';
import level4n from '../../level4n.svg';
import { setRouteEdgeAction, useActiveFloor } from '../../state/viewer';
import {
  useCorpus,
  useCurrFloorSvg,
  useFloor,
  useSchemes,
  useUoItems,
} from '../../state/editor/slice';
import { UniverObjectType } from '../../interfaces';
import { isSearchable } from '../../utils';
import { useDispatch } from 'react-redux';

const floorSchemeMap: Record<string, string> = {
  '9': level9,
  '4': level4n,
};

export const Scheme: FC = () => {
  const dispatch = useDispatch();
  const uoItems = useUoItems();

  const currentCampus = useCorpus();
  const currentFloor = useFloor();
  const currFloorSvg = useCurrFloorSvg();
  const schemes = useSchemes();
  const toolTipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let zoom = 1;
    const transformContainer = document.querySelector<HTMLElement>(
      '.transform-container'
    );
    const canvas = document.querySelector<HTMLElement>('.canvas');

    if (!canvas || !transformContainer) return;

    const wheelListener = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        zoom += 0.02;
      } else {
        zoom -= 0.02;
      }

      if (zoom < 0.5) return;
      if (zoom > 4) return;

      canvas.style.transform = `scale(${zoom})`;
    };

    transformContainer.addEventListener('wheel', wheelListener);

    return () => {
      transformContainer.removeEventListener('wheel', wheelListener);
    };
  }, []);

  useEffect(() => {
    const schemeContainer = document.querySelector('.scheme-container');

    if (!schemeContainer || !currFloorSvg) return;

    const tooltip = toolTipRef.current;

    if (!tooltip) return;

    schemeContainer.innerHTML = currFloorSvg;

    const gLayer = schemeContainer.querySelector('svg');
    const gRoute = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gRoute.classList.add('route');
    gLayer?.prepend(gRoute);

    const interObjects = Object.keys(uoItems)
      .map((key) => uoItems[key])
      .filter(isSearchable);

    const hiddenObjectKeys = Object.keys(uoItems).filter((key) => {
      return (
        uoItems[key].type === UniverObjectType.HallwayPoint ||
        uoItems[key].type === UniverObjectType.Guide
      );
    });
    const hiddenObjects = hiddenObjectKeys.map((key) => uoItems[key]);

    const showTooltip = ({ text, el }: { text?: string; el: HTMLElement }) => {
      if (!text) {
        return;
      }

      let toolTipText =  text

      if (el)

      tooltip.innerHTML = text;
      tooltip.style.display = 'block';
      const elProps = el.getBoundingClientRect();
      const elWidth = elProps.width;
      const elHeight = elProps.height;
      tooltip.style.left = elProps.left + elWidth / 2 + 'px';
      tooltip.style.top = elProps.top + elHeight / 2 + 'px';
      tooltip.style.opacity = '1';
    };

    const hideTooltip = () => {
      tooltip.style.opacity = '0';
    };

    for (const interObject of interObjects) {
      const el = document.querySelector<HTMLElement>(`#${interObject.svgId}`);

      if (!el) continue;

      el.classList.add('interactive');
      el.addEventListener('click', (e) => {
        dispatch(setRouteEdgeAction(interObject.id));
      });
      el.addEventListener('mouseenter', (e) => {
        showTooltip({ text: interObject.description, el: el });
      });
      el.addEventListener('mouseleave', (e) => {
        hideTooltip();
      });
    }

    for (const hiddenObject of hiddenObjects) {
      const el = document.querySelector<HTMLElement>(`#${hiddenObject.svgId}`);

      if (!el) continue;

      el.style.display = 'none';
    }
  }, [currFloorSvg, toolTipRef]);

  return (
    <Container className={'transform-container'}>
      <Canvas className={'canvas'}>
        <SchemeContainer className={'scheme-container'} />
      </Canvas>
      <Tooltip ref={toolTipRef} />
    </Container>
  );
};

const Tooltip = styled.div`
  position: absolute;
  pointer-events: none;
  background: #fff;
  border-radius: 8px;
  border-top-left-radius: 0;
  padding: 6px 8px;
  opacity: 0;
  transition: 0.3s;
  box-shadow: 0px 5px 16px 0px rgba(34, 60, 80, 0.28);
`;

const Container = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Canvas = styled.div`
  width: 640px;
  height: 480px;
`;

const SchemeContainer = styled.div`
  svg {
    width: 640px;
    height: 480px;
  }

  image {
    display: none;
  }

  text {
    user-select: none;
  }
`;
