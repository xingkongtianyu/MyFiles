 // bo9-2.cpp 动态查找表(二叉排序树)的基本操作(8个)，包括算法9.5(b)、算法9.6～9.8
 typedef ElemType TElemType;
 #include"c6-2.h" // 二叉树的存储结构
 #include"func9-1.cpp"

 Status SearchBST(BiTree &T,KeyType key,BiTree f,BiTree &p) // 算法9.5(b)
 { // 在根指针T所指二叉排序树中递归地查找其关键字等于key的数据元素，若查找
   // 成功，则指针p指向该数据元素结点，并返回TRUE，否则指针p指向查找路径上
   // 访问的最后一个结点并返回FALSE，指针f指向T的双亲，其初始调用值为NULL
   if(!T) // 查找不成功
   {
     p=f;
     return FALSE;
   }
   else if EQ(key,T->data.key) //  查找成功
   {
     p=T;
     return TRUE;
   }
   else if LT(key,T->data.key)
     return SearchBST(T->lchild,key,T,p); // 在左子树中继续查找
   else
     return SearchBST(T->rchild,key,T,p); //  在右子树中继续查找
 }

 Status InsertBST(BiTree &T, ElemType e)
 { // 当二叉排序树T中不存在关键字等于e.key的元素时，插入e并返回TRUE，否则返回FALSE。算法9.6
   BiTree p,s;
   if(!SearchBST(T,e.key,NULL,p)) // 查找不成功
   {
     s=(BiTree)malloc(sizeof(BiTNode));
     s->data=e;
     s->lchild=s->rchild=NULL;
     if(!p)
       T=s; // 被插结点*s为新的根结点
     else if LT(e.key,p->data.key)
       p->lchild=s; // 被插结点*s为左孩子
     else
       p->rchild=s; // 被插结点*s为右孩子
     return TRUE;
   }
   else
     return FALSE; // 树中已有关键字相同的结点，不再插入
 }

 void Delete(BiTree &p)
 { // 从二叉排序树中删除结点p，并重接它的左或右子树。算法9.8
   BiTree q,s;
   if(!p->rchild) // p的右子树空则只需重接它的左子树(待删结点是叶子也走此分支)
   {
     q=p;
     p=p->lchild;
     free(q);
   }
   else if(!p->lchild) // p的左子树空，只需重接它的右子树
   {
     q=p;
     p=p->rchild;
     free(q);
   }
   else // p的左右子树均不空
   {
     q=p;
     s=p->lchild;
     while(s->rchild) // 转左，然后向右到尽头(找待删结点的前驱)
     {
       q=s;
       s=s->rchild;
     }
     p->data=s->data; // s指向被删结点的＂前驱＂(将被删结点前驱的值取代被删结点的值)
     if(q!=p) // 情况1
       q->rchild=s->lchild; // 重接*q的右子树
     else // 情况2
       q->lchild=s->lchild; // 重接*q的左子树
     free(s);
   }
 }

 Status DeleteBST(BiTree &T,KeyType key)
 { // 若二叉排序树T中存在关键字等于key的数据元素时，则删除该数据元素结点，
   // 并返回TRUE；否则返回FALSE。算法9.7
   if(!T) // 不存在关键字等于key的数据元素
     return FALSE;
   else
   {
     if EQ(key,T->data.key) // 找到关键字等于key的数据元素
       Delete(T);
     else if LT(key,T->data.key)
       DeleteBST(T->lchild,key);
     else
       DeleteBST(T->rchild,key);
     return TRUE;
   }
 }
