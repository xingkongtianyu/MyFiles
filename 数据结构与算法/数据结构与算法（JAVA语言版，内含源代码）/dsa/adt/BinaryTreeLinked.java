package dsa.adt;

import dsa.adt.BinTree;
import dsa.adt.BinTreeNode;
import dsa.strategy.Strategy;
import dsa.strategy.DefaultStrategy;

public class BinaryTreeLinked implements BinTree {
	protected BinTreeNode root;
	protected Strategy strategy;
	
	public BinaryTreeLinked(){ this(null); }
	public BinaryTreeLinked(BinTreeNode root) { this(root,new DefaultStrategy());}
	public BinaryTreeLinked(BinTreeNode root, Strategy strategy){
		this.root = root; 
		this.strategy = strategy;
	}

	//返回树的规模
	public int getSize() {
		return root==null?0:root.getSize();
	}

	//判断树是否为空
	public boolean isEmpty() { return root==null;}

	//返回根结点引用
	public BinTreeNode getRoot() { return root;}

	//获取树的高度
	public int getHeight() { return isEmpty()?-1:root.getHeight();}

	//在树中查找元素e，返回其所在结点
	public BinTreeNode find(Object e) {
		return searchE(root,e);
	}
	//递归查找元素e
	private BinTreeNode searchE(BinTreeNode rt, Object e) {
		if (rt==null) return null;
		if (strategy.equal(rt.getData(),e)) return rt;	//如果是根结点，返回根
		BinTreeNode v = searchE(rt.getLChild(),e);	//否则在左子树中找
		if (v==null) v = searchE(rt.getRChild(),e);	//没找到，在右子树中找
		return v;
	}
	
	//先序遍历二叉树
	public Iterator preOrder() {
		LinkedList list = new LinkedListDLNode();
		preOrderRecursion(this.root,list);
		return list.elements();
	}
	//先序遍历的递归算法
	private void preOrderRecursion(BinTreeNode rt, LinkedList list){
		if (rt==null) return;					//递归基,空树直接返回
		list.insertLast(rt);					//访问根结点
		preOrderRecursion(rt.getLChild(),list);	//遍历左子树
		preOrderRecursion(rt.getRChild(),list);	//遍历右子树
	}
	//先序遍历的非递归算法
	private void preOrderTraverse(BinTreeNode rt, LinkedList list){
		if (rt==null) return;
		BinTreeNode p = rt;
		Stack s = new StackSLinked();
		while (p!=null){
			while (p!=null){								//向左走到尽头
				list.insertLast(p);							//访问根
				if (p.hasRChild()) s.push(p.getRChild());	//右子树根结点入栈
				p = p.getLChild();							
			}
			if (!s.isEmpty()) p = (BinTreeNode)s.pop();		//右子树根退栈遍历右子树
		}
	}
	
	//中序遍历二叉树
	public Iterator inOrder(){
		LinkedList list = new LinkedListDLNode();
		inOrderRecursion(this.root,list);
		return list.elements();
	}
	//中序遍历的递归算法
	private void inOrderRecursion(BinTreeNode rt, LinkedList list){
		if (rt==null) return;					//递归基,空树直接返回
		inOrderRecursion(rt.getLChild(),list);	//遍历左子树
		list.insertLast(rt);					//访问根结点
		inOrderRecursion(rt.getRChild(),list);	//遍历右子树
	}
	//中序遍历的非递归算法
	private void inOrderTraverse(BinTreeNode rt, LinkedList list){
		if (rt==null) return;
		BinTreeNode p = rt;
		Stack s = new StackSLinked();
		while (p!=null||!s.isEmpty()){
			while (p!=null){		//一直向左走
				s.push(p);			//将根结点入栈
				p = p.getLChild();
			}
			if (!s.isEmpty()){
				p = (BinTreeNode)s.pop();//取出栈顶根结点访问之
				list.insertLast(p);
				p = p.getRChild();		//转向根的右子树进行遍历
			}//if 
		}//out while
	}
	
	//后序遍历二叉树
	public Iterator postOrder(){
		LinkedList list = new LinkedListDLNode();
		postOrderRecursion(this.root,list);
		return list.elements();
	}
	//后序遍历的递归算法
	private void postOrderRecursion(BinTreeNode rt, LinkedList list){
		if (rt==null) return;					//递归基,空树直接返回
		postOrderRecursion(rt.getLChild(),list);//遍历左子树
		postOrderRecursion(rt.getRChild(),list);//遍历右子树
		list.insertLast(rt);					//访问根结点
	}
	//后序遍历的非递归算法
	private void postOrderTraverse(BinTreeNode rt, LinkedList list){
		if (rt==null) return;
		BinTreeNode p = rt;
		Stack s = new StackSLinked();
		while(p!=null||!s.isEmpty()){
			while (p!=null){		//先左后右不断深入
				s.push(p);			//将根节点入栈
				if (p.hasLChild()) p = p.getLChild();
				else p = p.getRChild();
			}
			if (!s.isEmpty()){
				p = (BinTreeNode)s.pop();		//取出栈顶根结点访问之
				list.insertLast(p);
			}
			//满足条件时，说明栈顶根节点右子树已访问，应出栈访问之
			while (!s.isEmpty()&&((BinTreeNode)s.peek()).getRChild()==p){
				p = (BinTreeNode)s.pop();
				list.insertLast(p);
			}
			//转向栈顶根结点的右子树继续后序遍历
			if (!s.isEmpty()) p = ((BinTreeNode)s.peek()).getRChild();
			else p = null;
		}
	}
	
	//按层遍历二叉树
	public Iterator levelOrder(){
		LinkedList list = new LinkedListDLNode();
		levelOrderTraverse(this.root,list);
		return list.elements();
	}
	//使用对列完成二叉树的按层遍历
	private void levelOrderTraverse(BinTreeNode rt, LinkedList list){
		if (rt==null) return;
		Queue q = new QueueArray();
		q.enqueue(rt);			//根结点入队
		while (!q.isEmpty()){
			BinTreeNode p = (BinTreeNode)q.dequeue();	//取出队首结点p并访问
			list.insertLast(p);
			if (p.hasLChild()) q.enqueue(p.getLChild());//将p的非空左右孩子依次入队
			if (p.hasRChild()) q.enqueue(p.getRChild());
		}
	}
}
