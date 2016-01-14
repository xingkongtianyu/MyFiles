 // algo3-4.cpp 行编辑程序，实现算法3.2
 typedef char SElemType;
 #include"c1.h"
 #include"c3-1.h"
 #include"bo3-1.cpp"
 FILE *fp;

 void copy(SElemType c)
 { // 将字符c送至fp所指的文件中
   fputc(c,fp);
 }

 void LineEdit()
 { // 利用字符栈s，从终端接收一行并送至调用过程的数据区。算法3.2
   SqStack s;
   char ch;
   InitStack(s);
   printf("请输入一个文本文件,^Z结束输入:\n");
   ch=getchar();
   while(ch!=EOF)
   { // 当全文没结束(EOF为^Z键，全文结束符)
     while(ch!=EOF&&ch!='\n')
     { // 当全文没结束且没到行末(不是换行符)
       switch(ch)
       {
         case '#':if(!StackEmpty(s))
                    Pop(s,ch); // 仅当栈非空时退栈,c可由ch替代
                  break;
         case '@':ClearStack(s); // 重置s为空栈
                  break;
         default :Push(s,ch); // 其他字符进栈
       }
       ch=getchar(); // 从终端接收下一个字符
     }
     StackTraverse(s,copy); // 将从栈底到栈顶的栈内字符传送至文件
     fputc('\n',fp); // 向文件输入一个换行符
     ClearStack(s); // 重置s为空栈
     if(ch!=EOF)
       ch=getchar();
   }
   DestroyStack(s);
 }

 void main()
 {
   fp=fopen("ed.txt","w"); // 在当前目录下建立ed.txt文件，用于写数据，
   if(fp)                  // 如已有同名文件则先删除原文件
   {
     LineEdit();
     fclose(fp); // 关闭fp所指的文件
   }
   else
     printf("建立文件失败!\n");
 }
