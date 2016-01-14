 /* func6-2.c bo6-5.c和algo7-1.c调用 */
 void PreOrderTraverse(CSTree T,void(*Visit)(TElemType))
 { /* 先根遍历孩子—兄弟二叉链表结构的树T */
   if(T)
   {
     Visit(T->data); /* 先访问根结点 */
     PreOrderTraverse(T->firstchild,Visit); /* 再先根遍历长子子树 */
     PreOrderTraverse(T->nextsibling,Visit); /* 最后先根遍历下一个兄弟子树 */
   }
 }
