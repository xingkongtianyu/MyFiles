 // algo7-8.cpp 克鲁斯卡尔算法求无向连通网的最小生成树的程序
 #include"c1.h"
 typedef int VRType;
 typedef char InfoType;
 #define MAX_NAME 3 // 顶点字符串的最大长度+1
 #define MAX_INFO 20 // 相关信息字符串的最大长度+1
 typedef char VertexType[MAX_NAME];
 #include"c7-1.h"
 #include"bo7-1.cpp"
 void kruskal(MGraph G)
 {
   int set[MAX_VERTEX_NUM],i,j;
   int k=0,a=0,b=0,min=G.arcs[a][b].adj;
   for(i=0;i<G.vexnum;i++)
     set[i]=i; // 初态，各顶点分别属于各个集合
   printf("最小代价生成树的各条边为:\n");
   while(k<G.vexnum-1) // 最小生成树的边数小于顶点数-1
   { // 寻找最小权值的边
     for(i=0;i<G.vexnum;++i)
       for(j=i+1;j<G.vexnum;++j) // 无向网，只在上三角查找
	 if(G.arcs[i][j].adj<min)
	 {
	   min=G.arcs[i][j].adj; // 最小权值
	   a=i; // 边的一个顶点
	   b=j; // 边的另一个顶点
	 }
     min=G.arcs[a][b].adj=INFINITY; // 删除上三角中该边，下次不再查找
     if(set[a]!=set[b]) // 边的两顶点不属于同一集合
     {
       printf("%s-%s\n",G.vexs[a],G.vexs[b]); // 输出该边
       k++; // 边数+1
       for(i=0;i<G.vexnum;i++)
         if(set[i]==set[b]) // 将顶点b所在集合并入顶点a集合中
           set[i]=set[a];
     }
   }
 }

 void main()
 {
   MGraph g;
   CreateUDN(g); // 构造无向网g
   Display(g); // 输出无向网g
   kruskal(g); // 用克鲁斯卡尔算法输出g的最小生成树的各条边
 }
