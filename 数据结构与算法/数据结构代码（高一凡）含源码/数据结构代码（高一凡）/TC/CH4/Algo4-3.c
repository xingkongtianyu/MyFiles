 /* algo4-3.c 根据书目文件bookinfo.txt生成书名关键词索引文件bookidx.txt，*/
 /* 为运行algo4-4.c做准备，算法4.9～4.14 */
 #include"c1.h"
 typedef int ElemType;
 #include"c2-5.h"
 #include"bo2-6.c"
 #include"c4-2.h"
 #include"bo4-2.c"

 #define MaxKeyNum 25 /* 索引表的最大容量(关键词的最大数目) */
 #define MaxLineLen 52 /* 书目串(书目文件的1行)buf的最大长度 */
 #define MaxNoIdx 10 /* 非索引词(也是一个书目中关键词)的最大数目 */

 typedef struct
 {
   char *item[MaxNoIdx]; /* 词表(字符串)指针数组 */
   int last; /* 词的数量 */
 }WordListType; /* 一个书目的词表(顺序表)和非索引词表(有序表)共用类型 */

 typedef struct
 {
   HString key; /* 关键词(堆分配类型，c4-2.h) */
   LinkList bnolist; /* 存放书号索引的链表(c2-5.h) */
 }IdxTermType; /* 索引项类型 */

 typedef struct
 {
   IdxTermType item[MaxKeyNum+1]; /* 索引项数组类型 */
   int last; /* 关键词的个数 */
 }IdxListType; /* 索引表类型(有序表) */

 /* 全局变量 */
 char buf[MaxLineLen+1]; /* 当前书目串(包括'\0') */
 WordListType wdlist,noidx; /* 暂存一种书的词表，非索引词表 */

 void InitIdxList(IdxListType *idxlist)
 { /* 初始化操作，置索引表idxlist为空表，且在idxlist.item[0]设一空串 */
   (*idxlist).last=0;
   InitString(&(*idxlist).item[0].key); /* 初始化[0]单元，函数在bo4-2.c中 */
   InitList(&(*idxlist).item[0].bnolist); /* 初始化[0]单元，函数在bo2-6.c中 */
 }

 void ExtractKeyWord(int *BookNo)
 { /* 从buf中提取书名关键词到词表wdlist，书号存入BookNo */
   int i,l,f=1; /* f是字符串buf结束标志 0：结束 1：未结束 */
   char *s1,*s2;
   for(i=1;i<=wdlist.last;i++)
   { /* 释放上一个书目在词表wdlist的存储空间 */
     free(wdlist.item[i]);
     wdlist.item[i]=NULL;
   }
   wdlist.last=0; /* 初始化词表wdlist的词数量 */
   *BookNo=atoi(buf); /* 将前几位数字转化为整数，赋给书号BookNo */
   s1=&buf[4]; /* s1指向书名的首字符 */
   while(f)
   { /* 提取书名关键词到词表wdlist */
     s2=strchr(s1,' '); /* s2指向s1后的第一个空格，如没有，返回NULL */
     if(!s2) /* 到串尾(没空格) */
     {
       s2=strchr(s1,'\12'); /* s2指向buf的最后一个字符(回车符10) */
       f=0;
     }
     l=s2-s1; /* 单词长度 */
     if(s1[0]>='A'&&s1[0]<='Z') /* 单词首字母为大写 */
     { /* 写入词表 */
       wdlist.item[wdlist.last]=(char *)malloc((l+1)*sizeof(char)); /* 生成串空间(包括'\0') */
       for(i=0;i<l;i++)
         wdlist.item[wdlist.last][i]=s1[i]; /* 写入词表 */
       wdlist.item[wdlist.last][l]=0; /* 串结束符 */
       for(i=0;i<noidx.last&&(l=strcmp(wdlist.item[wdlist.last],noidx.item[i]))>0;i++);
       /* 查找是否为非索引词 */
       if(!l) /* 是非索引词 */
       {
         free(wdlist.item[wdlist.last]); /* 从词表中删除该词 */
         wdlist.item[wdlist.last]=NULL;
       }
       else
         wdlist.last++; /* 词表长度+1 */
     }
     s1=s2+1; /* s1移动到下一个单词的首字符处 */
   };
 }

 void GetWord(int i,HString *wd)
 { /* 用wd返回词表wdlist中第i个关键词，算法4.11 */
   StrAssign(wd,wdlist.item[i]); /* 生成关键字字符串 bo4-2.c */
 }

 int Locate(IdxListType *idxlist,HString wd,Status *b)
 { /* 在索引表idxlist中查询是否存在与wd相等的关键词。若存在，则返回其 */
   /* 在索引表中的位置，且b取值TRUE；否则返回插入位置，且b取值FALSE，算法4.12 */
   int i,m;
   for(i=(*idxlist).last;(m=StrCompare((*idxlist).item[i].key,wd))>0;--i); /* bo4-2.c */
   if(m==0) /* 找到 */
   {
     *b=TRUE;
     return i;
   }
   else
   {
     *b=FALSE;
     return i+1;
   }
 }

 void InsertNewKey(IdxListType *idxlist,int i,HString wd)
 { /* 在索引表idxlist的第i项上插入新关键词wd，并初始化书号索引的链表为空表，算法4.13 */
   int j;
   for(j=(*idxlist).last;j>=i;--j) /* 后移索引项 */
     (*idxlist).item[j+1]=(*idxlist).item[j];
   InitString(&(*idxlist).item[i].key); /* bo4-2.c */
   StrCopy(&(*idxlist).item[i].key,wd); /* 串拷贝插入新的索引项 bo4-2.c */
   InitList(&(*idxlist).item[i].bnolist); /* 初始化书号索引表为空表 bo2-6.c */
   (*idxlist).last++;
 }

 void InsertBook(IdxListType *idxlist,int i,int bno)
 { /* 在索引表idxlist的第i项中插入书号为bno的索引，算法4.14 */
   Link p;
   MakeNode(&p,bno); /* 分配结点 bo2-6.c */
   p->next=NULL;
   Append(&(*idxlist).item[i].bnolist,p); /* 插入新的书号索引 bo2-6.c */
 }

 void InsIdxList(IdxListType *idxlist,int bno)
 { /* 将书号为bno的关键词插入索引表，算法4.10 */
   int i,j;
   Status b;
   HString wd;
   InitString(&wd); /* bo4-2.c */
   for(i=0;i<wdlist.last;i++)
   {
     GetWord(i,&wd);
     j=Locate(idxlist,wd,&b); /* 关键词的位置或待插入的位置(当索引表中不存在该词) */
     if(!b) /* 索引表中不存在关键词wd */
       InsertNewKey(idxlist,j,wd); /* 在索引表中插入新的索引项 */
     InsertBook(idxlist,j,bno); /* 插入书号索引 */
   }
 }

 void PutText(FILE *f,IdxListType idxlist)
 { /* 将生成的索引表idxlist输出到文件f */
   int i,j;
   Link p;
   fprintf(f,"%d\n",idxlist.last);
   for(i=1;i<=idxlist.last;i++)
   {
     for(j=0;j<idxlist.item[i].key.length;j++)
       fprintf(f,"%c",idxlist.item[i].key.ch[j]); /* HString类型串尾没有\0，只能逐个字符输出 */
     fprintf(f,"\n%d\n",idxlist.item[i].bnolist.len);
     p=idxlist.item[i].bnolist.head;
     for(j=1;j<=idxlist.item[i].bnolist.len;j++)
     {
       p=p->next;
       fprintf(f,"%d ",p->data);
     }
     fprintf(f,"\n");
   }
 }

 void main()
 { /* 算法4.9 */
   FILE *f; /* 任何时间最多打开一个文件 */
   IdxListType idxlist; /* 索引表 */
   int BookNo; /* 书号变量 */
   int k;
   f=fopen("NoIdx.txt","r"); /* 打开非索引词文件 */
   if(!f)
     exit(OVERFLOW);
   fscanf(f,"%d",&noidx.last); /* 读取非索引词个数 */
   for(k=0;k<noidx.last;k++) /* 把非索引词文件的内容依次拷到noidx中 */
   {
     fscanf(f,"%s",buf);
     noidx.item[k]=(char*)malloc((strlen(buf)+1)*sizeof(char));
     strcpy(noidx.item[k],buf);
   }
   fclose(f); /* 关闭非索引词文件 */
   f=fopen("BookInfo.txt","r"); /* 打开书目文件 */
   if(!f)
     exit(FALSE);
   InitIdxList(&idxlist); /* 设索引表idxlist为空，并初始化[0]单元 */
   while(fgets(buf,MaxLineLen,f)) /* 由书目文件读取1行信息到buf成功 */
   {
     ExtractKeyWord(&BookNo);/*将buf中的书号存入BookNo,关键词提取到词表(当前书目的关键词表)中 */
     InsIdxList(&idxlist,BookNo); /* 将书号为BookNo的关键词及书号插入索引表idxlist中 */
   }
   fclose(f); /* 关闭书目文件 */
   f=fopen("BookIdx.txt","w"); /* 打开书名关键词索引文件 */
   if(!f)
     exit(INFEASIBLE);
   PutText(f,idxlist); /* 将生成的索引表idxlist输出到书名关键词索引文件 */
   fclose(f); /* 关闭书名关键词索引文件 */
 }
