 /* main3-7.c 检验bo3-7.cpp的主程序 */
 #include"c1.h"
 typedef int QElemType;
 #include"c3-5.h"
 #include"bo3-7.c"

 void print(QElemType i)
 {
   printf("%d ",i);
 }

 void main()
 {
   Status j;
   int i,k=5;
   QElemType d;
   SqQueue1 Q;
   InitQueue(&Q);
   printf("初始化队列后，队列空否？%u(1:空 0:否)\n",QueueEmpty(Q));
   for(i=1;i<=k;i++)
     EnQueue(&Q,i); /* 依次入队k个元素 */
   printf("依次入队%d个元素后，队列中的元素为: ",k);
   QueueTraverse(Q,print);
   printf("队列长度为%d，队列空否？%u(1:空 0:否)\n",QueueLength(Q),QueueEmpty(Q));
   DeQueue(&Q,&d);
   printf("出队一个元素，其值是%d\n",d);
   j=GetHead(Q,&d);
   if(j)
     printf("现在队头元素是%d\n",d);
   ClearQueue(&Q);
   printf("清空队列后, 队列空否？%u(1:空 0:否)\n",QueueEmpty(Q));
   DestroyQueue(&Q);
 }