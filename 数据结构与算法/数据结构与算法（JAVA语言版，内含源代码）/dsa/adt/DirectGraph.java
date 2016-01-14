package dsa.adt;

import dsa.adt.AbstractGraph;
import dsa.exception.UnsupportedOperation;

public class DirectGraph extends AbstractGraph {
	
	public DirectGraph() {
		super(Graph.DirectedGraph);
	}
	
	//删除一个顶点v
	public void remove(Vertex v) {
		while (v.getOutDeg()>0){
			Edge e = (Edge)v.getAdjacentEdges().first().getData();
			remove(e);
		}
		while (v.getInDeg()>0){
			Edge e = (Edge)v.getReAdjacentEdges().first().getData();
			remove(e);
		}
		vertexs.remove(v.getVexPosition());
	}

	//删除一条边e
	public void remove(Edge e) {
		edges.remove(e.getEdgePosition());
		Vertex u = e.getFirstVex();
		Vertex v = e.getSecondVex();
		u.getAdjacentEdges().remove(e.getEdgeFirstPosition());
		v.getReAdjacentEdges().remove(e.getEdgeSecondPosition());
	}
	
	//返回从u指向v的边，不存在则返回null
	public Edge edgeFromTo(Vertex u, Vertex v){
		LinkedList adjEdge = u.getAdjacentEdges();
		Iterator it = adjEdge.elements();
		for(it.first(); !it.isDone(); it.next()){
			Edge e = (Edge)it.currentItem();
			if (e.getSecondVex()==v)
				return e;
		}
		return null;
	}
	
	//返回从u出发可以直接到达的邻接顶点
	public Iterator adjVertexs(Vertex u){
		LinkedList adjVex = new LinkedListDLNode();
		LinkedList adjEdge = u.getAdjacentEdges();
		Iterator it = adjEdge.elements();
		for(it.first(); !it.isDone(); it.next()){
			Edge e = (Edge)it.currentItem();
			adjVex.insertLast(e.getSecondVex());
		}
		return adjVex.elements();
	}
	
	//求无向图的最小生成树,如果是有向图不支持此操作
	public void generateMST() throws UnsupportedOperation{
		throw new UnsupportedOperation("不支持此操作");
	}

	//求有向图的拓扑序列,无向图不支持此操作
	public Iterator toplogicalSort(){
		LinkedList topSeq = new LinkedListDLNode();//拓扑序列
		Stack s = new StackSLinked();
		Iterator it = getVertex();
		for(it.first(); !it.isDone(); it.next()){//初始化顶点集应用信息
			Vertex v = (Vertex)it.currentItem();
			v.setAppObj(Integer.valueOf(v.getInDeg()));
			if (v.getInDeg()==0) s.push(v);
		}
		while (!s.isEmpty()){
			Vertex v = (Vertex)s.pop();
			topSeq.insertLast(v);//生成拓扑序列
			Iterator adjIt = adjVertexs(v);
			for(adjIt.first(); !adjIt.isDone(); adjIt.next()){
				Vertex adjV = (Vertex)adjIt.currentItem();
				int in = getTopInDe(adjV)-1;
				setTopInDe(adjV, in);
				if (getTopInDe(adjV)==0) s.push(adjV);
			}//for adjIt
		}//while
		if (topSeq.getSize()<getVexNum()) return null;
		else return topSeq.elements();
	}

	//求有向无环图的关键路径,无向图不支持此操作
	public void criticalPath(){
		Iterator it = toplogicalSort();
		resetEdgeType();	//重置图中各边的类型信息
		if (it==null) return;
		LinkedList reTopSeq = new LinkedListDLNode();
		for(it.first(); !it.isDone(); it.next()){	//初始化各点ve与vl，并生成逆拓扑序列
			Vertex v = (Vertex)it.currentItem();
			Vtime time = new Vtime(0,Integer.MAX_VALUE);//ve=0,vl=Integer.MAX_VALUE
			v.setAppObj(time);
			reTopSeq.insertFirst(v);
		}
		for(it.first(); !it.isDone(); it.next()){	//正向拓扑序列求各点ve
			Vertex v = (Vertex)it.currentItem();
			Iterator adjIt = adjVertexs(v);
			for(adjIt.first(); !adjIt.isDone(); adjIt.next()){
				Vertex adjV = (Vertex)adjIt.currentItem();
				Edge e = edgeFromTo(v,adjV);
				if (getVE(v)+e.getWeight()>getVE(adjV))	//更新最早开始时间
					setVE(adjV, getVE(v)+e.getWeight());
			}
		}
		Vertex dest = (Vertex)reTopSeq.first().getData();
		setVL(dest, getVE(dest));	//设置汇点vl=ve
		Iterator reIt = reTopSeq.elements();
		for(reIt.first(); !reIt.isDone(); reIt.next()){	//逆向拓扑序列求各点vl
			Vertex v = (Vertex)reIt.currentItem();
			Iterator adjIt = adjVertexs(v);
			for(adjIt.first(); !adjIt.isDone(); adjIt.next()){
				Vertex adjV = (Vertex)adjIt.currentItem();
				Edge e = edgeFromTo(v,adjV);
				if (getVL(v)>getVL(adjV)-e.getWeight())	//更新最迟开始时间
					setVL(v, getVL(adjV)-e.getWeight());
			}
		}
		Iterator edIt = edges.elements();
		for(edIt.first(); !edIt.isDone(); edIt.next()){	//求关键活动
			Edge e = (Edge)edIt.currentItem();
			Vertex u = e.getFirstVex();
			Vertex v = e.getSecondVex();
			if (getVE(u)==getVL(v)-e.getWeight()) e.setToCritical();
		}
	}
	
	private int getTopInDe(Vertex v){
		return ((Integer)v.getAppObj()).intValue();
	}
	private void setTopInDe(Vertex v, int indegree){
		v.setAppObj(Integer.valueOf(indegree));
	}
	private int getVE(Vertex v){
		return ((Vtime)v.getAppObj()).getVE();
	}
	private int getVL(Vertex v){
		return ((Vtime)v.getAppObj()).getVL();
	}
	private void setVE(Vertex v, int ve){
		((Vtime)v.getAppObj()).setVE(ve);
	}
	private void setVL(Vertex v, int vl){
		((Vtime)v.getAppObj()).setVL(vl);
	}
}
