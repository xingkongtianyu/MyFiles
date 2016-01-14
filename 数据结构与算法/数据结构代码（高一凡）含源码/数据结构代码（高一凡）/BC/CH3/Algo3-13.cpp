 // algo3-13.cpp 使用排队机的银行业务模拟
 #define Qu 4 // 窗口数
 #define Khjg 5 // 两相邻到达的客户的时间间隔最大值
 #define Blsj 30 // 每个客户办理业务的时间最大值
 #include"func3-3.cpp" // 包含algo3-12.cpp和algo3-13.cpp共同用到的函数和变量等

 LinkQueue q; // 排队机队列q
 QElemType customer[Qu]; // Qu个客户队列元素, 存放正在窗口办理业务的客户的信息
 //FILE *fq; // 文件型指针，用于指向c.txt文件
 //int j=0; // 计数器，产生c.txt文件用到
 Boolean chk[Qu]; // 窗口状态，1为闲，0为忙

 void OpenForDay()
 { // 初始化事件链表ev且插入第1个到达事件，初始化排队机q，初始化Qu个窗口为1(空闲)
   int i;
   InitList(ev); // 初始化事件链表ev为空
   en.OccurTime=0; // 设定第1位客户到达时间为0(银行一开门，就有客户来)
   en.NType=Qu; // 到达
   OrderInsert(ev,en,cmp); // 将第1个到达事件en有序插入事件表ev中，在bo2-6.cpp中
   InitQueue(q); // 初始化排队机队列q
   for(i=0;i<Qu;i++)
     chk[i]=1; // 初始化Qu个窗口为1(空闲)
 }

 int ChuangKou()
 { // 返回空闲窗口的序号(0～Qu-1)，若有多个窗口空闲，返回序号最小的。若无空闲窗口，返回Qu
   int i;
   for(i=0;i<Qu;i++)
     if(chk[i])
       return i;
   return i;
 }

 void CustomerArrived()
 { // 处理客户到达事件en(en.NType=Qu)，与algo3-12.cpp不同
   QElemType f;
   int durtime,intertime,i;
   ++CustomerNum; // 客户数加1
   Random(durtime,intertime); // 生成当前客户办理业务的时间和下一个客户到达的时间间隔2个随机数
   et.OccurTime=en.OccurTime+intertime; // 下一客户et到达时刻=当前客户en的到达时间+时间间隔
   et.NType=Qu; // 下一客户到达事件
   if(et.OccurTime<CloseTime) // 下一客户到达时银行尚未关门
     OrderInsert(ev,et,cmp); // 按升序将下一客户到达事件et插入事件表ev中，在bo2-6.cpp中
   f.ArrivalTime=en.OccurTime; // 将当前客户到达事件en赋给队列元素f
   f.Duration=durtime;
   EnQueue(q,f); // 将当前客户f入队到排队机
   i=ChuangKou(); // 求空闲窗口的序号
   if(i<Qu) // 有空闲窗口
   {
     DeQueue(q,customer[i]); // 删去排队机的排头客户(也就是刚入队的f由排队机到i号窗口)
 //  if(j++<20) // 输出前20个客户到达信息及处理业务窗口信息到文件c.txt中
 //    fprintf(fq,"客户到达时刻=%3d,办理业务的时间=%2d,所在窗口=%d\n",customer[i].ArrivalTime,customer[i].Duration,i);
     et.OccurTime=en.OccurTime+customer[i].Duration; // 设定一个i号窗口的离开事件et
     et.NType=i; // 第i号窗口的离开事件
     OrderInsert(ev,et,cmp); // 将此离开事件et按升序插入事件表ev中
     chk[i]=0; // i号窗口状态变忙
   }
 }

 void CustomerDeparture()
 { // 处理客户离开事件en(en.NType<Qu)，与algo3-12.cpp不同
   int i;
   i=en.NType; // 确定离开事件en发生的窗口序号i
   chk[i]=1; // i号窗口状态变闲
   TotalTime+=en.OccurTime-customer[i].ArrivalTime; // 客户逗留时间=离开事件en的发生时刻-该客户的到达时间
   if(!QueueEmpty(q))
   { // 第i窗口的客户离开后，排队机仍不空
     DeQueue(q,customer[i]); // 删去排队机的排头客户并将其赋给customer[i](排队机的排头客户去i窗口办理业务)
 //  if(j++<20) // 输出前20个客户到达信息及处理业务窗口信息到文件c.txt中
 //    fprintf(fq,"客户到达时刻=%3d,办理业务的时间=%2d,所在窗口=%d\n",customer[i].ArrivalTime,customer[i].Duration,i);
     chk[i]=0; // i号窗口状态变忙
     et.OccurTime=en.OccurTime+customer[i].Duration; // 设定customer[i]的离开事件et,客户的离开时间=原客户的离开时间+当前客户办理业务的时间
     et.NType=i; // 第i号窗口的离开事件
     OrderInsert(ev,et,cmp); // 将此离开事件et按升序插入事件表ev中
   }
 }

 void main()
 {
 //fq=fopen("c.txt","w"); // 打开c.txt文件，用于写入客户到达信息
 //fp=fopen("d.txt","w"); // 打开d.txt文件，用于写入有序事件表的历史记录
   printf("请输入银行营业时间长度(单位:分): ");
   scanf("%d",&CloseTime);
 //srand(time(0)); // 设置随机数种子,以使每次运行程序产生的随机数不同(time(0)是长整型数,与调用时间有关)
   Bank_Simulation();
 //fclose(fq); // 关闭c.txt
 //fclose(fp); // 关闭d.txt
 }
