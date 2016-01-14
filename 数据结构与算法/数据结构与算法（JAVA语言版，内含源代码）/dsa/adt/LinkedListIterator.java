package dsa.adt;

import dsa.adt.Iterator;
import dsa.exception.OutOfBoundaryException;

public class LinkedListIterator implements Iterator {
	private LinkedList list;//链接表
	private Node current;//当前结点

	//构造方法
	public LinkedListIterator(LinkedList list) {
		this.list = list;
		if (list.isEmpty())		//若列表为空
			current = null;		//则当前元素置空
		else
			current = list.first();//否则从第一个元素开始
	}
	
	//移动到第一个元素
	public void first(){
		if (list.isEmpty())		//若列表为空
			current = null;		//则当前元素置空
		else
			current = list.first();//否则从第一个元素开始		
	}
	
	//移动到下一个元素
	public void next() throws OutOfBoundaryException{
		if (isDone()) 
			throw new OutOfBoundaryException("错误：已经没有元素。");
		if (current==list.last()) current = null;
		else current = list.getNext(current);
	}
	
	//检查迭代器中是否还有剩余的元素
	public boolean isDone() { return current==null; }
	
	//返回当前元素
	public Object currentItem() throws OutOfBoundaryException{
		if (isDone()) 
			throw new OutOfBoundaryException("错误：已经没有元素。");
		return current.getData();
	}
}