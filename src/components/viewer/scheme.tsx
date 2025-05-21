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

  const [transformLeft, setTransformLeft] = useState<number>(0);
  const [transformTop, setTransformTop] = useState<number>(0);

  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const transformContainer = document.querySelector<HTMLElement>(
      '.transform-container'
    );
    const canvas = document.querySelector<HTMLElement>('.canvas');

    if (!canvas || !transformContainer) return;

    const wheelListener = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        setZoom(zoom - 0.02);
      } else {
        setZoom(zoom + 0.02);
      }

      if (zoom < 0.5) return;
      if (zoom > 4) return;

      const rect = canvas.getBoundingClientRect();

      console.log(
        `scale(${zoom}) translate(${transformLeft}px, ${transformTop}px);`
      );

      canvas.style.transformOrigin = `${rect.width / 2 / zoom}px ${
        rect.height / 2 / zoom
      }px`;
      canvas.style.transform = `scale(${zoom})`;
    };

    const moveAt = (e: MouseEvent, shiftX: number, shiftY: number) => {
      transformContainer.style.left = e.pageX - shiftX + 'px';
      transformContainer.style.top = e.pageY - shiftY + 'px';
      setTransformLeft(e.pageX - shiftX);
      setTransformTop(e.pageY - shiftY);
      console.log(e.pageX - shiftX, e.pageY - shiftY);
    };

    const getCoords = (elem: HTMLElement) => {
      // кроме IE8-
      var box = elem.getBoundingClientRect();
      return {
        top: box.top + window.scrollY,
        left: box.left + window.scrollX,
      };
    };

    const dragAndDrop = (e: MouseEvent) => {
      var coords = getCoords(transformContainer);
      var shiftX = e.pageX - coords.left;
      var shiftY = e.pageY - coords.top;

      transformContainer.style.position = 'absolute';
      document.body.appendChild(transformContainer);
      moveAt(e, shiftX, shiftY);

      document.onmousemove = function (e) {
        moveAt(e, shiftX, shiftY);
      };

      transformContainer.onmouseup = function () {
        document.onmousemove = null;
        transformContainer.onmouseup = null;
      };
    };

    transformContainer.addEventListener('wheel', wheelListener);
    transformContainer.addEventListener('mousedown', dragAndDrop);
    transformContainer.addEventListener('dragstart', () => {
      return false;
    });

    return () => {
      transformContainer.removeEventListener('wheel', wheelListener);
      transformContainer.removeEventListener('mousedown', dragAndDrop);
      transformContainer.removeEventListener('dragstart', () => {
        return false;
      });
    };
  }, [transformLeft, transformTop, zoom]);

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

      let toolTipText = text;

      if (el) tooltip.innerHTML = text;
      tooltip.style.display = 'block';
      const elProps = el.getBoundingClientRect();
      const elWidth = elProps.width;
      const elHeight = elProps.height;
      tooltip.style.left = elProps.left + elWidth / 2 - transformLeft + 'px';
      tooltip.style.top = elProps.top + elHeight / 2 - transformTop + 'px';
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
  }, [currFloorSvg, toolTipRef, transformLeft, transformTop]);

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
