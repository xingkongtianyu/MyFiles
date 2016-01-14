 // bo7-1.cpp 图的数组(邻接矩阵)存储(存储结构由c7-1.h定义)的基本操作(21个)，包括算法7.1、
 // 7.2、算法7.4～7.6
 int LocateVex(MGraph G,VertexType u)
 { // 初始条件：图G存在，u和G中顶点有相同特征
   // 操作结果：若G中存在顶点u，则返回该顶点在图中位置；否则返回-1
   int i;
   for(i=0;i<G.vexnum;++i)
     if(strcmp(u,G.vexs[i])==0)
       return i;
   return -1;
 }

 void CreateFUDG(MGraph &G)
 { // 采用数组(邻接矩阵)表示法，由文件构造没有相关信息的无向图G
   int i,j,k;
   char filename[13];
   VertexType va,vb;
   FILE *graphlist;
   printf("请输入数据文件名(f7-1.txt或f7-2.txt)：");
   scanf("%s",filename);
   graphlist=fopen(filename,"r"); // 打开数据文件，并以graphlist表示
   fscanf(graphlist,"%d",&G.vexnum);
   fscanf(graphlist,"%d",&G.arcnum);
   for(i=0;i<G.vexnum;++i) // 构造顶点向量
     fscanf(graphlist,"%s",G.vexs[i]);
   for(i=0;i<G.vexnum;++i) // 初始化邻接矩阵
     for(j=0;j<G.vexnum;++j)
     {
       G.arcs[i][j].adj=0; // 图
       G.arcs[i][j].info=NULL; // 没有相关信息
     }
   for(k=0;k<G.arcnum;++k)
   {
     fscanf(graphlist,"%s%s",va,vb);
     i=LocateVex(G,va);
     j=LocateVex(G,vb);
     G.arcs[i][j].adj=G.arcs[j][i].adj=1; // 无向图
   }
   fclose(graphlist); // 关闭数据文件
   G.kind=UDG;
 }

 void CreateFUDN(MGraph &G)
 { // 采用数组(邻接矩阵)表示法，由文件构造没有相关信息的无向网G
   int i,j,k,w;
   char filename[13];
   VertexType va,vb;
   FILE *graphlist;
   printf("请输入数据文件名：");
   scanf("%s",filename);
   graphlist=fopen(filename,"r"); // 打开数据文件，并以graphlist表示
   fscanf(graphlist,"%d",&G.vexnum);
   fscanf(graphlist,"%d",&G.arcnum);
   for(i=0;i<G.vexnum;++i) // 构造顶点向量
     fscanf(graphlist,"%s",G.vexs[i]);
   for(i=0;i<G.vexnum;++i) // 初始化邻接矩阵
     for(j=0;j<G.vexnum;++j)
     {
       G.arcs[i][j].adj=INFINITY; // 网
       G.arcs[i][j].info=NULL; // 没有相关信息
     }
   for(k=0;k<G.arcnum;++k)
   {
     fscanf(graphlist,"%s%s%d",va,vb,&w);
     i=LocateVex(G,va);
     j=LocateVex(G,vb);
     G.arcs[i][j].adj=G.arcs[j][i].adj=w; // 无向网
   }
   fclose(graphlist); // 关闭数据文件
   G.kind=UDN;
 }

 void CreateDG(MGraph &G)
 { // 采用数组(邻接矩阵)表示法，构造有向图G
   int i,j,k,l,IncInfo;
   char s[MAX_INFO];
   VertexType va,vb;
   printf("请输入有向图G的顶点数,弧数,弧是否含其它信息(是:1,否:0): ");
   scanf("%d,%d,%d",&G.vexnum,&G.arcnum,&IncInfo);
   printf("请输入%d个顶点的值(<%d个字符):\n",G.vexnum,MAX_NAME);
   for(i=0;i<G.vexnum;++i) // 构造顶点向量
     scanf("%s",G.vexs[i]);
   for(i=0;i<G.vexnum;++i) // 初始化邻接矩阵
     for(j=0;j<G.vexnum;++j)
     {
       G.arcs[i][j].adj=0; // 图
       G.arcs[i][j].info=NULL;
     }
   printf("请输入%d条弧的弧尾 弧头(以空格作为间隔): \n",G.arcnum);
   for(k=0;k<G.arcnum;++k)
   {
     scanf("%s%s%*c",va,vb);  // %*c吃掉回车符
     i=LocateVex(G,va);
     j=LocateVex(G,vb);
     G.arcs[i][j].adj=1; // 有向图
     if(IncInfo)
     {
       printf("请输入该弧的相关信息(<%d个字符): ",MAX_INFO);
       gets(s);
       l=strlen(s);
       if(l)
       {
         G.arcs[i][j].info=(char*)malloc((l+1)*sizeof(char)); // 有向
         strcpy(G.arcs[i][j].info,s);
       }
     }
   }
   G.kind=DG;
 }

 void CreateDN(MGraph &G)
 { // 采用数组(邻接矩阵)表示法，构造有向网G
   int i,j,k,w,IncInfo;
   char s[MAX_INFO];
   VertexType va,vb;
   printf("请输入有向网G的顶点数,弧数,弧是否含其它信息(是:1,否:0): ");
   scanf("%d,%d,%d",&G.vexnum,&G.arcnum,&IncInfo);
   printf("请输入%d个顶点的值(<%d个字符):\n",G.vexnum,MAX_NAME);
   for(i=0;i<G.vexnum;++i) // 构造顶点向量
     scanf("%s",G.vexs[i]);
   for(i=0;i<G.vexnum;++i) // 初始化邻接矩阵
     for(j=0;j<G.vexnum;++j)
     {
       G.arcs[i][j].adj=INFINITY; // 网
       G.arcs[i][j].info=NULL;
     }
   printf("请输入%d条弧的弧尾 弧头 权值(以空格作为间隔): \n",G.arcnum);
   for(k=0;k<G.arcnum;++k)
   {
     scanf("%s%s%d%*c",va,vb,&w);  // %*c吃掉回车符
     i=LocateVex(G,va);
     j=LocateVex(G,vb);
     G.arcs[i][j].adj=w; // 有向网
     if(IncInfo)
     {
       printf("请输入该弧的相关信息(<%d个字符): ",MAX_INFO);
       gets(s);
       w=strlen(s);
       if(w)
       {
         G.arcs[i][j].info=(char*)malloc((w+1)*sizeof(char)); // 有向
         strcpy(G.arcs[i][j].info,s);
       }
     }
   }
   G.kind=DN;
 }

 void CreateUDG(MGraph &G)
 { // 采用数组(邻接矩阵)表示法，构造无向图G
   int i,j,k,l,IncInfo;
   char s[MAX_INFO];
   VertexType va,vb;
   printf("请输入无向图G的顶点数,边数,边是否含其它信息(是:1,否:0): ");
   scanf("%d,%d,%d",&G.vexnum,&G.arcnum,&IncInfo);
   printf("请输入%d个顶点的值(<%d个字符):\n",G.vexnum,MAX_NAME);
   for(i=0;i<G.vexnum;++i) // 构造顶点向量
     scanf("%s",G.vexs[i]);
   for(i=0;i<G.vexnum;++i) // 初始化邻接矩阵
     for(j=0;j<G.vexnum;++j)
     {
       G.arcs[i][j].adj=0; // 图
       G.arcs[i][j].info=NULL;
     }
   printf("请输入%d条边的顶点1 顶点2(以空格作为间隔): \n",G.arcnum);
   for(k=0;k<G.arcnum;++k)
   {
     scanf("%s%s%*c",va,vb); // %*c吃掉回车符
     i=LocateVex(G,va);
     j=LocateVex(G,vb);
     G.arcs[i][j].adj=G.arcs[j][i].adj=1; // 无向图
     if(IncInfo)
     {
       printf("请输入该边的相关信息(<%d个字符): ",MAX_INFO);
       gets(s);
       l=strlen(s);
       if(l)
       {
         G.arcs[i][j].info=G.arcs[j][i].info=(char*)malloc((l+1)*sizeof(char));
	 // 无向，两个指针指向同一个信息
	 strcpy(G.arcs[i][j].info,s);
       }
     }
   }
   G.kind=UDG;
 }

 void CreateUDN(MGraph &G)
 { // 采用数组(邻接矩阵)表示法，构造无向网G。算法7.2
   int i,j,k,w,IncInfo;
   char s[MAX_INFO];
   VertexType va,vb;
   printf("请输入无向网G的顶点数,边数,边是否含其它信息(是:1,否:0): ");
   scanf("%d,%d,%d",&G.vexnum,&G.arcnum,&IncInfo);
   printf("请输入%d个顶点的值(<%d个字符):\n",G.vexnum,MAX_NAME);
   for(i=0;i<G.vexnum;++i) // 构造顶点向量
     scanf("%s",G.vexs[i]);
   for(i=0;i<G.vexnum;++i) // 初始化邻接矩阵
     for(j=0;j<G.vexnum;++j)
     {
       G.arcs[i][j].adj=INFINITY; // 网
       G.arcs[i][j].info=NULL;
     }
   printf("请输入%d条边的顶点1 顶点2 权值(以空格作为间隔): \n",G.arcnum);
   for(k=0;k<G.arcnum;++k)
   {
     scanf("%s%s%d%*c",va,vb,&w); // %*c吃掉回车符
     i=LocateVex(G,va);
     j=LocateVex(G,vb);
     G.arcs[i][j].adj=G.arcs[j][i].adj=w; // 无向
     if(IncInfo)
     {
       printf("请输入该边的相关信息(<%d个字符): ",MAX_INFO);
       gets(s);
       w=strlen(s);
       if(w)
       {
         G.arcs[i][j].info=G.arcs[j][i].info=(char*)malloc((w+1)*sizeof(char));
         // 无向，两个指针指向同一个信息
         strcpy(G.arcs[i][j].info,s);
       }
     }
   }
   G.kind=UDN;
 }

 void CreateGraph(MGraph &G)
 { // 采用数组(邻接矩阵)表示法，构造图G。算法7.1改
   printf("请输入图G的类型(有向图:0,有向网:1,无向图:2,无向网:3): ");
   scanf("%d",&G.kind);
   switch(G.kind)
   {
     case DG: CreateDG(G); // 构造有向图
              break;
     case DN: CreateDN(G); // 构造有向网
              break;
     case UDG:CreateUDG(G); // 构造无向图
              break;
     case UDN:CreateUDN(G); // 构造无向网
   }
 }

 void DestroyGraph(MGraph &G)
 { // 初始条件：图G存在。操作结果：销毁图G
   int i,j,k=0;
   if(G.kind%2) // 网
     k=INFINITY; // k为两顶点之间无边或弧时邻接矩阵元素的值
   for(i=0;i<G.vexnum;i++) // 释放弧或边的相关信息(如果有的话)
     if(G.kind<2) // 有向
     {
       for(j=0;j<G.vexnum;j++)
         if(G.arcs[i][j].adj!=k) // 有弧
           if(G.arcs[i][j].info) // 有相关信息
           {
             free(G.arcs[i][j].info);
             G.arcs[i][j].info=NULL;
           }
     } // 加括号为避免if-else对配错
     else // 无向
       for(j=i+1;j<G.vexnum;j++) // 只查上三角
         if(G.arcs[i][j].adj!=k) // 有边
           if(G.arcs[i][j].info) // 有相关信息
	   {
             free(G.arcs[i][j].info);
             G.arcs[i][j].info=G.arcs[j][i].info=NULL;
           }
   G.vexnum=0; // 顶点数为0
   G.arcnum=0; // 边数为0
 }

 VertexType& GetVex(MGraph G,int v)
 { // 初始条件：图G存在，v是G中某个顶点的序号。操作结果：返回v的值
   if(v>=G.vexnum||v<0)
     exit(ERROR);
   return G.vexs[v];
 }

 Status PutVex(MGraph &G,VertexType v,VertexType value)
 { // 初始条件：图G存在，v是G中某个顶点。操作结果：对v赋新值value
   int k;
   k=LocateVex(G,v); // k为顶点v在图G中的序号
   if(k<0)
     return ERROR;
   strcpy(G.vexs[k],value);
   return OK;
 }

 int FirstAdjVex(MGraph G,VertexType v)
 { // 初始条件：图G存在，v是G中某个顶点
   // 操作结果：返回v的第一个邻接顶点的序号。若顶点在G中没有邻接顶点，则返回-1
   int i,j=0,k;
   k=LocateVex(G,v); // k为顶点v在图G中的序号
   if(G.kind%2) // 网
     j=INFINITY;
   for(i=0;i<G.vexnum;i++)
     if(G.arcs[k][i].adj!=j)
       return i;
   return -1;
 }

 int NextAdjVex(MGraph G,VertexType v,VertexType w)
 { // 初始条件：图G存在，v是G中某个顶点，w是v的邻接顶点
   // 操作结果：返回v的(相对于w的)下一个邻接顶点的序号，若w是v的最后一个邻接顶点，则返回-1
   int i,j=0,k1,k2;
   k1=LocateVex(G,v); // k1为顶点v在图G中的序号
   k2=LocateVex(G,w); // k2为顶点w在图G中的序号
   if(G.kind%2) // 网
     j=INFINITY;
   for(i=k2+1;i<G.vexnum;i++)
     if(G.arcs[k1][i].adj!=j)
       return i;
   return -1;
 }

 void InsertVex(MGraph &G,VertexType v)
 { // 初始条件：图G存在，v和图G中顶点有相同特征
   // 操作结果：在图G中增添新顶点v(不增添与顶点相关的弧，留待InsertArc()去做)
   int i,j=0;
   if(G.kind%2) // 网
     j=INFINITY;
   strcpy(G.vexs[G.vexnum],v); // 构造新顶点向量
   for(i=0;i<=G.vexnum;i++)
   {
     G.arcs[G.vexnum][i].adj=G.arcs[i][G.vexnum].adj=j;
     // 初始化新增行、新增列邻接矩阵的值(无边或弧)
     G.arcs[G.vexnum][i].info=G.arcs[i][G.vexnum].info=NULL; // 初始化相关信息指针
   }
   G.vexnum++; // 图G的顶点数加1
 }

 Status DeleteVex(MGraph &G,VertexType v)
 { // 初始条件：图G存在，v是G中某个顶点。操作结果：删除G中顶点v及其相关的弧
   int i,j,k;
   VRType m=0;
   if(G.kind%2) // 网
     m=INFINITY;
   k=LocateVex(G,v); // k为待删除顶点v的序号
   if(k<0) // v不是图G的顶点
     return ERROR;
   for(j=0;j<G.vexnum;j++)
     if(G.arcs[j][k].adj!=m) // 有入弧或边
     {
       if(G.arcs[j][k].info) // 有相关信息
         free(G.arcs[j][k].info); // 释放相关信息
       G.arcnum--; // 修改弧数
     }
   if(G.kind<2) // 有向
     for(j=0;j<G.vexnum;j++)
       if(G.arcs[k][j].adj!=m) // 有出弧
       {
	 if(G.arcs[k][j].info) // 有相关信息
           free(G.arcs[k][j].info); // 释放相关信息
         G.arcnum--; // 修改弧数
       }
   for(j=k+1;j<G.vexnum;j++) // 序号k后面的顶点向量依次前移
     strcpy(G.vexs[j-1],G.vexs[j]);
   for(i=0;i<G.vexnum;i++)
     for(j=k+1;j<G.vexnum;j++)
       G.arcs[i][j-1]=G.arcs[i][j]; // 移动待删除顶点之右的矩阵元素
   for(i=0;i<G.vexnum;i++)
     for(j=k+1;j<G.vexnum;j++)
       G.arcs[j-1][i]=G.arcs[j][i]; // 移动待删除顶点之下的矩阵元素
   G.vexnum--; // 更新图的顶点数
   return OK;
 }

 Status InsertArc(MGraph &G,VertexType v,VertexType w)
 { // 初始条件：图G存在，v和w是G中两个顶点
   // 操作结果：在G中增添弧<v,w>，若G是无向的，则还增添对称弧<w,v>
   int i,l,v1,w1;
   char s[MAX_INFO];
   v1=LocateVex(G,v); // 尾
   w1=LocateVex(G,w); // 头
   if(v1<0||w1<0)
     return ERROR;
   G.arcnum++; // 弧或边数加1
   if(G.kind%2) // 网
   {
     printf("请输入此弧或边的权值: ");
     scanf("%d",&G.arcs[v1][w1].adj);
   }
   else // 图
     G.arcs[v1][w1].adj=1;
   printf("是否有该弧或边的相关信息(0:无 1:有): ");
   scanf("%d%*c",&i);
   if(i)
   {
     printf("请输入该弧或边的相关信息(<%d个字符)：",MAX_INFO);
     gets(s);
     l=strlen(s);
     if(l)
     {
       G.arcs[v1][w1].info=(char*)malloc((l+1)*sizeof(char));
       strcpy(G.arcs[v1][w1].info,s);
     }
   }
   if(G.kind>1) // 无向
   {
     G.arcs[w1][v1].adj=G.arcs[v1][w1].adj;
     G.arcs[w1][v1].info=G.arcs[v1][w1].info; // 指向同一个相关信息
   }
   return OK;
 }

 Status DeleteArc(MGraph &G,VertexType v,VertexType w)
 { // 初始条件：图G存在，v和w是G中两个顶点
   // 操作结果：在G中删除弧<v,w>，若G是无向的，则还删除对称弧<w,v>
   int v1,w1,j=0;
   if(G.kind%2) // 网
     j=INFINITY;
   v1=LocateVex(G,v); // 尾
   w1=LocateVex(G,w); // 头
   if(v1<0||w1<0) // v1、w1的值不合法
     return ERROR;
   G.arcs[v1][w1].adj=j;
   if(G.arcs[v1][w1].info) // 有其它信息
   {
     free(G.arcs[v1][w1].info);
     G.arcs[v1][w1].info=NULL;
   }
   if(G.kind>=2) // 无向，删除对称弧<w,v>
   {
     G.arcs[w1][v1].adj=j;
     G.arcs[w1][v1].info=NULL;
   }
   G.arcnum--; // 弧数-1
   return OK;
 }

 Boolean visited[MAX_VERTEX_NUM]; // 访问标志数组(全局量)
 void(*VisitFunc)(VertexType); // 函数变量
 void DFS(MGraph G,int v)
 { // 从第v个顶点出发递归地深度优先遍历图G。算法7.5
   int w;
   visited[v]=TRUE; // 设置访问标志为TRUE(已访问)
   VisitFunc(G.vexs[v]); // 访问第v个顶点
   for(w=FirstAdjVex(G,G.vexs[v]);w>=0;w=NextAdjVex(G,G.vexs[v],G.vexs[w]))
     if(!visited[w])
       DFS(G,w); // 对v的尚未访问的序号为w的邻接顶点递归调用DFS
 }

 void DFSTraverse(MGraph G,void(*Visit)(VertexType))
 { // 初始条件：图G存在，Visit是顶点的应用函数。算法7.4
   // 操作结果：从第1个顶点起，深度优先遍历图G，并对每个顶点调用函数Visit一次且仅一次
   int v;
   VisitFunc=Visit; // 使用全局变量VisitFunc，使DFS不必设函数指针参数
   for(v=0;v<G.vexnum;v++)
     visited[v]=FALSE; // 访问标志数组初始化(未被访问)
   for(v=0;v<G.vexnum;v++)
     if(!visited[v])
       DFS(G,v); // 对尚未访问的顶点v调用DFS
   printf("\n");
 }

 typedef VRType QElemType; // 队列元素类型
 #include"c3-2.h" // 链队列的结构，BFSTraverse()用
 #include"bo3-2.cpp" // 链队列的基本操作，BFSTraverse()用
 void BFSTraverse(MGraph G,void(*Visit)(VertexType))
 { // 初始条件：图G存在，Visit是顶点的应用函数。算法7.6
   // 操作结果：从第1个顶点起，按广度优先非递归遍历图G,并对每个顶点调用函数Visit一次且仅一次
   int v,u,w;
   LinkQueue Q; // 使用辅助队列Q和访问标志数组visited
   for(v=0;v<G.vexnum;v++)
     visited[v]=FALSE; // 置初值
   InitQueue(Q); // 置空的辅助队列Q
   for(v=0;v<G.vexnum;v++)
     if(!visited[v]) // v尚未访问
     {
       visited[v]=TRUE; // 设置访问标志为TRUE(已访问)
       Visit(G.vexs[v]);
       EnQueue(Q,v); // v入队列
       while(!QueueEmpty(Q)) // 队列不空
       {
	 DeQueue(Q,u); // 队头元素出队并置为u
	 for(w=FirstAdjVex(G,G.vexs[u]);w>=0;w=NextAdjVex(G,G.vexs[u],G.vexs[w]))
	   if(!visited[w]) // w为u的尚未访问的邻接顶点的序号
           {
             visited[w]=TRUE;
             Visit(G.vexs[w]);
             EnQueue(Q,w);
           }
       }
     }
   printf("\n");
 }

 void Display(MGraph G)
 { // 输出邻接矩阵存储表示的图G
   int i,j;
   char s[7];
   switch(G.kind)
   {
     case DG: strcpy(s,"有向图");
              break;
     case DN: strcpy(s,"有向网");
              break;
     case UDG:strcpy(s,"无向图");
              break;
     case UDN:strcpy(s,"无向网");
   }
   printf("%d个顶点%d条边或弧的%s。顶点依次是: ",G.vexnum,G.arcnum,s);
   for(i=0;i<G.vexnum;++i) // 输出G.vexs
     printf("%s ",G.vexs[i]);
   printf("\nG.arcs.adj:\n"); // 输出G.arcs.adj
   for(i=0;i<G.vexnum;i++)
   {
     for(j=0;j<G.vexnum;j++)
       printf("%11d",G.arcs[i][j].adj);
     printf("\n");
   }
   printf("G.arcs.info:\n"); // 输出G.arcs.info
   printf("顶点1(弧尾) 顶点2(弧头) 该边或弧的信息：\n");
   for(i=0;i<G.vexnum;i++)
     if(G.kind<2) // 有向
     {
       for(j=0;j<G.vexnum;j++)
         if(G.arcs[i][j].info)
           printf("%5s %11s     %s\n",G.vexs[i],G.vexs[j],G.arcs[i][j].info);
     } // 加括号为避免if-else对配错
     else // 无向,输出上三角
       for(j=i+1;j<G.vexnum;j++)
         if(G.arcs[i][j].info)
           printf("%5s %11s     %s\n",G.vexs[i],G.vexs[j],G.arcs[i][j].info);
 }