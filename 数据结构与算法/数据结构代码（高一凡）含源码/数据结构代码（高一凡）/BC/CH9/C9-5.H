 // c9-5.h Trie键树类型
 #define MAX_KEY_LEN 16 // 关键字的最大长度，同c9-4.h
 struct KeysType // 关键字类型，同c9-4.h
 {
   char ch[MAX_KEY_LEN]; // 关键字
   int num; // 关键字长度
 };

 struct Record // 记录类型，同c9-4.h
 {
   KeysType key; // 关键字
   Others others; // 其它部分(由主程定义)
 };

 enum NodeKind{LEAF,BRANCH}; // 结点种类：{叶子,分支}，同c9-4.h

 typedef struct TrieNode // Trie键树类型
 {
   NodeKind kind;
   union
   {
     struct // 叶子结点
     {
       KeysType K;
       Record *infoptr;
     }lf;
     struct // 分支结点
     {
       TrieNode *ptr[LENGTH]; // LENGTH为结点的最大度+1，在主程定义
     //  int num; 改
     }bh;
   };
 }TrieNode,*TrieTree;
