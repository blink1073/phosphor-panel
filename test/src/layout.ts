/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import expect = require('expect.js');

import {
  Message
} from 'phosphor-messaging';

import {
  ChildMessage, Widget
} from 'phosphor-widget';

import {
  Panel, PanelLayout
} from '../../lib/index';


class LogWidget extends Widget {

  messages: string[] = [];

  processMessage(msg: Message): void {
    super.processMessage(msg);
    this.messages.push(msg.type);
  }
}


class LogLayout extends PanelLayout {

  methods: string[] = [];

  protected initialize(): void {
    super.initialize();
    this.methods.push('initialize');
  }

  protected attachChild(index: number, child: Widget): void {
    super.attachChild(index, child);
    this.methods.push('attachChild');
  }

  protected moveChild(fromIndex: number, toIndex: number, child: Widget): void {
    super.moveChild(fromIndex, toIndex, child);
    this.methods.push('moveChild');
  }

  protected detachChild(index: number, child: Widget): void {
    super.detachChild(index, child);
    this.methods.push('detachChild');
  }

  protected onChildRemoved(msg: ChildMessage): void {
    super.onChildRemoved(msg);
    this.methods.push('onChildRemoved');
  }
}


class LogPanel extends Panel {

  static createLayout(): LogLayout {
    return new LogLayout();
  }
}


