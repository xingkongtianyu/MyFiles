 /* algo9-1.c 检验bo9-1.c(顺序表部分)的程序 */
 #include"c1.h"
 #define N 5 /* 数据元素个数 */
 typedef long KeyType; /* 设关键字域为长整型 */
 #define key number /* 定义关键字为准考证号 */
 typedef struct
 {
   long number; /* 准考证号，与关键字类型同 */
   char name[9]; /* 姓名(4个汉字加1个串结束标志) */
   int politics; /* 政治 */
   int Chinese; /* 语文 */
   int English; /* 英语 */
   int math; /* 数学 */
   int physics; /* 物理 */
   int chemistry; /* 化学 */
   int biology; /* 生物 */
   int total; /* 总分 */
 }ElemType; /* 数据元素类型(以教科书图9.1高考成绩为例) */
 #include"c9-7.h"
 #include"c9-1.h"
 #include"bo9-1.c"

 void print(ElemType c) /* Traverse()调用的函数 */
 {
   printf("%-8ld%-8s%4d%5d%5d%5d%5d%5d%5d%5d\n",c.number,c.name,c.politics,
	   c.Chinese,c.English,c.math,c.physics,c.chemistry,c.biology,c.total);
 }

 void main()
 {
   ElemType r[N]={{179328,"何芳芳",85,89,98,100,93,80,47},
   {179325,"陈红",85,86,88,100,92,90,45},
	{179326,"陆华",78,75,90,80,95,88,37},
	{179327,"张平",82,80,78,98,84,96,40},
	{179324,"赵小怡",76,85,94,57,77,69,44}}; /* 数组不按关键字有序 */
   SSTable st;
   int i;
   long s;
   for(i=0;i<N;i++) /* 计算总分 */
     r[i].total=r[i].politics+r[i].Chinese+r[i].English+r[i].math+r[i].physics+
	 r[i].chemistry+r[i].biology;
   Creat_Seq(&st,r,N); /* 由数组r产生顺序静态查找表st */
   printf("准考证号  姓名  政治 语文 外语 数学 物理 化学 生物 总分\n");
   Traverse(st,print); /* 按顺序输出静态查找表st */
   printf("请输入待查找人的考号: ");
   scanf("%ld",&s);
   i=Search_Seq(st,s); /* 顺序查找 */
   if(i)
     print(st.elem[i]);
   else
     printf("没找到\n");
   Destroy(&st);
 }
