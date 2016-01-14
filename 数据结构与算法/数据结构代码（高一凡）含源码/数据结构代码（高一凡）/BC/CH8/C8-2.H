 // c8-2.h 伙伴系统可利用空间表的结构
 #define m 10 // 可利用空间总容量1024字的2的幂次，子表的个数为m+1
 typedef struct WORD_b
 {
   WORD_b *llink; // 指向前驱结点
   int tag; // 块标志，0：空闲，1：占用
   int kval; // 块大小，值为2的幂次k
   WORD_b *rlink; // 头部域，指向后继结点
 }WORD_b,head,*Space; // WORD_b：内存字类型，结点的第一个字也称为head

 typedef struct HeadNode
 {
   int nodesize; // 该链表的空闲块的大小
   WORD_b *first; // 该链表的表头指针
 }FreeList[m+1]; // 表头向量类型
