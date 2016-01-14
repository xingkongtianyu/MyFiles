 // algo2-7.cpp 教科书中图2.10静态链表示例
 // 第1个结点的位置在[0].cur中。成员cur的值为0，则到链表尾
 #include"c1.h"
 #define N 6 // 字符串长度
 typedef char ElemType[N];
 #include"c2-3.h"

 void main()
 {
   SLinkList s={{"",1},{"ZHAO",2},{"QIAN",3},{"SUN",4},{"LI",5},{"ZHOU",6},{"WU",7},{"ZHENG",8},{"WANG",0}}; // 教科书中图2.10(a)的状态
   int i;
   i=s[0].cur; // i指示第1个结点的位置
   while(i)
   { // 输出教科书中图2.10(a)的状态
     printf("%s ",s[i].data); // 输出链表的当前值
     i=s[i].cur; // 找到下一个
   }
   printf("\n");
   s[4].cur=9; // 按教科书中图2.10(b)修改(在"LI"之后插入"SHI")
   s[9].cur=5;
   strcpy(s[9].data,"SHI");
   s[6].cur=8; // 删除"ZHENG"
   i=s[0].cur; // i指示第1个结点的位置
   while(i)
   { // 输出教科书中图2.10(b)的状态
     printf("%s ",s[i].data); // 输出链表的当前值
     i=s[i].cur; // 找到下一个
   }
   printf("\n");
 }