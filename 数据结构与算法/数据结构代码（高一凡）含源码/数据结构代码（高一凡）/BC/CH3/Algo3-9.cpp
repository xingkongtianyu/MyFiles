 // algo3-9.cpp 用递归函数求解迷宫问题(求出所有解)
 #include"c1.h" // 根据《PASCAL程序设计》(郑启华编著)中的程序改编
 #include"func3-1.cpp" // 定义墙元素值为0，可通过路径为-1，通过路径为足迹

 void Try(PosType cur,int curstep)
 { // 由当前位置cur、当前步骤curstep试探下一点
   int i;
   PosType next; // 下一个位置
   PosType direc[4]={{0,1},{1,0},{0,-1},{-1,0}}; // {行增量,列增量},移动方向,依次为东南西北
   for(i=0;i<=3;i++) // 依次试探东南西北四个方向
   {
     next.x=cur.x+direc[i].x; // 根据移动方向，给下一位置赋值
     next.y=cur.y+direc[i].y;
     if(m[next.x][next.y]==-1) // 下一个位置是通路
     {
       m[next.x][next.y]=++curstep; // 将下一个位置设为足迹
       if(next.x!=end.x||next.y!=end.y) // 没到终点
         Try(next,curstep); // 由下一个位置继续试探(降阶递归调用，离终点更近)
       else // 到终点
       {
         Print(); // 输出结果(出口，不再递归调用)
         printf("\n");
       }
       m[next.x][next.y]=-1; // 恢复为通路，以便在另一个方向试探另一条路
       curstep--; // 足迹也减1
     }
   }
 }

 void main()
 {
   Init(-1); // 初始化迷宫，通道值为-1
   printf("此迷宫从入口到出口的路径如下:\n");
   m[begin.x][begin.y]=1; // 入口的足迹为1
   Try(begin,1); // 由第1步入口试探起
 }
