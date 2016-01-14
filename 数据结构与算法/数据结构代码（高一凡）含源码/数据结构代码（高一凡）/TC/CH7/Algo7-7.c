 /* algo7-7.c 实现算法7.16的程序 */
 #define MAX_NAME 5 /* 顶点字符串的最大长度+1 */
 #define MAX_INFO 20 /* 相关信息字符串的最大长度+1 */
 typedef int VRType;
 typedef char VertexType[MAX_NAME];
 typedef char InfoType;
 #include"c1.h"
 #include"c7-1.h" /* 邻接矩阵存储表示 */
 #include"bo7-1.c" /* 邻接矩阵存储表示的基本操作 */
 typedef int PathMatrix[MAX_VERTEX_NUM][MAX_VERTEX_NUM][MAX_VERTEX_NUM]; /* 3维数组 */
 typedef int DistancMatrix[MAX_VERTEX_NUM][MAX_VERTEX_NUM]; /* 2维数组 */
 #include"func7-2.c" /* 求有向网中各对顶点之间最短距离的Floyd算法 */

 void main()
 {
   MGraph g;
   int i,j,k;
   PathMatrix p; /* 3维数组 */
   DistancMatrix d; /* 2维数组 */
   CreateDN(&g); /* 构造有向网g */
   for(i=0;i<g.vexnum;i++)
     g.arcs[i][i].adj=0; /* ShortestPath_FLOYD()要求对角元素值为0，因为两点相同，其距离为0 */
   Display(g); /* 输出有向网g */
   ShortestPath_FLOYD(g,p,d); /* 求每对顶点间的最短路径，在func7-2.c中 */
   printf("d矩阵:\n");
   for(i=0;i<g.vexnum;i++)
   {
     for(j=0;j<g.vexnum;j++)
       printf("%6d",d[i][j]);
     printf("\n");
   }
   for(i=0;i<g.vexnum;i++)
     for(j=0;j<g.vexnum;j++)
       if(i!=j)
         printf("%s到%s的最短距离为%d\n",g.vexs[i],g.vexs[j],d[i][j]);
   printf("p矩阵:\n");
   for(i=0;i<g.vexnum;i++)
     for(j=0;j<g.vexnum;j++)
       if(i!=j)
       {
         printf("由%s到%s经过：",g.vexs[i],g.vexs[j]);
         for(k=0;k<g.vexnum;k++)
           if(p[i][j][k]==1)
             printf("%s ",g.vexs[k]);
         printf("\n");
       }
 }
