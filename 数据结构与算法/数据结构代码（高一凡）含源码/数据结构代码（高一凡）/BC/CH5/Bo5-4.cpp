 // bo5-4.cpp 稀疏矩阵的十字链表存储(存储结构由c5-4.h定义)的基本操作(9个)，包括算法5.4

 void InitSMatrix(CrossList &M)
 { // 初始化M(CrossList类型的变量必须初始化，否则创建、复制矩阵将出错)。加
   M.rhead=M.chead=NULL;
   M.mu=M.nu=M.tu=0;
 }

 void InitSMatrixList(CrossList &M)
 { // 初始化十字链表表头指针向量。加
   int i;
   if(!(M.rhead=(OLink*)malloc((M.mu+1)*sizeof(OLink)))) // 生成行表头指针向量
     exit(OVERFLOW);
   if(!(M.chead=(OLink*)malloc((M.nu+1)*sizeof(OLink)))) // 生成列表头指针向量
     exit(OVERFLOW);
   for(i=1;i<=M.mu;i++) // 初始化矩阵T的行表头指针向量，各行链表为空
     M.rhead[i]=NULL;
   for(i=1;i<=M.nu;i++) // 初始化矩阵T的列表头指针向量，各列链表为空
     M.chead[i]=NULL;
 }

 void InsertAscend(CrossList &M,OLink p)
 { // 初始条件：稀疏矩阵M存在,p指向的结点存在。操作结果：按行列升序将p所指结点插入M
   OLink q=M.rhead[p->i]; // q指向待插行表
   if(!q||p->j<q->j) // 待插的行表空或p所指结点的列值小于首结点的列值
   {
     p->right=M.rhead[p->i]; // 插在表头
     M.rhead[p->i]=p;
   }
   else
   {
     while(q->right&&q->right->j<p->j) // q所指不是尾结点且q的下一结点的列值小于p所指结点的列值
       q=q->right; // q向后移
     p->right=q->right; // 将p插在q所指结点之后
     q->right=p;
   }
   q=M.chead[p->j]; // q指向待插列表
   if(!q||p->i<q->i) // 待插的列表空或p所指结点的行值小于首结点的行值
   {
     p->down=M.chead[p->j]; // 插在表头
     M.chead[p->j]=p;
   }
   else
   {
     while(q->down&&q->down->i<p->i) // q所指不是尾结点且q的下一结点的行值小于p所指结点的行值
       q=q->down; // q向下移
     p->down=q->down; // 将p插在q所指结点之下
     q->down=p;
   }
   M.tu++;
 }

 void DestroySMatrix(CrossList &M)
 { // 初始条件：稀疏矩阵M存在。操作结果：销毁稀疏矩阵M
   int i;
   OLink p,q;
   for(i=1;i<=M.mu;i++) // 按行释放结点
   {
     p=*(M.rhead+i);
     while(p)
     {
       q=p;
       p=p->right;
       free(q);
     }
   }
   free(M.rhead);
   free(M.chead);
   InitSMatrix(M);
 }

 void CreateSMatrix(CrossList &M)
 { // 创建稀疏矩阵M，采用十字链表存储表示。算法5.4改
   int i,k;
   OLink p;
   if(M.rhead)
     DestroySMatrix(M);
   printf("请输入稀疏矩阵的行数 列数 非零元个数: ");
   scanf("%d%d%d",&M.mu,&M.nu,&i);
   InitSMatrixList(M); // 初始化M的表头指针向量
   printf("请按任意次序输入%d个非零元的行 列 元素值:\n",M.tu);
   for(k=0;k<i;k++)
   {
     p=(OLink)malloc(sizeof(OLNode)); // 生成结点
     if(!p)
       exit(OVERFLOW);
     scanf("%d%d%d",&p->i,&p->j,&p->e); // 给结点的3个成员赋值
     InsertAscend(M,p); // 将结点p按行列值升序插到矩阵M中
   }
 }

 void PrintSMatrix(CrossList M)
 { // 初始条件：稀疏矩阵M存在。操作结果：按行或按列输出稀疏矩阵M
   int i,j;
   OLink p;
   printf("%d行%d列%d个非零元素\n",M.mu,M.nu,M.tu);
   printf("请输入选择(1.按行输出 2.按列输出): ");
   scanf("%d",&i);
   switch(i)
   {
     case 1: for(j=1;j<=M.mu;j++)
             {
               p=M.rhead[j];
               while(p)
               {
                 cout<<p->i<<"行"<<p->j<<"列值为"<<p->e<<endl;
                 p=p->right;
               }
             }
             break;
     case 2: for(j=1;j<=M.nu;j++)
	     {
	       p=M.chead[j];
               while(p)
               {
                 cout<<p->i<<"行"<<p->j<<"列值为"<<p->e<<endl;
                 p=p->down;
               }
             }
   }
 }

 void PrintSMatrix1(CrossList M)
 { // 按矩阵形式输出M
   int i,j;
   OLink p;
   for(i=1;i<=M.mu;i++)
   { // 从第1行到最后1行
     p=M.rhead[i]; // p指向该行的第1个非零元素
     for(j=1;j<=M.nu;j++) // 从第1列到最后1列
       if(!p||p->j!=j) // 已到该行表尾或当前结点的列值不等于当前列值
         printf("%-3d",0); // 输出0
       else
       {
         printf("%-3d",p->e);
         p=p->right;
       }
     printf("\n");
   }
 }

 void CopySMatrix(CrossList M,CrossList &T)
 { // 初始条件：稀疏矩阵M存在。操作结果：由稀疏矩阵M复制得到T
   int i;
   OLink p,q;
   if(T.rhead) // 矩阵T存在
     DestroySMatrix(T);
   T.mu=M.mu;
   T.nu=M.nu;
   InitSMatrixList(T); // 初始化T的表头指针向量
   for(i=1;i<=M.mu;i++) // 按行复制
   {
     p=M.rhead[i]; // p指向i行链表头
     while(p) // 没到行尾
     {
       if(!(q=(OLNode*)malloc(sizeof(OLNode)))) // 生成结点q
         exit(OVERFLOW);
       *q=*p; // 给结点q赋值
       InsertAscend(T,q); // 将结点q按行列值升序插到矩阵T中
       p=p->right;
     }
   }
 }

 int comp(int c1,int c2)
 { // AddSMatrix函数要用到，另加
   if(c1<c2)
     return -1;
   if(c1==c2)
     return 0;
   return 1;
 }

 void AddSMatrix(CrossList M,CrossList N,CrossList &Q)
 { // 初始条件：稀疏矩阵M与N的行数和列数对应相等。操作结果：求稀疏矩阵的和Q=M+N
   int i;
   OLink pq,pm,pn;
   if(M.mu!=N.mu||M.nu!=N.nu)
   {
     printf("两个矩阵不是同类型的,不能相加\n");
     exit(OVERFLOW);
   }
   Q.mu=M.mu; // 初始化Q矩阵
   Q.nu=M.nu;
   Q.tu=0; // Q矩阵元素个数的初值为0
   InitSMatrixList(Q); // 初始化Q的表头指针向量
   for(i=1;i<=M.mu;i++) // 按行的顺序相加
   {
     pm=M.rhead[i]; // pm指向矩阵M的第i行的第1个结点
     pn=N.rhead[i]; // pn指向矩阵N的第i行的第1个结点
     while(pm&&pn) // pm和pn均不空
     {
       pq=(OLink)malloc(sizeof(OLNode)); // 生成矩阵Q的结点
       switch(comp(pm->j,pn->j))
       {
	 case -1: *pq=*pm; // M的列<N的列，将矩阵M的当前元素值赋给pq
		  InsertAscend(Q,pq); // 将结点pq按行列值升序插到矩阵Q中
		  pm=pm->right; // 指针向后移
		  break;
	 case  0: *pq=*pm; // M、N矩阵的列相等，元素值相加
		  pq->e+=pn->e;
                  if(pq->e!=0) // 和为非零元素
                    InsertAscend(Q,pq); // 将结点pq按行列值升序插到矩阵Q中
                  else
                    free(pq); // 释放结点
                  pm=pm->right; // 指针向后移
                  pn=pn->right;
                  break;
         case  1: *pq=*pn; // M的列>N的列，将矩阵N的当前元素值赋给pq
                  InsertAscend(Q,pq); // 将结点pq按行列值升序插到矩阵Q中
                  pn=pn->right; // 指针向后移
       }
     }
     while(pm) // pn=NULL
     {
       pq=(OLink)malloc(sizeof(OLNode)); // 生成矩阵Q的结点
       *pq=*pm; // M的列<N的列，将矩阵M的当前元素值赋给pq
       InsertAscend(Q,pq); // 将结点pq按行列值升序插到矩阵Q中
       pm=pm->right; // 指针向后移
     }
     while(pn) // pm=NULL
     {
       pq=(OLink)malloc(sizeof(OLNode)); // 生成矩阵Q的结点
       *pq=*pn; // M的列>N的列，将矩阵N的当前元素值赋给pq
       InsertAscend(Q,pq); // 将结点pq按行列值升序插到矩阵Q中
       pn=pn->right; // 指针向后移
     }
   }
   if(Q.tu==0) // Q矩阵元素个数为0
     DestroySMatrix(Q); // 销毁矩阵Q
 }

 void SubtSMatrix(CrossList M,CrossList N,CrossList &Q)
 { // 初始条件：稀疏矩阵M与N的行数和列数对应相等。操作结果：求稀疏矩阵的差Q=M-N
   int i;
   OLink pq,pm,pn;
   if(M.mu!=N.mu||M.nu!=N.nu)
   {
     printf("两个矩阵不是同类型的,不能相减\n");
     exit(OVERFLOW);
   }
   Q.mu=M.mu; // 初始化Q矩阵
   Q.nu=M.nu;
   Q.tu=0; // Q矩阵元素个数的初值为0
   InitSMatrixList(Q); // 初始化Q的表头指针向量
   for(i=1;i<=M.mu;i++) // 按行的顺序相减
   {
     pm=M.rhead[i]; // pm指向矩阵M的第i行的第1个结点
     pn=N.rhead[i]; // pn指向矩阵N的第i行的第1个结点
     while(pm&&pn) // pm和pn均不空
     {
       pq=(OLink)malloc(sizeof(OLNode)); // 生成矩阵Q的结点
       switch(comp(pm->j,pn->j))
       {
	 case -1: *pq=*pm; // M的列<N的列，将矩阵M的当前元素值赋给pq
		  InsertAscend(Q,pq); // 将结点pq按行列值升序插到矩阵Q中
		  pm=pm->right; // 指针向后移
		  break;
	 case  0: *pq=*pm; // M、N矩阵的列相等，元素值相减
                  pq->e-=pn->e;
                  if(pq->e!=0) // 差为非零元素
                    InsertAscend(Q,pq); // 将结点pq按行列值升序插到矩阵Q中
                  else
                    free(pq); // 释放结点
                  pm=pm->right; // 指针向后移
                  pn=pn->right;
                  break;
         case  1: *pq=*pn; // M的列>N的列，将矩阵N的当前元素值赋给pq
                  pq->e*=-1; // 求反
                  InsertAscend(Q,pq); // 将结点pq按行列值升序插到矩阵Q中
                  pn=pn->right; // 指针向后移
       }
     }
     while(pm) // pn=NULL
     {
       pq=(OLink)malloc(sizeof(OLNode)); // 生成矩阵Q的结点
       *pq=*pm; // M的列<N的列，将矩阵M的当前元素值赋给pq
       InsertAscend(Q,pq); // 将结点pq按行列值升序插到矩阵Q中
       pm=pm->right; // 指针向后移
     }
     while(pn) // pm=NULL
     {
       pq=(OLink)malloc(sizeof(OLNode)); // 生成矩阵Q的结点
       *pq=*pn; // M的列>N的列，将矩阵N的当前元素值赋给pq
       pq->e*=-1; // 求反
       InsertAscend(Q,pq); // 将结点pq按行列值升序插到矩阵Q中
       pn=pn->right; // 指针向后移
     }
   }
   if(Q.tu==0) // Q矩阵元素个数为0
     DestroySMatrix(Q); // 销毁矩阵Q
 }

 void MultSMatrix(CrossList M,CrossList N,CrossList &Q)
 { // 初始条件：稀疏矩阵M的列数等于N的行数。操作结果：求稀疏矩阵乘积Q=M×N
   int i,j,e;
   OLink pq,pm,pn;
   InitSMatrix(Q);
   Q.mu=M.mu;
   Q.nu=N.nu;
   Q.tu=0;
   InitSMatrixList(Q); // 初始化Q的表头指针向量
   for(i=1;i<=Q.mu;i++)
     for(j=1;j<=Q.nu;j++)
     {
       pm=M.rhead[i];
       pn=N.chead[j];
       e=0;
       while(pm&&pn)
         switch(comp(pn->i,pm->j))
         {
           case -1: pn=pn->down; // 列指针后移
                    break;
           case  0: e+=pm->e*pn->e; // 乘积累加
		    pn=pn->down; // 行列指针均后移
                    pm=pm->right;
                    break;
           case  1: pm=pm->right; // 行指针后移
         }
       if(e) // 值不为0
       {
         pq=(OLink)malloc(sizeof(OLNode)); // 生成结点
         if(!pq) // 生成结点失败
           exit(OVERFLOW);
         pq->i=i; // 给结点赋值
         pq->j=j;
         pq->e=e;
         InsertAscend(Q,pq); // 将结点pq按行列值升序插到矩阵Q中
       }
     }
   if(Q.tu==0) // Q矩阵元素个数为0
     DestroySMatrix(Q); // 销毁矩阵Q
 }

 void TransposeSMatrix(CrossList M,CrossList &T)
 { // 初始条件：稀疏矩阵M存在。操作结果：求稀疏矩阵M的转置矩阵T
   int u,i;
   OLink *head,p,q,r;
   CopySMatrix(M,T); // T=M
   u=T.mu; // 交换T.mu和T.nu
   T.mu=T.nu;
   T.nu=u;
   head=T.rhead; // 交换T.rhead和T.chead
   T.rhead=T.chead;
   T.chead=head;
   for(u=1;u<=T.mu;u++) // 对T的每一行
   {
     p=T.rhead[u]; // p为行表头
     while(p) // 没到表尾，对T的每一结点
     {
       q=p->down; // q指向下一个结点
       i=p->i; // 交换.i和.j
       p->i=p->j;
       p->j=i;
       r=p->down; // 交换.down和.right
       p->down=p->right;
       p->right=r;
       p=q; // p指向下一个结点
     }
   }
 }
