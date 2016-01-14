 // main7-1.cpp 检验bo7-1.cpp的主程序
 #include"c1.h"
 #define MAX_NAME 5 // 顶点字符串的最大长度+1
 #define MAX_INFO 20 // 相关信息字符串的最大长度+1
 typedef int VRType; // 顶点关系类型
 typedef char InfoType; // 相关信息类型
 typedef char VertexType[MAX_NAME]; // 顶点类型
 #include"c7-1.h"
 #include"bo7-1.cpp"

 void visit(VertexType i)
 {
   printf("%s ",i);
 }

 void main()
 {
   int i,j,k,n;
   MGraph g;
   VertexType v1,v2;
   printf("请顺序选择有向图,有向网,无向图,无向网\n");
   for(i=0;i<4;i++) // 验证4种情况
   {
     CreateGraph(g); // 构造图g
     Display(g); // 输出图g
     printf("插入新顶点，请输入顶点的值: ");
     scanf("%s",v1);
     InsertVex(g,v1);
     printf("插入与新顶点有关的弧或边，请输入弧或边数: ");
     scanf("%d",&n);
     for(k=0;k<n;k++)
     {
       printf("请输入另一顶点的值: ");
       scanf("%s",v2);
       if(g.kind<=1) // 有向
       {
         printf("对于有向图或网，请输入另一顶点的方向(0:弧头 1:弧尾): ");
         scanf("%d",&j);
         if(j) // v2是弧尾
           InsertArc(g,v2,v1);
         else // v2是弧头
           InsertArc(g,v1,v2);
       }
       else // 无向
         InsertArc(g,v1,v2);
     }
     Display(g); // 输出图g
     printf("删除顶点及相关的弧或边，请输入顶点的值: ");
     scanf("%s",v1);
     DeleteVex(g,v1);
     Display(g); // 输出图g
   }
   DestroyGraph(g); // 销毁图g
 }
