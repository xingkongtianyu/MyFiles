package dsa.adt;

import dsa.adt.Queue;
import dsa.exception.QueueEmptyException;

public class QueueSLinked implements Queue {
	private SLNode front;
	private SLNode rear;
	private int size;
	public QueueSLinked() {
		front = new SLNode();
		rear = front;
		size = 0;
	}

	//返回队列的大小
	public int getSize() {
		return size;
	}

	//判断队列是否为空
	public boolean isEmpty() {
		return size==0;
	}

	//数据元素e入队
	public void enqueue(Object e) {
		SLNode p = new SLNode(e,null);
		rear.setNext(p);
		rear = p;
		size++;
	}

	//队首元素出队
	public Object dequeue() throws QueueEmptyException {
		if (size<1)
			throw new QueueEmptyException("错误：队列为空");
		SLNode p = front.getNext();
		front.setNext(p.getNext());
		size--;
		if (size<1) rear = front;	//如果队列为空,rear指向头结点
		return p.getData();
	}

	//取队首元素
	public Object peek() throws QueueEmptyException {
		if (size<1)
			throw new QueueEmptyException("错误：队列为空");
		return front.getNext().getData();
	}	
}
