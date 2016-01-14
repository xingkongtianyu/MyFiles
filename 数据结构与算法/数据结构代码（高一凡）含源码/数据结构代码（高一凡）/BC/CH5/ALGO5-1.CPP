 // algo5-1.cpp 实现算法5.2的程序
 #include"c1.h"
 typedef int ElemType;
 #include"c5-2.h"
 #include"bo5-2.cpp"

 void FastTransposeSMatrix(TSMatrix M,TSMatrix &T)
 { // 快速求稀疏矩阵M的转置矩阵T。算法5.2改
   int p,q,t,col,*num,*cpot;
   num=(int *)malloc((M.nu+1)*sizeof(int)); // 存M每列(T每行)非零元素个数([0]不用)
   cpot=(int *)malloc((M.nu+1)*sizeof(int)); // 存T每行的下1个非零元素的存储位置([0]不用)
   T.mu=M.nu; // 给T的行、列数与非零元素个数赋值
   T.nu=M.mu;
   T.tu=M.tu;
   if(T.tu) // 是非零矩阵
   {
     for(col=1;col<=M.nu;++col)
       num[col]=0; // 计数器初值设为0
     for(t=1;t<=M.tu;++t) // 求M中每一列含非零元素个数
       ++num[M.data[t].j];
     cpot[1]=1; // T的第1行的第1个非零元在T.data中的序号为1
     for(col=2;col<=M.nu;++col)
       cpot[col]=cpot[col-1]+num[col-1]; // 求T的第col行的第1个非零元在T.data中的序号
     for(p=1;p<=M.tu;++p) // 从M的第1个元素开始
     {
       col=M.data[p].j; // 求得在M中的列数
       q=cpot[col]; // q指示M当前的元素在T中的序号
       T.data[q].i=M.data[p].j;
       T.data[q].j=M.data[p].i;
       T.data[q].e=M.data[p].e;
       ++cpot[col]; // T第col行的下1个非零元在T.data中的序号
     }
   }
   free(num);
   free(cpot);
 }

 void main()
 {
   TSMatrix A,B;
   printf("创建矩阵A: ");
   CreateSMatrix(A);
   PrintSMatrix1(A);
   FastTransposeSMatrix(A,B);
   printf("矩阵B(A的快速转置):\n");
   PrintSMatrix1(B);
 }