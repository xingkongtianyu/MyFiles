 // algo7-11.cpp 检验深度优先和广度优先的程序(邻接表存储表示)
 #include"c1.h"
 #define MAX_NAME 5 // 顶点字符串的最大长度+1
 typedef int InfoType; // 网的权值类型
 typedef char VertexType[MAX_NAME]; // 顶点类型为字符串
 #include"c7-21.h" // 邻接表存储结构
 #include"bo7-2.cpp" // 邻接表存储结构的基本操作

 void visit(char *i)
 {
   printf("%s ",i);
 }

 void main()
 {
   ALGraph g;
   CreateGraphF(g); // 利用数据文件创建无向图，在bo7-2.cpp中
   Display(g); // 输出无向图，在bo7-2.cpp中
   printf("深度优先搜索的结果:\n");
   DFSTraverse(g,visit); // 调用算法7.4，在bo7-2.cpp中
   DFSTraverse1(g,visit); // 另一种方法，在bo7-2.cpp中
   printf("广度优先搜索的结果:\n");
   BFSTraverse(g,visit); // 调用算法7.6，在bo7-2.cpp中
   BFSTraverse1(g,visit); // 另一种方法，在bo7-2.cpp中
   DestroyGraph(g); // 销毁图g
 }
