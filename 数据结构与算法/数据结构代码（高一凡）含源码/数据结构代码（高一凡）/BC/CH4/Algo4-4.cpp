 // algo4-4.cpp 根据algo4-3.cpp产生的文件,索引查询图书
 #include"c1.h"
 typedef int ElemType;
 #include"c2-5.h"
 #include"bo2-6.cpp"
 #include"c4-2.h"
 #include"bo4-2.cpp"

 #define MaxBookNum 10 // 假设只对10个书名建索引表
 #define MaxKeyNum 25 // 索引表的最大容量(关键词的最大数目)
 #define MaxLineLen 46 // 书名的最大长度

 struct IdxTermType // 索引项类型
 {
   HString key; // 关键词(堆分配类型，c4-2.h)
   LinkList bnolist; // 存放书号索引的链表(c2-5.h)
 };

 struct IdxListType // 索引表类型(有序表)
 {
   IdxTermType item[MaxKeyNum+1]; // 索引项数组类型
   int last; // 关键词的个数
 };

 struct BookTermType // 书目项类型
 {
   char bookname[MaxLineLen+1]; // 书名串(包括'\0')
   int bookno; // 书号
 };

 struct BookListType // 书目表类型(有序表)
 {
   BookTermType item[MaxBookNum]; // 书目项数组类型
   int last; // 书目的数量
 };

 void main()
 {
   FILE *f; // 任何时间最多打开一个文件
   IdxListType idxlist; // 索引表
   BookListType booklist; // 书目表
   char buf[MaxLineLen+5]; // 当前书目串(包括书号和'\0')
   HString ch; // 索引字符串
   int BookNo; // 书号
   Link p; // 链表指针
   int i,j,k,flag=1; // flag是继续查询的标志
   InitString(ch); // 初始化HString类型的变量
   if(!(f=fopen("BookIdx.txt","r"))) // 打开书名关键词索引表文件
     exit(OVERFLOW);
   fscanf(f,"%d",&idxlist.last); // 书名关键词个数
   for(k=0;k<idxlist.last;k++) // 把关键词文件的内容拷到idxlist中
   {
     fscanf(f,"%s",buf);
     i=0;
     while(buf[i])
       buf[i++]=tolower(buf[i]); // 字母转为小写
     InitString(idxlist.item[k].key);
     StrAssign(idxlist.item[k].key,buf);
     InitList(idxlist.item[k].bnolist); // 初始化书号链表，bo2-6.cpp
     fscanf(f,"%d",&i);
     for(j=0;j<i;j++)
     {
       fscanf(f,"%d",&BookNo);
       MakeNode(p,BookNo); // 产生新的书号结点，bo2-6.cpp
       p->next=NULL; // 给书号结点的指针域赋值
       Append(idxlist.item[k].bnolist,p); // 在表尾插入新的书号结点，bo2-6.cpp
     }
   }
   fclose(f);
   if(!(f=fopen("BookInfo.txt","r"))) // 打开书目文件
     exit(FALSE);
   i=0;
   while(fgets(buf,MaxLineLen,f))
   { // 把书目文件的内容拷到booklist中
     booklist.item[i].bookno=atoi(buf); // 前几位数字为书号
     strcpy(booklist.item[i++].bookname,&buf[4]); // 将buf由书名开始的字符串拷贝到booklist中
   }
   booklist.last=i;
   while(flag)
   {
     printf("请输入书目的关键词(一个)：");
     scanf("%s",buf);
     i=0;
     while(buf[i])
       buf[i++]=tolower(buf[i]); // 字母转为小写
     StrAssign(ch,buf);
     i=0;
     do
     {
       k=StrCompare(ch,idxlist.item[i++].key); // bo4-2.cpp
     }while(k&&i<=idxlist.last);
     if(!k) // 索引表中有此关键词
     {
       p=idxlist.item[--i].bnolist.head->next; // p指向索引表中此关键词相应链表的首元结点
       while(p)
       {
         j=0;
         while(j<booklist.last&&p->data!=booklist.item[j].bookno) // 在booklist中找相应的书号
           j++;
         if(j<booklist.last)
           printf("%3d %s",booklist.item[j].bookno,booklist.item[j].bookname);
         p=p->next; // 继续向后找
       }
     }
     else
       printf("没找到\n");
     printf("继续查找请输入1，退出查找请输入0：");
     scanf("%d",&flag);
   }
 }
