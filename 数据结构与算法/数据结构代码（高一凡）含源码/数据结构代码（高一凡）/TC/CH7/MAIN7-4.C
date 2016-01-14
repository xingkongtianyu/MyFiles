 /* main7-4.c 检验bo7-4.c的主程序 */
 #include"c1.h"
 #define MAX_NAME 3 /* 顶点字符串的最大长度+1 */
 typedef int InfoType; /* 权值类型 */
 typedef char VertexType[MAX_NAME]; /* 字符串类型 */
 #include"c7-4.h"
 #include"bo7-4.c"
 void visit(VertexType v)
 {
   printf("%s ",v);
 }

 void main()
 {
   int k,n;
   AMLGraph g;
   VertexType v1,v2;
   CreateGraph(&g);
   Display(g);
   printf("修改顶点的值，请输入原值 新值: ");
   scanf("%s%s",v1,v2);
   PutVex(&g,v1,v2);
   printf("插入新顶点，请输入顶点的值: ");
   scanf("%s",v1);
   InsertVex(&g,v1);
   printf("插入与新顶点有关的边，请输入边数: ");
   scanf("%d",&n);
   for(k=0;k<n;k++)
   {
     printf("请输入另一顶点的值: ");
     scanf("%s",v2);
     InsertArc(&g,v1,v2);
   }
   Display(g);
   printf("删除一条边，请输入待删除边的两顶点(以空格作为间隔)：");
   scanf("%s%s",v1,v2);
   DeleteArc(&g,v1,v2);
   Display(g);
   printf("删除顶点及相关的边，请输入顶点的值: ");
   scanf("%s",v1);
   DeleteVex(&g,v1);
   Display(g);
   printf("深度优先搜索的结果:\n");
   DFSTraverse(g,visit);
   printf("广度优先搜索的结果:\n");
   BFSTraverse(g,visit);
   DestroyGraph(&g);
 }