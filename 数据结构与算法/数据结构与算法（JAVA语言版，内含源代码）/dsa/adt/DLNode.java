package dsa.adt;

import dsa.adt.Node;

public class DLNode implements Node {
	private Object element;
	private DLNode pre;
	private DLNode next;
	
	public DLNode() {
		this(null,null,null);
	}
	public DLNode(Object ele, DLNode pre, DLNode next){
		this.element = ele;
		this.pre = pre;
		this.next = next;
	}

	public DLNode getNext(){
		return next;
	}
	public void setNext(DLNode next){
		this.next = next;
	}
	public DLNode getPre(){
		return pre;
	}
	public void setPre(DLNode pre){
		this.pre = pre;
	}
	/****************Node Interface Method**************/
	public Object getData() {
		return element;
	}

	public void setData(Object obj) {
		element = obj;
	}	
}
