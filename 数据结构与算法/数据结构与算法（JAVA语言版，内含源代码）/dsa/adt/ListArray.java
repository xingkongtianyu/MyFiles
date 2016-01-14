package dsa.adt;

import dsa.adt.List;
import dsa.exception.OutOfBoundaryException;
import dsa.strategy.Strategy;
import dsa.strategy.DefaultStrategy;

public class ListArray implements List {
	
	private final int LEN = 8;	//数组的默认大小
	private Strategy strategy;	//数据元素比较策略
	private int size;			//线性表中数据元素的个数
	private Object[] elements;	//数据元素数组

	public ListArray() {
		this(new DefaultStrategy());
	}
	
	public ListArray(Strategy strategy){
		this.strategy = strategy;
		size = 0;
		elements = new Object[LEN];
	}
	
	//返回线性表的大小，即数据元素的个数。
	public int getSize() {
		return size;
	}

	//如果线性表为空返回true，否则返回false。
	public boolean isEmpty() {
		return size==0;
	}

	//判断线性表是否包含数据元素e
	public boolean contains(Object e) {
		for (int i=0; i<size; i++)
			if (strategy.equal(e,elements[i])) return true;
		return false;
	}

	//返回数据元素e在线性表中的序号
	public int indexOf(Object e) {
		for (int i=0; i<size; i++)
			if (strategy.equal(e,elements[i])) return i;
		return -1;
	}

	//将数据元素e插入到线性表中i号位置
	public void insert(int i, Object e) throws OutOfBoundaryException {
		if (i<0||i>size)
			throw new OutOfBoundaryException("错误，指定的插入序号越界。");
		if (size >= elements.length)
			expandSpace();
		for (int j=size; j>i; j--)
			elements[j] = elements[j-1];
		elements[i] = e;
		size++;
		return;
	}
	
	private void expandSpace(){
		Object[] a = new Object[elements.length*2];
		for (int i=0; i<elements.length; i++)
			a[i] = elements[i];
		elements = a;
	}

	//将数据元素e插入到元素obj之前
	public boolean insertBefore(Object obj, Object e) {
		int i = indexOf(obj);
		if (i<0) return false;
		insert(i,e);
		return true;
	}

	//将数据元素e插入到元素obj之后
	public boolean insertAfter(Object obj, Object e) {
		int i = indexOf(obj);
		if (i<0) return false;
		insert(i+1,e);
		return true;
	}

	//删除线性表中序号为i的元素,并返回之
	public Object remove(int i) throws OutOfBoundaryException {
		if (i<0||i>=size)
			throw new OutOfBoundaryException("错误，指定的删除序号越界。");
		Object obj = elements[i];
		for (int j=i; j<size-1; j++)
			elements[j] = elements[j+1];
		elements[--size] = null;
		return obj;
	}

	//删除线性表中第一个与e相同的元素
	public boolean remove(Object e) {
		int i = indexOf(e);
		if (i<0) return false;
		remove(i);
		return true;
	}

	//替换线性表中序号为i的数据元素为e，返回原数据元素
	public Object replace(int i, Object e) throws OutOfBoundaryException {
		if (i<0||i>=size)
			throw new OutOfBoundaryException("错误，指定的序号越界。");
		Object obj = elements[i];
		elements[i] = e;
		return obj;
	}

	//返回线性表中序号为i的数据元素
	public Object get(int i) throws OutOfBoundaryException {
		if (i<0||i>=size)
			throw new OutOfBoundaryException("错误，指定的序号越界。");
		return elements[i];
	}
}
