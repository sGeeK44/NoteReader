import React, { ReactNode } from 'react';
import { Attributes, SVGContext } from 'vexflow';
import Svg, { Text, Path, Rect, G } from 'react-native-svg';

const propMap = {
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  class: 'className',
};

class ContextElement {
  children: ContextElement[];
  props: { [key: string]: unknown; key: number };
  constructor(props: object) {
    this.children = [];
    this.props = { style: {}, key: 0, ...props };
  }

  get style() {
    return this.props.style;
  }

  applyProps(attributes: { style: object; key: number }) {
    this.props = { ...this.props, ...attributes };
  }

  setAttribute(propertyName: string, value: string) {
    if (propertyName === 'class') {
      propertyName = 'className';
    }

    this.props[propertyName] = value;
  }

  appendChild(elem: ContextElement) {
    this.children.push(elem);
  }

  _doPropsAdjustment() {
    Object.entries(propMap).forEach(([key, value]) => {
      this.props[value] = this.props[key];
      delete this.props[key];
    });
  }

  toReactElement() {
    this._doPropsAdjustment();
    return this._toReactElement();
  }
  _toReactElement(): ReactNode {
    throw new Error('Method not implemented.');
  }
}

class DivContextElement extends ContextElement {
  constructor(props: object) {
    super({ ...props, svgElementType: 'div' });
  }

  _toReactElement(): ReactNode {
    const childrenReactElements = this.children.map(child =>
      child.toReactElement(),
    );

    return React.createElement('div', this.props, childrenReactElements);
  }
}

class SVGContextElement extends ContextElement {
  constructor(props: object) {
    super({
      ...props,
      xmlns: 'http://www.w3.org/2000/svg',
      svgElementType: 'svg',
    });
  }

  _toReactElement(): ReactNode {
    const childrenReactElements = this.children.map(child =>
      child.toReactElement(),
    );

    return React.createElement(Svg, this.props, childrenReactElements);
  }
}

class PathContextElement extends ContextElement {
  constructor(props: object) {
    super({ ...props, svgElementType: 'path' });
  }

  _toReactElement(): ReactNode {
    const childrenReactElements = this.children.map(child =>
      child.toReactElement(),
    );

    delete this.props.x;
    delete this.props.y;

    return React.createElement(Path, this.props, childrenReactElements);
  }
}

class RectContextElement extends ContextElement {
  constructor(props: object) {
    super({ ...props, svgElementType: 'rect' });
  }

  _toReactElement(): ReactNode {
    const childrenReactElements = this.children.map(child =>
      child.toReactElement(),
    );

    return React.createElement(Rect, this.props, childrenReactElements);
  }
}

class GContextElement extends ContextElement {
  constructor(props: object) {
    super({ ...props, svgElementType: 'g' });
  }

  _toReactElement(): ReactNode {
    const childrenReactElements = this.children.map(child =>
      child.toReactElement(),
    );

    return React.createElement(G, this.props, childrenReactElements);
  }
}

class TextContextElement extends ContextElement {
  constructor(props: object) {
    super({ ...props, svgElementType: 'text' });
  }

  _toReactElement(): ReactNode {
    return React.createElement(Text, this.props, []);
  }
}

export class RnSvgContext extends SVGContext {
  nextElementKey: number;
  constructor(width: number, height: number) {
    super(new DivContextElement({}));

    this.getSvg().applyProps({
      width: width ? width : 250,
      height: height ? height : 250,
    });
    this.nextElementKey = 1;
  }

  create(svgElementType: string) {
    const key = this.nextElementKey ? this.nextElementKey++ : 0;
    switch (svgElementType) {
      case 'svg':
        return new SVGContextElement({ key: key });
      case 'rect':
        return new RectContextElement({ key: key });
      case 'path':
        return new PathContextElement({ key: key });
      case 'g':
        return new GContextElement({ key: key });
      case 'text':
        return new TextContextElement({ key: key });
    }

    throw new Error(`Type ${svgElementType} not implemented.`);
  }

  /**
   * Overriden so that functions inherited from SVGContext can use it.
   * @param element  Element to add attributes to.
   * @param attributes   Desired attributes.
   */
  applyAttributes(element: SVGElement, attributes: Attributes): SVGElement {
    (element as RnSvgElement).applyProps(attributes);
    return element;
  }

  add(element: SVGElement) {
    this.getParent().children.push(element);
  }

  clear() {
    this.getSvg().children = [];
  }

  render(): ReactNode {
    return this.getSvg().toReactElement();
  }

  public getSvg(): RnSvgElement {
    return this.svg as RnSvgElement;
  }

  public setSvg(svg: RnSvgElement | undefined): void {
    if (svg === undefined) {
      return;
    }
    this.svg = svg;
  }

  private getParent(): RnSvgElement {
    return this.parent as RnSvgElement;
  }
}

interface RnSvgElement extends SVGSVGElement {
  children: SVGElement[];
  toReactElement(): ReactNode;
  applyProps(attributes: Attributes): void;
}
