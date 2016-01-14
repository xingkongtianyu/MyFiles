 // func3-1.cpp algo3-5.cpp、algo3-9.cpp和algo3-11.cpp要调用的函数、结构和全局变量
 struct PosType // 迷宫坐标位置类型
 {
   int x; // 行值
   int y; // 列值
 };

 #define MAXLENGTH 25 // 设迷宫的最大行列为25
 typedef int MazeType[MAXLENGTH][MAXLENGTH]; // 迷宫数组类型[行][列]

 // 全局变量
 MazeType m; // 迷宫数组
 int x,y; // 迷宫的行数，列数
 PosType begin,end; // 迷宫的入口坐标,出口坐标

 void Print()
 { // 输出迷宫的解(m数组)
   int i,j;
   for(i=0;i<x;i++)
   {
     for(j=0;j<y;j++)
       printf("%3d",m[i][j]);
     printf("\n");
   }
 }

 void Init(int k)
 { // 设定迷宫布局(墙为值0,通道值为k)
   int i,j,x1,y1;
   printf("请输入迷宫的行数,列数(包括外墙)：");
   scanf("%d,%d",&x,&y);
   for(i=0;i<x;i++) // 定义周边值为0(外墙)
   {
     m[0][i]=0; // 行周边
     m[x-1][i]=0;
   }
   for(i=0;i<y-1;i++)
   {
     m[i][0]=0; // 列周边
     m[i][y-1]=0;
   }
   for(i=1;i<x-1;i++)
     for(j=1;j<y-1;j++)
       m[i][j]=k; // 定义除外墙，其余都是通道，初值为k
   printf("请输入迷宫内墙单元数：");
   scanf("%d",&j);
   printf("请依次输入迷宫内墙每个单元的行数,列数：\n");
   for(i=1;i<=j;i++)
   {
     scanf("%d,%d",&x1,&y1);
     m[x1][y1]=0; // 修改墙的值为0
   }
   printf("迷宫结构如下:\n");
   Print();
   printf("请输入入口的行数,列数：");
   scanf("%d,%d",&begin.x,&begin.y);
   printf("请输入出口的行数,列数：");
   scanf("%d,%d",&end.x,&end.y);
 }
