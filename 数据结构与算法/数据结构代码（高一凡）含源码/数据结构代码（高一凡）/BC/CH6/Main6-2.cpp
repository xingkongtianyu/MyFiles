 // main6-2.cpp 检验bo6-2.cpp的主程序，利用条件编译选择数据类型(另一种方法)
 #define CHAR // 字符型
 // #define INT // 整型(二者选一)
 #include"c1.h"
 #ifdef CHAR
   typedef char TElemType;
   TElemType Nil=' '; // 字符型以空格符为空
   #define form "%c" // 输入输出的格式为%c
 #endif
 #ifdef INT
   typedef int TElemType;
   TElemType Nil=0; // 整型以0为空
   #define form "%d" // 输入输出的格式为%d
 #endif
 #include"c6-2.h"
 #include"bo6-2.cpp"

 void visitT(TElemType e)
 {
   printf(form" ",e);
 }

 void main()
 {
   int i;
   BiTree T,p,c;
   TElemType e1,e2;
   InitBiTree(T);
   printf("构造空二叉树后,树空否？%d(1:是 0:否)树的深度=%d\n",BiTreeEmpty(T),BiTreeDepth(T));
   e1=Root(T);
   if(e1!=Nil)
     printf("二叉树的根为: "form"\n",e1);
   else
     printf("树空，无根\n");
 #ifdef CHAR
   printf("请先序输入二叉树(如:ab三个空格表示a为根结点,b为左子树的二叉树)\n");
 #endif
 #ifdef INT
   printf("请先序输入二叉树(如:1 2 0 0 0表示1为根结点,2为左子树的二叉树)\n");
 #endif
   CreateBiTree(T);
   printf("建立二叉树后,树空否？%d(1:是 0:否) 树的深度=%d\n",BiTreeEmpty(T),BiTreeDepth(T));
   e1=Root(T);
   if(e1!=Nil)
     printf("二叉树的根为: "form"\n",e1);
   else
     printf("树空，无根\n");
   printf("中序递归遍历二叉树:\n");
   InOrderTraverse(T,visitT);
   printf("\n后序递归遍历二叉树:\n");
   PostOrderTraverse(T,visitT);
   printf("\n请输入一个结点的值: ");
   scanf("%*c"form,&e1);
   p=Point(T,e1); // p为e1的指针
   printf("结点的值为"form"\n",Value(p));
   printf("欲改变此结点的值，请输入新值: ");
   scanf("%*c"form"%*c",&e2); // 后一个%*c吃掉回车符，为调用CreateBiTree()做准备
   Assign(p,e2);
   printf("层序遍历二叉树:\n");
   LevelOrderTraverse(T,visitT);
   e1=Parent(T,e2);
   if(e1!=Nil)
     printf("%c的双亲是"form"\n",e2,e1);
   else
     printf(form"没有双亲\n",e2);
   e1=LeftChild(T,e2);
   if(e1!=Nil)
     printf(form"的左孩子是"form"\n",e2,e1);
   else
     printf(form"没有左孩子\n",e2);
   e1=RightChild(T,e2);
   if(e1!=Nil)
     printf(form"的右孩子是"form"\n",e2,e1);
   else
     printf(form"没有右孩子\n",e2);
   e1=LeftSibling(T,e2);
   if(e1!=Nil)
     printf(form"的左兄弟是"form"\n",e2,e1);
   else
     printf(form"没有左兄弟\n",e2);
   e1=RightSibling(T,e2);
   if(e1!=Nil)
     printf(form"的右兄弟是"form"\n",e2,e1);
   else
     printf(form"没有右兄弟\n",e2);
   InitBiTree(c);
   printf("构造一个右子树为空的二叉树c:\n");
 #ifdef CHAR
   printf("请先序输入二叉树(如:ab三个空格表示a为根结点,b为左子树的二叉树)\n");
 #endif
 #ifdef INT
   printf("请先序输入二叉树(如:1 2 0 0 0表示1为根结点,2为左子树的二叉树)\n");
 #endif
   CreateBiTree(c);
   printf("先序递归遍历二叉树c:\n");
   PreOrderTraverse(c,visitT);
   printf("\n层序遍历二叉树c:\n");
   LevelOrderTraverse(c,visitT);
   printf("树c插到树T中,请输入树T中树c的双亲结点 c为左(0)或右(1)子树: ");
   scanf("%*c"form"%d",&e1,&i);
   p=Point(T,e1); // p是T中树c的双亲结点指针
   InsertChild(p,i,c);
   printf("先序递归遍历二叉树:\n");
   PreOrderTraverse(T,visitT);
   printf("\n中序非递归遍历二叉树:\n");
   InOrderTraverse1(T,visitT);
   printf("删除子树,请输入待删除子树的双亲结点  左(0)或右(1)子树: ");
   scanf("%*c"form"%d",&e1,&i);
   p=Point(T,e1);
   DeleteChild(p,i);
   printf("先序递归遍历二叉树:\n");
   PreOrderTraverse(T,visitT);
   printf("\n中序非递归遍历二叉树(另一种方法):\n");
   InOrderTraverse2(T,visitT);
   DestroyBiTree(T);
 }