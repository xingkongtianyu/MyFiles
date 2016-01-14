 // main6-3.cpp 检验bo6-3.cpp的主程序
 #define CHAR 1 // 字符型
 // #define CHAR 0 // 整型(二者选一)
 #if CHAR
   typedef char TElemType;
   TElemType Nil=' '; // 字符型以空格符为空
   #define form "%c" // 输入输出的格式为%c
 #else
   typedef int TElemType;
   TElemType Nil=0; // 整型以0为空
   #define form "%d" // 输入输出的格式为%d
 #endif
 #include"c1.h"
 #include"c6-3.h"
 #include"bo6-3.cpp"

 void vi(TElemType c)
 {
   printf(form" ",c);
 }

 void main()
 {
   BiThrTree H,T;
 #if CHAR
   printf("请按先序输入二叉树(如:ab三个空格表示a为根结点,b为左子树的二叉树)\n");
 #else
   printf("请按先序输入二叉树(如:1 2 0 0 0表示1为根结点,2为左子树的二叉树)\n");
 #endif
   CreateBiThrTree(T); // 按先序产生二叉树
   InOrderThreading(H,T); // 在中序遍历的过程中，中序线索化二叉树
   printf("中序遍历(输出)线索二叉树:\n");
   InOrderTraverse_Thr(H,vi); // 中序遍历(输出)线索二叉树
   printf("\n");
   DestroyBiThrTree(H); // 销毁线索二叉树
 #if CHAR
   printf("请按先序输入二叉树(如:ab三个空格表示a为根结点,b为左子树的二叉树)\n");
 #else
   printf("请按先序输入二叉树(如:1 2 0 0 0表示1为根结点,2为左子树的二叉树)\n");
 #endif
   scanf("%*c"); // 吃掉回车符
   CreateBiThrTree(T); // 按先序产生二叉树T
   PreOrderThreading(H,T); // 在先序遍历的过程中，先序线索化二叉树
   printf("先序遍历(输出)线索二叉树:\n");
   PreOrderTraverse_Thr(H,vi);
   DestroyBiThrTree(H); // 销毁线索二叉树
 #if CHAR
   printf("\n请按先序输入二叉树(如:ab三个空格表示a为根结点,b为左子树的二叉树)\n");
 #else
   printf("\n请按先序输入二叉树(如:1 2 0 0 0表示1为根结点,2为左子树的二叉树)\n");
 #endif
   scanf("%*c"); // 吃掉回车符
   CreateBiThrTree(T); // 按先序产生二叉树T
   PostOrderThreading(H,T); // 在后序遍历的过程中，后序线索化二叉树
   DestroyBiThrTree(H); // 销毁线索二叉树
 }
