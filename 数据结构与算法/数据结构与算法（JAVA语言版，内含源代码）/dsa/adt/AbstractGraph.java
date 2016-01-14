package dsa.adt;

import dsa.adt.Graph;
import dsa.adt.Vertex;
import dsa.adt.List;
import dsa.adt.Edge;
import dsa.exception.UnsupportedOperation;
import dsa.adt.Path;

public abstract class AbstractGraph implements Graph {
	protected LinkedList vertexs;//顶点表
	protected LinkedList edges;	//边表
	protected int type;			//图的类型
	
	public AbstractGraph(int type){
		this.type = type;
		vertexs = new LinkedListDLNode();
		edges = new LinkedListDLNode();
	}
	
	//返回图的类型
	public int getType(){
		return type;
	}
	//返回图的顶点数
	public int getVexNum() {
		return vertexs.getSize();
	}
	
	//返回图的边数
	public int getEdgeNum() {
		return edges.getSize();
	}
	
	//返回图的所有顶点
	public Iterator getVertex() {
		return vertexs.elements();
	}

	//返回图的所有边
	public Iterator getEdge() {
		return edges.elements();
	}
	
	//添加一个顶点v
	public Node insert(Vertex v) {
		return vertexs.insertLast(v);
	}

	//添加一条边e
	public Node insert(Edge e) {
		return edges.insertLast(e);
	}

	//判断顶点u、v是否邻接，即是否有边从u到v
	public boolean areAdjacent(Vertex u, Vertex v) {
		return edgeFromTo(u,v)!=null;
	}
	
	//对图进行深度优先遍历
	public Iterator DFSTraverse(Vertex v) {
		LinkedList traverseSeq = new LinkedListDLNode();//遍历结果
		resetVexStatus();			//重置顶点状态
		DFS(v, traverseSeq);		//从v点出发深度优先搜索
		Iterator it = getVertex();	//从图中未曾访问的其他顶点出发重新搜索
		for(it.first(); !it.isDone(); it.next()){
			Vertex u = (Vertex)it.currentItem();
			if (!u.isVisited()) DFS(u, traverseSeq);
		}
		return traverseSeq.elements();
	}
	//深度优先的递归算法
	private void DFSRecursion(Vertex v, LinkedList list){
		v.setToVisited();
		list.insertLast(v);
		Iterator it = adjVertexs(v);//取得顶点v的所有邻接点
		for(it.first(); !it.isDone(); it.next()){
			Vertex u = (Vertex)it.currentItem();
			if (!u.isVisited()) DFSRecursion(u,list);
		}
	}
	//深度优先的非递归算法
	private void DFS(Vertex v, LinkedList list){
		Stack s = new StackSLinked();
		s.push(v);
		while (!s.isEmpty()){
			Vertex u = (Vertex)s.pop();
			if (!u.isVisited()){
				u.setToVisited();
				list.insertLast(u);
				Iterator it = adjVertexs(u);
				for(it.first(); !it.isDone(); it.next()){
					Vertex adj = (Vertex)it.currentItem();
					if (!adj.isVisited()) s.push(adj);
				}
			}//if
		}//while
	}

	//对图进行广度优先遍历
	public Iterator BFSTraverse(Vertex v) {
		LinkedList traverseSeq = new LinkedListDLNode();//遍历结果
		resetVexStatus();			//重置顶点状态
		BFS(v, traverseSeq);		//从v点出发广度优先搜索
		Iterator it = getVertex();	//从图中未曾访问的其他顶点出发重新搜索
		for(it.first(); !it.isDone(); it.next()){
			Vertex u = (Vertex)it.currentItem();
			if (!u.isVisited()) BFS(u, traverseSeq);
		}
		return traverseSeq.elements();
	}
	private void BFS(Vertex v, LinkedList list){
		Queue q = new QueueSLinked();
		v.setToVisited();
		list.insertLast(v);
		q.enqueue(v);
		while (!q.isEmpty()){
			Vertex u = (Vertex)q.dequeue();
			Iterator it = adjVertexs(u);
			for(it.first(); !it.isDone(); it.next()){
				Vertex adj = (Vertex)it.currentItem();
				if (!adj.isVisited()){
					adj.setToVisited();
					list.insertLast(adj);
					q.enqueue(adj);
				}//if
			}//for
		}//while
	}

