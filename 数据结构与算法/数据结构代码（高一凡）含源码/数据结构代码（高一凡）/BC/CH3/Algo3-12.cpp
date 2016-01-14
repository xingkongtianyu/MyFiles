 // algo3-12.cpp 银行业务模拟。实现算法3.6、3.7的程序
 #define Qu 4 // 客户队列数
 #define Khjg 5 // 两相邻到达的客户的时间间隔最大值
 #define Blsj 30 // 每个客户办理业务的时间最大值
 #include"func3-3.cpp" // 包含algo3-12.cpp和algo3-13.cpp共同用到的函数和变量等

 LinkQueue q[Qu]; // Qu个客户队列
 QElemType customer; // 客户记录，临时变量
 //FILE *fq; // 文件型指针，用于指向a.txt文件

 void OpenForDay()
 { // 初始化事件链表ev且插入第1个到达事件，初始化Qu个队列
   int i;
   InitList(ev); // 初始化事件链表ev为空
   en.OccurTime=0; // 设定第1位客户到达时间为0(银行一开门，就有客户来)
 //fprintf(fq,"首位客户到达时刻=%3d,",en.OccurTime);
   en.NType=Qu; // 到达
   OrderInsert(ev,en,cmp); // 将第1个到达事件en有序插入事件表ev中，在bo2-6.cpp中
   for(i=0;i<Qu;++i) // 初始化Qu个队列
     InitQueue(q[i]);
 }

 int Minimum(LinkQueue Q[])
 { // 返回最短队列的序号，若有并列值，返回队列序号最小的
   int l[Qu];
   int i,k=0;
   for(i=0;i<Qu;i++)
     l[i]=QueueLength(Q[i]);
   for(i=1;i<Qu;i++)
     if(l[i]<l[0])
     {
       l[0]=l[i];
       k=i;
     }
   return k;
 }

 void CustomerArrived()
 { // 处理客户到达事件en(en.NType=Qu)
   QElemType f;
   int durtime,intertime,i;
   ++CustomerNum; // 客户数加1
   Random(durtime,intertime); // 生成当前客户办理业务的时间和下一个客户到达的时间间隔2个随机数
   et.OccurTime=en.OccurTime+intertime; // 下一客户et到达时刻=当前客户en的到达时间+时间间隔
   et.NType=Qu; // 下一客户到达事件
   i=Minimum(q); // 求长度最短队列的序号，等长为最小的序号(到达事件将入该队)
 //if(CustomerNum<=20) // 输出前20个客户到达信息到文件a.txt中
 //  fprintf(fq,"办理业务的时间=%2d,所排队列=%d\n下一客户到达时刻=%3d,",durtime,i,et.OccurTime);
   if(et.OccurTime<CloseTime) // 下一客户到达时银行尚未关门
     OrderInsert(ev,et,cmp); // 按升序将下一客户到达事件et插入事件表ev中，在bo2-6.cpp中
   f.ArrivalTime=en.OccurTime; // 将当前客户到达事件en赋给队列元素f
   f.Duration=durtime;
   EnQueue(q[i],f); // 将f入队到第i队列(i=0～Qu-1)
   if(QueueLength(q[i])==1) // 该元素为队头元素
   {
     et.OccurTime=en.OccurTime+durtime; // 设定一个离开事件et
     et.NType=i;
     OrderInsert(ev,et,cmp); // 将此离开事件et按升序插入事件表ev中
   }
 }

 void CustomerDeparture()
 { // 处理客户离开事件en(en.NType<Qu)
   int i;
   i=en.NType; // 确定离开事件en发生的队列序号i
   DeQueue(q[i],customer); // 删除第i队列的排头客户
   TotalTime+=en.OccurTime-customer.ArrivalTime; // 客户逗留时间=离开事件en的发生时刻-该客户的到达时间
   if(!QueueEmpty(q[i]))
   { // 删除第i队列的排头客户后，第i队列仍不空
     GetHead(q[i],customer); // 将第i队列新的排头客户赋给customer
     et.OccurTime=en.OccurTime+customer.Duration; // 设定离开事件et,新排头的离开时间=原排头的离开时间+新排头办理业务的时间
     et.NType=i; // 第i个队列的离开事件
     OrderInsert(ev,et,cmp); // 将此离开事件et按升序插入事件表ev中
   }
 }

 void main()
 {
 //fq=fopen("a.txt","w"); // 打开a.txt文件，用于写入客户到达信息
 //fp=fopen("b.txt","w"); // 打开b.txt文件，用于写入有序事件表的历史记录
   printf("请输入银行营业时间长度(单位:分): ");
   scanf("%d",&CloseTime);
 //srand(time(0)); // 设置随机数种子，以使每次运行程序产生的随机数不同(time(0)是长整型数，与调用时间有关)
   Bank_Simulation();
 //fclose(fq); // 关闭a.txt
 //fclose(fp); // 关闭b.txt
 }
