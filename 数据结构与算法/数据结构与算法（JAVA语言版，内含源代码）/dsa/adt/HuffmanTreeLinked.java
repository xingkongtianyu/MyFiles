package dsa.adt;

import dsa.adt.BinaryTreeLinked;
import dsa.strategy.Strategy;
import dsa.strategy.DefaultStrategy;

public class HuffmanTreeLinked extends BinaryTreeLinked {
	public HuffmanTreeLinked(HuffmanTreeNode[] nodes) {
		this(nodes,new DefaultStrategy());
		
	}
	public HuffmanTreeLinked(HuffmanTreeNode[] nodes, Strategy strategy){
		super(buildHuffmanTree(nodes),strategy);
		generateHuffmanCode((HuffmanTreeNode)super.getRoot());
	}
	
	//返回Huffman的所有叶子结点
	public Iterator getAllLeafs(){
		LinkedList list = new LinkedListDLNode();
		getLeafs(getRoot(),list);
		return list.elements();
	}
	private void getLeafs(HuffmanTreeNode root, LinkedList list){
		if (root==null) return;
		if (root.isLeaf()) list.insertLast(root);
		getLeafs(root.getLChild(),list);
		getLeafs(root.getRChild(),list);
	}
	
	//递归生成Huffman编码
	private static void generateHuffmanCode(HuffmanTreeNode root){
		if (root==null) return;
		if (root.hasParent()){
			if (root.isLChild()) root.setCoding(root.getParent().getCoding() + "0");
			else				 root.setCoding(root.getParent().getCoding() + "1");
		}
		generateHuffmanCode(root.getLChild());
		generateHuffmanCode(root.getRChild());
	}
	
	//通过结点数组生成Huffman树
	private static HuffmanTreeNode buildHuffmanTree(HuffmanTreeNode[] nodes){
		int n = nodes.length;
		if (n<2) return nodes[0];
		List l = new ListArray();	//根结点线性表，按weight从大到小有序
		for (int i=0; i<n; i++)		//将结点逐一插入线性表
			insertToList(l,nodes[i]);
		for (int i=1; i<n; i++){	//选择weight最小的两棵树合并，循环n-1次
			HuffmanTreeNode min1 = (HuffmanTreeNode)l.remove(l.getSize()-1);//选择weight最小的树
			HuffmanTreeNode min2 = (HuffmanTreeNode)l.remove(l.getSize()-1);//选择weight次小的树
			HuffmanTreeNode newRoot = new HuffmanTreeNode(min1.getWeight()+min2.getWeight());//合并
			newRoot.setLChild(min1);
			newRoot.setRChild(min2);
			insertToList(l,newRoot);//新树插入线性表
		}
		return (HuffmanTreeNode)l.get(0);//返回Huffman树的根
	}
	//将结点按照weight从大到小的顺序插入线性表
	private static void insertToList(List l, HuffmanTreeNode node){
		for (int j=0; j<l.getSize(); j++)
			if (node.getWeight()>((HuffmanTreeNode)l.get(j)).getWeight()){
				l.insert(j,node);
				return;
			}
		l.insert(l.getSize(),node);
	}
	
	public HuffmanTreeNode getRoot(){
		return (HuffmanTreeNode)super.getRoot();
	}
}
