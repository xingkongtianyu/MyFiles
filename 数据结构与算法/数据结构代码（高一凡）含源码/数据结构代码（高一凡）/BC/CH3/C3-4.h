 // c3-4.h 队列的顺序存储结构(出队元素时不移动元素，只改变队头元素的位置)
 #define QUEUE_INIT_SIZE 10 // 队列存储空间的初始分配量
 #define QUEUE_INCREMENT 2 // 队列存储空间的分配增量
 struct SqQueue2
 {
   QElemType *base; // 初始化的动态分配存储空间
   int front; // 头指针，若队列不空,指向队列头元素
   int rear; // 尾指针，若队列不空,指向队列尾元素的下一个位置
   int queuesize; // 当前分配的存储容量(以sizeof(QElemType)为单位)
 };
