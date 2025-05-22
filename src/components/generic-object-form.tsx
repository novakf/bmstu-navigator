import { Button, Form, Select, Space, message } from 'antd';
import { UniverObjectType } from '../interfaces';
import { AuditoriumForm } from './object-form/auditorium-form';
import { AuditoriumPointForm } from './object-form/auditorium-point-form';
import { HallwayPointForm } from './object-form/hallway-point';
import { FC, useContext, useEffect, useState } from 'react';
import {
  setUoItemsAction,
  useSelectedElement,
  useUoItems,
} from '../state/editor/slice';
import { LadderPointForm } from './object-form/ladder-point';
import { FloorPointForm } from './object-form/floor-point';
import { HallwayForm } from './object-form/hallway-form';
import { GuideForm } from './object-form/guide-form';
import { useDispatch } from 'react-redux';
import { LadderForm } from './object-form/ladder-form';
import { canvasContext } from '../svgedit2/Canvas/Context/canvasContext';

const univerObjectFormMap = {
  [UniverObjectType.Auditorium]: AuditoriumForm,
  [UniverObjectType.AuditoriumPoint]: AuditoriumPointForm,
  [UniverObjectType.Guide]: GuideForm,
  [UniverObjectType.Hallway]: HallwayForm,
  [UniverObjectType.HallwayPoint]: HallwayPointForm,
  [UniverObjectType.Ladder]: LadderForm,
  [UniverObjectType.LadderPoint]: LadderPointForm,
  [UniverObjectType.FloorPoint]: FloorPointForm,
};

type Props = {
  onSubmit: () => void;
  onCancel: () => void;
};

export const GenericUniverObjectForm: FC<Props> = ({ onSubmit, onCancel }) => {
  const dispatch = useDispatch();
  const uoItems = useUoItems();
  const selectedElement = useSelectedElement();
  const [form] = Form.useForm();

  const [currentUOForm, setCurrentUOForm] = useState<UniverObjectType | null>(
    null
  );

  const [canvasState, canvasStateDispatcher] = useContext(canvasContext);

  useEffect(() => {
    form.resetFields();

    let seType: null | UniverObjectType = null;

    if (selectedElement?.element) {
      seType = uoItems[selectedElement?.element?.id.replace('svg_', '')]?.type;
    }

    setCurrentUOForm(seType);
  }, [selectedElement?.element]);

  if (!selectedElement) return null;

  const element = selectedElement?.element;

  const selectForm = (value: UniverObjectType) => {
    setCurrentUOForm(value);
  };

  console.log('currr', currentUOForm);

  const CurrentUOForm = currentUOForm
    ? univerObjectFormMap[currentUOForm]
    : () => null;

  const univerObjectSelectOptions = [
    { value: UniverObjectType.Auditorium, label: 'Аудитория' },
    {
      value: UniverObjectType.AuditoriumPoint,
      label: 'Точка аудитории (дверь)',
      disabled: element?.tagName !== 'circle',
    },
    { value: UniverObjectType.Guide, label: 'Направляющая' },
    { value: UniverObjectType.Hallway, label: 'Коридор' },
    { value: UniverObjectType.Ladder, label: 'Лестница' },
    {
      value: UniverObjectType.HallwayPoint,
      label: 'Точка коридора',
      disabled: element?.tagName !== 'circle',
    },
    {
      value: UniverObjectType.LadderPoint,
      label: 'Точка лестницы',
      disabled: element?.tagName !== 'circle',
    },
    {
      value: UniverObjectType.FloorPoint,
      label: 'Точка этажа',
      disabled: element?.tagName !== 'circle',
    },
  ];

  const onFinish = (values: any) => {
    if (!values.corpus || !values.floor) {
      message.error('Выберите этаж');
      return;
    }

    if (!values.id || !values.name) {
      message.error('Заполните данные');
      return;
    }

    dispatch(
      setUoItemsAction({
        ...uoItems,
        [values.id]: values,
      })
    );

    if (values.type === UniverObjectType.Auditorium) {
      canvasStateDispatcher({
        type: 'color',
        colorType: 'fill',
        color: values.closed ? '#9b741b' : '#bcb9b2',
      });

      const elX = Number(selectedElement.element.getAttribute('x'));
      const elY = Number(selectedElement.element.getAttribute('y'));
      const elWidth = Number(selectedElement.element.getAttribute('width'));
      const elHeight = Number(selectedElement.element.getAttribute('height'));

      const textX = elX + elWidth / 2 - 15;
      const textY = elY + elHeight / 2 + 10;

      const currText = document.querySelectorAll(
        `text[class~="${values.id}"]`
      )[0];

      console.log(currText);

      if (currText) {
        console.log('remove');
        currText.remove();
      }

      const textEl = document.createElement('text');
      textEl.setAttribute('font-size', '24');
      textEl.setAttribute('class', values.id);
      textEl.setAttribute('id', canvasState.canvas.getNextId());
      textEl.setAttribute('x', textX.toString());
      textEl.setAttribute('y', textY.toString());
      textEl.innerText = values.name;

      const svgContent = canvasState.canvas.getSvgContent();
      const elements = svgContent.querySelector('g');
      elements.insertAdjacentHTML('beforeend', textEl.outerHTML);

      canvasState.canvas.changeSvgContent();
    }

    if (values.type === UniverObjectType.Hallway) {
      canvasStateDispatcher({
        type: 'color',
        colorType: 'fill',
        color: '#00ffff00',
      });
    }

    if (values.type === UniverObjectType.Ladder) {
      canvasStateDispatcher({
        type: 'color',
        colorType: 'fill',
        color: '#ed9337',
      });
    }

    if (values.type === UniverObjectType.HallwayPoint) {
      canvasStateDispatcher({
        type: 'color',
        colorType: 'fill',
        color: 'green',
      });
    }

    onSubmit();

    message.success(`Объект ${values.id} сохранен`);
  };

  const cancel = () => {
    onCancel();
  };

  console.log(uoItems[element?.id.replace('svg_', '')]?.type);

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name={'type'}
        label={'Тип объекта'}
        initialValue={uoItems[element?.id.replace('svg_', '')]?.type}
      >
        <Select
          options={univerObjectSelectOptions}
          defaultValue={uoItems[element?.id.replace('svg_', '')]?.type}
          value={uoItems[element?.id.replace('svg_', '')]?.type}
          onChange={selectForm}
          size={'small'}
        />
      </Form.Item>
      <CurrentUOForm />
      <Space align={'end'}>
        <Button onClick={cancel}>Отмена</Button>
        <Button type={'primary'} htmlType="submit">
          Создать
        </Button>
      </Space>
    </Form>
  );
};
