 // bo3-9.cpp 顺序非循环队列(存储结构由c3-4.h定义)的基本操作(4个)
 int QueueLength(SqQueue2 Q)
 { // 返回Q的元素个数，即队列的长度
   return(Q.rear-Q.front);
 }

 void EnQueue(SqQueue2 &Q,QElemType e)
 { // 插入元素e为Q的新的队尾元素
   if(Q.rear==Q.queuesize)
   { // 队列满，增加存储单元
     Q.base=(QElemType *)realloc(Q.base,(Q.queuesize+QUEUE_INCREMENT)*sizeof(QElemType));
     if(!Q.base) // 增加单元失败
       exit(ERROR);
   }
   Q.base[Q.rear++]=e;
 }

 Status DeQueue(SqQueue2 &Q,QElemType &e)
 { // 若队列不空，则删除Q的队头元素，用e返回其值，并返回OK；否则返回ERROR
   if(Q.front==Q.rear) // 队列空
     return ERROR;
   e=Q.base[Q.front++];
   return OK;
 }

 void QueueTraverse(SqQueue2 Q,void(*vi)(QElemType))
 { // 从队头到队尾依次对队列Q中每个元素调用函数vi()
   int i=Q.front;
   while(i!=Q.rear)
     vi(Q.base[i++]);
   printf("\n");
 }