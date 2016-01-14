 // algo9-2.cpp 检验bo9-1.cpp(有序表部分)的程序
 #include"c1.h"
 #define N 11 // 数据元素个数
 typedef int KeyType; // 设关键字域为整型
 struct ElemType // 数据元素类型
 {
   KeyType key; // 仅有关键字域
 };
 #include"c9-7.h"
 #include"c9-1.h"
 #include"bo9-1.cpp"

 void print(ElemType c) // Traverse()调用的函数
 {
   printf("%d ",c.key);
 }

 void main()
 {
   SSTable st;
   int i;
   KeyType s;
   ElemType r[N]={5,13,19,21,37,56,64,75,80,88,92}; // 数据元素(以教科书p.219的数据为例)
   Creat_Ord(st,r,N); // 由全局数组产生非降序静态查找表st
   Traverse(st,print); // 顺序输出非降序静态查找表st
   printf("\n");
   printf("请输入待查找值的关键字: ");
   scanf("%d",&s);
   i=Search_Bin(st,s); // 折半查找有序表
   if(i)
     printf("%d 是第%d个记录的关键字\n",st.elem[i].key,i);
   else
     printf("没找到\n");
   Destroy(st);
 }
