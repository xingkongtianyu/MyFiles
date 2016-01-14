 // bo3-6.cpp 用单链表的基本操作实现链队列(存储结构由c3-2.h定义)的基本操作(9个)
 typedef QElemType ElemType;
 #define LinkList QueuePtr // 定义单链表的类型与相应的链队列的类型相同
 #define LNode QNode
 #include"bo2-2.cpp" // 单链表的基本操作
 void InitQueue(LinkQueue &Q)
 { // 构造一个空队列Q
   InitList(Q.front); // 调用单链表的基本操作
   Q.rear=Q.front;
 }

 void DestroyQueue(LinkQueue &Q)
 { // 销毁队列Q(无论空否均可)
   DestroyList(Q.front);
   Q.rear=Q.front;
 }

 void ClearQueue(LinkQueue &Q)
 { // 将Q清为空队列
   ClearList(Q.front);
   Q.rear=Q.front;
 }

 Status QueueEmpty(LinkQueue Q)
 { // 若Q为空队列，则返回TRUE，否则返回FALSE
   return ListEmpty(Q.front);
 }

 int QueueLength(LinkQueue Q)
 { // 求队列的长度
   return ListLength(Q.front);
 }

 Status GetHead(LinkQueue Q,QElemType &e)
 { // 若队列不空，则用e返回Q的队头元素，并返回OK，否则返回ERROR
   return GetElem(Q.front,1,e);
 }

 void EnQueue(LinkQueue &Q,QElemType e)
 { // 插入元素e为Q的新的队尾元素
   QueuePtr p;
   if(!(p=(QueuePtr)malloc(sizeof(QNode)))) // 存储分配失败
     exit(OVERFLOW);
   p->data=e;
   p->next=NULL;
   Q.rear->next=p;
   Q.rear=p;
 }

 Status DeQueue(LinkQueue &Q,QElemType &e)
 { // 若队列不空，删除Q的队头元素，用e返回其值，并返回OK，否则返回ERROR
   if(Q.front->next==Q.rear) // 队列仅有1个元素(删除的也是队尾元素)
     Q.rear=Q.front; // 令队尾指针指向头结点
   return ListDelete(Q.front,1,e);
 }

 void QueueTraverse(LinkQueue Q,void(*vi)(QElemType))
 { // 从队头到队尾依次对队列Q中每个元素调用函数vi()
   ListTraverse(Q.front,vi);
 }
