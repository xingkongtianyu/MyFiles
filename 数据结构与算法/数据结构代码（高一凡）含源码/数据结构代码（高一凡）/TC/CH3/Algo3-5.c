 /* algo3-5.c 利用栈求解迷宫问题(只输出一个解，算法3.3) */
 #include"c1.h"
 #include"func3-1.c"

 int curstep=1; /* 当前足迹，初值(在入口处)为1 */
 typedef struct
 {
   int ord; /* 通道块在路径上的＂序号＂ */
   PosType seat; /* 通道块在迷宫中的＂坐标位置＂ */
   int di; /* 从此通道块走向下一通道块的＂方向＂(0～3表示东～北) */
 }SElemType; /* 栈的元素类型 */

 #include"c3-1.h" /* 采用顺序栈存储结构 */
 #include"bo3-1.c" /* 采用顺序栈的基本操作函数 */

 /* 定义墙元素值为0，可通过路径为1，不能通过路径为-1，通过路径为足迹 */
 Status Pass(PosType b)
 { /* 当迷宫m的b点的序号为1(可通过路径)，返回OK；否则，返回ERROR */
   if(m[b.x][b.y]==1)
     return OK;
   else
     return ERROR;
 }

 void FootPrint(PosType a)
 { /* 使迷宫m的a点的值变为足迹(curstep) */
   m[a.x][a.y]=curstep;
 }

 void NextPos(PosType *c,int di)
 { /* 根据当前位置及移动方向，求得下一位置 */
   PosType direc[4]={{0,1},{1,0},{0,-1},{-1,0}}; /* {行增量,列增量},移动方向,依次为东南西北 */
   (*c).x+=direc[di].x;
   (*c).y+=direc[di].y;
 }

 void MarkPrint(PosType b)
 { /* 使迷宫m的b点的序号变为-1(不能通过的路径) */
   m[b.x][b.y]=-1;
 }

 Status MazePath(PosType start,PosType end) /* 算法3.3 */
 { /* 若迷宫m中存在从入口start到出口end的通道，则求得一条 */
   /* 存放在栈中(从栈底到栈顶)，并返回TRUE；否则返回FALSE */
   SqStack S; /* 顺序栈 */
   PosType curpos; /* 当前位置 */
   SElemType e; /* 栈元素 */
   InitStack(&S); /* 初始化栈 */
   curpos=start; /* 当前位置在入口 */
   do
   {
     if(Pass(curpos))
     { /* 当前位置可以通过，即是未曾走到过的通道块 */
       FootPrint(curpos); /* 留下足迹 */
       e.ord=curstep;
       e.seat=curpos;
       e.di=0;
       Push(&S,e); /* 入栈当前位置及状态 */
       curstep++; /* 足迹加1 */
       if(curpos.x==end.x&&curpos.y==end.y) /* 到达终点(出口) */
         return TRUE;
       NextPos(&curpos,e.di); /* 由当前位置及移动方向，确定下一个当前位置 */
     }
     else
     { /* 当前位置不能通过 */
       if(!StackEmpty(S)) /* 栈不空 */
       {
         Pop(&S,&e); /* 退栈到前一位置 */
         curstep--; /* 足迹减1 */
         while(e.di==3&&!StackEmpty(S)) /* 前一位置处于最后一个方向(北) */
         {
           MarkPrint(e.seat); /* 在前一位置留下不能通过的标记(-1) */
           Pop(&S,&e); /* 再退回一步 */
           curstep--; /* 足迹再减1 */
         }
         if(e.di<3) /* 没到最后一个方向(北) */
         {
           e.di++; /* 换下一个方向探索 */
           Push(&S,e); /* 入栈该位置的下一个方向 */
           curstep++; /* 足迹加1 */
           curpos=e.seat; /* 确定当前位置 */
           NextPos(&curpos,e.di); /* 确定下一个当前位置是该新方向上的相邻块 */
         }
       }
     }
   }while(!StackEmpty(S));
   return FALSE;
 }

 void main()
 {
   Init(1); /* 初始化迷宫，通道值为1 */
   if(MazePath(begin,end)) /* 有通路 */
   {
     printf("此迷宫从入口到出口的一条路径如下:\n");
     Print(); /* 输出此通路 */
   }
   else
     printf("此迷宫没有从入口到出口的路径\n");
 }

