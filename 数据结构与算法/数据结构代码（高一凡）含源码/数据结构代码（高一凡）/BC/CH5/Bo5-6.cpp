 // bo5-6.cpp 广义表的扩展线性链表存储(存储结构由c5-6.h定义)的基本操作(13个)
 #include"func5-1.cpp" // 算法5.8

 void InitGList(GList1 &L)
 { // 创建空的广义表L
   L=NULL;
 }

 void CreateGList(GList1 &L,SString S) // 算法5.7改
 { // 采用扩展线性链表存储结构，由广义表的书写形式串S创建广义表L。设emp="()"
   SString emp,sub,hsub;
   GList1 p;
   StrAssign(emp,"()"); // 设emp="()"
   if(!(L=(GList1)malloc(sizeof(GLNode1)))) // 建表结点不成功
     exit(OVERFLOW);
   if(!StrCompare(S,emp)) // 创建空表
   {
     L->tag=LIST;
     L->hp=L->tp=NULL;
   }
   else if(StrLength(S)==1) // 创建单原子广义表
   {
     L->tag=ATOM;
     L->atom=S[1];
     L->tp=NULL;
   }
   else // 创建一般表
   {
     L->tag=LIST;
     L->tp=NULL;
     SubString(sub,S,2,StrLength(S)-2); // 脱外层括号(去掉第1个字符和最后1个字符)给串sub
     sever(sub,hsub); // 从sub中分离出表头串hsub
     CreateGList(L->hp,hsub);
     p=L->hp;
     while(!StrEmpty(sub)) // 表尾不空，则重复建n个子表
     {
       sever(sub,hsub); // 从sub中分离出表头串hsub
       CreateGList(p->tp,hsub);
       p=p->tp;
     };
   }
 }

 void DestroyGList(GList1 &L)
 { // 初始条件：广义表L存在。操作结果：销毁广义表L
   GList1 ph,pt;
   if(L) // L不为空表
   { // 由ph和pt接替L的两个指针
     if(L->tag) // 是子表
       ph=L->hp;
     else // 是原子
       ph=NULL;
     pt=L->tp;
     DestroyGList(ph); // 递归销毁表ph
     DestroyGList(pt); // 递归销毁表pt
     free(L); // 释放L所指结点
     L=NULL; // 令L为空
   }
 }

 void CopyGList(GList1 &T,GList1 L)
 { // 初始条件：广义表L存在。操作结果：由广义表L复制得到广义表T
   T=NULL;
   if(L) // L不空
   {
     T=(GList1)malloc(sizeof(GLNode1));
     if(!T)
       exit(OVERFLOW);
     T->tag=L->tag; // 复制枚举变量
     if(L->tag==ATOM) // 复制共用体部分
       T->atom=L->atom; // 复制单原子
     else
       CopyGList(T->hp,L->hp); // 复制子表
     if(L->tp==NULL) // 到表尾
       T->tp=L->tp;
     else
       CopyGList(T->tp,L->tp); // 复制子表
   }
 }

 int GListLength(GList1 L)
 { // 初始条件：广义表L存在。操作结果：求广义表L的长度，即元素个数
   int len=0;
   GList1 p=L->hp; // p指向第1个元素
   while(p)
   {
     len++;
     p=p->tp;
   };
   return len;
 }

 int GListDepth(GList1 L)
 { // 初始条件：广义表L存在。操作结果：求广义表L的深度
   int max,dep;
   GList1 pp;
   if(L==NULL||L->tag==LIST&&!L->hp)
     return 1; // 空表深度为1
   else if(L->tag==ATOM)
     return 0; // 单原子表深度为0，只会出现在递归调用中
   else // 求一般表的深度
     for(max=0,pp=L->hp;pp;pp=pp->tp)
     {
       dep=GListDepth(pp); // 求以pp为头指针的子表深度
       if(dep>max)
         max=dep;
     }
   return max+1; // 非空表的深度是各元素的深度的最大值加1
 }

 Status GListEmpty(GList1 L)
 { // 初始条件：广义表L存在。操作结果：判定广义表L是否为空
   if(!L||L->tag==LIST&&!L->hp)
     return OK;
   else
     return ERROR;
 }

 GList1 GetHead(GList1 L)
 { // 生成广义表L的表头元素，返回指向这个元素的指针
   GList1 h,p;
   if(!L||L->tag==LIST&&!L->hp) // 空表无表头
     return NULL;
   p=L->hp->tp; // p指向L的表尾
   L->hp->tp=NULL; // 截去L的表尾部分
   CopyGList(h,L->hp); // 将表头元素复制给h
   L->hp->tp=p; // 恢复L的表尾(保持原L不变)
   return h;
 }

 GList1 GetTail(GList1 L)
 { // 将广义表L的表尾生成为广义表，返回指向这个新广义表的指针
   GList1 t,p;
   if(!L||L->tag==LIST&&!L->hp) // 空表无表尾
     return NULL;
   p=L->hp; // p指向表头
   L->hp=p->tp; // 在L中删去表头
   CopyGList(t,L); // 将L的表尾拷给t
   L->hp=p; // 恢复L的表头(保持原L不变)
   return t;
 }

 void InsertFirst_GL(GList1 &L,GList1 e)
 { // 初始条件：广义表存在。操作结果：插入元素e(也可能是子表)作为广义表L的第1元素(表头)
   GList1 p=L->hp;
   L->hp=e;
   e->tp=p;
 }

 void DeleteFirst_GL(GList1 &L,GList1 &e)
 { // 初始条件：广义表L存在。操作结果：删除广义表L的第一元素，并用e返回其值
   if(L&&L->hp)
   {
     e=L->hp;
     L->hp=e->tp;
     e->tp=NULL;
   }
   else
     e=L;
 }

 void Traverse_GL(GList1 L,void(*v)(AtomType))
 { // 利用递归算法遍历广义表L
   GList1 hp;
   if(L) // L不空
   {
     if(L->tag==ATOM) // L为单原子
     {
       v(L->atom);
       hp=NULL;
     }
     else // L为子表
       hp=L->hp;
     Traverse_GL(hp,v);
     Traverse_GL(L->tp,v);
   }
 }
