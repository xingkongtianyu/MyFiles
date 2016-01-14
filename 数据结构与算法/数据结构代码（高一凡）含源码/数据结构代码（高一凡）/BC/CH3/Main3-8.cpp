 // main3-8.cpp 循环且可增加存储空间的顺序队列，检验bo3-8.cpp的主程序
 #include"c1.h"
 typedef int QElemType;
 #include"c3-4.h"
 #include"bo3-4.cpp" // 基本操作(1)，与非循环同
 #include"bo3-8.cpp" // 基本操作(2)，与非循环不同

 void print(QElemType i)
 {
   printf("%d ",i);
 }

 void main()
 {
   Status j;
   int i,n=11;
   QElemType d;
   SqQueue2 Q;
   InitQueue(Q);
   printf("初始化队列后，队列空否？%u(1:空 0:否)\n",QueueEmpty(Q));
   printf("队列长度为：%d\n",QueueLength(Q));
   printf("请输入%d个整型队列元素:\n",n);
   for(i=0;i<n;i++)
   {
     scanf("%d",&d);
     EnQueue(Q,d);
   }
   printf("队列长度为：%d\n",QueueLength(Q));
   printf("现在队列空否？%u(1:空 0:否)\n",QueueEmpty(Q));
   printf("现在队列中的元素为: \n");
   QueueTraverse(Q,print);
   for(i=1;i<=3;i++)
     DeQueue(Q,d);
   printf("由队头删除3个元素，最后删除的元素为%d\n",d);
   printf("现在队列中的元素为: \n");
   QueueTraverse(Q,print);
   j=GetHead(Q,d);
   if(j)
     printf("队头元素为: %d\n",d);
   else
     printf("无队头元素(空队列)\n");
   for(i=1;i<=5;i++)
     EnQueue(Q,i);
   printf("依次向队尾插入1～5，现在队列中的元素为: \n");
   QueueTraverse(Q,print);
   ClearQueue(Q);
   printf("清空队列后, 队列空否？%u(1:空 0:否)\n",QueueEmpty(Q));
   j=GetHead(Q,d);
   if(j)
     printf("队头元素为: %d\n",d);
   else
     printf("无队头元素(空队列)\n");
   DestroyQueue(Q);
 }
