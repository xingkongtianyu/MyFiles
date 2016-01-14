package dsa.adt;

import dsa.adt.Node;

public class BinTreeNode implements Node {
	
	private Object data;		//数据域
	private BinTreeNode parent;	//父结点
	private BinTreeNode lChild;	//左孩子
	private BinTreeNode rChild;	//右孩子
	private int height;			//以该结点为根的子树的高度
	private int size;			//该结点子孙数（包括结点本身）
	
	public BinTreeNode() {
		this(null);
	}
	public BinTreeNode(Object e) {
		data = e;
		parent = lChild = rChild = null;
		height = 0;
		size = 1;
	}

	/******Node接口方法******/
	public Object getData() { return data; }
	public void setData(Object obj) { data = obj;}	

	/******辅助方法,判断当前结点位置情况******/
	//判断是否有父亲
	public boolean hasParent(){ return parent!=null;}
	//判断是否有左孩子
	public boolean hasLChild(){ return lChild!=null;}
	//判断是否有右孩子
	public boolean hasRChild(){ return rChild!=null;}
	//判断是否为叶子结点
	public boolean isLeaf(){ return !hasLChild()&&!hasRChild();}
	//判断是否为某结点的左孩子
	public boolean isLChild(){ return (hasParent()&&this==parent.lChild);}
	//判断是否为某结点的右孩子
	public boolean isRChild(){ return (hasParent()&&this==parent.rChild);}
	
	/******与height相关的方法******/
	//取结点的高度,即以该结点为根的树的高度
	public int getHeight() { return height; }
	//更新当前结点及其祖先的高度
	public void updateHeight(){
		int newH = 0;//新高度初始化为0,高度等于左右子树高度加1中大的
		if (hasLChild()) newH = Math.max(newH,1+getLChild().getHeight());
		if (hasRChild()) newH = Math.max(newH,1+getRChild().getHeight());
		if (newH==height) return;	//高度没有发生变化则直接返回
		height = newH;				//否则更新高度
		if (hasParent()) getParent().updateHeight();	//递归更新祖先的高度
	}
	
	/******与size相关的方法******/
	//取以该结点为根的树的结点数
	public int getSize() { return size; }
	//更新当前结点及其祖先的子孙数
	public void updateSize(){
		size = 1;	//初始化为1,结点本身
		if (hasLChild()) size += getLChild().getSize();	//加上左子树规模
		if (hasRChild()) size += getRChild().getSize();	//加上右子树规模
		if (hasParent()) getParent().updateSize();		//递归更新祖先的规模
	}
	
	/******与parent相关的方法******/
	//取父结点
	public BinTreeNode getParent() { return parent; }
	//断开与父亲的关系
	public void sever(){
		if (!hasParent()) return;
		if (isLChild()) parent.lChild = null;
		else			parent.rChild = null;
		parent.updateHeight();	//更新父结点及其祖先高度
		parent.updateSize();	//更新父结点及其祖先规模
		parent = null;
	}

	/******与lChild相关的方法******/
	//取左孩子
	public BinTreeNode getLChild() { return lChild; }
	//设置当前结点的左孩子,返回原左孩子
	public BinTreeNode setLChild(BinTreeNode lc){
		BinTreeNode oldLC = this.lChild;
		if (hasLChild()) { lChild.sever();}	//断开当前左孩子与结点的关系
		if (lc!=null){
			lc.sever();				//断开lc与其父结点的关系
			this.lChild = lc;		//确定父子关系
			lc.parent = this;
			this.updateHeight();	//更新当前结点及其祖先高度
			this.updateSize();		//更新当前结点及其祖先规模
		}
		return oldLC;				//返回原左孩子
	}

	/******与rChild相关的方法******/
	//取右孩子
	public BinTreeNode getRChild() { return rChild; }
	//设置当前结点的右孩子,返回原右孩子
	public BinTreeNode setRChild(BinTreeNode rc){
		BinTreeNode oldRC = this.rChild;
		if (hasRChild()) { rChild.sever();}	//断开当前右孩子与结点的关系
		if (rc!=null){
			rc.sever();				//断开lc与其父结点的关系
			this.rChild = rc;		//确定父子关系
			rc.parent = this;
			this.updateHeight();	//更新当前结点及其祖先高度
			this.updateSize();		//更新当前结点及其祖先规模
		}
		return oldRC;				//返回原右孩子
	}
}
