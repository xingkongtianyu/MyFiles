package dsa.adt;

import dsa.adt.AbstractGraph;
import dsa.exception.UnsupportedOperation;

public class UndirectedGraph extends AbstractGraph {
	
	public UndirectedGraph() {
		super(Graph.UndirectedGraph);
	}

	//删除一个顶点v
	public void remove(Vertex v) {
		while(v.getDeg()>0){
			Edge e = (Edge)v.getAdjacentEdges().first().getData();
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
		v.getAdjacentEdges().remove(e.getEdgeSecondPosition());
	}

	//返回从u指向v的边，不存在则返回null
	public Edge edgeFromTo(Vertex u, Vertex v){
		LinkedList adjEdge = u.getAdjacentEdges();
		Iterator it = adjEdge.elements();
		for(it.first(); !it.isDone(); it.next()){
			Edge e = (Edge)it.currentItem();
			if (e.getSecondVex()==v||e.getFirstVex()==v)
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
			Vertex i = e.getFirstVex();
			Vertex j = e.getSecondVex();
			if (i==u) adjVex.insertLast(j);
			else adjVex.insertLast(i);
		}
		return adjVex.elements();
	}

	//求无向图的最小生成树,如果是有向图不支持此操作
	//前提是无向图是连通图,算法不判断图的连通性
	public void generateMST(){
		resetVexStatus();	//重置图中各顶点的状态信息
		resetEdgeType();	//重置图中各边的类型信息
		Iterator it = getVertex();
		Vertex v = (Vertex)it.currentItem();//选第一个顶点作为起点
		v.setToVisited();		//顶点v进入集合S,以visited=true表示属于S，否则不属于S
		//初始化顶点集合S到V-S各顶点的最短横切边
		for(it.first(); !it.isDone(); it.next()){
			Vertex u = (Vertex)it.currentItem();
			Edge e = edgeFromTo(v,u);
			setCrossEdge(u,e);	//设置到达V-S中顶点u的最短横切边
		}
		for (int t=1;t<getVexNum();t++){	//进行|V|-1次循环找到|V|-1条边
			Vertex k = selectMinVertex(it);//中间顶点k
			k.setToVisited();				//顶点k加入S
			Edge mst = getCrossEdge(k);		//割(S , V - S) 的轻边
			if (mst!=null) mst.setToMST();	//将边加入MST
			//以k为中间顶点修改S到V-S中顶点的最短横切边
			Iterator adjIt = adjVertexs(k);	//取出k的所有邻接点
			for(adjIt.first(); !adjIt.isDone(); adjIt.next()){
				Vertex adjV = (Vertex)adjIt.currentItem();
				Edge e = this.edgeFromTo(k,adjV);
				if (e.getWeight()<getCrossWeight(adjV))//发现到达adjV更短的横切边
					setCrossEdge(adjV,e);
			}//for
		}//for(int t=1...
	}
	//查找轻边在V-S中的顶点
	protected Vertex selectMinVertex(Iterator it){
		Vertex min = null;
		for(it.first(); !it.isDone(); it.next()){
			Vertex v = (Vertex)it.currentItem();
			if(!v.isVisited()){ min = v; break;}
		}
		for(; !it.isDone(); it.next()){
			Vertex v = (Vertex)it.currentItem();
			if(!v.isVisited()&&getCrossWeight(v)<getCrossWeight(min))
				min = v;
		}
		return min;
	} 
	//求MST时，对v.application的操作
	protected int getCrossWeight(Vertex v){ 
		if (getCrossEdge(v)!=null) return getCrossEdge(v).getWeight();
		else return Integer.MAX_VALUE;
	}
	protected Edge getCrossEdge(Vertex v){ return (Edge)v.getAppObj();}
	protected void setCrossEdge(Vertex v, Edge e){ v.setAppObj(e);}
	
	//求有向图的拓扑序列,无向图不支持此操作
	public Iterator toplogicalSort() throws UnsupportedOperation{
		throw new UnsupportedOperation("不支持此操作");
	}

	//求有向无环图的关键路径,无向图不支持此操作
	public void criticalPath() throws UnsupportedOperation{
		throw new UnsupportedOperation("不支持此操作");
	}
}
