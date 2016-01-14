 /* main2-7.c 检验bo2-7.c的主程序 */
 #include"c1.h"
 #include"c2-6.h"
 #include"bo2-7.c"
 void main()
 {
   polynomial p,q;
   int m;
   printf("请输入第1个一元多项式的非零项的个数：");
   scanf("%d",&m);
   CreatPolyn(&p,m);
   printf("请输入第2个一元多项式的非零项的个数：");
   scanf("%d",&m);
   CreatPolyn(&q,m);
   AddPolyn(&p,&q);
   printf("2个一元多项式相加的结果：\n");
   PrintPolyn(p);
   printf("请输入第3个一元多项式的非零项的个数：");
   scanf("%d",&m);
   CreatPolyn(&q,m);
   AddPolyn1(&p,&q);
   printf("2个一元多项式相加的结果(另一种方法)：\n");
   PrintPolyn(p);
   printf("请输入第4个一元多项式的非零项的个数：");
   scanf("%d",&m);
   CreatPolyn(&q,m);
   SubtractPolyn(&p,&q);
   printf("2个一元多项式相减的结果：\n");
   PrintPolyn(p);
   printf("请输入第5个一元多项式的非零项的个数：");
   scanf("%d",&m);
   CreatPolyn(&q,m);
   MultiplyPolyn(&p,&q);
   printf("2个一元多项式相乘的结果：\n");
   PrintPolyn(p);
   DestroyPolyn(&p);
 }
