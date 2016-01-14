 /* algo3-3.c 括号（()、[]和{}）匹配的检验 */
 typedef char SElemType;
 #include"c1.h"
 #include"c3-1.h"
 #include"bo3-1.c"

 void check()
 { /* 对于输入的任意一个字符串，检验括号是否配对 */
   SqStack s;
   SElemType ch[80],*p,e;
   InitStack(&s); /* 初始化栈成功 */
   printf("请输入带括号（()、[]和{}）的表达式\n");
   gets(ch);
   p=ch; /* p指向字符串的首字符 */
   while(*p) /* 没到串尾 */
     switch(*p)
     {
       case '(':
       case '[':
       case '{':Push(&s,*p++); /* 左括号入栈，且p++ */
                break;
       case ')':
       case ']':
       case '}':if(!StackEmpty(s)) /* 栈不空 */
                {
                  Pop(&s,&e); /* 弹出栈顶元素 */
                  if(!(e=='('&&*p==')'||e=='['&&*p==']'||e=='{'&&*p=='}'))
                  { /* 出现3种匹配情况之外的情况 */
                    printf("左右括号不配对\n");
                    exit(ERROR);
                  }
                }
                else /* 栈空 */
                {
                  printf("缺乏左括号\n");
                  exit(ERROR);
                }
       default: p++; /* 其它字符不处理，指针向后移 */
     }
   if(StackEmpty(s)) /* 字符串结束时栈空 */
     printf("括号匹配\n");
   else
     printf("缺乏右括号\n");
 }

 void main()
 {
   check();
 }
