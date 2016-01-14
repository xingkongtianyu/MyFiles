package dsa.adt;

import dsa.strategy.Strategy;

public class Sorter {
	private Strategy strategy;
	public Sorter(Strategy strategy) {
		this.strategy = strategy;
	}
	
	//简单插入排序
	public void insertSort(Object[] r, int low, int high){
		for (int i=low+1; i<=high; i++)
			if (strategy.compare(r[i],r[i-1])<0){	//小于时，需将r[i]插入有序表
				Object temp = r[i];
				r[i] = r[i-1];
				int j=i-2;
				for (; j>=low&&strategy.compare(temp,r[j])<0; j--)
					r[j+1] = r[j];					//记录后移
				r[j+1] = temp;						//插入到正确位置
			}
	}
	
	//折半插入排序
	public void binInsertSort(Object[] r, int low, int high){
		for (int i=low+1; i<=high; i++){
				Object temp = r[i];					//保存待插入元素 
				int hi = i-1;  int lo = low;		//设置初始区间
				while (lo<=hi){						//折半确定插入位置
				int mid = (lo+hi)/2;
				if(strategy.compare(temp,r[mid])<0)
					hi = mid - 1;
				else lo = mid + 1;
			}
			for (int j=i-1;j>hi;j--) r[j+1] = r[j];	//移动元素
			r[hi+1] = temp;							//插入元素
		}//for
	}
	
	//希尔排序
	public void shellSort(Object[] r, int low, int high, int[] delta){
		for (int k=0;k<delta.length;k++)
			shellInsert(r, low, high, delta[k]);
	}
	private void shellInsert(Object[] r, int low, int high, int deltaK){
		for (int i=low+deltaK; i<=high; i++)
			if (strategy.compare(r[i],r[i-deltaK])<0){
				Object temp = r[i];
				int j = i-deltaK;
				for(; j>=low&&strategy.compare(temp,r[j])<0; j=j-deltaK)
					r[j+deltaK] = r[j];
				r[j+deltaK] = temp;
			}
	}
	
	//起泡排序
	public void bubbleSort(Object[] r, int low, int high){
		int n = high - low + 1;
		for (int i=1;i<n;i++)
			for (int j=low;j<=high-i;j++)
				if (strategy.compare(r[j],r[j+1])>0)
				{
					Object temp = r[j];
					r[j] = r[j+1];
					r[j+1] = temp;
				}
	}
	
	//快速排序
	public void quickSort(Object[] r, int low, int high){
		if (low<high){
			int pa = partition(r,low,high);
			quickSort(r,low,pa-1);
			quickSort(r,pa+1,high);
		}
	}
	private int partition(Object[] r, int low, int high){
		Object pivot = r[low];
		while (low<high){
			while(low<high&&strategy.compare(r[high],pivot)>=0) high--;
			r[low] = r[high];
			while(low<high&&strategy.compare(r[low],pivot)<=0) low++;
			r[high] = r[low];
		}
		r[low] = pivot;
		return low;
	}
	
	//选择排序
	public void selectSort(Object[] r, int low, int high){
		for (int k=low; k<high-1; k++){
			int min = k;
			for (int i=min+1; i<=high; i++)
				if (strategy.compare(r[i],r[min])<0) min = i;
			if (k!=min){
				Object temp = r[k];
				r[k] = r[min];
				r[min] = temp;
			}
		}
	}
	
	//堆排序
	public void heapSort(Object[] r){
		int n = r.length - 1;
		for (int i=n/2; i>=1; i--)
			heapAdjust(r,i,n);
		for (int i=n; i>1; i--){
			Object temp = r[1];
			r[1] = r[i];
			r[i] = temp;
			heapAdjust(r,1,i-1);
		}
	}
	private void heapAdjust(Object[] r, int low, int high){
		Object temp = r[low];
		for (int j=2*low; j<=high; j=j*2){
			if (j<high&&strategy.compare(r[j],r[j+1])<0) j++;
			if (strategy.compare(temp,r[j])>=0) break;
			r[low] = r[j];	low = j;
		}
		r[low] = temp;
	}
	
	//归并排序
	public void mergeSort(Object[] r, int low, int high){
    	if (low<high){
    		mergeSort(r,low,(high+low)/2);
    		mergeSort(r,(high+low)/2+1,high);
    		merge(r,low,(high+low)/2,high);
    	}
    	
    }
    private void merge(Object[] a, int p, int q, int r){
    	Object[] b = new Object[r-p+1];
    	int s = p;
    	int t = q+1;
    	int k = 0;
    	while (s<=q&&t<=r)
    		if (strategy.compare(a[s],a[t])<0)
    			b[k++] = a[s++];
    		else
    			b[k++] = a[t++];
    	while (s<=q) b[k++] = a[s++];
    	while (t<=r) b[k++] = a[t++];
    	for (int i=0; i<b.length; i++)
    		a[p+i] = b[i];
    }
    public void bottomUpSort(Object[] r, int low, int high){
    	int t= 1;
    	while (t<high-low+1){
    		int s = t;
    		t = 2 * s;
    		int i = low-1;
    		while (i+t<=high){
    			merge(r,i+1,i+s,i+t);
    			i = i + t;
    		}
    		if (i+s<high) merge(r,i+1,i+s,high);	
    	}
    }
    
	public static void main(String[] args){
		Sorter sorter = new Sorter(new dsa.strategy.DefaultStrategy());
		String[] r = {"26","53","48","01","03","38","32","15","09"};
		String[] s = {"12"};
		int[] del = {5,3,1};

		sorter.mergeSort(r,0,r.length-1);
		for (int i=0;i<r.length;i++)
			System.out.println(r[i]+"\t");
	}
}
