import React, { FC, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../svgedit/editor/svgedit.css';
import { TopPanelGlobal } from '../TopPanelGlobal';
import { Provider, useDispatch } from 'react-redux';
import { AppDispatch, store } from '../state';
import { initEditor } from '../state/editor/slice';
import { useCurrentUser } from '../state/user';
import { Navigate } from 'react-router-dom';
import Editor from '../svgedit2/editor.class';

const EditorNew: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useCurrentUser();

  useEffect(() => {
    const container = document.getElementById('editcontainer') as HTMLElement;
    
    const svgEditor = new Editor(container);

    // save svg
    function logSvg(content: any) {
      console.log(content);
    }

    svgEditor.configure('saveHandler', logSvg as any);

    const svgroot = document.getElementById('svgroot')

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '640');
    svg.setAttribute('height', '480');
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");

    console.log(svgroot?.offsetHeight, svgroot?.offsetWidth)

    const svgContent = fetch('./arbelos.svg')
      .then((response) => response.text())
      .then((svgContent) => svgEditor.load(svg.outerHTML));
  }, []);

  return <div id="editcontainer"></div>;
};

export default EditorNew;
