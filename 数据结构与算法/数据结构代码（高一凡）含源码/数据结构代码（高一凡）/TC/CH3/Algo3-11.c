 /* algo3-11.c 利用非循环顺序队列采用广度搜索法求解迷宫问题(一条路径) */
 #include"c1.h"
 #include"func3-1.c"
 #define D 8 /* 移动方向数，只能取4和8。(8个，可斜行；4个，只可直走) */

 typedef struct /* 定义队列元素和栈元素为同类型的结构体 */
 {
   PosType seat; /* 当前点的行值，列值 */
   int pre; /* 前一点在队列中的序号 */
 }QElemType,SElemType; /* 栈元素和队列元素 */
 #include"c3-1.h" /* 栈的存储结构 */
 #include"bo3-1.c" /* 栈的基本操作 */
 #include"c3-4.h" /* 队列的存储结构 */
 #include"bo3-4.c" /* 非循环顺序队列的基本操作(1) */
 #include"bo3-9.c" /* 非循环顺序队列的基本操作(2) */

 struct /* 移动数组，移动方向由正东起顺时针转 */
 {
   int x,y;
 }move[D]={
 #if D==8
	   {0,1},{1,1},{1,0},{1,-1},{0,-1},{-1,-1},{-1,0},{-1,1}};
 #endif
 #if D==4
	   {0,1},{1,0},{0,-1},{-1,0}};
 #endif

 void Path()
 { /* 广度搜索法求一条迷宫路径 */
   SqQueue2 q; /* 采用非循环顺序队列 */
   QElemType qf,qt; /* 当前点和下一点 */
   SqStack s; /* 采用顺序栈 */
   int i,flag=1; /* 当找到出口，flag=0 */
   qf.seat.x=begin.x; /* 将入口作为当前点 */
   qf.seat.y=begin.y;
   qf.pre=-1; /* 设入口(第一点)的上一点的序号=-1 */
   m[qf.seat.x][qf.seat.y]=-1; /* 初始点设为-1(标记已访问过) */
   InitQueue(&q);
   EnQueue(&q,qf); /* 起点入队 */
   while(!QueueEmpty(q)&&flag)
   { /* 队列中还有没被广度搜索过的点且还没找到出口 */
     DeQueue(&q,&qf); /* 出队qf为当前点 */
     for(i=0;i<D;i++) /* 向各个方向尝试 */
     {
       qt.seat.x=qf.seat.x+move[i].x; /* 下一点的坐标 */
       qt.seat.y=qf.seat.y+move[i].y;
       if(m[qt.seat.x][qt.seat.y]==1)
       { /* 此点是通道且不曾被访问过 */
         m[qt.seat.x][qt.seat.y]=-1; /* 标记已访问过 */
         qt.pre=q.front-1; /* qt的前一点处于队列中现队头减1的位置(没删除) */
	 EnQueue(&q,qt); /* 入队qt */
         if(qt.seat.x==end.x&&qt.seat.y==end.y) /* 到达终点 */
         {
           flag=0;
           break;
         }
       }
     }
   }
   if(flag) /* 搜索完整个队列还没到达终点 */
     printf("没有路径可到达终点！\n");
   else /* 到达终点 */
   {
     InitStack(&s); /* 初始化s栈 */
     i=q.rear-1; /* i为待入栈元素在队列中的位置 */
     while(i>=0) /* 没到入口 */
     {
       Push(&s,q.base[i]); /* 将队列中的路径入栈(栈底为出口，栈顶为入口) */
       i=q.base[i].pre; /* i为前一元素在队列中的位置 */
     }
     i=0; /* i为走出迷宫的足迹 */
     while(!StackEmpty(s))
     {
       Pop(&s,&qf); /* 依照由入口到出口的顺序弹出路径 */
       i++;
       m[qf.seat.x][qf.seat.y]=i; /* 标记路径为足迹(标记前的值为-1) */
     }
     printf("走出迷宫的一个方案：\n");
     Print(); /* 输出m数组 */
   }
 }

 void main()
 {
   Init(1); /* 初始化迷宫，通道值为1 */
   Path(); /* 求一条迷宫路径 */
 }
