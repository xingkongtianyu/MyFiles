 // func6-1.cpp algo6-1.cpp和algo6-2.cpp要调用
 int min(HuffmanTree t,int i)
 { // 返回i个结点中权值最小的树的根结点序号，函数select()调用
   int j,flag;
   unsigned int k=UINT_MAX; // 取k为不小于可能的值(无符号整型最大值)
   for(j=1;j<=i;j++)
     if(t[j].weight<k&&t[j].parent==0) // t[j]是树的根结点
       k=t[j].weight,flag=j;
   t[flag].parent=1; // 给选中的根结点的双亲赋1，避免第2次查找该结点
   return flag;
 }

 void select(HuffmanTree t,int i,int &s1,int &s2)
 { // 在i个结点中选择2个权值最小的树的根结点序号，s1为其中序号小的那个
   int j;
   s1=min(t,i);
   s2=min(t,i);
   if(s1>s2)
   {
     j=s1;
     s1=s2;
     s2=j;
   }
 }
