 // algo7-1.cpp 调用算法7.7、7.8
 #include"c1.h"
 #define MAX_NAME 2 // 顶点字符串的最大长度+1
 typedef char VertexType[MAX_NAME];
 typedef VertexType TElemType; // 定义树的元素类型为图的顶点类型
 #include"c6-5.h" // 孩子－兄弟二叉链表存储结构
 #include"func6-2.cpp" // 孩子－兄弟二叉链表存储结构的先根遍历操作
 typedef int InfoType; // 权值类型
 #include"c7-21.h" // bo7-2.cpp采用的存储类型
 #include"bo7-2.cpp" // 邻接表的基本操作

 void DFSTree(ALGraph G,int v,CSTree &T)
 { // 从第v个顶点出发深度优先遍历图G，建立以T为根的生成树。算法7.8
   Boolean first=TRUE;
   int w;
   CSTree p,q;
   visited[v]=TRUE;
   for(w=FirstAdjVex(G,G.vertices[v].data);w>=0;w=NextAdjVex(G,G.vertices[v].data,G.vertices[w].data)) // w依次为v的邻接顶点
     if(!visited[w]) // w顶点不曾被访问
     {
       p=(CSTree)malloc(sizeof(CSNode)); // 分配孩子结点
       strcpy(p->data,G.vertices[w].data);
       p->firstchild=NULL;
       p->nextsibling=NULL;
       if(first)
       { // w是v的第一个未被访问的邻接顶点
         T->firstchild=p;
         first=FALSE; // 是根的第一个孩子结点
       }
       else // w是v的其它未被访问的邻接顶点
	 q->nextsibling=p; // 是上一邻接顶点的兄弟姐妹结点(第1次不通过此处，以后q已赋值)
       q=p;
       DFSTree(G,w,q); // 从第w个顶点出发深度优先遍历图G，建立子生成树q
     }
 }

 void DFSForest(ALGraph G,CSTree &T)
 { // 建立无向图G的深度优先生成森林的(最左)孩子(右)兄弟链表T。算法7.7
   CSTree p,q;
   int v;
   T=NULL;
   for(v=0;v<G.vexnum;++v)
     visited[v]=FALSE; // 赋初值，visited[]在bo7-2.cpp中定义
   for(v=0;v<G.vexnum;++v) // 从第0个顶点找起
     if(!visited[v]) // 第v个顶点不曾被访问
     { // 第v顶点为新的生成树的根结点
       p=(CSTree)malloc(sizeof(CSNode)); // 分配根结点
       strcpy(p->data,G.vertices[v].data);
       p->firstchild=NULL;
       p->nextsibling=NULL;
       if(!T) // 是第一棵生成树的根(T的根)
         T=p;
       else // 是其它生成树的根(前一棵的根的＂兄弟＂)
	 q->nextsibling=p; // 第1次不通过此处，以后q已赋值
       q=p; // q指示当前生成树的根
       DFSTree(G,v,p); // 建立以p为根的生成树
     }
 }

 void print(char *i)
 {
   printf("%s ",i);
 }

 void main()
 {
   ALGraph g;
   CSTree t;
   printf("请选择无向图\n");
   CreateGraph(g); // 构造无向图g
   Display(g); // 输出无向图g
   DFSForest(g,t); // 建立无向图g的深度优先生成森林的孩子—兄弟链表t
   printf("先序遍历生成森林：\n");
   PreOrderTraverse(t,print); // 先序遍历生成森林的孩子—兄弟链表t
   printf("\n");
 }
