 // c7-31.h 有向图的十字链表存储表示(与单链表的变量类型建立联系)
 #define MAX_VERTEX_NUM 20
 struct ArcBox1 // 用来定义hlink的类型
 {
   int tailvex,headvex; // 该弧的尾和头顶点的位置
   InfoType *info; // 该弧相关信息的指针，可指向权值或其他信息
   ArcBox1 *hlink,*tlink; // 分别为弧头相同弧尾相同的弧的链域
 };
 struct ElemType
 {
   int tailvex,headvex; // 该弧的尾和头顶点的位置
   InfoType *info; // 该弧相关信息的指针，可指向权值或其他信息
   ArcBox1 *hlink;
 };
 struct ArcBox
 {
   ElemType data;
   ArcBox *tlink;
 };
 struct VexNode // 顶点结点
 {
   VertexType data;
   ArcBox1 *firstin; // 指向该顶点第一条入弧
   ArcBox *firstout; // 指向该顶点第一条出弧
 };
 struct OLGraph
 {
   VexNode xlist[MAX_VERTEX_NUM]; // 表头向量(数组)
   int vexnum,arcnum; // 有向图的当前顶点数和弧数
 };
 #define LNode ArcBox // 加，定义单链表的结点类型是图的表结点的类型
 #define next tlink // 加，定义单链表结点的指针域是表结点指向下一条出弧的指针域
 typedef ArcBox *LinkList; // 加，定义指向单链表结点的指针是指向图的表结点的指针
