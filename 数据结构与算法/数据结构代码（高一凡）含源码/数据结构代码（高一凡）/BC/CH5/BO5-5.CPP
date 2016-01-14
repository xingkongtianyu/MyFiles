 // bo5-5.cpp 广义表的头尾链表存储(存储结构由c5-5.h定义)的基本操作(11个),包括算法5.5,5.6,5.7
 #include"func5-1.cpp" // 算法5.8
 void InitGList(GList &L)
 { // 创建空的广义表L
   L=NULL;
 }

 void CreateGList(GList &L,SString S) // 算法5.7
 { // 采用头尾链表存储结构，由广义表的书写形式串S创建广义表L。设emp="()"
   SString sub,hsub,emp;
   GList p,q;
   StrAssign(emp,"()"); // 空串emp="()"
   if(!StrCompare(S,emp)) // S="()"
     L=NULL; // 创建空表
   else // S不是空串
   {
     if(!(L=(GList)malloc(sizeof(GLNode)))) // 建表结点
       exit(OVERFLOW);
     if(StrLength(S)==1) // S为单原子，只会出现在递归调用中
     {
       L->tag=ATOM;
       L->atom=S[1]; // 创建单原子广义表
     }
     else // S为表
     {
       L->tag=LIST;
       p=L;
       SubString(sub,S,2,StrLength(S)-2); // 脱外层括号(去掉第1个字符和最后1个字符)给串sub
       do
       { // 重复建n个子表
         sever(sub,hsub); // 从sub中分离出表头串hsub
         CreateGList(p->ptr.hp,hsub);
         q=p;
         if(!StrEmpty(sub)) // 表尾不空
         {
           if(!(p=(GLNode *)malloc(sizeof(GLNode))))
             exit(OVERFLOW);
           p->tag=LIST;
	   q->ptr.tp=p;
         }
       }while(!StrEmpty(sub));
       q->ptr.tp=NULL;
     }
   }
 }

 void DestroyGList(GList &L)
 { // 销毁广义表L
   GList q1,q2;
   if(L)
   {
     if(L->tag==LIST) // 删除表结点
     {
       q1=L->ptr.hp; // q1指向表头
       q2=L->ptr.tp; // q2指向表尾
       DestroyGList(q1); // 销毁表头
       DestroyGList(q2); // 销毁表尾
     }
     free(L);
     L=NULL;
   }
 }

 void CopyGList(GList &T,GList L)
 { // 采用头尾链表存储结构，由广义表L复制得到广义表T。算法5.6
   if(!L) // 复制空表
     T=NULL;
   else
   {
     T=(GList)malloc(sizeof(GLNode)); // 建表结点
     if(!T)
       exit(OVERFLOW);
     T->tag=L->tag;
     if(L->tag==ATOM)
       T->atom=L->atom; // 复制单原子
     else
     {
       CopyGList(T->ptr.hp,L->ptr.hp); // 递归复制子表
       CopyGList(T->ptr.tp,L->ptr.tp);
     }
   }
 }

 int GListLength(GList L)
 { // 返回广义表的长度，即元素个数
   int len=0;
   while(L)
   {
     L=L->ptr.tp;
     len++;
   }
   return len;
 }

 int GListDepth(GList L)
 { // 采用头尾链表存储结构，求广义表L的深度。算法5.5
   int max,dep;
   GList pp;
   if(!L)
     return 1; // 空表深度为1
   if(L->tag==ATOM)
     return 0; // 原子深度为0，只会出现在递归调用中
   for(max=0,pp=L;pp;pp=pp->ptr.tp)
   {
     dep=GListDepth(pp->ptr.hp); // 递归求以pp->ptr.hp为头指针的子表深度
     if(dep>max)
       max=dep;
   }
   return max+1; // 非空表的深度是各元素的深度的最大值加1
 }

 Status GListEmpty(GList L)
 { // 判定广义表是否为空
   if(!L)
     return TRUE;
   else
     return FALSE;
 }

 GList GetHead(GList L)
 { // 生成广义表L的表头元素，返回指向这个元素的指针
   GList h,p;
   if(!L) // 空表无表头
     return NULL;
   p=L->ptr.hp; // p指向L的表头元素
   CopyGList(h,p); // 将表头元素复制给h
   return h;
 }

 GList GetTail(GList L)
 { // 将广义表L的表尾生成为广义表，返回指向这个新广义表的指针
   GList t;
   if(!L) // 空表无表尾
     return NULL;
   CopyGList(t,L->ptr.tp); // 将L的表尾拷给t
   return t;
 }

 void InsertFirst_GL(GList &L,GList e)
 { // 初始条件：广义表存在。操作结果：插入元素e(也可能是子表)作为广义表L的第1元素(表头)
   GList p=(GList)malloc(sizeof(GLNode)); // 生成新结点
   if(!p)
     exit(OVERFLOW);
   p->tag=LIST; // 结点的类型是表
   p->ptr.hp=e; // 表头指向e
   p->ptr.tp=L; // 表尾指向原表L
   L=p; // L指向新结点
 }

 void DeleteFirst_GL(GList &L,GList &e)
 { // 初始条件：广义表L存在。操作结果：删除广义表L的第一元素，并用e返回其值
   GList p=L; // p指向第1个结点
   e=L->ptr.hp; // e指向L的表头
   L=L->ptr.tp; // L指向原L的表尾
   free(p); // 释放第1个结点
 }

 void Traverse_GL(GList L,void(*v)(AtomType))
 { // 利用递归算法遍历广义表L
   if(L) // L不空
     if(L->tag==ATOM) // L为单原子
       v(L->atom);
     else // L为广义表
     {
       Traverse_GL(L->ptr.hp,v); // 递归遍历L的表头
       Traverse_GL(L->ptr.tp,v); // 递归遍历L的表尾
     }
 }

