 /* algo7-5.c 求关键路径。实现算法7.13、7.14的程序 */
 #include"c1.h"
 #define MAX_NAME 5 /* 顶点字符串的最大长度+1 */
 typedef int InfoType;
 typedef char VertexType[MAX_NAME]; /* 字符串类型 */
 #include"c7-21.h"
 #include"bo7-2.c"
 #include"func7-1.c"

 int ve[MAX_VERTEX_NUM]; /* 事件最早发生时间，全局变量(用于算法7.13和算法7.14) */

 typedef int SElemType; /* 栈元素类型 */
 #include"c3-1.h" /* 顺序栈的存储结构 */
 #include"bo3-1.c" /* 顺序栈的基本操作 */
 Status TopologicalOrder(ALGraph G,SqStack *T)
 { /* 算法7.13 有向网G采用邻接表存储结构，求各顶点事件的最早发生时间ve(全局变量)。T为拓扑序列 */
   /* 顶点栈,S为零入度顶点栈。若G无回路，则用栈T返回G的一个拓扑序列,且函数值为OK,否则为ERROR */
   int i,k,count=0; /* 已入栈顶点数，初值为0 */
   int indegree[MAX_VERTEX_NUM]; /* 入度数组，存放各顶点当前入度数 */
   SqStack S;
   ArcNode *p;
   FindInDegree(G,indegree); /* 对各顶点求入度indegree[]，在func7-1.c中 */
   InitStack(&S); /* 初始化零入度顶点栈S */
   printf("拓扑序列：");
   for(i=0;i<G.vexnum;++i) /* 对所有顶点i */
     if(!indegree[i]) /* 若其入度为0 */
       Push(&S,i); /* 将i入零入度顶点栈S */
   InitStack(T); /* 初始化拓扑序列顶点栈 */
   for(i=0;i<G.vexnum;++i) /* 初始化ve[]=0(最小值，先假定每个事件都不受其他事件约束) */
     ve[i]=0;
   while(!StackEmpty(S)) /* 当零入度顶点栈S不空 */
   {
     Pop(&S,&i); /* 从栈S将已拓扑排序的顶点j弹出 */
     printf("%s ",G.vertices[i].data);
     Push(T,i); /* j号顶点入逆拓扑排序栈T(栈底元素为拓扑排序的第1个元素) */
     ++count; /* 对入栈T的顶点计数 */
     for(p=G.vertices[i].firstarc;p;p=p->nextarc)
     { /* 对i号顶点的每个邻接点 */
       k=p->data.adjvex; /* 其序号为k */
       if(--indegree[k]==0) /* k的入度减1，若减为0，则将k入栈S */
	 Push(&S,k);
       if(ve[i]+*(p->data.info)>ve[k]) /* *(p->data.info)是<i,k>的权值 */
	 ve[k]=ve[i]+*(p->data.info); /* 顶点k事件的最早发生时间要受其直接前驱顶点i事件的 */
     }                  /* 最早发生时间和<i,k>的权值约束。由于i已拓扑有序，故ve[i]不再改变 */
   }
   if(count<G.vexnum)
   {
     printf("此有向网有回路\n");
     return ERROR;
   }
   else
     return OK;
 }

 Status CriticalPath(ALGraph G)
 { /* 算法7.14 G为有向网，输出G的各项关键活动 */
   int vl[MAX_VERTEX_NUM]; /* 事件最迟发生时间 */
   SqStack T;
   int i,j,k,ee,el,dut;
   ArcNode *p;
   if(!TopologicalOrder(G,&T)) /* 产生有向环 */
     return ERROR;
   j=ve[0]; /* j的初值 */
   for(i=1;i<G.vexnum;i++)
     if(ve[i]>j)
       j=ve[i]; /* j=Max(ve[]) 完成点的最早发生时间 */
   for(i=0;i<G.vexnum;i++) /* 初始化顶点事件的最迟发生时间 */
     vl[i]=j; /* 为完成点的最早发生时间(最大值) */
   while(!StackEmpty(T)) /* 按拓扑逆序求各顶点的vl值 */
     for(Pop(&T,&j),p=G.vertices[j].firstarc;p;p=p->nextarc)
     { /* 弹出栈T的元素,赋给j,p指向j的后继事件k,事件k的最迟发生时间已确定(因为是逆拓扑排序) */
       k=p->data.adjvex;
       dut=*(p->data.info); /* dut=<j,k>的权值 */
       if(vl[k]-dut<vl[j])
	 vl[j]=vl[k]-dut; /* 事件j的最迟发生时间要受其直接后继事件k的最迟发生时间 */
     }                    /* 和<j,k>的权值约束。由于k已逆拓扑有序，故vl[k]不再改变 */
   printf("\ni ve[i] vl[i]\n");
   for(i=0;i<G.vexnum;i++) /* 初始化顶点事件的最迟发生时间 */
   {
     printf("%d   %d     %d",i,ve[i],vl[i]);
     if(ve[i]==vl[i])
       printf(" 关键路径经过的顶点");
     printf("\n");
   }
   printf("j   k  权值  ee  el\n");
   for(j=0;j<G.vexnum;++j) /* 求ee，el和关键活动 */
     for(p=G.vertices[j].firstarc;p;p=p->nextarc)
     {
       k=p->data.adjvex;
       dut=*(p->data.info); /* dut=<j,k>的权值 */
       ee=ve[j]; /* ee=活动<j,k>的最早开始时间(在j点) */
       el=vl[k]-dut; /* el=活动<j,k>的最迟开始时间(在j点) */
       printf("%s→%s %3d %3d %3d ",G.vertices[j].data,G.vertices[k].data,dut,ee,el);
       /* 输出各边的参数 */
       if(ee==el) /* 是关键活动 */
	 printf("关键活动");
       printf("\n");
     }
   return OK;
 }

 void main()
 {
   ALGraph h;
   printf("请选择有向网\n");
   CreateGraph(&h); /* 构造有向网h，在bo7-2.c中 */
   Display(h); /* 输出有向网h，在bo7-2.c中 */
   CriticalPath(h); /* 求h的关键路径 */
 }
