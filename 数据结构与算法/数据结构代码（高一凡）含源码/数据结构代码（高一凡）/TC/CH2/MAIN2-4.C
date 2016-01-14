 /* main2-4.c 单循环链表,检验bo2-4.c的主程序 */
 #include"c1.h"
 typedef int ElemType;
 #include"c2-2.h"
 #include"bo2-4.c"
 #include"func2-3.c" /* 包括equal()、comp()、print()、print2()和print1()函数 */

 void main()
 {
   LinkList L;
   ElemType e;
   int j;
   Status i;
   InitList(&L); /* 初始化单循环链表L */
   i=ListEmpty(L);
   printf("L是否空 i=%d(1:空 0:否)\n",i);
   ListInsert(&L,1,3); /* 在L中依次插入3,5 */
   ListInsert(&L,2,5);
   i=GetElem(L,1,&e);
   j=ListLength(L);
   printf("L中数据元素个数=%d,第1个元素的值为%d。\n",j,e);
   printf("L中的数据元素依次为：");
   ListTraverse(L,print);
   PriorElem(L,5,&e); /* 求元素5的前驱 */
   printf("5前面的元素的值为%d。\n",e);
   NextElem(L,3,&e); /* 求元素3的后继 */
   printf("3后面的元素的值为%d。\n",e);
   printf("L是否空 %d(1:空 0:否)\n",ListEmpty(L));
   j=LocateElem(L,5,equal);
   if(j)
     printf("L的第%d个元素为5。\n",j);
   else
     printf("不存在值为5的元素\n");
   i=ListDelete(&L,2,&e);
   printf("删除L的第2个元素：\n");
   if(i)
   {
     printf("删除的元素值为%d,现在L中的数据元素依次为：",e);
     ListTraverse(L,print);
   }
   else
     printf("删除不成功！\n");
   ClearList(&L);
   printf("清空L后，L是否空：%d(1:空 0:否)\n",ListEmpty(L));
   DestroyList(&L);
 }
