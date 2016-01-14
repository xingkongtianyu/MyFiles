 // algo7-10.cpp 检验深度优先和广度优先的程序(邻接矩阵存储表示)
 #include"c1.h"
 #define MAX_NAME 5 // 顶点字符串的最大长度+1
 #define MAX_INFO 20 // 相关信息字符串的最大长度+1
 typedef int VRType; // 顶点关系类型
 typedef char InfoType; // 相关信息类型
 typedef char VertexType[MAX_NAME]; // 顶点类型
 #include"c7-1.h" // 邻接矩阵存储表示
 #include"bo7-1.cpp" // 邻接矩阵存储表示的基本操作

 void visit(VertexType i)
 {
   printf("%s ",i);
 }

 void main()
 {
   MGraph g;
   VertexType v1,v2;
   CreateFUDG(g); // 利用数据文件创建无向图，在bo7-1.cpp中
   Display(g); // 输出无向图,在bo7-1.cpp中
   printf("深度优先搜索的结果:\n");
   DFSTraverse(g,visit); // 在bo7-1.cpp中
   printf("修改顶点的值，请输入原值 新值: ");
   scanf("%s%s",v1,v2);
   PutVex(g,v1,v2); // 在bo7-1.cpp中
   printf("删除一条边或弧，请输入待删除边或弧的弧尾 弧头：");
   scanf("%s%s",v1,v2);
   DeleteArc(g,v1,v2); // 在bo7-1.cpp中
   printf("广度优先搜索的结果:\n");
   BFSTraverse(g,visit); // 在bo7-1.cpp中
 }
