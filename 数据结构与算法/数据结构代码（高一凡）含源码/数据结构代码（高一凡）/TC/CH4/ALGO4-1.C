 /* algo4-1.c 实现算法4.6、4.7、4.8的程序 */
 #include"c1.h"
 #include"c4-1.h"
 #include"bo4-1.c"

 void get_next(SString T,int next[])
 { /* 求模式串T的next函数值并存入数组next。算法4.7 */
   int i=1,j=0;
   next[1]=0;
   while(i<T[0])
     if(j==0||T[i]==T[j])
     {
       ++i;
       ++j;
       next[i]=j;
     }
     else
       j=next[j];
 }

 void get_nextval(SString T,int nextval[])
 { /* 求模式串T的next函数修正值并存入数组nextval。算法4.8 */
   int i=1,j=0;
   nextval[1]=0;
   while(i<T[0])
     if(j==0||T[i]==T[j])
     {
       ++i;
       ++j;
       if(T[i]!=T[j])
	 nextval[i]=j;
       else
	 nextval[i]=nextval[j];
     }
     else
       j=nextval[j];
 }

 int Index_KMP(SString S,SString T,int pos,int next[])
 { /* 利用模式串T的next函数求T在主串S中第pos个字符之后的位置的KMP算法。 */
   /* 其中，T非空，1≤pos≤StrLength(S)。算法4.6 */
   int i=pos,j=1;
   while(i<=S[0]&&j<=T[0])
     if(j==0||S[i]==T[j]) /* 继续比较后继字符 */
     {
       ++i;
       ++j;
     }
     else /* 模式串向右移动 */
       j=next[j];
   if(j>T[0]) /* 匹配成功 */
     return i-T[0];
   else
     return 0;
 }

 void main()
 {
   int i,*p;
   SString s1,s2; /* 以教科书算法4.8之上的数据为例 */
   StrAssign(s1,"aaabaaaab");
   printf("主串为: ");
   StrPrint(s1);
   StrAssign(s2,"aaaab");
   printf("子串为: ");
   StrPrint(s2);
   p=(int*)malloc((StrLength(s2)+1)*sizeof(int)); /* 生成s2的next数组空间 */
   get_next(s2,p); /* 利用算法4.7，求得next数组，存于p中 */
   printf("子串的next数组为: ");
   for(i=1;i<=StrLength(s2);i++)
     printf("%d ",*(p+i));
   printf("\n");
   i=Index_KMP(s1,s2,1,p); /* 利用算法4.6求得串s2在s1中首次匹配的位置i */
   if(i)
     printf("主串和子串在第%d个字符处首次匹配\n",i);
   else
     printf("主串和子串匹配不成功\n");
   get_nextval(s2,p); /* 利用算法4.8，求得next数组，存于p中 */
   printf("子串的nextval数组为: ");
   for(i=1;i<=StrLength(s2);i++)
     printf("%d ",*(p+i));
   printf("\n");
   printf("主串和子串在第%d个字符处首次匹配\n",Index_KMP(s1,s2,1,p));
 }
