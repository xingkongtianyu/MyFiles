 // func6-3.cpp bo6-2.cpp和func9-1.cpp调用
 void InitBiTree(BiTree &T)
 { // 操作结果：构造空二叉树T
   T=NULL;
 }

 void DestroyBiTree(BiTree &T)
 { // 初始条件：二叉树T存在。操作结果：销毁二叉树T
   if(T) // 非空树
   {
     if(T->lchild) // 有左孩子
       DestroyBiTree(T->lchild); // 销毁左孩子子树
     if(T->rchild) // 有右孩子
       DestroyBiTree(T->rchild); // 销毁右孩子子树
     free(T); // 释放根结点
     T=NULL; // 空指针赋0
   }
 }

 void PreOrderTraverse(BiTree T,void(*Visit)(TElemType))
 { // 初始条件：二叉树T存在，Visit是对结点操作的应用函数。算法6.1，有改动
   // 操作结果：先序递归遍历T，对每个结点调用函数Visit一次且仅一次
   if(T) // T不空
   {
     Visit(T->data); // 先访问根结点
     PreOrderTraverse(T->lchild,Visit); // 再先序遍历左子树
     PreOrderTraverse(T->rchild,Visit); // 最后先序遍历右子树
   }
 }

 void InOrderTraverse(BiTree T,void(*Visit)(TElemType))
 { // 初始条件：二叉树T存在，Visit是对结点操作的应用函数
   // 操作结果：中序递归遍历T，对每个结点调用函数Visit一次且仅一次
   if(T)
   {
     InOrderTraverse(T->lchild,Visit); // 先中序遍历左子树
     Visit(T->data); // 再访问根结点
     InOrderTraverse(T->rchild,Visit); // 最后中序遍历右子树
   }
 }