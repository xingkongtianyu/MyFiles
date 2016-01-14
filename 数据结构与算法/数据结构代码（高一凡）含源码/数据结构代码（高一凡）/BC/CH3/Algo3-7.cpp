 // algo3-7.cpp 表达式求值(范围为int类型，输入负数要用(0-正数)表示)
 typedef int SElemType; // 栈元素类型为整型，改algo3-6.cpp
 #include"c1.h"
 #include"c3-1.h" // 顺序栈的存储结构
 #include"bo3-1.cpp" // 顺序栈的基本操作
 #include"func3-2.cpp"

 SElemType EvaluateExpression()
 { // 算术表达式求值的算符优先算法。设OPTR和OPND分别为运算符栈和运算数栈
   SqStack OPTR,OPND;
   SElemType a,b,d,x; // 改algo3-6.cpp
   char c; // 存放由键盘接收的字符，改algo3-6.cpp
   char z[11]; // 存放整数字符串，改algo3-6.cpp
   int i; // 改algo3-6.cpp
   InitStack(OPTR); // 初始化运算符栈OPTR和运算数栈OPND
   InitStack(OPND);
   Push(OPTR,'\n'); // 将换行符压入运算符栈OPTR的栈底(改)
   c=getchar(); // 由键盘读入1个字符到c
   GetTop(OPTR,x); // 将运算符栈OPTR的栈顶元素赋给x
   while(c!='\n'||x!='\n') // c和x不都是换行符
   {
     if(In(c)) // c是7种运算符之一
       switch(Precede(x,c)) // 判断x和c的优先权
       {
         case'<' :Push(OPTR,c); // 栈顶元素x的优先权低，入栈c
                  c=getchar();  // 由键盘读入下一个字符到c
                  break;
         case'=' :Pop(OPTR,x); // x='('且c=')'情况，弹出'('给x(后又扔掉)
                  c=getchar(); // 由键盘读入下一个字符到c(扔掉')')
                  break;
         case'>' :Pop(OPTR,x); // 栈顶元素x的优先权高，弹出运算符栈OPTR的栈顶元素给x(改)
                  Pop(OPND,b); // 依次弹出运算数栈OPND的栈顶元素给b，a
                  Pop(OPND,a);
                  Push(OPND,Operate(a,x,b)); // 做运算a x b，并将运算结果入运算数栈
       }
     else if(c>='0'&&c<='9') // c是操作数，此语句改algo3-6.cpp
     {
       i=0;
       while(c>='0'&&c<='9') // 是连续数字
       {
         z[i++]=c;
         c=getchar();
       }
       z[i]=0; // 字符串结束符
       d=atoi(z); // 将z中保存的数值型字符串转为整型存于d
       Push(OPND,d); // 将d压入运算数栈OPND
     }
     else // c是非法字符，以下同algo3-6.cpp
     {
       printf("出现非法字符\n");
       exit(ERROR);
     }
     GetTop(OPTR,x); // 将运算符栈OPTR的栈顶元素赋给x
   }
   Pop(OPND,x); // 弹出运算数栈OPND的栈顶元素(运算结果)给x(改此处)
   if(!StackEmpty(OPND)) // 运算数栈OPND不空(运算符栈OPTR仅剩'\n')
   {
     printf("表达式不正确\n");
     exit(ERROR);
   }
   return x;
 }

 void main()
 {
   printf("请输入算术表达式,负数要用(0-正数)表示\n");
   printf("%d\n",EvaluateExpression());
 }
