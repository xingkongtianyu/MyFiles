 // bo7-2.cpp 图的邻接表存储(存储结构由c7-21.h定义)的基本操作(15个)，包括算法7.4～7.6
 #include"bo2-8.cpp" // 不带头结点的单链表基本操作
 #include"func2-1.cpp" // 不带头结点的单链表扩展操作
 int LocateVex(ALGraph G,VertexType u)
 { // 初始条件：图G存在，u和G中顶点有相同特征
   // 操作结果：若G中存在顶点u，则返回该顶点在图中位置；否则返回-1
   int i;
   for(i=0;i<G.vexnum;++i)
     if(strcmp(u,G.vertices[i].data)==0)
       return i;
   return -1;
 }

 void CreateGraph(ALGraph &G)
 { // 采用邻接表存储结构，构造没有相关信息图或网G(用一个函数构造4种图)
   int i,j,k,w; // w是权值
   VertexType va,vb; // 连接边或弧的2顶点
   ElemType e;
   printf("请输入图的类型(有向图:0,有向网:1,无向图:2,无向网:3): ");
   scanf("%d",&G.kind);
   printf("请输入图的顶点数,边数: ");
   scanf("%d,%d",&G.vexnum,&G.arcnum);
   printf("请输入%d个顶点的值(<%d个字符):\n",G.vexnum,MAX_NAME);
   for(i=0;i<G.vexnum;++i) // 构造顶点向量
   {
     scanf("%s",G.vertices[i].data);
     G.vertices[i].firstarc=NULL; // 初始化与该顶点有关的出弧链表
   }
   if(G.kind%2) // 网
     printf("请输入每条弧(边)的权值、弧尾和弧头(以空格作为间隔):\n");
   else // 图
     printf("请输入每条弧(边)的弧尾和弧头(以空格作为间隔):\n");
   for(k=0;k<G.arcnum;++k) // 构造相关弧链表
   {
     if(G.kind%2) // 网
       scanf("%d%s%s",&w,va,vb);
     else // 图
       scanf("%s%s",va,vb);
     i=LocateVex(G,va); // 弧尾
     j=LocateVex(G,vb); // 弧头
     e.info=NULL; // 给待插表结点e赋值，图无权
     e.adjvex=j; // 弧头
     if(G.kind%2) // 网
     {
       e.info=(int *)malloc(sizeof(int)); // 动态生成存放权值的空间
       *(e.info)=w;
     }
     ListInsert(G.vertices[i].firstarc,1,e); // 插在第i个元素(出弧)的表头，在bo2-8.cpp中
     if(G.kind>=2) // 无向图或网，产生第2个表结点，并插在第j个元素(入弧)的表头
     {
       e.adjvex=i; // e.info不变，不必再赋值
       ListInsert(G.vertices[j].firstarc,1,e); // 插在第j个元素的表头，在bo2-8.cpp中
     }
   }
 }

 void CreateGraphF(ALGraph &G)
 { // 采用邻接表存储结构，由文件构造没有相关信息图或网G(用一个函数构造4种图)
   int i,j,k,w; // w是权值
   VertexType va,vb; // 连接边或弧的2顶点
   ElemType e;
   char filename[13];
   FILE *graphlist;
   printf("请输入数据文件名(f7-1.txt或f7-2.txt)：");
   scanf("%s",filename);
   printf("请输入图的类型(有向图:0,有向网:1,无向图:2,无向网:3): ");
   scanf("%d",&G.kind);
   graphlist=fopen(filename,"r"); // 以读的方式打开数据文件，并以graphlist表示
   fscanf(graphlist,"%d",&G.vexnum);
   fscanf(graphlist,"%d",&G.arcnum);
   for(i=0;i<G.vexnum;++i) // 构造顶点向量
   {
     fscanf(graphlist,"%s",G.vertices[i].data);
     G.vertices[i].firstarc=NULL; // 初始化与该顶点有关的出弧链表
   }
   for(k=0;k<G.arcnum;++k) // 构造相关弧链表
   {
     if(G.kind%2) // 网
       fscanf(graphlist,"%d%s%s",&w,va,vb);
     else // 图
       fscanf(graphlist,"%s%s",va,vb);
     i=LocateVex(G,va); // 弧尾
     j=LocateVex(G,vb); // 弧头
     e.info=NULL; // 给待插表结点e赋值，图无权
     e.adjvex=j; // 弧头
     if(G.kind%2) // 网
     {
       e.info=(int *)malloc(sizeof(int)); // 动态生成存放权值的空间
       *(e.info)=w;
     }
     ListInsert(G.vertices[i].firstarc,1,e); // 插在第i个元素(出弧)的表头，在bo2-8.cpp中
     if(G.kind>=2) // 无向图或网，产生第2个表结点，并插在第j个元素(入弧)的表头
     {
       e.adjvex=i; // e.info不变，不必再赋值
       ListInsert(G.vertices[j].firstarc,1,e); // 插在第j个元素的表头，在bo2-8.cpp中
     }
   }
   fclose(graphlist); // 关闭数据文件
 }

 void DestroyGraph(ALGraph &G)
 { // 初始条件：图G存在。操作结果：销毁图G
   int i;
   ElemType e;
   for(i=0;i<G.vexnum;++i) // 对于所有顶点
     if(G.kind%2) // 网
       while(G.vertices[i].firstarc) // 对应的弧或边链表不空
       {
	 ListDelete(G.vertices[i].firstarc,1,e); // 删除链表的第1个结点，并将值赋给e
	 if(e.adjvex>i) // 顶点序号>i(保证动态生成的权值空间只释放1次)
	   free(e.info);
       }
     else // 图
       DestroyList(G.vertices[i].firstarc); // 销毁弧或边链表，在bo2-8.cpp中
   G.vexnum=0; // 顶点数为0
   G.arcnum=0; // 边或弧数为0
 }

 VertexType& GetVex(ALGraph G,int v)
 { // 初始条件：图G存在，v是G中某个顶点的序号。操作结果：返回v的值
   if(v>=G.vexnum||v<0)
     exit(ERROR);
   return G.vertices[v].data;
 }

 Status PutVex(ALGraph &G,VertexType v,VertexType value)
 { // 初始条件：图G存在，v是G中某个顶点。操作结果：对v赋新值value
   int i;
   i=LocateVex(G,v);
   if(i>-1) // v是G的顶点
   {
     strcpy(G.vertices[i].data,value);
     return OK;
   }
   return ERROR;
 }

 int FirstAdjVex(ALGraph G,VertexType v)
 { // 初始条件：图G存在，v是G中某个顶点
   // 操作结果：返回v的第一个邻接顶点的序号。若顶点在G中没有邻接顶点，则返回-1
   ArcNode *p;
   int v1;
   v1=LocateVex(G,v); // v1为顶点v在图G中的序号
   p=G.vertices[v1].firstarc;
   if(p)
     return p->data.adjvex;
   else
     return -1;
 }

 Status equalvex(ElemType a,ElemType b)
 { // DeleteArc()、DeleteVex()和NextAdjVex()要调用的函数
   if(a.adjvex==b.adjvex)
     return OK;
   else
     return ERROR;
 }

 int NextAdjVex(ALGraph G,VertexType v,VertexType w)
 { // 初始条件：图G存在，v是G中某个顶点，w是v的邻接顶点
   // 操作结果：返回v的(相对于w的)下一个邻接顶点的序号。若w是v的最后一个邻接点，则返回-1
   LinkList p,p1; // p1在Point()中用作辅助指针，Point()在func2-1.cpp中
   ElemType e;
   int v1;
   v1=LocateVex(G,v); // v1为顶点v在图G中的序号
   e.adjvex=LocateVex(G,w); // e.adjvex为顶点w在图G中的序号
   p=Point(G.vertices[v1].firstarc,e,equalvex,p1); // p指向顶点v的链表中邻接顶点为w的结点
   if(!p||!p->next) // 没找到w或w是最后一个邻接点
     return -1;
   else // p->data.adjvex==w
     return p->next->data.adjvex; // 返回v的(相对于w的)下一个邻接顶点的序号
 }

 void InsertVex(ALGraph &G,VertexType v)
 { // 初始条件：图G存在，v和图中顶点有相同特征
   // 操作结果：在图G中增添新顶点v(不增添与顶点相关的弧，留待InsertArc()去做)
   strcpy(G.vertices[G.vexnum].data,v); // 构造新顶点向量
   G.vertices[G.vexnum].firstarc=NULL;
   G.vexnum++; // 图G的顶点数加1
 }

 Status DeleteVex(ALGraph &G,VertexType v)
 { // 初始条件：图G存在，v是G中某个顶点。操作结果：删除G中顶点v及其相关的弧
   int i,j,k;
   ElemType e;
   LinkList p,p1;
   j=LocateVex(G,v); // j是顶点v的序号
   if(j<0) // v不是图G的顶点
     return ERROR;
   i=ListLength(G.vertices[j].firstarc); // 以v为出度的弧或边数，在bo2-8.cpp中
   G.arcnum-=i; // 边或弧数-i
   if(G.kind%2) // 网
     while(G.vertices[j].firstarc) // 对应的弧或边链表不空
     {
       ListDelete(G.vertices[j].firstarc,1,e); // 删除链表的第1个结点，并将值赋给e
       free(e.info); // 释放动态生成的权值空间
     }
   else // 图
     DestroyList(G.vertices[j].firstarc); // 销毁弧或边链表，在bo2-8.cpp中
   G.vexnum--; // 顶点数减1
   for(i=j;i<G.vexnum;i++) // 顶点v后面的顶点前移
     G.vertices[i]=G.vertices[i+1];
   for(i=0;i<G.vexnum;i++) // 删除以v为入度的弧或边且必要时修改表结点的顶点位置值
   {
     e.adjvex=j;
     p=Point(G.vertices[i].firstarc,e,equalvex,p1); // Point()在func2-1.cpp中
     if(p) // 顶点i的邻接表上有v为入度的结点
     {
       if(p1) // p1指向p所指结点的前驱
         p1->next=p->next; // 从链表中删除p所指结点
       else // p指向首元结点
         G.vertices[i].firstarc=p->next; // 头指针指向下一结点
       if(G.kind<2) // 有向
       {
         G.arcnum--; // 边或弧数-1
         if(G.kind==1) // 有向网
           free(p->data.info); // 释放动态生成的权值空间
       }
       free(p); // 释放v为入度的结点
     }
     for(k=j+1;k<=G.vexnum;k++) // 对于adjvex域>j的结点，其序号-1
     {
       e.adjvex=k;
       p=Point(G.vertices[i].firstarc,e,equalvex,p1); // Point()在func2-1.cpp中
       if(p)
         p->data.adjvex--; // 序号-1(因为前移)
     }
   }
   return OK;
 }

 Status InsertArc(ALGraph &G,VertexType v,VertexType w)
 { // 初始条件：图G存在，v和w是G中两个顶点
   // 操作结果：在G中增添弧<v,w>，若G是无向的，则还增添对称弧<w,v>
   ElemType e;
   int i,j;
   i=LocateVex(G,v); // 弧尾或边的序号
   j=LocateVex(G,w); // 弧头或边的序号
   if(i<0||j<0)
     return ERROR;
   G.arcnum++; // 图G的弧或边的数目加1
   e.adjvex=j;
   e.info=NULL; // 初值
   if(G.kind%2) // 网
   {
     e.info=(int *)malloc(sizeof(int)); // 动态生成存放权值的空间
     printf("请输入弧(边)%s→%s的权值: ",v,w);
     scanf("%d",e.info);
   }
   ListInsert(G.vertices[i].firstarc,1,e); // 将e插在弧尾的表头，在bo2-8.cpp中
   if(G.kind>=2) // 无向，生成另一个表结点
   {
     e.adjvex=i; // e.info不变
     ListInsert(G.vertices[j].firstarc,1,e); // 将e插在弧头的表头
   }
   return OK;
 }

 Status DeleteArc(ALGraph &G,VertexType v,VertexType w)
 { // 初始条件：图G存在，v和w是G中两个顶点
   // 操作结果：在G中删除弧<v,w>，若G是无向的，则还删除对称弧<w,v>
   int i,j;
   Status k;
   ElemType e;
   i=LocateVex(G,v); // i是顶点v(弧尾)的序号
   j=LocateVex(G,w); // j是顶点w(弧头)的序号
   if(i<0||j<0||i==j)
     return ERROR;
   e.adjvex=j;
   k=DeleteElem(G.vertices[i].firstarc,e,equalvex); // 在func2-1.cpp中
   if(k) // 删除成功
   {
     G.arcnum--; // 弧或边数减1
     if(G.kind%2) // 网
       free(e.info);
     if(G.kind>=2) // 无向，删除对称弧<w,v>
     {
       e.adjvex=i;
       DeleteElem(G.vertices[j].firstarc,e,equalvex);
     }
     return OK;
   }
   else // 没找到待删除的弧
     return ERROR;
 }

 Boolean visited[MAX_VERTEX_NUM]; // 访问标志数组(全局量)
 void(*VisitFunc)(char* v); // 函数变量(全局量)
 void DFS(ALGraph G,int v)
 { // 从第v个顶点出发递归地深度优先遍历图G。算法7.5
   int w;
   visited[v]=TRUE; // 设置访问标志为TRUE(已访问)
   VisitFunc(G.vertices[v].data); // 访问第v个顶点
   for(w=FirstAdjVex(G,G.vertices[v].data);w>=0;w=NextAdjVex(G,G.vertices[v].data,G.vertices[w].data))
     if(!visited[w])
       DFS(G,w); // 对v的尚未访问的邻接点w递归调用DFS
 }

 void DFSTraverse(ALGraph G,void(*Visit)(char*))
 { // 对图G作深度优先遍历。算法7.4
   int v;
   VisitFunc=Visit; // 使用全局变量VisitFunc，使DFS不必设函数指针参数
   for(v=0;v<G.vexnum;v++)
     visited[v]=FALSE; // 访问标志数组初始化
   for(v=0;v<G.vexnum;v++)
     if(!visited[v])
       DFS(G,v); // 对尚未访问的顶点调用DFS
   printf("\n");
 }

 typedef int QElemType; // 队列元素类型
 #include"c3-2.h" // 链队列的存储结构
 #include"bo3-2.cpp" // 链队列的基本操作
 void BFSTraverse(ALGraph G,void(*Visit)(char*))
 {//按广度优先非递归遍历图G。使用辅助队列Q和访问标志数组visited。算法7.6
   int v,u,w;
   LinkQueue Q;
   for(v=0;v<G.vexnum;++v)
     visited[v]=FALSE; // 置初值
   InitQueue(Q); // 置空的辅助队列Q
   for(v=0;v<G.vexnum;v++) // 如果是连通图，只v=0就遍历全图
     if(!visited[v]) // v尚未访问
     {
       visited[v]=TRUE;
       Visit(G.vertices[v].data);
       EnQueue(Q,v); // v入队列
       while(!QueueEmpty(Q)) // 队列不空
       {
         DeQueue(Q,u); // 队头元素出队并置为u
         for(w=FirstAdjVex(G,G.vertices[u].data);w>=0;w=NextAdjVex(G,G.vertices[u].data,G.vertices[w].data))
           if(!visited[w]) // w为u的尚未访问的邻接顶点
           {
             visited[w]=TRUE;
             Visit(G.vertices[w].data);
             EnQueue(Q,w); // w入队
	   }
       }
     }
   printf("\n");
 }

 void DFS1(ALGraph G,int v,void(*Visit)(char*))
 { // 从第v个顶点出发递归地深度优先遍历图G。仅适用于邻接表存储结构
   ArcNode *p; // p指向表结点
   visited[v]=TRUE; // 设置访问标志为TRUE(已访问)
   Visit(G.vertices[v].data); // 访问该顶点
   for(p=G.vertices[v].firstarc;p;p=p->next) // p依次指向v的邻接顶点
     if(!visited[p->data.adjvex])
       DFS1(G,p->data.adjvex,Visit); // 对v的尚未访问的邻接点递归调用DFS1
 }

 void DFSTraverse1(ALGraph G,void(*Visit)(char*))
 { // 对图G作深度优先遍历。DFS1设函数指针参数
   int v;
   for(v=0;v<G.vexnum;v++)
     visited[v]=FALSE; // 访问标志数组初始化，置初值为未被访问
   for(v=0;v<G.vexnum;v++) // 如果是连通图，只v=0就遍历全图
     if(!visited[v]) // v尚未被访问
       DFS1(G,v,Visit); // 对v调用DFS1
   printf("\n");
 }

 void BFSTraverse1(ALGraph G,void(*Visit)(char*))
 { // 按广度优先非递归遍历图G。使用辅助队列Q和访问标志数组visited。仅适用于邻接表结构
   int v,u;
   ArcNode *p; // p指向表结点
   LinkQueue Q; // 链队列类型
   for(v=0;v<G.vexnum;++v)
     visited[v]=FALSE; // 置初值为未被访问
   InitQueue(Q); // 初始化辅助队列Q
   for(v=0;v<G.vexnum;v++) // 如果是连通图，只v=0就遍历全图
     if(!visited[v]) // v尚未被访问
     {
       visited[v]=TRUE; // 设v为已被访问
       Visit(G.vertices[v].data); // 访问v
       EnQueue(Q,v); // v入队列
       while(!QueueEmpty(Q)) // 队列不空
       {
         DeQueue(Q,u); // 队头元素出队并置为u
         for(p=G.vertices[u].firstarc;p;p=p->next) // p依次指向u的邻接顶点
           if(!visited[p->data.adjvex]) // u的邻接顶点尚未被访问
           {
             visited[p->data.adjvex]=TRUE; // 该邻接顶点设为已被访问
             Visit(G.vertices[p->data.adjvex].data); // 访问该邻接顶点
             EnQueue(Q,p->data.adjvex); // 入队该邻接顶点序号
           }
       }
     }
   printf("\n");
 }

 void Display(ALGraph G)
 { // 输出图的邻接矩阵G
   int i;
   ArcNode *p;
   switch(G.kind)
   {
     case DG: printf("有向图\n");
	      break;
     case DN: printf("有向网\n");
	      break;
     case UDG:printf("无向图\n");
	      break;
     case UDN:printf("无向网\n");
   }
   printf("%d个顶点：\n",G.vexnum);
   for(i=0;i<G.vexnum;++i)
     printf("%s ",G.vertices[i].data);
   printf("\n%d条弧(边):\n",G.arcnum);
   for(i=0;i<G.vexnum;i++)
   {
     p=G.vertices[i].firstarc;
     while(p)
     {
       if(G.kind<=1||i<p->data.adjvex) // 有向或无向两次中的一次
       {
         printf("%s→%s ",G.vertices[i].data,G.vertices[p->data.adjvex].data);
         if(G.kind%2) // 网
           printf(":%d ",*(p->data.info));
       }
       p=p->nextarc;
     }
     printf("\n");
   }
 }
