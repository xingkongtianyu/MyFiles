 // algo7-9.cpp 实现教科书图7.33的程序(另加孤立顶点台北)
 #define MAX_NAME 9 // 顶点字符串的最大长度+1
 #define MAX_INFO 20 // 相关信息字符串的最大长度+1
 typedef int VRType;
 typedef char VertexType[MAX_NAME];
 typedef char InfoType;
 #include"c1.h"
 #include"c7-1.h" // 邻接矩阵存储表示
 #include"bo7-1.cpp" // 邻接矩阵存储表示的基本操作

 typedef int PathMatrix[MAX_VERTEX_NUM][MAX_VERTEX_NUM][MAX_VERTEX_NUM]; // 3维数组
 typedef int DistancMatrix[MAX_VERTEX_NUM][MAX_VERTEX_NUM]; // 2维数组
 #include"func7-2.cpp" // 求有向网中各对顶点之间最短距离的Floyd算法

 void path(MGraph G,PathMatrix P,int i,int j)
 { // 求由序号为i的起点城市到序号为j的终点城市最短路径沿途所经过的城市
   int k;
   int m=i; // 起点城市序号赋给m
   printf("依次经过的城市：\n");
   while(m!=j) // 没到终点城市
   {
     G.arcs[m][m].adj=INFINITY; // 对角元素赋值无穷大
     for(k=0;k<G.vexnum;k++)
       if(G.arcs[m][k].adj<INFINITY&&P[m][j][k]) // m到k有直接通路，且k在m到j的最短路径上
       {
         printf("%s ",G.vexs[m]);
         G.arcs[m][k].adj=G.arcs[k][m].adj=INFINITY; // 将直接通路设为不通
         m=k; // 经过的城市序号赋给m，继续查找
         break;
       }
   }
   printf("%s\n",G.vexs[j]); // 输出终点城市
 }

 void main()
 {
   MGraph g;
   int i,j,k,q=1;
   PathMatrix p; // 3维数组
   DistancMatrix d; // 2维数组
   printf("数据文件名为map.txt\n");
   CreateFUDN(g); // 通过文件构造无向网g
   for(i=0;i<g.vexnum;i++)
     g.arcs[i][i].adj=0; // ShortestPath_FLOYD()要求对角元素值为0，因为两点相同，其距离为0
   ShortestPath_FLOYD(g,p,d); // 求每对顶点间的最短路径，在func7-2.cpp中
   while(q)
   {
     printf("请选择：1 查询  0 结束\n");
     scanf("%d",&q);
     if(q)
     {
       for(i=0;i<g.vexnum;i++)
       {
         printf("%2d %-9s",i+1,g.vexs[i]);
         if(i%6==5) // 输出6个数据就换行
           printf("\n");
       }
       printf("\n请输入要查询的起点城市代码 终点城市代码: ");
       scanf("%d%d",&i,&j);
       if(d[i-1][j-1]<INFINITY) // 有通路
       {
         printf("%s到%s的最短距离为%d\n",g.vexs[i-1],g.vexs[j-1],d[i-1][j-1]);
         path(g,p,i-1,j-1); // 求最短路径上由起点城市到终点城市沿途所经过的城市
       }
       else
         printf("%s到%s没有路径可通\n",g.vexs[i-1],g.vexs[j-1]);
       printf("与%s到%s有关的p矩阵:\n",g.vexs[i-1],g.vexs[j-1]);
       for(k=0;k<g.vexnum;k++)
         printf("%2d",p[i-1][j-1][k]);
       printf("\n");
     }
   }
 }
