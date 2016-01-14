 // bo3-8.cpp 循环队列(存储结构由c3-4.h定义)的基本操作(4个)
 int QueueLength(SqQueue2 Q)
 { // 返回Q的元素个数，即队列的长度
   return(Q.rear-Q.front+Q.queuesize)%Q.queuesize;
 }

 void EnQueue(SqQueue2 &Q,QElemType e)
 { // 插入元素e为Q的新的队尾元素
   int i;
   if((Q.rear+1)%Q.queuesize==Q.front)
   { // 队列满，增加存储单元
     Q.base=(QElemType *)realloc(Q.base,(Q.queuesize+QUEUE_INCREMENT)*sizeof(QElemType));
     if(!Q.base) // 增加单元失败
       exit(ERROR);
     if(Q.front>Q.rear) // 形成循环
     {
       for(i=Q.queuesize-1;i>=Q.front;i--)
         Q.base[i+QUEUE_INCREMENT]=Q.base[i]; // 移动高端元素到新的高端
       Q.front+=QUEUE_INCREMENT; // 移动队头指针
     }
     Q.queuesize+=QUEUE_INCREMENT; // 增加队列长度
   }
   Q.base[Q.rear]=e; // 将e插入队尾
   Q.rear=++Q.rear%Q.queuesize; // 移动队尾指针
 }

 Status DeQueue(SqQueue2 &Q,QElemType &e)
 { // 若队列不空，则删除Q的队头元素，用e返回其值，并返回OK；否则返回ERROR
   if(Q.front==Q.rear) // 队列空
     return ERROR;
   e=Q.base[Q.front]; // 用e返回队头元素
   Q.front=++Q.front%Q.queuesize; // 移动队头指针
   return OK;
 }

 void QueueTraverse(SqQueue2 Q,void(*vi)(QElemType))
 { // 从队头到队尾依次对队列Q中每个元素调用函数vi()
   int i=Q.front; // i指向队头
   while(i!=Q.rear) // 没到队尾
   {
     vi(Q.base[i]); // 调用函数vi()
     i=++i%Q.queuesize; // 向后移动i指针
   }
   printf("\n");
 }

