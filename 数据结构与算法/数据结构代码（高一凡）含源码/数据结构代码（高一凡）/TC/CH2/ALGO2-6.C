 /* algo2-6.c 利用无头结点的单链表结构处理教科书图2.1(学生健康登记表) */
 #include"c1.h"
 #define NAMELEN 8 /* 姓名最大长度 */
 #define CLASSLEN 4 /* 班级名最大长度 */
 typedef struct
 {
   char name[NAMELEN+1]; /* 包括'\0' */
   long num;
   char sex;
   int age;
   char Class[CLASSLEN+1]; /* 包括'\0' */
   int health;
 }stud; /* 记录的结构 */
 typedef stud ElemType; /* 链表结点元素类型为结构体 */
 #include"c2-2.h"
 #include"bo2-8.c" /* 无头结点单链表的部分基本操作 */
 #include"func2-1.c" /* 无头结点单链表的扩展操作 */
 char sta[3][9]={"健康  ","一般  ","神经衰弱"}; /* 健康状况(3类) */
 FILE *fp; /* 全局变量 */

 void Print(stud e)
 { /* 显示记录e的内容 */
   printf("%-8s %6ld",e.name,e.num);
   if(e.sex=='m')
     printf(" 男");
   else
     printf(" 女");
   printf("%5d  %-4s",e.age,e.Class);
   printf("%9s\n",sta[e.health]);
 }

 void ReadIn(stud *e)
 { /* 由键盘输入结点信息 */
   printf("请输入姓名(<=%d个字符): ",NAMELEN);
   scanf("%s",(*e).name);
   printf("请输入学号: ");
   scanf("%ld",&(*e).num);
   printf("请输入性别(m:男 f:女): ");
   scanf("%*c%c",&(*e).sex);
   printf("请输入年龄: ");
   scanf("%d",&(*e).age);
   printf("请输入班级(<=%d个字符): ",CLASSLEN);
   scanf("%s",(*e).Class);
   printf("请输入健康状况(0:%s 1:%s 2:%s):",sta[0],sta[1],sta[2]);
   scanf("%d",&(*e).health);
 }

 void WriteToFile(stud e)
 { /* 将结点信息写入fp指定的文件 */
   fwrite(&e,sizeof(stud),1,fp);
 }

 Status ReadFromFile(stud *e)
 { /* 由fp指定的文件读取结点信息到e */
   int i;
   i=fread(e,sizeof(stud),1,fp);
   if(i==1) /* 读取文件成功 */
     return OK;
   else
     return ERROR;
 }

 int cmp(ElemType c1,ElemType c2)
 {
   return (int)(c1.num-c2.num);
 }

 void Modify(LinkList *L,ElemType e)
 { /* 修改结点内容，并按学号将结点非降序插入链表L */
   char s[80];
   Print(e); /* 显示原内容 */
   printf("请输入待修改项的内容，不修改的项按回车键保持原值:\n");
   printf("请输入姓名(<=%d个字符): ",NAMELEN);
   gets(s);
   if(strlen(s))
     strcpy(e.name,s);
   printf("请输入学号: ");
   gets(s);
   if(strlen(s))
     e.num=atol(s);
   printf("请输入性别(m:男 f:女): ");
   gets(s);
   if(strlen(s))
     e.sex=s[0];
   printf("请输入年龄: ");
   gets(s);
   if(strlen(s))
     e.age=atoi(s);
   printf("请输入班级(<=%d个字符): ",CLASSLEN);
   gets(s);
   if(strlen(s))
     strcpy(e.Class,s);
   printf("请输入健康状况(0:%s 1:%s 2:%s):",sta[0],sta[1],sta[2]);
   gets(s);
   if(strlen(s))
     e.health=atoi(s); /* 修改完毕 */
   InsertAscend(L,e,cmp); /* 把q所指结点的内容按学号非降序插入L(func2-1.c) */
 }

 #define N 4 /* student记录的个数 */

 Status EqualNum(ElemType c1,ElemType c2)
 {
   if(c1.num==c2.num)
     return OK;
   else
     return ERROR;
 }

 Status EqualName(ElemType c1,ElemType c2)
 {
   if(strcmp(c1.name,c2.name))
     return ERROR;
   else
     return OK;
 }

 void main()
 { /* 表的初始记录 */
   stud student[N]={{"王小林",790631,'m',18,"计91",0},{"陈红",790632,'f',20,"计91",1},
                    {"刘建平",790633,'m',21,"计91",0},{"张立立",790634,'m',17,"计91",2}};
   int i,j,flag=1;
   char filename[13];
   ElemType e;
   LinkList T,p,q;
   InitList(&T); /* 初始化链表 */
   while(flag)
   {
     printf("1:将结构体数组student中的记录按学号非降序插入链表\n");
     printf("2:将文件中的记录按学号非降序插入链表\n");
     printf("3:键盘输入新记录，并将其按学号非降序插入链表\n");
     printf("4:删除链表中第一个有给定学号的记录\n");
     printf("5:删除链表中第一个有给定姓名的记录\n");
     printf("6:修改链表中第一个有给定学号的记录\n");
     printf("7:修改链表中第一个有给定姓名的记录\n");
     printf("8:查找链表中第一个有给定学号的记录\n");
     printf("9:查找链表中第一个有给定姓名的记录\n");
     printf("10:显示所有记录 11:将链表中的所有记录存入文件 12:结束\n");
     printf("请选择操作命令: ");
     scanf("%d",&i);
     switch(i)
     {
       case 1: for(j=0;j<N;j++)
		 InsertAscend(&T,student[j],cmp); /* 在func2-1.c中 */
               break;
       case 2: printf("请输入文件名: ");
               scanf("%s",filename);
               if((fp=fopen(filename,"rb"))==NULL)
                 printf("打开文件失败!\n");
               else
               {
                 while(ReadFromFile(&e))
		   InsertAscend(&T,e,cmp); /* 在func2-1.c中 */
                 fclose(fp);
               }
               break;
       case 3: ReadIn(&e);
	       InsertAscend(&T,e,cmp); /* 在func2-1.c中 */
               break;
       case 4: printf("请输入待删除记录的学号: ");
               scanf("%ld",&e.num);
               if(!DeleteElem(&T,&e,EqualNum)) /* 在func2-1.c中 */
                 printf("没有学号为%ld的记录\n",e.num);
               break;
       case 5: printf("请输入待删除记录的姓名: ");
               scanf("%*c%s",e.name); /* %*c吃掉回车符 */
               if(!DeleteElem(&T,&e,EqualName)) /* 在func2-1.c中 */
                 printf("没有姓名为%s的记录\n",e.name);
               break;
       case 6: printf("请输入待修改记录的学号: ");
               scanf("%ld%*c",&e.num);
	       if(!DeleteElem(&T,&e,EqualNum)) /* 在链表中删除该结点，并由e返回(func2-1.c) */
                 printf("没有学号为%ld的记录\n",e.num);
               else
                 Modify(&T,e); /* 修改e并按学号插入链表T */
               break;
       case 7: printf("请输入待修改记录的姓名: ");
               scanf("%*c%s%*c",e.name); /* %*c吃掉回车符 */
               if(!DeleteElem(&T,&e,EqualName)) /* func2-1.c */
                 printf("没有姓名为%s的记录\n",e.name);
               else
                 Modify(&T,e);
               break;
       case 8: printf("请输入待查找记录的学号: ");
               scanf("%ld",&e.num);
               q=Point(T,e,EqualNum,&p); /* func2-1.c */
               if(!q)
                 printf("没有学号为%ld的记录\n",e.num);
               else
                 Print(q->data);
               break;
       case 9: printf("请输入待查找记录的姓名: ");
               scanf("%*c%s",e.name);
               q=Point(T,e,EqualName,&p); /* func2-1.c */
               if(!q)
                 printf("没有姓名为%s的记录\n",e.name);
               else
                 Print(q->data);
               break;
       case 10:printf("  姓名    学号 性别 年龄 班级 健康状况\n");
               ListTraverse(T,Print);
               break;
       case 11:printf("请输入文件名: ");
               scanf("%s",filename);
               if((fp=fopen(filename,"wb"))==NULL)
                 printf("打开文件失败!\n");
               else
                 ListTraverse(T,WriteToFile);
               fclose(fp);
               break;
       case 12:flag=0;
     }
   }
 }
