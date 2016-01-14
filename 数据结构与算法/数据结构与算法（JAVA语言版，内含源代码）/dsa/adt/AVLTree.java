package dsa.adt;

import dsa.adt.BSTree;
import dsa.strategy.Strategy;
import dsa.strategy.DefaultStrategy;

public class AVLTree extends BSTree {
	
	public AVLTree() { super();}
	public AVLTree(Strategy strategy) { super(strategy); }
	
	private boolean isBalance(BinTreeNode v){
		if (v==null)	return true;
		int lH = (v.hasLChild()) ? v.getLChild().getHeight():-1;
		int rH = (v.hasRChild()) ? v.getRChild().getHeight():-1;
		return (Math.abs(lH - rH)<=1);
	}
	
	private BinTreeNode higherSubT(BinTreeNode v){
		if (v==null) return null;
		int lH = (v.hasLChild()) ? v.getLChild().getHeight():-1;
		int rH = (v.hasRChild()) ? v.getRChild().getHeight():-1;
		if (lH>rH) return v.getLChild();
		if (lH<rH) return v.getRChild();
		if (v.isLChild()) return v.getLChild();
		else return v.getRChild();
	}
	
	private BinTreeNode rotate(BinTreeNode z){
		BinTreeNode	y = higherSubT(z);		//取y为z更高的孩子
		BinTreeNode	x = higherSubT(y);		//取x为y更高的孩子
		boolean isLeft = z.isLChild();		//记录：z是否左孩子
		BinTreeNode	p = z.getParent();		//p为z的父亲
		BinTreeNode	a, b, c;				//自左向右，三个节点
		BinTreeNode	t0, t1, t2, t3;			//自左向右，四棵子树
		// 以下分四种情况
		if (y.isLChild()) {					//若y是左孩子，则
			c = z;	t3 = z.getRChild();
			if (x.isLChild()) {				//若x是左孩子(左左失衡)
				b = y;	t2 = y.getRChild();
				a = x;	t1 = x.getRChild();	t0 = x.getLChild();
			} else {						//若x是右孩子(左右失衡)
				a = y;	t0 = y.getLChild();
				b = x;	t1 = x.getLChild();	t2 = x.getRChild();
			}
		} else {							//若y是右孩子，则
			a = z;	t0 = z.getLChild();
			if (x.isRChild()) {				//若x是右孩子(右右失衡)
				b = y;	t1 = y.getLChild();
				c = x;	t2 = x.getLChild();	t3 = x.getRChild();
			} else {						//若x是左孩子(右左失衡)
				c = y;	t3 = y.getRChild();
				b = x;	t1 = x.getLChild();	t2 = x.getRChild();
			}
		}

		//摘下三个节点
		z.sever();
		y.sever();
		x.sever();

		//摘下四棵子树
		if (t0!=null) t0.sever();
		if (t1!=null) t1.sever();
		if (t2!=null) t2.sever();
		if (t3!=null) t3.sever();

		//重新链接
		a.setLChild(t0);	a.setRChild(t1);
		c.setLChild(t2);	c.setRChild(t3);
		b.setLChild(a);		b.setRChild(c);

		//子树重新接入原树
		if (p!=null)
			if (isLeft)	p.setLChild(b);
			else		p.setRChild(b);

		return b;//返回新的子树根
	}
	
	private BinTreeNode reBalance(BinTreeNode v){
		if (v==null)	return root;
		BinTreeNode c = v;
		while (v!=null) {						//从v开始，向上逐一检查z的祖先
			if (!isBalance(v))	v = rotate(v);	//若v失衡，则旋转使之重新平衡
			c = v;
			v = v.getParent();					//继续检查其父亲
		}//while
		return c;
	}
	
	//按关键字插入元素ele
	public void insert(Object ele){
		super.insert(ele);
		root = reBalance(startBN);
	}
	
	//若查找表中存在与元素ele关键字相同元素，则删除一个并返回；否则，返回null
	public Object remove(Object ele){
		Object obj = super.remove(ele);
		root = reBalance(startBN);
		return obj;
	}
}
