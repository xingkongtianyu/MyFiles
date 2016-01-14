 /* algo2-9.c 尽量采用bo2-31.c中的基本操作实现算法2.17的功能 */
 #include"c1.h"
 #define N 2
 typedef char ElemType;
 #include"c2-3.h"
 #include"func2-2.c"
 #include"bo2-31.c"
 #include"func2-3.c" /* 包括equal()、comp()、print()、print2()和print1()函数 */

 void difference(SLinkList space) /* 改进算法2.17(尽量利用基本操作实现) */
 { /* 依次输入集合A和B的元素，在一维数组space中建立表示集合(A-B)∪(B-A)的静态链表 */
   int m,n,i,j;
   ElemType b,c;
   InitList(space); /* 构造空链表 */
   printf("请输入集合A和B的元素个数m,n:");
   scanf("%d,%d%*c",&m,&n); /* %*c吃掉回车符 */
   printf("请输入集合A的元素（共%d个）:",m);
   for(j=1;j<=m;j++) /* 建立集合A的链表 */
   {
     scanf("%c",&b); /* 输入A的元素值 */
     ListInsert(space,1,b); /* 插入到表头 */
   }
   scanf("%*c"); /* 吃掉回车符 */
   printf("请输入集合B的元素（共%d个）:",n);
   for(j=1;j<=n;j++)
   { /* 依次输入B的元素，若不在当前表中，则插入，否则删除 */
     scanf("%c",&b);
     for(i=1;i<=ListLength(space);i++)
     {
       GetElem(space,i,&c); /* 依次求得表中第i个元素的值，并将其赋给c */
       if(c==b) /* 表中存在b,且其是第i个元素 */
       {
	 ListDelete(space,i,&c); /* 删除第i个元素 */
	 break; /* 跳出i循环 */
       }
     }
     if(i>ListLength(space)) /* 表中不存在b */
       ListInsert(space,1,b); /* 将b插在表头 */
   }
 }

 void main()
 {
   SLinkList s;
   difference(s);
   ListTraverse(s,print2);
 }