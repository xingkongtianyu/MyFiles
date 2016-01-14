 // func3-3.cpp algo3-12.cpp和algo3-13.cpp用到的函数及变量等
 #include"c1.h"
 typedef struct // 定义ElemType为结构体类型
 {
   int OccurTime; // 事件发生时刻
   int NType; // 事件类型，Qu表示到达事件，0至Qu-1表示Qu个窗口的离开事件
 }Event,ElemType; // 事件类型，有序链表LinkList的数据元素类型

 #include"c2-5.h" // 从实际应用角度出发重新定义的线性链表结构
 typedef LinkList EventList; // 事件链表指针类型，定义为有序链表
 #include"bo2-6.cpp" // 基于c2-5.h存储结构的基本操作

 typedef struct
 {
   int ArrivalTime; // 到达时刻
   int Duration; // 办理事务所需时间
 }QElemType; // 定义队列的数据元素类型QElemType为结构体类型

 #include"c3-2.h" // 链队列存储结构
 #include"bo3-2.cpp" // 链队列基本操作

 // 程序中用到的主要变量(全局)
 EventList ev; // 事件表头指针
 Event en,et; // 事件,临时变量
 //FILE *fp; // 文件型指针，用于指向b.txt或d.txt文件

 long int TotalTime=0; // 累计客户逗留时间(初值为0)
 int CloseTime,CustomerNum=0; // 银行营业时间(单位是分),客户数(初值为0)

 int cmp(Event a,Event b)
 { // 依事件a的发生时刻<、=或>事件b的发生时刻分别返回-1、0或1
   if(a.OccurTime==b.OccurTime)
     return 0;
   else
     return (a.OccurTime-b.OccurTime)/abs(a.OccurTime-b.OccurTime);
 }

 void Random(int &d,int &i)
 { // 生成两个随机数
   d=rand()%Blsj+1; // 1到Blsj之间的随机数(办理业务的时间)
   i=rand()%(Khjg+1); // 0到Khjg之间的随机数(客户到达的时间间隔)
 }

 void OpenForDay();
 void CustomerArrived();
 void CustomerDeparture();

 void Bank_Simulation()
 { // 银行业务模拟函数
   Link p;
   OpenForDay(); // 初始化事件表ev且插入第1个到达事件，初始化队列
   while(!ListEmpty(ev)) // 事件表ev不空
   {
     DelFirst(ev,ev.head,p); // 删除事件表ev的第1个结点，并由p返回其指针，在bo2-6.cpp中
 //  if(p->data.OccurTime<50) // 输出前50分钟内发生的事件到文件d.txt中
 //    fprintf(fp,"p->data.OccurTime=%3d p->data.NType=%d\n",p->data.OccurTime,p->data.NType);
     en.OccurTime=GetCurElem(p).OccurTime; // GetCurElem()在bo2-6.cpp中，返回p->data(ElemType类型)
     en.NType=GetCurElem(p).NType;
     if(en.NType==Qu) // 到达事件
       CustomerArrived(); // 处理客户到达事件
     else // 由某窗口离开的事件
       CustomerDeparture(); // 处理客户离开事件
   } // 计算并输出平均逗留时间
   printf("窗口数=%d 两相邻到达的客户的时间间隔=0～%d分钟 每个客户办理业务的时间=1～%d分钟\n",Qu,Khjg,Blsj);
   printf("客户总数:%d, 所有客户共耗时:%ld分钟,平均每人耗时:%d分钟,",CustomerNum,TotalTime,TotalTime/CustomerNum);
   printf("最后一个客户离开的时间:%d分\n",en.OccurTime);
 }
