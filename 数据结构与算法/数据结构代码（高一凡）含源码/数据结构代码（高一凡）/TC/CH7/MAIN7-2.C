 /* main7-2.c 检验bo7-2.c的主程序 */
 #include"c1.h"
 #define MAX_NAME 3 /* 顶点字符串的最大长度+1 */
 typedef int InfoType; /* 网的权值类型 */
 typedef char VertexType[MAX_NAME]; /* 顶点类型为字符串 */
 #include"c7-21.h"
 #include"bo7-2.c"

 void print(char *i)
 {
   printf("%s ",i);
 }

 void main()
 {
   int i,j,k,n;
   ALGraph g;
   VertexType v1,v2;
   printf("请顺序选择有向图,有向网,无向图,无向网\n");
   for(i=0;i<4;i++) /* 验证4种情况 */
   {
     CreateGraph(&g);
     Display(g);
     printf("插入新顶点，请输入顶点的值: ");
     scanf("%s",v1);
     InsertVex(&g,v1);
     printf("插入与新顶点有关的弧或边，请输入弧或边数: ");
     scanf("%d",&n);
     for(k=0;k<n;k++)
     {
       printf("请输入另一顶点的值: ");
       scanf("%s",v2);
       if(g.kind<=1) /* 有向 */
       {
	 printf("对于有向图或网，请输入另一顶点的方向(0:弧头 1:弧尾): ");
	 scanf("%d",&j);
	 if(j)
	   InsertArc(&g,v2,v1);
	 else
	   InsertArc(&g,v1,v2);
       }
       else /* 无向 */
	 InsertArc(&g,v1,v2);
     }
     Display(g);
     if(i==3)
     {
       printf("删除一条边或弧，请输入待删除边或弧的弧尾 弧头：");
       scanf("%s%s",v1,v2);
       DeleteArc(&g,v1,v2);
       printf("修改顶点的值，请输入原值 新值: ");
       scanf("%s%s",v1,v2);
       PutVex(&g,v1,v2);
     }
     printf("删除顶点及相关的弧或边，请输入顶点的值: ");
     scanf("%s",v1);
     DeleteVex(&g,v1);
     Display(g);
     DestroyGraph(&g);
   }
 }