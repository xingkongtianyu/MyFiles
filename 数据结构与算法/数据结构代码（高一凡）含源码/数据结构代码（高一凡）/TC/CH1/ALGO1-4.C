 /* algo1-4.cpp 说明exit()函数作用的程序 */
 #include"c1.h"
 int a(int i)
 {
   if(i==1)
   {
     printf("退出程序的运行\n");
     exit(1);
   }
   return i;
 }

 void main()
 {
   int i;
   printf("请输入i：");
   scanf("%d",&i);
   printf("a(i)=%d\n",a(i));
 }