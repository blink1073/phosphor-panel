/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import * as arrays
  from 'phosphor-arrays';

import {
  sendMessage
} from 'phosphor-messaging';

import {
  AbstractLayout, ChildMessage, Widget
} from 'phosphor-widget';


/**
 * A concrete layout implementation suitable for many use cases.
 *
 * #### Notes
 * This class is suitable as a base class for implementing a variety of
 * layouts, but can also be used directly with standard CSS to layout a
 * collection of widgets.
 */
export
class PanelLayout extends AbstractLayout {
  /**
   * Dispose of the resources held by the layout.
   *
   * #### Notes
   * This will dispose all current child widgets of the layout.
   */
  dispose(): void {
    while (this._children.length > 0) {
      this._children.pop().dispose();
    }
    super.dispose();
  }

  /**
   * Get the number of child widgets in the layout.
   *
   * @returns The number of child widgets in the layout.
   */
  childCount(): number {
    return this._children.length;
  }

  /**
   * Get the child widget at the specified index.
   *
   * @param index - The index of the child widget of interest.
   *
   * @returns The child at the specified index, or `undefined`.
   */
  childAt(index: number): Widget {
    return this._children[index];
  }

  /**
   * Add a child widget to the end of the layout.
   *
   * @param child - The child widget to add to the layout.
   *
   * #### Notes
   * If the child is already contained in the layout, it will be moved.
   */
  addChild(child: Widget): void {
    this.insertChild(this.childCount(), child);
  }

  /**
   * Insert a child widget into the layout at the specified index.
   *
   * @param index - The index at which to insert the child widget.
   *
   * @param child - The child widget to insert into the layout.
   *
   * #### Notes
   * If the child is already contained in the layout, it will be moved.
   */
  insertChild(index: number, child: Widget): void {
    child.parent = this.parent;
    let n = this._children.length;
    let i = this._children.indexOf(child);
    let j = Math.max(0, Math.min(index | 0, n));
    if (i !== -1) {
      if (j === n) j--;
      if (i === j) return;
      arrays.move(this._children, i, j);
      if (this.parent) this.moveChild(i, j, child);
    } else {
      arrays.insert(this._children, j, child);
      if (this.parent) this.attachChild(j, child);
    }
  }

  /**
   * Initialize the children of the layout.
   *
   * #### Notes
   * This method is called automatically when the layout is installed
   * on its parent widget.
   *
   * This may be reimplemented by subclasses as needed.
   */
  protected initialize(): void {
    for (let i = 0; i < this.childCount(); ++i) {
      let child = this.childAt(i);
      child.parent = this.parent;
      this.attachChild(i, child);
    }
  }

  /**
   * Attach a child widget to the parent's DOM node.
   *
   * @param index - The current index of the child in the layout.
   *
   * @param child - The child widget to attach to the parent.
   *
   * #### Notes
   * This method is called automatically by the panel layout at the
   * appropriate time. It should not be called directly by user code.
   *
   * The default implementation adds the child's node to the parent's
   * node at the proper location, and sends an `'after-attach'` message
   * to the child if the parent is attached to the DOM.
   *
   * Subclasses may reimplement this method to control how the child's
   * node is added to the parent's node, but the reimplementation must
   * send an `'after-attach'` message to the child if the parent is
   * attached to the DOM.
   */
  protected attachChild(index: number, child: Widget): void {
    let ref = this.childAt(index + 1);
    this.parent.node.insertBefore(child.node, ref && ref.node);
    if (this.parent.isAttached) sendMessage(child, Widget.MsgAfterAttach);
  }

  /**
   * Move a child widget in the parent's DOM node.
   *
   * @param fromIndex - The previous index of the child in the layout.
   *
   * @param toIndex - The current index of the child in the layout.
   *
   * @param child - The child widget to move in the parent.
   *
   * #### Notes
   * This method is called automatically by the panel layout at the
   * appropriate time. It should not be called directly by user code.
   *
   * The default implementation moves the child's node to the proper
   * location in the parent's node and sends both a `'before-detach'`
   * and an `'after-attach'` message to the child if the parent is
   * attached to the DOM.
   *
   * Subclasses may reimplement this method to control how the child's
   * node is moved in the parent's node, but the reimplementation must
   * send both a `'before-detach'` and an `'after-attach'` message to
   * the child if the parent is attached to the DOM.
   */
  protected moveChild(fromIndex: number, toIndex: number, child: Widget): void {
    let ref = this.childAt(toIndex + 1);
    if (this.parent.isAttached) sendMessage(child, Widget.MsgBeforeDetach);
    this.parent.node.insertBefore(child.node, ref && ref.node);
    if (this.parent.isAttached) sendMessage(child, Widget.MsgAfterAttach);
  }

  /**
   * Detach a child widget from the parent's DOM node.
   *
   * @param index - The previous index of the child in the layout.
   *
   * @param child - The child widget to detach from the parent.
   *
   * #### Notes
   * This method is called automatically by the panel layout at the
   * appropriate time. It should not be called directly by user code.
   *
   * The default implementation removes the child's node from the
   * parent's node, and sends a `'before-detach'` message to the child
   * if the parent is attached to the DOM.
   *
   * Subclasses may reimplement this method to control how the child's
   * node is removed from the parent's node, but the reimplementation
   * must send a `'before-detach'` message to the child if the parent
   * is attached to the DOM.
   */
  protected detachChild(index: number, child: Widget): void {
    if (this.parent.isAttached) sendMessage(child, Widget.MsgBeforeDetach);
    this.parent.node.removeChild(child.node);
  }

  /**
   * A message handler invoked on a `'child-removed'` message.
   *
   * #### Notes
   * This will remove the child from the layout.
   *
   * Subclasses should **not** typically reimplement this method.
   */
  protected onChildRemoved(msg: ChildMessage): void {
    let i = arrays.remove(this._children, msg.child);
    if (i !== -1) this.detachChild(i, msg.child);
  }

  private _children: Widget[] = [];
}
