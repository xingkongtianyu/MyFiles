package dsa.adt;

import dsa.adt.Stack;
import dsa.exception.StackEmptyException;

public class StackArray implements Stack {
	
	private final int LEN = 4;	//数组的默认大小
	private Object[] elements;	//数据元素数组
	private int top;			//栈顶指针
	
	public StackArray() {
		top = -1;
		elements = new Object[LEN];
	}

	//返回堆栈的大小
	public int getSize() {
		return top+1;
	}

	//判断堆栈是否为空
	public boolean isEmpty() {
		return top<0;
	}

	//数据元素e入栈
	public void push(Object e) {
		if (getSize()>=elements.length) expandSpace();
		elements[++top] = e;
	}
	
	private void expandSpace(){
		Object[] a = new Object[elements.length*2];
		for (int i=0; i<elements.length; i++)
			a[i] = elements[i];
		elements = a;
	}

	//栈顶元素出栈
	public Object pop() throws StackEmptyException {
		if (getSize()<1)
			throw new StackEmptyException("错误，堆栈为空。");
		Object obj = elements[top];
		elements[top--] = null;
		return obj;
	}

	//取栈顶元素
	public Object peek() throws StackEmptyException {
		if (getSize()<1)
			throw new StackEmptyException("错误，堆栈为空。");
		return elements[top];
	}	
}
