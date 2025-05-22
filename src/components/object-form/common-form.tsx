import {
  Checkbox,
  CheckboxRef,
  Form,
  Input,
  InputRef,
  Space,
  message,
} from 'antd';
import {
  useCorpus,
  useFloor,
  useSelectedElement,
  useUoItems,
} from '../../state/editor/slice';
import { createLineFrom, fixed } from '../../utils';
import { SVG_ID_SLICE } from '../../constants';
import { useEffect, useRef, useState } from 'react';

export const CommonFormItems = {
  Name: () => {
    const se = useSelectedElement();
    const ref = useRef<InputRef | null>(null);
    const uoItems = useUoItems();

    let value = undefined;

    if (se?.element) {
      value = uoItems[se.element?.id.replace('svg_', '')]?.name;
    }

    return (
      <Form.Item name={'name'} label={'Название'} initialValue={value}>
        <Input ref={ref} value={'sdf'} />
      </Form.Item>
    );
  },
  Description: () => {
    const se = useSelectedElement();
    const ref = useRef<InputRef | null>(null);
    const uoItems = useUoItems();

    let value = undefined;

    if (se?.element) {
      value = uoItems[se.element?.id.replace('svg_', '')]?.description;
    }

    return (
      <Form.Item name={'description'} label={'Описание'} initialValue={value}>
        <Input ref={ref} value={'sdf'} />
      </Form.Item>
    );
  },
  Status: () => {
    const se = useSelectedElement();
    const ref = useRef<CheckboxRef | null>(null);
    const uoItems = useUoItems();

    let value = undefined;

    let cause = undefined;

    if (se?.element) {
      value = uoItems[se.element?.id.replace('svg_', '')]?.closed;
      cause = uoItems[se.element?.id.replace('svg_', '')]?.closeCause;
    }

    const [val, setVal] = useState(value);

    return (
      <>
        <Form.Item
          name={'closed'}
          label={'Закрыта'}
          initialValue={value}
          valuePropName="checked"
        >
          <Checkbox ref={ref} onChange={(e) => setVal(e.target.checked)} />
        </Form.Item>
        {val && (
          <Form.Item
            name={'closeCause'}
            label={'*Причина'}
            initialValue={cause}
          >
            <Input value={'sdf'} />
          </Form.Item>
        )}
      </>
    );
  },
  Id: () => {
    const se = useSelectedElement();
    const ref = useRef<InputRef | null>(null);

    if (!se?.element) return null;

    const id = se.element.id.slice(SVG_ID_SLICE);

    if (ref.current?.input) {
      ref.current.input.value = id;
    }

    return (
      <Form.Item name={'id'} hidden initialValue={id}>
        <Input ref={ref} />
      </Form.Item>
    );
  },
  SvgId: () => {
    const se = useSelectedElement();

    if (!se?.element) return null;

    return (
      <Form.Item name={'svgId'} hidden initialValue={se.element.id}>
        <Input />
      </Form.Item>
    );
  },
  PointCoords: () => {
    const se = useSelectedElement();

    if (!se?.element) return null;

    return (
      <>
        <Form.Item
          name={'xCoord'}
          label={'Координата X'}
          initialValue={se.element.getAttribute('cx')}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={'yCoord'}
          label={'Координата Y'}
          initialValue={se.element.getAttribute('cy')}
        >
          <Input />
        </Form.Item>
      </>
    );
  },
  Lines: () => {
    const se = useSelectedElement();
    const lines = [];

    if (!se?.element) return null;

    const d = se.element.getAttribute('d');

    if (!d) {
      message.error('Направляющая должна быть элементом типа path');
      return null;
    }

    const rawLines = d.slice(1, d.length - 1).split('L');
    d.at(-1) === 'z' && rawLines.pop();

    if (rawLines.length === 0) {
      message.error('path должен содержать L элементы');
      return null;
    }

    const sanitizedLines = rawLines.map((lineStr) => {
      const del = ~lineStr.indexOf(' ') ? ' ' : ',';

      return lineStr.trim().split(del).map(fixed) as [number, number];
    });

    for (let i = 0; i < sanitizedLines.length - 1; i++) {
      const line = createLineFrom(sanitizedLines[i], sanitizedLines[i + 1]);

      lines.push(line);
    }

    console.log(lines);

    return (
      <Form.Item name={'lines'} initialValue={lines} label={'Линии'}>
        <ul>
          {lines.map((line) => (
            <li key={line.x1}>
              ({line.x1}, {line.y1}) ({line.x2}, {line.y2})
            </li>
          ))}
        </ul>
      </Form.Item>
    );
  },
  Floor: () => {
    const se = useSelectedElement();
    const floor = useFloor();

    if (!se?.element) return null;

    if (!floor) {
      return null;
    }

    return (
      <Form.Item name={'floor'} hidden initialValue={floor}>
        <Input />
      </Form.Item>
    );
  },

  Corpus: () => {
    const se = useSelectedElement();
    const corpus = useCorpus();

    if (!se?.element) return null;

    if (!corpus) {
      return null;
    }

    return (
      <Form.Item name={'corpus'} hidden initialValue={corpus}>
        <Input />
      </Form.Item>
    );
  },
};
