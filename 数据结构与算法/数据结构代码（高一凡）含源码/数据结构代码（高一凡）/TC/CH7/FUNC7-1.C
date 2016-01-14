 /* func7-1.c algo7-4.c和algo7-5.c要调用 */
 void FindInDegree(ALGraph G,int indegree[])
 { /* 求顶点的入度，算法7.12、7.13调用 */
   int i;
   ArcNode *p;
   for(i=0;i<G.vexnum;i++)
     indegree[i]=0; /* 赋初值 */
   for(i=0;i<G.vexnum;i++)
   {
     p=G.vertices[i].firstarc;
     while(p)
     {
       indegree[p->data.adjvex]++;
       p=p->nextarc;
     }
   }
 }
