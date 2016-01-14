package dsa.adt;

import dsa.adt.List;

public interface BinTree {
	//返回树的规模
	public int getSize();
	//判断树是否为空
	public boolean isEmpty();
	//返回根结点引用
	public BinTreeNode getRoot();
	//获取树的高度
	public int getHeight();
	//在树中查找元素e，返回其所在结点
	public BinTreeNode find(Object e);
	//先序遍历二叉树
	public Iterator preOrder();
	//中序遍历二叉树
	public Iterator inOrder();
	//后序遍历二叉树
	public Iterator postOrder();
	//按层遍历二叉树
	public Iterator levelOrder();
}
