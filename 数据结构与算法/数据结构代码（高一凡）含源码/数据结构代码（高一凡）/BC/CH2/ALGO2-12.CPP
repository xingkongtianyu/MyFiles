 // algo2-12.cpp 用单链表实现算法2.1，仅有4句与algo2-1.cpp不同
 #include"c1.h"
 typedef int ElemType;
 #include"c2-2.h" // 此句与algo2-1.cpp不同(因为采用不同的结构)
 #include"bo2-2.cpp" // 此句与algo2-1.cpp不同(因为采用不同的结构)
 #include"func2-3.cpp" // 包括equal()、comp()、print()、print2()和print1()函数

 void Union(LinkList La,LinkList Lb) // 算法2.1，此句与algo2-1.cpp不同
 { // 将所有在线性表Lb中但不在La中的数据元素插入到La中
   ElemType e;
   int La_len,Lb_len;
   int i;
   La_len=ListLength(La); // 求线性表的长度
   Lb_len=ListLength(Lb);
   for(i=1;i<=Lb_len;i++)
   {
     GetElem(Lb,i,e); // 取Lb中第i个数据元素赋给e
     if(!LocateElem(La,e,equal)) // La中不存在和e相同的元素，则插入之
       ListInsert(La,++La_len,e);
   }
 }

 void main()
 {
   LinkList La,Lb; // 此句与algo2-1.cpp不同(因为采用不同的结构)
   int j;
   InitList(La); // 创建空表La。如不成功，则会退出程序的运行
   for(j=1;j<=5;j++) // 在表La中插入5个元素
     ListInsert(La,j,j);
   printf("La= "); // 输出表La的内容
   ListTraverse(La,print);
   InitList(Lb); // 创建空表Lb
   for(j=1;j<=5;j++) // 在表Lb中插入5个元素
     ListInsert(Lb,j,2*j);
   printf("Lb= "); // 输出表Lb的内容
   ListTraverse(Lb,print);
   Union(La,Lb);
   printf("new La= "); // 输出新表La的内容
   ListTraverse(La,print);
 }