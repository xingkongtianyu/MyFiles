 // bo7-3.cpp 有向图或网的十字链表存储(存储结构由c7-31.h定义)的基本函数(16个)，包括算法7.3、
 // 7.4、7.6
 #include"bo2-8.cpp" // 不带头结点的单链表基本操作
 int LocateVex(OLGraph G,VertexType u)
 { // 返回顶点u在有向图G中的位置(序号)，如不存在则返回-1
   int i;
   for(i=0;i<G.vexnum;++i) // 用循环查找该结点
     if(!strcmp(G.xlist[i].data,u))
       return i;
   return -1;
 }

 void CreateDG(OLGraph &G)
 { // 采用十字链表存储表示，构造有向图G。算法7.3
   int i,j,k;
   int IncInfo;
   ArcBox *p;
   VertexType v1,v2;
   printf("请输入有向图的顶点数,弧数,是否为带权图(是:1，否:0): ");
   scanf("%d,%d,%d",&G.vexnum,&G.arcnum,&IncInfo);
   printf("请输入%d个顶点的值(<%d个字符):\n",G.vexnum,MAX_VERTEX_NAME);
   for(i=0;i<G.vexnum;++i)
   { // 构造表头向量
     scanf("%s",&G.xlist[i].data); // 输入顶点值
     G.xlist[i].firstin=NULL; // 初始化入弧的链表头指针
     G.xlist[i].firstout=NULL; // 初始化出弧的链表头指针
   }
   printf("请输入%d条弧的弧尾和弧头(空格为间隔):\n",G.arcnum);
   for(k=0;k<G.arcnum;++k)
   { // 输入各弧并构造十字链表
     scanf("%s%s",&v1,&v2);
     i=LocateVex(G,v1); // 确定v1和v2在G中的位置
     j=LocateVex(G,v2);
     p=(ArcBox *)malloc(sizeof(ArcBox)); // 产生弧结点(假定有足够空间)
     p->data.tailvex=i; // 对弧结点赋值
     p->data.headvex=j;
     p->data.hlink=G.xlist[j].firstin; // 完成在入弧和出弧链表表头的插入
     p->tlink=G.xlist[i].firstout;
     G.xlist[j].firstin=(ArcBox1 *)p; // 强制类型转换
     G.xlist[i].firstout=p;
     if(IncInfo)
     { // 是网
       p->data.info=(InfoType *)malloc(sizeof(InfoType));
       printf("请输入该弧的权值: ");
       scanf("%d",p->data.info);
     }
     else // 弧不含有相关信息
       p->data.info=NULL;
   }
 }

 void DestroyGraph(OLGraph &G)
 { // 初始条件：有向图G存在。操作结果：销毁有向图G
   int i;
   ElemType e;
   for(i=0;i<G.vexnum;i++) // 对所有顶点
     while(G.xlist[i].firstout) // 出弧链表不空
     {
       ListDelete(G.xlist[i].firstout,1,e); // 删除其第1个结点，其值赋给e，在bo2-8.cpp中
       if(e.info) // 带权
	 free(e.info); // 释放动态生成的权值空间
     }
   G.arcnum=0;
   G.vexnum=0;
 }

 VertexType& GetVex(OLGraph G,int v)
 { // 初始条件：有向图G存在，v是G中某个顶点的序号。操作结果：返回v的值
   if(v>=G.vexnum||v<0)
     exit(ERROR);
   return G.xlist[v].data;
 }

 Status PutVex(OLGraph &G,VertexType v,VertexType value)
 { // 初始条件：有向图G存在，v是G中某个顶点。操作结果：对v赋新值value
   int i;
   i=LocateVex(G,v);
   if(i<0) // v不是G的顶点
     return ERROR;
   strcpy(G.xlist[i].data,value);
   return OK;
 }

 int FirstAdjVex(OLGraph G,VertexType v)
 { // 初始条件：有向图G存在，v是G中某个顶点
   // 操作结果：返回v的第一个邻接顶点的序号。若顶点在G中没有邻接顶点，则返回-1
   int i;
   ArcBox *p;
   i=LocateVex(G,v);
   p=G.xlist[i].firstout; // p指向顶点v的第1个出弧
   if(p)
     return p->data.headvex;
   else
     return -1;
 }

 int NextAdjVex(OLGraph G,VertexType v,VertexType w)
 { // 初始条件：有向图G存在，v是G中某个顶点，w是v的邻接顶点
   // 操作结果：返回v的(相对于w的)下一个邻接顶点的序号，若w是v的最后一个邻接顶点，则返回-1
   int i,j;
   ArcBox *p;
   i=LocateVex(G,v); // i是顶点v的序号
   j=LocateVex(G,w); // j是顶点w的序号
   p=G.xlist[i].firstout; // p指向顶点v的第1个出弧
   while(p&&p->data.headvex!=j)
     p=p->tlink;
   if(p) // w不是v的最后一个邻接顶点
     p=p->tlink; // p指向相对于w的下一个邻接顶点
   if(p) // 有下一个邻接顶点
     return p->data.headvex;
   else
     return -1;
 }

 void InsertVex(OLGraph &G,VertexType v)
 { // 初始条件：有向图G存在，v和有向图G中顶点有相同特征
   // 操作结果：在有向图G中增添新顶点v(不增添与顶点相关的弧，留待InsertArc()去做)
   strcpy(G.xlist[G.vexnum].data,v); // 拷贝顶点名称
   G.xlist[G.vexnum].firstin=NULL; // 初始化入弧链表
   G.xlist[G.vexnum].firstout=NULL; // 初始化出弧链表
   G.vexnum++; // 顶点数+1
 }

 Status equal(ElemType c1,ElemType c2)
 {
   if(c1.headvex==c2.headvex)
     return TRUE;
   else
     return FALSE;
 }

 Status DeleteVex(OLGraph &G,VertexType v)
 { // 初始条件：有向图G存在，v是G中某个顶点。操作结果：删除G中顶点v及其相关的弧
   int i,j,k;
   ElemType e1,e2;
   ArcBox *p;
   ArcBox1 *p1,*p2;
   k=LocateVex(G,v); // k是顶点v的序号
   if(k<0) // v不是图G的顶点
     return ERROR; // 以下删除顶点v的入弧
   e1.headvex=k; // e1作为LocateElem()的比较元素
   for(j=0;j<G.vexnum;j++) // 顶点v的入弧是其它顶点的出弧
   {
     i=LocateElem(G.xlist[j].firstout,e1,equal);
     if(i) // 顶点v是顶点j的出弧
     {
       ListDelete(G.xlist[j].firstout,i,e2); // 删除该弧结点，其值赋给e2
       G.arcnum--; // 弧数-1
       if(e2.info) // 带权
         free(e2.info); // 释放动态生成的权值空间
     }
   } // 以下删除顶点v的出弧
   for(j=0;j<G.vexnum;j++) // 顶点v的出弧是其它顶点的入弧
   {
     p1=G.xlist[j].firstin;
     while(p1&&p1->tailvex!=k)
     {
       p2=p1;
       p1=p1->hlink;
     }
     if(p1) // 找到顶点v的出弧
     {
       if(p1==G.xlist[j].firstin) // 是首结点
         G.xlist[j].firstin=p1->hlink; // 入弧指针指向下一个结点
       else // 不是首结点
         p2->hlink=p1->hlink; // 在链表中移去p1所指结点
       if(p1->info) // 带权
         free(p1->info); // 释放动态生成的权值空间
       free(p1); // 释放p1所指结点
       G.arcnum--; // 弧数-1
     }
   }
   for(j=k+1;j<G.vexnum;j++) // 序号>k的顶点依次向前移
     G.xlist[j-1]=G.xlist[j];
   G.vexnum--; // 顶点数减1
   for(j=0;j<G.vexnum;j++) // 结点序号>k的要减1
   {
     p=G.xlist[j].firstout; // 处理出弧
     while(p)
     {
       if(p->data.tailvex>k)
         p->data.tailvex--; // 序号-1
       if(p->data.headvex>k)
         p->data.headvex--; // 序号-1
       p=p->tlink;
     }
   }
   return OK;
 }

 Status InsertArc(OLGraph &G,VertexType v,VertexType w)
 { // 初始条件：有向图G存在，v和w是G中两个顶点。操作结果：在G中增添弧<v,w>
   int i,j;
   int IncInfo;
   ArcBox *p;
   i=LocateVex(G,v); // 弧尾的序号
   j=LocateVex(G,w); // 弧头的序号
   if(i<0||j<0)
     return ERROR;
   p=(ArcBox *)malloc(sizeof(ArcBox)); // 生成新结点
   p->data.tailvex=i; // 给新结点赋值
   p->data.headvex=j;
   p->data.hlink=G.xlist[j].firstin; // 插在入弧和出弧的链头
   p->tlink=G.xlist[i].firstout;
   G.xlist[j].firstin=(ArcBox1*)p;
   G.xlist[i].firstout=p;
   G.arcnum++; // 弧数加1
   printf("要插入的弧是否带权(是: 1,否: 0): ");
   scanf("%d",&IncInfo);
   if(IncInfo) // 带权
   {
     p->data.info=(InfoType *)malloc(sizeof(InfoType)); // 动态生成权值空间
     printf("请输入该弧的权值: ");
     scanf("%d",p->data.info);
   }
   else
     p->data.info=NULL;
   return OK;
 }

 Status DeleteArc(OLGraph &G,VertexType v,VertexType w)
 { // 初始条件：有向图G存在，v和w是G中两个顶点。操作结果：在G中删除弧<v,w>
   int i,j,k;
   ElemType e;
   ArcBox1 *p1,*p2;
   i=LocateVex(G,v); // 弧尾的序号
   j=LocateVex(G,w); // 弧头的序号
   if(i<0||j<0||i==j)
     return ERROR;
   p1=G.xlist[j].firstin; // p1指向w的入弧链表
   while(p1&&p1->tailvex!=i) // 使p1指向待删结点
   {
     p2=p1;
     p1=p1->hlink;
   }
   if(p1==G.xlist[j].firstin) // 首结点是待删结点
     G.xlist[j].firstin=p1->hlink; // 入弧指针指向下一个结点
   else // 首结点不是待删结点
     p2->hlink=p1->hlink; // 在链表中移去p1所指结点(该结点仍在出弧链表中)
   e.headvex=j; // 待删弧结点的弧头顶点序号为j，e作为LocateElem()的比较元素
   k=LocateElem(G.xlist[i].firstout,e,equal); // 在出弧链表中的位序
   ListDelete(G.xlist[i].firstout,k,e); // 在出弧链表中删除该结点，其值赋给e
   if(e.info) // 带权
    free(e.info); // 释放动态生成的权值空间
   G.arcnum--; // 弧数-1
   return OK;
 }

 Boolean visited[MAX_VERTEX_NUM]; // 访问标志数组
 void(*VisitFunc)(VertexType); // 函数变量
 void DFS(OLGraph G,int i) // DFSTraverse()调用
 {
   ArcBox *p;
   visited[i]=TRUE; // 访问标志数组置1(已被访问)
   VisitFunc(G.xlist[i].data); // 遍历第i个顶点
   p=G.xlist[i].firstout; // p指向第i个顶点的出度
   while(p&&visited[p->data.headvex]) // p没到表尾且该弧的头顶点已被访问
     p=p->tlink; // 查找下一个结点
   if(p&&!visited[p->data.headvex]) // 该弧的头顶点未被访问
     DFS(G,p->data.headvex); // 递归调用DFS()
 }

 void DFSTraverse(OLGraph G,void(*Visit)(VertexType))
 { // 初始条件：有向图G存在，v是G中某个顶点，Visit是顶点的应用函数(算法7.4)
   // 操作结果:从第1个顶点起,按深度优先递归遍历有向图G,并对每个顶点调用函数Visit一次且仅一次
   int v;
   VisitFunc=Visit;
   for(v=0;v<G.vexnum;v++)
     visited[v]=FALSE; // 访问标志数组置初值(未被访问)
   for(v=0;v<G.vexnum;v++) // 由序号0开始，继续查找未被访问过的顶点
     if(!visited[v])
       DFS(G,v);
   printf("\n");
 }

 typedef int QElemType; // 队列元素类型
 #include"c3-2.h" // 链队列的存储结构
 #include"bo3-2.cpp" // 链队列的基本操作

 void BFSTraverse(OLGraph G,void(*Visit)(VertexType))
 { // 初始条件：有向图G存在，Visit是顶点的应用函数。算法7.6
   // 操作结果：从第1个顶点起，按广度优先非递归遍历有向图G，并对每个顶点调用函数Visit
   //           一次且仅一次。使用辅助队列Q和访问标志数组visited
   int v,u,w;
   LinkQueue Q;
   for(v=0;v<G.vexnum;v++)
     visited[v]=FALSE;
   InitQueue(Q);
   for(v=0;v<G.vexnum;v++)
     if(!visited[v])
     {
       visited[v]=TRUE;
       Visit(G.xlist[v].data);
       EnQueue(Q,v);
       while(!QueueEmpty(Q))
       {
         DeQueue(Q,u);
	 for(w=FirstAdjVex(G,G.xlist[u].data);w>=0;w=NextAdjVex(G,G.xlist[u].data,G.xlist[w].data))
           if(!visited[w]) // w为u的尚未访问的邻接顶点的序号
           {
             visited[w]=TRUE;
             Visit(G.xlist[w].data);
             EnQueue(Q,w);
           }
       }
     }
   printf("\n");
 }

 void Display(OLGraph G)
 { // 输出有向图G
   int i;
   ArcBox *p;
   printf("共%d个顶点: ",G.vexnum);
   for(i=0;i<G.vexnum;i++) // 输出顶点
     printf("%s ",G.xlist[i].data);
   printf("\n%d条弧:\n",G.arcnum);
   for(i=0;i<G.vexnum;i++) // 顺出弧链表输出
   {
     p=G.xlist[i].firstout;
     while(p)
     {
       printf("%s→%s ",G.xlist[i].data,G.xlist[p->data.headvex].data);
       if(p->data.info) // 该弧有相关信息(权值)
         printf("权值: %d ",*p->data.info);
       p=p->tlink;
     }
     printf("\n");
   }
 }
