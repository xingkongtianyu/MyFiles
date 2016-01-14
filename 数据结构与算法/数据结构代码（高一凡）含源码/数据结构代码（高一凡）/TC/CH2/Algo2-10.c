 /* algo2-10.c 两个仅设表尾指针的循环链表的合并(教科书图2.13) */
 #include"c1.h"
 typedef int ElemType;
 #include"c2-2.h"
 #include"bo2-4.c"
 #include"func2-3.c" /* 包括equal()、comp()、print()、print2()和print1()函数 */

 void MergeList(LinkList *La,LinkList Lb)
 { /* 将Lb合并到La的表尾，由La指示新表 */
   LinkList p=Lb->next;
   Lb->next=(*La)->next;
   (*La)->next=p->next;
   free(p);
   *La=Lb;
 }

 void main()
 {
   int n=5,i;
   LinkList La,Lb;
   InitList(&La);
   for(i=1;i<=n;i++)
     ListInsert(&La,i,i);
   printf("La="); /* 输出链表La的内容 */
   ListTraverse(La,print);
   InitList(&Lb);
   for(i=1;i<=n;i++)
     ListInsert(&Lb,1,i*2);
   printf("Lb="); /* 输出链表Lb的内容 */
   ListTraverse(Lb,print);
   MergeList(&La,Lb);
   printf("La+Lb="); /* 输出合并后的链表的内容 */
   ListTraverse(La,print);
 }
