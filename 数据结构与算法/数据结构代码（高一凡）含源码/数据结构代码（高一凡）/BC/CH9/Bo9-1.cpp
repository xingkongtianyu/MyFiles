 // bo9-1.cpp 静态查找表(顺序表和有序表)的基本操作(7个)，包括算法9.1、9.2
 void Creat_Seq(SSTable &ST,ElemType r[],int n)
 { // 操作结果：由含n个数据元素的数组r构造静态顺序查找表ST
   int i;
   ST.elem=(ElemType*)calloc(n+1,sizeof(ElemType)); // 动态生成n+1个数据元素空间(0号单元不用)
   if(!ST.elem)
     exit(ERROR);
   for(i=1;i<=n;i++)
     ST.elem[i]=r[i-1]; // 将数组r的值依次赋给ST
   ST.length=n;
 }

 void Ascend(SSTable &ST)
 { // 重建静态查找表为按关键字非降序排序
   int i,j,k;
   for(i=1;i<ST.length;i++)
   {
     k=i;
     ST.elem[0]=ST.elem[i]; // 待比较值存[0]单元
     for(j=i+1;j<=ST.length;j++)
       if LT(ST.elem[j].key,ST.elem[0].key)
       {
         k=j;
         ST.elem[0]=ST.elem[j];
       }
     if(k!=i) // 有更小的值则交换
     {
       ST.elem[k]=ST.elem[i];
       ST.elem[i]=ST.elem[0];
     }
   }
 }

 void Creat_Ord(SSTable &ST,ElemType r[],int n)
 { // 操作结果：由含n个数据元素的数组r构造按关键字非降序查找表ST
   Creat_Seq(ST,r,n); // 建立无序的查找表ST
   Ascend(ST); // 将无序的查找表ST重建为按关键字非降序查找表
 }

 Status Destroy(SSTable &ST)
 { // 初始条件：静态查找表ST存在。操作结果：销毁表ST
   free(ST.elem);
   ST.elem=NULL;
   ST.length=0;
   return OK;
 }

 int Search_Seq(SSTable ST,KeyType key)
 { // 在顺序表ST中顺序查找其关键字等于key的数据元素。若找到，则返回
   // 该元素在表中的位置，否则返回0。算法9.1
   int i;
   ST.elem[0].key=key; // 哨兵
   for(i=ST.length;!EQ(ST.elem[i].key,key);--i); // 从后往前找
   return i; // 找不到时，i为0
 }

 int Search_Bin(SSTable ST,KeyType key)
 { // 在有序表ST中折半查找其关键字等于key的数据元素。若找到，则返回
   // 该元素在表中的位置，否则返回0。算法9.2
   int low,high,mid;
   low=1; // 置区间初值
   high=ST.length;
   while(low<=high)
   {
     mid=(low+high)/2;
     if EQ(key,ST.elem[mid].key)  // 找到待查元素
       return mid;
     else if LT(key,ST.elem[mid].key)
       high=mid-1; // 继续在前半区间进行查找
     else
       low=mid+1; // 继续在后半区间进行查找
   }
   return 0; // 顺序表中不存在待查元素
 }

 void Traverse(SSTable ST,void(*Visit)(ElemType))
 { // 初始条件：静态查找表ST存在，Visit()是对元素操作的应用函数
   // 操作结果：按顺序对ST的每个元素调用函数Visit()一次且仅一次
   ElemType *p;
   int i;
   p=++ST.elem; // p指向第一个元素
   for(i=1;i<=ST.length;i++)
     Visit(*p++);
 }
