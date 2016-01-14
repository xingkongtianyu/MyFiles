 // algo8-1.cpp 边界标识法。实现算法8.1的程序
 #include"c1.h"
 #include"c8-1.h"
 #define MAX 1000 // 可利用空间的大小(以WORD的字节数为单位)
 #define e 10 // 块的最小尺寸-1(以WORD的字节数为单位)

 Space AllocBoundTag(Space &pav,int n) // 算法8.1(首次拟合法)
 { // 若可利用空间表pav中有不小于n的空闲块，则分配相应的存储块，并返回其首地址；否则返回NULL
   // 若分配后可利用空间表不空，则pav指向表中刚分配过的结点的后继结点
   Space p,f;
   for(p=pav;p&&p->size<n&&p->rlink!=pav;p=p->rlink); // 在pav中查找不小于n的空闲块
   if(!p||p->size<n) // 找不到
     return NULL; // 返回空指针
   else // p指向找到的空闲块的头部域
   {
     f=FootLoc(p); // f指向p所指空闲块的底部域
     pav=p->rlink; // 移动pav，使其指向p所指结点的后继结点
     if(p->size-n<=e) // 整块分配，不保留<=e的剩余量，删除该块
     {
       if(pav==p) // 可利用空间表只有1个空闲块
         pav=NULL; // 可利用空间表变为空表
       else // 在表中删除该块
       {
         pav->llink=p->llink;
         p->llink->rlink=pav;
       }
       p->tag=f->tag=1; // 修改分配结点的头部和底部标志为占用
     }
     else // 分配该块的后n个字(高地址部分)，不删除该块
     {
       f->tag=1; // 修改分配块的底部标志
       p->size-=n; // 置剩余块大小
       f=FootLoc(p); // 指向剩余块底部
       f->tag=0; // 设置剩余块底部
       f->uplink=p;
       p=f+1; // 指向分配块头部
       p->tag=1; // 设置分配块头部
       p->size=n;
     }
     return p; // 返回分配块首地址
   }
 }

 void Reclaim(Space &pav,Space &p)
 { // 边界标识法的回收算法，将p所指的释放块回收到可利用空间表pav中
   Space s,t=p+p->size; // t指向释放块右邻块的首地址
   int l=(p-1)->tag,r=(p+p->size)->tag; // l、r分别指示释放块的左、右邻块是否空闲
   if(!pav) // 可利用空间表空
   { // 将释放块加入到可利用空间表pav中
     pav=p->llink=p->rlink=p; // 头部域的两个指针及pav均指向释放块
     p->tag=0; // 修改头部域块标志为空闲
     (FootLoc(p))->uplink=p; // 修改底部域指针，使其指向释放块的头部域
     (FootLoc(p))->tag=0; // 修改底部域块标志为空闲
   }
   else // 可利用空间表不空
     if(l==1&&r==1) // 左右邻区均为占用块
     { // 将释放块插入到可利用空间表pav中
       p->tag=0; // 修改释放块头部域块标志为空闲
       (FootLoc(p))->uplink=p; // 修改底部域指针，使其指向释放块的头部域
       (FootLoc(p))->tag=0; // 修改底部域块标志为空闲
       pav->llink->rlink=p; // 将p所指结点(刚释放的结点)插在pav所指结点之前
       p->llink=pav->llink;
       p->rlink=pav;
       pav->llink=p;
       pav=p; // 修改pav，令刚释放的结点为下次分配时的最先查询的结点
     }
     else if(l==0&&r==1) // 左邻区为空闲块，右邻区为占用块
     { // 合并左邻块和释放块(将释放块“粘到”左邻块的下边，不改变可利用空间表pav)
       s=(p-1)->uplink; // s为左邻空闲块的头部域地址
       s->size+=p->size; // 设置合并的空闲块大小
       t=FootLoc(p); // t指向合并的空闲块底部域(释放块的底部域)
       t->uplink=s; // 设置合并的空闲块底部域指针，使其指向合并的空闲块的头部域
       t->tag=0; // 设置合并的空闲块底部域块标志为空闲
     }
     else if(l==1&&r==0) // 右邻区为空闲块，左邻区为占用块
     { // 合并右邻块和释放块，t为右邻空闲块的头部域地址，用合并块取代右邻空闲块在pav中的位置
       p->tag=0; // P为合并后的结点头部域地址，设置其块标志为空闲
       p->llink=t->llink; // p的前驱为原t的前驱
       p->llink->rlink=p; // p的前驱的后继指向p
       p->rlink=t->rlink; // p的后继为原t的后继
       p->rlink->llink=p; // p的后继的前驱指向p
       p->size+=t->size; // 新的合并块的大小
       (FootLoc(t))->uplink=p; // 底部域(原t的底部域)指针指向新的合并块的头部域
       if(pav==t) // 可利用空间表的头指针指向t(t已不是空闲结点首地址了)
	 pav=p; // 修改pav，令刚释放的结点为下次分配时的最先查询的结点
     }
     else // 左右邻区均为空闲块
     { // 合并左右邻块和释放块，t为右邻空闲块的头部域地址
       t->llink->rlink=t->rlink; // 在pav中删去右邻空闲块结点
       t->rlink->llink=t->llink;
       s=(p-1)->uplink; // s为左邻空闲块的头部域地址，也是新的合并块的头部域地址
       s->size+=p->size+t->size; // 设置新结点的大小(3块之和)
       (FootLoc(t))->uplink=s; // 新结点底部(原t的底部)指针指向其头部
       if(pav==t) // 可利用空间表的头指针指向t(t已不是空闲结点首地址了)
	 pav=s; // 修改pav，令刚释放的结点为下次分配时的最先查询的结点
     }
   p=NULL; // 令刚释放的结点的指针为空
 }

 void Print(Space p)
 { // 输出p所指的可利用空间表
   Space h,f;
   if(p) // 可利用空间表不空
   {
     h=p; // h指向第一个结点的头部域(首地址)
     f=FootLoc(h); // f指向第一个结点的底部域
     do
     {
       printf("块的大小=%d 块的首地址=%u ",h->size,f->uplink); // 输出结点信息
       printf("块标志=%d(0:空闲 1:占用) 邻块首地址=%u\n",h->tag,f+1);
       h=h->rlink; // 指向下一个结点的头部域(首地址)
       f=FootLoc(h); // f指向下一个结点的底部域
     }while(h!=p); // 没到循环链表的表尾
   }
 }

 void PrintUser(Space p[])
 { // 输出p数组所指的已分配空间
   for(int i=0;i<MAX/e;i++)
     if(p[i]) // 指针不为0(指向一个占用块)
     {
       printf("块%d的首地址=%u ",i,p[i]); // 输出结点信息
       printf("块的大小=%d 块头标志=%d(0:空闲 1:占用)",p[i]->size,p[i]->tag);
       printf(" 块尾标志=%d\n",(FootLoc(p[i]))->tag);
     }
 }

 void main()
 {
   Space pav,p; // 空闲块指针
   Space v[MAX/e]={NULL}; // 占用块指针数组(初始化为空)
   int n;
   printf("结构体WORD为%d个字节\n",sizeof(WORD));
   p=new WORD[MAX+2]; // 申请大小为MAX*sizeof(WORD)个字节的空间
   p->tag=1; // 设置低址边界，以防查找左邻块时出错
   pav=p+1; // 可利用空间表的表头
   pav->rlink=pav->llink=pav; // 初始化可利用空间(一个整块)
   pav->tag=0;
   pav->size=MAX;
   p=FootLoc(pav); // p指向底部域
   p->uplink=pav;
   p->tag=0;
   (p+1)->tag=1; // 设置高址边界，以防查找右邻块时出错
   printf("初始化后，可利用空间表为:\n");
   Print(pav);
   n=300;
   v[0]=AllocBoundTag(pav,n);
   printf("分配%u个存储空间后，可利用空间表为:\n",n);
   Print(pav);
   PrintUser(v);
   n=450;
   v[1]=AllocBoundTag(pav,n);
   printf("分配%u个存储空间后，pav为:\n",n);
   Print(pav);
   PrintUser(v);
   n=300; // 分配不成功
   v[2]=AllocBoundTag(pav,n);
   printf("分配%u个存储空间后(不成功)，pav为:\n",n);
   Print(pav);
   PrintUser(v);
   n=242; // 分配整个块(250)
   v[2]=AllocBoundTag(pav,n);
   printf("分配%u个存储空间后(整块分配)，pav为:\n",n);
   Print(pav);
   PrintUser(v);
   printf("回收v[0](%d)后(当pav空时回收)，pav为:\n",v[0]->size);
   Reclaim(pav,v[0]); // pav为空
   Print(pav);
   PrintUser(v);
   printf("1按回车键继续");
   getchar();
   printf("回收v[2](%d)后(左右邻区均为占用块),pav为:\n",v[2]->size);
   Reclaim(pav,v[2]); // 左右邻区均为占用块
   Print(pav);
   PrintUser(v);
   n=270; // 查找空间足够大的块
   v[0]=AllocBoundTag(pav,n);
   printf("分配%u个存储空间后(查找空间足够大的块)，pav为:\n",n);
   Print(pav);
   PrintUser(v);
   n=30; // 在当前块上分配
   v[2]=AllocBoundTag(pav,n);
   printf("分配%u个存储空间后(在当前块上分配)，pav为:\n",n);
   Print(pav);
   PrintUser(v);
   printf("回收v[1](%d)后(右邻区为空闲块,左邻区为占用块)，pav为:\n",v[1]->size);
   Reclaim(pav,v[1]); // 右邻区为空闲块，左邻区为占用块
   Print(pav);
   PrintUser(v);
   printf("2按回车键继续");
   getchar();
   printf("回收v[0](%d)后(左邻区为空闲块,右邻区为占用块)，pav为:\n",v[0]->size);
   Reclaim(pav,v[0]); // 左邻区为空闲块，右邻区为占用块
   Print(pav);
   PrintUser(v);
   printf("回收v[2](%d)后(左右邻区均为空闲块),pav为:\n",v[2]->size);
   Reclaim(pav,v[2]); // 左右邻区均为空闲块
   Print(pav);
   PrintUser(v);
 }
