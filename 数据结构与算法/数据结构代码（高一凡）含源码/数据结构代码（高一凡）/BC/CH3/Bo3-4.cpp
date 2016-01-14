 // bo3-4.cpp 顺序队列(存储结构由c3-4.h定义)的基本操作(5个)
 void InitQueue(SqQueue2 &Q)
 { // 构造一个空队列Q
   if(!(Q.base=(QElemType *)malloc(QUEUE_INIT_SIZE*sizeof(QElemType)))) // 存储分配失败
     exit(ERROR);
   Q.front=Q.rear=0;
   Q.queuesize=QUEUE_INIT_SIZE;
 }

 void DestroyQueue(SqQueue2 &Q)
 { // 销毁队列Q，Q不再存在
   if(Q.base)
     free(Q.base);
   Q.base=NULL;
   Q.front=Q.rear=Q.queuesize=0;
 }

 void ClearQueue(SqQueue2 &Q)
 { // 将Q清为空队列
   Q.front=Q.rear=0;
 }

 Status QueueEmpty(SqQueue2 Q)
 { // 若队列Q为空队列，则返回TRUE；否则返回FALSE
   if(Q.front==Q.rear) // 队列空的标志
     return TRUE;
   else
     return FALSE;
 }

 Status GetHead(SqQueue2 Q,QElemType &e)
 { // 若队列不空，则用e返回Q的队头元素，并返回OK；否则返回ERROR
   if(Q.front==Q.rear) // 队列空
     return ERROR;
   e=Q.base[Q.front];
   return OK;
 }

