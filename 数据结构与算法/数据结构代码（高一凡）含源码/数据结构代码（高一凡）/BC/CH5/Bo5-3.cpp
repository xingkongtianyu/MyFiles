 // bo5-3.cpp 行逻辑链接稀疏矩阵(存储结构由c5-3.h定义)的基本操作(8个),包括算法5.3
 Status CreateSMatrix(RLSMatrix &M)
 { // 创建稀疏矩阵M
   int i,j;
   Triple T;
   Status k;
   printf("请输入矩阵的行数,列数,非零元素数：");
   scanf("%d,%d,%d",&M.mu,&M.nu,&M.tu);
   if(M.tu>MAX_SIZE||M.mu>MAX_RC)
     return ERROR;
   M.data[0].i=0; // 为以下比较做准备
   for(i=1;i<=M.tu;i++)
   {
     do
     {
       printf("请按行序顺序输入第%d个非零元素所在的行(1～%d),列(1～%d),元素值:",i,M.mu,M.nu);
       scanf("%d,%d,%d",&T.i,&T.j,&T.e);
       k=0;
       if(T.i<1||T.i>M.mu||T.j<1||T.j>M.nu) // 行、列超出范围
         k=1;
       if(T.i<M.data[i-1].i||T.i==M.data[i-1].i&&T.j<=M.data[i-1].j) // 没有按顺序输入非零元素
         k=1;
     }while(k); // 当输入有误，重新输入
     M.data[i]=T;
   }
   for(i=1;i<=M.mu;i++) // 给rpos[]赋初值0
     M.rpos[i]=0;
   for(i=1;i<=M.tu;i++) // 计算每行非零元素数并赋给rpos[]
     M.rpos[M.data[i].i]++;
   for(i=M.mu;i>=1;i--) // 计算rpos[]
   {
     M.rpos[i]=1; // 赋初值1
     for(j=i-1;j>=1;j--)
       M.rpos[i]+=M.rpos[j];
   }
   return OK;
 }

 void DestroySMatrix(RLSMatrix &M)
 { // 销毁稀疏矩阵M(使M为0行0列0个非零元素的矩阵)
   M.mu=M.nu=M.tu=0;
 }

 void PrintSMatrix(RLSMatrix M)
 { // 输出稀疏矩阵M
   int i;
   printf("%d行%d列%d个非零元素。\n",M.mu,M.nu,M.tu);
   printf("行  列  元素值\n");
   for(i=1;i<=M.tu;i++)
     printf("%2d%4d%8d\n",M.data[i].i,M.data[i].j,M.data[i].e);
   for(i=1;i<=M.mu;i++)
     printf("第%d行的第一个非零元素是本矩阵第%d个元素\n",i,M.rpos[i]);
 }

 void PrintSMatrix1(RLSMatrix M)
 { // 按矩阵形式输出M
   int i,j,k=1;
   Triple *p=M.data;
   p++; // p指向第1个非零元素
   for(i=1;i<=M.mu;i++)
   {
     for(j=1;j<=M.nu;j++)
       if(k<=M.tu&&p->i==i&&p->j==j) // p指向非零元，且p所指元素为当前处理元素
       {
         printf("%3d",p->e); // 输出p所指元素的值
         p++; // p指向下一个元素
         k++; // 计数器+1
       }
       else // p所指元素不是当前处理元素
         printf("%3d",0); // 输出0
     printf("\n");
   }
 }

 void CopySMatrix(RLSMatrix M,RLSMatrix &T)
 { // 由稀疏矩阵M复制得到T
   T=M;
 }

 Status AddSMatrix(RLSMatrix M,RLSMatrix N,RLSMatrix &Q)
 { // 求稀疏矩阵的和Q=M+N
   int k,p,q,tm,tn;
   if(M.mu!=N.mu||M.nu!=N.nu)
     return ERROR;
   Q.mu=M.mu; // Q矩阵行数
   Q.nu=M.nu; // Q矩阵列数
   Q.tu=0; // Q矩阵非零元素数初值
   for(k=1;k<=M.mu;++k) // 对于每一行，k指示行号
   {
     Q.rpos[k]=Q.tu+1; // Q矩阵第k行的第1个元素的位置
     p=M.rpos[k]; // p指示M矩阵第k行当前元素的序号
     q=N.rpos[k]; // q指示N矩阵第k行当前元素的序号
     if(k==M.mu) // 是最后一行
     {
       tm=M.tu+1; // tm，tn分别是p，q的上界
       tn=N.tu+1;
     }
     else
     {
       tm=M.rpos[k+1];
       tn=N.rpos[k+1];
     }
     while(p<tm&&q<tn) // M，N矩阵均有第k行元素未处理
       if(M.data[p].j==N.data[q].j) // M矩阵当前元素的列=N矩阵当前元素的列
       {
	 if(M.data[p].e+N.data[q].e!=0) // 和不为0，存入Q
	 {
	   Q.data[++Q.tu]=M.data[p];
	   Q.data[Q.tu].e+=N.data[q].e;
	 }
	 p++;
	 q++;
       }
       else if(M.data[p].j<N.data[q].j) // M矩阵当前元素的列<N矩阵当前元素的列
	 Q.data[++Q.tu]=M.data[p++]; // 将M的当前值赋给Q
       else // M矩阵当前元素的列>N矩阵当前元素的列
         Q.data[++Q.tu]=N.data[q++]; // 将N的当前值赋给Q
     while(p<tm) // M矩阵还有第k行的元素未处理
       Q.data[++Q.tu]=M.data[p++]; // 将M的当前值赋给Q
     while(q<tn) // N矩阵还有k行的元素未处理
       Q.data[++Q.tu]=N.data[q++]; // 将N的当前值赋给Q
   }
   if(Q.tu>MAX_SIZE)
     return ERROR;
   else
     return OK;
 }

 Status SubtSMatrix(RLSMatrix M,RLSMatrix N,RLSMatrix &Q)
 { // 求稀疏矩阵的差Q=M-N
   int i;
   if(M.mu!=N.mu||M.nu!=N.nu)
     return ERROR;
   for(i=1;i<=N.tu;++i) // 对于N的每一元素，其值乘以-1
     N.data[i].e*=-1;
   AddSMatrix(M,N,Q); // Q=M+(-N)
   return OK;
 }

 Status MultSMatrix(RLSMatrix M,RLSMatrix N,RLSMatrix &Q)
 { // 求稀疏矩阵乘积Q=M×N。算法5.3改
   int arow,brow,p,q,ccol,ctemp[MAX_RC+1],t,tp;
   if(M.nu!=N.mu) // 矩阵M的列数应和矩阵N的行数相等
     return ERROR;
   Q.mu=M.mu; // Q初始化
   Q.nu=N.nu;
   Q.tu=0;
   if(M.tu*N.tu==0) // M和N至少有一个是零矩阵
     return ERROR;
   for(arow=1;arow<=M.mu;++arow)
   { // 从M的第一行开始，到最后一行，arow是M的当前行
     for(ccol=1;ccol<=Q.nu;++ccol)
       ctemp[ccol]=0; // Q的当前行的各列元素累加器清零
     Q.rpos[arow]=Q.tu+1; // Q当前行的第1个元素位于上1行最后1个元素之后
     if(arow<M.mu)
       tp=M.rpos[arow+1];
     else
       tp=M.tu+1; // 给最后1行设界
     for(p=M.rpos[arow];p<tp;++p)
     { // 对M当前行中每一个非零元
       brow=M.data[p].j; // 找到对应元在N中的行号(M当前元的列号)
       if(brow<N.mu)
         t=N.rpos[brow+1];
       else
         t=N.tu+1; // 给最后1行设界
       for(q=N.rpos[brow];q<t;++q)
       {
         ccol=N.data[q].j; // 乘积元素在Q中列号
         ctemp[ccol]+=M.data[p].e*N.data[q].e;
       }
     } // 求得Q中第arow行的非零元
     for(ccol=1;ccol<=Q.nu;++ccol) // 压缩存储该行非零元
       if(ctemp[ccol]!=0)
       {
         if(++Q.tu>MAX_SIZE)
           return ERROR;
         Q.data[Q.tu].i=arow;
         Q.data[Q.tu].j=ccol;
         Q.data[Q.tu].e=ctemp[ccol];
       }
   }
   return OK;
 }

 void TransposeSMatrix(RLSMatrix M,RLSMatrix &T)
 { // 求稀疏矩阵M的转置矩阵T
   int p,q,t,col,*num;
   num=(int *)malloc((M.nu+1)*sizeof(int));
   T.mu=M.nu;
   T.nu=M.mu;
   T.tu=M.tu;
   if(T.tu)
   {
     for(col=1;col<=M.nu;++col)
       num[col]=0;  // 设初值
     for(t=1;t<=M.tu;++t) // 求M中每一列非零元个数
       ++num[M.data[t].j];
     T.rpos[1]=1;
     for(col=2;col<=M.nu;++col) // 求M中第col中第一个非零元在T.data中的序号
       T.rpos[col]=T.rpos[col-1]+num[col-1];
     for(col=1;col<=M.nu;++col)
       num[col]=T.rpos[col];
     for(p=1;p<=M.tu;++p)
     {
       col=M.data[p].j;
       q=num[col];
       T.data[q].i=M.data[p].j;
       T.data[q].j=M.data[p].i;
       T.data[q].e=M.data[p].e;
       ++num[col];
     }
   }
   free(num);
 }