	//求顶点v到其他顶点的最短路径
	public Iterator shortestPath(Vertex v) {
		LinkedList sPath = new LinkedListDLNode();
		resetVexStatus();//重置图中各顶点的状态信息
		Iterator it = getVertex();//初始化，将v到各顶点的最短距离初始化为由v直接可达的距离
		for(it.first(); !it.isDone(); it.next()){
			Vertex u = (Vertex)it.currentItem();
			int weight = Integer.MAX_VALUE;
			Edge e = edgeFromTo(v,u);
			if (e!=null)
				weight = e.getWeight();
			if(u==v) weight = 0;
			Path p = new Path(weight,v,u);
			setPath(u, p);
		}
		v.setToVisited();//顶点v进入集合S,以visited=true表示属于S，否则不属于S
		sPath.insertLast(getPath(v));//求得的最短路径进入链接表
		for (int t=1;t<getVexNum();t++){//进行n-1次循环找到n-1条最短路径
			Vertex k = selectMin(it);//中间顶点k。可能选出无穷大距离的点，但不会为空
			k.setToVisited();				//顶点k加入S
			sPath.insertLast(getPath(k));	//求得的最短路径进入链接表
			int distK = getDistance(k);		//以k为中间顶点修改v到V-S中顶点的当前最短路径
			Iterator adjIt = adjVertexs(k);	//取出k的所有邻接点
			for(adjIt.first(); !adjIt.isDone(); adjIt.next()){
				Vertex adjV = (Vertex)adjIt.currentItem();
				Edge e = edgeFromTo(k,adjV);
				if ((long)distK+(long)e.getWeight()<(long)getDistance(adjV)){//发现更短的路径
					setDistance(adjV, distK+e.getWeight());
					amendPathInfo(k,adjV);	//以k的路径信息修改adjV的路径信息
				}
			}//for
		}//for(int t=1...
		return sPath.elements();
	}
	//在顶点集合中选择路径距离最小的
	protected Vertex selectMin(Iterator it){
		Vertex min = null;
		for(it.first(); !it.isDone(); it.next()){
			Vertex v = (Vertex)it.currentItem();
			if(!v.isVisited()){ min = v; break;}
		}
		for(; !it.isDone(); it.next()){
			Vertex v = (Vertex)it.currentItem();
			if(!v.isVisited()&&getDistance(v)<getDistance(min))
				min = v;
		}
		return min;
	}
	//修改到终点的路径信息
	protected void amendPathInfo(Vertex mid, Vertex end){
		Iterator it = getPath(mid).getPathInfo();
		getPath(end).clearPathInfo();
		for(it.first(); !it.isDone(); it.next()){
			getPath(end).addPathInfo(it.currentItem());
		}
		getPath(end).addPathInfo(mid.getInfo());
	}

	//删除一个顶点v
	public abstract void remove(Vertex v);

	//删除一条边e
	public abstract void remove(Edge e);
	
	//返回从u指向v的边，不存在则返回null
	public abstract Edge edgeFromTo(Vertex u, Vertex v);
	
	//返回从u出发可以直接到达的邻接顶点
	public abstract Iterator adjVertexs(Vertex u);
	
	//求无向图的最小生成树,如果是有向图不支持此操作
	public abstract void generateMST() throws UnsupportedOperation;

	//求有向图的拓扑序列,无向图不支持此操作
	public abstract Iterator toplogicalSort() throws UnsupportedOperation;

	//求有向无环图的关键路径,无向图不支持此操作
	public abstract void criticalPath() throws UnsupportedOperation;

	//辅助方法，重置图中各顶点的状态信息
	protected void resetVexStatus(){
		Iterator it = getVertex();
		for(it.first(); !it.isDone(); it.next()){
			Vertex u = (Vertex)it.currentItem();
			u.resetStatus();
		}		
	}
	//重置图中各边的状态信息
	protected void resetEdgeType(){
		Iterator it = getEdge();
		for(it.first(); !it.isDone(); it.next()){
			Edge e = (Edge)it.currentItem();
			e.resetType();
		}		
	}
	//求最短路径时，对v.application的操作
	protected int getDistance(Vertex v){ return ((Path)v.getAppObj()).getDistance();}
	protected void setDistance(Vertex v, int dis){ ((Path)v.getAppObj()).setDistance(dis);}
	protected Path getPath(Vertex v){ return (Path)v.getAppObj();}
	protected void setPath(Vertex v, Path p){ v.setAppObj(p);}

}