describe('phosphor-panel', () => {

  describe('PanelLayout', () => {

    describe('#dispose()', () => {

      it('should dispose of the resources held by the layout', () => {
        let layout = new PanelLayout();
        layout.addChild(new Widget());
        layout.dispose();
        expect(layout.childCount()).to.be(0);
      });

    });

    describe('#childCount()', () => {

      it('should get the number of child widgets in the layout', () => {
        let layout = new PanelLayout();
        expect(layout.childCount()).to.be(0);
        layout.addChild(new Widget());
        expect(layout.childCount()).to.be(1);
      });

    });

    describe('#childAt()', () => {

      it('should get the child widget at the specified index', () => {
        let widgets = [new Widget(), new Widget()];
        let layout = new PanelLayout();
        layout.addChild(widgets[0]);
        layout.addChild(widgets[1]);
        expect(layout.childAt(0)).to.be(widgets[0]);
      });

      it('should return `undefined` if no widget was found', () => {
        let widgets = [new Widget(), new Widget()];
        let layout = new PanelLayout();
        layout.addChild(widgets[0]);
        layout.addChild(widgets[1]);
        expect(layout.childAt(2)).to.be(void 0);
      });

    });

    describe('#childIndex()', () => {

      it('should get the index of the specified child widget', () => {
        let widgets = [new Widget(), new Widget()];
        let layout = new PanelLayout();
        layout.addChild(widgets[0]);
        layout.addChild(widgets[1]);
        expect(layout.childIndex(widgets[1])).to.be(1);
      });

      it('should return `-1` if the widget was not found', () => {
        let widgets = [new Widget(), new Widget()];
        let layout = new PanelLayout();
        layout.addChild(widgets[0]);
        layout.addChild(widgets[1]);
        expect(layout.childIndex(new Widget())).to.be(-1);
      });

    });

    describe('#addChild()', ()  => {

      it('should add a child widget to the end of the layout', () => {
        let widgets = [new Widget(), new Widget()];
        let layout = new PanelLayout();
        layout.addChild(widgets[0]);
        expect(layout.childIndex(widgets[0])).to.be(0);
        layout.addChild(widgets[1]);
        expect(layout.childIndex(widgets[1])).to.be(1);
      });

      it('should move the child if it is already contained in the layout', () => {
        let widgets = [new Widget(), new Widget()];
        let layout = new PanelLayout();
        layout.addChild(widgets[0]);
        layout.addChild(widgets[1]);
        layout.addChild(widgets[0]);
        expect(layout.childIndex(widgets[0])).to.be(1);
      });

    });

    describe('#insertChild()', () => {

      it('should insert a child at the specified index', () => {
        let widgets = [new Widget(), new Widget()];
        let layout = new PanelLayout();
        layout.addChild(widgets[0]);
        layout.insertChild(0, widgets[1]);
        expect(layout.childIndex(widgets[1])).to.be(0);
      });

      it('should move the child if it is already contained in the layout', () => {
        let widgets = [new Widget(), new Widget()];
        let layout = new PanelLayout();
        layout.addChild(widgets[0]);
        layout.addChild(widgets[1]);
        layout.insertChild(0, widgets[1]);
        expect(layout.childIndex(widgets[1])).to.be(0);
      });

      it('should be a no-op if the index stays the same', () => {
        let widgets = [new Widget(), new Widget()];
        let layout = new PanelLayout();
        layout.addChild(widgets[0]);
        layout.addChild(widgets[1]);
        layout.insertChild(0, widgets[0]);
        expect(layout.childIndex(widgets[0])).to.be(0);
      });

    });

    describe('#initialize()', () => {

      it('should be called when the layout is installed', () => {
        let widget = new Widget();
        let layout = new LogLayout();
        widget.layout = layout;
        expect(layout.methods.indexOf('initialize')).to.not.be(-1);
      });

      it('should attach widget children', () => {
        let widget = new Widget();
        let children = [new LogWidget(), new LogWidget()];
        let layout = new LogLayout();
        layout.addChild(children[0]);
        layout.addChild(children[1]);
        widget.attach(document.body);
        widget.layout = layout;
        expect(layout.methods.indexOf('initialize')).to.not.be(-1);
        expect(children[0].messages.indexOf('after-attach')).to.not.be(-1);
        expect(children[1].messages.indexOf('after-attach')).to.not.be(-1);
        widget.dispose();
      });

    });

    describe('#attachChild()', () => {

      it('should be called when a child is added', () => {
        let panel = new LogPanel();
        let layout = panel.layout as LogLayout;
        expect(layout.methods.indexOf('attachChild')).to.be(-1);
        panel.addChild(new LogWidget());
        expect(layout.methods.indexOf('attachChild')).to.not.be(-1);
      });

      it('should attach panel children', () => {
        let panel = new LogPanel();
        let children = [new LogWidget(), new LogWidget()];
        panel.addChild(children[0]);
        panel.addChild(children[1]);
        panel.attach(document.body);
        let layout = panel.layout as LogLayout;
        expect(layout.methods.indexOf('attachChild')).to.not.be(-1);
        expect(children[0].messages.indexOf('after-attach')).to.not.be(-1);
        expect(children[1].messages.indexOf('after-attach')).to.not.be(-1);
        panel.dispose();
      });

    });

    describe('#moveChild()', () => {

      it('should be called when a child is moved', () => {
        let widgets = [new Widget(), new Widget()];
        let panel = new LogPanel();
        panel.addChild(widgets[0]);
        panel.addChild(widgets[1]);
        panel.insertChild(0, widgets[1]);
        let layout = panel.layout as LogLayout;
        expect(layout.methods.indexOf('moveChild')).to.not.be(-1);
      });

      it("should send `'before-detach'` and `'after-attach'` messages as appropriate", () => {
        let children = [new LogWidget(), new LogWidget()];
        let panel = new LogPanel();
        panel.addChild(children[0]);
        panel.addChild(children[1]);
        children[1].messages = [];
        panel.attach(document.body);
        panel.insertChild(0, children[1]);
        let layout = panel.layout as LogLayout;
        expect(layout.methods.indexOf('moveChild')).to.not.be(-1);
        expect(children[1].messages.indexOf('before-detach')).to.not.be(-1);
        expect(children[1].messages.indexOf('after-attach')).to.not.be(-1);
        panel.dispose();
      });

    });

    describe('#detachChild()', () => {

      it('should be called when a child is removed', () => {
        let children = [new Widget(), new Widget()];
        let panel = new LogPanel();
        panel.addChild(children[0]);
        panel.addChild(children[1]);
        children[1].parent = null;
        let layout = panel.layout as LogLayout;
        expect(layout.methods.indexOf('detachChild')).to.not.be(-1);
      });

      it("should send a `'before-detach'` message if appropriate", () => {
        let children = [new LogWidget(), new LogWidget()];
        let panel = new LogPanel();
        panel.addChild(children[0]);
        panel.addChild(children[1]);
        panel.attach(document.body);
        children[1].parent = null;
        let layout = panel.layout as LogLayout;
        expect(layout.methods.indexOf('detachChild')).to.not.be(-1);
        expect(children[1].messages.indexOf('before-detach')).to.not.be(-1);
        panel.dispose();
      });

    });

    describe('#onChildRemoved()', () => {

      it('should be called when a child is removed', () => {
        let children = [new Widget(), new Widget()];
        let panel = new LogPanel();
        panel.addChild(children[0]);
        panel.addChild(children[1]);
        children[1].parent = null;
        let layout = panel.layout as LogLayout;
        expect(layout.methods.indexOf('onChildRemoved')).to.not.be(-1);
      });

    });

  });

});
