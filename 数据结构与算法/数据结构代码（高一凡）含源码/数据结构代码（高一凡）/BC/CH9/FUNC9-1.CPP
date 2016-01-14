 // func9-1.cpp 包括算法9.5(a)和func6-3.cpp,bo9-2.cpp和bo9-3.cpp调用
 #include"func6-3.cpp" // 包括InitBiTree()、DestroyBiTree()、PreOrderTraverse()和InOrderTraverse()4函数
 #define InitDSTable InitBiTree // 与初始化二叉树的操作同
 #define DestroyDSTable DestroyBiTree // 与销毁二叉树的操作同
 #define TraverseDSTable InOrderTraverse // 与中序遍历二叉树的操作同

 BiTree SearchBST(BiTree T,KeyType key)
 { // 在根指针T所指二叉排序树中递归地查找某关键字等于key的数据元素，
   // 若查找成功，则返回指向该数据元素结点的指针，否则返回空指针。算法9.5(a)
   if(!T||EQ(key,T->data.key))
     return T; // 查找结束
   else if LT(key,T->data.key) // 在左子树中继续查找
     return SearchBST(T->lchild,key);
   else
     return SearchBST(T->rchild,key); // 在右子树中继续查找
 }