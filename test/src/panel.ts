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
  Widget
} from 'phosphor-widget';

import {
  Panel, PanelLayout
} from '../../lib/index';


describe('phosphor-panel', () => {

  describe('Panel', () => {

    describe('.createLayout()', () => {

      it('should create a panel layout to use with a panel', () => {
        let layout = Panel.createLayout();
        expect(layout instanceof PanelLayout).to.be(true);
      });

    });

    describe('#constructor()', () => {

      it('should take no arguments', () => {
        let panel = new Panel();
        expect(panel instanceof Panel).to.be(true);
        expect(panel.layout instanceof PanelLayout).to.be(true);
      });

    });

    describe('#childCount()', () => {

      it('should get the number of child widgets in the panel', () => {
        let panel = new Panel();
        expect(panel.childCount()).to.be(0);
        panel.addChild(new Widget());
        expect(panel.childCount()).to.be(1);
      });

    });

    describe('#childAt()', () => {

      it('should get the child widget at the specified index', () => {
        let widgets = [new Widget(), new Widget()];
        let panel = new Panel();
        panel.addChild(widgets[0]);
        panel.addChild(widgets[1]);
        expect(panel.childAt(0)).to.be(widgets[0]);
      });

      it('should return `undefined` if no widget was found', () => {
        let widgets = [new Widget(), new Widget()];
        let panel = new Panel();
        panel.addChild(widgets[0]);
        panel.addChild(widgets[1]);
        expect(panel.childAt(2)).to.be(void 0);
      });

    });

    describe('#childIndex()', () => {

      it('should get the index of the specified child widget', () => {
        let widgets = [new Widget(), new Widget()];
        let panel = new Panel();
        panel.addChild(widgets[0]);
        panel.addChild(widgets[1]);
        expect(panel.childIndex(widgets[1])).to.be(1);
      });

      it('should return `-1` if the widget was not found', () => {
        let widgets = [new Widget(), new Widget()];
        let panel = new Panel();
        panel.addChild(widgets[0]);
        panel.addChild(widgets[1]);
        expect(panel.childIndex(new Widget())).to.be(-1);
      });

    });

    describe('#addChild()', ()  => {

      it('should add a child widget to the end of the panel', () => {
        let widgets = [new Widget(), new Widget()];
        let panel = new Panel();
        panel.addChild(widgets[0]);
        expect(panel.childIndex(widgets[0])).to.be(0);
        panel.addChild(widgets[1]);
        expect(panel.childIndex(widgets[1])).to.be(1);
      });

      it('should move the child if it is already contained in the panel', () => {
        let widgets = [new Widget(), new Widget()];
        let panel = new Panel();
        panel.addChild(widgets[0]);
        panel.addChild(widgets[1]);
        panel.addChild(widgets[0]);
        expect(panel.childIndex(widgets[0])).to.be(1);
      });

    });

    describe('#insertChild()', () => {

      it('should insert a child at the specified index', () => {
        let widgets = [new Widget(), new Widget()];
        let panel = new Panel();
        panel.addChild(widgets[0]);
        panel.insertChild(0, widgets[1]);
        expect(panel.childIndex(widgets[1])).to.be(0);
      });

      it('should move the child if it is already contained in the panel', () => {
        let widgets = [new Widget(), new Widget()];
        let panel = new Panel();
        panel.addChild(widgets[0]);
        panel.addChild(widgets[1]);
        panel.insertChild(0, widgets[1]);
        expect(panel.childIndex(widgets[1])).to.be(0);
      });

    });

  });

});
