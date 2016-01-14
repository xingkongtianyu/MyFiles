 /* c7-21.h 图的邻接表存储表示(与单链表的变量类型建立联系) */
 #define MAX_VERTEX_NUM 20
 typedef enum{DG,DN,UDG,UDN}GraphKind; /* {有向图,有向网,无向图,无向网} */
 typedef struct /* 加 */
 {
   int adjvex; /* 该弧所指向的顶点的位置 */
   InfoType *info; /* 网的权值指针 */
 }ElemType;

 typedef struct ArcNode /* 改 */
 {
   ElemType data; /* 除指针以外的部分都属于ElemType */
   struct ArcNode *nextarc; /* 指向下一条弧的指针 */
 }ArcNode; /* 表结点 */

 typedef struct
 {
   VertexType data; /* 顶点信息 */
   ArcNode *firstarc; /* 第一个表结点的地址,指向第一条依附该顶点的弧的指针 */
 }VNode,AdjList[MAX_VERTEX_NUM]; /* 头结点 */

 typedef struct
 {
   AdjList vertices;
   int vexnum,arcnum; /* 图的当前顶点数和弧数 */
   GraphKind kind; /* 图的种类标志 */
 }ALGraph;
 #define LNode ArcNode /* 加，定义单链表的结点类型是图的表结点的类型 */
 #define next nextarc /* 加，定义单链表结点的指针域是表结点指向下一条弧的指针域 */
 typedef ArcNode *LinkList; /* 加，定义指向单链表结点的指针是指向图的表结点的指针 */
